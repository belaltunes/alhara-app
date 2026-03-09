import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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

const PASSWORD_RULES = [
  { id: "length",    label: "8 أحرف على الأقل",           test: (p: string) => p.length >= 8 },
  { id: "upper",     label: "حرف كبير واحد على الأقل (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",     label: "حرف صغير واحد على الأقل (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "رقم واحد على الأقل (0-9)",    test: (p: string) => /[0-9]/.test(p) },
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
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordStrong = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignup = async () => {
    setErrorMsg("");

    if (!displayName.trim()) {
      setErrorMsg("يرجى إدخال الاسم");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    if (!passwordStrong) {
      setErrorMsg("كلمة المرور لا تستوفي الشروط المطلوبة");
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg("كلمتا المرور غير متطابقتين");
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
      setErrorMsg(error);
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
              lineHeight: 24,
              marginBottom: 8,
            }}
          >
            تم إنشاء حسابك بنجاح 🎉{"\n"}أرسلنا رابط التأكيد إلى
          </Text>

          <Text
            style={{
              fontFamily: "Almarai_700Bold",
              fontSize: 14,
              color: colors.primary,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {email}
          </Text>

          <Text
            style={{
              fontFamily: "Almarai_400Regular",
              fontSize: 14,
              color: colors.muted,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            يرجى فتح البريد الإلكتروني والنقر على رابط التأكيد لتفعيل حسابك
          </Text>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            className="mt-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor: colors.btnBlue,
              minHeight: 48,
              paddingHorizontal: 40,
            }}
          >
            <Text
              style={{
                fontFamily: "Almarai_700Bold",
                fontSize: 14,
                color: "white",
              }}
            >
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
                  onChangeText={(v) => { setDisplayName(v); setErrorMsg(""); }}
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
                  onChangeText={(v) => { setEmail(v); setErrorMsg(""); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={inputStyle}
                  textAlign="right"
                />
              </View>

              {/* Password */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={[
                  containerStyle,
                  password.length > 0
                    ? { borderColor: passwordStrong ? "#16a34a" : colors.border }
                    : {},
                ]}
              >
                <TextInput
                  placeholder="كلمة المرور"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={(v) => { setPassword(v); setErrorMsg(""); }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  style={inputStyle}
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

              {/* Password requirements checklist */}
              {(passwordFocused || password.length > 0) && (
                <View
                  className="rounded-lg px-3 py-3"
                  style={{ backgroundColor: "#F8F9FA" }}
                >
                  <Text
                    style={{
                      fontFamily: "Almarai_700Bold",
                      fontSize: 12,
                      color: colors.muted,
                      textAlign: "right",
                      marginBottom: 6,
                    }}
                  >
                    يجب أن تحتوي كلمة المرور على:
                  </Text>
                  {PASSWORD_RULES.map((rule) => {
                    const met = rule.test(password);
                    return (
                      <View
                        key={rule.id}
                        className="flex-row-reverse items-center"
                        style={{ marginBottom: 4 }}
                      >
                        <Ionicons
                          name={met ? "checkmark-circle" : "ellipse-outline"}
                          size={16}
                          color={met ? "#16a34a" : colors.muted}
                          style={{ marginLeft: 6 }}
                        />
                        <Text
                          style={{
                            fontFamily: "Almarai_400Regular",
                            fontSize: 12,
                            color: met ? "#16a34a" : colors.muted,
                            textAlign: "right",
                          }}
                        >
                          {rule.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Confirm Password */}
              <View
                className="flex-row-reverse items-center border rounded-lg px-3"
                style={[
                  containerStyle,
                  confirmPassword.length > 0
                    ? { borderColor: passwordsMatch ? "#16a34a" : "#DC2626" }
                    : {},
                ]}
              >
                <TextInput
                  placeholder="تأكيد كلمة المرور"
                  placeholderTextColor={colors.muted}
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); setErrorMsg(""); }}
                  secureTextEntry={!showConfirm}
                  style={inputStyle}
                  textAlign="right"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>

              {/* Password match feedback */}
              {passwordsMatch && (
                <View className="flex-row-reverse items-center" style={{ marginTop: -6 }}>
                  <Ionicons name="checkmark-circle" size={15} color="#16a34a" style={{ marginLeft: 4 }} />
                  <Text style={{ fontFamily: "Almarai_400Regular", fontSize: 12, color: "#16a34a" }}>
                    كلمتا المرور متطابقتان
                  </Text>
                </View>
              )}
              {passwordsMismatch && (
                <View className="flex-row-reverse items-center" style={{ marginTop: -6 }}>
                  <Ionicons name="close-circle" size={15} color="#DC2626" style={{ marginLeft: 4 }} />
                  <Text style={{ fontFamily: "Almarai_400Regular", fontSize: 12, color: "#DC2626" }}>
                    كلمتا المرور غير متطابقتين
                  </Text>
                </View>
              )}

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

              {/* Inline error message */}
              {errorMsg !== "" && (
                <View
                  className="flex-row-reverse items-center rounded-lg px-3 py-2"
                  style={{ backgroundColor: "#FEE2E2" }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#DC2626"
                    style={{ marginLeft: 6 }}
                  />
                  <Text
                    style={{
                      fontFamily: "Almarai_400Regular",
                      fontSize: 13,
                      color: "#DC2626",
                      textAlign: "right",
                      flex: 1,
                    }}
                  >
                    {errorMsg}
                  </Text>
                </View>
              )}

              {/* Create Account Button */}
              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                className="items-center justify-center rounded-lg mt-2"
                style={{
                  backgroundColor: loading ? colors.muted : colors.btnBlue,
                  minHeight: 48,
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
