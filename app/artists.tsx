import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const ArtistsPage = () => {
  const [activeTab, setActiveTab] = useState('Artists');

  // Animation values for page swiping
  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0); // 0 = Artists, 1 = Portfolio, 2 = Rankings

  // Handle tab switch
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    let targetPage = 0;
    if (tab === 'Portfolio') targetPage = 1;
    else if (tab === 'Rankings') targetPage = 2;
    
    currentPage.value = targetPage;
    translateX.value = withTiming(-targetPage * screenWidth, {
      duration: 300,
    });
  };

  // Pan gesture handler for swiping between pages
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const threshold = screenWidth / 3;
      let newPage = currentPage.value;
      
      if (event.translationX < -threshold && currentPage.value < 2) {
        newPage = currentPage.value + 1;
      } else if (event.translationX > threshold && currentPage.value > 0) {
        newPage = currentPage.value - 1;
      }
      
      currentPage.value = newPage;
      translateX.value = withTiming(-newPage * screenWidth, { duration: 250 });
      
      const tabs = ['Artists', 'Portfolio', 'Rankings'];
      runOnJS(setActiveTab)(tabs[newPage]);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Mock data for artists
  const artistsData = [
    {
      id: 1,
      name: 'CuiHuaForgetWhy',
      username: 'Price List',
      rating: 5.0,
      reviewCount: 3,
      avatar: 'https://i.pravatar.cc/60?img=1',
      artworks: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop'
      ]
    },
    {
      id: 2,
      name: 'KingchickenShine',
      username: 'Extended Queue',
      secondaryUsername: 'Price List',
      rating: 5.0,
      reviewCount: 55,
      avatar: 'https://i.pravatar.cc/60?img=2',
      artworks: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop'
      ]
    },
    {
      id: 3,
      name: 'UnicornBacon',
      username: 'Extended Queue',
      secondaryUsername: 'Price List',
      rating: 5.0,
      reviewCount: 28,
      avatar: 'https://i.pravatar.cc/60?img=3',
      artworks: [
        'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop'
      ]
    }
  ];

  const renderArtist = (artist: any) => (
    <TouchableOpacity 
      key={artist.id} 
      style={styles.artistCard}
      onPress={() => {
        router.push({
          pathname: '/artist-detail',
          params: {
            artistId: artist.id,
            artistName: artist.name,
            artistAvatar: artist.avatar
          }
        });
      }}
    >
      <View style={styles.artistHeader}>
        <Image source={{ uri: artist.avatar }} style={styles.artistAvatar} />
        <View style={styles.artistInfo}>
          <View style={styles.artistNameContainer}>
            <Text style={styles.artistName}>{artist.name}</Text>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{artist.username}</Text>
              </View>
              {artist.secondaryUsername && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{artist.secondaryUsername}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐{artist.rating}</Text>
            <Text style={styles.reviewCount}>{artist.reviewCount} Reviews</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.artworkGrid}>
        {artist.artworks.map((artwork, index) => (
          <View key={index} style={styles.artworkContainer}>
            <Image source={{ uri: artwork }} style={styles.artworkImage} />
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  // Artists Page Content
  const ArtistsContent = () => (
    <View style={styles.pageContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      {/* Invitation Calendar Card */}
      <TouchableOpacity style={styles.invitationCard}>
        <View style={styles.invitationIcon}>
          <Text style={styles.calendarIcon}>📅</Text>
        </View>
        <View style={styles.invitationContent}>
          <Text style={styles.invitationTitle}>Invitation Calendar</Text>
          <Text style={styles.invitationSubtitle}>Recently 714 artists opened invitations</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={[styles.categoryTab, styles.activeCategoryTab]}>
          <Text style={styles.categoryIcon}>💖</Text>
          <Text style={[styles.categoryText, styles.activeCategoryText]}>Recommended</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab}>
          <Text style={styles.categoryText}>Latest</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Extended Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Has Price List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Art Style ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Artists List */}
      <View style={styles.artistsList}>
        {artistsData.map((artist) => renderArtist(artist))}
      </View>
    </View>
  );

  // Portfolio Page Content (placeholder)
  const PortfolioContent = () => (
    <View style={styles.pageContent}>
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Portfolio Page</Text>
        <Text style={styles.placeholderSubtext}>Coming Soon...</Text>
      </View>
    </View>
  );

  // Rankings Page Content (placeholder)
  const RankingsContent = () => (
    <View style={styles.pageContent}>
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Rankings Page</Text>
        <Text style={styles.placeholderSubtext}>Coming Soon...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Artists' && styles.activeTab]}
            onPress={() => handleTabSwitch('Artists')}
          >
            <Text style={[styles.tabText, activeTab === 'Artists' && styles.activeTabText]}>
              Artists
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Portfolio' && styles.activeTab]}
            onPress={() => handleTabSwitch('Portfolio')}
          >
            <Text style={[styles.tabText, activeTab === 'Portfolio' && styles.activeTabText]}>
              Portfolio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Rankings' && styles.activeTab]}
            onPress={() => handleTabSwitch('Rankings')}
          >
            <Text style={[styles.tabText, activeTab === 'Rankings' && styles.activeTabText]}>
              Rankings
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.swipeContainer, animatedStyle]}>
          {/* Artists Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <ArtistsContent />
            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Portfolio Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <PortfolioContent />
            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Rankings Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <RankingsContent />
            <View style={styles.bottomPadding} />
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/homepage')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🎨</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navText}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navText}>Messages</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00A8FF',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Swipe container styles
  swipeContainer: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth * 3,
  },
  page: {
    width: screenWidth,
    flex: 1,
  },
  pageContent: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  // Invitation Calendar Card
  invitationCard: {
    backgroundColor: '#2A3A4A',
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  invitationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A4A5A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calendarIcon: {
    fontSize: 24,
  },
  invitationContent: {
    flex: 1,
  },
  invitationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  invitationSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  chevron: {
    fontSize: 20,
    color: '#888',
  },
  // Category Tabs
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeCategoryTab: {
    borderBottomColor: '#00A8FF',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#888',
  },
  activeCategoryText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  // Filter Buttons
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  // Artists List
  artistsList: {
    paddingHorizontal: 24,
  },
  artistCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  artistHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  artistInfo: {
    flex: 1,
  },
  artistNameContainer: {
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  // Artwork Grid
  artworkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  artworkContainer: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  // Placeholder content
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#888',
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
});

export default ArtistsPage;