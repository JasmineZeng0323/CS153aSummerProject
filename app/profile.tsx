// profile.tsx - Enhanced with Artist Mode Specific Content
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Import your component library
import BottomNavigation from './components/BottomNavigation';
import LoadingState from './components/common/LoadingState';
import StatusBadge from './components/common/StatusBadge';
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isArtistMode, setIsArtistMode] = useState(false);
  const [showModeSwitch, setShowModeSwitch] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [artistStats, setArtistStats] = useState(null);
  const [clientStats, setClientStats] = useState(null);
  
  // 🎯 NEW: Artist-specific data states
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [publishedGalleries, setPublishedGalleries] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [recentEarnings, setRecentEarnings] = useState([]);
  
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    loadUserInfo();
    loadUserStats();
    loadArtistData(); // 🎯 NEW: Load artist-specific data
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userData = JSON.parse(userInfoString);
        setUserInfo(userData);
        
        const savedMode = await AsyncStorage.getItem('isArtistMode');
        const artistMode = savedMode === 'true' && userData.isArtist;
        setIsArtistMode(artistMode);
        
        if (userData.isArtist && !userData.artistVerificationDate) {
          const updatedUserInfo = {
            ...userData,
            artistVerificationDate: new Date().toISOString(),
            artistVerificationStatus: 'verified'
          };
          setUserInfo(updatedUserInfo);
          await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 NEW: Load artist-specific data
  const loadArtistData = async () => {
    try {
      // Load applied projects
      const appliedProjectsData = await AsyncStorage.getItem('appliedProjects');
      if (appliedProjectsData) {
        setAppliedProjects(JSON.parse(appliedProjectsData));
      } else {
        // Mock data for applied projects
        const mockAppliedProjects = [
          {
            id: 1,
            title: 'Character Design Commission',
            status: 'pending',
            appliedAt: '2025-06-22 10:30',
            budget: '$200-500',
            clientName: 'Anonymous Client'
          },
          {
            id: 2,
            title: 'Anime Portrait Project',
            status: 'selected',
            appliedAt: '2025-06-20 14:15',
            budget: '$150-300',
            clientName: 'Art Lover'
          },
          {
            id: 3,
            title: 'Logo Design',
            status: 'completed',
            appliedAt: '2025-06-18 09:20',
            budget: '$100-200',
            clientName: 'StartupCo'
          }
        ];
        setAppliedProjects(mockAppliedProjects);
        await AsyncStorage.setItem('appliedProjects', JSON.stringify(mockAppliedProjects));
      }

      // Load published galleries
      const galleriesData = await AsyncStorage.getItem('myGalleries');
      if (galleriesData) {
        setPublishedGalleries(JSON.parse(galleriesData));
      } else {
        // Mock data for published galleries
        const mockGalleries = [
          {
            id: 1,
            title: 'Anime Style Portrait',
            price: 89,
            sold: 13,
            stock: 5,
            status: 'active',
            createdAt: '2025-06-15',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop'
          },
          {
            id: 2,
            title: 'Character Design Set',
            price: 156,
            sold: 8,
            stock: 2,
            status: 'active',
            createdAt: '2025-06-10',
            image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop'
          },
          {
            id: 3,
            title: 'Fantasy Portrait',
            price: 120,
            sold: 25,
            stock: 0,
            status: 'sold_out',
            createdAt: '2025-06-05',
            image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop'
          }
        ];
        setPublishedGalleries(mockGalleries);
        await AsyncStorage.setItem('myGalleries', JSON.stringify(mockGalleries));
      }

      // Mock recent earnings data
      const mockEarnings = [
        { date: '2025-06-22', amount: 89, source: 'Gallery Sale', title: 'Anime Portrait' },
        { date: '2025-06-20', amount: 156, source: 'Commission', title: 'Character Design' },
        { date: '2025-06-18', amount: 120, source: 'Gallery Sale', title: 'Fantasy Art' }
      ];
      setRecentEarnings(mockEarnings);

    } catch (error) {
      console.error('Error loading artist data:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const clientStatsData = await loadClientStats();
      setClientStats(clientStatsData);
      
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userData = JSON.parse(userInfoString);
        if (userData.isArtist) {
          const artistStatsData = await loadArtistStats();
          setArtistStats(artistStatsData);
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadClientStats = async () => {
    try {
      const [drafts, followingArtists, galleryCollection, purchasedGalleries] = await Promise.all([
        AsyncStorage.getItem('myDrafts'),
        AsyncStorage.getItem('followingArtists'),
        AsyncStorage.getItem('galleryCollection'),
        AsyncStorage.getItem('purchasedGalleries')
      ]);

      return {
        drafts: drafts ? JSON.parse(drafts).length : 574,
        followingArtists: followingArtists ? JSON.parse(followingArtists).length : 308,
        galleryCollection: galleryCollection ? JSON.parse(galleryCollection).length : 96,
        purchasedOrders: purchasedGalleries ? JSON.parse(purchasedGalleries).length : 4,
        pendingReviews: 1
      };
    } catch (error) {
      console.error('Error loading client stats:', error);
      return {
        drafts: 574,
        followingArtists: 308,
        galleryCollection: 96,
        purchasedOrders: 4,
        pendingReviews: 1
      };
    }
  };

  const loadArtistStats = async () => {
    try {
      const artistData = await AsyncStorage.getItem('artistStats');
      if (artistData) {
        return JSON.parse(artistData);
      }
      
      const defaultStats = {
        activeCommissions: 12,
        monthlyEarnings: 2847,
        portfolioItems: publishedGalleries.length || 3,
        totalSales: 156,
        averageRating: 4.9,
        responseTime: '2h',
        completionRate: 98,
        appliedProjects: appliedProjects.length || 3,
        selectedProjects: appliedProjects.filter(p => p.status === 'selected').length || 1
      };
      
      await AsyncStorage.setItem('artistStats', JSON.stringify(defaultStats));
      return defaultStats;
    } catch (error) {
      console.error('Error loading artist stats:', error);
      return {
        activeCommissions: 0,
        monthlyEarnings: 0,
        portfolioItems: 0,
        totalSales: 0,
        averageRating: 0,
        responseTime: 'N/A',
        completionRate: 0,
        appliedProjects: 0,
        selectedProjects: 0
      };
    }
  };

  // Mode switching logic (keeping existing functionality)
  const handleSwitchMode = async () => {
  // 🔧 修复：检查用户是否为艺术家且已验证
  const isVerifiedArtist = userInfo?.isArtist && userInfo?.artistVerificationStatus === 'verified';
  
  if (!isVerifiedArtist && !isArtistMode) {
    setShowModeSwitch(false);
    
    // 检查用户是否已经是艺术家但未验证
    if (userInfo?.isArtist && userInfo?.artistVerificationStatus !== 'verified') {
      const status = userInfo?.artistVerificationStatus || 'not_submitted';
      let message = '';
      
      switch (status) {
        case 'pending':
          message = 'Your artist verification is still being reviewed. Please wait for approval before switching to artist mode.';
          break;
        case 'rejected':
          message = 'Your artist verification was rejected. Please resubmit your verification documents.';
          break;
        case 'not_submitted':
        default:
          message = 'To become an artist on our platform, you need to complete the verification process.';
          break;
      }
      
      Alert.alert(
        'Artist Verification Required',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: status === 'rejected' ? 'Resubmit' : 'Start Verification', 
            onPress: () => router.push('/artist-verification')
          }
        ]
      );
    } else {
      // 用户完全不是艺术家
      Alert.alert(
        'Artist Verification Required',
        'To become an artist on our platform, you need to complete the verification process.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Verification', 
            onPress: () => router.push('/artist-verification')
          }
        ]
      );
    }
    return;
  }

  setIsSwitching(true);
  
  Animated.timing(fadeAnim, {
    toValue: 0.3,
    duration: 300,
    useNativeDriver: true,
  }).start();

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newMode = !isArtistMode;
    setIsArtistMode(newMode);
    
    await AsyncStorage.setItem('isArtistMode', newMode.toString());
    
    const updatedUserInfo = {
      ...userInfo,
      currentMode: newMode ? 'artist' : 'client',
      lastModeSwitch: new Date().toISOString()
    };
    setUserInfo(updatedUserInfo);
    await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    
    if (newMode && !artistStats) {
      const artistStatsData = await loadArtistStats();
      setArtistStats(artistStatsData);
    }
    
    setShowModeSwitch(false);
    
    const modeTitle = newMode ? 'Welcome to Artist Mode! 🎨' : 'Switched to Client Mode 🛒';
    const modeMessage = newMode 
      ? 'You can now manage your commissions, view earnings, and update your portfolio.'
      : 'You can now browse artists, commission artwork, and manage your orders.';
    
    Alert.alert(modeTitle, modeMessage, [{ text: 'Got it!' }]);
    
  } catch (error) {
    console.error('Error switching mode:', error);
    Alert.alert('Switch Failed', 'Unable to switch modes. Please try again.');
  } finally {
    setIsSwitching(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
};

// 🔧 同时更新模式切换模态框中的艺术家模式选项
// 在 renderModeSwitchModal 函数中找到 Artist Mode Option 部分并更新：

{/* Artist Mode Option */}
<TouchableOpacity 
  style={[
    styles.modeOption,
    isArtistMode && styles.activeModeOption,
    (!userInfo?.isArtist || userInfo?.artistVerificationStatus !== 'verified') && styles.disabledModeOption
  ]}
  onPress={() => {
    const isVerifiedArtist = userInfo?.isArtist && userInfo?.artistVerificationStatus === 'verified';
    
    if (!isArtistMode && isVerifiedArtist) {
      handleSwitchMode();
    } else if (!isVerifiedArtist) {
      setShowModeSwitch(false);
      
      if (userInfo?.isArtist && userInfo?.artistVerificationStatus !== 'verified') {
        const status = userInfo?.artistVerificationStatus || 'not_submitted';
        let message = '';
        
        switch (status) {
          case 'pending':
            message = 'Your verification is being reviewed. Please wait for approval.';
            break;
          case 'rejected':
            message = 'Your verification was rejected. Please resubmit your documents.';
            break;
          default:
            message = 'Complete artist verification to access artist mode.';
            break;
        }
        
        Alert.alert('Verification Required', message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Verify Now', onPress: () => router.push('/artist-verification') }
        ]);
      } else {
        Alert.alert(
          'Artist Verification Required',
          'Complete artist verification to access artist mode.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Verify Now', onPress: () => router.push('/artist-verification') }
          ]
        );
      }
    }
  }}
