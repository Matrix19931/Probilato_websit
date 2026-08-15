/**
 * Turns the plain text typed in the admin panel into safe HTML.
 * Blank line = new paragraph. A line starting with "- " = bullet point.
 * Nothing else is interpreted, so nobody can inject HTML.
 */
function escape(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function toHtml(text) {
  const blocks = String(text || '').trim().split(/\n\s*\n/);
  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length && lines.every(l => l.startsWith('- '))) {
      return '<ul>' + lines.map(l => '<li>' + escape(l.slice(2)) + '</li>').join('') + '</ul>';
    }
    return '<p>' + lines.map(escape).join('<br>') + '</p>';
  }).join('\n');
}

module.exports = { toHtml, escape };
