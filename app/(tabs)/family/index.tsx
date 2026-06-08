import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useFamilyStore } from '@/store/useFamilyStore';
import { P2PMeshBanner } from '@/components/P2PMeshBanner';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { AddFamilyMemberSection } from '@/components/AddFamilyMemberSection';
import { HowP2PWorksCard } from '@/components/HowP2PWorksCard';

export default function FamilyScreen() {
  const colors = useTheme();
  const { members } = useFamilyStore();
  const onlineCount = members.filter((m) => m.connectionStatus === 'online').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <Text style={{ fontFamily: 'Georgia', fontSize: 36, fontWeight: '700', color: colors.textPrimary, lineHeight: 40 }}>
              Family
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 36, fontStyle: 'italic', color: colors.accentBlueLight, lineHeight: 16 }}>
              Connection
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 13, color: colors.textSecondary, marginTop: 6 }}>
              Private P2P · No cloud server
            </Text>
          </View>
          <Ionicons name="flash-outline" size={22} color={colors.textSecondary} style={{ marginTop: 6 }} />
        </View>

        {/* P2P status banner */}
        <View className="mb-7">
          <P2PMeshBanner connectedCount={onlineCount} />
        </View>

        {/* Connected members or empty state */}
        {members.length > 0 ? (
          <View className="mb-7 gap-2.5">
            <Text style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: '600', letterSpacing: 1.2, color: colors.textSecondary, marginBottom: 2 }}>
              CONNECTED
            </Text>
            {members.map((m) => (
              <FamilyMemberCard key={m.id} member={m} />
            ))}
          </View>
        ) : (
          <View
            style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 28, gap: 10 }}
          >
            <Text style={{ fontSize: 36 }}>👨‍👩‍👧</Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 15, color: colors.textPrimary, textAlign: 'center', fontWeight: '600' }}>
              No family members yet
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
              Share health summaries privately with family using the options below
            </Text>
          </View>
        )}

        {/* Add a family member */}
        <View className="mb-7">
          <AddFamilyMemberSection />
        </View>

        {/* How P2P works */}
        <HowP2PWorksCard />
      </ScrollView>
    </SafeAreaView>
  );
}
