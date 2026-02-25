export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  location: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  description: string;
  images: string[];
  tags: string[];
  price: string | null;
  created_at: string;
  user?: User;
}

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  post?: Post;
}
