import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";

type AppTextInputProps = TextInputProps;

export function AppTextInput({ style, ...props }: AppTextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.mutedCream}
      selectionColor={colors.gold}
      underlineColorAndroid="transparent"
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    color: colors.cream,
    fontSize: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
});