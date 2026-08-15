/**
 * The public website. Every page exists twice:
 *   /kontakt-style German URLs are simply /<slug>, English ones /en/<slug>
 */
const express = require('express');
const { db, S, IMG } = require('../db');
const t = require('../lib/i18n');
const { toHtml } = require('../lib/text');

const router = express.Router();

/* Detect language from the URL prefix and load shared content. */
router.use((req, res, next) => {
  const en = req.path === '/en' || req.path.startsWith('/en/');
  res.locals.lang = en ? 'en' : 'de';
  res.locals.t = t(res.locals.lang);
  res.locals.settings = S.map(res.locals.lang);
  res.locals.images = IMG.map();
  res.locals.url = p => (en ? '/en' + (p === '/' ? '' : p) : p) || '/';
  res.locals.other = p => (en ? p : '/en' + (p === '/' ? '' : p)) || '/';
  res.locals.path = en ? (req.path.replace(/^\/en/, '') || '/') : req.path;
  res.locals.toHtml = toHtml;
  next();
});

function pick(row, field, lang) {
  if (!row) return '';
  return row[field + '_' + lang] || row[field + '_de'] || row[field + '_en'] || '';
}
function localisePost(p, lang) {
  return {
    slug: p.slug, image: p.image, category: p.category, created_at: p.created_at,
    title: pick(p, 'title', lang), excerpt: pick(p, 'excerpt', lang), body: pick(p, 'body', lang)
  };
}

function home(req, res) {
  const lang = res.locals.lang;
  const posts = db.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 3')
    .all().map(p => localisePost(p, lang));
  const team = db.prepare('SELECT * FROM team ORDER BY sort, id LIMIT 1').all()
    .map(m => ({ name: m.name, role: pick(m, 'role', lang), bio: pick(m, 'bio', lang), photo: m.photo }));
  res.render('home', { posts, founder: team[0] || null });
}

function page(slug) {
  return (req, res, next) => {
    const row = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
    if (!row) return next();
    const lang = res.locals.lang;
    const team = slug === 'team'
      ? db.prepare('SELECT * FROM team ORDER BY sort, id').all()
          .map(m => ({ name: m.name, role: pick(m, 'role', lang), bio: pick(m, 'bio', lang), photo: m.photo }))
      : [];
    res.render('page', {
      page: { slug, title: pick(row, 'title', lang), intro: pick(row, 'intro', lang), body: pick(row, 'body', lang) },
      team
    });
  };
}

function blog(req, res) {
  const lang = res.locals.lang;
  const posts = db.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC')
    .all().map(p => localisePost(p, lang));
  res.render('blog', { posts });
}

function post(req, res, next) {
  const row = db.prepare('SELECT * FROM posts WHERE slug = ? AND published = 1').get(req.params.slug);
  if (!row) return next();
  res.render('post', { post: localisePost(row, res.locals.lang) });
}

function contactGet(req, res) { res.render('contact', { sent: 'sent' in req.query, error: null, form: {} }); }

function contactPost(req, res) {
  const { name, email, subject, body } = req.body;
  if (!name || !email || !body) {
    return res.status(400).render('contact', { sent: false, error: res.locals.t.form_error, form: req.body });
  }
  db.prepare('INSERT INTO messages (name,email,subject,body) VALUES (?,?,?,?)')
    .run(name.trim(), email.trim(), (subject || '').trim(), body.trim());
  res.redirect(res.locals.url('/kontakt') + '?sent=1');
}

/* Route table — the same handlers mounted for German and English URLs. */
const routes = [
  ['/', home],
  ['/ueber-uns', page('who')], ['/vision', page('vision')], ['/investieren', page('invest')],
  ['/probiotika', page('probiotics')], ['/team', page('team')],
  ['/blog', blog], ['/blog/:slug', post], ['/kontakt', contactGet],
  ['/impressum', page('imprint')], ['/datenschutz', page('privacy')]
];

for (const [p, handler] of routes) {
  router.get(p, handler);
  router.get('/en' + (p === '/' ? '' : p), handler);
}
router.post('/kontakt', contactPost);
router.post('/en/kontakt', contactPost);

module.exports = router;
