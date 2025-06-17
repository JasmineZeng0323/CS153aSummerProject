import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('Gallery');
  const [activeCategory, setActiveCategory] = useState('Recommended');
  const [is24HourExpress, setIs24HourExpress] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [userInfo, setUserInfo] = useState(null);

  // Animation values for page swiping
  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0); // 0 = Gallery, 1 = Projects

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        setUserInfo(JSON.parse(userInfoString));
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  // Handle tab switch
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    const targetPage = tab === 'Gallery' ? 0 : 1;
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
      const shouldGoToNext = event.translationX < -screenWidth / 3 && currentPage.value === 0;
      const shouldGoToPrev = event.translationX > screenWidth / 3 && currentPage.value === 1;
      
      if (shouldGoToNext) {
        currentPage.value = 1;
        translateX.value = withTiming(-screenWidth, { duration: 250 });
        runOnJS(setActiveTab)('Projects');
      } else if (shouldGoToPrev) {
        currentPage.value = 0;
        translateX.value = withTiming(0, { duration: 250 });
        runOnJS(setActiveTab)('Gallery');
      } else {
        // Snap back to current page
        translateX.value = withTiming(-currentPage.value * screenWidth, { duration: 200 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Mock data for gallery items
  const galleryItems = [
    {
      id: 1,
      title: 'Ultra Fast Portrait [3h]',
      price: 157,
      sold: 13,
      artistName: 'huh',
      artistAvatar: 'https://i.pravatar.cc/40?img=1',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
      isExpress: true,
      category: 'Portrait'
    },
    {
      id: 2,
      title: 'Atmosphere Portrait (Queue)',
      price: 488,
      sold: 26,
      artistName: 'Peach',
      artistAvatar: 'https://i.pravatar.cc/40?img=2',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center',
      isExpress: false,
      category: 'Portrait'
    },
    {
      id: 3,
      title: 'Symmetrical Portrait',
      price: 321,
      sold: 8,
      artistName: 'JiangYu',
      artistAvatar: 'https://i.pravatar.cc/40?img=3',
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop&crop=center',
      isExpress: false,
      category: 'Portrait'
    },
    {
      id: 4,
      title: 'June Monochrome Portrait Set',
      price: 215,
      sold: 17,
      artistName: 'WangYeBu',
      artistAvatar: 'https://i.pravatar.cc/40?img=4',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center',
      isExpress: false,
      category: 'Character Set'
    },
    {
      id: 5,
      title: 'Anime Style Character Design',
      price: 650,
      sold: 4,
      artistName: 'ArtMaster',
      artistAvatar: 'https://i.pravatar.cc/40?img=5',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop&crop=center',
      isExpress: false,
      category: 'Character Design'
    },
    {
      id: 6,
      title: 'Cute Chibi Style [24H]',
      price: 99,
      sold: 31,
      artistName: 'ChibiArt',
      artistAvatar: 'https://i.pravatar.cc/40?img=6',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
      isExpress: true,
      category: 'Q-Version'
    }
  ];

  // Mock data for projects (same as the projects page)
  const projectItems = [
    {
      id: 1,
      title: 'Long-term OC Project!',
      description: 'Free OC contract work, any style accepted! Please specify clearly...',
      budget: '¥200-500',
      deadline: '2025-12-31',
      clientName: 'Anonymous Client',
      clientAvatar: 'https://i.pravatar.cc/60?img=1',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    },
    {
      id: 2,
      title: 'This is a long-term dream project',
      description: 'Any business type is welcome! Illustration business must have samples...',
      budget: '¥52-52k',
      deadline: '2025-12-31',
      clientName: 'Dream Seeker',
      clientAvatar: 'https://i.pravatar.cc/60?img=2',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    },
    {
      id: 3,
      title: 'Anything goes!',
      description: 'Any business type accepted 🍺＞∪＜🍺 Please specify art style clearly...',
      budget: '¥50-200',
      deadline: '2025-08-31',
      clientName: 'Art Lover',
      clientAvatar: 'https://i.pravatar.cc/60?img=3',
      isVerified: false,
      isHighQuality: false,
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
      tags: []
    },
    {
      id: 4,
      title: '💜 Birthday invitation from a fox 💜',
      description: '💜 Want to prepare a birthday gift in advance 💜 Thank you for every...',
      budget: '¥52-10k',
      deadline: '2026-04-30',
      clientName: 'Fox Birthday',
      clientAvatar: 'https://i.pravatar.cc/60?img=4',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    }
  ];

  const categories = ['Recommended', 'New', 'Pre-order', 'Following'];
  
  const allCategories = [
    'All', 'Portrait', 'Q-Version', 'Half Body', 'Full Body',
    'Standing Art', 'Character Set', 'Outfit Design', 'Wallpaper',
    'Emoji Pack', 'Live2D', 'Graphic Design'
  ];

  const contentCategories = [
    'Q-Version', 'Straight', 'Male', 'Female',
    'Couple', 'Japanese Style', 'Ancient Style', 'Small Animal',
    'Horizontal', 'Vertical'
  ];

  const otherPreferences = [
    'Accept Text Design', 'Not Based on Template'
  ];

  const toggleCategorySelection = (category) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      let newSelection = selectedCategories.filter(cat => cat !== 'All');
      if (newSelection.includes(category)) {
        newSelection = newSelection.filter(cat => cat !== category);
      } else {
        newSelection.push(category);
      }
      
      if (newSelection.length === 0) {
        newSelection = ['All'];
      }
      
      setSelectedCategories(newSelection);
    }
  };

  const renderGalleryItem = (item) => (
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
            artistName: item.artistName,
            artistAvatar: item.artistAvatar,
            image: item.image,
            sold: item.sold,
            category: item.category,
            isExpress: item.isExpress
          }
        });
      }}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.galleryImage} />
        {item.isExpress && (
          <View style={styles.expressTag}>
            <Text style={styles.expressText}>24H</Text>
          </View>
        )}
        <View style={styles.artistInfo}>
          <Image source={{ uri: item.artistAvatar }} style={styles.artistAvatar} />
          <Text style={styles.artistName}>{item.artistName}</Text>
        </View>
      </View>
      <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
      <View style={styles.priceInfo}>
        <Text style={styles.price}>¥{item.price}</Text>
        <Text style={styles.soldCount}>Sold {item.sold}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProjectItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>{item.title}</Text>
          <Text style={styles.projectDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          {/* Tags */}
          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.projectDetails}>
            <Text style={styles.budget}>{item.budget}</Text>
            <Text style={styles.deadline}>{item.deadline} Deadline</Text>
          </View>
        </View>
        
        <View style={styles.projectImageContainer}>
          <Image source={{ uri: item.image }} style={styles.projectImage} />
          <View style={styles.projectActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Gallery Page Content
  const GalleryContent = () => (
    <View style={styles.pageContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>🔍 Search</Text>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, activeCategory === category && styles.activeCategoryTab]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, is24HourExpress && styles.activeFilter]}
          onPress={() => setIs24HourExpress(!is24HourExpress)}
        >
          <Text style={styles.filterIcon}>⚡</Text>
          <Text style={[styles.filterText, is24HourExpress && styles.activeFilterText]}>
            24H Express
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowCategoryFilter(true)}
        >
          <Text style={styles.filterText}>Categories ▼</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Price/Time ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Gallery Grid */}
      <View style={styles.galleryGrid}>
        {galleryItems.map((item) => renderGalleryItem(item))}
      </View>
    </View>
  );

  // Projects Page Content
  const ProjectsContent = () => (
    <View style={styles.pageContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>🏢</Text>
          <Text style={styles.filterButtonText}>Verified Only</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>✅</Text>
          <Text style={styles.filterButtonText}>Unclaimed Only</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>👤</Text>
          <Text style={styles.filterButtonText}>Character</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>🔽</Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      <View style={styles.projectsList}>
        {projectItems.map((item) => renderProjectItem(item))}
      </View>
    </View>
  );

  const CategoryFilterModal = () => (
    <Modal
      visible={showCategoryFilter}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCategoryFilter(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* All Categories Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>All Categories</Text>
              <View style={styles.filterGrid}>
                {allCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterTag,
                      selectedCategories.includes(category) && styles.selectedFilterTag
                    ]}
                    onPress={() => toggleCategorySelection(category)}
                  >
                    <Text style={[
                      styles.filterTagText,
                      selectedCategories.includes(category) && styles.selectedFilterTagText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Content Style Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Content Style</Text>
              <View style={styles.filterGrid}>
                {contentCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterTag,
                      selectedCategories.includes(category) && styles.selectedFilterTag
                    ]}
                    onPress={() => toggleCategorySelection(category)}
                  >
                    <Text style={[
                      styles.filterTagText,
                      selectedCategories.includes(category) && styles.selectedFilterTagText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Other Preferences Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Other Preferences</Text>
              <View style={styles.filterGrid}>
                {otherPreferences.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterTag,
                      selectedCategories.includes(category) && styles.selectedFilterTag
                    ]}
                    onPress={() => toggleCategorySelection(category)}
                  >
                    <Text style={[
                      styles.filterTagText,
                      selectedCategories.includes(category) && styles.selectedFilterTagText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setSelectedCategories(['All'])}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => setShowCategoryFilter(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Gallery' && styles.activeTab]}
            onPress={() => handleTabSwitch('Gallery')}
          >
            <Text style={[styles.tabText, activeTab === 'Gallery' && styles.activeTabText]}>
              Gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Projects' && styles.activeTab]}
            onPress={() => handleTabSwitch('Projects')}
          >
            <Text style={[styles.tabText, activeTab === 'Projects' && styles.activeTabText]}>
              Projects
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Swipeable Content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.swipeContainer, animatedStyle]}>
          {/* Gallery Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <GalleryContent />
            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Projects Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <ProjectsContent />
            <View style={styles.bottomPadding} />
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
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

      {/* Category Filter Modal */}
      <CategoryFilterModal />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 18,
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
    width: screenWidth * 2,
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
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  categoryContainer: {
    paddingLeft: 24,
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeCategoryTab: {
    borderBottomColor: '#00A8FF',
  },
  categoryText: {
    fontSize: 16,
    color: '#888',
  },
  activeCategoryText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#00A8FF',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  galleryItem: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#333',
  },
  expressTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00A8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  expressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  artistInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 12,
    paddingBottom: 8,
    lineHeight: 18,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  price: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  soldCount: {
    color: '#888',
    fontSize: 12,
  },
  // Projects styles
  projectsList: {
    paddingHorizontal: 24,
  },
  projectCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
  },
  projectInfo: {
    flex: 1,
    marginRight: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  projectDetails: {
    flexDirection: 'column',
  },
  budget: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  deadline: {
    fontSize: 14,
    color: '#888',
  },
  projectImageContainer: {
    position: 'relative',
  },
  projectImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  projectActions: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
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
    maxHeight: '80%',
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  filterSectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterTag: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedFilterTag: {
    backgroundColor: '#00A8FF',
    borderColor: '#00A8FF',
  },
  filterTagText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedFilterTagText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#00A8FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Homepage;