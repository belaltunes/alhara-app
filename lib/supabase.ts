import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// expo-secure-store has a 2048-byte limit per key.
// Supabase session tokens exceed this, so we split them into chunks.
const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number) {
  return `${key}__chunk_${index}`;
}

const NativeStorage = {
  async getItem(key: string): Promise<string | null> {
    const countStr = await SecureStore.getItemAsync(`${key}__count`);
    if (countStr !== null) {
      const count = parseInt(countStr, 10);
      let value = "";
      for (let i = 0; i < count; i++) {
        const chunk = await SecureStore.getItemAsync(chunkKey(key, i));
        if (chunk === null) return null;
        value += chunk;
      }
      return value;
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(chunkKey(key, i), chunks[i]);
    }
    await SecureStore.setItemAsync(`${key}__count`, String(chunks.length));
    // Clean up any old non-chunked entry
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },

  async removeItem(key: string): Promise<void> {
    const countStr = await SecureStore.getItemAsync(`${key}__count`);
    if (countStr !== null) {
      const count = parseInt(countStr, 10);
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(chunkKey(key, i));
      }
      await SecureStore.deleteItemAsync(`${key}__count`);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// On web, use localStorage directly
const WebStorage = {
  getItem: (key: string): Promise<string | null> =>
    Promise.resolve(
      typeof localStorage !== "undefined" ? localStorage.getItem(key) : null
    ),
  setItem: (key: string, value: string): Promise<void> => {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const storage = Platform.OS === "web" ? WebStorage : NativeStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
