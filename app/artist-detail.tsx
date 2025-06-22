import { router, useLocalSearchParams } from 'expo-router';
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

const ArtistDetailPage = () => {
  const params = useLocalSearchParams();
  const { artistId, artistName, artistAvatar } = params;

  const [activeTab, setActiveTab] = useState('Portfolio');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Animation values for page swiping
  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0); // 0 = Portfolio, 1 = Gallery, 2 = Reviews

  // Mock artist data
  const artistData = {
    id: artistId || 1,
    name: artistName || 'BuYeHouHou',
    username: '@buye_artist',
    avatar: artistAvatar || 'https://i.pravatar.cc/120?img=1',
    backgroundImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    rating: 5.0,
    badge: 'Premium Artist',
    bio: '•°°• I love you •°°•\n***I love you***',
    hasInvitationCalendar: true,
    invitationDate: 'June 18, 2025 21:00',
    hasPriceList: true,
    portfolioCount: 100,
    galleryCount: 4,
    reviewCount: 49
  };

  // Handle tab switch
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    let targetPage = 0;
    if (tab === 'Gallery') targetPage = 1;
    else if (tab === 'Reviews') targetPage = 2;
    
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
      
      const tabs = ['Portfolio', 'Gallery', 'Reviews'];
      runOnJS(setActiveTab)(tabs[newPage]);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Mock portfolio data
  const portfolioItems = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
  ];

  // Mock price list data
  const priceListItems = [
    {
      id: 1,
      title: 'Basic Portrait',
      price: '$52',
      description: 'Simple character portrait with basic coloring',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop'
    },
    {
      id: 2,
      title: 'Detailed Portrait',
      price: '$152',
      description: 'Detailed character with complex background',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      title: 'Full Body Art',
      price: '$352',
      description: 'Complete character design with background',
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=150&fit=crop'
    },
    {
      id: 4,
      title: 'Premium Package',
      price: '$1000',
      description: 'Multiple variations with commercial rights',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop'
    }
  ];

  // Mock gallery items (只有当画师有橱窗时才显示)
  const galleryItems = [
    {
      id: 1,
      title: 'Anime Style Portrait',
      price: 89,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Character Design Set',
      price: 157,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Fantasy Portrait',
      price: 234,
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Chibi Style Art',
      price: 67,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'
    }
  ];

  // Mock reviews
  const reviews = [
    {
      id: 1,
      userName: 'ArtLover123',
      rating: 5,
      comment: 'Amazing artwork! Very professional and delivered on time.',
      avatar: 'https://i.pravatar.cc/40?img=2',
      date: '2025-06-15'
    },
    {
      id: 2,
      userName: 'CommissionFan',
      rating: 5,
      comment: 'Beautiful art style, exceeded my expectations!',
      avatar: 'https://i.pravatar.cc/40?img=3',
      date: '2025-06-10'
    }
  ];

  // Portfolio Content
  const PortfolioContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.portfolioGrid}>
        {portfolioItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.portfolioItem}
            onPress={() => {
              router.push({
                pathname: '/artwork-detail',
                params: {
                  artworkId: index + 1,
                  title: `Portfolio Item ${index + 1}`,
                  artist: artistData.name,
                  image: item,
                  likes: Math.floor(Math.random() * 500) + 50,
                  isLiked: Math.random() > 0.5
                }
              });
            }}
          >
            <Image source={{ uri: item }} style={styles.portfolioImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Gallery Content (only show if artist has galleries)
  const GalleryContent = () => (
    <View style={styles.tabContent}>
      {galleryItems.length > 0 ? (
        <View style={styles.galleryGrid}>
          {galleryItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.galleryItem}
              onPress={() => {
                router.push({
                  pathname: '/gallery-detail',
                  params: {
                    galleryId: item.id,
                    title: item.title,
                    price: item.price,
                    artistName: artistData.name,
                    artistAvatar: artistData.avatar,
                    image: item.image
                  }
                });
              }}
            >
              <Image source={{ uri: item.image }} style={styles.galleryImage} />
              <View style={styles.galleryInfo}>
                <Text style={styles.galleryTitle}>{item.title}</Text>
                <Text style={styles.galleryPrice}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No galleries available</Text>
        </View>
      )}
    </View>
  );

  // Reviews Content
  const ReviewsContent = () => (
    <View style={styles.tabContent}>
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
          <View style={styles.reviewContent}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewUserName}>{review.userName}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.reviewStars}>
              {[...Array(review.rating)].map((_, i) => (
                <Text key={i} style={styles.star}>⭐</Text>
              ))}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with background image */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: artistData.backgroundImage }} style={styles.backgroundImage} />
        <View style={styles.headerOverlay} />
        
        {/* Header buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerRightButtons}>
            <View style={styles.usernameTag}>
              <Text style={styles.usernameText}>{artistData.username}</Text>
            </View>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Artist info */}
        <View style={styles.artistInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: artistData.avatar }} style={styles.avatar} />
            <View style={styles.availabilityTag}>
              <Text style={styles.availabilityText}>Available in July</Text>
            </View>
          </View>
          
          <View style={styles.artistDetails}>
            <Text style={styles.artistName}>{artistData.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐{artistData.rating}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{artistData.badge}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bio */}
        <Text style={styles.bio}>{artistData.bio}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Invitation Calendar - only show if artist has it */}
        {artistData.hasInvitationCalendar && (
          <TouchableOpacity style={styles.invitationCard}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.invitationText}>{artistData.invitationDate} Open Invitation</Text>
            <TouchableOpacity style={styles.calendarButton}>
              <Text style={styles.calendarButtonText}>View Calendar ›</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Price List - only show if artist has it */}
        {artistData.hasPriceList && (
          <View style={styles.priceListSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💰</Text>
              <Text style={styles.sectionTitle}>Artist's Price List</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>4 commission types ›</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceListScroll}>
              {priceListItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.priceListItem}>
                  <Image source={{ uri: item.image }} style={styles.priceListImage} />
                  <View style={styles.priceListInfo}>
                    <Text style={styles.priceListTitle}>{item.title}</Text>
                    <Text style={styles.priceListPrice}>{item.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Portfolio' && styles.activeTabButton]}
            onPress={() => handleTabSwitch('Portfolio')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Portfolio' && styles.activeTabButtonText]}>
              Portfolio {artistData.portfolioCount}
            </Text>
          </TouchableOpacity>
          
          {/* Only show Gallery tab if artist has galleries */}
          {artistData.galleryCount > 0 && (
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'Gallery' && styles.activeTabButton]}
              onPress={() => handleTabSwitch('Gallery')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'Gallery' && styles.activeTabButtonText]}>
                Gallery {artistData.galleryCount}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Reviews' && styles.activeTabButton]}
            onPress={() => handleTabSwitch('Reviews')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Reviews' && styles.activeTabButtonText]}>
              Reviews {artistData.reviewCount}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Swipeable Tab Content */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.tabSwipeContainer, animatedStyle]}>
            {/* Portfolio */}
            <View style={styles.tabPage}>
              <PortfolioContent />
            </View>

            {/* Gallery - only if artist has galleries */}
            {artistData.galleryCount > 0 && (
              <View style={styles.tabPage}>
                <GalleryContent />
              </View>
            )}

            {/* Reviews */}
            <View style={styles.tabPage}>
              <ReviewsContent />
            </View>
          </Animated.View>
        </PanGestureHandler>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsFavorited(!isFavorited)}
        >
          <Text style={[styles.actionIcon, isFavorited && styles.activeActionIcon]}>
            {isFavorited ? '⭐' : '☆'}
          </Text>
          <Text style={[styles.actionText, isFavorited && styles.activeActionText]}>
            {isFavorited ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          <Text style={[styles.actionIcon, isFollowed && styles.activeHeartIcon]}>
            {isFollowed ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, isFollowed && styles.activeActionText]}>
            {isFollowed ? 'Favorited' : 'Favorite'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.inviteButton}
          onPress={() => {
            // Navigate to chat or invite modal
            console.log('Invite artist for commission');
          }}
        >
          <Text style={styles.inviteIcon}>👥</Text>
          <Text style={styles.inviteButtonText}>Invite</Text>
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
  headerContainer: {
    position: 'relative',
    height: 280,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    width: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameTag: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  usernameText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  artistInfo: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  availabilityTag: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#00A8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 12,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bio: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  invitationCard: {
    backgroundColor: '#2A3A4A',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  invitationText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  calendarButtonText: {
    color: '#00A8FF',
    fontSize: 14,
  },
  priceListSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionAction: {
    color: '#00A8FF',
    fontSize: 14,
  },
  priceListScroll: {
    paddingLeft: 20,
  },
  priceListItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    width: 120,
  },
  priceListImage: {
    width: '100%',
    height: 80,
  },
  priceListInfo: {
    padding: 12,
  },
  priceListTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceListPrice: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#00A8FF',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabButtonText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  tabSwipeContainer: {
    flexDirection: 'row',
    width: screenWidth * 3,
  },
  tabPage: {
    width: screenWidth,
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 120,
  },
  galleryInfo: {
    padding: 12,
  },
  galleryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  galleryPrice: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#888',
  },
  activeActionIcon: {
    color: '#FFD700',
  },
  activeHeartIcon: {
    color: '#FF6B9D',
  },
  actionText: {
    fontSize: 12,
    color: '#888',
  },
  activeActionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inviteButton: {
    flex: 1,
    backgroundColor: '#00A8FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
  },
  inviteIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArtistDetailPage;