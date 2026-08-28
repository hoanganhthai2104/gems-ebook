/**
 * Social sign-in row for the login screen (Google / Facebook / Zalo / OTP SMS).
 * Ported from view-login.html; the brand SVGs are approximated with glyphs
 * because react-native-svg is not part of this project's dependency set.
 */
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme/tokens';

interface SocialLoginRowProps {
  onGoogle: () => void;
  onFacebook: () => void;
  onZalo: () => void;
  onSms: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SocialLoginRow({ onGoogle, onFacebook, onZalo, onSms, style }: SocialLoginRowProps) {
  return (
    <View style={[styles.row, style]}>
      <CircleButton onPress={onGoogle} accessibilityLabel="Đăng nhập bằng Google">
        <Text style={styles.googleGlyph}>G</Text>
      </CircleButton>

      <CircleButton onPress={onFacebook} accessibilityLabel="Đăng nhập bằng Facebook">
        <MaterialIcons name="facebook" size={24} color="#1877F2" />
      </CircleButton>

      <CircleButton onPress={onZalo} accessibilityLabel="Đăng nhập bằng Zalo">
        <View style={styles.zaloBadge}>
          <Text style={styles.zaloGlyph}>Z</Text>
        </View>
      </CircleButton>

      <CircleButton onPress={onSms} accessibilityLabel="Đăng nhập bằng OTP SĐT">
        <MaterialIcons name="sms" size={24} color="#059669" />
      </CircleButton>
    </View>
  );
}

interface CircleButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
}

function CircleButton({ onPress, accessibilityLabel, children }: CircleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.circle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  pressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  circle: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    ...shadow.card,
  },
  googleGlyph: { fontSize: 20, fontWeight: '900', color: '#4285F4' },
  zaloBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: '#0068FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zaloGlyph: { color: colors.white, fontSize: 12, fontWeight: '900', letterSpacing: -0.5 },
});
