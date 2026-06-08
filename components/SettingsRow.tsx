import { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTokens } from "@/constants/colors";

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
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  valueSuffix,
  valueSuffixColor,
  valueFontSize = 13,
  isLast = false,
  onPress,
}: Props) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const resolvedValueColor = valueColor ?? colors.textSecondary;
  const rowStyle = [styles.row, !isLast && styles.rowBorder];

  const content = (
    <>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <Text style={styles.label}>{label}</Text>

      <View style={styles.valueWrap}>
        {value ? (
          <Text style={[styles.value, { color: resolvedValueColor, fontSize: valueFontSize }]}>
            {value}
          </Text>
        ) : null}
        {valueSuffix ? (
          <Text
            style={[
              styles.value,
              { color: valueSuffixColor ?? resolvedValueColor, fontSize: valueFontSize },
            ]}
          >
            {valueSuffix}
          </Text>
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={rowStyle}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
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
    iconText: { fontSize: 18 },
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
}
