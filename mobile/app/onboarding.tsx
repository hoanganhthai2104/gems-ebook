/**
 * First-time-user onboarding: a 3-slide swipeable carousel ported from the web
 * app (js/modules/onboarding.js + view-onboarding.html).
 * Completing or skipping it flips `onboardingCompleted`; the AuthGate in
 * app/_layout.tsx then routes the user to the login screen.
 */
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ONBOARDING_SLIDE_COUNT,
  OnboardingSlideAnnotations,
  OnboardingSlideLibrary,
  OnboardingSlideReader,
} from '@/components/onboarding-slides';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const HORIZONTAL_PADDING = spacing.xl;
const SLIDE_INDEXES = [0, 1, 2];
/** Guest mode reuses the web app's demo account id (see js/modules/state.js). */
const GUEST_USER_ID = 'user_demo_01';

export default function OnboardingScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const login = useAppStore((s) => s.login);

  const listRef = useRef<FlatList<number>>(null);
  const [index, setIndex] = useState(0);
  const [listHeight, setListHeight] = useState(0);

  const slideWidth = Math.max(1, windowWidth - HORIZONTAL_PADDING * 2);
  const isLastSlide = index === ONBOARDING_SLIDE_COUNT - 1;

  const goToSlide = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), ONBOARDING_SLIDE_COUNT - 1);
      setIndex(clamped);
      listRef.current?.scrollToOffset({ offset: clamped * slideWidth, animated: true });
    },
    [slideWidth],
  );

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      setIndex(Math.round(offsetX / slideWidth));
    },
    [slideWidth],
  );

  const handleListLayout = useCallback((event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height);
  }, []);

  /** "Bỏ qua" and the final CTA both hand the user over to the login screen. */
  const handleComplete = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  /** Guest mode skips login entirely, exactly like completeOnboarding(true) on web. */
  const handleGuest = useCallback(() => {
    completeOnboarding();
    login({ userId: GUEST_USER_ID });
  }, [completeOnboarding, login]);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      handleComplete();
      return;
    }
    goToSlide(index + 1);
  }, [goToSlide, handleComplete, index, isLastSlide]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<number>) => (
      <View style={{ width: slideWidth, height: listHeight }}>
        {item === 0 ? <OnboardingSlideLibrary width={slideWidth} /> : null}
        {item === 1 ? <OnboardingSlideReader width={slideWidth} /> : null}
        {item === 2 ? <OnboardingSlideAnnotations width={slideWidth} /> : null}
      </View>
    ),
    [listHeight, slideWidth],
  );

  return (
    <LinearGradient
      colors={[colors.slate50, colors.white, colors.slate50]}
      style={[styles.root, { paddingTop: insets.top + spacing.xs, paddingBottom: insets.bottom + spacing.sm }]}
    >
      <View style={styles.glowTopRight} pointerEvents="none" />
      <View style={styles.glowBottomLeft} pointerEvents="none" />

      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandLogoBox}>
            <Image source={require('../assets/logo.png')} style={styles.brandLogo} contentFit="contain" />
          </View>
          <Text style={styles.brandName}>LIMES Ebook</Text>
        </View>

        <Pressable onPress={handleComplete} hitSlop={8} style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
          <Text style={styles.skipText}>Bỏ qua</Text>
          <MaterialIcons name="chevron-right" size={16} color={colors.slate400} />
        </Pressable>
      </View>

      <View style={styles.carousel} onLayout={handleListLayout}>
        <FlatList
          ref={listRef}
          data={SLIDE_INDEXES}
          keyExtractor={(item) => `onboarding-slide-${item}`}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={(_, itemIndex) => ({
            length: slideWidth,
            offset: slideWidth * itemIndex,
            index: itemIndex,
          })}
          decelerationRate="fast"
        />
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.dotsRow}>
          {SLIDE_INDEXES.map((slide) => (
            <Pressable
              key={`onboarding-dot-${slide}`}
              onPress={() => goToSlide(slide)}
              hitSlop={10}
              style={[styles.dot, slide === index ? styles.dotActive : styles.dotIdle]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={handleNext} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>{isLastSlide ? 'Khám phá thư viện ngay' : 'Tiếp theo'}</Text>
            <MaterialIcons name="arrow-forward" size={14} color={colors.white} />
          </Pressable>

          {isLastSlide ? (
            <Pressable onPress={handleGuest} hitSlop={8} style={({ pressed }) => [styles.guestLink, pressed && styles.pressed]}>
              <Text style={styles.guestLinkText}>Khám phá ngay (Không cần đăng nhập)</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: HORIZONTAL_PADDING },
  pressed: { opacity: 0.75 },

  glowTopRight: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 320,
    height: 320,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(59,130,246,0.07)',
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: -64,
    left: -64,
    width: 320,
    height: 320,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(56,189,248,0.07)',
  },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandLogoBox: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    ...shadow.card,
  },
  brandLogo: { width: '100%', height: '100%' },
  brandName: { fontSize: fontSize.base, fontWeight: '900', color: colors.slate800, letterSpacing: -0.2 },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  skipText: { fontSize: fontSize.base, fontWeight: '600', color: colors.slate400 },

  carousel: { flex: 1, marginVertical: spacing.xs },

  bottomArea: { alignItems: 'center', gap: spacing.lg, paddingBottom: spacing.sm },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { height: 8, borderRadius: radius.pill },
  dotActive: { width: 28, backgroundColor: colors.primary },
  dotIdle: { width: 8, backgroundColor: colors.slate200 },

  actions: { width: '100%', maxWidth: 320 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    paddingVertical: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    ...shadow.card,
  },
  primaryButtonText: { fontSize: fontSize.base, fontWeight: '700', color: colors.white },
  guestLink: { marginTop: spacing.md, alignItems: 'center' },
  guestLinkText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.slate400 },
});
