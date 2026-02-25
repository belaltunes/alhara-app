import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/constants/theme";

interface FooterProps {
  onUserPress?: () => void;
}

export default function Footer({ onUserPress }: FooterProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Left: Search */}
      <TouchableOpacity
        onPress={() => router.push("/(main)/search")}
        style={styles.button}
        accessibilityLabel="البحث"
      >
        <View style={styles.searchCircle}>
          <Ionicons name="search-outline" size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {/* Right: User */}
      <TouchableOpacity
        onPress={onUserPress ?? (() => router.push("/(main)/profile"))}
        style={styles.button}
        accessibilityLabel="الحساب"
      >
        <Ionicons name="person-circle-outline" size={39} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "rgba(191,193,222,0.27)",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  searchCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
