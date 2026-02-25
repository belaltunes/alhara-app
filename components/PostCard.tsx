import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";
// Carousel only works reliably on native; use horizontal ScrollView on web
const Carousel = Platform.OS !== "web" ? require("react-native-reanimated-carousel").default : null;
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@/types";
import { colors } from "@/constants/theme";
import Badge from "./Badge";
import Avatar from "./Avatar";
import { useToggleSave } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";

const CARD_WIDTH = Dimensions.get("window").width - 36;
const CAROUSEL_HEIGHT = 220;

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggleSave, isPending } = useToggleSave(post.id, user?.id);

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
    await Share.share({ message: `${post.title}\n${post.description}` });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.97}
      onPress={() => router.push(`/post/${post.id}`)}
      style={styles.card}
    >
      {/* Post Header: Avatar (left) + Title/Subtitle (right) */}
      <View style={styles.postHeader}>
        {/* Left: Avatar */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            router.push(`/user/${post.user_id}`);
          }}
          style={styles.avatarContainer}
        >
          <Avatar
            uri={post.user?.avatar_url}
            name={post.user?.display_name}
            size={47}
          />
        </TouchableOpacity>

        {/* Right: Title + Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={2}>
            {post.title}
          </Text>
          {post.subtitle ? (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {post.subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Image Carousel */}
      {post.images && post.images.length > 0 && (
        <View style={styles.carouselContainer}>
          {post.images.length === 1 || Platform.OS === "web" || !Carousel ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ width: CARD_WIDTH, height: CAROUSEL_HEIGHT }}
            >
              {post.images.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={{ width: CARD_WIDTH, height: CAROUSEL_HEIGHT }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <Carousel
              width={CARD_WIDTH}
              height={CAROUSEL_HEIGHT}
              data={post.images}
              renderItem={({ item }: { item: string }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              )}
              loop
              autoPlay={false}
            />
          )}
        </View>
      )}

      {/* Icons: Message + Share */}
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
        <Text style={styles.bodyText} numberOfLines={3}>
          {post.description}
        </Text>
      </View>

      {/* Footer: Save + Tags (left) + Price (right) */}
      <View style={styles.postFooter}>
        {/* Left: Bookmark + Tags */}
        <View style={styles.leftFooter}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isPending}
            style={styles.bookmarkButton}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved ? colors.accent : colors.primary}
            />
          </TouchableOpacity>
          <View style={styles.tagsRow}>
            {post.tags?.slice(0, 3).map((tag, i) => (
              <Badge key={i} label={tag} />
            ))}
          </View>
        </View>

        {/* Right: Price */}
        {post.price ? (
          <Text style={styles.priceText}>{post.price}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fbfcfe",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    marginHorizontal: 18,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  avatarContainer: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingTop: 4,
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
  carouselContainer: {
    width: "100%",
    height: CAROUSEL_HEIGHT,
    backgroundColor: colors.border,
  },
  singleImage: {
    width: "100%",
    height: CAROUSEL_HEIGHT,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    paddingBottom: 8,
  },
  bodyText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.muted,
    textAlign: "right",
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookmarkButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 30,
    minHeight: 30,
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
    textAlign: "right",
  },
});
