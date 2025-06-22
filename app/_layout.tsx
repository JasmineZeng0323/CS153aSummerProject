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
        <Stack.Screen name="artwork-detail" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="post-project" />
        <Stack.Screen name="my-projects" />     
        <Stack.Screen name="project-detail" />   
        <Stack.Screen name="purchased-gallery" />
        <Stack.Screen name="order-detail" />
        <Stack.Screen name="write-review" />
      </Stack>
    </GestureHandlerRootView>
  );
}