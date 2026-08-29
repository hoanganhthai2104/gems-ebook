/**
 * "Tóm tắt chương bằng AI" bottom modal (#ai-summary-modal on web).
 * The summary bullets are static demo copy, exactly as authored on the web.
 */
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Toast, useToast } from '@/components/toast';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

interface SummaryPoint {
  label: string;
  text: string;
}

const SUMMARY_CHAPTER_LABEL = 'CHƯƠNG 12';
const SUMMARY_CHAPTER_TITLE = 'Pharmacokinetics of Anticoagulants';

const SUMMARY_POINTS: SummaryPoint[] = [
  {
    label: 'Cơ chế Heparin:',
    text: 'Liên kết với antithrombin III, thúc đẩy hoạt động của nó lên gấp 1000 lần để ức chế thrombin (Yếu tố IIa) và Yếu tố Xa.',
  },
  {
    label: 'Tác động Warfarin:',
    text: 'Ức chế VKORC1, làm cạn kiệt nguồn dự trữ vitamin K chức năng và giảm tổng hợp các yếu tố đông máu II, VII, IX, và X.',
  },
  {
    label: 'Ưu điểm DOACs:',
    text: 'Các thuốc chống đông máu đường uống trực tiếp cung cấp dược động học có thể dự đoán được mà không cần theo dõi INR thường xuyên như Warfarin.',
  },
  {
    label: 'Chỉ định theo dõi:',
    text: 'Theo dõi aPTT là cần thiết đối với Heparin chưa phân đoạn, trong khi LMWH và DOACs thường không yêu cầu theo dõi định kỳ.',
  },
];

/** Clipboard payload, byte-for-byte the web's copySummaryText() string. */
function buildSummaryText(): string {
  const bullets = SUMMARY_POINTS.map((point) => `- ${point.label} ${point.text}`).join('\n');
  return `Tóm tắt chương bằng AI: ${SUMMARY_CHAPTER_TITLE}\n\n${bullets}`;
}

interface AiSummaryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AiSummaryModal({ visible, onClose }: AiSummaryModalProps) {
  const { toast, show } = useToast();

  const handleCopy = () => {
    Clipboard.setStringAsync(buildSummaryText())
      .then(() => show('Đã sao chép nội dung tóm tắt.', 'success'))
      .catch(() => show('Không thể sao chép.', 'warning'));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={() => undefined}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <MaterialIcons name="auto-awesome" size={16} color="#0284C7" />
              </View>
              <Text style={styles.headerTitle}>Tóm tắt chương bằng AI</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <MaterialIcons name="close" size={20} color={colors.slate500} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            <Text style={styles.chapterLabel}>{SUMMARY_CHAPTER_LABEL}</Text>
            <Text style={styles.chapterTitle}>{SUMMARY_CHAPTER_TITLE}</Text>
            <View style={styles.points}>
              {SUMMARY_POINTS.map((point) => (
                <View key={point.label} style={styles.point}>
                  <View style={styles.pointCheck}>
                    <MaterialIcons name="check" size={11} color="#0284C7" />
                  </View>
                  <Text style={styles.pointText}>
                    <Text style={styles.pointLabel}>{point.label}</Text> {point.text}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </Pressable>
            <Pressable onPress={handleCopy} style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}>
              <MaterialIcons name="content-copy" size={14} color={colors.white} />
              <Text style={styles.copyButtonText}>Sao chép</Text>
            </Pressable>
          </View>
        </Pressable>

        <Toast toast={toast} />
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.slate100,
    overflow: 'hidden',
    ...shadow.raised,
  },
  handleWrap: { alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.xs },
  handle: { width: 40, height: 4, borderRadius: radius.pill, backgroundColor: colors.slate200 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.base,
    fontWeight: '900',
    color: colors.slate800,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flexShrink: 1,
  },
  body: { maxHeight: 380 },
  bodyContent: { padding: spacing.xl },
  chapterLabel: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  chapterTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.slate900, lineHeight: 20 },
  points: { marginTop: spacing.lg, gap: 14 },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  pointCheck: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pointText: { flex: 1, fontSize: fontSize.sm, color: colors.slate600, lineHeight: 18, fontWeight: '600' },
  pointLabel: { color: colors.slate800, fontWeight: '700' },
  footer: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  closeButton: {
    flex: 1,
    backgroundColor: colors.slate100,
    paddingVertical: 11,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  closeButtonText: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate700 },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  copyButtonText: { fontSize: fontSize.base, fontWeight: '700', color: colors.white },
});
