import { useRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
  onSearch: (query: string) => void;
};

export function TimelineSearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (text: string) => {
    setValue(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(text);
    }, 300);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder={'Ask anything — "When did my knee pain star...'}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    gap: 10,
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontFamily: "Georgia",
    fontSize: 14,
    color: colors.textPrimary,
    height: "100%",
  },
  clear: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
