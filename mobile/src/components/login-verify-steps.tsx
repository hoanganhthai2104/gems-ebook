/**
 * OTP verification and success steps of the login flow (steps 2 & 3 of
 * view-login.html). Both are local/demo only - no real OTP is sent.
 */
import { useCallback, useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const CODE_LENGTH = 6;
const EMPTY_CODE: string[] = Array.from({ length: CODE_LENGTH }, () => '');

interface LoginCodeStepProps {
  onBack: () => void;
  onVerified: () => void;
  onResend: () => void;
}

export function LoginCodeStep({ onBack, onVerified, onResend }: LoginCodeStepProps) {
  const [digits, setDigits] = useState<string[]>(EMPTY_CODE);
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const isComplete = digits.every((digit) => digit.length === 1);

  const handleChange = useCallback((value: string, position: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    setDigits((current) => current.map((item, i) => (i === position ? digit : item)));
    if (digit && position < CODE_LENGTH - 1) inputsRef.current[position + 1]?.focus();
  }, []);

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>, position: number) => {
      if (event.nativeEvent.key === 'Backspace' && !digits[position] && position > 0) {
        inputsRef.current[position - 1]?.focus();
      }
    },
    [digits],
  );

  return (
    <View style={styles.step}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Xác minh OTP</Text>
        <Text style={styles.stepSubtitle}>
          Chúng tôi đã gửi mã xác nhận đến số điện thoại / email của bạn
        </Text>
      </View>

      <View style={styles.codeCard}>
        {digits.map((digit, position) => (
          <View key={`code-${position}`} style={styles.codeCell}>
            <TextInput
              ref={(node) => {
                inputsRef.current[position] = node;
              }}
              value={digit}
              onChangeText={(value) => handleChange(value, position)}
              onKeyPress={(event) => handleKeyPress(event, position)}
              keyboardType="number-pad"
              maxLength={1}
              placeholder="0"
              placeholderTextColor={colors.slate300}
              style={styles.codeInput}
            />
            {position < CODE_LENGTH - 1 ? <Text style={styles.codeSeparator}>|</Text> : null}
          </View>
        ))}
      </View>

      <Pressable onPress={onResend} hitSlop={8} style={({ pressed }) => [styles.resend, pressed && styles.pressed]}>
        <Text style={styles.resendText}>Gửi lại mã xác thực</Text>
      </Pressable>

      <View style={styles.stepActions}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>Quay lại</Text>
        </Pressable>
        <Pressable
          onPress={onVerified}
          disabled={!isComplete}
          style={({ pressed }) => [
            styles.continueButton,
            isComplete ? styles.continueEnabled : styles.continueDisabled,
            pressed && isComplete && styles.pressed,
          ]}
        >
          <Text style={[styles.continueText, isComplete && styles.continueTextEnabled]}>Tiếp tục</Text>
        </Pressable>
      </View>
    </View>
  );
}

interface LoginSuccessStepProps {
  onEnter: () => void;
}

export function LoginSuccessStep({ onEnter }: LoginSuccessStepProps) {
  return (
    <View style={styles.step}>
      <View style={styles.stepHeader}>
        <Text style={styles.successTitle}>Đăng nhập thành công!</Text>
        <Text style={styles.stepSubtitle}>Chào mừng bạn quay lại hệ thống LIMES</Text>
      </View>

      <View style={styles.successBadgeWrap}>
        <View style={styles.successBadge}>
          <MaterialIcons name="check" size={30} color={colors.white} />
        </View>
      </View>

      <Pressable onPress={onEnter} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>Bắt đầu trải nghiệm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  step: { width: '100%', alignItems: 'center', gap: spacing.xxl },
  pressed: { opacity: 0.75 },

  stepHeader: { alignItems: 'center', gap: 6 },
  stepTitle: { fontSize: fontSize.h3, fontWeight: '900', color: colors.slate800, letterSpacing: -0.3 },
  successTitle: { fontSize: fontSize.h2, fontWeight: '900', color: colors.slate800, letterSpacing: -0.3 },
  stepSubtitle: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.slate500,
    textAlign: 'center',
    maxWidth: 280,
  },

  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    maxWidth: 320,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    ...shadow.card,
  },
  codeCell: { flexDirection: 'row', alignItems: 'center' },
  codeInput: {
    width: 24,
    textAlign: 'center',
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.slate800,
    padding: 0,
  },
  codeSeparator: { color: colors.slate200, fontSize: fontSize.xl, marginHorizontal: 2 },

  resend: { alignItems: 'center' },
  resendText: { fontSize: fontSize.sm, color: colors.slate500 },

  stepActions: { flexDirection: 'row', gap: 10, width: '100%' },
  secondaryButton: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    ...shadow.card,
  },
  secondaryButtonText: { fontSize: fontSize.base, fontWeight: '600', color: colors.slate700 },
  continueButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  continueDisabled: { backgroundColor: colors.slate50, borderColor: colors.slate200 },
  continueEnabled: { backgroundColor: colors.primary, borderColor: colors.primary },
  continueText: { fontSize: fontSize.base, fontWeight: '600', color: colors.slate400 },
  continueTextEnabled: { color: colors.white },

  successBadgeWrap: { paddingVertical: spacing.xxl, alignItems: 'center' },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  primaryButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    ...shadow.card,
  },
  primaryButtonText: { fontSize: fontSize.base, fontWeight: '600', color: colors.white },
});
