/**
 * seed.js — fills the database with the starting content.
 * Safe to run again: it only adds what is missing, it never overwrites
 * text you have already edited in the control panel.
 *
 *   npm run seed
 */
const { db, S, IMG } = require('./db');

const settings = [
  ['hero_kicker',      'Homepage — small line above the headline', 'Probiotisches Speiseeis', 'Probiotic ice cream', 'text', 10],
  ['hero_headline',    'Homepage — headline', 'Gut für dich. Genuss für alle.', 'Good for you. Delight for all.', 'text', 11],
  ['hero_text',        'Homepage — intro paragraph', 'Probilato entwickelt Speiseeis mit lebenden Kulturen – wie in Kefir und Joghurt. Wissenschaftlich fundiert, in Gelato-Qualität, natürlich hergestellt.', 'Probilato makes ice cream with live cultures — the kind found in kefir and yoghurt. Grounded in science, made to gelato quality, naturally.', 'textarea', 12],
  ['hero_button_1',    'Homepage — first button', 'Mehr erfahren', 'Learn more', 'text', 13],
  ['hero_button_2',    'Homepage — second button', 'Kontakt', 'Contact us', 'text', 14],
  ['badge_1',          'Homepage — badge 1', 'Lebende Kulturen', 'Live cultures', 'text', 15],
  ['badge_2',          'Homepage — badge 2', 'Kinderfreundlich', 'Family friendly', 'text', 16],
  ['badge_3',          'Homepage — badge 3', 'Gelato-Qualität', 'Gelato quality', 'text', 17],

  ['col1_title', 'Homepage column 1 — title', 'Über uns', 'Who We Are', 'text', 20],
  ['col1_text',  'Homepage column 1 — text', 'Probilato ist ein wissenschaftsgetriebenes Unternehmen für die Forschung, Entwicklung und Produktion hochwertiger probiotischer Lebensmittel.\n\nWir befinden uns in der Entwicklungsphase und bereiten unseren Markteintritt vor.', 'Probilato is a science-driven company dedicated to the research, development and production of high-quality probiotic food.\n\nWe are currently in the development phase and preparing for our market entry.', 'textarea', 21],
  ['col2_title', 'Homepage column 2 — title', 'Unsere Vision', 'Our Vision', 'text', 22],
  ['col2_text',  'Homepage column 2 — text', 'Wir sehen eine Zukunft, in der wissenschaftlich geprüfte Probiotika ein selbstverständlicher Teil der täglichen Ernährung sind – als Genussmittel, nicht als Nahrungsergänzung.', 'We envision a future where scientifically validated probiotics are an everyday part of nutrition — as something you enjoy, not a supplement you take.', 'textarea', 23],
  ['col3_title', 'Homepage column 3 — title', 'Warum investieren?', 'Why Invest in Probilato?', 'text', 24],
  ['col3_text',  'Homepage column 3 — text (one “- ” line per point)', '- Wachsender globaler Probiotika-Markt\n- Starke Forschungs- und Entwicklungsbasis\n- Innovativer, einzigartiger Produktansatz\n- Nachhaltiges und skalierbares Geschäftsmodell\n- Erfahrenes und engagiertes Team\n- Frühe Beteiligung mit hohem Wachstumspotenzial', '- Growing global probiotics market\n- Strong science and R&D foundation\n- Innovative and unique product approach\n- Sustainable and scalable business model\n- Experienced and passionate team\n- Early-stage opportunity with high growth potential', 'textarea', 25],
  ['col4_title', 'Homepage column 4 — title', 'Wissenschaft trifft Natur', 'Built on Science', 'text', 26],
  ['col4_text',  'Homepage column 4 — text', 'Die besten Lösungen für die menschliche Gesundheit entstehen aus dem Verständnis der Natur, verbunden mit moderner Wissenschaft.\n\nUnsere Rezepturen werden sorgfältig entwickelt – für einen echten Nutzen, sicher und natürlich.', 'We believe the best solutions for human health come from understanding nature and combining it with modern science.\n\nOur formulations are carefully developed to deliver real benefits in a safe, natural and effective way.', 'textarea', 27],

  ['probiotics_kicker', 'Probiotics band — small line', 'Über Probiotika', 'About probiotics', 'text', 30],
  ['probiotics_title',  'Probiotics band — title', 'Lebende Kulturen in jeder Kugel.', 'Live cultures in every scoop.', 'text', 31],
  ['probiotics_text',   'Probiotics band — text', 'Probiotika sind lebende Mikroorganismen, die in ausreichender Menge gesundheitlichen Nutzen bringen. Sie unterstützen die Darmgesundheit, stärken das Immunsystem und tragen zum allgemeinen Wohlbefinden bei.', 'Probiotics are live microorganisms that provide health benefits when consumed in adequate amounts. They support gut health, strengthen the immune system and contribute to overall well-being.', 'textarea', 32],
  ['benefit_1_title', 'Benefit 1 — title', 'Darmgesundheit', 'Gut health', 'text', 33],
  ['benefit_1_text',  'Benefit 1 — text', 'Unterstützt eine ausgeglichene Verdauung.', 'Supports digestive balance and comfort.', 'text', 34],
  ['benefit_2_title', 'Benefit 2 — title', 'Immunsystem', 'Immune support', 'text', 35],
  ['benefit_2_text',  'Benefit 2 — text', 'Stärkt die natürlichen Abwehrkräfte.', 'Helps strengthen natural defenses.', 'text', 36],
  ['benefit_3_title', 'Benefit 3 — title', 'Natürlich & sicher', 'Natural & safe', 'text', 37],
  ['benefit_3_text',  'Benefit 3 — text', 'Auf Basis von Wissenschaft und Natur.', 'Based on science and nature.', 'text', 38],
  ['benefit_4_title', 'Benefit 4 — title', 'Wohlbefinden', 'Well-being', 'text', 39],
  ['benefit_4_text',  'Benefit 4 — text', 'Für einen gesunden Alltag und Lebensqualität.', 'Supports a healthy lifestyle and quality of life.', 'text', 40],

  ['founder_kicker', 'Homepage — founder label', 'Gründerin', 'Founder', 'text', 50],
  ['rd_kicker',      'Homepage — research label', 'Forschung', 'Research', 'text', 51],
  ['rd_title',       'Homepage — research title', 'F&E-Team', 'R&D Team', 'text', 52],
  ['rd_text',        'Homepage — research text', 'Unser Team aus Wissenschaftlerinnen, Mikrobiologen und Ernährungsexperten entwickelt innovative probiotische Stämme und funktionelle Rezepturen nach höchsten Qualitätsstandards.', 'Our team of scientists, microbiologists and nutrition experts develops innovative probiotic strains and functional formulations backed by quality standards.', 'textarea', 53],

  ['contact_title',    'Contact — title', 'Sprechen Sie mit uns', 'Talk to us', 'text', 60],
  ['contact_email',    'Contact — email address', 'info@probilato.com', 'info@probilato.com', 'text', 61],
  ['contact_phone',    'Contact — phone number', '+49 123 456 7890', '+49 123 456 7890', 'text', 62],
  ['contact_address',  'Contact — address', 'Deutschland', 'Germany', 'text', 63],
  ['contact_register', 'Contact — company register', 'Handelsregister-Nr. HRB 123456', 'Commercial Register No. HRB 123456', 'text', 64],

  ['meta_title',       'Search engines — page title', 'Probilato — Probiotisches Speiseeis', 'Probilato — Probiotic ice cream', 'text', 90],
  ['meta_description', 'Search engines — description', 'Probilato entwickelt probiotisches Speiseeis mit lebenden Kulturen – wissenschaftlich fundiert und in Gelato-Qualität.', 'Probilato develops probiotic ice cream with live cultures — grounded in science, made to gelato quality.', 'textarea', 91]
];
for (const s of settings) S.ensure.run(s[0], s[1], s[2], s[3], s[4], s[5]);

