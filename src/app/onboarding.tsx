import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { AppScreen } from "@/components/AppScreen";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

const slides = [
  {
    title: "How to Play",
    body: "Pick a deck.\nDraw a card.\nRead it out loud.",
  },
  {
    title: "Answer the card",
    body: "Everyone answers what they would do.\nThere are no perfect answers.",
  },
  {
    title: "Let it move",
    body: "Let the conversation go where it goes.\nTap next when you are ready.",
  },
];

export default function OnboardingScreen() {
  const [slideIndex, setSlideIndex] = useState(0);
  const { completeOnboarding } = useOnboardingStatus();

  const currentSlide = slides[slideIndex];
  const isLast = slideIndex === slides.length - 1;

  const handleNext = async () => {
    if (!isLast) {
      setSlideIndex((prev) => prev + 1);
      return;
    }

    await completeOnboarding();
    router.replace("/setup");
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/setup");
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.progressRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressBar,
                index === slideIndex && styles.progressBarActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.body}>{currentSlide.body}</Text>
        </View>

        <View style={styles.bottomActions}>
          <AppButton title={isLast ? "PLAY" : "NEXT"} onPress={handleNext} />

          {!isLast && (
            <Text style={styles.skipText} onPress={handleSkip}>
              Skip
            </Text>
          )}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  progressRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    backgroundColor: "rgba(244,235,221,0.18)",
  },
  progressBarActive: {
    backgroundColor: colors.cream,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.cream,
    textAlign: "center",
  },
  body: {
    ...typography.body,
    color: colors.mutedCream,
    textAlign: "center",
  },
  bottomActions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  skipText: {
    color: colors.mutedCream,
    fontSize: 14,
    textAlign: "center",
  },
});