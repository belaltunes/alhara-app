import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserPosts, useSavedPosts } from "@/hooks/usePosts";
import { colors } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import PostCard from "@/components/PostCard";
import { Post } from "@/types";

type Tab = "posts" | "saved";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: myPosts, isLoading: postsLoading } = useUserPosts(user?.id ?? "");
  const { data: savedPosts, isLoading: savedLoading } = useSavedPosts(user?.id);

  const handleSignOut = () => {
    Alert.alert("تسجيل الخروج", "هل تريد تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>يرجى تسجيل الدخول أولاً</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLoading = profileLoading;

  const displayData =
    activeTab === "posts"
      ? myPosts ?? []
      : (savedPosts?.map((s) => s.post).filter(Boolean) as Post[]) ?? [];

  return (
    <FlatList
      data={displayData}
      keyExtractor={(item: Post) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            {/* Name + Location + Avatar */}
            <View style={styles.profileInfo}>
              <View style={styles.nameLocation}>
                <Text style={styles.nameText}>
                  {profile?.display_name ?? "مستخدم"}
                </Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationText}>
                    {profile?.location ?? ""}
                  </Text>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.muted}
                  />
                </View>
              </View>
              <Avatar
                uri={profile?.avatar_url}
                name={profile?.display_name}
                size={47}
              />
            </View>

            {/* Sign Out */}
            <TouchableOpacity
              onPress={handleSignOut}
              style={styles.signOutButton}
            >
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              <Text style={styles.signOutText}>تسجيل الخروج</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "saved" && styles.activeTab]}
              onPress={() => setActiveTab("saved")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "saved" && styles.activeTabText,
                ]}
              >
                منشورات محفوظة
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "posts" && styles.activeTab]}
              onPress={() => setActiveTab("posts")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "posts" && styles.activeTabText,
                ]}
              >
                منشوراتي
              </Text>
            </TouchableOpacity>
          </View>

          {(activeTab === "posts" ? postsLoading : savedLoading) && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        !isLoading &&
        !(activeTab === "posts" ? postsLoading : savedLoading) ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              {activeTab === "posts"
                ? "لم تنشر أي منشورات بعد"
                : "لم تحفظ أي منشورات بعد"}
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  profileHeader: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  nameLocation: {
    alignItems: "flex-end",
    gap: 4,
  },
  nameText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 16,
    color: colors.foreground,
    textAlign: "right",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 13,
    color: colors.muted,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    alignSelf: "flex-end",
  },
  signOutText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 13,
    color: "#ef4444",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.muted,
  },
  activeTabText: {
    fontFamily: "Almarai_700Bold",
    color: colors.primary,
  },
  loadingRow: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: colors.btnBlue,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 14,
    color: "white",
  },
});
