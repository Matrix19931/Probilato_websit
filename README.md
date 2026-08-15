# Probilato website

The Probilato company website (German + English) with a control panel for
editing text, pictures, blog posts, team members and contact details.

Written for someone who has never run a website before — follow the steps
in order and nothing else is needed.

---

## What is in here

| Folder / file | What it is |
| --- | --- |
| `server.js` | Starts the website |
| `db.js` | The database (one file: `data/probilato.db`) |
| `seed.js` | Fills the database with the starting content |
| `routes/public.js` | The public pages |
| `routes/admin.js` | The control panel |
| `views/` | The page templates (what the visitor sees) |
| `views/admin/` | The control panel screens |
| `public/css/style.css` | The design of the website |
| `public/images/` | The pictures that ship with the site |
| `public/uploads/` | Pictures you upload in the control panel |
| `lib/i18n.js` | Menu and button labels in German and English |
| `lib/text.js` | Turns typed text into safe HTML |

## Pages

| Address | Page |
| --- | --- |
| `/` | Homepage (German) |
| `/en` | Homepage (English) |
| `/ueber-uns` | Who we are |
| `/vision` | Our vision |
| `/investieren` | Why invest |
| `/probiotika` | Probiotics |
| `/team` | Our team |
| `/blog`, `/blog/<post>` | Blog |
| `/kontakt` | Contact page with a form |
| `/impressum`, `/datenschutz` | Legal pages |
| `/admin` | Control panel (password protected) |

Every page also exists in English under `/en/...` — the DE/EN switch in the
header links to the same page in the other language.

---

## 1. Run it on your own computer

You need **Node.js 20 or newer** — download it from <https://nodejs.org> and
install it (just click through).

Then open a terminal in this folder and type:

```bash
npm install          # downloads what the site needs (once)
cp .env.example .env # creates your settings file  (Windows: copy .env.example .env)
npm run seed         # fills the database with the starting content (once)
npm start            # starts the website
```

Open <http://localhost:3000> — the website.
Open <http://localhost:3000/admin> — the control panel.

**Before anything else, open `.env` in a text editor and change
`ADMIN_PASSWORD` and `SESSION_SECRET`.** Those two lines are the only thing
protecting the control panel.

## 2. Put it online

The site is one small Node.js program plus one database file, so almost any
host works. The simplest route:

1. Push this folder to GitHub (see below).
2. Create a free account at <https://render.com>.
3. **New → Web Service → connect your GitHub repository.** Render reads
   `render.yaml` and fills in the settings itself.
4. In **Environment**, set `ADMIN_USER` and `ADMIN_PASSWORD`.
5. Deploy. Render gives you an address like `probilato.onrender.com`; your own
   domain can be pointed at it under **Settings → Custom domain**.

Note on the free plan: it has no permanent disk, so the database and uploaded
pictures are reset whenever the service restarts. For a real, live site take
the cheapest paid plan (about 7 USD / month) — `render.yaml` already asks for a
1 GB disk mounted at `data/`, which keeps the database and uploads safe.

## 3. Put it on GitHub

```bash
cd probilato-site
git init
git add .
git commit -m "Probilato website"
git branch -M main
git remote add origin https://github.com/Matrix19931/Probilato_websit.git
git push -u origin main
```

`.gitignore` already keeps your password file (`.env`), the database and the
uploaded pictures out of GitHub.

---

## Using the control panel

Go to `/admin` and log in.

- **Website text** — every short piece of text on the homepage, in German and
  English side by side. Leave the English box empty and the German text is used.
- **Pictures** — the picture slots (logo, homepage photo, band photo, product
  photo). Upload a new file to replace one.
- **Pages** — the text of the sub-pages. In a text box, a blank line starts a
  new paragraph and a line starting with `- ` becomes a bullet point.
- **Blog** — write, edit, publish or delete posts. Each post has a German and
  an English version, an optional picture and a category. Uncheck
  “Visible on the website” to keep a post as a draft.
- **Team** — the people shown on the team page. The first person (lowest order
  number) is also shown as the founder on the homepage.
- **Messages** — everything sent through the contact form. Unread messages are
  highlighted; you can mark them read or delete them.

Nothing you type is interpreted as code, so the site cannot be broken by
editing content.

## Backups

Everything lives in two places: `data/probilato.db` (all text, posts, team,
messages) and `public/uploads/` (uploaded pictures). Copy both somewhere safe
from time to time and you have a complete backup.

## Design

Cream ground (#f4efe8), navy (#22355c), berry accent (#b0808a); headings in
Barlow Condensed, body text in Barlow; square corners and hairline rules
throughout. All of it is in `public/css/style.css` — the colours are at the top
of the file in one block.

## Not included

- Sending email when a contact message arrives (messages are stored and read in
  the control panel instead). Ask if you want email notifications added.
- A cookie banner. The site sets no tracking cookies; the only cookie is the
  admin login.
- Real legal text for Impressum and Datenschutz — placeholders are in place and
  must be completed before the site goes live in Germany.
