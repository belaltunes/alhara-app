import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

const menuItems = [
  { icon: "briefcase-outline" as const, label: "لدي" },
  { icon: "search-outline" as const, label: "ابحث عن" },
  { icon: "calendar-outline" as const, label: "امسيات وفعاليات" },
  { icon: "people-outline" as const, label: "مجموعات" },
  { icon: "cloud-outline" as const, label: "Cloud Storage" },
  { icon: "help-circle-outline" as const, label: "Support" },
];

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const router = useRouter();
  const { session, signOut } = useAuth();

  useEffect(() => {
    if (visible) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 20,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX }] }]}
        >
          <Pressable>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-outline" size={28} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.drawerTitle}>القائمة</Text>
            </View>

            {/* Menu Items */}
            {menuItems.map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem} onPress={onClose}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name={item.icon} size={24} color={colors.primary} />
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            {/* Auth actions */}
            {session ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onClose();
                    router.push("/(main)/profile");
                  }}
                >
                  <Text style={styles.menuLabel}>حسابي</Text>
                  <Ionicons name="person-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                  <Text style={[styles.menuLabel, { color: "#ef4444" }]}>
                    تسجيل الخروج
                  </Text>
                  <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(auth)/login");
                }}
              >
                <Text style={styles.menuLabel}>تسجيل الدخول</Text>
                <Ionicons name="log-in-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  drawer: {
    width: SCREEN_WIDTH * 0.75,
    height: "100%",
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  drawerTitle: {
    fontFamily: "Almarai_700Bold",
    fontSize: 18,
    color: colors.primary,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  menuLabel: {
    fontFamily: "Almarai_400Regular",
    fontSize: 16,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});
