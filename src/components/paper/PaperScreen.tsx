import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { paperColors, paperSpacing } from "@/constants/paperTheme";

type PaperScreenProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function PaperScreen({ children, style }: PaperScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: paperColors.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: paperSpacing.xl,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xl,
  },
});