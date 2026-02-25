import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

interface BadgeProps {
  label: string;
}

export default function Badge({ label }: BadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  label: {
    fontFamily: "Almarai_700Bold",
    fontSize: 12,
    color: colors.foreground,
  },
});
