/**
 * Builds the HTML document that the reader WebView renders.
 *
 * chapters.json stores each page as raw, Tailwind-classed markup authored for
 * the web reader. Rather than translating that markup into React Native
 * elements (which would destroy the typography), the page body is dropped into
 * an HTML shell that inlines the pre-compiled chapter Tailwind CSS (so the
 * reader works offline, with no CDN) and applies the active reader theme
 * through CSS custom properties - the same `--page-bg` / `--text-main` /
 * `--reader-font-size` variables the web app used.
 */
import { CHAPTER_TAILWIND_CSS } from '@/data/chapter-tailwind-css';
import type { ReaderFontFamily } from '@/store/app-store';
import { highlightColors, type HighlightColorKey, type ReaderTheme } from '@/theme/tokens';

/** Web reader default of `--reader-font-size: 18px`, scaled by readerFontScale. */
export const READER_BASE_FONT_PX = 18;

/**
 * Typeface stacks behind the settings sheet's Sans / Serif switch.
 * The web reader swapped between Inter and Playfair Display; neither webfont is
 * bundled here, so each stack falls back through the platform equivalents.
 */
export const READER_FONT_STACKS: Record<ReaderFontFamily, string> = {
  sans: "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,'Helvetica Neue',Arial,sans-serif",
  serif: "'Playfair Display',Georgia,'Iowan Old Style','Times New Roman',serif",
};

export function fontStackFor(family: ReaderFontFamily): string {
  return READER_FONT_STACKS[family] ?? READER_FONT_STACKS.sans;
}

export interface ReaderDocumentHighlight {
  id: string;
  text: string;
  /** HighlightColorKey persisted on the annotation. */
  color: string;
}

interface BuildReaderDocumentOptions {
  /** Raw page HTML from chapters.json. */
  html: string;
  theme: ReaderTheme;
  fontScale: number;
  fontFamily: ReaderFontFamily;
  highlights: ReaderDocumentHighlight[];
}

/** Messages the WebView bridge can post back to React Native. */
export type ReaderBridgeMessage =
  | { type: 'ready' }
  | { type: 'selection'; text: string; top: number }
  | { type: 'selection-cleared' }
  | { type: 'term'; term: string }
  | { type: 'flip'; dir: 1 | -1 };

export function resolveHighlightColor(color: string) {
  return highlightColors[color as HighlightColorKey] ?? highlightColors.yellow;
}

export function fontPxFor(scale: number): number {
  return Math.round(READER_BASE_FONT_PX * scale);
}

/** Safe embedding of arbitrary data inside a <script> block. */
function toScriptLiteral(value: unknown): string {
  return JSON.stringify(value ?? null).replace(/</g, '\\u003C');
}

export function buildReaderDocument({
  html,
  theme,
  fontScale,
  fontFamily,
  highlights,
}: BuildReaderDocumentOptions): string {
  const accent = theme.isDark ? '#7DA9F5' : '#1D4ED8';
  const rootClass = theme.isDark ? 'reader-tinted reader-dark' : theme.key === 'sepia' ? 'reader-tinted' : '';

  return `<!DOCTYPE html>
<html lang="vi" class="${rootClass}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
<style>${CHAPTER_TAILWIND_CSS}</style>
<style>${baseStyles({ theme, fontScale, fontFamily, accent })}</style>
</head>
<body>
<article id="reader-page" class="reader-page-paper">${html}</article>
<script>${bridgeScript(highlights)}</script>
</body>
</html>`;
}

