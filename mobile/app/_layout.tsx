/**
 * Root layout: providers, splash handling, cloud sync bootstrap and the
 * auth gate that routes between onboarding, login and the tab shell.
 */
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore, startCloudSync } from '@/store/app-store';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore - the splash may already be hidden on fast refresh.
});

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    SplashScreen.hideAsync().catch(() => undefined);
    const stopSync = startCloudSync();
    return stopSync;
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthGate />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="reader/[bookId]" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="audiobook/[bookId]" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="quiz/[chapterId]" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="search" options={{ animation: 'fade' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Redirects unauthenticated users to onboarding (first run) or login, and
 * bounces authenticated users out of those screens back into the tabs.
 */
function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);

  useEffect(() => {
    const current = segments[0];
    const onAuthScreen = current === 'onboarding' || current === 'login';

    if (!isLoggedIn) {
      if (!onboardingCompleted && current !== 'onboarding') {
        router.replace('/onboarding');
      } else if (onboardingCompleted && current !== 'login') {
        router.replace('/login');
      }
      return;
    }

    if (onAuthScreen) router.replace('/');
  }, [isLoggedIn, onboardingCompleted, segments, router]);

  return null;
}
