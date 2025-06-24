// homepage.tsx - Enhanced with Artist Mode Support
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
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
import BottomNavigation from './components/BottomNavigation';
import GalleryCard from './components/common/GalleryCard';
import ProjectCard from './components/common/ProjectCard';
import SearchComponent from './components/common/SearchComponent';
import FilterModal, { FilterSection } from './components/forms/FilterModal';

// Import styles
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0, 
  },
  header: {
    paddingTop: 50, 
  },
};

const { width: screenWidth } = Dimensions.get('window');

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('Gallery');
  const [activeCategory, setActiveCategory] = useState('Recommended');
  const [is24HourExpress, setIs24HourExpress] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showPriceTimeFilter, setShowPriceTimeFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    categories: ['All'],
    contentStyle: [],
    preferences: [],
    priceRange: ['All'],
    timeRange: ['All']
  });
  const [userInfo, setUserInfo] = useState(null);
  
  // 🎯 NEW: Artist mode state and add button modal
  const [isArtistMode, setIsArtistMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Animation values for page swiping
  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userData = JSON.parse(userInfoString);
        setUserInfo(userData);
        
        // Load artist mode status
        const savedMode = await AsyncStorage.getItem('isArtistMode');
        const artistMode = savedMode === 'true' && userData.isArtist;
        setIsArtistMode(artistMode);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  // 🎯 NEW: Add button modal for different modes
  const AddButtonModal = () => (
    <Modal
      visible={showAddModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowAddModal(false)}
    >
      <TouchableOpacity 
        style={styles.addModalOverlay}
        activeOpacity={1}
        onPress={() => setShowAddModal(false)}
      >
        <View style={styles.addModalContent}>
          {isArtistMode ? (
            // Artist Mode Options
            <>
              <TouchableOpacity 
                style={styles.addOption}
                onPress={() => {
                  setShowAddModal(false);
                  router.push('/publish-gallery');
                }}
              >
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>🖼️</Text>
                </View>
                <View style={styles.addOptionContent}>
                  <Text style={styles.addOptionTitle}>Publish Gallery</Text>
                  <Text style={styles.addOptionSubtitle}>Upload your artwork to sell</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addOption}
                onPress={() => {
                  setShowAddModal(false);
                  router.push('/post-project');
                }}
              >
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>📋</Text>
                </View>
                <View style={styles.addOptionContent}>
                  <Text style={styles.addOptionTitle}>Post Project</Text>
                  <Text style={styles.addOptionSubtitle}>Create a project as a client</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            // Client Mode Options
            <>
              <TouchableOpacity 
                style={styles.addOption}
                onPress={() => {
                  setShowAddModal(false);
                  router.push('/post-project');
                }}
              >
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>📋</Text>
                </View>
                <View style={styles.addOptionContent}>
                  <Text style={styles.addOptionTitle}>Post Project</Text>
                  <Text style={styles.addOptionSubtitle}>Commission custom artwork</Text>
                </View>
              </TouchableOpacity>
              
              {userInfo?.isArtist && (
                <TouchableOpacity 
                  style={styles.addOption}
                  onPress={() => {
                    setShowAddModal(false);
                    router.push('/publish-gallery');
                  }}
                >
                  <View style={styles.addOptionIcon}>
                    <Text style={styles.addOptionIconText}>🖼️</Text>
                  </View>
                  <View style={styles.addOptionContent}>
                    <Text style={styles.addOptionTitle}>Publish Gallery</Text>
                    <Text style={styles.addOptionSubtitle}>Upload artwork to sell</Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
        translateX.value = withTiming(-currentPage.value * screenWidth, { duration: 200 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Mock data for gallery items - with category classification
  const allGalleryItems = [
    {
      id: 1,
      title: 'Ultra Fast Portrait [3h]',
      price: 157,
      sold: 13,
      artistName: 'huh',
      artistAvatar: 'https://i.pravatar.cc/40?img=1',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
      isExpress: true,
      category: 'Portrait',
      contentCategory: 'Recommended'
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
      category: 'Portrait',
      contentCategory: 'Recommended'
    },
    // ... rest of gallery items
  ];

  // Mock data for projects
  const projectItems = [
    {
      id: 1,
      title: 'Long-term OC Project!',
      description: 'Free OC contract work, any style accepted! Please specify clearly...',
      budget: '$200-500',
      deadline: '2025-12-31',
      clientName: 'Anonymous Client',
      clientAvatar: 'https://i.pravatar.cc/60?img=1',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    },
    // ... rest of project items
  ];

  const categories = ['Recommended', 'New', 'Pre-order', 'Following'];

  // Filter sections for FilterModal
  const filterSections: FilterSection[] = [
    {
      id: 'categories',
      title: 'All Categories',
      multiSelect: true,
      options: [
        { id: 'All', title: 'All' },
        { id: 'Portrait', title: 'Portrait', icon: '👤' },
        { id: 'Q-Version', title: 'Q-Version', icon: '🎭' },
        { id: 'Half Body', title: 'Half Body', icon: '👔' },
        { id: 'Full Body', title: 'Full Body', icon: '🧍' },
        { id: 'Standing Art', title: 'Standing Art', icon: '🕴️' },
        { id: 'Character Set', title: 'Character Set', icon: '👥' },
        { id: 'Outfit Design', title: 'Outfit Design', icon: '👗' },
        { id: 'Wallpaper', title: 'Wallpaper', icon: '🖼️' },
        { id: 'Emoji Pack', title: 'Emoji Pack', icon: '😊' },
        { id: 'Live2D', title: 'Live2D', icon: '🎮' },
        { id: 'Graphic Design', title: 'Graphic Design', icon: '🎨' }
      ]
    },
    // ... rest of filter sections
  ];

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching for: ${query} in ${activeTab}`);
  };

  const handleSearchResultPress = (result: any) => {
    console.log('Search result pressed:', result);
    if (result.type === 'gallery') {
      router.push({
        pathname: '/gallery-detail',
        params: {
          galleryId: result.id,
          title: result.title,
        }
      });
    } else if (result.type === 'artist') {
      router.push({
        pathname: '/artist-detail',
        params: {
          artistId: result.id,
          artistName: result.title,
        }
      });
    }
  };

  // Filter handlers
  const handleFilterChange = (sectionId: string, optionId: string, isSelected: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (sectionId === 'categories' && optionId === 'All') {
        newFilters[sectionId] = isSelected ? ['All'] : [];
      } else if (sectionId === 'priceRange' || sectionId === 'timeRange') {
        newFilters[sectionId] = isSelected ? [optionId] : ['All'];
      } else {
        if (!newFilters[sectionId]) newFilters[sectionId] = [];
        
        if (isSelected) {
          newFilters[sectionId] = newFilters[sectionId].filter(id => id !== 'All');
          newFilters[sectionId].push(optionId);
        } else {
          newFilters[sectionId] = newFilters[sectionId].filter(id => id !== optionId);
          if (newFilters[sectionId].length === 0 && sectionId === 'categories') {
            newFilters[sectionId] = ['All'];
          }
        }
      }
      
      return newFilters;
    });
  };

  const handleFilterReset = () => {
    setSelectedFilters({
      categories: ['All'],
      contentStyle: [],
      preferences: [],
      priceRange: ['All'],
      timeRange: ['All']
    });
  };

  const handleFilterApply = () => {
    setShowCategoryFilter(false);
    setShowPriceTimeFilter(false);
  };

  // Filter gallery items based on selected filters, category, and search query
  const getFilteredGalleryItems = () => {
    let filtered = allGalleryItems;

    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory === 'Recommended') {
      filtered = filtered.filter(item => item.contentCategory === 'Recommended');
    } else if (activeCategory === 'New') {
      filtered = filtered.filter(item => item.contentCategory === 'New');
    } else if (activeCategory === 'Pre-order') {
      filtered = filtered.filter(item => item.contentCategory === 'Pre-order');
    } else if (activeCategory === 'Following') {
      filtered = filtered.filter(item => item.contentCategory === 'Following');
    }

    if (is24HourExpress) {
      filtered = filtered.filter(item => item.isExpress);
    }

    const selectedCategories = selectedFilters.categories || ['All'];
    if (!selectedCategories.includes('All')) {
      filtered = filtered.filter(item => 
        selectedCategories.some(cat => item.category.includes(cat))
      );
    }

    return filtered;
  };

  const getFilteredProjectItems = () => {
    let filtered = projectItems;

    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.budget.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Gallery Page Content
  const GalleryContent = () => (
    <View style={styles.pageContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.searchPlaceholder}>🔍 Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Header */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            Results for "{searchQuery}" ({getFilteredGalleryItems().length})
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

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
          style={[styles.filterButton, is24HourExpress && styles.activeFilterButton]}
          onPress={() => setIs24HourExpress(!is24HourExpress)}
        >
          <Text style={styles.filterIcon}>⚡</Text>
          <Text style={[styles.filterText, is24HourExpress && styles.activeFilterText]}>
            24H Express
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilters.categories && !selectedFilters.categories.includes('All') && styles.activeFilterButton
          ]}
          onPress={() => setShowCategoryFilter(true)}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.categories && !selectedFilters.categories.includes('All') && styles.activeFilterText
          ]}>
            Categories ▼
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowPriceTimeFilter(true)}
        >
          <Text style={styles.filterText}>Price/Time ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Gallery Grid */}
      <View style={GlobalStyles.gridContainer}>
        {getFilteredGalleryItems().map((item) => (
          <GalleryCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            sold={item.sold}
            artistName={item.artistName}
            artistAvatar={item.artistAvatar}
            image={item.image}
            isExpress={item.isExpress}
            category={item.category}
            style={GlobalStyles.gridItem}
          />
        ))}
      </View>

      {/* Empty search results */}
      {searchQuery.trim() && getFilteredGalleryItems().length === 0 && (
        <View style={styles.emptySearchResults}>
          <Text style={styles.emptySearchIcon}>🔍</Text>
          <Text style={styles.emptySearchTitle}>No galleries found</Text>
          <Text style={styles.emptySearchDescription}>
            Try adjusting your search terms or browse categories
          </Text>
        </View>
      )}
    </View>
  );

  // Projects Page Content
  const ProjectsContent = () => (
    <View style={styles.pageContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Header */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            Results for "{searchQuery}" ({getFilteredProjectItems().length})
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>🏢</Text>
          <Text style={styles.filterText}>Verified Only</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>✅</Text>
          <Text style={styles.filterText}>Unclaimed Only</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>👤</Text>
          <Text style={styles.filterText}>Character</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>🔽</Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      <View style={styles.projectsList}>
        {getFilteredProjectItems().map((item) => (
          <ProjectCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            budget={item.budget}
            deadline={item.deadline}
            clientName={item.clientName}
            clientAvatar={item.clientAvatar}
            isVerified={item.isVerified}
            isHighQuality={item.isHighQuality}
            image={item.image}
            tags={item.tags}
          />
        ))}
      </View>

      {/* Empty search results */}
      {searchQuery.trim() && getFilteredProjectItems().length === 0 && (
        <View style={styles.emptySearchResults}>
          <Text style={styles.emptySearchIcon}>🔍</Text>
          <Text style={styles.emptySearchTitle}>No projects found</Text>
          <Text style={styles.emptySearchDescription}>
            Try adjusting your search terms or browse categories
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={AppStyles.container}>
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
          {/* 🎯 NEW: Enhanced add button with modal */}
          <TouchableOpacity 
            style={[
              styles.addButton,
              isArtistMode && styles.artistAddButton
            ]}
            onPress={() => setShowAddModal(true)}
          >
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
            <View style={GlobalStyles.bottomPadding} />
          </ScrollView>

          {/* Projects Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <ProjectsContent />
            <View style={GlobalStyles.bottomPadding} />
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>

      <BottomNavigation activeTab="home" />

      {/* Search Component */}
      <SearchComponent
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        searchType={activeTab === 'Gallery' ? 'gallery' : 'projects'}
        onSearch={handleSearch}
        onResultPress={handleSearchResultPress}
      />

      {/* 🎯 NEW: Add Button Modal */}
      <AddButtonModal />

      {/* Filter Modals */}
      <FilterModal
        visible={showCategoryFilter}
        title="Categories"
        sections={filterSections}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        onApply={handleFilterApply}
        onClose={() => setShowCategoryFilter(false)}
      />
    </View>
  );
};

// Enhanced styles
const styles = StyleSheet.create({
  header: {
    ...Layout.rowSpaceBetween,
    ...Layout.paddingHorizontal,
    ...AppStyles.header,
    paddingBottom: Layout.spacing.lg,
  },
  headerLeft: {
    ...Layout.row,
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.sm,
  },
  activeTab: {
    ...Layout.borderBottom,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.h5,
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.text,
  },
  headerRight: {
    ...Layout.row,
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 🎯 NEW: Artist mode styling for add button
  artistAddButton: {
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addIcon: {
    ...Typography.h4,
    color: Colors.text,
  },

  // 🎯 NEW: Add Modal Styles
  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addModalContent: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xl,
    padding: Layout.spacing.xl,
    width: '80%',
    maxWidth: 320,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.radius.lg,
    marginBottom: Layout.spacing.md,
    backgroundColor: Colors.card,
  },
  addOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
  },
  addOptionIconText: {
    fontSize: 24,
  },
  addOptionContent: {
    flex: 1,
  },
  addOptionTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  addOptionSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
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
    ...Layout.paddingHorizontal,
    marginBottom: Layout.spacing.xl,
  },
  searchBar: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xxl,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.md,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  
  // Search results header
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },
  searchResultsText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  clearSearchText: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },

  // Empty search results
  emptySearchResults: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxxl,
    paddingHorizontal: Layout.spacing.xl,
  },
  emptySearchIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.lg,
  },
  emptySearchTitle: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  emptySearchDescription: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  categoryContainer: {
    paddingLeft: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
    marginTop: Layout.spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    marginRight: Layout.spacing.lg,
    ...Layout.borderBottom,
    borderBottomColor: 'transparent',
  },
  activeCategoryTab: {
    borderBottomColor: Colors.primary,
  },
  categoryText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  activeCategoryText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: Layout.spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.text,
    textAlign: 'center',
  },
  activeFilterText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  projectsList: {
    ...Layout.paddingHorizontal,
  },
});

export default Homepage;