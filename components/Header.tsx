import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/constants/theme";

interface HeaderProps {
  location?: string;
  onMenuPress?: () => void;
}

export default function Header({ location = "برطعة", onMenuPress }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* LEFT — Search */}
      <TouchableOpacity
        style={styles.leftSide}
        onPress={() => router.push("/(main)/search")}
        accessibilityLabel="البحث"
      >
        <Ionicons name="search-outline" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* CENTER — Location */}
      <View style={styles.center} pointerEvents="none">
        <Ionicons name="location-outline" size={18} color="#b5b8e6" />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      {/* RIGHT — Logo + Menu */}
      <View style={styles.rightSide}>
        <TouchableOpacity onPress={() => router.replace("/(main)")}>
          <Text style={styles.logo}>الحارة</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    paddingVertical: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  leftSide: {
    width: 80,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  rightSide: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  logo: {
    fontFamily: "Almarai_700Bold",
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.8,
  },
  menuButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  locationText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 16,
    color: "#b5b8e6",
  },
});
