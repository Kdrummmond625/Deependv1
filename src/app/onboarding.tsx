import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { PaperScreen } from "@/components/paper/PaperScreen";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
import { setOnboardingCompleted } from "@/features/onboarding/onboardingStorage";

type OnboardingSlide = {
  eyebrow: string;
  title: string;
  body: string;
  cardLabel: string;
  cardText: string;
};

const slides: OnboardingSlide[] = [
  {
    eyebrow: "HOW TO PLAY",
    title: "Pull a card.",
    body: "Read it out loud. Answer what you would actually do.",
    cardLabel: "ASK / ASSUME",
    cardText: "Someone goes quiet. Do you ask what changed or assume you know?",
  },
  {
    eyebrow: "THE ROOM ANSWERS",
    title: "Same card. Different choices.",
    body: "Everyone gets the same situation. The difference is what people choose.",
    cardLabel: "PUSH / PULL",
    cardText: "Connection moves. Even when nothing is said.",
  },
  {
    eyebrow: "NO PERFECT ANSWERS",
    title: "Say it before you polish it.",
    body: "The point is not sounding right. The point is hearing what comes up.",
    cardLabel: "KEEP / RELEASE",
    cardText: "A strategy almost worked once. Do you keep returning to it or update it?",
  },
  {
    eyebrow: "READY",
    title: "Now get in.",
    body: "Choose a deck. Read the card. Let the room answer.",
    cardLabel: "DEEP END",
    cardText: "Everyday situations. Choices you have to say out loud.",
  },
];

export default function OnboardingScreen() {
  const [slideIndex, setSlideIndex] = useState(0);

  const slide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;

  const progressItems = useMemo(() => {
    return slides.map((_, index) => index <= slideIndex);
  }, [slideIndex]);

  const finishOnboarding = async () => {
    await setOnboardingCompleted();
    router.replace("/setup");
  };

  const skipOnboarding = async () => {
    await setOnboardingCompleted();
    router.replace("/setup");
  };

  const goNext = async () => {
    if (isLastSlide) {
      await finishOnboarding();
      return;
    }

    setSlideIndex((current) => current + 1);
  };

  return (
    <PaperScreen style={styles.screenContent}>
      <View style={styles.container}>
        <View style={styles.progressRow}>
          {progressItems.map((isActive, index) => (
            <View
              key={index}
              style={[
                styles.progressTrack,
                isActive && styles.progressTrackActive,
                index === slideIndex && styles.progressCurrent,
              ]}
            />
          ))}
        </View>

        <View style={styles.centerContent}>
          <View style={styles.sampleCardWrap}>
            <View style={styles.sampleShadow} />

            <View style={styles.sampleCard}>
              <View style={styles.sampleTopRow}>
                <View style={styles.sampleBadge}>
                  <Text style={styles.sampleBadgeText}>{slide.cardLabel}</Text>
                </View>

                <Text style={styles.sampleMark}>✻</Text>
              </View>

              <Text style={styles.sampleText}>{slide.cardText}</Text>

              <View style={styles.sampleFooter}>
                <Text style={styles.sampleFooterText}>DEEP END</Text>
              </View>
            </View>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.body}>{slide.body}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <RaisedButton
            title={isLastSlide ? "PLAY →" : "NEXT →"}
            onPress={goNext}
          />

          {!isLastSlide && (
            <Pressable
              onPress={skipOnboarding}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  progressRow: {
    flexDirection: "row",
    gap: 7,
    height: 10,
    alignItems: "center",
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: paperRadii.pill,
    borderWidth: 1.5,
    borderColor: paperColors.ink,
    backgroundColor: paperColors.paper,
  },
  progressTrackActive: {
    backgroundColor: paperColors.gold,
  },
  progressCurrent: {
    backgroundColor: paperColors.terracotta,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: paperSpacing.xxl,
  },
  sampleCardWrap: {
    width: "100%",
    maxWidth: 248,
    minHeight: 210,
    position: "relative",
  },
  sampleShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.lg,
  },
  sampleCard: {
    minHeight: 210,
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    padding: paperSpacing.lg,
    justifyContent: "space-between",
    transform: [{ rotate: "-2deg" }],
  },
  sampleTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sampleBadge: {
    backgroundColor: paperColors.gold,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sampleBadgeText: {
    ...paperType.label,
    color: paperColors.ink,
    letterSpacing: 1.7,
  },
  sampleMark: {
    color: paperColors.terracotta,
    fontFamily: paperFonts.serif,
    fontSize: 23,
  },
  sampleText: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: paperSpacing.xs,
  },
  sampleFooter: {
    borderTopWidth: 1.5,
    borderTopColor: paperColors.ink,
    borderStyle: "dashed",
    paddingTop: paperSpacing.sm,
    alignItems: "center",
  },
  sampleFooterText: {
    color: paperColors.terracotta,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: "800",
  },
  copyBlock: {
    alignItems: "center",
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
  },
  eyebrow: {
    ...paperType.label,
    color: paperColors.terracotta,
    letterSpacing: 2.6,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    color: paperColors.ink,
    opacity: 0.68,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 286,
  },
  actions: {
    gap: paperSpacing.md,
    paddingBottom: 2,
  },
  skipButton: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: paperColors.ink,
    opacity: 0.58,
    fontSize: 13,
    fontWeight: "600",
  },
});