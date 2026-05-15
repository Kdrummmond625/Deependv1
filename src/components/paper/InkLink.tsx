import { Pressable, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { paperColors } from "@/constants/paperTheme";
import { useGameStore } from "@/features/game/gameStore";

type InkLinkProps = {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function InkLink({ title, onPress, accessibilityLabel }: InkLinkProps) {
  const hapticsEnabled = useGameStore((state) => state.settings.hapticsEnabled);

  const handlePress = async () => {
    if (hapticsEnabled) {
      await Haptics.selectionAsync();
    }

    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={styles.wrap}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center",
    paddingVertical: 4,
  },
  text: {
    color: paperColors.ink,
    fontSize: 13,
    fontWeight: "600",
    borderBottomWidth: 3,
    borderBottomColor: paperColors.gold,
    paddingBottom: 1,
  },
});