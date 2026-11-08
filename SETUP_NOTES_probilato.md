# Probilato – Domain & Email Setup Notes

_Saved: 2026-11-08_

## Summary
- **Website:** https://probilato.com (live, HTTPS)
- **www:** https://www.probilato.com → redirects to probilato.com
- **Old Render URL (still works):** https://probilato-websit.onrender.com
- **Company email:** support@probilato.com (IONOS "Mail Basic", 2 GB)
- **Code:** GitHub repo `Matrix19931/Probilato_websit` (Node.js, hosted on Render, service name `probilato`)

---

## 1. Domain
- Domain **probilato.com** bought at **IONOS** (my.ionos.de).

## 2. Render (hosting)
Render dashboard → service `probilato` → **Settings → Custom Domains**:
- `probilato.com` – Verified, Certificate Issued
- `www.probilato.com` – Verified, Certificate Issued, redirects to probilato.com

## 3. IONOS DNS (Domains & SSL → probilato.com → DNS)

| Type | Host | Value | Purpose |
|---|---|---|---|
| A | @ | 216.24.57.1 | Website → Render (was 217.160.0.95 "Default Site") |
| CNAME | www | probilato-websit.onrender.com | www → Render |
| MX | @ | mx00.ionos.de / mx01.ionos.de | Email |
| TXT | @ | v=spf1 include:_spf-eu.ionos.com ~all | Email (SPF) |
| CNAME | _dmarc | dmarc.ionos.de | Email (DMARC) |
| CNAME | s1-ionos._domainkey / s2-ionos._domainkey | s1/s2.dkim.ionos.com | Email (DKIM) |
| CNAME | autodiscover | adsredir.ionos.info | Email auto-config |

Notes:
- The old AAAA record (Default Site) disappeared automatically when the A record was changed. Do **not** re-add an AAAA record for @.
- Do not delete the MX/TXT/_dmarc/_domainkey/autodiscover records, or email stops working.

## 4. Email: support@probilato.com
- **Webmail:** https://mail.ionos.de
- **Username:** support@probilato.com (full address)
- **Password:** set in IONOS (change via E-Mail → support@probilato.com → Passwort ändern)

Mail app settings (IMAP):

| | Server | Port | Security |
|---|---|---|---|
| Incoming (IMAP) | imap.ionos.de | 993 | SSL/TLS |
| Outgoing (SMTP) | smtp.ionos.de | 465 | SSL/TLS |

## 5. Welcome email for the customer

**Subject:** Your new company email: support@probilato.com

Dear [Customer name],

I'm happy to let you know that your new company email address is set up and ready to use:

📧 **support@probilato.com**

It goes together with your website, which is now live at **https://probilato.com**.

**How to log in (in your browser)**
1. Go to **https://mail.ionos.de**
2. Email: **support@probilato.com**
3. Password: *I'll send it to you separately for security reasons.*

Please change the password after you first log in.

**How to add it to your phone or computer**
In your mail app (iPhone Mail, Gmail app, Outlook, Thunderbird), add a new account, choose **"Other / IMAP"**, and enter:

- **Incoming server (IMAP):** imap.ionos.de, port 993, SSL/TLS
- **Outgoing server (SMTP):** smtp.ionos.de, port 465, SSL/TLS
- **Username:** support@probilato.com
- **Password:** your mailbox password

**Good to know**
- The mailbox has 2 GB of storage.
- A spam filter is switched on automatically.
- You can now put support@probilato.com on your business cards, invoices and social media.

If you have any questions or need help with the setup, just reply to this email.

Best regards,
[Your name]
[Your phone number]

_(Send the password separately, e.g. by SMS/WhatsApp.)_

## 6. Open to-dos
- [ ] Check which Render plan the service is on: `render.yaml` uses `plan: free` together with a 1 GB disk. Disks need a paid plan, so data saved via the admin panel may be lost on restart/redeploy on the free plan.
- [ ] Optionally show support@probilato.com on the website (footer / contact page).
