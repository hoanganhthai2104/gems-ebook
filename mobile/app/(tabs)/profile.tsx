/**
 * Profile tab - port of the web `view-profile` panel.
 * The web app's generic `view-profile-sublist` sub-screen is folded in here as
 * three collapsible book lists (Sách đã mua / Sách yêu thích / Lịch sử đọc).
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { BookListRow } from '@/components/book-card';
import { IconButton } from '@/components/ui';
import { ProfileMenuRow, ProfileSublist, ProfileSublistEmpty } from '@/components/profile-menu-row';
import { formatCoins } from '@/components/profile-reward-card';
import { Toast, useToast } from '@/components/toast';
import { getBooksByIds } from '@/data/catalog';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const LOGO = require('../../assets/logo.png');

/** Demo libraries from the web app, used whenever the store has no activity. */
const DEMO_PURCHASED = ['thaoduoc', 'co-the-nguoi', 'trathaomoc'];
const DEMO_FAVORITE = ['thankinh', 'ditruyen', 'thucduong'];
const DEMO_HISTORY = ['co-the-nguoi', 'thaoduoc'];

type SublistKey = 'purchased' | 'favorite' | 'history';

export default function ProfileScreen() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [openList, setOpenList] = useState<SublistKey | null>(null);

  const userName = useAppStore((s) => s.userName);
  const userCoins = useAppStore((s) => s.userCoins);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const lastReadingPosition = useAppStore((s) => s.lastReadingPosition);
  const currentBookId = useAppStore((s) => s.currentBookId);
  const logout = useAppStore((s) => s.logout);

  const favoriteIds = useMemo(() => {
    const ids = [...new Set(bookmarks.map((b) => b.bookId))];
    return ids.length > 0 ? ids : DEMO_FAVORITE;
  }, [bookmarks]);

  const historyIds = useMemo(() => {
    const ids = [...new Set([lastReadingPosition?.bookId, currentBookId].filter(Boolean))] as string[];
    return ids.length > 0 ? ids : DEMO_HISTORY;
  }, [lastReadingPosition, currentBookId]);

  const listBooks = useMemo(
    () => ({
      purchased: getBooksByIds(DEMO_PURCHASED),
      favorite: getBooksByIds(favoriteIds),
      history: getBooksByIds(historyIds),
    }),
    [favoriteIds, historyIds],
  );

  const toggleList = (key: SublistKey) => setOpenList((prev) => (prev === key ? null : key));

  const renderSublist = (key: SublistKey) => {
    if (openList !== key) return null;
    const books = listBooks[key];
    return (
      <ProfileSublist>
        {books.length === 0 ? (
          <ProfileSublistEmpty />
        ) : (
          books.map((book) => <BookListRow key={`${key}-${book.id}`} book={book} />)
        )}
      </ProfileSublist>
    );
  };

  const initials = userName.trim().slice(0, 1).toUpperCase() || 'L';

  return (
    <Screen variant="mesh">
      <View style={styles.header}>
        <View style={styles.headerSlot} />
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
        <View style={[styles.headerSlot, styles.headerSlotRight]}>
          <IconButton
            icon="search"
            color={colors.slate600}
            background="transparent"
            onPress={() => show('Chức năng tìm kiếm cá nhân.')}
            style={styles.headerButton}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>Độc giả chuyên nghiệp</Text>
          </View>
        </View>

        <View style={styles.coinCard}>
          <View style={styles.coinLeft}>
            <View style={styles.coinIcon}>
              <MaterialIcons name="toll" size={20} color="#CA8A04" />
            </View>
            <View>
              <Text style={styles.coinTitle}>LIMES Xu</Text>
              <Text style={styles.coinValue}>{formatCoins(userCoins)} xu</Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/profile/rewards')}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <LinearGradient
              colors={[colors.amber, '#EAB308']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.coinButton}
            >
              <MaterialIcons name="card-giftcard" size={13} color={colors.white} />
              <Text style={styles.coinButtonText}>Đổi quà & Voucher</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.menu}>
          <ProfileMenuRow
            icon="shopping-bag"
            title="Sách đã mua"
            subtitle="Quản lý thư viện cá nhân"
            expanded={openList === 'purchased'}
            onPress={() => toggleList('purchased')}
          />
          {renderSublist('purchased')}

          <ProfileMenuRow
            icon="favorite"
            title="Sách yêu thích"
            subtitle="Danh sách dấu trang y khoa"
            expanded={openList === 'favorite'}
            onPress={() => toggleList('favorite')}
          />
          {renderSublist('favorite')}

          <ProfileMenuRow
            icon="history"
            title="Lịch sử đọc"
            subtitle="Tiếp tục nghiên cứu"
            expanded={openList === 'history'}
            onPress={() => toggleList('history')}
          />
          {renderSublist('history')}

          <ProfileMenuRow
            icon="menu-book"
            title="Thói quen đọc"
            subtitle="Phân tích học tập và mục tiêu"
            onPress={() => router.push('/profile/reading-habit')}
          />
          <ProfileMenuRow
            icon="manage-accounts"
            title="Cài đặt tài khoản"
            subtitle="Bảo mật và thông báo"
            onPress={() => show('Đang mở cài đặt bảo mật.')}
          />
          <ProfileMenuRow
            icon="help"
            title="Hỗ trợ"
            subtitle="Trợ giúp kỹ thuật"
            onPress={() => show('Trợ giúp kỹ thuật.')}
          />
          <ProfileMenuRow icon="logout" title="Đăng xuất" danger onPress={logout} />
        </View>
      </ScrollView>

      <Toast toast={toast} bottom={spacing.xxxl * 2.5} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerSlot: { width: 40 },
  headerSlotRight: { alignItems: 'flex-end' },
  headerButton: { borderWidth: 0, width: 36, height: 36 },
  logo: { height: 28, width: 108 },

  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl * 2, gap: spacing.xxl },

  identity: { alignItems: 'center' },
  avatarRing: {
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.slate100,
    ...shadow.raised,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: fontSize.h1, fontWeight: '900', color: colors.primary },
  userName: {
    marginTop: spacing.md,
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.slate800,
    textAlign: 'center',
  },
  rolePill: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...shadow.card,
  },
  rolePillText: { color: colors.white, fontSize: fontSize.sm, fontWeight: '800' },

  coinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.lg,
    ...shadow.card,
  },
  coinLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexShrink: 1 },
  coinIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: '#FEF9C3',
    borderWidth: 1,
    borderColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.slate800 },
  coinValue: { fontSize: fontSize.base, fontWeight: '800', color: '#CA8A04', marginTop: 2 },
  coinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  coinButtonText: { color: colors.white, fontSize: fontSize.xs, fontWeight: '900' },
  pressed: { opacity: 0.85 },

  menu: { gap: spacing.md },
});