function baseStyles({
  theme,
  fontScale,
  fontFamily,
  accent,
}: {
  theme: ReaderTheme;
  fontScale: number;
  fontFamily: ReaderFontFamily;
  accent: string;
}): string {
  const tintedSurface = theme.isDark ? '#262626' : 'rgba(0, 0, 0, 0.03)';

  return `
:root{
  --page-bg:${theme.background};
  --text-main:${theme.text};
  --text-muted:${theme.muted};
  --line-color:${theme.border};
  --tinted-surface:${tintedSurface};
  --accent:${accent};
  --reader-font-size:${fontPxFor(fontScale)}px;
  --reader-font-family:${fontStackFor(fontFamily)};
}
*{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
html,body{margin:0;padding:0;background-color:var(--page-bg);color:var(--text-main);}
body{
  padding:22px 18px 120px;
  overflow-x:hidden;
  -webkit-text-size-adjust:100%;
  -webkit-font-smoothing:antialiased;
  font-family:var(--reader-font-family);
}
#reader-page{max-width:720px;margin:0 auto;font-size:var(--reader-font-size);line-height:1.72;}
/* The page body is web-authored markup, so the family is restated on the
   elements Tailwind's preflight would otherwise reset to its own stack. */
#reader-page,#reader-page p,#reader-page li,#reader-page blockquote,
#reader-page h1,#reader-page h2,#reader-page h3,#reader-page h4,
#reader-page h5,#reader-page h6{font-family:var(--reader-font-family);}
#reader-page p,#reader-page li,#reader-page blockquote{font-size:var(--reader-font-size);line-height:1.72;}
#reader-page p{margin:0 0 0.85em;}
#reader-page h1{font-size:calc(var(--reader-font-size) * 1.85);line-height:1.3;}
#reader-page h2{font-size:calc(var(--reader-font-size) * 1.5);line-height:1.32;}
#reader-page h3{font-size:calc(var(--reader-font-size) * 1.25);line-height:1.36;}
#reader-page h4{font-size:calc(var(--reader-font-size) * 1.08);line-height:1.4;}
#reader-page img{max-width:100%;height:auto;border-radius:12px;}
#reader-page hr,#reader-page .h-px{background-color:var(--line-color);}
#reader-page blockquote{margin:1.1em 0;}
#reader-page ul,#reader-page ol{padding-left:1.4em;}
.serif-title{font-family:Georgia,'Iowan Old Style','Times New Roman',serif;}
.font-reading{line-height:1.72;}
/* Glossary affordances ported from the web reader. */
.dashed-underline,.medical-glossary-term{
  border-bottom:1px dashed var(--accent);
  color:var(--accent);
  font-weight:600;
  cursor:pointer;
}
mark.limes-highlight{padding:0 1px;border-radius:3px;color:inherit;}
::selection{background:rgba(37,99,235,0.22);}

/* Sepia + dark repaint the web-authored light-mode utility classes,
   mirroring the .kindle-sepia / .kindle-dark rules from the web app. */
.reader-tinted .reader-page-paper h1,
.reader-tinted .reader-page-paper h2,
.reader-tinted .reader-page-paper h3,
.reader-tinted .reader-page-paper h4,
.reader-tinted .reader-page-paper h5,
.reader-tinted .reader-page-paper h6,
.reader-tinted .reader-page-paper p,
.reader-tinted .reader-page-paper li,
.reader-tinted .reader-page-paper blockquote,
.reader-tinted .reader-page-paper strong,
.reader-tinted .reader-page-paper em{color:var(--text-main) !important;}
.reader-tinted .reader-page-paper [class*="text-gray-"],
.reader-tinted .reader-page-paper [class*="text-slate-"],
.reader-tinted .reader-page-paper [class*="text-stone-"],
.reader-tinted .reader-page-paper [class*="text-neutral-"],
.reader-tinted .reader-page-paper [class*="text-zinc-"],
.reader-tinted .reader-page-paper [class*="text-black"],
.reader-tinted .reader-page-paper [class*="text-[#"]{color:var(--text-main) !important;}
.reader-tinted .reader-page-paper [class*="text-gray-4"],
.reader-tinted .reader-page-paper [class*="text-gray-5"],
.reader-tinted .reader-page-paper [class*="text-slate-4"],
.reader-tinted .reader-page-paper [class*="text-slate-5"],
.reader-tinted .reader-page-paper [class*="text-stone-4"],
.reader-tinted .reader-page-paper [class*="text-stone-5"]{color:var(--text-muted) !important;}
.reader-tinted .reader-page-paper [class*="text-blue-"],
.reader-tinted .reader-page-paper [class*="text-sky-"],
.reader-tinted .reader-page-paper [class*="text-cyan-"]{color:var(--accent) !important;}
.reader-tinted .reader-page-paper [class*="bg-white"],
.reader-tinted .reader-page-paper [class*="bg-gray-"],
.reader-tinted .reader-page-paper [class*="bg-slate-"],
.reader-tinted .reader-page-paper [class*="bg-stone-"],
.reader-tinted .reader-page-paper [class*="bg-blue-5"],
.reader-tinted .reader-page-paper [class*="bg-amber-5"],
.reader-tinted .reader-page-paper [class*="bg-emerald-5"]{background-color:var(--tinted-surface) !important;}
.reader-tinted .reader-page-paper [class*="border-"]{border-color:var(--line-color) !important;}
`;
}

/**
 * Injected bridge. Everything it sends is JSON over
 * window.ReactNativeWebView.postMessage; nothing coming back is ever evaluated
 * as code - React Native only calls the named __limes* helpers below.
 */
