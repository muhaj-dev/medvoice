import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useFamilyStore } from '@/store/useFamilyStore';
import { P2PMeshBanner } from '@/components/P2PMeshBanner';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { AddFamilyMemberSection } from '@/components/AddFamilyMemberSection';
import { HowP2PWorksCard } from '@/components/HowP2PWorksCard';

export default function FamilyScreen() {
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
            <Text className="font-georgia text-[36px] font-bold text-white leading-10">
              Family
            </Text>
            <Text className="font-georgia text-[36px] italic text-brand-light leading-10">
              Connection
            </Text>
            <Text className="font-georgia text-[13px] text-dim mt-1.5">
              Private P2P · No cloud server
            </Text>
          </View>
          <Ionicons name="flash-outline" size={22} color={colors.textSecondary} style={{ marginTop: 6 }} />
        </View>

        {/* P2P status banner */}
        <View className="mb-7">
          <P2PMeshBanner connectedCount={onlineCount} />
        </View>

        {/* Connected members */}
        {members.length > 0 && (
          <View className="mb-7 gap-2.5">
            <Text className="font-code text-[11px] font-semibold tracking-[1.2px] text-dim mb-0.5">
              CONNECTED
            </Text>
            {members.map((m) => (
              <FamilyMemberCard key={m.id} member={m} />
            ))}
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
