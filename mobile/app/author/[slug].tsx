/**
 * Author profile - port of #view-author-profile.
 * Header portrait, follow action, biography, published works rail and the
 * achievements list.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader, EmptyState, Screen } from '@/components/screen';
import { BookPoster } from '@/components/book-card';
import { AuthorAvatar } from '@/components/author-avatar';
import { getBooksByAuthorSlug } from '@/data/catalog';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

/** Biography shipped with the web app for its default featured author. */
const DEFAULT_AUTHOR_NAME = 'GS. TS. Nguyễn Văn Anh';
const DEFAULT_AUTHOR_BIO =
  'GS. TS. Nguyễn Văn Anh có hơn 40 năm kinh nghiệm trong nghiên cứu giảng dạy dược học cổ truyền Việt Nam. Ông đã công bố hơn 120 bài báo khoa học quốc tế về chiết xuất hoạt chất saponin. Hiện là cố vấn cao cấp ban dược lý LIMES.';

const AFFILIATION = 'Học viện Quân y & Viện Dược liệu Trung ương';

const ACHIEVEMENTS: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  detail: string;
}[] = [
  {
    icon: 'military-tech',
    title: 'Huân chương Lao động hạng Nhì',
    detail: 'Trao tặng bởi Văn phòng Chủ tịch nước - 2021',
  },
  {
    icon: 'workspace-premium',
    title: 'Giải thưởng Hải Thượng Lãn Ông',
    detail: 'Vinh danh sự nghiệp y học cổ truyền - 2018',
  },
];

export default function AuthorProfileScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [following, setFollowing] = useState(false);
  const router = useRouter();

  const books = useMemo(() => getBooksByAuthorSlug(slug ?? ''), [slug]);
  const author = books[0]?.author;

  if (!author) {
    return (
      <Screen variant="surface">
        <AppHeader title="Hồ sơ Tác giả" showBack compact />
        <EmptyState icon="person" title="Không tìm thấy tác giả" />
      </Screen>
    );
  }

  const specialty = `Chuyên gia ${books[0]?.category ?? 'Y Khoa'}`;
  const biography =
    author === DEFAULT_AUTHOR_NAME
      ? DEFAULT_AUTHOR_BIO
      : `${author} là tác giả của ${books.length} tác phẩm trên LIMES, chuyên sâu về ${books[0]?.category ?? 'y khoa'}. Các công trình được biên soạn theo chuẩn học thuật và kiểm duyệt bởi hội đồng chuyên môn LIMES.`;

  const shareAuthor = () => {
    Share.share({ message: `${author} | LIMES` }).catch(() => undefined);
  };

  return (
    <Screen variant="surface">
      <AppHeader
        title="Hồ sơ Tác giả"
        showBack
        compact
        right={
          <Pressable onPress={shareAuthor} hitSlop={8} style={styles.headerButton}>
            <MaterialIcons name="share" size={19} color={colors.slate600} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.avatarWrap}>
            <AuthorAvatar name={author} size={128} style={styles.avatar} />
            <View style={styles.verified}>
              <MaterialIcons name="verified" size={14} color={colors.white} />
            </View>
          </View>

          <Text style={styles.name}>{author}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <Text style={styles.affiliation}>{AFFILIATION}</Text>

          <Pressable
            onPress={() => setFollowing((prev) => !prev)}
            style={[styles.followButton, following && styles.followButtonActive]}
          >
            <MaterialIcons
              name={following ? 'done' : 'person-add'}
              size={15}
              color={following ? colors.primary : colors.white}
            />
            <Text style={[styles.followText, following && styles.followTextActive]}>
              {following ? 'Đã theo dõi' : 'Theo dõi (1.2k)'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.bioCard}>
          <View style={styles.bioHeader}>
            <MaterialIcons name="menu-book" size={15} color={colors.primary} />
            <Text style={styles.bioHeaderText}>Tiểu sử</Text>
          </View>
          <Text style={styles.bioText}>{biography}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tác phẩm đã xuất bản</Text>
          <ScrollView
      style={styles.horizontalRail}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.worksRail}
          >
            {books.map((book) => (
              <BookPoster
                key={book.id}
                book={book}
                width={112}
                onPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tựu &amp; Giải thưởng</Text>
          <View style={styles.achievementList}>
            {ACHIEVEMENTS.map((item) => (
              <View key={item.title} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <MaterialIcons name={item.icon} size={19} color={colors.primary} />
                </View>
                <View style={styles.achievementBody}>
                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementDetail}>{item.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  /** A horizontal ScrollView stretches to fill its parent's cross axis
   *  unless flexGrow is pinned, which would leave a tall blank gap. */
  horizontalRail: { flexGrow: 0, flexShrink: 0 },
  headerButton: { padding: spacing.sm, borderRadius: radius.pill },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.xxl },

  profile: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  avatarWrap: { position: 'relative' },
  avatar: {
    borderWidth: 4,
    borderColor: colors.white,
    ...shadow.raised,
  },
  verified: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  name: { fontSize: fontSize.xl, fontWeight: '900', color: colors.slate900, marginTop: spacing.md },
  specialty: { fontSize: fontSize.base, fontWeight: '600', color: colors.primary },
  affiliation: { fontSize: fontSize.sm, color: colors.slate500 },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.md,
    minWidth: 200,
  },
  followButtonActive: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoftBorder },
  followText: { fontSize: fontSize.base, fontWeight: '700', color: colors.white },
  followTextActive: { color: colors.primary },

  bioCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    gap: spacing.sm,
    ...shadow.card,
  },
  bioHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bioHeaderText: { fontSize: fontSize.base, fontWeight: '700', color: colors.primary },
  bioText: { fontSize: fontSize.base, lineHeight: 19, color: colors.slate600 },

  section: { gap: spacing.md },
  sectionTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate900 },
  worksRail: { gap: spacing.lg, paddingVertical: spacing.sm },

  achievementList: { gap: spacing.sm },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  achievementBody: { flex: 1, gap: 2 },
  achievementTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800 },
  achievementDetail: { fontSize: fontSize.xs, color: colors.slate500 },
});
