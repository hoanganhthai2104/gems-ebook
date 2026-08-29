/**
 * Article detail — the React Native port of #article-detail-modal.
 * Body blocks come from `src/data/articles.ts` (the web `newsArticlesData`).
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { Toast, useToast } from '@/components/toast';
import { getArticle, type ArticleBlock, type TextSpan } from '@/data/articles';
import { resolveCover } from '@/data/cover-images';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

export default function ArticleDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const article = useMemo(() => getArticle(slug), [slug]);
  const { toast, show } = useToast();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/news'));

  return (
    <Screen variant="surface">
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={22} color={colors.slate600} />
        </Pressable>
        <View style={styles.categoryChip}>
          <Text numberOfLines={1} style={styles.categoryChipText}>
            {article.category}
          </Text>
        </View>
        <Pressable
          onPress={() => show('Đã sao chép liên kết bài viết!', 'success')}
          hitSlop={8}
          style={styles.headerButton}
        >
          <MaterialIcons name="share" size={20} color={colors.slate600} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{article.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaAuthor}>{article.author}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaTime}>{article.time}</Text>
        </View>

        <Image source={resolveCover(article.image)} style={styles.cover} contentFit="cover" transition={150} />

        <View style={styles.body}>
          {article.blocks.map((block, index) => (
            <ArticleBlockView key={`${block.type}-${index}`} block={block} />
          ))}
        </View>
      </ScrollView>

      <Toast toast={toast} />
    </Screen>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.type === 'heading') {
    return <Text style={styles.heading}>{block.text}</Text>;
  }

  if (block.type === 'callout') {
    return (
      <View style={styles.callout}>
        <Text style={styles.calloutTitle}>{block.title}</Text>
        <Text style={styles.calloutBody}>
          <Spans spans={block.spans} boldStyle={styles.calloutBold} />
        </Text>
      </View>
    );
  }

  return (
    <Text style={styles.paragraph}>
      <Spans spans={block.spans} boldStyle={styles.paragraphBold} />
    </Text>
  );
}

/** Renders inline runs, bolding the ones the web wrapped in <strong>. */
function Spans({ spans, boldStyle }: { spans: TextSpan[]; boldStyle: StyleProp<TextStyle> }) {
  return (
    <>
      {spans.map((span, index) => (
        <Text key={index} style={span.bold ? boldStyle : undefined}>
          {span.text}
        </Text>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    backgroundColor: colors.white,
  },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  categoryChip: {
    flexShrink: 1,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  categoryChipText: {
    fontSize: fontSize.base,
    fontWeight: '900',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  scroll: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingBottom: 48 },
  title: { fontSize: fontSize.xxl, fontWeight: '900', color: colors.slate900, lineHeight: 24 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  metaAuthor: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate700 },
  metaDot: { fontSize: fontSize.base, color: colors.slate400 },
  metaTime: { fontSize: fontSize.base, color: colors.slate500, fontWeight: '500' },

  cover: {
    width: '100%',
    height: 192,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
    marginTop: spacing.lg,
  },

  body: { marginTop: spacing.lg },
  paragraph: { fontSize: fontSize.lg, color: colors.slate700, lineHeight: 22, marginBottom: spacing.lg },
  paragraphBold: { fontWeight: '700' },
  heading: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.slate900,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  callout: {
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  calloutTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: '#1E3A8A',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  calloutBody: { fontSize: fontSize.base, color: '#1E40AF', lineHeight: 18 },
  calloutBold: { fontWeight: '700' },
});
