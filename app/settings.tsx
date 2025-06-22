import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const SettingsPage = () => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      // Clear all user data from AsyncStorage
      await AsyncStorage.multiRemove([
        'userToken',
        'userInfo',
        'isLoggedIn'
      ]);
      
      console.log('User logged out successfully');
      
      // Navigate back to login/index page
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'identity',
          title: 'Identity Verification',
          icon: '🆔',
          onPress: () => console.log('Identity verification')
        },
        {
          id: 'security',
          title: 'Account Security',
          icon: '🛡️',
          onPress: () => console.log('Account security')
        }
      ]
    },
    {
      title: 'Help',
      items: [
        {
          id: 'guide',
          title: 'User Guide',
          icon: '📖',
          onPress: () => console.log('User guide')
        },
        {
          id: 'feedback',
          title: 'Suggestions & Feedback',
          icon: '💬',
          onPress: () => console.log('Feedback')
        },
        {
          id: 'support',
          title: 'Online Support',
          icon: '🎧',
          onPress: () => console.log('Support')
        },
        {
          id: 'disputes',
          title: 'Penalties & Dispute Case Library',
          icon: '⚖️',
          onPress: () => console.log('Disputes')
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          id: 'notifications',
          title: 'Notification Management',
          icon: '🔔',
          onPress: () => console.log('Notifications')
        },
        {
          id: 'personalization',
          title: 'Personalization',
          icon: '🎨',
          onPress: () => console.log('Personalization')
        },
        {
          id: 'widgets',
          title: 'Desktop Widgets',
          icon: '📱',
          onPress: () => console.log('Widgets')
        },
        {
          id: 'cache',
          title: 'Clear Cache',
          icon: '🗑️',
          subtitle: '173.8 MB',
          onPress: () => console.log('Clear cache')
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          icon: '🔒',
          onPress: () => console.log('Privacy')
        },
        {
          id: 'system',
          title: 'System Settings',
          icon: '⚙️',
          onPress: () => console.log('System')
        }
      ]
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Logout',
          icon: '🚪',
          onPress: handleLogout,
          isDestructive: true
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
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
                    item.isDestructive && styles.destructiveItem
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.settingItemLeft}>
                    <Text style={[styles.settingIcon, item.isDestructive && styles.destructiveIcon]}>
                      {item.icon}
                    </Text>
                    <View style={styles.settingItemInfo}>
                      <Text style={[styles.settingItemTitle, item.isDestructive && styles.destructiveText]}>
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.chevron, item.isDestructive && styles.destructiveChevron]}>
                    ›
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 20,
    marginBottom: 12,
    marginTop: 16,
  },
  sectionContent: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  destructiveItem: {
    backgroundColor: '#2A1A1A',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  destructiveIcon: {
    color: '#FF6666',
  },
  settingItemInfo: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#FF6666',
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  chevron: {
    fontSize: 18,
    color: '#666',
  },
  destructiveChevron: {
    color: '#FF6666',
  },
  bottomPadding: {
    height: 40,
  },
});

export default SettingsPage;