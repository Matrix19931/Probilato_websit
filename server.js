/**
 * server.js — starts the website.
 *
 *   /            the website (German by default, /en/... for English)
 *   /admin       the control panel (login required)
 *
 * Run it with:  npm install  &&  npm run seed  &&  npm start
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const app = express();
require('./seed');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'probilato-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
}));

app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/public'));

/* Anything else: the 404 page, in German. */
app.use((req, res) => {
  const { S, IMG } = require('./db');
  res.status(404).render('404', {
    lang: 'de',
    t: require('./lib/i18n')('de'),
    settings: S.map('de'),
    images: IMG.map(),
    path: req.path,
    url: p => p,
    other: p => '/en' + (p === '/' ? '' : p),
    toHtml: require('./lib/text').toHtml
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Probilato running on http://localhost:' + port));
