import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/theme";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  { id: "seeking",  label: "ابحث عن",        icon: "search-outline" },
  { id: "offering", label: "لدي",            icon: "pricetag-outline" },
  { id: "groups",   label: "مجموعات",         icon: "people-outline" },
  { id: "events",   label: "امسيات وفعاليات", icon: "calendar-outline" },
  { id: "services", label: "خدمات",           icon: "construct-outline" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface PickedImage {
  uri: string;
  base64?: string | null;
}

export default function UploadPostScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [images, setImages] = useState<PickedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ─── Image picking ───────────────────────────────────────────────
  const pickImages = async () => {
    if (images.length >= 5) {
      setErrorMsg("يمكنك رفع ٥ صور كحد أقصى");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setImages((prev) => [
        ...prev,
        ...result.assets.slice(0, 5 - prev.length).map((a) => ({
          uri: a.uri,
          base64: a.base64,
        })),
      ]);
      setErrorMsg("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const newImages = [...images];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  // ─── Upload a single image to Supabase Storage ───────────────────
  const uploadImage = async (image: PickedImage): Promise<string | null> => {
    try {
      if (Platform.OS === "web" && image.base64) {
        // On web, convert base64 to Blob
        const base64Data = image.base64.replace(/^data:image\/\w+;base64,/, "");
        const byteChars = atob(base64Data);
        const byteArray = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteArray[i] = byteChars.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        const fileName = `${user!.id}/${Date.now()}.jpg`;
        const { data, error } = await supabase.storage
          .from("post-images")
          .upload(fileName, blob, { contentType: "image/jpeg" });
        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(data.path);
        return urlData.publicUrl;
      } else {
        // Native: upload via fetch + ArrayBuffer
        const response = await fetch(image.uri);
        const arrayBuffer = await response.arrayBuffer();
        const fileName = `${user!.id}/${Date.now()}.jpg`;
        const { data, error } = await supabase.storage
          .from("post-images")
          .upload(fileName, arrayBuffer, { contentType: "image/jpeg" });
        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(data.path);
        return urlData.publicUrl;
      }
    } catch {
      return null;
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setErrorMsg("");
    if (!title.trim()) {
      setErrorMsg("العنوان مطلوب");
      return;
    }
    if (!category) {
      setErrorMsg("يرجى اختيار تصنيف");
      return;
    }
    if (!user) {
      setErrorMsg("يرجى تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);

    // Upload images
    const uploadedUrls: string[] = [];
    for (const img of images) {
      const url = await uploadImage(img);
      if (url) uploadedUrls.push(url);
    }

    // Find category label for subtitle
    const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label ?? "";

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title: title.trim(),
      subtitle: categoryLabel,
      description: description.trim(),
      images: uploadedUrls,
      tags: [categoryLabel],
      price: null,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (Platform.OS === "web") {
        router.replace("/(main)");
      } else {
        Alert.alert("تم النشر", "تم نشر منشورك بنجاح!", [
          { text: "حسناً", onPress: () => router.replace("/(main)") },
        ]);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* ── Header bar ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 18,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <TouchableOpacity onPress={() => router.back()} disabled={loading}>
            <Ionicons name="close" size={26} color={colors.muted} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Almarai_700Bold",
              fontSize: 18,
              color: colors.primary,
            }}
          >
            إضافة منشور
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? colors.muted : colors.primary,
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text
                style={{
                  fontFamily: "Almarai_700Bold",
                  fontSize: 14,
                  color: "white",
                }}
              >
                نشر
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 18, gap: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Categories ── */}
          <View style={{ gap: 10 }}>
            <Text
              style={{
                fontFamily: "Almarai_700Bold",
                fontSize: 15,
                color: colors.foreground,
                textAlign: "right",
              }}
            >
              التصنيف <Text style={{ color: "#DC2626" }}>*</Text>
            </Text>
            <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map((cat) => {
                const selected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => { setCategory(cat.id); setErrorMsg(""); }}
                    style={{
                      flexDirection: "row-reverse",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? `${colors.primary}12` : "white",
                    }}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={16}
                      color={selected ? colors.primary : colors.muted}
                    />
                    <Text
                      style={{
                        fontFamily: selected ? "Almarai_700Bold" : "Almarai_400Regular",
                        fontSize: 13,
                        color: selected ? colors.primary : colors.muted,
                      }}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Title ── */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontFamily: "Almarai_700Bold",
                fontSize: 15,
                color: colors.foreground,
                textAlign: "right",
              }}
            >
              العنوان <Text style={{ color: "#DC2626" }}>*</Text>
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: title.trim() ? colors.primary : colors.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 4,
                minHeight: 48,
                justifyContent: "center",
              }}
            >
              <TextInput
                placeholder="أضف عنواناً واضحاً لمنشورك..."
                placeholderTextColor={colors.muted}
                value={title}
                onChangeText={(v) => { setTitle(v); setErrorMsg(""); }}
                style={{
                  fontFamily: "Almarai_400Regular",
                  fontSize: 15,
                  color: colors.foreground,
                  textAlign: "right",
                }}
                textAlign="right"
                maxLength={120}
              />
            </View>
            <Text
              style={{
                fontFamily: "Almarai_400Regular",
                fontSize: 11,
                color: colors.muted,
                textAlign: "left",
              }}
            >
              {title.length}/120
            </Text>
          </View>

          {/* ── Photos ── */}
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Almarai_700Bold",
                  fontSize: 15,
                  color: colors.foreground,
                }}
              >
                الصور
              </Text>
              <Text
                style={{
                  fontFamily: "Almarai_400Regular",
                  fontSize: 12,
                  color: colors.muted,
                }}
              >
                {images.length}/5
              </Text>
            </View>

            {/* Image grid */}
            {images.length > 0 && (
              <View
                style={{
                  flexDirection: "row-reverse",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {images.map((img, index) => (
                  <View
                    key={index}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      source={{ uri: img.uri }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    {/* Delete */}
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        borderRadius: 10,
                        width: 22,
                        height: 22,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="close" size={14} color="white" />
                    </TouchableOpacity>
                    {/* Reorder arrows */}
                    <View
                      style={{
                        position: "absolute",
                        bottom: 4,
                        left: 0,
                        right: 0,
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      {index > 0 && (
                        <TouchableOpacity
                          onPress={() => moveImage(index, "left")}
                          style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 8,
                            padding: 3,
                          }}
                        >
                          <Ionicons name="chevron-back" size={14} color="white" />
                        </TouchableOpacity>
                      )}
                      {index < images.length - 1 && (
                        <TouchableOpacity
                          onPress={() => moveImage(index, "right")}
                          style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 8,
                            padding: 3,
                          }}
                        >
                          <Ionicons name="chevron-forward" size={14} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                    {/* First image badge */}
                    {index === 0 && (
                      <View
                        style={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          backgroundColor: colors.primary,
                          borderRadius: 6,
                          paddingHorizontal: 5,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Almarai_700Bold",
                            fontSize: 9,
                            color: "white",
                          }}
                        >
                          رئيسية
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Add photo button */}
            {images.length < 5 && (
              <TouchableOpacity
                onPress={pickImages}
                style={{
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  borderStyle: "dashed",
                  borderRadius: 10,
                  height: 80,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row-reverse",
                  gap: 8,
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Ionicons name="image-outline" size={22} color={colors.muted} />
                <Text
                  style={{
                    fontFamily: "Almarai_400Regular",
                    fontSize: 14,
                    color: colors.muted,
                  }}
                >
                  {images.length === 0
                    ? "أضف صوراً (اختياري، حتى ٥ صور)"
                    : `أضف المزيد (${5 - images.length} متبقية)`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Description ── */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontFamily: "Almarai_700Bold",
                fontSize: 15,
                color: colors.foreground,
                textAlign: "right",
              }}
            >
              التفاصيل
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                minHeight: 120,
              }}
            >
              <TextInput
                placeholder="أضف وصفاً أو تفاصيل إضافية..."
                placeholderTextColor={colors.muted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                style={{
                  fontFamily: "Almarai_400Regular",
                  fontSize: 14,
                  color: colors.foreground,
                  textAlign: "right",
                  textAlignVertical: "top",
                  minHeight: 100,
                }}
                textAlign="right"
                maxLength={1000}
              />
            </View>
            <Text
              style={{
                fontFamily: "Almarai_400Regular",
                fontSize: 11,
                color: colors.muted,
                textAlign: "left",
              }}
            >
              {description.length}/1000
            </Text>
          </View>

          {/* ── Inline error ── */}
          {errorMsg !== "" && (
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#FEE2E2",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
              <Text
                style={{
                  fontFamily: "Almarai_400Regular",
                  fontSize: 13,
                  color: "#DC2626",
                  flex: 1,
                  textAlign: "right",
                }}
              >
                {errorMsg}
              </Text>
            </View>
          )}

          {/* ── Submit button (bottom) ── */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? colors.muted : colors.primary,
              borderRadius: 12,
              minHeight: 52,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
              marginBottom: 24,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                style={{
                  fontFamily: "Almarai_700Bold",
                  fontSize: 16,
                  color: "white",
                }}
              >
                نشر المنشور
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
