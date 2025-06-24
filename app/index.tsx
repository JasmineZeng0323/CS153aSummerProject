import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import LoadingState from './components/common/LoadingState';
import { Colors } from './components/styles/Colors';
import LoginPage from './login';

// Unified container style
const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
};

export default function Index() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is already logged in
      const userToken = await AsyncStorage.getItem('userToken');
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      
      if (userToken && loginStatus === 'true') {
        // User is logged in, redirect to homepage
        console.log('User already logged in, redirecting to homepage...');
        setIsLoggedIn(true);
        router.replace('/homepage');
        return;
      }
      
      // User is not logged in, show login page
      console.log('User not logged in, showing login page...');
      setIsLoggedIn(false);
      
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <View style={AppStyles.container}>
        <LoadingState 
          text="Checking authentication..." 
          color={Colors.primary}
          size="large"
        />
      </View>
    );
  }

  // Show loading screen if user is logged in but redirect hasn't completed
  if (isLoggedIn) {
    return (
      <View style={AppStyles.container}>
        <LoadingState 
          text="Redirecting to homepage..." 
          color={Colors.primary}
          size="large"
        />
      </View>
    );
  }

  // Show login page
  return <LoginPage />;
}