const images = [
  ['logo', 'Logo in the header', '/images/logo-paper.png', 1],
  ['hero', 'Homepage — big picture next to the headline', '/images/hero-scoop.png', 2],
  ['probiotics', 'Homepage — picture in the dark “About probiotics” band', '/images/cup.png', 3],
  ['product', 'Product picture (cone)', '/images/cone.png', 4]
];
for (const i of images) IMG.ensure.run(i[0], i[1], i[2], i[3]);

const pages = [
  ['who', 'Über uns', 'Who We Are',
    'Ein wissenschaftsgetriebenes Unternehmen für probiotische Lebensmittel.',
    'A science-driven company for probiotic food.',
    'Probilato ist ein wissenschaftsgetriebenes Unternehmen, das sich der Forschung, Entwicklung und Produktion hochwertiger probiotischer Lebensmittel widmet.\n\nWir verbinden moderne Forschung mit dem Besten aus der Natur, um die tägliche Gesundheit auf köstliche und nachhaltige Weise zu unterstützen.\n\nDerzeit befinden wir uns in der Entwicklungsphase und bereiten unseren Markteintritt vor.',
    'Probilato is a science-driven company dedicated to the research, development and production of high-quality probiotic food.\n\nWe combine cutting-edge research with the best of nature to support everyday health in a delicious and sustainable way.\n\nWe are currently in the development phase and preparing for our market entry.', 1],
  ['vision', 'Unsere Vision', 'Our Vision',
    'Probiotika als selbstverständlicher Teil der täglichen Ernährung.',
    'Probiotics as an everyday part of nutrition.',
    'Wir sehen eine Zukunft, in der wissenschaftlich geprüfte Probiotika ein wesentlicher Bestandteil von Vorsorge und täglicher Ernährung sind – und die Lebensqualität von Menschen weltweit verbessern.\n\nUnser Weg dorthin führt über ein Produkt, das man gerne isst: Speiseeis in Gelato-Qualität, das nebenbei etwas Gutes tut.',
    'We envision a future where scientifically validated probiotics become an essential part of preventive healthcare and everyday nutrition — improving quality of life for people around the world.\n\nOur route there is a product people actually enjoy: gelato-quality ice cream that happens to do you good.', 2],
  ['invest', 'Warum investieren?', 'Why Invest in Probilato?',
    'Eine frühe Beteiligung an einem wachsenden Markt.',
    'An early-stage opportunity in a growing market.',
    '- Wachsender globaler Probiotika-Markt\n- Starke Forschungs- und Entwicklungsbasis\n- Innovativer, einzigartiger Produktansatz\n- Nachhaltiges und skalierbares Geschäftsmodell\n- Erfahrenes und engagiertes Team\n- Frühe Beteiligung mit hohem Wachstumspotenzial\n\nFür Unterlagen und ein Gespräch erreichen Sie uns über die Kontaktseite.',
    '- Growing global probiotics market\n- Strong science and R&D foundation\n- Innovative and unique product approach\n- Sustainable and scalable business model\n- Experienced and passionate team\n- Early-stage investment opportunity with high growth potential\n\nFor documents and a conversation, reach us through the contact page.', 3],
  ['probiotics', 'Probiotika', 'Probiotics',
    'Lebende Mikroorganismen mit belegtem Nutzen.',
    'Live microorganisms with proven benefits.',
    'Probiotika sind lebende Mikroorganismen, die in ausreichender Menge gesundheitlichen Nutzen bringen. Sie unterstützen die Darmgesundheit, stärken das Immunsystem und tragen zum allgemeinen Wohlbefinden bei.\n\nBekannt sind sie vor allem aus Kefir und Joghurt. Probilato bringt dieselben Kulturen in ein Produkt, das Kinder wie Erwachsene gerne essen.\n\n- Darmgesundheit: unterstützt eine ausgeglichene Verdauung\n- Immunsystem: stärkt die natürlichen Abwehrkräfte\n- Natürlich und sicher: auf Basis von Wissenschaft und Natur\n- Wohlbefinden: für einen gesunden Alltag',
    'Probiotics are live microorganisms that provide health benefits when consumed in adequate amounts. They support gut health, strengthen the immune system and contribute to overall well-being.\n\nThey are best known from kefir and yoghurt. Probilato brings the same cultures into a product children and adults enjoy eating.\n\n- Gut health: supports digestive balance\n- Immune support: helps strengthen natural defenses\n- Natural and safe: based on science and nature\n- Well-being: supports a healthy everyday life', 4],
  ['team', 'Unser Team', 'Our Team',
    'Wissenschaft, Produktentwicklung und Unternehmertum.',
    'Science, product development and entrepreneurship.',
    'Unser Team vereint Mikrobiologie, Lebensmitteltechnologie und Unternehmertum.',
    'Our team brings together microbiology, food technology and entrepreneurship.', 5],
  ['imprint', 'Impressum', 'Imprint', '', '',
    'Probilato\nDeutschland\n\nHandelsregister-Nr. HRB 123456\nE-Mail: info@probilato.com\n\n(Bitte vollständige Angaben nach § 5 TMG hier ergänzen.)',
    'Probilato\nGermany\n\nCommercial Register No. HRB 123456\nEmail: info@probilato.com\n\n(Please complete the legally required details here.)', 8],
  ['privacy', 'Datenschutz', 'Privacy Policy', '', '',
    'Diese Website speichert Nachrichten, die über das Kontaktformular gesendet werden (Name, E-Mail-Adresse, Betreff, Nachricht), um die Anfrage zu beantworten.\n\n(Bitte vollständige Datenschutzerklärung hier ergänzen.)',
    'This website stores messages sent through the contact form (name, email address, subject, message) in order to answer the enquiry.\n\n(Please complete the full privacy policy here.)', 9]
];
const insPage = db.prepare(`INSERT OR IGNORE INTO pages (slug,title_de,title_en,intro_de,intro_en,body_de,body_en,sort)
                            VALUES (?,?,?,?,?,?,?,?)`);
