import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'username'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [countryCode, setCountryCode] = useState('+86');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationCode = async () => {
    if (email && countdown === 0) {
      setIsLoading(true);
      setError('');
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCountdown(60);
        console.log('Verification code sent to:', email);
      } catch (err) {
        setError('Failed to send verification code. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveUserData = async (userData) => {
    try {
      // 保存用户token和基本信息
      await AsyncStorage.setItem('userToken', userData.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData.userInfo));
      await AsyncStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Validate inputs
      if (loginMode === 'email') {
        if (!email || !verificationCode) {
          setError('Please enter both email and verification code');
          return;
        }
        if (verificationCode.length !== 6) {
          setError('Verification code must be 6 digits');
          return;
        }
      } else {
        if (!username || !password) {
          setError('Please enter both username and password');
          return;
        }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟登录成功返回的数据
      const mockUserData = {
        token: 'mock_jwt_token_12345',
        userInfo: {
          id: loginMode === 'email' ? 'user_email_123' : 'user_username_456',
          email: loginMode === 'email' ? email : `${username}@example.com`,
          username: loginMode === 'email' ? email.split('@')[0] : username,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          isArtist: Math.random() > 0.5, // 随机决定是否为画师
          joinDate: new Date().toISOString(),
        }
      };

      // 保存用户数据
      await saveUserData(mockUserData);
      
      console.log('Login successful:', mockUserData);
      
      // 跳转到主页
      router.replace('/homepage');
      
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToRegister = () => {
    console.log('Switch to register');
    // Navigate to register page
    // router.push('/register');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
    // Navigate to forgot password page
    // router.push('/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {loginMode === 'email' ? 'Email Verification' : 'Account Login'}
        </Text>
        <Text style={styles.subtitle}>
          {loginMode === 'email' 
            ? 'We will send a verification code to your email for secure access'
            : 'Please enter your registered username, phone number, or email to login'
          }
        </Text>

        {/* Additional Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {loginMode === 'email' 
              ? '💡 New users: Verification will create your account automatically'
              : '🔐 Use any of your registered credentials to sign in'
            }
          </Text>
        </View>

        {/* Input fields */}
        {loginMode === 'email' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            {/* Terms Agreement */}
            <View style={styles.agreementContainer}>
              <Text style={styles.agreementText}>
                By continuing, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Username / Phone / Email"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        {loginMode === 'username' ? (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.codeContainer}>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="Enter verification code"
              placeholderTextColor="#666"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity
              style={[styles.codeButton, (countdown > 0 || !email || isLoading) && styles.disabledButton]}
              onPress={sendVerificationCode}
              disabled={countdown > 0 || !email || isLoading}
            >
              <Text style={[styles.codeButtonText, (countdown > 0 || !email || isLoading) && styles.disabledText]}>
                {isLoading ? 'Sending...' : (countdown > 0 ? `${countdown}s` : 'Send Code')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Loading...' : (loginMode === 'email' ? 'Verify & Login' : 'Login')}
          </Text>
        </TouchableOpacity>

        {/* Switch Mode */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setLoginMode(loginMode === 'email' ? 'username' : 'email')}
        >
          <Text style={styles.switchText}>
            {loginMode === 'email' ? 'Use Username Login' : 'Use Email Verification'}
          </Text>
        </TouchableOpacity>

        {/* Forgot Password - only show in username mode */}
        {loginMode === 'username' && (
          <TouchableOpacity style={styles.forgotButton} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#00A8FF',
  },
  infoText: {
    fontSize: 12,
    color: '#AAA',
    lineHeight: 16,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    paddingRight: 50,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  agreementContainer: {
    marginBottom: 24,
  },
  agreementText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  linkText: {
    color: '#00A8FF',
  },
  codeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  codeInput: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },
  codeButton: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 100,
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  codeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#00A8FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 12,
  },
  switchText: {
    color: '#00A8FF',
    fontSize: 16,
  },
  forgotButton: {
    alignItems: 'center',
    marginBottom: 40,
  },
  forgotText: {
    color: '#888',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#2A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6666',
    lineHeight: 16,
  },
});

export default LoginPage;