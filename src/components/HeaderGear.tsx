import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";

type HeaderGearProps = {
  onPress: () => void;
};

export function HeaderGear({ onPress }: HeaderGearProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Open settings"
      style={styles.button}
    >
      <Text style={styles.icon}>⚙︎</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: colors.cream,
    fontSize: 24,
    lineHeight: 24,
  },
});