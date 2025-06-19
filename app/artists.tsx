import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
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

  // Portfolio page states
  const [activeCategoryTab, setActiveCategoryTab] = useState('Recommended');
  const [activeFilters, setActiveFilters] = useState({
    type: 'All',
    style: 'All', 
    technique: 'All',
    attribute: 'All'
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState('');

  // Like states for artworks - 使用 Map 来存储每个作品的点赞状态
  const [artworkLikes, setArtworkLikes] = useState(new Map());

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

  // Mock artwork data with random aspect ratios for waterfall layout
  const artworkItems = [
    {
      id: 1,
      title: 'Fantasy Character Design',
      artist: 'Artist Name',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      likes: 234,
      isLiked: false,
      aspectRatio: 1.5, // Height/width
      category: 'Character',
      style: 'Japanese',
      technique: 'Digital'
    },
    {
      id: 2,
      title: 'Anime Portrait',
      artist: 'Artist Name 2',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop',
      likes: 156,
      isLiked: true,
      aspectRatio: 1.25,
      category: 'Portrait',
      style: 'Japanese',
      technique: 'Digital'
    },
    {
      id: 3,
      title: 'Character Illustration',
      artist: 'Artist Name 3',
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&h=700&fit=crop',
      likes: 342,
      isLiked: false,
      aspectRatio: 1.75,
      category: 'Illustration',
      style: 'Western',
      technique: 'Traditional'
    },
    {
      id: 4,
      title: 'Concept Art',
      artist: 'Artist Name 4',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=450&fit=crop',
      likes: 89,
      isLiked: false,
      aspectRatio: 1.125,
      category: 'Concept',
      style: 'Japanese',
      technique: 'Digital'
    },
    {
      id: 5,
      title: 'Character Sheet',
      artist: 'Artist Name 5',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
      likes: 278,
      isLiked: true,
      aspectRatio: 1.5,
      category: 'Character',
      style: 'Western',
      technique: 'Digital'
    },
    {
      id: 6,
      title: 'Scene Design',
      artist: 'Artist Name 6',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=520&fit=crop',
      likes: 445,
      isLiked: false,
      aspectRatio: 1.3,
      category: 'Scene',
      style: 'Ancient',
      technique: 'Watercolor'
    },
    {
      id: 7,
      title: 'Landscape Art',
      artist: 'Artist Name 7',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      likes: 198,
      isLiked: false,
      aspectRatio: 0.75, // Landscape ratio
      category: 'Landscape',
      style: 'Western',
      technique: 'Digital'
    },
    {
      id: 8,
      title: 'Abstract Design',
      artist: 'Artist Name 8',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=800&fit=crop',
      likes: 321,
      isLiked: true,
      aspectRatio: 2.0, // Very tall
      category: 'Abstract',
      style: 'Modern',
      technique: 'Digital'
    }
  ];

  // Filter options
  const filterOptions = {
    type: ['All', 'Drawing', 'Q-Version', 'Character', 'Scene', 'Portrait', 'Live2D'],
    style: ['All', 'Japanese', 'Ancient', 'Western'],
    technique: ['All', 'Traditional', 'Digital', 'CG', 'Realistic', 'Watercolor'],
    attribute: ['All', 'Female', 'Male']
  };

  const cardWidth = (screenWidth - 60) / 2; // Width for two columns

  // Handle like toggle for artworks
  const handleArtworkLike = (artworkId: number, currentLiked: boolean, currentLikes: number) => {
    setArtworkLikes(prev => {
      const newMap = new Map(prev);
      const key = `${artworkId}`;
      const currentState = newMap.get(key) || { isLiked: currentLiked, likes: currentLikes };
      
      newMap.set(key, {
        isLiked: !currentState.isLiked,
        likes: currentState.isLiked ? currentState.likes - 1 : currentState.likes + 1
      });
      
      return newMap;
    });
  };

  // Get current like state for artwork
  const getArtworkLikeState = (artworkId: number, defaultLiked: boolean, defaultLikes: number) => {
    const state = artworkLikes.get(`${artworkId}`);
    return state || { isLiked: defaultLiked, likes: defaultLikes };
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setShowFilterModal(false);
  };

  const openFilterModal = (filterType: string) => {
    setCurrentFilterType(filterType);
    setShowFilterModal(true);
  };

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

  // Waterfall layout calculation
  const renderWaterfallArtwork = () => {
    const leftColumn = [];
    const rightColumn = [];
    let leftHeight = 0;
    let rightHeight = 0;

    artworkItems.forEach((item) => {
      const likeState = getArtworkLikeState(item.id, item.isLiked, item.likes);
      const cardHeight = cardWidth * item.aspectRatio;
      
      // Add to the shorter column
      if (leftHeight <= rightHeight) {
        leftColumn.push({ ...item, likeState });
        leftHeight += cardHeight + 8; // 8px margin
      } else {
        rightColumn.push({ ...item, likeState });
        rightHeight += cardHeight + 8;
      }
    });

    return (
      <View style={styles.waterfallContainer}>
        <View style={styles.column}>
          {leftColumn.map((item, index) => renderWaterfallCard(item, index))}
        </View>
        <View style={styles.column}>
          {rightColumn.map((item, index) => renderWaterfallCard(item, index))}
        </View>
      </View>
    );
  };

  const renderWaterfallCard = (item: any, index: number) => {
    return (
      <TouchableOpacity 
        key={`artwork-${item.id}-${index}`} 
        style={styles.waterfallCard}
        onPress={() => {
          router.push({
            pathname: '/artwork-detail',
            params: {
              artworkId: item.id,
              title: item.title,
              artist: item.artist,
              image: item.image,
              likes: item.likeState.likes,
              isLiked: item.likeState.isLiked
            }
          });
        }}
      >
        <View style={styles.waterfallImageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={[
              styles.waterfallImage,
              { height: cardWidth * item.aspectRatio }
            ]}
            resizeMode="cover"
          />
          
          {/* Like Button - No count, just heart */}
          <TouchableOpacity 
            style={styles.simpleLikeButton}
            onPress={(e) => {
              e.stopPropagation();
              handleArtworkLike(item.id, item.likeState.isLiked, item.likeState.likes);
            }}
          >
            <Text style={[styles.simpleLikeIcon, item.likeState.isLiked && styles.likedIcon]}>
              {item.likeState.isLiked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentFilterType === 'type' && 'Type'}
              {currentFilterType === 'style' && 'Style'}
              {currentFilterType === 'technique' && 'Technique'}
              {currentFilterType === 'attribute' && 'Attribute'}
            </Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterOptionsContainer}>
            <View style={styles.filterGrid}>
              {filterOptions[currentFilterType]?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    activeFilters[currentFilterType] === option && styles.selectedFilterOption
                  ]}
                  onPress={() => handleFilterSelect(currentFilterType, option)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    activeFilters[currentFilterType] === option && styles.selectedFilterOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Artists Page Content
  const ArtistsContent = () => (
    <View style={styles.pageContent}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

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

      <View style={styles.categoryContainer}>
        <TouchableOpacity style={[styles.categoryTab, styles.activeCategoryTab]}>
          <Text style={styles.categoryIcon}>💖</Text>
          <Text style={[styles.categoryText, styles.activeCategoryText]}>Recommended</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab}>
          <Text style={styles.categoryText}>Latest</Text>
        </TouchableOpacity>
      </View>

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

      <View style={styles.artistsList}>
        {artistsData.map((artist) => renderArtist(artist))}
      </View>
    </View>
  );

  // Portfolio Page Content
  const PortfolioContent = () => (
    <View style={styles.pageContent}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryTab, activeCategoryTab === 'Following' && styles.activeCategoryTab]}
          onPress={() => setActiveCategoryTab('Following')}
        >
          <Text style={[styles.categoryText, activeCategoryTab === 'Following' && styles.activeCategoryText]}>
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, activeCategoryTab === 'Recommended' && styles.activeCategoryTab]}
          onPress={() => setActiveCategoryTab('Recommended')}
        >
          <Text style={styles.categoryIcon}>💖</Text>
          <Text style={[styles.categoryText, activeCategoryTab === 'Recommended' && styles.activeCategoryText]}>
            Recommended
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, activeCategoryTab === 'Latest' && styles.activeCategoryTab]}
          onPress={() => setActiveCategoryTab('Latest')}
        >
          <Text style={[styles.categoryText, activeCategoryTab === 'Latest' && styles.activeCategoryText]}>
            Latest
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilters.type !== 'All' && styles.activeFilterButton]}
          onPress={() => openFilterModal('type')}
        >
          <Text style={[styles.filterText, activeFilters.type !== 'All' && styles.activeFilterText]}>
            Type {activeFilters.type !== 'All' && `▲`}
            {activeFilters.type === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, activeFilters.style !== 'All' && styles.activeFilterButton]}
          onPress={() => openFilterModal('style')}
        >
          <Text style={[styles.filterText, activeFilters.style !== 'All' && styles.activeFilterText]}>
            Style {activeFilters.style !== 'All' && `▲`}
            {activeFilters.style === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, activeFilters.technique !== 'All' && styles.activeFilterButton]}
          onPress={() => openFilterModal('technique')}
        >
          <Text style={[styles.filterText, activeFilters.technique !== 'All' && styles.activeFilterText]}>
            Technique {activeFilters.technique !== 'All' && `▲`}
            {activeFilters.technique === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, activeFilters.attribute !== 'All' && styles.activeFilterButton]}
          onPress={() => openFilterModal('attribute')}
        >
          <Text style={[styles.filterText, activeFilters.attribute !== 'All' && styles.activeFilterText]}>
            Attribute {activeFilters.attribute !== 'All' && `▲`}
            {activeFilters.attribute === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Waterfall Layout Artworks Grid */}
      {renderWaterfallArtwork()}
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

      {renderFilterModal()}
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
    justifyContent: 'flex-start',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minWidth: 80,
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
  activeFilterButton: {
    backgroundColor: '#00A8FF',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  // Artwork Grid for Artists page
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
  // Waterfall layout styles
  waterfallContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  column: {
    width: (screenWidth - 60) / 2,
  },
  waterfallCard: {
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  waterfallImageContainer: {
    position: 'relative',
  },
  waterfallImage: {
    width: '100%',
  },
  // Simplified Like Button - No count
  simpleLikeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleLikeIcon: {
    fontSize: 20,
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 20,
    color: '#888',
  },
  filterOptionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterOption: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedFilterOption: {
    backgroundColor: '#00A8FF',
    borderColor: '#00A8FF',
  },
  filterOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedFilterOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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