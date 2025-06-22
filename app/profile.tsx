import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userData = JSON.parse(userInfoString);
        setUserInfo(userData);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.switchButton}>
            <Text style={styles.switchIcon}>🔄</Text>
            <Text style={styles.switchText}>Switch to Artist</Text>
          </TouchableOpacity>
          
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>👕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>☀️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⛶</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.actionIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Profile Section */}
        <View style={styles.userSection}>
          <View style={styles.userHeader}>
            <Image 
              source={{ uri: userInfo?.avatar || 'https://i.pravatar.cc/80?img=1' }} 
              style={styles.avatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userInfo?.username || 'User Name'}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>574</Text>
              <Text style={styles.statLabel}>My Drafts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>308</Text>
              <Text style={styles.statLabel}>Following Artists</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>96</Text>
              <Text style={styles.statLabel}>Gallery Collection</Text>
            </View>
          </View>

          {/* Action Icons */}
          <View style={styles.actionIcons}>
            <View style={styles.iconItem}>
              <Text style={styles.iconSymbol}>💰</Text>
              <Text style={styles.iconLabel}>Funds</Text>
            </View>
            <View style={styles.iconItem}>
              <Text style={styles.iconSymbol}>👤</Text>
              <Text style={styles.iconLabel}>Profile</Text>
            </View>
            <View style={styles.iconItem}>
              <Text style={styles.iconSymbol}>📮</Text>
              <Text style={styles.iconLabel}>Contracts</Text>
            </View>
            <View style={styles.iconItem}>
              <Text style={styles.iconSymbol}>🕐</Text>
              <Text style={styles.iconLabel}>Schedule</Text>
            </View>
          </View>

          {/* Additional Actions */}
          <View style={styles.additionalActions}>
            <TouchableOpacity style={styles.additionalActionButton}>
              <Text style={styles.additionalActionIcon}>💖</Text>
              <Text style={styles.additionalActionText}>Liked</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalActionButton}>
              <Text style={styles.additionalActionIcon}>🏆</Text>
              <Text style={styles.additionalActionText}>Achievements</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* My Commissions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Commissions</Text>
            <TouchableOpacity style={styles.calendarButton}>
              <Text style={styles.calendarIcon}>📅</Text>
              <Text style={styles.calendarText}>View Calendar</Text>
            </TouchableOpacity>
          </View>

          {/* Gallery Orders */}
          <TouchableOpacity 
            style={styles.orderItem}
            onPress={() => router.push('/purchased-gallery')}
          >
            <View style={styles.orderLeft}>
              <Text style={styles.orderIcon}>🖼️</Text>
              <Text style={styles.orderTitle}>Gallery Orders</Text>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderCount}>4 orders purchased</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Pending Reviews */}
          <TouchableOpacity style={styles.orderItem}>
            <View style={styles.orderLeft}>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingNumber}>1</Text>
              </View>
              <Text style={styles.orderTitle}>Pending Reviews</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Project Collaborations */}
          <TouchableOpacity 
          style={styles.orderItem}
          onPress={() => router.push('/my-projects')}
          >
          <View style={styles.orderLeft}>
            <Text style={styles.orderIcon}>📋</Text>
            <Text style={styles.orderTitle}>Project Collaborations</Text>
          </View>
          <View style={styles.orderRight}>
            <Text style={styles.orderCount}>3 projects in progress</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
          </TouchableOpacity>

          {/* Status Indicators */}
          <View style={styles.statusIndicators}>
            <View style={styles.statusItem}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusNumber}>10</Text>
              </View>
              <Text style={styles.statusText}>Pending Payment</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusBadge, styles.reviewBadge]}>
                <Text style={styles.statusNumber}>1</Text>
              </View>
              <Text style={styles.statusText}>Pending Reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/homepage')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/artists')}
        >
          <Text style={styles.navIcon}>🎨</Text>
          <Text style={styles.navText}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navText}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navText}>Messages</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>●</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, styles.activeNavIcon]}>👤</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Profile</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  switchIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  switchText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionIcon: {
    fontSize: 18,
  },
  userSection: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconItem: {
    alignItems: 'center',
  },
  iconSymbol: {
    fontSize: 24,
    marginBottom: 8,
  },
  iconLabel: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  additionalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  additionalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  additionalActionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  additionalActionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewAll: {
    fontSize: 14,
    color: '#888',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  calendarIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  calendarText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  orderItem: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  orderTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  orderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCount: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  pendingBadge: {
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pendingNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  reviewBadge: {
    backgroundColor: '#4CAF50',
  },
  statusNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
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
    borderRadius: 4,
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FF4444',
    fontSize: 8,
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

export default ProfilePage;