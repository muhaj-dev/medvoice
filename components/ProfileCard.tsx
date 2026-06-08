import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import type { UserProfile } from "@/types/user";

type Props = {
  profile: UserProfile;
  onPress: () => void;
};

function buildSubtitle(profile: UserProfile): string {
  const parts: string[] = [];
  if (profile.age) parts.push(`Age ${profile.age}`);
  if (profile.conditions.length > 0) parts.push(profile.conditions[0]);
  return parts.join(" · ");
}

export function ProfileCard({ profile, onPress }: Props) {
  const initial = profile.name.charAt(0).toUpperCase();
  const subtitle = buildSubtitle(profile);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.card}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{profile.name}</Text>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 28,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Georgia",
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: "Georgia",
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: "Georgia",
    fontSize: 13,
    color: colors.textSecondary,
  },
});