function bridgeScript(highlights: ReaderDocumentHighlight[]): string {
  return `
(function () {
  var RN = window.ReactNativeWebView;
  function post(message) {
    try { if (RN && RN.postMessage) RN.postMessage(JSON.stringify(message)); } catch (err) { /* noop */ }
  }

  /* Inline handlers baked into chapters.json markup. */
  window.openGlossary = function (term, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    post({ type: 'term', term: String(term || '') });
  };
  window.showToast = function () { /* handled natively */ };
  window.openHighresViewer = function (event) {
    if (event && event.preventDefault) event.preventDefault();
  };

  /* Glossary taps + link containment. */
  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var glossary = target.closest('.medical-glossary-term, .dashed-underline, [data-term]');
    if (glossary) {
      event.preventDefault();
      var term = glossary.getAttribute('data-term') || glossary.textContent || '';
      post({ type: 'term', term: term.trim() });
      return;
    }
    var link = target.closest('a');
    if (link) event.preventDefault();
  }, true);

  /* Text selection -> native selection toolbar. */
  var selectionTimer = null;
  var lastSelection = '';
  function reportSelection() {
    var selection = window.getSelection();
    var text = selection ? String(selection).trim() : '';
    if (!text) {
      if (lastSelection) { lastSelection = ''; post({ type: 'selection-cleared' }); }
      return;
    }
    if (text === lastSelection) return;
    lastSelection = text;
    var top = 0;
    try {
      if (selection && selection.rangeCount > 0) {
        top = selection.getRangeAt(0).getBoundingClientRect().top;
      }
    } catch (err) { top = 0; }
    post({ type: 'selection', text: text, top: top });
  }
  document.addEventListener('selectionchange', function () {
    if (selectionTimer) clearTimeout(selectionTimer);
    selectionTimer = setTimeout(reportSelection, 220);
  });

  /* Swipe to turn pages - ported from initReaderSwipeGestures() in reader.js. */
  var startX = 0, startY = 0, currentX = 0, swiping = false;
  document.addEventListener('touchstart', function (event) {
    var selection = window.getSelection();
    if (selection && String(selection).trim().length > 0) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    currentX = startX;
    swiping = false;
  }, { passive: true });
  document.addEventListener('touchmove', function (event) {
    if (!startX) return;
    var deltaX = event.touches[0].clientX - startX;
    var deltaY = event.touches[0].clientY - startY;
    if (!swiping && Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) > 15) { swiping = true; currentX = event.touches[0].clientX; }
  }, { passive: true });
  document.addEventListener('touchend', function () {
    if (!swiping) { startX = 0; return; }
    var deltaX = currentX - startX;
    if (deltaX < -50) post({ type: 'flip', dir: 1 });
    else if (deltaX > 50) post({ type: 'flip', dir: -1 });
    swiping = false;
    startX = 0;
  }, { passive: true });

  /* Live theme + font updates so preference changes never reload the page. */
  window.__limesApplyTheme = function (theme) {
    if (!theme) return;
    var root = document.documentElement;
    root.style.setProperty('--page-bg', theme.background);
    root.style.setProperty('--text-main', theme.text);
    root.style.setProperty('--text-muted', theme.muted);
    root.style.setProperty('--line-color', theme.border);
    root.style.setProperty('--tinted-surface', theme.tintedSurface);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--reader-font-size', theme.fontPx + 'px');
    if (theme.fontFamily) root.style.setProperty('--reader-font-family', theme.fontFamily);
    root.className = theme.rootClass || '';
  };

  /* Repaint stored highlights over the page text. */
  window.__limesApplyHighlights = function (items) {
    var page = document.getElementById('reader-page');
    if (!page) return;
    page.querySelectorAll('mark.limes-highlight').forEach(function (mark) {
      var parent = mark.parentNode;
      if (!parent) return;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parent.normalize();
    });
    (items || []).forEach(function (item) {
      if (!item || !item.text) return;
      var walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, null);
      var node;
      while ((node = walker.nextNode())) {
        if (node.parentElement && node.parentElement.closest('mark.limes-highlight')) continue;
        var index = node.nodeValue.indexOf(item.text);
        if (index === -1) continue;
        var range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + item.text.length);
        var mark = document.createElement('mark');
        mark.className = 'limes-highlight';
        mark.style.backgroundColor = item.css;
        try { range.surroundContents(mark); } catch (err) { /* spans elements - skip */ }
        break;
      }
    });
  };

  window.__limesApplyHighlights(${toScriptLiteral(
    highlights.map((h) => ({ text: h.text, css: resolveHighlightColor(h.color).web })),
  )});
  post({ type: 'ready' });
})();
true;
`;
}

/** Serialises a theme + font update for window.__limesApplyTheme. */
export function themeUpdateScript(
  theme: ReaderTheme,
  fontScale: number,
  fontFamily: ReaderFontFamily,
): string {
  const payload = {
    background: theme.background,
    text: theme.text,
    muted: theme.muted,
    border: theme.border,
    tintedSurface: theme.isDark ? '#262626' : 'rgba(0, 0, 0, 0.03)',
    accent: theme.isDark ? '#7DA9F5' : '#1D4ED8',
    fontPx: fontPxFor(fontScale),
    fontFamily: fontStackFor(fontFamily),
    rootClass: theme.isDark ? 'reader-tinted reader-dark' : theme.key === 'sepia' ? 'reader-tinted' : '',
  };
  return `window.__limesApplyTheme(${toScriptLiteral(payload)}); true;`;
}

/** Serialises the highlight list for window.__limesApplyHighlights. */
export function highlightUpdateScript(highlights: ReaderDocumentHighlight[]): string {
  const payload = highlights.map((h) => ({ text: h.text, css: resolveHighlightColor(h.color).web }));
  return `window.__limesApplyHighlights(${toScriptLiteral(payload)}); true;`;
}
