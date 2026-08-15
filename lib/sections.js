/**
 * The control panel is organised the same way as the website:
 * one screen per page. This file says what belongs to which page.
 *
 *   settings : groups of text fields (keys from the settings table)
 *   images   : picture slots (keys from the images table)
 *   page     : slug of a row in the pages table (title + intro + body)
 *   team     : show the team member list on this screen
 *   blog     : show the blog post list on this screen
 *   view     : the address of this page on the website
 */
module.exports = [
  {
    id: 'home', label: 'Homepage', view: '/',
    hint: 'Everything on the front page, from top to bottom.',
    images: ['hero', 'probiotics'],
    settings: [
      { title: 'Top of the page', hint: 'The big headline and the two buttons under it.',
        keys: ['hero_kicker', 'hero_headline', 'hero_text', 'hero_button_1', 'hero_button_2', 'badge_1', 'badge_2', 'badge_3'] },
      { title: 'The four columns', hint: 'The row of four short texts under the big picture.',
        keys: ['col1_title', 'col1_text', 'col2_title', 'col2_text', 'col3_title', 'col3_text', 'col4_title', 'col4_text'] },
      { title: 'The dark blue band', hint: 'The “About probiotics” section with the four benefits.',
        keys: ['probiotics_kicker', 'probiotics_title', 'probiotics_text',
               'benefit_1_title', 'benefit_1_text', 'benefit_2_title', 'benefit_2_text',
               'benefit_3_title', 'benefit_3_text', 'benefit_4_title', 'benefit_4_text'] },
      { title: 'The bottom row', hint: 'Founder, research and contact, at the foot of the page.',
        keys: ['founder_kicker', 'rd_kicker', 'rd_title', 'rd_text'] }
    ]
  },
  { id: 'who',        label: 'Who we are',  view: '/ueber-uns',   page: 'who',        hint: 'The “Über uns” page.' },
  { id: 'vision',     label: 'Our vision',  view: '/vision',      page: 'vision',     hint: 'The “Vision” page.' },
  { id: 'invest',     label: 'Why invest',  view: '/investieren', page: 'invest',     hint: 'The “Investieren” page.' },
  { id: 'probiotics', label: 'Probiotics',  view: '/probiotika',  page: 'probiotics', hint: 'The “Probiotika” page.' },
  { id: 'team',       label: 'Team',        view: '/team',        page: 'team', team: true,
    hint: 'The team page text, and the people shown on it. The first person also appears on the homepage.' },
  { id: 'blog',       label: 'Blog',        view: '/blog',        blog: true,
    hint: 'All blog posts.' },
  { id: 'contact',    label: 'Contact',     view: '/kontakt',
    hint: 'The contact page, and the same details shown at the bottom of the homepage.',
    settings: [ { title: 'Contact details', hint: 'Shown on the contact page and on the homepage.',
      keys: ['contact_title', 'contact_email', 'contact_phone', 'contact_address', 'contact_register'] } ] },
  { id: 'legal',      label: 'Imprint & privacy', view: '/impressum', pages: ['imprint', 'privacy'],
    hint: 'The two legal pages. These must be completed before the website goes live.' },
  { id: 'brand',      label: 'Logo & search results', view: '/',
    hint: 'The logo in the header, and the text search engines show.',
    images: ['logo', 'product'],
    settings: [ { title: 'Search engines', hint: 'The title and description shown in Google results.',
      keys: ['meta_title', 'meta_description'] } ] }
];
