import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="homepage" />
      <Stack.Screen name="gallery-detail" />
      <Stack.Screen name="payment" />
    </Stack>
  );
}