for (const p of pages) insPage.run(...p);

if (db.prepare('SELECT COUNT(*) n FROM team').get().n === 0) {
  db.prepare('INSERT INTO team (name,role_de,role_en,bio_de,bio_en,photo,sort) VALUES (?,?,?,?,?,?,?)').run(
    'Dr. Rima Al-Khatib', 'Gründerin', 'Founder',
    'Biotechnologin und Unternehmerin mit Leidenschaft für probiotische Forschung. Ihr Ziel ist es, Wissenschaft und Alltagsgesundheit zu verbinden.',
    'Biotechnologist and entrepreneur with a passion for probiotic research. Her mission is to bridge science and everyday health.',
    '', 0);
}

if (db.prepare('SELECT COUNT(*) n FROM posts').get().n === 0) {
  const ins = db.prepare(`INSERT INTO posts (slug,title_de,title_en,excerpt_de,excerpt_en,body_de,body_en,category,published)
                          VALUES (?,?,?,?,?,?,?,?,1)`);
  ins.run('kefirkulturen-gefrieren', 'Warum Kefirkulturen das Gefrieren überstehen', 'Why kefir cultures survive freezing',
    'Wie wir Stämme auswählen, die auch bei −18 °C aktiv bleiben.', 'How we select strains that stay active at −18 °C.',
    'Nicht jede Kultur übersteht das Gefrieren. Wir prüfen Stämme auf Überlebensrate, Aktivität nach dem Auftauen und Einfluss auf Textur und Geschmack.',
    'Not every culture survives freezing. We test strains for survival rate, activity after thawing, and their effect on texture and taste.',
    'Forschung');
  ins.run('erste-sorten', 'Erste Sorten: Beere, Vanille, Haselnuss', 'First flavours: berry, vanilla, hazelnut',
    'Ein Blick auf die drei Rezepturen, mit denen wir in die Verkostung gehen.', 'A look at the three formulations going into tasting.',
    'Drei Rezepturen stehen für die erste Verkostung bereit. Jede wurde auf Kulturzahl, Süße und Cremigkeit abgestimmt.',
    'Three formulations are ready for the first tasting. Each was balanced for culture count, sweetness and creaminess.',
    'Produkt');
  ins.run('markteintritt', 'Auf dem Weg zum Markteintritt', 'On the road to market entry',
    'Wo wir stehen und was als Nächstes kommt.', 'Where we stand and what comes next.',
    'Wir schließen die Entwicklungsphase ab und bereiten Produktion und Vertrieb vor. Partner und Investoren sind eingeladen, sich zu melden.',
    'We are closing the development phase and preparing production and distribution. Partners and investors are welcome to get in touch.',
    'Unternehmen');
}

console.log('Seed complete. Start the site with: npm start');