>
  <View style={styles.modeIcon}>
    <Text style={styles.modeIconText}>🎨</Text>
  </View>
  <View style={styles.modeInfo}>
    <Text style={styles.modeTitle}>Artist Mode</Text>
    <Text style={styles.modeDescription}>
      {(!userInfo?.isArtist || userInfo?.artistVerificationStatus !== 'verified') 
        ? 'Requires artist verification to access'
        : 'Manage commissions, upload artwork, and track earnings'
      }
    </Text>
  </View>
  {isArtistMode && (
    <View style={styles.activeIndicator}>
      <Text style={styles.activeIndicatorText}>✓</Text>
    </View>
  )}
  {(!userInfo?.isArtist || userInfo?.artistVerificationStatus !== 'verified') && (
    <View style={styles.lockIndicator}>
      <Text style={styles.lockText}>🔒</Text>
    </View>
  )}
</TouchableOpacity>

  // Navigation handlers
  const handleEditProfile = () => {
    router.push({
      pathname: '/edit-profile',
      params: {
        userId: userInfo?.id,
        username: userInfo?.username,
        email: userInfo?.email,
        avatar: userInfo?.avatar,
        isArtist: userInfo?.isArtist?.toString()
      }
    });
  };

  // 🎯 NEW: Artist-specific navigation handlers
  const handleAppliedProjects = () => router.push('/applied-projects');
  const handlePublishedGalleries = () => router.push('/published-galleries');
  const handleEarningsHistory = () => router.push('/earnings-history');
  const handleCommissionRequests = () => router.push('/commission-requests');

  // Client mode handlers (keeping existing)
  const handleMyDrafts = () => router.push('/my-drafts');
  const handleFollowingArtists = () => router.push('/following-artists');
  const handleGalleryCollection = () => router.push('/gallery-collection');
  const handleViewCalendar = () => router.push('/commission-calendar');
  const handlePendingReviews = () => router.push('/pending-reviews');
  const handleArtistDashboard = () => router.push('/artist-dashboard');
  const handleManageCommissions = () => router.push('/manage-commissions');
  const handleEarnings = () => router.push('/earnings-dashboard');
  const handlePortfolioManagement = () => router.push('/portfolio-management');
  const handleArtistAnalytics = () => router.push('/artist-analytics');
  const handleScanQR = () => router.push('/qr-scanner');

  const getVerificationStatus = () => {
    if (!userInfo?.isArtist) return null;
    
    const status = userInfo.artistVerificationStatus || 'verified';
    const verificationDate = userInfo.artistVerificationDate;
    
    return {
      status,
      date: verificationDate ? new Date(verificationDate).toLocaleDateString() : 'Unknown',
      isVerified: status === 'verified'
    };
  };

  // 🎯 NEW: Render artist-specific stats
  const renderArtistStats = () => (
    <View style={styles.statsContainer}>
      <TouchableOpacity 
        style={styles.statItem}
        onPress={handleAppliedProjects}
      >
        <Text style={styles.statNumber}>{artistStats?.appliedProjects || appliedProjects.length}</Text>
        <Text style={styles.statLabel}>Applied Projects</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.statItem}
        onPress={handlePublishedGalleries}
      >
        <Text style={styles.statNumber}>{publishedGalleries.length}</Text>
        <Text style={styles.statLabel}>Published Galleries</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.statItem}
        onPress={handleEarnings}
      >
        <Text style={styles.statNumber}>${artistStats?.monthlyEarnings?.toLocaleString() || '2,847'}</Text>
        <Text style={styles.statLabel}>This Month</Text>
      </TouchableOpacity>
    </View>
  );

  // 🎯 NEW: Render artist-specific content
  const renderArtistContent = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Artist Dashboard</Text>
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={handleArtistDashboard}
        >
          <Text style={styles.dashboardIcon}>📊</Text>
          <Text style={styles.dashboardText}>View Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Artist Performance Summary */}
      <View style={styles.performanceSummary}>
        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>{artistStats?.completionRate || 98}%</Text>
          <Text style={styles.performanceLabel}>Completion Rate</Text>
        </View>
        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>{artistStats?.responseTime || '2h'}</Text>
          <Text style={styles.performanceLabel}>Avg Response</Text>
        </View>
        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>⭐ {artistStats?.averageRating || 4.9}</Text>
          <Text style={styles.performanceLabel}>Rating</Text>
        </View>
      </View>

      {/* Applied Projects Section */}
      <TouchableOpacity 
        style={styles.orderItem}
        onPress={handleAppliedProjects}
      >
        <View style={styles.orderLeft}>
          <Text style={styles.orderIcon}>📋</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Applied Projects</Text>
            <Text style={styles.orderSubtitle}>Track your project applications</Text>
          </View>
        </View>
        <View style={styles.orderRight}>
          <StatusBadge 
            status="pending" 
            text={appliedProjects.filter(p => p.status === 'pending').length.toString()}
            size="small"
          />
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Published Galleries Section */}
      <TouchableOpacity 
        style={styles.orderItem}
        onPress={handlePublishedGalleries}
      >
        <View style={styles.orderLeft}>
          <Text style={styles.orderIcon}>🖼️</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Published Galleries</Text>
            <Text style={styles.orderSubtitle}>Manage your artwork listings</Text>
          </View>
        </View>
        <View style={styles.orderRight}>
          <Text style={styles.orderCount}>{publishedGalleries.length} active listings</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Earnings Section */}
      <TouchableOpacity 
        style={styles.orderItem}
        onPress={handleEarningsHistory}
      >
        <View style={styles.orderLeft}>
          <Text style={styles.orderIcon}>💰</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Earnings & Payouts</Text>
            <Text style={styles.orderSubtitle}>Income and payment history</Text>
          </View>
        </View>
        <View style={styles.orderRight}>
          <Text style={styles.orderCount}>${artistStats?.monthlyEarnings?.toLocaleString() || '2,847'} this month</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Commission Requests */}
      <TouchableOpacity 
        style={styles.orderItem}
        onPress={handleCommissionRequests}
      >
        <View style={styles.orderLeft}>
          <Text style={styles.orderIcon}>🎨</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Commission Requests</Text>
            <Text style={styles.orderSubtitle}>Direct commission inquiries</Text>
          </View>
        </View>
        <View style={styles.orderRight}>
          <StatusBadge 
            status="active" 
            text="3"
            size="small"
          />
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Recent Activity Summary */}
      <View style={styles.recentActivity}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        {recentEarnings.slice(0, 3).map((earning, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityDescription}>{earning.source}: {earning.title}</Text>
              <Text style={styles.activityDate}>{earning.date}</Text>
            </View>
            <Text style={styles.activityAmount}>+${earning.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Render client content (keeping existing)
  const renderClientContent = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Commissions</Text>
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={handleViewCalendar}
        >
          <Text style={styles.calendarIcon}>📅</Text>
          <Text style={styles.calendarText}>View Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Client Menu Items */}
      <TouchableOpacity 
        style={styles.orderItem}
        onPress={() => router.push('/purchased-gallery')}
      >
        <View style={styles.orderLeft}>
          <Text style={styles.orderIcon}>🖼️</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Gallery Orders</Text>
            <Text style={styles.orderSubtitle}>Purchased artwork and commissions</Text>
          </View>
        </View>
        <View style={styles.orderRight}>
          <Text style={styles.orderCount}>{clientStats?.purchasedOrders} orders purchased</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.orderItem}
        onPress={handlePendingReviews}
      >
        <View style={styles.orderLeft}>
          <StatusBadge 
            status="pending" 
            text={clientStats?.pendingReviews.toString()}
            size="small"
          />
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Pending Reviews</Text>
            <Text style={styles.orderSubtitle}>Rate your completed orders</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.orderItem}
        onPress={() => router.push('/my-projects')}
      >
        <View style={styles.orderLeft}>
          <Text style={styles.orderIcon}>📋</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Project Collaborations</Text>
            <Text style={styles.orderSubtitle}>Custom project requests</Text>
          </View>
        </View>
        <View style={styles.orderRight}>
          <Text style={styles.orderCount}>3 projects in progress</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Client Status Indicators */}
      <View style={styles.statusIndicators}>
        <View style={styles.statusItem}>
          <StatusBadge status="pending" text="10" size="small" />
          <Text style={styles.statusText}>Pending Payment</Text>
        </View>
        <View style={styles.statusItem}>
          <StatusBadge status="active" text={clientStats?.pendingReviews.toString() || "1"} size="small" />
          <Text style={styles.statusText}>Pending Reviews</Text>
        </View>
      </View>
    </View>
  );

  // Mode switch modal (keeping existing)
  const renderModeSwitchModal = () => (
    <Modal
      visible={showModeSwitch}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowModeSwitch(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modeSwitchModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Switch Mode</Text>
            <TouchableOpacity 
              onPress={() => setShowModeSwitch(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modeOptions}>
            {/* Client Mode Option */}
            <TouchableOpacity 
              style={[
                styles.modeOption,
                !isArtistMode && styles.activeModeOption
              ]}
              onPress={() => {
                if (isArtistMode) handleSwitchMode();
              }}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconText}>🛒</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>Client Mode</Text>
                <Text style={styles.modeDescription}>
                  Browse artists, commission artwork, and manage your orders
                </Text>
              </View>
              {!isArtistMode && (
                <View style={styles.activeIndicator}>
                  <Text style={styles.activeIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Artist Mode Option */}
            <TouchableOpacity 
              style={[
                styles.modeOption,
                isArtistMode && styles.activeModeOption,
                !userInfo?.isArtist && styles.disabledModeOption
              ]}
              onPress={() => {
                if (!isArtistMode && userInfo?.isArtist) handleSwitchMode();
                else if (!userInfo?.isArtist) {
                  setShowModeSwitch(false);
                  Alert.alert(
                    'Artist Verification Required',
                    'Complete artist verification to access artist mode.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Verify Now', onPress: () => router.push('/artist-verification') }
                    ]
                  );
                }
              }}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconText}>🎨</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>Artist Mode</Text>
                <Text style={styles.modeDescription}>
                  Manage commissions, upload artwork, and track earnings
                </Text>
              </View>
              {isArtistMode && (
                <View style={styles.activeIndicator}>
                  <Text style={styles.activeIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Switch Button */}
          {userInfo?.isArtist && (
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.switchButton, isSwitching && styles.switchButtonDisabled]}
                onPress={handleSwitchMode}
                disabled={isSwitching}
              >
                {isSwitching ? (
                  <View style={styles.switchingContainer}>
                    <Text style={styles.switchingDots}>●●●</Text>
                    <Text style={styles.switchButtonText}>Switching...</Text>
                  </View>
                ) : (
                  <Text style={styles.switchButtonText}>
                    Switch to {isArtistMode ? 'Client' : 'Artist'} Mode
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={GlobalStyles.container}>
        <LoadingState text="Loading profile..." />
      </View>
    );
  }

  const verification = getVerificationStatus();

  return (
    <View style={GlobalStyles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[
            styles.modeSwitchButton,
            isArtistMode && styles.artistModeButton
          ]}
          onPress={() => setShowModeSwitch(true)}
        >
          <Text style={styles.switchIcon}>
            {isArtistMode ? '🎨' : '🔄'}
          </Text>
          <Text style={[
            styles.switchText,
            isArtistMode && styles.artistModeText
          ]}>
            {isArtistMode ? 'Artist Mode' : 'Switch to Artist'}
          </Text>
          {isArtistMode && (
            <View style={styles.modeIndicatorDot} />
          )}
        </TouchableOpacity>
        
        <View style={styles.topActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleScanQR}
          >
            <Text style={styles.actionIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Indicator Banner */}
        {isArtistMode && (
          <View style={styles.modeIndicatorBanner}>
            <Text style={styles.modeIndicatorIcon}>🎨</Text>
            <View style={styles.modeIndicatorContent}>
              <Text style={styles.modeIndicatorText}>Artist Mode Active</Text>
              <Text style={styles.modeIndicatorSubtext}>
                Manage your art business and commissions
              </Text>
            </View>
            <StatusBadge status="verified" text="PRO" size="small" />
          </View>
        )}

        {/* User Profile Section */}
        <View style={styles.userSection}>
          <TouchableOpacity 
            style={styles.userHeader}
            onPress={handleEditProfile}
          >
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: userInfo?.avatar || 'https://i.pravatar.cc/80?img=1' }} 
                style={Layout.avatarLarge} 
              />
              {verification?.isVerified && (
                <View style={styles.verificationBadge}>
                  <Text style={styles.verificationBadgeText}>✓</Text>
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userInfo?.username || 'qwwius'}</Text>
              {verification?.isVerified && (
                <StatusBadge 
                  status="verified" 
                  text={`Verified Artist • Since ${verification.date}`}
                  size="small"
                />
              )}
              {isArtistMode && artistStats && (
                <Text style={styles.artistRating}>
                  ⭐ {artistStats.averageRating} • {artistStats.totalSales} sales
                </Text>
              )}
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Dynamic Stats based on mode */}
          {isArtistMode ? renderArtistStats() : (
            <View style={styles.statsContainer}>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={handleMyDrafts}
              >
                <Text style={styles.statNumber}>{clientStats?.drafts || 574}</Text>
                <Text style={styles.statLabel}>My Drafts</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={handleFollowingArtists}
              >
                <Text style={styles.statNumber}>{clientStats?.followingArtists || 308}</Text>
                <Text style={styles.statLabel}>Following Artists</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={handleGalleryCollection}
              >
                <Text style={styles.statNumber}>{clientStats?.galleryCollection || 96}</Text>
                <Text style={styles.statLabel}>Gallery Collection</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Dynamic Content based on mode */}
        {isArtistMode ? renderArtistContent() : renderClientContent()}

        <View style={GlobalStyles.bottomPadding} />
      </Animated.ScrollView>

      <BottomNavigation activeTab="profile" />
      {renderModeSwitchModal()}
    </View>
  );
};

// Enhanced styles with new artist-specific components
const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  // Header Actions
  headerActions: {
    ...Layout.rowSpaceBetween,
    ...Layout.paddingHorizontal,
    paddingTop: 50,
    paddingBottom: Layout.spacing.lg,
  },
  modeSwitchButton: {
    ...Layout.row,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  artistModeButton: {
    backgroundColor: Colors.artist,
    borderColor: Colors.verified,
  },
  switchIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.sm,
  },
  switchText: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  artistModeText: {
    color: Colors.verified,
    fontWeight: 'bold',
  },
  modeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: Layout.radius.xs,
    backgroundColor: Colors.verified,
    marginLeft: Layout.spacing.sm,
  },
  topActions: {
    ...Layout.row,
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.md,
  },
  actionIcon: {
    fontSize: 18,
  },

  // Mode Indicator Banner
  modeIndicatorBanner: {
    backgroundColor: Colors.artist,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.verified,
  },
  modeIndicatorIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  modeIndicatorContent: {
    flex: 1,
  },
  modeIndicatorText: {
    ...Typography.body,
    color: Colors.verified,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modeIndicatorSubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  // User Section
  userSection: {
    ...Layout.card,
    ...Layout.marginHorizontal,
    marginBottom: Layout.spacing.lg,
  },
  userHeader: {
    ...Layout.row,
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Layout.spacing.lg,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.verified,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  verificationBadgeText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.h4,
    marginBottom: Layout.spacing.sm,
  },
  artistRating: {
    ...Typography.bodySmall,
    color: Colors.rating,
  },
  chevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },

  // Stats Container
  statsContainer: {
    ...Layout.row,
    justifyContent: 'space-around',
    paddingVertical: Layout.spacing.lg,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...Typography.h3,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Performance Summary (Artist Mode)
  performanceSummary: {
    ...Layout.row,
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    ...Typography.bodyLarge,
    color: Colors.verified,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  performanceLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Section Styles
  section: {
    ...Layout.marginHorizontal,
    marginBottom: Layout.spacing.lg,
  },
  sectionHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
  },
  calendarButton: {
    ...Layout.row,
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
  },
  dashboardButton: {
    ...Layout.row,
    alignItems: 'center',
    backgroundColor: Colors.artist,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
  },
  calendarIcon: {
    fontSize: 14,
    marginRight: Layout.spacing.sm,
  },
  dashboardIcon: {
    fontSize: 14,
    marginRight: Layout.spacing.sm,
  },
  calendarText: {
    ...Typography.buttonSmall,
  },
  dashboardText: {
    ...Typography.buttonSmall,
    color: Colors.verified,
  },

  // Order Item Styles
  orderItem: {
    ...Layout.listItem,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  orderLeft: {
    ...Layout.row,
    alignItems: 'center',
    flex: 1,
  },
  orderIcon: {
    fontSize: 22,
    marginRight: Layout.spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderSubtitle: {
    ...Typography.caption,
  },
  orderRight: {
    ...Layout.row,
    alignItems: 'center',
  },
  orderCount: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginRight: Layout.spacing.sm,
  },

  // 🎯 NEW: Recent Activity Styles
  recentActivity: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
  },
  activityTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    ...Typography.bodySmall,
    marginBottom: 2,
  },
  activityDate: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  activityAmount: {
    ...Typography.bodySmall,
    color: Colors.success,
    fontWeight: 'bold',
  },

  // Status Indicators
  statusIndicators: {
    ...Layout.row,
    justifyContent: 'space-around',
    marginTop: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    ...Layout.borderTop,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
  },

  // Modal Styles (keeping existing)
  modalOverlay: {
    ...Layout.modalOverlay,
  },
  modeSwitchModal: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xl,
    width: '90%',
    maxWidth: 420,
    maxHeight: '80%',
  },
  modalHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    padding: Layout.spacing.xxl,
    ...Layout.borderBottom,
  },
  modalTitle: {
    ...Typography.h4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    ...Typography.body,
    fontWeight: 'bold',
  },

  lockIndicator: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lockText: {
    fontSize: 16,
    opacity: 0.6,
  },

  // Mode Options
  modeOptions: {
    padding: Layout.spacing.xl,
  },
  modeOption: {
    ...Layout.row,
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeModeOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  disabledModeOption: {
    opacity: 0.6,
  },
  modeIcon: {
    width: 60,
    height: 60,
    borderRadius: Layout.radius.round,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
  },
  modeIconText: {
    fontSize: 28,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    ...Typography.bodyLarge,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
  },
  modeDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Layout.spacing.md,
  },
  activeIndicator: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.md,
  },
  activeIndicatorText: {
    ...Typography.body,
    fontWeight: 'bold',
  },

  // Modal Actions
  modalActions: {
    padding: Layout.spacing.xl,
    ...Layout.borderTop,
  },
  switchButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  switchButtonDisabled: {
    backgroundColor: Colors.card,
  },
  switchingContainer: {
    ...Layout.row,
    alignItems: 'center',
  },
  switchingDots: {
    ...Typography.body,
    marginRight: Layout.spacing.sm,
    opacity: 0.7,
  },
  switchButtonText: {
    ...Typography.button,
  },
});

export default ProfilePage;