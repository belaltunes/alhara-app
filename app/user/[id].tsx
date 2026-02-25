import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/useProfile";
import { useUserPosts } from "@/hooks/usePosts";
import { colors } from "@/constants/theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawerMenu from "@/components/DrawerMenu";
import Avatar from "@/components/Avatar";
import PostCard from "@/components/PostCard";
import { Post } from "@/types";
import { useState } from "react";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isLoading: profileLoading } = useProfile(id);
  const { data: posts, isLoading: postsLoading } = useUserPosts(id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const isLoading = profileLoading || postsLoading;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Header onMenuPress={() => setDrawerOpen(true)} />

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item: Post) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.profileHeader}>
                {/* Action icons: chat + star */}
                <View style={styles.actionIcons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons
                      name="star-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Profile info: name + location + avatar */}
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
              </View>
            }
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>لا توجد منشورات</Text>
              </View>
            }
          />
        )}

        <Footer />
      </View>
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1 },
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
    marginBottom: 8,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    padding: 4,
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
  emptyText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.muted,
  },
});
