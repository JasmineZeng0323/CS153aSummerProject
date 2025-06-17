import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="homepage" />
        <Stack.Screen name="artists" />
        <Stack.Screen name="artist-detail" />
        <Stack.Screen name="projects" />
        <Stack.Screen name="gallery-detail" />
        <Stack.Screen name="payment" />
      </Stack>
    </GestureHandlerRootView>
  );
}