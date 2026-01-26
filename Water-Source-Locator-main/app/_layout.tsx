import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { LanguageProvider } from "./context/LanguageContext";

export default function RootLayout() {
  return (
    <LanguageProvider>
      {/* Hide the default status bar */}
      <StatusBar style="auto" hidden={false} />

      {/* Add a custom padding to move content below the status bar */}
      <View style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </LanguageProvider>
  );
}
