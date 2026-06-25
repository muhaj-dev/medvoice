/**
 * Searchable, selectable list of every language QVAC can translate into.
 * A "VOICE" badge marks the four that can also be read aloud. Shared by the
 * Settings LanguagePickerModal and the onboarding language step.
 */
import { useMemo, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { LANGUAGES, type Lang, type LanguageMeta } from "@/constants/strings";

type Props = { selected: Lang; onSelect: (lang: Lang) => void };

export function LanguageList({ selected, onSelect }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
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

  const renderItem = ({ item }: { item: LanguageMeta }) => {
    const active = item.code === selected;
    return (
      <TouchableOpacity
        onPress={() => onSelect(item.code)}
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
        {active && <Ionicons name="checkmark-circle" size={20} color={colors.accentBlue} />}
        {item.voice && (
          <View style={[styles.voiceTag, { borderColor: colors.successGreen }]}>
            <Ionicons name="volume-high" size={10} color={colors.successGreen} />
            <Text style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 0.5, color: colors.successGreen }}>
              {t("settings.voiceTag")}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
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
    </View>
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
