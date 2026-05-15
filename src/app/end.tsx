import { useRef, useState } from "react";
import { DashedLine } from "@/components/paper/DashedLine";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
import { getCardById } from "@/features/game/cardEngine";
import { useGameStore } from "@/features/game/gameStore";
import { SkippedCardRecord } from "@/features/game/gameTypes";

function formatPlayerNames(players: string[]) {
  return players.filter(Boolean).join(" · ");
}

function cleanPrompt(prompt: string) {
  return prompt.replace(/\s+/g, " ").trim();
}

function shortenPrompt(prompt: string, maxLength = 86) {
  const cleaned = cleanPrompt(prompt);
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}…`;
}

export default function EndScreen() {
  const shareRef = useRef<View>(null);

  const [selectedSkip, setSelectedSkip] = useState<SkippedCardRecord | null>(null);
  const [allSkipsVisible, setAllSkipsVisible] = useState(false);

  const session = useGameStore((state) => state.session);
  const resetSession = useGameStore((state) => state.resetSession);

  const hasPlayers = session.players.length > 0;
  const playerNames = formatPlayerNames(session.players);

  const passedOnCount = session.skippedCards.length;
  const saidOutLoudCount = session.cardsDiscussed;
  const cardsPlayedCount = saidOutLoudCount + passedOnCount;

  const skippedPreview = session.skippedCards.slice(0, 2);
  const remainingSkips = Math.max(session.skippedCards.length - 2, 0);

  const selectedCard = selectedSkip ? getCardById(selectedSkip.cardId) : null;

  const handlePlayAgain = () => {
    resetSession();
    router.replace("/setup");
  };

  const handleShare = async () => {
    if (!shareRef.current) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "Sharing unavailable",
          "Sharing is not available on this device."
        );
        return;
      }

      const uri = await captureRef(shareRef, {
        format: "png",
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share your Deep End session",
        UTI: "public.png",
      });
    } catch {
      Alert.alert("Share failed", "The result screen could not be captured.");
    }
  };

  const openSkipDetail = (skip: SkippedCardRecord) => {
    setAllSkipsVisible(false);
    setSelectedSkip(skip);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View ref={shareRef} collapsable={false} style={styles.shareArea}>

          {/* Header */}
          <View style={styles.topSection}>
            <View style={styles.badgeWrap}>
              <View style={styles.badgeShadow} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>THAT'S A WRAP</Text>
              </View>
            </View>

            <Text style={styles.title}>
              You made it to{"\n"}the{" "}
              <Text style={styles.highlight}>deep end</Text>.
            </Text>

            {hasPlayers && (
              <Text style={styles.players}>{playerNames}</Text>
            )}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statWrap}>
              <View style={styles.statShadow} />
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{cardsPlayedCount}</Text>
                <Text style={styles.statLabel}>CARDS{"\n"}PLAYED</Text>
              </View>
            </View>

            <View style={styles.statWrap}>
              <View style={styles.statShadow} />
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{saidOutLoudCount}</Text>
                <Text style={styles.statLabel}>SAID OUT{"\n"}LOUD</Text>
              </View>
            </View>

            <View style={styles.statWrap}>
              <View style={styles.statShadow} />
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{passedOnCount}</Text>
                <Text style={styles.statLabel}>PASSED{"\n"}ON</Text>
              </View>
            </View>
          </View>

          {/* Skips section */}
          {passedOnCount > 0 && (
            <View style={styles.skipsSection}>
              <Text style={styles.sectionLabel}>SKIPS NO ONE EXPLAINED</Text>

              <View style={styles.skipList}>
                {skippedPreview.map((skip, index) => {
                  const card = getCardById(skip.cardId);
                  if (!card) return null;

                  return (
                    <Pressable
                      key={`${skip.cardId}-${index}`}
                      onPress={() => openSkipDetail(skip)}
                      accessibilityRole="button"
                      accessibilityLabel="Open skipped card"
                      style={styles.skipWrap}
                    >
                      <View style={styles.skipShadow} />
                      <View style={styles.skipCard}>
                        <Text
                          style={styles.skipPrompt}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          "{shortenPrompt(card.prompt)}"
                        </Text>
                        {skip.skippedByPlayerName && (
                          <Text style={styles.skipName} numberOfLines={1}>
                            {skip.skippedByPlayerName.toUpperCase()}
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}

                {remainingSkips > 0 && (
                  <Pressable
                    onPress={() => setAllSkipsVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel="View all skipped cards"
                    style={styles.moreSkipsCard}
                  >
                    <Text style={styles.moreSkipsText}>
                      + {remainingSkips} more skip
                      {remainingSkips === 1 ? "" : "s"}
                    </Text>
                    <Text style={styles.moreSkipsMark}>✻</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </View>

        {/* CTAs */}
        <View style={styles.actions}>
          <RaisedButton title="PLAY AGAIN →" onPress={handlePlayAgain} />
          <RaisedButton
            title="SHARE THIS SESSION"
            variant="gold"
            onPress={handleShare}
          />
        </View>
      </ScrollView>

      {/* All skips list modal */}
      <Modal
        visible={allSkipsVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setAllSkipsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setAllSkipsVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Close skipped cards list"
          />

          <View style={styles.listModalWrap}>
            <View style={styles.modalShadow} />

            <View style={styles.listModalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalBadge}>
                  <Text style={styles.modalBadgeText}>PASSED ON</Text>
                </View>

                <Pressable
                  onPress={() => setAllSkipsVisible(false)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close skipped cards list"
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>×</Text>
                </Pressable>
              </View>

              <FlatList
                data={session.skippedCards}
                keyExtractor={(item, index) => `${item.cardId}-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.allSkipsList}
                renderItem={({ item }) => {
                  const card = getCardById(item.cardId);
                  if (!card) return null;

                  return (
                    <Pressable
                      onPress={() => openSkipDetail(item)}
                      accessibilityRole="button"
                      accessibilityLabel="Open skipped card"
                      style={styles.allSkipItem}
                    >
                      <Text style={styles.allSkipPrompt} numberOfLines={2}>
                        "{shortenPrompt(card.prompt, 96)}"
                      </Text>
                      {item.skippedByPlayerName && (
                        <Text style={styles.allSkipName}>
                          {item.skippedByPlayerName.toUpperCase()}
                        </Text>
                      )}
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Single skip detail modal */}
      <Modal
        visible={selectedSkip !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedSkip(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelectedSkip(null)}
            accessibilityRole="button"
            accessibilityLabel="Close skipped card"
          />

          <View style={styles.detailModalWrap}>
            <View style={styles.modalShadow} />

            <View style={styles.detailModalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalBadge}>
                  <Text style={styles.modalBadgeText}>PASSED ON</Text>
                </View>

                <Pressable
                  onPress={() => setSelectedSkip(null)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close skipped card"
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>×</Text>
                </Pressable>
              </View>

              {selectedSkip?.skippedByPlayerName && (
                <Text style={styles.modalPlayer}>
                  {selectedSkip.skippedByPlayerName.toUpperCase()}
                </Text>
              )}

              <Text style={styles.modalPrompt}>
                "{selectedCard ? cleanPrompt(selectedCard.prompt) : ""}"
              </Text>

              <View style={styles.modalFooterWrap}>
  <DashedLine />
  <Text style={styles.modalFooter}>DEEP END</Text>
</View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: paperColors.paper,
  },
  scroll: {
    backgroundColor: paperColors.paper,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
  },
  shareArea: {
    backgroundColor: paperColors.paper,
  },

  // Header
  topSection: {
    alignItems: "center",
    paddingTop: 35,
    marginBottom: 35,
  },
  badgeWrap: {
    position: "relative",
    marginBottom: 40,
  },
  badgeShadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.pill,
  },
  badge: {
    backgroundColor: paperColors.gold,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  badgeText: {
    ...paperType.button,
    color: paperColors.ink,
    fontSize: 12,
    letterSpacing: 3,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "700",
    textAlign: "center",
  },
  highlight: {
    backgroundColor: paperColors.gold,
    color: paperColors.ink,
  },
  players: {
    color: paperColors.ink,
    opacity: 0.58,
    fontSize: 15,
    lineHeight: 20,
    fontStyle: "italic",
    marginTop: 6,
    textAlign: "center",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop:10,
    marginBottom: 30,
  },
  statWrap: {
    flex: 1,
    height: 90,
    position: "relative",
  },
  statShadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: paperColors.paperLight,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  statNumber: {
    color: paperColors.terracotta,
    fontFamily: paperFonts.serif,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "700",
  },
  statLabel: {
    color: paperColors.ink,
    opacity: 0.62,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.8,
    fontWeight: "800",
    textAlign: "center",
  },

  // Skips
  skipsSection: {
    gap: 9,
    marginTop: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    color: paperColors.ink,
    opacity: 0.58,
    fontSize: 11,
    letterSpacing: 2.7,
    fontWeight: "800",
  },
  skipList: {
    gap: 20,
  },
  skipWrap: {
    position: "relative",
  },
  skipShadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.md,
  },
  skipCard: {
    height: 58,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    backgroundColor: paperColors.paperLight,
    paddingHorizontal: paperSpacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: paperSpacing.sm,
  },
  skipPrompt: {
    flex: 1,
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "600",
  },
  skipName: {
    color: paperColors.ink,
    opacity: 0.35,
    fontSize: 11,
    letterSpacing: 1.7,
    fontWeight: "800",
    maxWidth: 76,
    textAlign: "right",
  },
  moreSkipsCard: {
    height: 54,
    borderWidth: 2.5,
    borderStyle: "dashed",
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    backgroundColor: paperColors.paper,
    paddingHorizontal: paperSpacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreSkipsText: {
    color: paperColors.ink,
    opacity: 0.45,
    fontFamily: paperFonts.serif,
    fontSize: 18,
  },
  moreSkipsMark: {
    color: paperColors.terracotta,
    fontFamily: paperFonts.serif,
    fontSize: 20,
  },

  // CTAs
  actions: {
    gap: paperSpacing.md,
    paddingBottom: 1,
    marginTop: paperSpacing.md,
  },

  // Modals shared
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 21, 18, 0.64)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.lg,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: paperSpacing.md,
  },
  modalBadge: {
    backgroundColor: paperColors.gold,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  modalBadgeText: {
    ...paperType.label,
    color: paperColors.ink,
    letterSpacing: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paperColors.paper,
  },
  closeText: {
    color: paperColors.ink,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "700",
  },

  // List modal
  listModalWrap: {
    width: "100%",
    maxWidth: 340,
    height: "68%",
    position: "relative",
  },
  listModalCard: {
    flex: 1,
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    padding: paperSpacing.lg,
  },
  allSkipsList: {
    gap: paperSpacing.sm,
    paddingBottom: paperSpacing.sm,
  },
  allSkipItem: {
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    backgroundColor: paperColors.paper,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
  },
  allSkipPrompt: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  allSkipName: {
    color: paperColors.terracotta,
    fontSize: 10,
    letterSpacing: 1.6,
    fontWeight: "800",
    marginTop: 4,
  },

  // Detail modal
  detailModalWrap: {
    width: "100%",
    maxWidth: 340,
    maxHeight: "68%",
    position: "relative",
  },
  detailModalCard: {
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    padding: paperSpacing.lg,
  },
  modalPlayer: {
    color: paperColors.terracotta,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: paperSpacing.sm,
  },
  modalPrompt: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
  },
  modalFooter: {
    marginTop: paperSpacing.md,
    color: paperColors.terracotta,
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "800",
    textAlign: "center",
  },
  modalFooterWrap: {
  marginTop: paperSpacing.md,
  gap: paperSpacing.sm,
},
});