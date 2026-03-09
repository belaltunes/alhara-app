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
      {/* Left: Upload Post */}
      <TouchableOpacity
        onPress={() => router.push("/(main)/upload-post")}
        style={styles.button}
        accessibilityLabel="إضافة منشور"
      >
        <View style={styles.uploadCircle}>
          <Ionicons name="add" size={26} color="white" />
        </View>
      </TouchableOpacity>

      {/* Right: User Profile */}
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
  uploadCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
});
