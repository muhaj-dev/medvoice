/**
 * Full-screen searchable language picker. Lists every language QVAC can
 * translate into; a "VOICE" badge marks the four that can also be read aloud.
 * Picking a language sets it and kicks off the one-time on-device translation
 * of just that language (no other language's model is downloaded).
 */
import { useMemo, useState } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ensureCatalog } from "@/lib/i18n";
import { LANGUAGES, type Lang, type LanguageMeta } from "@/constants/strings";

type Props = { visible: boolean; onClose: () => void };

export function LanguagePickerModal({ visible, onClose }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.nativeName.toLowerCase().includes(q) ||
        l.englishName.toLowerCase().includes(q) ||
        l.code.includes(q)
    );
  }, [query]);

  const handleSelect = (lang: Lang) => {
    if (lang !== language) {
      void setLanguage(lang);
      void ensureCatalog(lang); // translate only the chosen language, once
    }
    setQuery("");
    onClose();
  };

  const renderItem = ({ item }: { item: LanguageMeta }) => {
    const active = item.code === language;
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.code)}
        activeOpacity={0.7}
        style={[styles.row, { borderBottomColor: colors.border }]}
      >
        <Text style={{ fontSize: 22 }}>{item.flag}</Text>
        <View className="flex-1">
          <Text style={{ fontFamily: "Georgia", fontSize: 16, color: active ? colors.accentBlue : colors.textPrimary }}>
            {item.nativeName}
          </Text>
          <Text style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 0.3, color: colors.textSecondary }}>
            {item.englishName.toUpperCase()}
          </Text>
        </View>
        {item.voice && (
          <View style={[styles.voiceTag, { borderColor: colors.successGreen }]}>
            <Ionicons name="volume-high" size={10} color={colors.successGreen} />
            <Text style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 0.5, color: colors.successGreen }}>
              {t("settings.voiceTag")}
            </Text>
          </View>
        )}
        {active && <Ionicons name="checkmark-circle" size={20} color={colors.accentBlue} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }} edges={["top"]}>
        <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
          <Text style={{ fontFamily: "Georgia", fontSize: 22, fontWeight: "700", color: colors.textPrimary }}>
            {t("settings.chooseLanguage")}
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={26} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View className="px-5 pb-2">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("settings.searchLanguages")}
            placeholderTextColor={colors.textMuted}
            style={{
              fontFamily: "Georgia", fontSize: 15, color: colors.textPrimary,
              backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
              borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
            }}
          />
          <Text style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 15, color: colors.textSecondary, marginTop: 10 }}>
            {t("settings.voiceNote")}
          </Text>
        </View>

        <FlatList
          data={results}
          keyExtractor={(l) => l.code}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={{ fontFamily: "Georgia", fontSize: 15, color: colors.textSecondary, textAlign: "center", marginTop: 30 }}>
              {t("settings.noLanguagesFound")}
            </Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  voiceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
});
