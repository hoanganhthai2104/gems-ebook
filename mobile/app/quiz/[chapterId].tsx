/**
 * Post-chapter knowledge check. Ported from the web's #view-quiz plus
 * js/modules/quiz.js: one question at a time, "Kiểm tra" to submit, per-option
 * rationale and a medical explanation on reveal, then a score summary that
 * awards LIMES Xu.
 */
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader, EmptyState, Screen } from '@/components/screen';
import { Button, ProgressBar } from '@/components/ui';
import { QuizExplanationPanel, QuizResultPanel } from '@/components/quiz-feedback';
import { QuizOptionCard } from '@/components/quiz-option-card';
import { getChapter } from '@/data/chapters';
import { COINS_PER_CORRECT_ANSWER, getQuizForChapter } from '@/data/quizzes';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();

  const addCoins = useAppStore((s) => s.addCoins);
  const chapter = getChapter(chapterId);
  const questions = useMemo(() => getQuizForChapter(chapterId), [chapterId]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const handleSubmit = useCallback(() => {
    if (selected === null || !question) return;
    setAnswered(true);
    if (selected === question.correctIndex) setCorrectCount((count) => count + 1);
  }, [selected, question]);

  const handleAdvance = useCallback(() => {
    if (!isLast) {
      setIndex((current) => current + 1);
      setSelected(null);
      setAnswered(false);
      return;
    }
    const finalScore = correctCount * COINS_PER_CORRECT_ANSWER;
    if (finalScore > 0) addCoins(finalScore);
    setFinished(true);
  }, [isLast, correctCount, addCoins]);

  const handleRetry = useCallback(() => {
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
  }, []);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  if (questions.length === 0 || !question) {
    return (
      <Screen variant="surface">
        <AppHeader title="Kiểm tra kiến thức" showBack onBack={handleBack} compact />
        <EmptyState
          icon="quiz"
          title="Chương này chưa có bài trắc nghiệm."
          message="Hãy quay lại đọc sách và thử một chương khác."
        />
      </Screen>
    );
  }

  if (finished) {
    return (
      <Screen variant="surface">
        <AppHeader title="Kiểm tra kiến thức" showBack onBack={handleBack} compact />
        <ScrollView contentContainerStyle={styles.body}>
          <QuizResultPanel
            correctCount={correctCount}
            total={questions.length}
            coinsEarned={correctCount * COINS_PER_CORRECT_ANSWER}
            onRetry={handleRetry}
            onBackToReader={handleBack}
          />
        </ScrollView>
      </Screen>
    );
  }

  const progress = (index + (answered ? 1 : 0)) / questions.length;
  const isCorrectAnswer = selected === question.correctIndex;

  return (
    <Screen variant="surface">
      <AppHeader title="Kiểm tra kiến thức" showBack onBack={handleBack} compact />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            Câu {index + 1}/{questions.length}
          </Text>
          <ProgressBar progress={progress} height={8} style={styles.progressBar} />
        </View>

        {chapter ? (
          <View style={styles.contextRow}>
            <MaterialIcons name="menu-book" size={14} color={colors.slate500} />
            <Text numberOfLines={1} style={styles.contextText}>
              Chương: {chapter.title}
            </Text>
          </View>
        ) : null}

        <View style={styles.questionBlock}>
          <Text style={styles.question}>{question.question}</Text>
          {question.desc ? <Text style={styles.questionDesc}>{question.desc}</Text> : null}
        </View>

        <View style={styles.options}>
          {question.options.map((option, optionIndex) => (
            <QuizOptionCard
              key={`${index}-${optionIndex}`}
              text={option.text}
              desc={option.desc}
              selected={selected === optionIndex}
              answered={answered}
              isCorrect={optionIndex === question.correctIndex}
              onPress={() => setSelected(optionIndex)}
            />
          ))}
        </View>

        {answered ? (
          <QuizExplanationPanel
            correct={isCorrectAnswer}
            explanation={question.explanation}
            coinsAwarded={COINS_PER_CORRECT_ANSWER}
          />
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <Button
          label={answered ? (isLast ? 'Xem kết quả' : 'Câu tiếp theo') : 'Kiểm tra'}
          onPress={answered ? handleAdvance : handleSubmit}
          disabled={!answered && selected === null}
          fullWidth
        />
        {answered ? null : (
          <View style={styles.hintRow}>
            <MaterialIcons name="lightbulb" size={14} color={colors.amber} />
            <Text style={styles.hintText}>Chọn một đáp án rồi nhấn Kiểm tra.</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  progressLabel: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  progressBar: { flex: 1 },
  contextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  contextText: { flex: 1, fontSize: fontSize.base, color: colors.slate500, fontWeight: '600' },
  questionBlock: { gap: spacing.sm },
  question: { fontSize: fontSize.h3, fontWeight: '800', color: colors.slate900, lineHeight: 26 },
  questionDesc: { fontSize: fontSize.lg, color: colors.slate500, lineHeight: 20 },
  options: { gap: spacing.md },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.slate100,
    backgroundColor: colors.white,
    gap: spacing.sm,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  hintRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  hintText: { fontSize: fontSize.base, color: colors.slate500 },
});
