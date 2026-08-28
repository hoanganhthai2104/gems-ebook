/**
 * The reader's content area: a WebView that renders one chapter page of
 * Tailwind-classed HTML, plus the postMessage bridge back to the native chrome.
 *
 * Navigation is locked down: only the initial about:/data: load is allowed, so
 * a stray link inside the bundled content can never navigate the reader away.
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { ReaderFontFamily } from '@/store/app-store';
import type { ReaderTheme } from '@/theme/tokens';
import {
  buildReaderDocument,
  highlightUpdateScript,
  themeUpdateScript,
  type ReaderBridgeMessage,
  type ReaderDocumentHighlight,
} from '@/components/reader-page-document';

interface ReaderWebViewProps {
  /** Raw page HTML from chapters.json. */
  html: string;
  /** Stable identity of the page; changing it rebuilds the document. */
  pageKey: string;
  theme: ReaderTheme;
  fontScale: number;
  fontFamily: ReaderFontFamily;
  highlights: ReaderDocumentHighlight[];
  onSelection: (text: string, top: number) => void;
  onSelectionCleared: () => void;
  onTerm: (term: string) => void;
  onFlip: (direction: 1 | -1) => void;
  /** Bumped by the screen to drop the in-page selection. */
  clearSelectionToken: number;
}

/** Only the initial in-memory document may load; everything else is refused. */
function isAllowedRequest(url: string): boolean {
  return url === 'about:blank' || url.startsWith('about:') || url.startsWith('data:');
}

/** Defensive parse - the content is app-bundled, but never trust the payload. */
function parseBridgeMessage(raw: string): ReaderBridgeMessage | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const message = parsed as Record<string, unknown>;

  switch (message.type) {
    case 'ready':
      return { type: 'ready' };
    case 'selection-cleared':
      return { type: 'selection-cleared' };
    case 'selection':
      if (typeof message.text !== 'string' || !message.text.trim()) return null;
      return {
        type: 'selection',
        text: message.text.trim(),
        top: typeof message.top === 'number' && Number.isFinite(message.top) ? message.top : 0,
      };
    case 'term':
      if (typeof message.term !== 'string' || !message.term.trim()) return null;
      return { type: 'term', term: message.term.trim() };
    case 'flip':
      if (message.dir !== 1 && message.dir !== -1) return null;
      return { type: 'flip', dir: message.dir };
    default:
      return null;
  }
}

export function ReaderWebView({
  html,
  pageKey,
  theme,
  fontScale,
  fontFamily,
  highlights,
  onSelection,
  onSelectionCleared,
  onTerm,
  onFlip,
  clearSelectionToken,
}: ReaderWebViewProps) {
  const webViewRef = useRef<WebView>(null);

  // The document is rebuilt only when the page changes; theme and font-size
  // changes are pushed in through injectJavaScript so the page never reloads.
  const appearanceRef = useRef({ theme, fontScale, fontFamily, highlights, html });
  appearanceRef.current = { theme, fontScale, fontFamily, highlights, html };

  const document = useMemo(() => {
    const { theme: t, fontScale: scale, fontFamily: family, highlights: marks, html: body } =
      appearanceRef.current;
    return buildReaderDocument({ html: body, theme: t, fontScale: scale, fontFamily: family, highlights: marks });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(themeUpdateScript(theme, fontScale, fontFamily));
  }, [theme, fontScale, fontFamily]);

  const highlightSignature = highlights.map((h) => `${h.id}:${h.color}`).join('|');
  useEffect(() => {
    webViewRef.current?.injectJavaScript(highlightUpdateScript(appearanceRef.current.highlights));
  }, [highlightSignature, pageKey]);

  useEffect(() => {
    if (clearSelectionToken === 0) return;
    webViewRef.current?.injectJavaScript(
      'if (window.getSelection) window.getSelection().removeAllRanges(); true;',
    );
  }, [clearSelectionToken]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseBridgeMessage(event.nativeEvent.data);
      if (!message) return;
      switch (message.type) {
        case 'selection':
          onSelection(message.text, message.top);
          break;
        case 'selection-cleared':
          onSelectionCleared();
          break;
        case 'term':
          onTerm(message.term);
          break;
        case 'flip':
          onFlip(message.dir);
          break;
        default:
          break;
      }
    },
    [onSelection, onSelectionCleared, onTerm, onFlip],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['about:blank']}
        source={{ html: document }}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={(request) => isAllowedRequest(request.url)}
        javaScriptEnabled
        domStorageEnabled={false}
        setSupportMultipleWindows={false}
        allowsLinkPreview={false}
        allowsFullscreenVideo={false}
        mediaPlaybackRequiresUserAction
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        style={[styles.webview, { backgroundColor: theme.background }]}
        containerStyle={{ backgroundColor: theme.background }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
