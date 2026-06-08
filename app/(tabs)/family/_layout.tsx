import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function FamilyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
        animation: 'slide_from_right',
      }}
    />
  );
}
