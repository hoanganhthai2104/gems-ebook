/**
 * Onboarding slide 1: a 3D stack of real medical book covers.
 * Ported from view-onboarding.html - Vietnamese copy is verbatim.
 */
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SlideCopy, slideStyles, type SlideProps } from '@/components/onboarding-slide-shared';
import { resolveCover } from '@/data/cover-images';
import { colors, radius, shadow, spacing } from '@/theme/tokens';

export function OnboardingSlideLibrary({ width }: SlideProps) {
  return (
    <View style={[slideStyles.slide, { width }]}>
      <View style={styles.showcase}>
        <View style={styles.showcaseGlow} />

        <View style={[styles.sideBookWrap, styles.sideBookLeft]}>
          <View style={styles.sideBook}>
            <Image
              source={resolveCover('covers/nuoc_va_su_song.webp')}
              style={slideStyles.fillImage}
              contentFit="cover"
              transition={150}
            />
          </View>
        </View>

        <View style={[styles.sideBookWrap, styles.sideBookRight]}>
          <View style={styles.sideBook}>
            <Image
              source={resolveCover('covers/chandoanykhoa.webp')}
              style={slideStyles.fillImage}
              contentFit="cover"
              transition={150}
            />
          </View>
        </View>

        <View style={styles.heroBookWrap}>
          <View style={styles.heroBook}>
            <Image
              source={resolveCover('covers/trietly_yhss.webp')}
              style={slideStyles.fillImage}
              contentFit="cover"
              transition={150}
            />
          </View>
          <View style={styles.bookmarkRibbon} />

          <View style={styles.qualityBadgeRow}>
            <View style={styles.qualityBadge}>
              <MaterialIcons name="auto-stories" size={13} color={colors.amber} />
              <Text style={styles.qualityBadgeText}>50+ Đầu Sách Chuyên Khảo</Text>
            </View>
          </View>
        </View>
      </View>

      <SlideCopy
        title="Thư Viện Ebook Y Khoa."
        highlight="Toàn Văn & Chuẩn Mực."
        body="Tiếp cận toàn bộ sách chuyên khảo, phác đồ lâm sàng và công trình nghiên cứu Y Học Sự Sống chọn lọc, tối ưu cho di động."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  showcase: {
    width: '100%',
    maxWidth: 320,
    height: 192,
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showcaseGlow: {
    position: 'absolute',
    left: 32,
    right: 32,
    bottom: 0,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(37,99,235,0.12)',
  },
  sideBookWrap: { position: 'absolute' },
  sideBookLeft: { transform: [{ translateX: -64 }, { translateY: 8 }, { rotate: '-12deg' }] },
  sideBookRight: { transform: [{ translateX: 64 }, { translateY: 8 }, { rotate: '12deg' }] },
  sideBook: {
    width: 96,
    height: 144,
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.6)',
    backgroundColor: colors.white,
    ...shadow.raised,
  },
  heroBookWrap: { transform: [{ translateY: -4 }] },
  heroBook: {
    width: 112,
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.white,
    ...shadow.raised,
  },
  bookmarkRibbon: {
    position: 'absolute',
    top: -2,
    right: 12,
    width: 14,
    height: 32,
    backgroundColor: '#E11D48',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  qualityBadgeRow: { position: 'absolute', left: 0, right: 0, bottom: -12, alignItems: 'center' },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(51,65,85,0.8)',
    ...shadow.raised,
  },
  qualityBadgeText: { color: colors.white, fontSize: 9.5, fontWeight: '700' },
});
