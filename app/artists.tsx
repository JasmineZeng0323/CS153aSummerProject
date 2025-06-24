// artists.tsx - Updated with Search Integration
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
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
import ArtistCard from './components/common/ArtistCard';
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

const ArtistsPage = () => {
  const [activeTab, setActiveTab] = useState('Artists');
  const [activeCategoryTab, setActiveCategoryTab] = useState('Recommended');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showArtStyleModal, setShowArtStyleModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // 🎯 NEW: Search modal state
  const [searchQuery, setSearchQuery] = useState(''); // 🎯 NEW: Current search query
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    type: ['All'],
    style: ['All'], 
    technique: ['All'],
    attribute: ['All'],
    availability: [],
    artStyle: ['All']
  });

  // Animation values for page swiping (only 2 pages now)
  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0); // 0 = Artists, 1 = Portfolio

  // Like states for artworks
  const [artworkLikes, setArtworkLikes] = useState(new Map());

  // Handle tab switch
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    let targetPage = 0;
    if (tab === 'Portfolio') targetPage = 1;
    
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
      
      if (event.translationX < -threshold && currentPage.value < 1) {
        newPage = currentPage.value + 1;
      } else if (event.translationX > threshold && currentPage.value > 0) {
        newPage = currentPage.value - 1;
      }
      
      currentPage.value = newPage;
      translateX.value = withTiming(-newPage * screenWidth, { duration: 250 });
      
      const tabs = ['Artists', 'Portfolio'];
      runOnJS(setActiveTab)(tabs[newPage]);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Mock data for artists - with category classification
  const allArtistsData = [
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
      ],
      isVerified: true,
      availability: 'Available',
      artStyle: ['Anime', 'Digital Art'],
      category: 'Recommended',
      isFollowing: false,
      bio: 'Character design specialist with 5+ years experience'
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
      ],
      isVerified: true,
      availability: 'Extended Queue',
      artStyle: ['Realistic', 'Portrait'],
      category: 'Recommended',
      isFollowing: true,
      bio: 'Professional portrait artist specializing in realistic styles'
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
      ],
      isVerified: false,
      availability: 'Has Price List',
      artStyle: ['Fantasy', 'Cartoon'],
      category: 'Following',
      isFollowing: true,
      bio: 'Fantasy and cartoon artist with unique style'
    },
    {
      id: 4,
      name: 'DigitalMaster',
      username: 'Available',
      rating: 4.9,
      reviewCount: 42,
      avatar: 'https://i.pravatar.cc/60?img=4',
      artworks: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop'
      ],
      isVerified: true,
      availability: 'Available',
      artStyle: ['Digital Art', 'Anime'],
      category: 'Following',
      isFollowing: true,
      bio: 'Digital art expert with modern techniques'
    }
  ];

  // Mock artwork data with category classification
  const allArtworkItems = [
    {
      id: 1,
      title: 'Fantasy Character Design',
      artist: 'Artist Name',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      likes: 234,
      isLiked: false,
      aspectRatio: 1.5,
      category: 'Character',
      style: 'Japanese',
      technique: 'Digital',
      contentCategory: 'Recommended'
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
      technique: 'Digital',
      contentCategory: 'Recommended'
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
      technique: 'Traditional',
      contentCategory: 'Following'
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
      technique: 'Digital',
      contentCategory: 'Following'
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
      technique: 'Digital',
      contentCategory: 'Recommended'
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
      technique: 'Watercolor',
      contentCategory: 'Following'
    }
  ];

  // Filter sections for FilterModal
  const filterSections: FilterSection[] = [
    {
      id: 'type',
      title: 'Type',
      multiSelect: false,
      options: [
        { id: 'All', title: 'All' },
        { id: 'Drawing', title: 'Drawing', icon: '✏️' },
        { id: 'Q-Version', title: 'Q-Version', icon: '🎭' },
        { id: 'Character', title: 'Character', icon: '👤' },
        { id: 'Scene', title: 'Scene', icon: '🎬' },
        { id: 'Portrait', title: 'Portrait', icon: '👨‍🎨' },
        { id: 'Live2D', title: 'Live2D', icon: '🎮' }
      ]
    },
    {
      id: 'style',
      title: 'Style',
      multiSelect: false,
      options: [
        { id: 'All', title: 'All' },
        { id: 'Japanese', title: 'Japanese', icon: '🎌' },
        { id: 'Ancient', title: 'Ancient', icon: '🏛️' },
        { id: 'Western', title: 'Western', icon: '🎭' }
      ]
    },
    {
      id: 'technique',
      title: 'Technique',
      multiSelect: false,
      options: [
        { id: 'All', title: 'All' },
        { id: 'Traditional', title: 'Traditional', icon: '🖌️' },
        { id: 'Digital', title: 'Digital', icon: '💻' },
        { id: 'CG', title: 'CG', icon: '🎮' },
        { id: 'Realistic', title: 'Realistic', icon: '📸' },
        { id: 'Watercolor', title: 'Watercolor', icon: '🎨' }
      ]
    },
    {
      id: 'attribute',
      title: 'Attribute',
      multiSelect: false,
      options: [
        { id: 'All', title: 'All' },
        { id: 'Female', title: 'Female', icon: '♀️' },
        { id: 'Male', title: 'Male', icon: '♂️' }
      ]
    }
  ];

  // Art Style filter sections for Artists page
  const artStyleFilterSections: FilterSection[] = [
    {
      id: 'artStyle',
      title: 'Art Style',
      multiSelect: true,
      options: [
        { id: 'All', title: 'All Styles' },
        { id: 'Anime', title: 'Anime', icon: '🎌' },
        { id: 'Realistic', title: 'Realistic', icon: '📸' },
        { id: 'Cartoon', title: 'Cartoon', icon: '🎭' },
        { id: 'Fantasy', title: 'Fantasy', icon: '🧙‍♂️' },
        { id: 'Chibi', title: 'Chibi', icon: '🎎' },
        { id: 'Sketch', title: 'Sketch', icon: '✏️' },
        { id: 'Watercolor', title: 'Watercolor', icon: '🎨' },
        { id: 'Digital Art', title: 'Digital Art', icon: '💻' }
      ]
    }
  ];

  const cardWidth = (screenWidth - 60) / 2; // Width for two columns

  // 🎯 NEW: Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching for: ${query} in ${activeTab}`);
  };

  const handleSearchResultPress = (result: any) => {
    console.log('Search result pressed:', result);
    if (result.type === 'artist') {
      router.push({
        pathname: '/artist-detail',
        params: {
          artistId: result.id,
          artistName: result.title,
          artistAvatar: result.image
        }
      });
    } else if (result.type === 'gallery') {
      router.push({
        pathname: '/artwork-detail',
        params: {
          artworkId: result.id,
          title: result.title,
          artist: result.data?.artist || result.subtitle,
          image: result.image
        }
      });
    }
  };

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

  // Filter handlers
  const handleFilterChange = (sectionId: string, optionId: string, isSelected: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (sectionId === 'artStyle' || sectionId === 'availability') {
        // Multi-select for artStyle and availability
        if (!newFilters[sectionId]) newFilters[sectionId] = [];
        
        if (isSelected) {
          if (optionId === 'All') {
            newFilters[sectionId] = ['All'];
          } else {
            newFilters[sectionId] = newFilters[sectionId].filter(id => id !== 'All');
            newFilters[sectionId].push(optionId);
          }
        } else {
          newFilters[sectionId] = newFilters[sectionId].filter(id => id !== optionId);
          if (newFilters[sectionId].length === 0 && sectionId === 'artStyle') {
            newFilters[sectionId] = ['All'];
          }
        }
      } else {
        // Single select for other filters
        newFilters[sectionId] = isSelected ? [optionId] : ['All'];
      }
      
      return newFilters;
    });
  };

  const handleFilterReset = () => {
    setSelectedFilters({
      type: ['All'],
      style: ['All'], 
      technique: ['All'],
      attribute: ['All'],
      availability: [],
      artStyle: ['All']
    });
  };

  const handleFilterApply = () => {
    setShowFilterModal(false);
    setShowArtStyleModal(false);
    // Apply filter logic here
  };

  // Filter functions with category classification and search
  const getFilteredArtists = () => {
    let filtered = allArtistsData;

    // 🎯 NEW: Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(artist => 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.artStyle.some(style => style.toLowerCase().includes(searchQuery.toLowerCase())) ||
        artist.availability.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category tab
    if (activeCategoryTab === 'Recommended') {
      filtered = filtered.filter(artist => artist.category === 'Recommended');
    } else if (activeCategoryTab === 'Following') {
      filtered = filtered.filter(artist => artist.isFollowing === true);
    }

    // Filter by availability
    if (selectedFilters.availability && selectedFilters.availability.length > 0) {
      filtered = filtered.filter(artist => 
        selectedFilters.availability.some(avail => artist.availability.includes(avail))
      );
    }

    // Filter by art style
    const selectedArtStyles = selectedFilters.artStyle || ['All'];
    if (!selectedArtStyles.includes('All')) {
      filtered = filtered.filter(artist => 
        artist.artStyle.some(style => selectedArtStyles.includes(style))
      );
    }

    return filtered;
  };

  const getFilteredArtworks = () => {
    let filtered = allArtworkItems;

    // 🎯 NEW: Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.technique.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category tab
    if (activeCategoryTab === 'Recommended') {
      filtered = filtered.filter(item => item.contentCategory === 'Recommended');
    } else if (activeCategoryTab === 'Following') {
      filtered = filtered.filter(item => item.contentCategory === 'Following');
    }

    // Filter by type
    const selectedType = selectedFilters.type?.[0] || 'All';
    if (selectedType !== 'All') {
      filtered = filtered.filter(item => item.category === selectedType);
    }

    // Filter by style
    const selectedStyle = selectedFilters.style?.[0] || 'All';
    if (selectedStyle !== 'All') {
      filtered = filtered.filter(item => item.style === selectedStyle);
    }

    // Filter by technique
    const selectedTechnique = selectedFilters.technique?.[0] || 'All';
    if (selectedTechnique !== 'All') {
      filtered = filtered.filter(item => item.technique === selectedTechnique);
    }

    return filtered;
  };

  // Waterfall layout calculation - use filtered artworks
  const renderWaterfallArtwork = () => {
    const filteredArtworks = getFilteredArtworks();
    const leftColumn = [];
    const rightColumn = [];
    let leftHeight = 0;
    let rightHeight = 0;

    filteredArtworks.forEach((item) => {
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
          
          {/* Like Button */}
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

  // Artists Page Content
  const ArtistsContent = () => (
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
            Results for "{searchQuery}" ({getFilteredArtists().length})
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.categoryContainer}>
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
          style={[styles.categoryTab, activeCategoryTab === 'Following' && styles.activeCategoryTab]}
          onPress={() => setActiveCategoryTab('Following')}
        >
          <Text style={styles.categoryIcon}>👥</Text>
          <Text style={[styles.categoryText, activeCategoryTab === 'Following' && styles.activeCategoryText]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilters.availability?.includes('Available') && styles.activeFilterButton
          ]}
          onPress={() => {
            const isSelected = selectedFilters.availability?.includes('Available') || false;
            handleFilterChange('availability', 'Available', !isSelected);
          }}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.availability?.includes('Available') && styles.activeFilterText
          ]}>
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilters.availability?.includes('Extended Queue') && styles.activeFilterButton
          ]}
          onPress={() => {
            const isSelected = selectedFilters.availability?.includes('Extended Queue') || false;
            handleFilterChange('availability', 'Extended Queue', !isSelected);
          }}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.availability?.includes('Extended Queue') && styles.activeFilterText
          ]}>
            Extended Queue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilters.availability?.includes('Has Price List') && styles.activeFilterButton
          ]}
          onPress={() => {
            const isSelected = selectedFilters.availability?.includes('Has Price List') || false;
            handleFilterChange('availability', 'Has Price List', !isSelected);
          }}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.availability?.includes('Has Price List') && styles.activeFilterText
          ]}>
            Has Price List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilters.artStyle && !selectedFilters.artStyle.includes('All') && styles.activeFilterButton
          ]}
          onPress={() => setShowArtStyleModal(true)}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.artStyle && !selectedFilters.artStyle.includes('All') && styles.activeFilterText
          ]}>
            Art Style ▼
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.artistsList}>
        {getFilteredArtists().map((artist) => (
          <ArtistCard
            key={artist.id}
            id={artist.id}
            name={artist.name}
            username={artist.username}
            secondaryUsername={artist.secondaryUsername}
            rating={artist.rating}
            reviewCount={artist.reviewCount}
            avatar={artist.avatar}
            artworks={artist.artworks}
            isVerified={artist.isVerified}
          />
        ))}
      </View>

      {/* 🎯 NEW: Empty search results for Artists */}
      {searchQuery.trim() && getFilteredArtists().length === 0 && (
        <View style={styles.emptySearchResults}>
          <Text style={styles.emptySearchIcon}>🔍</Text>
          <Text style={styles.emptySearchTitle}>No artists found</Text>
          <Text style={styles.emptySearchDescription}>
            Try adjusting your search terms or browse categories
          </Text>
        </View>
      )}
    </View>
  );

  // Portfolio Page Content (without search bar)
  const PortfolioContent = () => (
    <View style={styles.pageContent}>
      {/* Search Results Header - 🎯 NEW */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            Portfolio results for "{searchQuery}" ({getFilteredArtworks().length})
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

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
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilters.type[0] !== 'All' && styles.activeFilterButton
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.type[0] !== 'All' && styles.activeFilterText
          ]}>
            Type {selectedFilters.type[0] !== 'All' && `▲`}
            {selectedFilters.type[0] === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilters.style[0] !== 'All' && styles.activeFilterButton
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.style[0] !== 'All' && styles.activeFilterText
          ]}>
            Style {selectedFilters.style[0] !== 'All' && `▲`}
            {selectedFilters.style[0] === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilters.technique[0] !== 'All' && styles.activeFilterButton
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.technique[0] !== 'All' && styles.activeFilterText
          ]}>
            Technique {selectedFilters.technique[0] !== 'All' && `▲`}
            {selectedFilters.technique[0] === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilters.attribute[0] !== 'All' && styles.activeFilterButton
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={[
            styles.filterText,
            selectedFilters.attribute[0] !== 'All' && styles.activeFilterText
          ]}>
            Attribute {selectedFilters.attribute[0] !== 'All' && `▲`}
            {selectedFilters.attribute[0] === 'All' && '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Waterfall Layout Artworks Grid */}
      {renderWaterfallArtwork()}

      {/* 🎯 NEW: Empty search results for Portfolio */}
      {searchQuery.trim() && getFilteredArtworks().length === 0 && (
        <View style={styles.emptySearchResults}>
          <Text style={styles.emptySearchIcon}>🔍</Text>
          <Text style={styles.emptySearchTitle}>No artworks found</Text>
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
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/post-project')}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.swipeContainer, animatedStyle]}>
          {/* Artists Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <ArtistsContent />
            <View style={GlobalStyles.bottomPadding} />
          </ScrollView>

          {/* Portfolio Page */}
          <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <PortfolioContent />
            <View style={GlobalStyles.bottomPadding} />
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>

      <BottomNavigation activeTab="artists" />

      {/* 🎯 NEW: Search Component */}
      <SearchComponent
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        searchType="artists"
        onSearch={handleSearch}
        onResultPress={handleSearchResultPress}
      />

      {/* Portfolio Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        title="Filters"
        sections={filterSections}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        onApply={handleFilterApply}
        onClose={() => setShowFilterModal(false)}
      />

      {/* Art Style Filter Modal */}
      <FilterModal
        visible={showArtStyleModal}
        title="Art Style"
        sections={artStyleFilterSections}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        onApply={handleFilterApply}
        onClose={() => setShowArtStyleModal(false)}
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
  // Swipe container styles (now only 2 pages)
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
    marginBottom: Layout.spacing.lg,
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

  // Category Tabs
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.sm,
    justifyContent: 'flex-start',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    marginRight: Layout.spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minWidth: 80,
  },
  activeCategoryTab: {
    borderBottomColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.sm,
  },
  categoryText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  activeCategoryText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Filter Buttons
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
    marginRight: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: 'normal',
  },
  activeFilterText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  artistsList: {
    ...Layout.paddingHorizontal,
  },
  // Waterfall layout styles
  waterfallContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    justifyContent: 'space-between',
  },
  column: {
    width: (screenWidth - 60) / 2,
  },
  waterfallCard: {
    borderRadius: Layout.radius.lg,
    marginBottom: Layout.spacing.sm,
    overflow: 'hidden',
  },
  waterfallImageContainer: {
    position: 'relative',
  },
  waterfallImage: {
    width: '100%',
  },
  simpleLikeButton: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    width: 36,
    height: 36,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleLikeIcon: {
    fontSize: 20,
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
});

export default ArtistsPage;