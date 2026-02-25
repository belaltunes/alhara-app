import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSearchPosts } from "@/hooks/usePosts";
import PostCard from "@/components/PostCard";
import { colors } from "@/constants/theme";
import { Post } from "@/types";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debounce = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => setDebouncedQuery(value), 400);
      };
    })(),
    []
  );

  const handleChange = (text: string) => {
    setQuery(text);
    debounce(text);
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  const { data: results, isLoading } = useSearchPosts(debouncedQuery);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          {query.length > 0 ? (
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          ) : (
            <Ionicons name="search-outline" size={20} color={colors.muted} />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="ابحث عن منشورات، مستخدمين، أو وسوم..."
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={handleChange}
          style={styles.input}
          textAlign="right"
          autoFocus
        />
      </View>

      {/* Results */}
      {debouncedQuery.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={60} color={`${colors.primary}40`} />
          <Text style={styles.hintText}>ابدأ البحث عن منشورات</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item: Post) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                لا توجد نتائج لـ "{debouncedQuery}"
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.foreground,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  hintText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 15,
    color: `${colors.muted}`,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  listContent: {
    paddingVertical: 4,
  },
});
