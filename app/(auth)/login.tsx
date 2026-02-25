import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const facebookIconUrl =
  "https://www.figma.com/api/mcp/asset/58a9cef1-d596-4b23-9631-bda64ce6316c";
const instagramIconUrl =
  "https://www.figma.com/api/mcp/asset/39063240-a3cf-4b4c-99b5-34d4ca075fb3";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone.trim()) {
      Alert.alert("خطأ", "يرجى إدخال البريد الإلكتروني أو رقم الهاتف");
      return;
    }
    setLoading(true);
    const { error } = await signIn(emailOrPhone.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert("خطأ في تسجيل الدخول", error);
    } else {
      router.replace("/(main)");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center">
            {/* Logo */}
            <View className="mt-24 mb-16">
              <Text
                style={{
                  fontFamily: "Almarai_700Bold",
                  fontSize: 40,
                  color: colors.primary,
                  letterSpacing: -1.6,
                  textAlign: "right",
                }}
              >
                الحارة
              </Text>
            </View>

            {/* Input Fields */}
            <View className="w-4/5 gap-y-3">
              {/* Name Input */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={{
                  borderColor: colors.border,
                  minHeight: 44,
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  placeholder="الاسم"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  style={{
                    flex: 1,
                    fontFamily: "Almarai_400Regular",
                    fontSize: 14,
                    color: colors.foreground,
                    textAlign: "right",
                  }}
                  textAlign="right"
                />
              </View>

              {/* Email/Phone Input */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={{
                  borderColor: colors.border,
                  minHeight: 44,
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  placeholder="البريد الالكتروني او رقم الهاتف"
                  placeholderTextColor={colors.muted}
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={{
                    flex: 1,
                    fontFamily: "Almarai_400Regular",
                    fontSize: 14,
                    color: colors.foreground,
                    textAlign: "right",
                  }}
                  textAlign="right"
                />
              </View>

              {/* Password Input */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={{
                  borderColor: colors.border,
                  minHeight: 44,
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  placeholder="كلمة المرور"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{
                    flex: 1,
                    fontFamily: "Almarai_400Regular",
                    fontSize: 14,
                    color: colors.foreground,
                    textAlign: "right",
                  }}
                  textAlign="right"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="items-center justify-center rounded-lg mt-2"
                style={{
                  backgroundColor: colors.btnBlue,
                  minHeight: 44,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{
                      fontFamily: "Almarai_700Bold",
                      fontSize: 14,
                      color: "white",
                    }}
                  >
                    تسجيل الدخول
                  </Text>
                )}
              </TouchableOpacity>

              {/* Forgot Password + Sign Up links */}
              <View className="flex-row-reverse justify-between mt-1">
                <TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "Almarai_400Regular",
                      fontSize: 12,
                      color: colors.accent,
                    }}
                  >
                    نسيت كلمة المرور؟
                  </Text>
                </TouchableOpacity>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: "Almarai_400Regular",
                        fontSize: 12,
                        color: colors.accent,
                      }}
                    >
                      إنشاء حساب جديد
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Social Login Buttons */}
            <View className="absolute bottom-12 w-60 gap-y-3">
              {/* Facebook */}
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-md"
                style={{ backgroundColor: colors.btnBlue, height: 36 }}
              >
                <Image
                  source={{ uri: facebookIconUrl }}
                  style={{ width: 20, height: 20, marginLeft: 8 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: "Almarai_400Regular",
                    fontSize: 11,
                    color: "white",
                  }}
                >
                  تسجيل الدخول باستخدام Facebook
                </Text>
              </TouchableOpacity>

              {/* Instagram */}
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-md"
                style={{ backgroundColor: colors.btnBlue, height: 36 }}
              >
                <Image
                  source={{ uri: instagramIconUrl }}
                  style={{ width: 20, height: 20, marginLeft: 8 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: "Almarai_400Regular",
                    fontSize: 11,
                    color: "white",
                  }}
                >
                  تسجيل الدخول باستخدام Instagram
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
