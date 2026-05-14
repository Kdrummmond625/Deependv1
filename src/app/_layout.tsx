import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { useHydrateSettings } from "@/hooks/useHydrateSettings";

export default function RootLayout() {
  useHydrateSettings();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.forest,
          },
        }}
      />
    </GestureHandlerRootView>
  );
}