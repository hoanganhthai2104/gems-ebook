/**
 * Barrel for the onboarding carousel slides so app/onboarding.tsx imports one
 * module. Each slide lives in its own file under src/components/onboarding-*.
 */
export { OnboardingSlideLibrary } from '@/components/onboarding-slide-library';
export { OnboardingSlideReader } from '@/components/onboarding-slide-reader';
export { OnboardingSlideAnnotations } from '@/components/onboarding-slide-annotations';
export type { SlideProps } from '@/components/onboarding-slide-shared';

export const ONBOARDING_SLIDE_COUNT = 3;
