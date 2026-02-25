import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Share,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const Carousel = Platform.OS !== "web" ? require("react-native-reanimated-carousel").default : null;
import { Ionicons } from "@expo/vector-icons";
import { usePost } from "@/hooks/usePosts";
import { useToggleSave } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import { useState } from "react";
import DrawerMenu from "@/components/DrawerMenu";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading } = usePost(id);
  const { user } = useAuth();
  const { isSaved, toggleSave, isPending } = useToggleSave(id, user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("تسجيل الدخول", "يجب تسجيل الدخول لحفظ المنشورات", [
        { text: "إلغاء", style: "cancel" },
        { text: "تسجيل الدخول", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }
    await toggleSave();
  };

  const handleShare = async () => {
    if (!post) return;
    await Share.share({ message: `${post.title}\n${post.description}` });
  };

  if (isLoading || !post) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.container}>
          <Header onMenuPress={() => setDrawerOpen(true)} />
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Footer />
        </View>
        <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Header onMenuPress={() => setDrawerOpen(true)} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <TouchableOpacity
              onPress={() => router.push(`/user/${post.user_id}`)}
              style={styles.avatarContainer}
            >
              <Avatar
                uri={post.user?.avatar_url}
                name={post.user?.display_name}
                size={47}
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{post.title}</Text>
              {post.subtitle ? (
                <Text style={styles.subtitleText}>{post.subtitle}</Text>
              ) : null}
            </View>
          </View>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <View style={styles.imageContainer}>
              {post.images.length === 1 || Platform.OS === "web" || !Carousel ? (
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={{ width: SCREEN_WIDTH, height: 300 }}
                >
                  {post.images.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img }}
                      style={{ width: SCREEN_WIDTH, height: 300 }}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              ) : (
                <Carousel
                  width={SCREEN_WIDTH}
                  height={300}
                  data={post.images}
                  renderItem={({ item }: { item: string }) => (
                    <Image
                      source={{ uri: item }}
                      style={{ width: SCREEN_WIDTH, height: 300 }}
                      resizeMode="cover"
                    />
                  )}
                  loop
                />
              )}
            </View>
          )}

          {/* Icons Row */}
          <View style={styles.iconsRow}>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Ionicons name="arrow-redo-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mail-outline" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Body Text */}
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>{post.description}</Text>
          </View>

          {/* Footer: Price + Tags + Save */}
          <View style={styles.postFooter}>
            <View style={styles.leftFooter}>
              <TouchableOpacity onPress={handleSave} disabled={isPending}>
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color={isSaved ? colors.accent : colors.primary}
                />
              </TouchableOpacity>
              <View style={styles.tagsRow}>
                {post.tags?.map((tag, i) => <Badge key={i} label={tag} />)}
              </View>
            </View>
            {post.price ? (
              <Text style={styles.priceText}>{post.price}</Text>
            ) : null}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
        <Footer />
      </View>
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  avatarContainer: { paddingTop: 4 },
  titleContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  titleText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 16,
    color: colors.accent,
    textAlign: "right",
    lineHeight: 24,
  },
  subtitleText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 13,
    color: colors.muted,
    textAlign: "right",
    marginTop: 2,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: colors.border,
  },
  fullImage: { width: "100%", height: 300 },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 30,
    minHeight: 30,
  },
  bodyContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bodyText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.muted,
    textAlign: "right",
    lineHeight: 22,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  leftFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tagsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 4,
  },
  priceText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 16,
    color: colors.accent,
  },
});
