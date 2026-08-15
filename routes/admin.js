/**
 * routes/admin.js — the control panel at /admin
 *
 * Log in with the ADMIN_USER / ADMIN_PASSWORD from your .env file.
 * Sections: Homepage text · Images · Pages · Blog · Team · Contact details · Messages
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { db, S, IMG } = require('../db');

const router = express.Router();

/* ---- file uploads (pictures) ---- */
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'))
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype))
});

/* ---- login ---- */
router.get('/login', (req, res) => res.render('admin/login', { error: null }));

router.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const ok = req.body.user === (process.env.ADMIN_USER || 'admin') &&
             req.body.password === (process.env.ADMIN_PASSWORD || 'change-this-password');
  if (!ok) return res.status(401).render('admin/login', { error: 'Wrong user name or password.' });
  req.session.admin = true;
  res.redirect('/admin');
});

router.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/admin/login')));

router.use((req, res, next) => {
  if (req.session && req.session.admin) return next();
  res.redirect('/admin/login');
});

const unread = () => db.prepare('SELECT COUNT(*) n FROM messages WHERE is_read = 0').get().n;
router.use((req, res, next) => { res.locals.unread = unread(); res.locals.section = req.path.split('/')[1] || 'home'; next(); });

/* ---- dashboard ---- */
router.get('/', (req, res) => res.render('admin/dashboard', {
  counts: {
    posts: db.prepare('SELECT COUNT(*) n FROM posts').get().n,
    team: db.prepare('SELECT COUNT(*) n FROM team').get().n,
    messages: db.prepare('SELECT COUNT(*) n FROM messages').get().n,
    unread: res.locals.unread
  }
}));

/* ---- homepage + contact texts ---- */
router.get('/text', (req, res) => res.render('admin/text', { rows: S.all(), saved: 'saved' in req.query }));
router.post('/text', (req, res) => {
  for (const row of S.all()) {
    S.set.run(req.body['de_' + row.key] ?? row.value_de, req.body['en_' + row.key] ?? row.value_en, row.key);
  }
  res.redirect('/admin/text?saved=1');
});

/* ---- images ---- */
router.get('/images', (req, res) => res.render('admin/images', { rows: IMG.all(), saved: 'saved' in req.query }));
router.post('/images/:key', upload.single('file'), (req, res) => {
  if (req.file) IMG.set.run('/uploads/' + req.file.filename, req.params.key);
  res.redirect('/admin/images?saved=1');
});

/* ---- pages ---- */
router.get('/pages', (req, res) => res.render('admin/pages', { rows: db.prepare('SELECT * FROM pages ORDER BY sort, slug').all() }));
router.get('/pages/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
  if (!row) return res.redirect('/admin/pages');
  res.render('admin/page-edit', { row, saved: 'saved' in req.query });
});
router.post('/pages/:slug', (req, res) => {
  const b = req.body;
  db.prepare('UPDATE pages SET title_de=?,title_en=?,intro_de=?,intro_en=?,body_de=?,body_en=? WHERE slug=?')
    .run(b.title_de, b.title_en, b.intro_de, b.intro_en, b.body_de, b.body_en, req.params.slug);
  res.redirect('/admin/pages/' + req.params.slug + '?saved=1');
});

/* ---- blog ---- */
const slugify = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'post-' + Date.now();

router.get('/blog', (req, res) => res.render('admin/blog', { rows: db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all() }));
router.get('/blog/new', (req, res) => res.render('admin/post-edit', { row: { published: 1 }, isNew: true }));
router.get('/blog/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!row) return res.redirect('/admin/blog');
  res.render('admin/post-edit', { row, isNew: false });
});
router.post('/blog/:id', upload.single('image'), (req, res) => {
  const b = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : (b.current_image || '');
  const published = b.published ? 1 : 0;
  const slug = b.slug ? slugify(b.slug) : slugify(b.title_de || b.title_en);
  if (req.params.id === 'new') {
    db.prepare(`INSERT INTO posts (slug,title_de,title_en,excerpt_de,excerpt_en,body_de,body_en,image,category,published)
                VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .run(slug, b.title_de, b.title_en, b.excerpt_de, b.excerpt_en, b.body_de, b.body_en, image, b.category, published);
  } else {
    db.prepare(`UPDATE posts SET slug=?,title_de=?,title_en=?,excerpt_de=?,excerpt_en=?,body_de=?,body_en=?,
                image=?,category=?,published=? WHERE id=?`)
      .run(slug, b.title_de, b.title_en, b.excerpt_de, b.excerpt_en, b.body_de, b.body_en, image, b.category, published, req.params.id);
  }
  res.redirect('/admin/blog');
});
router.post('/blog/:id/delete', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.redirect('/admin/blog');
});

/* ---- team ---- */
router.get('/team', (req, res) => res.render('admin/team', { rows: db.prepare('SELECT * FROM team ORDER BY sort, id').all() }));
router.get('/team/new', (req, res) => res.render('admin/team-edit', { row: {}, isNew: true }));
router.get('/team/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM team WHERE id = ?').get(req.params.id);
  if (!row) return res.redirect('/admin/team');
  res.render('admin/team-edit', { row, isNew: false });
});
router.post('/team/:id', upload.single('photo'), (req, res) => {
  const b = req.body;
  const photo = req.file ? '/uploads/' + req.file.filename : (b.current_photo || '');
  if (req.params.id === 'new') {
    db.prepare('INSERT INTO team (name,role_de,role_en,bio_de,bio_en,photo,sort) VALUES (?,?,?,?,?,?,?)')
      .run(b.name, b.role_de, b.role_en, b.bio_de, b.bio_en, photo, Number(b.sort) || 0);
  } else {
    db.prepare('UPDATE team SET name=?,role_de=?,role_en=?,bio_de=?,bio_en=?,photo=?,sort=? WHERE id=?')
      .run(b.name, b.role_de, b.role_en, b.bio_de, b.bio_en, photo, Number(b.sort) || 0, req.params.id);
  }
  res.redirect('/admin/team');
});
router.post('/team/:id/delete', (req, res) => {
  db.prepare('DELETE FROM team WHERE id = ?').run(req.params.id);
  res.redirect('/admin/team');
});

/* ---- contact form messages ---- */
router.get('/messages', (req, res) => res.render('admin/messages', {
  rows: db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()
}));
router.post('/messages/:id/read', (req, res) => {
  db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});
router.post('/messages/:id/delete', (req, res) => {
  db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});

module.exports = router;
