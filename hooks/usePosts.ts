import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Post, SavedPost } from "@/types";
import { MOCK_POSTS } from "@/constants/mockData";

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*, user:users(*)")
          .order("created_at", { ascending: false });
        if (error) throw error;
        // Fall back to mock data if the table is empty or not set up yet
        if (!data || data.length === 0) return MOCK_POSTS;
        return data;
      } catch {
        return MOCK_POSTS;
      }
    },
  });
}

export function usePost(id: string) {
  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, user:users(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUserPosts(userId: string) {
  return useQuery<Post[]>({
    queryKey: ["posts", "user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, user:users(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSavedPosts(userId: string | undefined) {
  return useQuery<SavedPost[]>({
    queryKey: ["saved_posts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_posts")
        .select("*, post:posts(*, user:users(*))")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useToggleSave(postId: string, userId: string | undefined) {
  const qc = useQueryClient();

  const { data: savedPosts } = useSavedPosts(userId);
  const isSaved = savedPosts?.some((s) => s.post_id === postId) ?? false;
  const savedEntry = savedPosts?.find((s) => s.post_id === postId);

  const { mutateAsync: toggleSave, isPending } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      if (isSaved && savedEntry) {
        await supabase.from("saved_posts").delete().eq("id", savedEntry.id);
      } else {
        await supabase.from("saved_posts").insert({ user_id: userId, post_id: postId });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved_posts", userId] });
    },
  });

  return { isSaved, toggleSave, isPending };
}

export function useSearchPosts(query: string) {
  return useQuery<Post[]>({
    queryKey: ["posts", "search", query],
    enabled: query.length > 0,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*, user:users(*)")
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
          return MOCK_POSTS.filter(
            (p) =>
              p.title.includes(query) ||
              p.description.includes(query) ||
              p.tags.some((t) => t.includes(query))
          );
        }
        return data;
      } catch {
        return MOCK_POSTS.filter(
          (p) =>
            p.title.includes(query) ||
            p.description.includes(query) ||
            p.tags.some((t) => t.includes(query))
        );
      }
    },
  });
}
