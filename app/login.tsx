import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from './components/styles/Colors';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

// Unified container style
const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
};

interface UserData {
  token: string;
  userInfo: {
    id: string;
    email: string;
    username: string;
    avatar: string;
    isArtist: boolean;
    joinDate: string;
  };
}

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState<'email' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto dismiss keyboard when verification code is complete
  useEffect(() => {
    if (verificationCode.length === 6) {
      Keyboard.dismiss();
    }
  }, [verificationCode]);

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

  const saveUserData = async (userData: UserData) => {
    try {
      // Save user token and basic info
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
      
      // Mock successful login response data
      const mockUserData: UserData = {
        token: 'mock_jwt_token_12345',
        userInfo: {
          id: loginMode === 'email' ? 'user_email_123' : 'user_username_456',
          email: loginMode === 'email' ? email : `${username}@example.com`,
          username: loginMode === 'email' ? email.split('@')[0] : username,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          isArtist: Math.random() > 0.5, // Randomly decide if user is an artist
          joinDate: new Date().toISOString(),
        }
      };

      // Save user data
      await saveUserData(mockUserData);
      
      console.log('Login successful:', mockUserData);
      
      // Navigate to homepage
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

  // Render info box
  const renderInfoBox = () => (
    <View style={styles.infoBox}>
      <Text style={styles.infoText}>
        {loginMode === 'email' 
          ? '💡 New users: Verification will create your account automatically'
          : '🔐 Use any of your registered credentials to sign in'
        }
      </Text>
    </View>
  );

  // Render email login fields
  const renderEmailLogin = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={Colors.textMuted}
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

      {/* Verification code input */}
      <View style={styles.codeContainer}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="Enter verification code"
          placeholderTextColor={Colors.textMuted}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          maxLength={6}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
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
    </>
  );

  // Render username login fields
  const renderUsernameLogin = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Username / Phone / Email"
        placeholderTextColor={Colors.textMuted}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Enter password"
          placeholderTextColor={Colors.textMuted}
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
    </>
  );

  // Render error message
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  };

  return (
    <View style={AppStyles.container}>
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

        {/* Info Box */}
        {renderInfoBox()}

        {/* Input Fields */}
        {loginMode === 'email' ? renderEmailLogin() : renderUsernameLogin()}

        {/* Error Message */}
        {renderError()}

        {/* Login Button */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Layout.spacing.xl,
    paddingTop: 80,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.lg,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    ...Typography.body,
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.lg,
  },
  passwordInput: {
    paddingRight: 50,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: Layout.spacing.lg,
    top: Layout.spacing.lg,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  agreementContainer: {
    marginBottom: Layout.spacing.xl,
  },
  agreementText: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  linkText: {
    color: Colors.primary,
  },
  codeContainer: {
    ...Layout.row,
    marginBottom: Layout.spacing.lg,
  },
  codeInput: {
    flex: 1,
    marginRight: Layout.spacing.md,
    marginBottom: 0,
  },
  codeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    justifyContent: 'center',
    minWidth: 100,
  },
  disabledButton: {
    backgroundColor: Colors.card,
  },
  codeButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.textDisabled,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.md,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  loginButtonText: {
    ...Typography.button,
    color: Colors.text,
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  switchText: {
    ...Typography.h6,
    color: Colors.primary,
  },
  forgotButton: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxxl,
  },
  forgotText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  errorContainer: {
    backgroundColor: '#2A1A1A',
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.errorLight,
    lineHeight: 16,
  },
});

export default LoginPage;