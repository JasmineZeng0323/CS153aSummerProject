//app/components/BottomNavigation.tsx
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps {
  activeTab: 'home' | 'artists' | 'messages' | 'profile';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const handleNavigation = (route: string) => {
    switch (route) {
      case 'home':
        router.push('/homepage');
        break;
      case 'artists':
        router.push('/artists');
        break;
      case 'messages':
        router.push('/messages');
        break;
      case 'profile':
        router.push('/profile');
        break;
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigation('home')}
      >
        <Text style={[
          styles.navIcon, 
          activeTab === 'home' && styles.activeNavIcon
        ]}>
          🏠
        </Text>
        <Text style={[
          styles.navText, 
          activeTab === 'home' && styles.activeNavText
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigation('artists')}
      >
        <Text style={[
          styles.navIcon, 
          activeTab === 'artists' && styles.activeNavIcon
        ]}>
          🎨
        </Text>
        <Text style={[
          styles.navText, 
          activeTab === 'artists' && styles.activeNavText
        ]}>
          Artists
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigation('messages')}
      >
        <Text style={[
          styles.navIcon, 
          activeTab === 'messages' && styles.activeNavIcon
        ]}>
          💬
        </Text>
        <Text style={[
          styles.navText, 
          activeTab === 'messages' && styles.activeNavText
        ]}>
          Messages
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigation('profile')}
      >
        <Text style={[
          styles.navIcon, 
          activeTab === 'profile' && styles.activeNavIcon
        ]}>
          👤
        </Text>
        <Text style={[
          styles.navText, 
          activeTab === 'profile' && styles.activeNavText
        ]}>
          Profile
        </Text>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>2</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: 'relative',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#666',
  },
  activeNavIcon: {
    color: '#00A8FF',
  },
  navText: {
    fontSize: 12,
    color: '#888',
  },
  activeNavText: {
    color: '#00A8FF',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 20,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileBadge: {
    position: 'absolute',
    top: 4,
    right: 18,
    backgroundColor: '#00A8FF',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BottomNavigation;

