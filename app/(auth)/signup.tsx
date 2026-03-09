import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

function getEmailRedirectUrl() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/email-confirmed`;
  }
  return "alhara://email-confirmed";
}

const ARABIC_CITIES = [
  "القدس",
  "رام الله",
  "الخليل",
  "نابلس",
  "جنين",
  "طولكرم",
  "برطعة",
  "يطا",
  "بيت لحم",
  "أريحا",
];

export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async () => {
    if (!displayName.trim()) {
      Alert.alert("خطأ", "يرجى إدخال الاسم");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("خطأ", "يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    if (password.length < 6) {
      Alert.alert("خطأ", "يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    const { error } = await signUp(
      email.trim(),
      password,
      displayName.trim(),
      location,
      getEmailRedirectUrl()
    );
    setLoading(false);

    if (error) {
      Alert.alert("خطأ في إنشاء الحساب", error);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-8">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Ionicons name="mail-outline" size={40} color={colors.primary} />
          </View>
          <Text
            style={{
              fontFamily: "Almarai_700Bold",
              fontSize: 22,
              color: colors.primary,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            تحقق من بريدك الإلكتروني
          </Text>
          <Text
            style={{
              fontFamily: "Almarai_400Regular",
              fontSize: 14,
              color: colors.muted,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            أرسلنا رابط التأكيد إلى{"\n"}
            <Text style={{ color: colors.primary, fontFamily: "Almarai_700Bold" }}>
              {email}
            </Text>
            {"\n"}يرجى النقر على الرابط لتفعيل حسابك
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            className="mt-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: colors.btnBlue, minHeight: 44, paddingHorizontal: 40 }}
          >
            <Text style={{ fontFamily: "Almarai_700Bold", fontSize: 14, color: "white" }}>
              الذهاب إلى تسجيل الدخول
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const inputStyle = {
    flex: 1,
    fontFamily: "Almarai_400Regular",
    fontSize: 14,
    color: colors.foreground,
    textAlign: "right" as const,
  };

  const containerStyle = {
    borderColor: colors.border,
    minHeight: 44,
    backgroundColor: "white",
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center">
            {/* Logo */}
            <View className="mt-16 mb-10">
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

            <View className="w-4/5 gap-y-3">
              {/* Display Name */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={containerStyle}
              >
                <TextInput
                  placeholder="الاسم"
                  placeholderTextColor={colors.muted}
                  value={displayName}
                  onChangeText={setDisplayName}
                  style={inputStyle}
                  textAlign="right"
                />
              </View>

              {/* Email */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={containerStyle}
              >
                <TextInput
                  placeholder="البريد الإلكتروني"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={inputStyle}
                  textAlign="right"
                />
              </View>

              {/* Password */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={containerStyle}
              >
                <TextInput
                  placeholder="كلمة المرور"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={inputStyle}
                  textAlign="right"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={containerStyle}
              >
                <TextInput
                  placeholder="تأكيد كلمة المرور"
                  placeholderTextColor={colors.muted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  style={inputStyle}
                  textAlign="right"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="ml-2">
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>

              {/* Location */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={containerStyle}
              >
                <TextInput
                  placeholder="المدينة / المنطقة"
                  placeholderTextColor={colors.muted}
                  value={location}
                  onChangeText={setLocation}
                  style={inputStyle}
                  textAlign="right"
                />
              </View>

              {/* City suggestions */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row-reverse gap-x-2 py-1">
                  {ARABIC_CITIES.slice(0, 5).map((city) => (
                    <TouchableOpacity
                      key={city}
                      onPress={() => setLocation(city)}
                      className="px-3 py-1 border rounded-full"
                      style={{
                        borderColor:
                          location === city ? colors.primary : colors.border,
                        backgroundColor:
                          location === city ? `${colors.primary}15` : "white",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Almarai_400Regular",
                          fontSize: 12,
                          color:
                            location === city ? colors.primary : colors.muted,
                        }}
                      >
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Create Account Button */}
              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                className="items-center justify-center rounded-lg mt-2"
                style={{ backgroundColor: colors.btnBlue, minHeight: 44 }}
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
                    إنشاء حساب
                  </Text>
                )}
              </TouchableOpacity>

              {/* Already have account */}
              <View className="flex-row-reverse justify-center mt-2">
                <Text
                  style={{
                    fontFamily: "Almarai_400Regular",
                    fontSize: 12,
                    color: colors.muted,
                  }}
                >
                  لديك حساب بالفعل؟{" "}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: "Almarai_400Regular",
                        fontSize: 12,
                        color: colors.accent,
                      }}
                    >
                      تسجيل الدخول
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
