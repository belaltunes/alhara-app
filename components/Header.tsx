import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/constants/theme";

interface HeaderProps {
  location?: string;
  onMenuPress?: () => void;
}

export default function Header({ location = "برطعة", onMenuPress }: HeaderProps) {
  const router = useRouter();

  const LogoSide = (
    <View style={styles.logoSide}>
      <TouchableOpacity onPress={() => router.replace("/(main)")}>
        <Text style={styles.logo}>الحارة</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu-outline" size={30} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const LocationSide = (
    <View style={styles.locationSide}>
      <Text style={styles.locationText}>{location}</Text>
      <Ionicons name="location-outline" size={22} color="#b5b8e6" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* On web (LTR): location first → left, logo second → right.
          On native (RTL forced): logo first → right, location second → left. */}
      {Platform.OS === "web" ? (
        <>
          {LocationSide}
          {LogoSide}
        </>
      ) : (
        <>
          {LogoSide}
          {LocationSide}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingVertical: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  logoSide: {
    flexDirection: "row",
    alignItems: "center",
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
  locationSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 16,
    color: "#b5b8e6",
  },
});
