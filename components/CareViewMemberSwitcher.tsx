import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTokens } from "@/constants/colors";
import type { FamilyMember } from "@/types/family";

type Props = {
  members: FamilyMember[];
  selectedId: string;
  // Synced-entry count per member id — shown so it's clear who has data.
  entryCounts?: Record<string, number>;
  onSelect: (id: string) => void;
};

/**
 * Dropdown that picks which connected family member's health to view. Shows the
 * current person as a pill; tapping opens a list of everyone connected. With a
 * single member it stays static (no chevron, no modal).
 */
export function CareViewMemberSwitcher({ members, selectedId, entryCounts, onSelect }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [open, setOpen] = useState(false);

  const selected = members.find((m) => m.id === selectedId) ?? members[0];
  if (!selected) return null;
  const multiple = members.length > 1;

  const dot = (online: boolean) => (online ? colors.successGreen : colors.textMuted);

  return (
    <>
      <TouchableOpacity
        style={styles.pill}
        activeOpacity={multiple ? 0.8 : 1}
        onPress={() => multiple && setOpen(true)}
        disabled={!multiple}
      >
        <View style={[styles.statusDot, { backgroundColor: dot(selected.connectionStatus === "online") }]} />
        <Text style={styles.pillName}>{selected.name}</Text>
        {!!selected.relationship && <Text style={styles.pillRel}>· {selected.relationship}</Text>}
        {multiple && <Text style={styles.chevron}>▾</Text>}
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetLabel}>VIEWING HEALTH FOR</Text>
            {members.map((m) => {
              const active = m.id === selected.id;
              const c = entryCounts?.[m.id];
              const sub = [
                m.relationship || null,
                typeof c === "number" ? `${c} ${c === 1 ? "entry" : "entries"}` : null,
              ]
                .filter(Boolean)
                .join("  ·  ");
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.row, active && styles.rowActive]}
                  activeOpacity={0.8}
                  onPress={() => {
                    onSelect(m.id);
                    setOpen(false);
                  }}
                >
                  <View style={[styles.statusDot, { backgroundColor: dot(m.connectionStatus === "online") }]} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowName}>{m.name}</Text>
                    {!!sub && <Text style={styles.rowRel}>{sub}</Text>}
                  </View>
                  {active && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    pill: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 8,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 99,
      paddingVertical: 10,
      paddingHorizontal: 16,
      minHeight: 48,
    },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    pillName: { fontFamily: "Georgia", fontSize: 15, fontWeight: "600", color: colors.textPrimary },
    pillRel: { fontFamily: "Georgia", fontSize: 13, color: colors.textSecondary },
    chevron: { fontSize: 12, color: colors.textSecondary, marginLeft: 2 },

    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      paddingHorizontal: 28,
    },
    sheet: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 12,
      gap: 4,
    },
    sheetLabel: {
      fontFamily: "monospace",
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
      letterSpacing: 1.2,
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 6,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      minHeight: 56,
    },
    rowActive: { backgroundColor: colors.bgDeep },
    rowText: { flex: 1 },
    rowName: { fontFamily: "Georgia", fontSize: 16, fontWeight: "600", color: colors.textPrimary },
    rowRel: { fontFamily: "Georgia", fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    check: { fontFamily: "monospace", fontSize: 16, color: colors.accentBlue, fontWeight: "700" },
  });
}
