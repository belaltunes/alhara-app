import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Share,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading } = usePost(id);
  const { user } = useAuth();
  const { isSaved, toggleSave, isPending } = useToggleSave(id, user?.id);

  const handleSave = () => toggleSave();

  const handleShare = async () => {
    if (!post) return;
    await Share.share({ message: `${post.title}\n${post.description}` });
  };

  if (isLoading || !post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Minimal top bar: back + save + share ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarActions}>
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
              color={isSaved ? colors.primary : colors.primary}
              style={{ opacity: isSaved ? 1 : 0.45 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* ── Images ── */}
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
            {/* Image count badge */}
            {post.images.length > 1 && (
              <View style={styles.imageBadge}>
                <Ionicons name="images-outline" size={13} color="white" />
                <Text style={styles.imageBadgeText}>{post.images.length}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Post body ── */}
        <View style={styles.body}>
          {/* Title + subtitle */}
          <Text style={styles.title}>{post.title}</Text>
          {post.subtitle ? (
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>{post.subtitle}</Text>
            </View>
          ) : null}

          {/* Price */}
          {post.price ? (
            <View style={styles.priceRow}>
              <Text style={styles.price}>{post.price}</Text>
            </View>
          ) : null}

          {/* Description */}
          {post.description ? (
            <Text style={styles.description}>{post.description}</Text>
          ) : null}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {post.tags.map((tag, i) => (
                <Badge key={i} label={tag} />
              ))}
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Posted by */}
          <TouchableOpacity
            style={styles.userRow}
            onPress={() => router.push(`/user/${post.user_id}`)}
            activeOpacity={0.75}
          >
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {post.user?.display_name ?? "مستخدم"}
              </Text>
              {post.user?.location ? (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color={colors.muted} />
                  <Text style={styles.locationText}>{post.user.location}</Text>
                </View>
              ) : null}
            </View>
            <Avatar
              uri={post.user?.avatar_url}
              name={post.user?.display_name}
              size={44}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "white",
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: colors.border,
  },
  imageBadge: {
    position: "absolute",
    bottom: 10,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  imageBadgeText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 12,
    color: "white",
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 12,
  },
  title: {
    fontFamily: "Almarai_700Bold",
    fontSize: 20,
    color: colors.foreground,
    textAlign: "right",
    lineHeight: 30,
  },
  subtitleRow: {
    alignSelf: "flex-end",
    backgroundColor: `${colors.primary}12`,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  subtitle: {
    fontFamily: "Almarai_400Regular",
    fontSize: 13,
    color: colors.primary,
  },
  priceRow: {
    alignSelf: "flex-end",
    backgroundColor: `${colors.accent}15`,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  price: {
    fontFamily: "Almarai_700Bold",
    fontSize: 16,
    color: colors.accent,
  },
  description: {
    fontFamily: "Almarai_400Regular",
    fontSize: 15,
    color: colors.muted,
    textAlign: "right",
    lineHeight: 24,
  },
  tagsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  userInfo: {
    alignItems: "flex-end",
    gap: 3,
  },
  userName: {
    fontFamily: "Almarai_700Bold",
    fontSize: 15,
    color: colors.foreground,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 12,
    color: colors.muted,
  },
});
