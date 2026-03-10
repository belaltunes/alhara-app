import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@/types";
import { colors } from "@/constants/theme";
import { useToggleSave } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/Avatar";

const TILE_SIZE = (Dimensions.get("window").width - 18 * 2 - 10) / 2;

interface SavedPostTileProps {
  post: Post;
}

export default function SavedPostTile({ post }: SavedPostTileProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggleSave, isPending } = useToggleSave(post.id, user?.id);

  const coverImage = post.images?.[0];

  return (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.85}
      onPress={() => router.push(`/post/${post.id}`)}
    >
      {/* Cover photo */}
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={32} color={colors.muted} />
        </View>
      )}

      {/* Bookmark button — top right */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation?.();
          toggleSave();
        }}
        disabled={isPending}
        style={styles.bookmarkBtn}
      >
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={17}
          color="white"
          style={{ opacity: isSaved ? 1 : 0.7 }}
        />
      </TouchableOpacity>

      {/* Title + user row */}
      <View style={styles.infoBox}>
        <Text style={styles.titleText} numberOfLines={2}>
          {post.title}
        </Text>

        {/* User avatar + name */}
        {post.user && (
          <View style={styles.userRow}>
            <Avatar uri={post.user.avatar_url} name={post.user.display_name} size={20} />
            <Text style={styles.userName} numberOfLines={1}>
              {post.user.display_name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: colors.border,
    margin: 5,
  },
  image: {
    width: "100%",
    height: TILE_SIZE * 0.8,
  },
  imagePlaceholder: {
    width: "100%",
    height: TILE_SIZE * 0.8,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: colors.primary,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    padding: 8,
    gap: 6,
  },
  titleText: {
    fontFamily: "Almarai_700Bold",
    fontSize: 13,
    color: colors.foreground,
    textAlign: "right",
    lineHeight: 19,
  },
  userRow: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  userName: {
    fontFamily: "Almarai_400Regular",
    fontSize: 11,
    color: colors.muted,
    textAlign: "right",
    flexShrink: 1,
  },
});
