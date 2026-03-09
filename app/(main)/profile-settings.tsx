import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/theme";

const PASSWORD_RULES = [
  { id: "length", label: "8 أحرف على الأقل",             test: (p: string) => p.length >= 8 },
  { id: "upper",  label: "حرف كبير واحد على الأقل (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",  label: "حرف صغير واحد على الأقل (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "رقم واحد على الأقل (0-9)",      test: (p: string) => /[0-9]/.test(p) },
];

type Status = { type: "success" | "error"; message: string } | null;

export default function ProfileSettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // Email section
  const [newEmail, setNewEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<Status>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Password section
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<Status>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const passwordStrong = PASSWORD_RULES.every((r) => r.test(newPassword));
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleUpdateEmail = async () => {
    setEmailStatus(null);
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setEmailStatus({ type: "error", message: "يرجى إدخال بريد إلكتروني صحيح" });
      return;
    }
    if (newEmail.trim() === user?.email) {
      setEmailStatus({ type: "error", message: "هذا هو بريدك الإلكتروني الحالي" });
      return;
    }
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailLoading(false);
    if (error) {
      setEmailStatus({ type: "error", message: error.message });
    } else {
      setEmailStatus({
        type: "success",
        message: "تم إرسال رابط التأكيد إلى بريدك الجديد. يرجى تأكيده لإتمام التغيير.",
      });
      setNewEmail("");
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordStatus(null);
    if (!passwordStrong) {
      setPasswordStatus({ type: "error", message: "كلمة المرور لا تستوفي الشروط المطلوبة" });
      return;
    }
    if (!passwordsMatch) {
      setPasswordStatus({ type: "error", message: "كلمتا المرور غير متطابقتين" });
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      setPasswordStatus({ type: "error", message: error.message });
    } else {
      setPasswordStatus({ type: "success", message: "تم تغيير كلمة المرور بنجاح" });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const inputStyle = {
    flex: 1,
    fontFamily: "Almarai_400Regular" as const,
    fontSize: 14,
    color: colors.foreground,
    textAlign: "right" as const,
  };

  const fieldStyle = {
    borderColor: colors.border,
    minHeight: 48,
    backgroundColor: "white",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Almarai_700Bold",
              fontSize: 18,
              color: colors.primary,
            }}
          >
            إعدادات الحساب
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 28 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Current email info */}
          {user?.email && (
            <View
              style={{
                backgroundColor: "#F8F9FA",
                borderRadius: 10,
                padding: 14,
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name="person-circle-outline" size={22} color={colors.muted} />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: "Almarai_400Regular",
                    fontSize: 12,
                    color: colors.muted,
                  }}
                >
                  البريد الإلكتروني الحالي
                </Text>
                <Text
                  style={{
                    fontFamily: "Almarai_700Bold",
                    fontSize: 14,
                    color: colors.foreground,
                  }}
                >
                  {user.email}
                </Text>
              </View>
            </View>
          )}

          {/* ─── Change Email ─── */}
          <Section title="تغيير البريد الإلكتروني" icon="mail-outline">
            <View
              className="flex-row-reverse items-center border rounded-lg px-3"
              style={fieldStyle}
            >
              <TextInput
                placeholder="البريد الإلكتروني الجديد"
                placeholderTextColor={colors.muted}
                value={newEmail}
                onChangeText={(v) => { setNewEmail(v); setEmailStatus(null); }}
                autoCapitalize="none"
                keyboardType="email-address"
                style={inputStyle}
                textAlign="right"
              />
            </View>

            <StatusBanner status={emailStatus} />

            <TouchableOpacity
              onPress={handleUpdateEmail}
              disabled={emailLoading}
              style={{
                backgroundColor: emailLoading ? colors.muted : colors.btnBlue,
                borderRadius: 10,
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {emailLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={{
                    fontFamily: "Almarai_700Bold",
                    fontSize: 14,
                    color: "white",
                  }}
                >
                  تحديث البريد الإلكتروني
                </Text>
              )}
            </TouchableOpacity>
          </Section>

          {/* ─── Change Password ─── */}
          <Section title="تغيير كلمة المرور" icon="lock-closed-outline">
            {/* New password */}
            <View
              style={[
                {
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                },
                fieldStyle,
                newPassword.length > 0
                  ? { borderColor: passwordStrong ? "#16a34a" : colors.border }
                  : {},
              ]}
            >
              <TextInput
                placeholder="كلمة المرور الجديدة"
                placeholderTextColor={colors.muted}
                value={newPassword}
                onChangeText={(v) => { setNewPassword(v); setPasswordStatus(null); }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showNew}
                style={inputStyle}
                textAlign="right"
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={{ marginLeft: 8 }}>
                <Ionicons
                  name={showNew ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>

            {/* Requirements checklist */}
            {(passwordFocused || newPassword.length > 0) && (
              <View
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: 10,
                  padding: 12,
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Almarai_700Bold",
                    fontSize: 12,
                    color: colors.muted,
                    textAlign: "right",
                    marginBottom: 4,
                  }}
                >
                  يجب أن تحتوي كلمة المرور على:
                </Text>
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(newPassword);
                  return (
                    <View
                      key={rule.id}
                      style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}
                    >
                      <Ionicons
                        name={met ? "checkmark-circle" : "ellipse-outline"}
                        size={16}
                        color={met ? "#16a34a" : colors.muted}
                      />
                      <Text
                        style={{
                          fontFamily: "Almarai_400Regular",
                          fontSize: 12,
                          color: met ? "#16a34a" : colors.muted,
                        }}
                      >
                        {rule.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Confirm password */}
            <View
              style={[
                {
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                },
                fieldStyle,
                confirmPassword.length > 0
                  ? { borderColor: passwordsMatch ? "#16a34a" : "#DC2626" }
                  : {},
              ]}
            >
              <TextInput
                placeholder="تأكيد كلمة المرور"
                placeholderTextColor={colors.muted}
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); setPasswordStatus(null); }}
                secureTextEntry={!showConfirm}
                style={inputStyle}
                textAlign="right"
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>

            {/* Match indicator */}
            {passwordsMatch && (
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 4 }}>
                <Ionicons name="checkmark-circle" size={15} color="#16a34a" />
                <Text style={{ fontFamily: "Almarai_400Regular", fontSize: 12, color: "#16a34a" }}>
                  كلمتا المرور متطابقتان
                </Text>
              </View>
            )}
            {passwordsMismatch && (
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 4 }}>
                <Ionicons name="close-circle" size={15} color="#DC2626" />
                <Text style={{ fontFamily: "Almarai_400Regular", fontSize: 12, color: "#DC2626" }}>
                  كلمتا المرور غير متطابقتين
                </Text>
              </View>
            )}

            <StatusBanner status={passwordStatus} />

            <TouchableOpacity
              onPress={handleUpdatePassword}
              disabled={passwordLoading}
              style={{
                backgroundColor: passwordLoading ? colors.muted : colors.primary,
                borderRadius: 10,
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {passwordLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={{
                    fontFamily: "Almarai_700Bold",
                    fontSize: 14,
                    color: "white",
                  }}
                >
                  تحديث كلمة المرور
                </Text>
              )}
            </TouchableOpacity>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 8,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Ionicons name={icon as any} size={20} color={colors.primary} />
        <Text
          style={{
            fontFamily: "Almarai_700Bold",
            fontSize: 16,
            color: colors.primary,
          }}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function StatusBanner({ status }: { status: Status }) {
  if (!status) return null;
  const isSuccess = status.type === "success";
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "flex-start",
        gap: 8,
        backgroundColor: isSuccess ? "#DCFCE7" : "#FEE2E2",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <Ionicons
        name={isSuccess ? "checkmark-circle-outline" : "alert-circle-outline"}
        size={18}
        color={isSuccess ? "#16a34a" : "#DC2626"}
      />
      <Text
        style={{
          fontFamily: "Almarai_400Regular",
          fontSize: 13,
          color: isSuccess ? "#15803d" : "#DC2626",
          textAlign: "right",
          flex: 1,
          lineHeight: 20,
        }}
      >
        {status.message}
      </Text>
    </View>
  );
}
