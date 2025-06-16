import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import LoginPage from './login';

export default function Index() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 检查用户是否已登录
      const userToken = await AsyncStorage.getItem('userToken');
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      
      if (userToken && loginStatus === 'true') {
        // 用户已登录，直接跳转到主页
        console.log('User already logged in, redirecting to homepage...');
        setIsLoggedIn(true);
        router.replace('/homepage');
        return;
      }
      
      // 用户未登录，显示登录页面
      console.log('User not logged in, showing login page...');
      setIsLoggedIn(false);
      
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // 显示加载界面
  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A8FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // 如果用户已登录但还没跳转完成，显示加载界面
  if (isLoggedIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A8FF" />
        <Text style={styles.loadingText}>Redirecting...</Text>
      </View>
    );
  }

  // 显示登录页面
  return <LoginPage />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
});