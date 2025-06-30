//privacy-settings.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'followers';
  allowDirectMessages: 'everyone' | 'followers' | 'nobody';
  showCommissionHistory: boolean;
  allowSearchByEmail: boolean;
  allowSearchByPhone: boolean;
  showInDirectory: boolean;
  dataCollection: boolean;
  analyticsTracking: boolean;
}

const PrivacySettingsPage = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    allowDirectMessages: 'everyone',
    showCommissionHistory: true,
    allowSearchByEmail: false,
    allowSearchByPhone: false,
    showInDirectory: true,
    dataCollection: true,
    analyticsTracking: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('privacySettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const savePrivacySettings = async (newSettings: PrivacySettings) => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('privacySettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    savePrivacySettings(newSettings);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Privacy Settings',
      'This will reset all privacy settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings: PrivacySettings = {
              profileVisibility: 'public',
              allowDirectMessages: 'everyone',
              showCommissionHistory: true,
              allowSearchByEmail: false,
              allowSearchByPhone: false,
              showInDirectory: true,
              dataCollection: true,
              analyticsTracking: true,
            };
            savePrivacySettings(defaultSettings);
          }
        }
      ]
    );
  };

  const ToggleSettingItem = ({ 
    title, 
    description, 
    value, 
    onToggle,
    icon
  }: {
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    icon: string;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingItemInfo}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          <Text style={styles.settingItemDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#333', true: '#00A8FF' }}
        thumbColor={'#FFFFFF'}
        disabled={loading}
      />
    </View>
  );

  const SelectSettingItem = ({ 
    title, 
    description, 
    options, 
    value, 
    onSelect,
    icon
  }: {
    title: string;
    description: string;
    options: { label: string; value: string }[];
    value: string;
    onSelect: (value: string) => void;
    icon: string;
  }) => (
    <View style={[styles.settingItem, styles.lastItem]}>
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingItemInfo}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          <Text style={styles.settingItemDescription}>{description}</Text>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  value === option.value && styles.optionButtonActive
                ]}
                onPress={() => onSelect(option.value)}
                disabled={loading}
              >
                <Text style={[
                  styles.optionButtonText,
                  value === option.value && styles.optionButtonTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <TouchableOpacity onPress={resetToDefaults} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Privacy</Text>
          
          <View style={styles.sectionContent}>
            <SelectSettingItem
              title="Profile Visibility"
              description="Control who can see your profile"
              icon="👤"
              value={settings.profileVisibility}
              options={[
                { label: 'Public', value: 'public' },
                { label: 'Followers Only', value: 'followers' },
                { label: 'Private', value: 'private' }
              ]}
              onSelect={(value) => updateSetting('profileVisibility', value)}
            />
          </View>
        </View>

        {/* Activity Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Privacy</Text>
          
          <View style={styles.sectionContent}>
            <ToggleSettingItem
              title="Show Commission History"
              description="Display your completed commissions publicly"
              icon="🎨"
              value={settings.showCommissionHistory}
              onToggle={(value) => updateSetting('showCommissionHistory', value)}
            />
          </View>
        </View>

        {/* Communication Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>
          
          <View style={styles.sectionContent}>
            <SelectSettingItem
              title="Direct Messages"
              description="Choose who can send you direct messages"
              icon="💬"
              value={settings.allowDirectMessages}
              options={[
                { label: 'Everyone', value: 'everyone' },
                { label: 'Followers Only', value: 'followers' },
                { label: 'Nobody', value: 'nobody' }
              ]}
              onSelect={(value) => updateSetting('allowDirectMessages', value)}
            />
          </View>
        </View>

        {/* Discoverability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discoverability</Text>
          
          <View style={styles.sectionContent}>
            <ToggleSettingItem
              title="Show in Artist Directory"
              description="Appear in search results and artist listings"
              icon="📋"
              value={settings.showInDirectory}
              onToggle={(value) => updateSetting('showInDirectory', value)}
            />
            
            <ToggleSettingItem
              title="Allow Search by Email"
              description="Let people find you using your email address"
              icon="📧"
              value={settings.allowSearchByEmail}
              onToggle={(value) => updateSetting('allowSearchByEmail', value)}
            />
            
            <ToggleSettingItem
              title="Allow Search by Phone"
              description="Let people find you using your phone number"
              icon="📱"
              value={settings.allowSearchByPhone}
              onToggle={(value) => updateSetting('allowSearchByPhone', value)}
            />
          </View>
        </View>

        {/* Data & Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Tracking</Text>
          
          <View style={styles.sectionContent}>
            <ToggleSettingItem
              title="Data Collection"
              description="Allow us to collect usage data to improve the app"
              icon="📊"
              value={settings.dataCollection}
              onToggle={(value) => updateSetting('dataCollection', value)}
            />
            
            <ToggleSettingItem
              title="Analytics Tracking"
              description="Help us understand how you use the app"
              icon="📈"
              value={settings.analyticsTracking}
              onToggle={(value) => updateSetting('analyticsTracking', value)}
            />
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.section}>
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeIcon}>🔒</Text>
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Your Privacy Matters</Text>
              <Text style={styles.noticeText}>
                We're committed to protecting your privacy. Learn more about how we handle your data in our Privacy Policy.
              </Text>
              <TouchableOpacity style={styles.noticeButton}>
                <Text style={styles.noticeButtonText}>Read Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
  resetButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  resetButtonText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
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

  // Setting Items
  settingItem: {
    ...Layout.rowSpaceBetween,
    alignItems: 'flex-start',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    ...Layout.row,
    alignItems: 'flex-start',
    flex: 1,
    marginRight: Layout.spacing.lg,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.lg,
    marginTop: 2,
    width: 24,
    textAlign: 'center',
  },
  settingItemInfo: {
    flex: 1,
  },
  settingItemTitle: {
    ...Typography.body,
    marginBottom: Layout.spacing.xs,
  },
  settingItemDescription: {
    ...Typography.bodySmallMuted,
    lineHeight: 18,
  },

  // Options
  optionsContainer: {
    ...Layout.row,
    marginTop: Layout.spacing.md,
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionButtonText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },
  optionButtonTextActive: {
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Notice
  noticeContainer: {
    backgroundColor: Colors.surface,
    ...Layout.marginHorizontal,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.lg,
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.sm,
  },
  noticeText: {
    ...Typography.bodySmallMuted,
    lineHeight: 18,
    marginBottom: Layout.spacing.md,
  },
  noticeButton: {
    alignSelf: 'flex-start',
  },
  noticeButtonText: {
    ...Typography.link,
    color: Colors.primary,
  },
});

export default PrivacySettingsPage;