import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawerMenu from "@/components/DrawerMenu";

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Header
          onMenuPress={() => setDrawerOpen(true)}
        />
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <Footer />
      </View>
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
