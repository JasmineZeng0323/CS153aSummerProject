import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main App Screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="homepage" />
        
        {/* Artist & Gallery Screens */}
        <Stack.Screen name="artists" />
        <Stack.Screen name="artist-detail" />
        <Stack.Screen name="artwork-detail" />
        <Stack.Screen name="gallery-detail" />
        <Stack.Screen name="gallery-collection" />
        <Stack.Screen name="purchased-gallery" />
        
        {/* Artist Mode Screens */}
        <Stack.Screen name="publish-gallery" />
        <Stack.Screen name="published-galleries" />
        <Stack.Screen name="applied-projects" />
        <Stack.Screen name="edit-gallery" />  
        <Stack.Screen name="gallery-analytics" /> //not implement

        
        {/* Project & Commission Screens */}
        <Stack.Screen name="projects" />
        <Stack.Screen name="post-project" />
        <Stack.Screen name="project-detail" />
        <Stack.Screen name="my-projects" />
        <Stack.Screen name="commission-calendar" />
        <Stack.Screen name="my-drafts" />
        
        {/* Artist Dashboard & Management */}
        <Stack.Screen name="artist-dashboard" /> //not implement
        <Stack.Screen name="manage-commissions" /> //not implement
        <Stack.Screen name="earnings-dashboard" /> 
        <Stack.Screen name="project-workspace" /> //not implement
        
        {/* Order & Payment Screens */}
        <Stack.Screen name="order-detail" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="billing" />
        
        {/* Communication Screens */}
        <Stack.Screen name="messages" />
        <Stack.Screen name="chat" />
        
        {/* Profile & User Screens */}
        <Stack.Screen name="profile" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="following-artists" />
        <Stack.Screen name="artist-verification" />
        
        {/* Settings & Privacy Screens */}
        <Stack.Screen name="settings" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="privacy-settings" />
        <Stack.Screen name="blocked-users" />
        
        {/* Review & Rating Screens */}
        <Stack.Screen name="write-review" />
        <Stack.Screen name="pending-reviews" />
        
        {/* Utility Screens */}
        <Stack.Screen name="qr-scanner" />
      </Stack>
    </GestureHandlerRootView>
  );
}