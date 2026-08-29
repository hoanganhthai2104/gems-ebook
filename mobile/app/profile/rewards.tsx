/**
 * LIMES Xu reward store - port of the web `view-profile-rewards` panel
 * (coin hero, category tabs, redeemable catalog grid).
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { IconButton } from '@/components/ui';
import {
  REWARD_CATALOG,
  REWARD_CATEGORIES,
  RewardCard,
  formatCoins,
  type RewardCategory,
  type RewardItem,
} from '@/components/profile-reward-card';
import { Toast, useToast } from '@/components/toast';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const DAILY_MISSION_COINS = 15;

export default function RewardsScreen() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [category, setCategory] = useState<RewardCategory | 'all'>('all');

  const userCoins = useAppStore((s) => s.userCoins);
  const addCoins = useAppStore((s) => s.addCoins);
  const addVoucher = useAppStore((s) => s.addVoucher);

  const items = useMemo(
    () => (category === 'all' ? REWARD_CATALOG : REWARD_CATALOG.filter((r) => r.category === category)),
    [category],
  );

  const handleRedeem = (item: RewardItem) => {
    if (userCoins < item.cost) {
      const diff = item.cost - userCoins;
      show(`Bạn cần tích thêm ${formatCoins(diff)} LIMES Xu nữa để đổi món quà này!`, 'warning');
      return;
    }
    addCoins(-item.cost);
    if (item.category === 'voucher') {
      // Redeemed vouchers land in the wallet the web app's Ví Voucher read from.
      addVoucher(item.id);
      show(
        `Chúc mừng! Bạn đã đổi thành công [${item.title}]. Mã đã được thêm vào Ví Voucher của bạn!`,
        'success',
      );
    } else if (item.category === 'ebook') {
      show(`Tuyệt vời! Bản quyền [${item.title}] đã được mở khóa vào Thư viện của bạn!`, 'success');
    } else {
      show(
        `Đăng ký nhận quà [${item.title}] thành công! Bộ phận CSKH sẽ liên hệ giao hàng tận nơi.`,
        'success',
      );
    }
  };

  const handleMission = () => {
    addCoins(DAILY_MISSION_COINS);
    show('Đã nhận nhiệm vụ học tập +15 Xu hôm nay!', 'success');
  };

  return (
    <Screen variant="plain">
      <View style={styles.header}>
        <View style={styles.headerSlot}>
          <IconButton
            icon="arrow-back"
            color={colors.slate600}
            background="transparent"
            style={styles.headerButton}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
          />
        </View>
        <View style={styles.headerCenter}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            Cửa Hàng Đổi Thưởng
          </Text>
          <View style={styles.headerSubRow}>
            <MaterialIcons name="toll" size={10} color="#D97706" />
            <Text style={styles.headerSubtitle}>Tích xu nhận quà Y Khoa</Text>
          </View>
        </View>
        <View style={[styles.headerSlot, styles.headerSlotRight]}>
          <IconButton
            icon="help-outline"
            color="#D97706"
            background="transparent"
            style={styles.headerButton}
            onPress={() => show('Thực hiện bài Quiz hoặc mua hàng để nhận thêm LIMES Xu!', 'info')}
          />
        </View>
      </View>

      <LinearGradient
        colors={[colors.amber, '#FBBF24', '#FACC15']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.hero}
      >
        <View style={styles.heroLeft}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="toll" size={24} color={colors.slate900} />
          </View>
          <View>
            <Text style={styles.heroLabel}>SỐ XU HIỆN CÓ</Text>
            <Text style={styles.heroValue}>{formatCoins(userCoins)} xu</Text>
          </View>
        </View>
        <Pressable onPress={handleMission} style={({ pressed }) => [styles.missionButton, pressed && styles.pressed]}>
          <Text style={styles.missionText}>Nhiệm vụ +15 Xu</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.tabsBar}>
        <ScrollView
      style={styles.horizontalRail} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {REWARD_CATEGORIES.map((tab) => {
            const active = tab.key === category;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setCategory(tab.key)}
                style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.id} style={styles.gridCell}>
              <RewardCard item={item} userCoins={userCoins} onRedeem={handleRedeem} />
            </View>
          ))}
        </View>
      </ScrollView>

      <Toast toast={toast} bottom={spacing.xxl} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  /** A horizontal ScrollView stretches to fill its parent's cross axis
   *  unless flexGrow is pinned, which would leave a tall blank gap. */
  horizontalRail: { flexGrow: 0, flexShrink: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
  },
  headerSlot: { width: 40 },
  headerSlotRight: { alignItems: 'flex-end' },
  headerButton: { borderWidth: 0, width: 36, height: 36 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: fontSize.md, fontWeight: '900', color: colors.slate900 },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  headerSubtitle: { fontSize: fontSize.xxs, fontWeight: '800', color: '#D97706' },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.lg,
    ...shadow.card,
  },
  heroLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexShrink: 1 },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: { fontSize: fontSize.xxs, fontWeight: '800', color: 'rgba(15,23,42,0.8)', letterSpacing: 0.6 },
  heroValue: { fontSize: fontSize.xxl, fontWeight: '900', color: colors.slate900, marginTop: 2 },
  missionButton: {
    backgroundColor: colors.slate900,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    ...shadow.card,
  },
  missionText: { color: '#FCD34D', fontSize: fontSize.xxs, fontWeight: '900' },
  pressed: { opacity: 0.85 },

  tabsBar: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  tabs: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 10 },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1 },
  tabActive: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoftBorder },
  tabIdle: { backgroundColor: colors.white, borderColor: 'transparent' },
  tabLabel: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate600 },
  tabLabelActive: { color: colors.primary, fontWeight: '900' },

  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl * 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  gridCell: { width: '50%', paddingHorizontal: spacing.xs, paddingBottom: spacing.md },
});
