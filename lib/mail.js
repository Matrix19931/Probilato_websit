/**
 * lib/mail.js — sends the emails for the support / contact form.
 *
 * Two emails go out for every request:
 *   1. to the company inbox (support@probilato.com) with the customer's message
 *   2. to the customer: "we received your request, it is pending"
 *
 * Settings come from environment variables (see .env.example). If SMTP_PASS
 * is not set, no email is sent; messages are still saved in the admin panel.
 */
const nodemailer = require('nodemailer');

const cfg = {
  host: process.env.SMTP_HOST || 'smtp.ionos.de',
  port: Number(process.env.SMTP_PORT || 465),
  user: process.env.SMTP_USER || 'support@probilato.com',
  pass: process.env.SMTP_PASS || '',
  inbox: process.env.SUPPORT_INBOX || process.env.SMTP_USER || 'support@probilato.com'
};

const enabled = () => Boolean(cfg.pass);

let transport;
function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465,
      auth: { user: cfg.user, pass: cfg.pass }
    });
  }
  return transport;
}

const clean = s => String(s || '').replace(/[\r\n]+/g, ' ').trim();

const text = {
  de: (m) => ({
    subject: `Ihre Anfrage #${m.id} ist eingegangen`,
    body:
`Hallo ${m.name},

vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten.

Anfragenummer: #${m.id}
Status: in Bearbeitung (ausstehend)

Wir melden uns so schnell wie möglich bei Ihnen. Wenn Sie etwas ergänzen möchten,
antworten Sie einfach auf diese E-Mail.

Ihre Nachricht:
${m.subject ? 'Betreff: ' + m.subject + '\n' : ''}${m.body}

Mit freundlichen Grüßen
Ihr Probilato-Team
https://probilato.com`
  }),
  en: (m) => ({
    subject: `We received your request #${m.id}`,
    body:
`Hello ${m.name},

Thank you for your message. We have received your request.

Request number: #${m.id}
Status: pending

We will get back to you as soon as possible. If you want to add anything,
simply reply to this email.

Your message:
${m.subject ? 'Subject: ' + m.subject + '\n' : ''}${m.body}

Best regards,
The Probilato team
https://probilato.com`
  })
};

/** m = { id, name, email, subject, body, lang } */
async function sendSupportEmails(m) {
  if (!enabled()) {
    console.log('[mail] SMTP_PASS not set, skipping emails for request #' + m.id);
    return;
  }
  const t = getTransport();
  const name = clean(m.name);
  const subject = clean(m.subject);

  // 1. Notify the company inbox. "Reply" goes straight to the customer.
  await t.sendMail({
    from: `"Probilato Website" <${cfg.user}>`,
    to: cfg.inbox,
    replyTo: { name, address: m.email },
    subject: `[Support #${m.id}] ${subject || 'Neue Anfrage / New request'} (${name})`,
    text:
`Neue Anfrage über die Website / New request from the website

Nr.:     #${m.id}
Name:    ${name}
E-Mail:  ${m.email}
Sprache: ${m.lang}
Betreff: ${subject || '-'}

${m.body}

(Auf diese E-Mail antworten, um dem Kunden direkt zu schreiben.)`
  });

  // 2. Confirmation to the customer.
  const c = text[m.lang === 'en' ? 'en' : 'de']({ ...m, name, subject });
  await t.sendMail({
    from: `"Probilato Support" <${cfg.user}>`,
    to: { name, address: m.email },
    replyTo: cfg.inbox,
    subject: c.subject,
    text: c.body
  });
}

module.exports = { sendSupportEmails, enabled };
