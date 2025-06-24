// app/settings.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';
import BiometricAuthService from './utils/BiometricAuth';

const SettingsPage = () => {
  // Settings states for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [cacheSize, setCacheSize] = useState('173.8 MB');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('Face ID / Touch ID');

  useEffect(() => {
    loadSettings();
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await BiometricAuthService.isAvailable();
      setBiometricAvailable(available);
      
      if (available) {
        const typeName = await BiometricAuthService.getBiometricTypeName();
        setBiometricType(typeName);
        
        const enabled = await BiometricAuthService.isBiometricEnabled();
        setFaceIdEnabled(enabled);
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationsEnabled(parsed.notifications ?? true);
        setEmailEnabled(parsed.email ?? false);
        setAnalyticsEnabled(parsed.analytics ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (!biometricAvailable) {
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available on this device or no biometric credentials are enrolled.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (value) {
      // Enable biometric authentication
      const success = await BiometricAuthService.enableBiometricAuth();
      if (success) {
        setFaceIdEnabled(true);
        Alert.alert(
          'Success',
          `${biometricType} has been enabled for secure app access.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Failed',
          `Failed to enable ${biometricType}. Please try again.`,
          [{ text: 'OK' }]
        );
      }
    } else {
      // Disable biometric authentication
      Alert.alert(
        `Disable ${biometricType}`,
        `Are you sure you want to disable ${biometricType}? You'll need to use your password to sign in.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await BiometricAuthService.disableBiometricAuth();
              setFaceIdEnabled(false);
            }
          }
        ]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userToken',
        'userInfo',
        'isLoggedIn'
      ]);
      
      console.log('User logged out successfully');
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      `This will free up ${cacheSize} of storage space.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: async () => {
            setCacheSize('0 MB');
            setTimeout(() => setCacheSize('173.8 MB'), 2000);
            Alert.alert('Success', 'Cache cleared successfully!');
          }
        }
      ]
    );
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile & Personal Info',
          icon: '👤',
          onPress: () => router.push('/edit-profile')
        },
        {
          id: 'billing',
          title: 'Billing & Payments',
          icon: '💳',
          onPress: () => router.push('/billing')
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'faceid',
          title: biometricType,
          icon: biometricType.includes('Face') ? '👤' : '👆',
          subtitle: biometricAvailable ? undefined : 'Not available on this device',
          hasToggle: true,
          toggleValue: faceIdEnabled,
          onToggle: handleBiometricToggle,
          disabled: !biometricAvailable
        },
        {
          id: 'password',
          title: 'Change Password',
          icon: '🔑',
          onPress: () => router.push('/change-password')
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          icon: '🔒',
          onPress: () => router.push('/privacy-settings')
        },
        {
          id: 'blocked',
          title: 'Blocked Users',
          icon: '🚫',
          onPress: () => router.push('/blocked-users')
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push',
          title: 'Push Notifications',
          icon: '🔔',
          hasToggle: true,
          toggleValue: notificationsEnabled,
          onToggle: (value: boolean) => {
            setNotificationsEnabled(value);
            saveSettings({ notifications: value, email: emailEnabled, analytics: analyticsEnabled });
          }
        },
        {
          id: 'email',
          title: 'Email Notifications',
          icon: '📧',
          hasToggle: true,
          toggleValue: emailEnabled,
          onToggle: (value: boolean) => {
            setEmailEnabled(value);
            saveSettings({ notifications: notificationsEnabled, email: value, analytics: analyticsEnabled });
          }
        }
      ]
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: 'cache',
          title: 'Clear Cache',
          icon: '🗑️',
          subtitle: cacheSize,
          onPress: handleClearCache
        }
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          icon: '❓',
          onPress: () => openURL('https://help.artcommission.app')
        },
        {
          id: 'contact',
          title: 'Contact Support',
          icon: '💬',
          onPress: () => router.push('/contact-support')
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: '📄',
          onPress: () => openURL('https://artcommission.app/terms')
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: '🛡️',
          onPress: () => openURL('https://artcommission.app/privacy')
        },
        {
          id: 'analytics',
          title: 'Analytics & Crash Reports',
          icon: '📊',
          hasToggle: true,
          toggleValue: analyticsEnabled,
          onToggle: (value: boolean) => {
            setAnalyticsEnabled(value);
            saveSettings({ notifications: notificationsEnabled, email: emailEnabled, analytics: value });
          }
        }
      ]
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          icon: '🚪',
          onPress: handleLogout,
          isDestructive: false
        }
      ]
    }
  ];

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            {section.title !== 'Account Actions' && (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem,
                    item.isDestructive && styles.destructiveItem,
                    item.disabled && styles.disabledItem
                  ]}
                  onPress={item.onPress}
                  disabled={item.hasToggle || item.disabled}
                >
                  <View style={styles.settingItemLeft}>
                    <Text style={[
                      styles.settingIcon, 
                      item.isDestructive && styles.destructiveIcon,
                      item.disabled && styles.disabledIcon
                    ]}>
                      {item.icon}
                    </Text>
                    <View style={styles.settingItemInfo}>
                      <Text style={[
                        styles.settingItemTitle, 
                        item.isDestructive && styles.destructiveText,
                        item.disabled && styles.disabledText
                      ]}>
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  
                  {item.hasToggle ? (
                    <Switch
                      value={item.toggleValue}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#333', true: item.disabled ? '#666' : '#00A8FF' }}
                      thumbColor={'#FFFFFF'}
                      disabled={item.disabled}
                    />
                  ) : (
                    <Text style={[
                      styles.chevron, 
                      item.isDestructive && styles.destructiveChevron,
                      item.disabled && styles.disabledChevron
                    ]}>
                      ›
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 50,
    paddingBottom: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  headerTitle: {
    ...Typography.h5,
  },
  placeholder: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
  },

  // Section
  section: {
    marginBottom: Layout.spacing.xxl,
  },
  sectionTitle: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    marginLeft: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    ...Layout.marginHorizontal,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },

  // Setting Item
  settingItem: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  destructiveItem: {
    backgroundColor: '#2A1A1A',
  },
  disabledItem: {
    opacity: 0.6,
  },
  settingItemLeft: {
    ...Layout.row,
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.lg,
    width: 24,
    textAlign: 'center',
  },
  destructiveIcon: {
    color: '#FF6666',
  },
  disabledIcon: {
    color: Colors.textDisabled,
  },
  settingItemInfo: {
    flex: 1,
  },
  settingItemTitle: {
    ...Typography.body,
    marginBottom: 2,
  },
  destructiveText: {
    color: '#FF6666',
  },
  disabledText: {
    color: Colors.textDisabled,
  },
  settingItemSubtitle: {
    ...Typography.bodySmallMuted,
  },
  chevron: {
    fontSize: 18,
    color: Colors.textDisabled,
  },
  destructiveChevron: {
    color: '#FF6666',
  },
  disabledChevron: {
    color: Colors.textDisabled,
  },
});

export default SettingsPage;