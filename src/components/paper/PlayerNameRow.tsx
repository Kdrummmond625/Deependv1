import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
} from "@/constants/paperTheme";

type PlayerNameRowProps = {
  index: number;
  value: string;
  onChangeText: (value: string) => void;
  onRemove: () => void;
};

export function PlayerNameRow({
  index,
  value,
  onChangeText,
  onRemove,
}: PlayerNameRowProps) {
  const isEmpty = value.trim().length === 0;

  return (
    <View style={styles.row}>
      <View style={styles.numberWrap}>
        <View style={styles.numberShadow} />
        <View
          style={[
            styles.numberCircle,
            index % 3 === 0 && styles.numberTerracotta,
            index % 3 === 1 && styles.numberGold,
          ]}
        >
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
      </View>

      <View style={styles.inputWrap}>
        <View style={styles.inputShadow} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="NAME"
          placeholderTextColor="rgba(7,21,18,0.38)"
          selectionColor={paperColors.terracotta}
          autoCapitalize="words"
          style={[styles.input, isEmpty && styles.emptyInput]}
        />
      </View>

      <Pressable
        onPress={onRemove}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Remove player ${index + 1}`}
        style={[styles.removeButton, isEmpty && styles.removeMuted]}
      >
        <Text style={styles.removeText}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: paperSpacing.sm,
  },
  numberWrap: {
    width: 34,
    height: 34,
    position: "relative",
  },
  numberShadow: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: paperColors.ink,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: paperColors.ink,
    backgroundColor: paperColors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  numberTerracotta: {
    backgroundColor: paperColors.terracotta,
  },
  numberGold: {
    backgroundColor: paperColors.gold,
  },
  numberText: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 14,
    fontWeight: "700",
  },
  inputWrap: {
    flex: 1,
    minHeight: 40,
    position: "relative",
  },
  inputShadow: {
    position: "absolute",
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    borderRadius: paperRadii.sm,
    backgroundColor: paperColors.ink,
  },
  input: {
    minHeight: 40,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.sm,
    backgroundColor: paperColors.paperLight,
    color: paperColors.ink,
    paddingHorizontal: paperSpacing.md,
    fontFamily: paperFonts.serif,
    fontSize: 15,
    fontWeight: "600",
  },
  emptyInput: {
    borderStyle: "dashed",
    fontFamily: undefined,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.6,
    borderColor: paperColors.ink,
    backgroundColor: paperColors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  removeMuted: {
    opacity: 0.45,
  },
  removeText: {
    color: paperColors.ink,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "600",
  },
});