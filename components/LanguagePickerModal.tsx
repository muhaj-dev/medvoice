/**
 * Full-screen searchable language picker (Settings). Picking a language sets it
 * and kicks off the one-time on-device translation of just that language (no
 * other language's model is downloaded). The list itself lives in LanguageList,
 * shared with the onboarding language step.
 */
import {
  Modal, View, Text, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ensureCatalog } from "@/lib/i18n";
import { LanguageList } from "@/components/LanguageList";
import type { Lang } from "@/constants/strings";

type Props = { visible: boolean; onClose: () => void };

export function LanguagePickerModal({ visible, onClose }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const handleSelect = (lang: Lang) => {
    if (lang !== language) {
      void setLanguage(lang);
      void ensureCatalog(lang); // translate only the chosen language, once
    }
    onClose();
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

        <LanguageList selected={language} onSelect={handleSelect} />
      </SafeAreaView>
    </Modal>
  );
}
