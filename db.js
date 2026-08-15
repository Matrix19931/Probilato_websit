/**
 * db.js — the database.
 * Everything the website shows is stored in one file: data/probilato.db
 * (SQLite). Back the site up by copying that one file.
 */
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(path.join(dir, 'probilato.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  /* Short pieces of text (headline, buttons, address...) in both languages. */
  CREATE TABLE IF NOT EXISTS settings (
    key      TEXT PRIMARY KEY,
    label    TEXT NOT NULL,       -- human name shown in the admin panel
    value_de TEXT DEFAULT '',
    value_en TEXT DEFAULT '',
    kind     TEXT DEFAULT 'text', -- 'text' | 'textarea' | 'plain'
    sort     INTEGER DEFAULT 0
  );

  /* Named image slots. The admin panel replaces the file behind a slot. */
  CREATE TABLE IF NOT EXISTS images (
    key   TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    path  TEXT NOT NULL,          -- e.g. /images/hero.png
    sort  INTEGER DEFAULT 0
  );

  /* The sub-pages (Who we are, Vision, ...). Body is plain text; blank
     lines become paragraphs, lines starting with "- " become bullets. */
  CREATE TABLE IF NOT EXISTS pages (
    slug     TEXT PRIMARY KEY,
    title_de TEXT NOT NULL,
    title_en TEXT NOT NULL,
    intro_de TEXT DEFAULT '',
    intro_en TEXT DEFAULT '',
    body_de  TEXT DEFAULT '',
    body_en  TEXT DEFAULT '',
    sort     INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT UNIQUE NOT NULL,
    title_de   TEXT NOT NULL,
    title_en   TEXT NOT NULL,
    excerpt_de TEXT DEFAULT '',
    excerpt_en TEXT DEFAULT '',
    body_de    TEXT DEFAULT '',
    body_en    TEXT DEFAULT '',
    image      TEXT DEFAULT '',
    category   TEXT DEFAULT '',
    published  INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS team (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT NOT NULL,
    role_de TEXT DEFAULT '',
    role_en TEXT DEFAULT '',
    bio_de  TEXT DEFAULT '',
    bio_en  TEXT DEFAULT '',
    photo   TEXT DEFAULT '',
    sort    INTEGER DEFAULT 0
  );

  /* Messages sent through the contact form. */
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT DEFAULT '',
    body       TEXT NOT NULL,
    is_read    INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

/* ---- small helpers used by the routes ---- */

const S = {
  all: () => db.prepare('SELECT * FROM settings ORDER BY sort, key').all(),
  map(lang) {
    const out = {};
    for (const r of S.all()) out[r.key] = (lang === 'en' ? r.value_en : r.value_de) || r.value_de || r.value_en;
    return out;
  },
  set: db.prepare('UPDATE settings SET value_de = ?, value_en = ? WHERE key = ?'),
  ensure: db.prepare('INSERT OR IGNORE INTO settings (key,label,value_de,value_en,kind,sort) VALUES (?,?,?,?,?,?)')
};

const IMG = {
  all: () => db.prepare('SELECT * FROM images ORDER BY sort, key').all(),
  map() { const o = {}; for (const r of IMG.all()) o[r.key] = r.path; return o; },
  set: db.prepare('UPDATE images SET path = ? WHERE key = ?'),
  ensure: db.prepare('INSERT OR IGNORE INTO images (key,label,path,sort) VALUES (?,?,?,?)')
};

module.exports = { db, S, IMG };
