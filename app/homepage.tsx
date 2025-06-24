// homepage.tsx - Updated with Search Integration
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
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
import SearchComponent from './components/common/SearchComponent'; // 🎯 NEW
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
  const [showSearch, setShowSearch] = useState(false); // 🎯 NEW: Search modal state
  const [searchQuery, setSearchQuery] = useState(''); // 🎯 NEW: Current search query
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    categories: ['All'],
    contentStyle: [],
    preferences: [],
    priceRange: ['All'],
    timeRange: ['All']
  });
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
    {
      id: 3,
      title: 'Symmetrical Portrait',
      price: 321,
      sold: 8,
      artistName: 'JiangYu',
      artistAvatar: 'https://i.pravatar.cc/40?img=3',
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop&crop=center',
      isExpress: false,
      category: 'Portrait',
      contentCategory: 'New'
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
      category: 'Character Set',
      contentCategory: 'New'
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
      category: 'Character Design',
      contentCategory: 'Pre-order'
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
      category: 'Q-Version',
      contentCategory: 'Following'
    },
    {
      id: 7,
      title: 'Limited Edition Pre-order',
      price: 899,
      sold: 2,
      artistName: 'LimitedArt',
      artistAvatar: 'https://i.pravatar.cc/40?img=7',
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop&crop=center',
      isExpress: false,
      category: 'Portrait',
      contentCategory: 'Pre-order'
    },
    {
      id: 8,
      title: 'Following Artist Special',
      price: 299,
      sold: 15,
      artistName: 'FollowedArt',
      artistAvatar: 'https://i.pravatar.cc/40?img=8',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop&crop=center',
      isExpress: false,
      category: 'Character Design',
      contentCategory: 'Following'
    }
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
    {
      id: 2,
      title: 'This is a long-term dream project',
      description: 'Any business type is welcome! Illustration business must have samples...',
      budget: '$52-52k',
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
      budget: '$50-200',
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
      budget: '$52-10k',
      deadline: '2026-04-30',
      clientName: 'Fox Birthday',
      clientAvatar: 'https://i.pravatar.cc/60?img=4',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    }
  ];

  const categories = ['Recommended', 'New', 'Pre-order', 'Following'];

  // Filter sections for FilterModal - Updated with grid layout
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
    {
      id: 'contentStyle',
      title: 'Content Style',
      multiSelect: true,
      options: [
        { id: 'Q-Version', title: 'Q-Version', icon: '🎭' },
        { id: 'Realistic', title: 'Realistic', icon: '📸' },
        { id: 'Male', title: 'Male', icon: '♂️' },
        { id: 'Female', title: 'Female', icon: '♀️' },
        { id: 'Couple', title: 'Couple', icon: '💑' },
        { id: 'Japanese Style', title: 'Japanese Style', icon: '🎌' },
        { id: 'Ancient Style', title: 'Ancient Style', icon: '🏛️' },
        { id: 'Small Animal', title: 'Small Animal', icon: '🐱' },
        { id: 'Horizontal', title: 'Horizontal', icon: '↔️' },
        { id: 'Vertical', title: 'Vertical', icon: '↕️' }
      ]
    },
    {
      id: 'preferences',
      title: 'Other Preferences',
      multiSelect: true,
      options: [
        { id: 'Accept Text Design', title: 'Accept Text Design', icon: '📝' },
        { id: 'Not Based on Template', title: 'Not Based on Template', icon: '🆕' }
      ]
    }
  ];

  // Price/Time filter sections
  const priceTimeFilterSections: FilterSection[] = [
    {
      id: 'priceRange',
      title: 'Price Range',
      multiSelect: false,
      options: [
        { id: 'All', title: 'All Prices' },
        { id: 'Under50', title: 'Under $50', icon: '💰' },
        { id: '50-100', title: '$50 - $100', icon: '💰' },
        { id: '100-300', title: '$100 - $300', icon: '💰' },
        { id: '300-500', title: '$300 - $500', icon: '💰' },
        { id: 'Over500', title: 'Over $500', icon: '💰' }
      ]
    },
    {
      id: 'timeRange',
      title: 'Delivery Time',
      multiSelect: false,
      options: [
        { id: 'All', title: 'All Times' },
        { id: '24H', title: '24 Hours Express', icon: '⚡' },
        { id: '3Days', title: 'Within 3 Days', icon: '📅' },
        { id: '1Week', title: 'Within 1 Week', icon: '📅' },
        { id: '2Weeks', title: 'Within 2 Weeks', icon: '📅' },
        { id: 'Custom', title: 'Custom Timeline', icon: '📅' }
      ]
    }
  ];

  // 🎯 NEW: Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching for: ${query} in ${activeTab}`);
    // Here you would implement the actual search logic
    // Filter the gallery items or projects based on the search query
  };

  const handleSearchResultPress = (result: any) => {
    console.log('Search result pressed:', result);
    // Navigate to the appropriate detail page based on result type
    if (result.type === 'gallery') {
      router.push({
        pathname: '/gallery-detail',
        params: {
          galleryId: result.id,
          title: result.title,
          // ... other params
        }
      });
    } else if (result.type === 'artist') {
      router.push({
        pathname: '/artist-detail',
        params: {
          artistId: result.id,
          artistName: result.title,
          // ... other params
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
        // Single select for price and time
        newFilters[sectionId] = isSelected ? [optionId] : ['All'];
      } else {
        if (!newFilters[sectionId]) newFilters[sectionId] = [];
        
        if (isSelected) {
          // Remove 'All' if selecting specific category
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
    // Apply filter logic here
  };

  const handlePriceTimeFilterApply = () => {
    setShowPriceTimeFilter(false);
    // Apply price/time filter logic here
  };

  // Filter gallery items based on selected filters, category, and search query
  const getFilteredGalleryItems = () => {
    let filtered = allGalleryItems;

    // 🎯 NEW: Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category tab
    if (activeCategory === 'Recommended') {
      filtered = filtered.filter(item => item.contentCategory === 'Recommended');
    } else if (activeCategory === 'New') {
      filtered = filtered.filter(item => item.contentCategory === 'New');
    } else if (activeCategory === 'Pre-order') {
      filtered = filtered.filter(item => item.contentCategory === 'Pre-order');
    } else if (activeCategory === 'Following') {
      filtered = filtered.filter(item => item.contentCategory === 'Following');
    }

    // Filter by 24H Express
    if (is24HourExpress) {
      filtered = filtered.filter(item => item.isExpress);
    }

    // Filter by categories
    const selectedCategories = selectedFilters.categories || ['All'];
    if (!selectedCategories.includes('All')) {
      filtered = filtered.filter(item => 
        selectedCategories.some(cat => item.category.includes(cat))
      );
    }

    // Filter by price range
    const selectedPriceRange = selectedFilters.priceRange?.[0] || 'All';
    if (selectedPriceRange !== 'All') {
      filtered = filtered.filter(item => {
        const price = item.price;
        switch (selectedPriceRange) {
          case 'Under50': return price < 50;
          case '50-100': return price >= 50 && price <= 100;
          case '100-300': return price >= 100 && price <= 300;
          case '300-500': return price >= 300 && price <= 500;
          case 'Over500': return price > 500;
          default: return true;
        }
      });
    }

    // Filter by delivery time
    const selectedTimeRange = selectedFilters.timeRange?.[0] || 'All';
    if (selectedTimeRange === '24H') {
      filtered = filtered.filter(item => item.isExpress);
    }

    return filtered;
  };

  // 🎯 NEW: Filter projects based on search query
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
      {/* Search Bar - 🎯 UPDATED: Now clickable */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.searchPlaceholder}>🔍 Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Header - 🎯 NEW */}
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
          style={[
            styles.filterButton,
            (selectedFilters.priceRange?.[0] !== 'All' || selectedFilters.timeRange?.[0] !== 'All') && styles.activeFilterButton
          ]}
          onPress={() => setShowPriceTimeFilter(true)}
        >
          <Text style={[
            styles.filterText,
            (selectedFilters.priceRange?.[0] !== 'All' || selectedFilters.timeRange?.[0] !== 'All') && styles.activeFilterText
          ]}>
            Price/Time ▼
          </Text>
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

      {/* 🎯 NEW: Empty search results */}
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
      {/* Search Bar - 🎯 UPDATED: Now clickable */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Header - 🎯 NEW */}
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

      {/* 🎯 NEW: Empty search results */}
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
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/post-project')}
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

      {/* 🎯 NEW: Search Component */}
      <SearchComponent
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        searchType={activeTab === 'Gallery' ? 'gallery' : 'projects'}
        onSearch={handleSearch}
        onResultPress={handleSearchResultPress}
      />

      {/* Category Filter Modal */}
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

      {/* Price/Time Filter Modal */}
      <FilterModal
        visible={showPriceTimeFilter}
        title="Price & Time"
        sections={priceTimeFilterSections}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        onApply={handlePriceTimeFilterApply}
        onClose={() => setShowPriceTimeFilter(false)}
      />
    </View>
  );
};

// Simplified styles - only keeping unique ones
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
  addIcon: {
    ...Typography.h4,
    color: Colors.text,
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
  
  // 🎯 NEW: Search results header
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

  // 🎯 NEW: Empty search results
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