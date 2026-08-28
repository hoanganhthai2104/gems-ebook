/**
 * Reward store catalog + grid card, ported from the web app's
 * `mockRewardCatalog` / `renderRewardItems()`.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export type RewardCategory = 'voucher' | 'ebook' | 'gift';

export interface RewardItem {
  id: string;
  title: string;
  category: RewardCategory;
  cost: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  desc: string;
  badge: string;
}

export const REWARD_CATEGORIES: { key: RewardCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'voucher', label: 'Voucher' },
  { key: 'ebook', label: 'Sách & Ebook' },
  { key: 'gift', label: 'Quà Y Khoa' },
];

export const REWARD_CATALOG: RewardItem[] = [
  {
    id: 'rw-1',
    title: 'Voucher Giảm 30K LIMES Shop',
    category: 'voucher',
    cost: 300,
    icon: 'confirmation-number',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    desc: 'Áp dụng cho mọi đơn sách in từ 150K',
    badge: 'Voucher Hot',
  },
  {
    id: 'rw-2',
    title: 'Mã Miễn Phí Vận Chuyển 0Đ',
    category: 'voucher',
    cost: 200,
    icon: 'local-shipping',
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    desc: 'Tối đa 30K phí vận chuyển toàn quốc',
    badge: 'Freeship',
  },
  {
    id: 'rw-3',
    title: 'Ebook ECG Lâm Sàng Toàn Tập',
    category: 'ebook',
    cost: 1000,
    icon: 'menu-book',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    desc: 'Mở khóa bản quyền đọc vĩnh viễn',
    badge: 'Thư viện Ebook',
  },
  {
    id: 'rw-4',
    title: 'Bút Highlight Y Khoa 6 Màu',
    category: 'gift',
    cost: 800,
    icon: 'edit-note',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    desc: 'Quà tặng vật lý giao hàng tận nhà',
    badge: 'Quà độc quyền',
  },
  {
    id: 'rw-5',
    title: 'Voucher Giảm 100K LIMES Mall',
    category: 'voucher',
    cost: 1500,
    icon: 'loyalty',
    iconBg: '#FFE4E6',
    iconColor: '#E11D48',
    desc: 'Áp dụng cho gian hàng chính hãng',
    badge: 'Vip Coupon',
  },
  {
    id: 'rw-6',
    title: 'Sổ Tay Ghi Chép Bệnh Án Lâm Sàng',
    category: 'gift',
    cost: 1200,
    icon: 'assignment',
    iconBg: '#E0E7FF',
    iconColor: '#4F46E5',
    desc: 'Sổ bìa da cao cấp dành cho sinh viên Y',
    badge: 'Quà hot',
  },
];

/** Vietnamese thousands grouping ("2450" -> "2.450") without relying on Intl. */
export function formatCoins(value: number): string {
  return Math.max(0, Math.round(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

interface RewardCardProps {
  item: RewardItem;
  userCoins: number;
  onRedeem: (item: RewardItem) => void;
}

export function RewardCard({ item, userCoins, onRedeem }: RewardCardProps) {
  const canAfford = userCoins >= item.cost;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
            <MaterialIcons name={item.icon} size={17} color={item.iconColor} />
          </View>
          <Text numberOfLines={1} style={styles.badge}>
            {item.badge}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={styles.desc}>
          {item.desc}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.costRow}>
          <MaterialIcons name="toll" size={14} color="#D97706" />
          <Text style={styles.costText}>{item.cost}</Text>
        </View>
        <Pressable
          onPress={() => onRedeem(item)}
          style={({ pressed }) => [
            styles.redeemButton,
            canAfford ? styles.redeemEnabled : styles.redeemDisabled,
            pressed && canAfford && styles.pressed,
          ]}
        >
          <Text style={[styles.redeemText, canAfford ? styles.redeemTextOn : styles.redeemTextOff]}>
            {canAfford ? 'Đổi ngay' : 'Thiếu xu'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate200,
    padding: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.sm,
    ...shadow.card,
  },
  cardTop: { gap: 6 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  iconBox: { width: 32, height: 32, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  badge: {
    flexShrink: 1,
    fontSize: fontSize.xxs,
    fontWeight: '900',
    color: '#B45309',
    backgroundColor: colors.amberSoft,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
    textTransform: 'uppercase',
  },
  title: { fontSize: fontSize.base, fontWeight: '900', color: colors.slate800, lineHeight: 16 },
  desc: { fontSize: fontSize.xxs, fontWeight: '500', color: colors.slate400, lineHeight: 13 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  costText: { fontSize: fontSize.base, fontWeight: '900', color: '#D97706' },
  redeemButton: { paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: radius.pill },
  redeemEnabled: { backgroundColor: colors.primary },
  redeemDisabled: { backgroundColor: colors.slate100 },
  redeemText: { fontSize: fontSize.xxs, fontWeight: '900' },
  redeemTextOn: { color: colors.white },
  redeemTextOff: { color: colors.slate400 },
  pressed: { opacity: 0.85 },
});
