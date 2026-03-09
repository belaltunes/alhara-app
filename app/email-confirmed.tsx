import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function EmailConfirmedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        {/* Success icon */}
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: `${colors.primary}15` }}
        >
          <Ionicons name="checkmark-circle" size={56} color={colors.primary} />
        </View>

        {/* Title */}
        <Text
          style={{
            fontFamily: "Almarai_700Bold",
            fontSize: 26,
            color: colors.primary,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          تم تأكيد بريدك الإلكتروني
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontFamily: "Almarai_400Regular",
            fontSize: 15,
            color: colors.muted,
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 40,
          }}
        >
          مرحباً بك في الحارة!{"\n"}حسابك جاهز الآن للاستخدام
        </Text>

        {/* Buttons */}
        <View className="w-full gap-y-3">
          {/* Go to main feed */}
          <TouchableOpacity
            onPress={() => router.replace("/(main)")}
            className="items-center justify-center rounded-lg"
            style={{ backgroundColor: colors.primary, minHeight: 50 }}
          >
            <Text
              style={{
                fontFamily: "Almarai_700Bold",
                fontSize: 15,
                color: "white",
              }}
            >
              الصفحة الرئيسية
            </Text>
          </TouchableOpacity>

          {/* Go to profile */}
          <TouchableOpacity
            onPress={() => router.replace("/(main)/profile")}
            className="items-center justify-center rounded-lg border"
            style={{ borderColor: colors.primary, minHeight: 50 }}
          >
            <Text
              style={{
                fontFamily: "Almarai_700Bold",
                fontSize: 15,
                color: colors.primary,
              }}
            >
              الملف الشخصي
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
