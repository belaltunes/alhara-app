import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/PostCard";
import { colors } from "@/constants/theme";
import { Post } from "@/types";

export default function FeedScreen() {
  const { data: posts, isLoading, isError, refetch, isRefetching } = usePosts();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>حدث خطأ أثناء تحميل المنشورات</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item: Post) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>لا توجد منشورات بعد</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  errorText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
  },
  listContent: {
    paddingVertical: 8,
  },
});
