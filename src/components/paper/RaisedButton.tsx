import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { paperColors, paperType } from "@/constants/paperTheme";
import { useGameStore } from "@/features/game/gameStore";

type RaisedButtonVariant = "primary" | "secondary" | "gold" | "danger" | "moss";

type RaisedButtonProps = {
  title: string;
  onPress: () => void;
  variant?: RaisedButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function RaisedButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  accessibilityLabel,
}: RaisedButtonProps) {
  const hapticsEnabled = useGameStore((state) => state.settings.hapticsEnabled);

  const handlePress = async () => {
    if (disabled) return;

    if (hapticsEnabled) {
      await Haptics.selectionAsync();
    }

    onPress();
  };

  const isDarkText = variant === "secondary" || variant === "gold";

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.wrap,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.shadow} />

      <View style={[styles.button, styles[variant]]}>
        <Text style={[styles.text, isDarkText && styles.darkText]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
  },
  shadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: paperColors.ink,
    borderRadius: 999,
  },
  button: {
    minHeight: 54,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: paperColors.terracotta,
  },
  secondary: {
    backgroundColor: paperColors.paperLight,
  },
  gold: {
    backgroundColor: paperColors.gold,
  },
  danger: {
    backgroundColor: paperColors.danger,
  },
  moss: {
    backgroundColor: paperColors.moss,
  },
  text: {
    ...paperType.button,
    color: paperColors.paper,
  },
  darkText: {
    color: paperColors.ink,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
});