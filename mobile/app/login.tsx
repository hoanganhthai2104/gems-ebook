/**
 * Login screen ported from the web view-login.html.
 * Demo/local auth only: the web app never verified a password either - it just
 * flipped the session flag. Submitting calls the store's `login()`, and the
 * AuthGate in app/_layout.tsx routes the user into the tab shell.
 */
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen';
import { SocialLoginRow } from '@/components/login-social-buttons';
import { LoginCodeStep, LoginSuccessStep } from '@/components/login-verify-steps';
import { Toast, useToast, type ToastMessage } from '@/components/toast';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

type LoginStep = 'email' | 'code' | 'success';

/** Fallback account id used by the web demo build (js/modules/state.js). */
const DEFAULT_USER_ID = 'user_demo_01';

/** Builds a stable local account id out of the typed email / phone number. */
function deriveUserId(identifier: string): string {
  const slug = identifier
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return slug ? `user_${slug}` : DEFAULT_USER_ID;
}

export default function LoginScreen() {
  const login = useAppStore((s) => s.login);
  const { toast, show } = useToast();

  const [step, setStep] = useState<LoginStep>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enterApp = useCallback(
    (account?: string) => {
      const value = (account ?? identifier).trim();
      login({
        userId: deriveUserId(value),
        userEmail: value.includes('@') ? value : '',
      });
    },
    [identifier, login],
  );

  const handleSubmit = useCallback(() => {
    if (!identifier.trim()) {
      setError('Vui lòng nhập Số điện thoại hoặc Email trước!');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu để tiếp tục!');
      return;
    }
    setError(null);
    enterApp();
  }, [enterApp, identifier, password]);

  const handleSocial = useCallback(() => {
    setError(null);
    enterApp();
  }, [enterApp]);

  const handleSms = useCallback(() => {
    if (!identifier.trim()) {
      setError('Vui lòng nhập Số điện thoại hoặc Email trước!');
      return;
    }
    setError(null);
    setStep('code');
  }, [identifier]);

  if (step === 'code') {
    return (
      <LoginShell toast={toast}>
        <LoginCodeStep
          onBack={() => setStep('email')}
          onVerified={() => setStep('success')}
          onResend={() => show('Đã gửi lại mã xác minh mới!', 'success')}
        />
      </LoginShell>
    );
  }

  if (step === 'success') {
    return (
      <LoginShell toast={toast}>
        <LoginSuccessStep onEnter={() => enterApp()} />
      </LoginShell>
    );
  }

  return (
    <LoginShell toast={toast}>
      <View style={styles.brandBlock}>
        <View style={styles.logoBox}>
          <Image source={require('../assets/logo.png')} style={styles.logo} contentFit="contain" />
        </View>
        <Text style={styles.brandName}>LIMES</Text>
      </View>

      <View style={styles.fields}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email hoặc Số điện thoại</Text>
          <View style={styles.inputWrap}>
            <MaterialIcons name="person" size={18} color={colors.slate400} style={styles.inputIcon} />
            <TextInput
              value={identifier}
              onChangeText={(value) => {
                setIdentifier(value);
                if (error) setError(null);
              }}
              placeholder="bacsi.limes@gmail.com hoặc 090..."
              placeholderTextColor={colors.slate400}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Mật khẩu</Text>
            <Pressable
              onPress={() => show('Tính năng lấy lại mật khẩu đang được phát triển.')}
              hitSlop={8}
            >
              <Text style={styles.linkText}>Quên mật khẩu?</Text>
            </Pressable>
          </View>
          <View style={styles.inputWrap}>
            <MaterialIcons name="lock" size={18} color={colors.slate400} style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              placeholderTextColor={colors.slate400}
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable onPress={() => setRemember((value) => !value)} hitSlop={6} style={styles.rememberRow}>
        <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
          {remember ? <MaterialIcons name="check" size={12} color={colors.white} /> : null}
        </View>
        <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
      </Pressable>

      <Pressable onPress={handleSubmit} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>Đăng nhập</Text>
        <MaterialIcons name="login" size={14} color={colors.white} />
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.dividerLine} />
      </View>

      <SocialLoginRow
        onGoogle={handleSocial}
        onFacebook={handleSocial}
        onZalo={handleSocial}
        onSms={handleSms}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Bạn chưa có tài khoản?{' '}
          <Text
            style={styles.linkText}
            onPress={() => show('Chức năng đăng ký đang được tích hợp.')}
          >
            Đăng ký ngay
          </Text>
        </Text>
      </View>
    </LoginShell>
  );
}

/** Shared mesh background + centred, keyboard-aware container for every step. */
function LoginShell({ children, toast }: { children: React.ReactNode; toast: ToastMessage | null }) {
  return (
    <Screen variant="mesh" edgeTop={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast toast={toast} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.75 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  card: { width: '100%', maxWidth: 384, alignItems: 'stretch', gap: spacing.xl },

  brandBlock: { alignItems: 'center', marginBottom: spacing.sm },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: radius.xxl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  logo: { width: '100%', height: '100%' },
  brandName: { fontSize: fontSize.h3, fontWeight: '900', color: colors.slate800, letterSpacing: -0.4 },

  fields: { gap: spacing.lg },
  field: { gap: spacing.xs },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4 },
  fieldLabel: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingLeft: 4,
  },
  linkText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primary },
  inputWrap: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: spacing.lg, zIndex: 1 },
  input: {
    width: '100%',
    height: 44,
    paddingLeft: 44,
    paddingRight: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    fontSize: fontSize.base,
    color: colors.slate800,
    ...shadow.card,
  },
  errorText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.rose, paddingLeft: 4 },

  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingLeft: 4 },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.slate300,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  rememberText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500 },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    paddingVertical: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    ...shadow.card,
  },
  primaryButtonText: { fontSize: fontSize.base, fontWeight: '600', color: colors.white },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.slate200 },
  dividerText: {
    fontSize: fontSize.xxs,
    fontWeight: '900',
    color: colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  footer: { alignItems: 'center', paddingTop: spacing.xs },
  footerText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500, textAlign: 'center' },
});
