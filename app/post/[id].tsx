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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
const Carousel =
  Platform.OS !== "web"
    ? require("react-native-reanimated-carousel").default
    : null;
import { Ionicons } from "@expo/vector-icons";
import { usePost, useToggleSave } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/theme";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DrawerMenu from "@/components/DrawerMenu";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = 280;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading } = usePost(id);
  const { user } = useAuth();
  const { isSaved, toggleSave, isPending } = useToggleSave(id, user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  if (isLoading || !post) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.pageContainer}>
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

  const hasImages = post.images && post.images.length > 0;
  const imageCount = post.images?.length ?? 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.pageContainer}>
        {/* ── App Header ── */}
        <Header onMenuPress={() => setDrawerOpen(true)} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >

        {/* ── 1. Avatar (left) + Title (right) ── */}
        {/* Web LTR:     avatar FIRST → visual LEFT,  title SECOND → visual RIGHT
            Native RTL:  title  FIRST → visual RIGHT, avatar LAST  → visual LEFT */}
        <View style={styles.postHeader}>
          {/* Avatar — first on web (LEFT), last on native (LEFT in RTL) */}
          {Platform.OS === "web" && (
            <TouchableOpacity
              style={styles.userBlock}
              onPress={() => router.push(`/user/${post.user_id}`)}
              activeOpacity={0.75}
            >
              <Avatar uri={post.user?.avatar_url} name={post.user?.display_name} size={44} />
              <Text style={styles.userName} numberOfLines={1}>
                {post.user?.display_name ?? "مستخدم"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Title — right side on both platforms */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{post.title}</Text>
            {post.subtitle ? (
              <View style={styles.subtitlePill}>
                <Text style={styles.subtitleText}>{post.subtitle}</Text>
              </View>
            ) : null}
          </View>

          {/* Avatar — last on native so RTL places it on the LEFT */}
          {Platform.OS !== "web" && (
            <TouchableOpacity
              style={styles.userBlock}
              onPress={() => router.push(`/user/${post.user_id}`)}
              activeOpacity={0.75}
            >
              <Avatar uri={post.user?.avatar_url} name={post.user?.display_name} size={44} />
              <Text style={styles.userName} numberOfLines={1}>
                {post.user?.display_name ?? "مستخدم"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── 2. Images with slide + counter ── */}
        {hasImages && (
          <View style={styles.imageWrapper}>
            {Platform.OS === "web" || !Carousel ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
              >
                {post.images!.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <Carousel
                width={SCREEN_WIDTH}
                height={IMAGE_HEIGHT}
                data={post.images}
                onSnapToItem={(index: number) => setCurrentImageIndex(index)}
                renderItem={({ item }: { item: string }) => (
                  <Image
                    source={{ uri: item }}
                    style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                    resizeMode="cover"
                  />
                )}
                loop
              />
            )}

            {/* Image counter badge */}
            {imageCount > 1 && (
              <View style={styles.counterBadge}>
                <Ionicons name="images-outline" size={13} color="white" />
                <Text style={styles.counterText}>
                  {currentImageIndex + 1}/{imageCount}
                </Text>
              </View>
            )}

            {/* Dot indicators */}
            {imageCount > 1 && imageCount <= 8 && (
              <View style={styles.dotsRow}>
                {post.images!.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === currentImageIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Action row (under images): Location (left) + Share + Save (right) */}
        <View style={styles.actionsRow}>
          {post.user?.location ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={15} color={colors.muted} />
              <Text style={styles.locationText}>{post.user.location}</Text>
            </View>
          ) : <View style={styles.locationRow} />}
          <View style={styles.actionsGroup}>
            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
              <Ionicons name="arrow-redo-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isPending}
              style={styles.actionBtn}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isSaved ? colors.primary : colors.muted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 3. Body ── */}
        {post.description ? (
          <View style={styles.bodySection}>
            <Text style={styles.bodyText}>{post.description}</Text>
          </View>
        ) : null}

        {/* ── 4. Price (left) + Tags (right) ── */}
        <View style={styles.footerRow}>
          {/* LEFT: Price */}
          {post.price ? (
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>{post.price}</Text>
            </View>
          ) : <View />}

          {/* RIGHT: Tags */}
          <View style={styles.tagsBlock}>
            {post.tags?.map((tag, i) => (
              <Badge key={i} label={tag} />
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Footer />
      </View>
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  pageContainer: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  /* ── 1. Post header ── */
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleBlock: {
    flex: 1,
    gap: 8,
    alignItems: "flex-end",
  },
  title: {
    fontFamily: "Almarai_700Bold",
    fontSize: 18,
    color: colors.foreground,
    textAlign: "right",
    lineHeight: 26,
  },
  subtitlePill: {
    alignSelf: "flex-end",
    backgroundColor: `${colors.primary}12`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  subtitleText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 12,
    color: colors.primary,
  },
  userBlock: {
    alignItems: "center",
    gap: 4,
    minWidth: 60,
    maxWidth: 80,
  },
  userName: {
    fontFamily: "Almarai_700Bold",
    fontSize: 12,
    color: colors.foreground,
    textAlign: "center",
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

  /* ── 2. Images ── */
  imageWrapper: {
    width: "100%",
    height: IMAGE_HEIGHT,
    backgroundColor: colors.border,
    position: "relative",
  },
  counterBadge: {
    position: "absolute",
    bottom: 30,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  counterText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 12,
    color: "white",
  },
  dotsRow: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    backgroundColor: "white",
    width: 16,
    borderRadius: 3,
  },

  /* ── Actions row ── */
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── 3. Body ── */
  bodySection: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  bodyText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 15,
    color: colors.muted,
    textAlign: "right",
    lineHeight: 24,
    paddingTop: 18,
    paddingBottom: 18,
  },

  /* ── 4. Footer: tags + price ── */
  footerRow: {
    flexDirection: "row",
    direction: "ltr",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  tagsBlock: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "right",
  },
  pricePill: {
    backgroundColor: `${colors.accent}15`,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  priceText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 15,
    color: colors.accent,
  },
});
