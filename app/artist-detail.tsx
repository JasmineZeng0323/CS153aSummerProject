import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
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

// Import components
import EmptyState from './components/common/EmptyState';
import StatusBadge from './components/common/StatusBadge';

// Import styles
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

// 统一的无留白容器样式
const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0, // 全局移除顶部留白
  },
  header: {
    paddingTop: 50, // 状态栏高度
  },
};

const { width: screenWidth } = Dimensions.get('window');

const ArtistDetailPage = () => {
  const params = useLocalSearchParams();
  const { artistId, artistName, artistAvatar } = params;

  const [activeTab, setActiveTab] = useState('Portfolio');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Animation values for page swiping
  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0); // 0 = Portfolio, 1 = Gallery, 2 = Reviews

  // Mock user projects for invitation
  const [userProjects] = useState([
    {
      id: 1,
      title: 'Character Design Project',
      description: 'Looking for anime-style character design with detailed background',
      budget: '$200-500',
      deadline: '2025-08-15',
      status: 'active',
      applicantCount: 5
    },
    {
      id: 2,
      title: 'Logo Design Commission',
      description: 'Modern logo for tech startup company with brand guidelines',
      budget: '$300-800',
      deadline: '2025-07-31',
      status: 'active',
      applicantCount: 8
    }
  ]);

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
    hasPriceList: true,
    portfolioCount: 100,
    galleryCount: 4,
    reviewCount: 49,
    isVerified: true,
    isAvailable: true
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

  // Handle invite artist to specific project
  const handleInviteToProject = (projectId: number) => {
    console.log(`Inviting artist ${artistId} to project ${projectId}`);
    setShowInviteModal(false);
    
    router.push({
      pathname: '/project-detail',
      params: {
        projectId: projectId,
      }
    });
  };

  // Mock portfolio data
  const portfolioItems = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
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
    }
  ];

  // Mock gallery items
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

  // Gallery Content
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
        <EmptyState
          icon="🛒"
          title="No galleries available"
          description="This artist hasn't created any gallery items yet."
        />
      )}
    </View>
  );

  // Reviews Content
  const ReviewsContent = () => (
    <View style={styles.tabContent}>
      {reviews.length > 0 ? (
        reviews.map((review) => (
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
        ))
      ) : (
        <EmptyState
          icon="⭐"
          title="No reviews yet"
          description="This artist hasn't received any reviews."
        />
      )}
    </View>
  );

  // Render invite modal
  const renderInviteModal = () => (
    <Modal
      visible={showInviteModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowInviteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invite {artistData.name} to Project</Text>
            <TouchableOpacity 
              onPress={() => setShowInviteModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalSubtitle}>Select a project to invite this artist to:</Text>
            
            {userProjects.map((project) => (
              <TouchableOpacity 
                key={project.id}
                style={styles.projectInviteCard}
                onPress={() => handleInviteToProject(project.id)}
              >
                <View style={styles.projectCardHeader}>
                  <Text style={styles.projectCardTitle}>{project.title}</Text>
                  <StatusBadge status={project.status as any} size="small" />
                </View>
                
                <Text style={styles.projectCardDescription} numberOfLines={2}>
                  {project.description}
                </Text>
                
                <View style={styles.projectCardDetails}>
                  <Text style={styles.projectCardBudget}>Budget: {project.budget}</Text>
                  <Text style={styles.projectCardDeadline}>Deadline: {project.deadline}</Text>
                </View>
                
                <View style={styles.projectCardStats}>
                  <Text style={styles.projectCardApplicants}>
                    {project.applicantCount} applicants
                  </Text>
                  <Text style={styles.projectCardAction}>Tap to invite →</Text>
                </View>
              </TouchableOpacity>
            ))}

            {userProjects.length === 0 && (
              <EmptyState
                icon="📋"
                title="No active projects"
                description="You need to create a project first before inviting artists."
                buttonText="Create Project"
                onButtonPress={() => {
                  setShowInviteModal(false);
                  router.push('/post-project');
                }}
                size="small"
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={AppStyles.container}>
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
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                Alert.alert(
                  'Share Artist',
                  'How would you like to share this artist?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Copy Profile Link', 
                      onPress: () => {
                        console.log('Artist profile link copied');
                        Alert.alert('Success', 'Artist profile link copied to clipboard');
                      }
                    },
                    { 
                      text: 'Share Portfolio', 
                      onPress: () => {
                        console.log('Sharing artist portfolio');
                        Alert.alert('Share', 'Sharing artist portfolio...');
                      }
                    },
                    { 
                      text: 'Recommend Artist', 
                      onPress: () => {
                        console.log('Recommending artist');
                        Alert.alert('Share', 'Recommending artist to friends...');
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.headerButtonText}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Artist info */}
        <View style={styles.artistInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: artistData.avatar }} style={styles.avatar} />
            <StatusBadge 
              status={artistData.isAvailable ? "available" : "unavailable"}
              text={artistData.isAvailable ? "Available in July" : "Unavailable"}
              size="small"
              style={styles.availabilityTag}
            />
          </View>
          
          <View style={styles.artistDetails}>
            <View style={styles.artistNameRow}>
              <Text style={styles.artistName}>{artistData.name}</Text>
              {artistData.isVerified && (
                <StatusBadge 
                  status="verified"
                  size="small"
                  style={styles.verifiedBadge}
                />
              )}
            </View>
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
        {/* Price List */}
        {artistData.hasPriceList && (
          <View style={styles.priceListSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💰</Text>
              <Text style={styles.sectionTitle}>Artist's Price List</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>2 commission types ›</Text>
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

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={GlobalStyles.actionBar}>
        <TouchableOpacity 
          style={GlobalStyles.actionButton}
          onPress={() => setIsFavorited(!isFavorited)}
        >
          <Text style={[GlobalStyles.actionIcon, isFavorited && styles.activeActionIcon]}>
            {isFavorited ? '⭐' : '☆'}
          </Text>
          <Text style={[GlobalStyles.actionText, isFavorited && styles.activeActionText]}>
            {isFavorited ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={GlobalStyles.actionButton}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          <Text style={[GlobalStyles.actionIcon, isFollowed && styles.activeHeartIcon]}>
            {isFollowed ? '❤️' : '🤍'}
          </Text>
          <Text style={[GlobalStyles.actionText, isFollowed && styles.activeActionText]}>
            {isFollowed ? 'Favorited' : 'Favorite'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.inviteButton}
          onPress={() => setShowInviteModal(true)}
        >
          <Text style={styles.inviteIcon}>👥</Text>
          <Text style={styles.inviteButtonText}>Invite to Project</Text>
        </TouchableOpacity>
      </View>

      {/* Invite Modal */}
      {renderInviteModal()}
    </View>
  );
};

// Complete styles
const styles = StyleSheet.create({
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
    backgroundColor: Colors.overlay,
  },
  headerButtons: {
    position: 'absolute',
    top: 50, // 使用 AppStyles.header 的状态栏高度
    left: 0,
    right: 0,
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    ...Layout.paddingHorizontal,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    ...Typography.h5,
    color: Colors.text,
  },
  headerRightButtons: {
    ...Layout.row,
    alignItems: 'center',
  },
  usernameTag: {
    backgroundColor: Colors.overlay,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.lg,
    marginRight: Layout.spacing.md,
  },
  usernameText: {
    ...Typography.badge,
    color: Colors.text,
  },
  artistInfo: {
    position: 'absolute',
    bottom: 80,
    left: Layout.spacing.xl,
    right: Layout.spacing.xl,
    ...Layout.row,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Layout.spacing.lg,
  },
  avatar: {
    ...Layout.avatarXLarge,
    borderWidth: 3,
    borderColor: Colors.text,
  },
  availabilityTag: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  artistDetails: {
    flex: 1,
  },
  artistNameRow: {
    ...Layout.row,
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  artistName: {
    ...Typography.h3,
    color: Colors.text,
    marginRight: Layout.spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  verifiedBadge: {
    marginLeft: Layout.spacing.sm,
  },
  ratingContainer: {
    ...Layout.row,
    alignItems: 'center',
  },
  rating: {
    ...Typography.rating,
    marginRight: Layout.spacing.md,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.md,
  },
  badgeText: {
    ...Typography.badge,
  },
  bio: {
    position: 'absolute',
    bottom: Layout.spacing.xl,
    left: Layout.spacing.xl,
    right: Layout.spacing.xl,
    ...Typography.body,
    color: Colors.text,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  
  // Modal Styles
  modalOverlay: {
    ...Layout.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    padding: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  modalTitle: {
    ...Typography.h5,
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    padding: Layout.spacing.xl,
  },
  modalSubtitle: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.xl,
  },
  projectInviteCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectCardHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  projectCardTitle: {
    ...Typography.h6,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  projectCardDescription: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.md,
    lineHeight: 20,
  },
  projectCardDetails: {
    marginBottom: Layout.spacing.md,
  },
  projectCardBudget: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  projectCardDeadline: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  projectCardStats: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
  },
  projectCardApplicants: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  projectCardAction: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Price List Section
  priceListSection: {
    marginBottom: Layout.spacing.xl,
  },
  sectionHeader: {
    ...Layout.row,
    alignItems: 'center',
    ...Layout.paddingHorizontal,
    marginBottom: Layout.spacing.lg,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    ...Typography.h5,
  },
  sectionAction: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  priceListScroll: {
    paddingLeft: Layout.spacing.xl,
  },
  priceListItem: {
    ...Layout.cardSmall,
    marginRight: Layout.spacing.md,
    overflow: 'hidden',
    width: 120,
    paddingBottom: Layout.spacing.sm,
  },
  priceListImage: {
    width: '100%',
    height: 60,
  },
  priceListInfo: {
    padding: Layout.spacing.sm,
  },
  priceListTitle: {
    ...Typography.badge,
    marginBottom: Layout.spacing.xs,
  },
  priceListPrice: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: 'bold',
  },

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    backgroundColor: 'transparent',
  },
  tabButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    marginRight: Layout.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Colors.primary,
  },
  tabButtonText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  activeTabButtonText: {
    color: Colors.primary,
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
    ...Layout.paddingHorizontal,
  },

  // Portfolio Grid
  portfolioGrid: {
    ...Layout.row,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },

  // Gallery Grid
  galleryGrid: {
    ...Layout.row,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 120,
  },
  galleryInfo: {
    padding: Layout.spacing.md,
  },
  galleryTitle: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  galleryPrice: {
    ...Typography.body,
    color: Colors.secondary,
    fontWeight: 'bold',
  },

  // Reviews
  reviewItem: {
    ...Layout.row,
    marginBottom: Layout.spacing.xl,
  },
  reviewAvatar: {
    ...Layout.avatar,
    marginRight: Layout.spacing.md,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  reviewUserName: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  reviewDate: {
    ...Typography.caption,
  },
  reviewStars: {
    ...Layout.row,
    marginBottom: Layout.spacing.sm,
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  reviewComment: {
    ...Typography.body,
    lineHeight: 20,
  },

  // Action Bar
  activeActionIcon: {
    color: Colors.rating,
  },
  activeHeartIcon: {
    color: Colors.error,
  },
  activeActionText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  inviteButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    ...Layout.row,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xxl,
  },
  inviteIcon: {
    fontSize: 18,
    marginRight: Layout.spacing.sm,
  },
  inviteButtonText: {
    ...Typography.button,
  },
});

export default ArtistDetailPage;