// Runtime shared by the ESM and CJS builds (inlined by scripts/build.js).
// Normative behaviour: docs/SPEC_LombokIcons_v<version>.md section 3.

const MODES = ['line', 'bold', 'duo'];
const RE_SIZE = /^(?:0|[0-9]+(?:\.[0-9]+)?(?:px|em|rem|%|vw|vh|vmin|vmax|pt|ch|ex))$/;
const RE_COLOR = /^(?:#[0-9a-fA-F]{3,8}|[a-zA-Z]{3,30}|(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\([0-9a-zA-Z.,% /+-]{1,64}\)|var\(--[a-zA-Z0-9_-]{1,64}\))$/;

/** Escapes text for HTML element content and double-quoted attribute values. */
function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Returns true when `value` is an accepted CSS length for the size option. */
function isValidSize(value) {
  return typeof value === 'string' && RE_SIZE.test(value);
}

/** Returns true when `value` is an accepted CSS colour for the color option. */
function isValidColor(value) {
  return typeof value === 'string' && RE_COLOR.test(value);
}

/** Inner SVG markup of one icon in one mode. */
function iconInner(icon, mode) {
  let inner = '';
  if (mode === 'duo' && icon.duo_accent) {
    inner += '<path d="' + icon.duo_accent + '" class="lf-accent" fill="currentColor" opacity="0.32" stroke="none"/>';
  }
  inner += '<path d="' + icon.line + '"/>';
  if (mode === 'bold' && icon.bold_accent) {
    inner += '<path d="' + icon.bold_accent + '" class="lf-bold-fill" fill="currentColor" stroke="none"/>';
  }
  return inner;
}

/**
 * Renders icon data (an object with `line`, `bold_accent`, `duo_accent`) as HTML.
 * Import a single icon constant and pass it here to keep bundles small.
 */
function renderIconData(icon, opts) {
  if (!icon || typeof icon.line !== 'string') return '';
  const o = opts || {};
  const mode = MODES.indexOf(o.mode) >= 0 ? o.mode : 'line';
  const cls = typeof o.class === 'string' ? o.class.replace(/^[ \t\n\f\r]+|[ \t\n\f\r]+$/g, '').replace(/[ \t\n\f\r]+/g, ' ') : '';
  const styles = [];
  if (isValidSize(o.size)) styles.push('--lf-size:' + o.size);
  if (isValidColor(o.color)) styles.push('--lf-color:' + o.color);
  const title = typeof o.title === 'string' && o.title !== '' ? o.title : '';
  const a11y = title
    ? ' role="img" aria-label="' + escapeAttr(title) + '"'
    : ' aria-hidden="true" focusable="false"';
  return '<span class="lf' + (cls ? ' ' + escapeAttr(cls) : '') + '"' +
    (styles.length ? ' style="' + escapeAttr(styles.join(';')) + '"' : '') + '>' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"' +
    a11y + '>' + (title ? '<title>' + escapeAttr(title) + '</title>' : '') + iconInner(icon, mode) + '</svg></span>';
}

/** Renders an icon by name; returns '' for an unknown name. */
function renderIcon(name, opts) {
  return Object.prototype.hasOwnProperty.call(icons, name) ? renderIconData(icons[name], opts) : '';
}

/**
 * Replaces every element with a `data-lf` attribute inside `root` (default: document.body)
 * by the rendered icon. Reads `data-lf-mode`, `class` and `aria-label` from the element.
 */
function replaceIcons(root, mode) {
  const el = root || document.body;
  const targets = el.querySelectorAll('[data-lf]');
  targets.forEach(function (target) {
    const html = renderIcon(target.getAttribute('data-lf'), {
      mode: target.getAttribute('data-lf-mode') || mode || 'line',
      class: target.getAttribute('class') || '',
      title: target.getAttribute('aria-label') || '',
    });
    if (html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      target.replaceWith(temp.firstChild);
    }
  });
}
