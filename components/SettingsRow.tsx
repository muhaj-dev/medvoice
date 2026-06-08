import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
  valueSuffix?: string;
  valueSuffixColor?: string;
  valueFontSize?: number;
  isLast?: boolean;
};

export function SettingsRow({
  icon,
  iconBg,
  label,
  value,
  valueColor = colors.textSecondary,
  valueSuffix,
  valueSuffixColor,
  valueFontSize = 13,
  isLast = false,
}: Props) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <Text style={styles.label}>{label}</Text>

      <View style={styles.valueWrap}>
        {value ? (
          <Text style={[styles.value, { color: valueColor, fontSize: valueFontSize }]}>
            {value}
          </Text>
        ) : null}
        {valueSuffix ? (
          <Text
            style={[
              styles.value,
              { color: valueSuffixColor ?? valueColor, fontSize: valueFontSize },
            ]}
          >
            {valueSuffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  label: {
    flex: 1,
    fontFamily: "Georgia",
    fontSize: 15,
    color: colors.textPrimary,
  },
  valueWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontFamily: "monospace",
    fontSize: 13,
    color: colors.textSecondary,
  },
});
