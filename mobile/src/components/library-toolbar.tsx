/**
 * Library catalog controls: the hub / grid / list view switcher from the web
 * catalog header, and the category chip rail that drives getFilteredBooks().
 */
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CATEGORY_HUBS } from '@/data/catalog';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { Chip } from '@/components/ui';

export type CatalogViewMode = 'hub' | 'grid' | 'list';

/** Short chip labels, taken verbatim from the web library shelf headers. */
const CATEGORY_LABELS: Record<string, string> = {
  all: 'Tất cả',
  yhss: 'Nền Y Học Sự Sống',
  thaoduoc: 'Dược Liệu Học',
  giaiphau: 'Giải Phẫu Học',
  thankinh: 'Thần Kinh Học',
  ditruyen: 'Di Truyền Học',
};

export const CATEGORY_KEYS: string[] = Object.keys(CATEGORY_HUBS);

export function categoryLabel(key: string): string {
  return CATEGORY_LABELS[key] ?? CATEGORY_HUBS[key]?.title ?? key;
}

interface ViewModeSwitchProps {
  mode: CatalogViewMode;
  onChange: (mode: CatalogViewMode) => void;
}

const MODES: { key: CatalogViewMode; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'hub', icon: 'dashboard' },
  { key: 'grid', icon: 'grid-view' },
  { key: 'list', icon: 'view-list' },
];

export function ViewModeSwitch({ mode, onChange }: ViewModeSwitchProps) {
  return (
    <View style={styles.switch}>
      {MODES.map((item) => {
        const active = item.key === mode;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={[styles.switchButton, active && styles.switchButtonActive]}
          >
            <MaterialIcons name={item.icon} size={16} color={active ? colors.white : colors.slate500} />
          </Pressable>
        );
      })}
    </View>
  );
}

interface CategoryChipsProps {
  category: string;
  onChange: (key: string) => void;
}

export function CategoryChips({ category, onChange }: CategoryChipsProps) {
  return (
    <ScrollView
      style={styles.horizontalRail}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRail}
    >
      {CATEGORY_KEYS.map((key) => (
        <Chip
          key={key}
          label={categoryLabel(key)}
          active={key === category}
          onPress={() => onChange(key)}
        />
      ))}
    </ScrollView>
  );
}

interface HubTaglineProps {
  tagline: string;
}

export function HubTagline({ tagline }: HubTaglineProps) {
  return <Text style={styles.tagline}>{tagline}</Text>;
}

const styles = StyleSheet.create({
  /** A horizontal ScrollView stretches to fill its parent's cross axis
   *  unless flexGrow is pinned, which would leave a tall blank gap. */
  horizontalRail: { flexGrow: 0, flexShrink: 0 },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    padding: 4,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  switchButton: { padding: 6, borderRadius: radius.md },
  switchButtonActive: { backgroundColor: colors.primary },
  chipRail: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  tagline: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.slate500,
    fontWeight: '600',
    lineHeight: 15,
  },
});
