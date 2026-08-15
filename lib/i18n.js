/**
 * Interface labels (menu, buttons, form). Page CONTENT lives in the
 * database and is edited in the admin panel; these are fixed labels.
 */
const dict = {
  de: {
    nav_home: 'Start', nav_who: 'Über uns', nav_vision: 'Vision', nav_invest: 'Investieren',
    nav_probiotics: 'Probiotika', nav_blog: 'Blog', nav_team: 'Team', nav_contact: 'Kontakt',
    cta_contact: 'Kontakt aufnehmen', read_more: 'Weiterlesen', all_posts: 'Alle Beiträge',
    blog_title: 'Aus dem Labor', back: 'Zurück', privacy: 'Datenschutz', imprint: 'Impressum',
    form_name: 'Name', form_email: 'E-Mail', form_subject: 'Betreff', form_message: 'Nachricht',
    form_send: 'Nachricht senden', form_thanks: 'Danke — wir melden uns so schnell wie möglich.',
    form_error: 'Bitte Name, E-Mail und Nachricht ausfüllen.',
    not_found: 'Seite nicht gefunden', rights: 'Alle Rechte vorbehalten.'
  },
  en: {
    nav_home: 'Home', nav_who: 'Who We Are', nav_vision: 'Our Vision', nav_invest: 'Why Invest',
    nav_probiotics: 'Probiotics', nav_blog: 'Blog', nav_team: 'Our Team', nav_contact: 'Contact',
    cta_contact: 'Contact us', read_more: 'Read more', all_posts: 'All posts',
    blog_title: 'From the lab', back: 'Back', privacy: 'Privacy Policy', imprint: 'Imprint',
    form_name: 'Name', form_email: 'Email', form_subject: 'Subject', form_message: 'Message',
    form_send: 'Send message', form_thanks: 'Thank you — we will get back to you shortly.',
    form_error: 'Please fill in name, email and message.',
    not_found: 'Page not found', rights: 'All rights reserved.'
  }
};

module.exports = lang => dict[lang === 'en' ? 'en' : 'de'];
