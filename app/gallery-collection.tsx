// gallery-collection.tsx - Updated with Search Integration
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import EmptyState from './components/common/EmptyState';
import Header from './components/common/Header';
import LoadingState from './components/common/LoadingState';
import SearchComponent from './components/common/SearchComponent'; // 🎯 NEW
import { Colors } from './components/styles/Colors';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

// Unified container style
const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
  header: {
    paddingTop: 50, // Status bar height
  },
};

const { width: screenWidth } = Dimensions.get('window');

interface Collection {
  id: number;
  title: string;
  artist: string;
  artistAvatar: string;
  price: number;
  image: string;
  savedDate: string;
  category: string;
  isAvailable: boolean;
  tags: string[];
  description?: string; // 🎯 NEW: For better search
  artStyle?: string; // 🎯 NEW: Art style for search
}

const GalleryCollectionPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showSearch, setShowSearch] = useState(false); // 🎯 NEW: Search modal state
  const [searchQuery, setSearchQuery] = useState(''); // 🎯 NEW: Current search query

  useEffect(() => {
    loadGalleryCollections();
  }, []);

  const loadGalleryCollections = async () => {
    try {
      // Mock data for gallery collections - 🎯 ENHANCED with search fields
      const mockCollections: Collection[] = [
        {
          id: 1,
          title: 'Anime Style Portrait',
          artist: 'Alice Chen',
          artistAvatar: 'https://i.pravatar.cc/40?img=1',
          price: 89,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
          savedDate: '2025-06-15',
          category: 'Portrait',
          isAvailable: true,
          tags: ['Anime', 'Portrait'],
          description: 'Beautiful anime style portrait with vibrant colors and detailed features',
          artStyle: 'Anime'
        },
        {
          id: 2,
          title: 'Character Design Set',
          artist: 'Marco Rodriguez',
          artistAvatar: 'https://i.pravatar.cc/40?img=2',
          price: 157,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
          savedDate: '2025-06-10',
          category: 'Character',
          isAvailable: false,
          tags: ['Character', 'Design'],
          description: 'Complete character design package including front, side and back views',
          artStyle: 'Character Design'
        },
        {
          id: 3,
          title: 'Fantasy Landscape',
          artist: 'Sakura Tanaka',
          artistAvatar: 'https://i.pravatar.cc/40?img=3',
          price: 234,
          image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop',
          savedDate: '2025-06-08',
          category: 'Landscape',
          isAvailable: true,
          tags: ['Fantasy', 'Landscape'],
          description: 'Mystical fantasy landscape with magical elements and atmospheric lighting',
          artStyle: 'Fantasy'
        },
        {
          id: 4,
          title: 'Chibi Style Collection',
          artist: 'David Kim',
          artistAvatar: 'https://i.pravatar.cc/40?img=4',
          price: 67,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
          savedDate: '2025-06-05',
          category: 'Q-Version',
          isAvailable: true,
          tags: ['Chibi', 'Cute'],
          description: 'Adorable chibi style characters with kawaii expressions',
          artStyle: 'Chibi'
        },
        {
          id: 5,
          title: 'Digital Painting Masterpiece',
          artist: 'Emma Thompson',
          artistAvatar: 'https://i.pravatar.cc/40?img=5',
          price: 299,
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop',
          savedDate: '2025-06-01',
          category: 'Portrait',
          isAvailable: true,
          tags: ['Digital', 'Painting', 'Realistic'],
          description: 'Hyperrealistic digital painting with incredible attention to detail',
          artStyle: 'Digital Painting'
        },
        {
          id: 6,
          title: 'Watercolor Dreams',
          artist: 'Luna Martinez',
          artistAvatar: 'https://i.pravatar.cc/40?img=6',
          price: 145,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
          savedDate: '2025-05-28',
          category: 'Portrait',
          isAvailable: false,
          tags: ['Watercolor', 'Traditional', 'Soft'],
          description: 'Delicate watercolor portrait with flowing colors and soft edges',
          artStyle: 'Watercolor'
        }
      ];

      setCollections(mockCollections);
    } catch (error) {
      console.error('Error loading gallery collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGalleryCollections();
    setRefreshing(false);
  };

  // 🎯 NEW: Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching gallery collection for: ${query}`);
  };

  const handleSearchResultPress = (result: any) => {
    console.log('Search result pressed:', result);
    // Navigate to gallery detail
    const collection = collections.find(c => c.id.toString() === result.id);
    if (collection) {
      handleCollectionPress(collection);
    }
  };

  const handleCollectionPress = (collection: Collection) => {
    router.push({
      pathname: '/gallery-detail',
      params: {
        galleryId: collection.id,
        title: collection.title,
        price: collection.price,
        artistName: collection.artist,
        artistAvatar: collection.artistAvatar,
        image: collection.image
      }
    });
  };

  const handleRemoveFromCollection = (collectionId: number) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };

  // 🎯 ENHANCED: Filter collections with search functionality
  const getFilteredCollections = (): Collection[] => {
    let filtered = collections;

    // Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(collection => 
        collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (collection.artStyle && collection.artStyle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        collection.price.toString().includes(searchQuery)
      );
    }

    // Apply category filter
    if (activeFilter === 'All') return filtered;
    if (activeFilter === 'Available') return filtered.filter(c => c.isAvailable);
    return filtered.filter(c => c.category === activeFilter);
  };

  // Render summary card
  const renderSummaryCard = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>My Collection</Text>
      <Text style={styles.summaryText}>
        {collections.length} galleries saved • {collections.filter(c => c.isAvailable).length} available
      </Text>
    </View>
  );

  // Render filter tabs
  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['All', 'Available', 'Portrait', 'Character', 'Landscape', 'Q-Version'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
            {/* Show count for each filter */}
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>
                {filter === 'All' ? collections.length :
                 filter === 'Available' ? collections.filter(c => c.isAvailable).length :
                 collections.filter(c => c.category === filter).length}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Render collection item (custom layout matching the design)
  const renderCollection = (collection: Collection) => (
    <TouchableOpacity 
      key={collection.id} 
      style={styles.collectionItem}
      onPress={() => handleCollectionPress(collection)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: collection.image }} style={styles.collectionImage} />
        {!collection.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>SOLD OUT</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation();
            handleRemoveFromCollection(collection.id);
          }}
        >
          <Text style={styles.removeIcon}>💔</Text>
        </TouchableOpacity>
        
        {/* Artist info overlay */}
        <View style={styles.artistInfo}>
          <Image source={{ uri: collection.artistAvatar }} style={styles.artistAvatar} />
          <Text style={styles.artistName}>{collection.artist}</Text>
        </View>
      </View>
      
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionTitle} numberOfLines={2}>{collection.title}</Text>
        <Text style={styles.categoryText}>{collection.category}</Text>
        <Text style={styles.price}>${collection.price}</Text>
        
        <View style={styles.tagsContainer}>
          {collection.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.savedDate}>Saved {collection.savedDate}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <EmptyState
      icon="💔"
      title={
        searchQuery.trim() ? 'No collections found' :
        activeFilter === 'All' ? 'No collections found' : 
        `No ${activeFilter.toLowerCase()} collections`
      }
      description={
        searchQuery.trim() 
          ? 'Try adjusting your search terms or browse categories'
          : activeFilter === 'All' 
          ? 'Start saving galleries you like to build your collection.'
          : `No galleries found for "${activeFilter}" filter.`
      }
      buttonText={searchQuery.trim() ? undefined : activeFilter === 'All' ? 'Explore Galleries' : undefined}
      onButtonPress={searchQuery.trim() ? undefined : activeFilter === 'All' ? () => router.push('/homepage') : undefined}
    />
  );

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header 
          title="Gallery Collection" 
          showBackButton={true}
          style={AppStyles.header}
          rightElement={
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          }
        />
        <LoadingState text="Loading your collection..." />
      </View>
    );
  }

  const filteredCollections = getFilteredCollections();

  return (
    <View style={AppStyles.container}>
      {/* Header */}
      <Header 
        title="Gallery Collection" 
        showBackButton={true}
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setShowSearch(true)}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        }
      />

      {/* Summary */}
      {renderSummaryCard()}

      {/* Search Results Header - 🎯 NEW */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            Results for "{searchQuery}" ({filteredCollections.length})
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Tabs */}
      {renderFilterTabs()}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {filteredCollections.length > 0 ? (
          <View style={styles.collectionGrid}>
            {filteredCollections.map((collection) => renderCollection(collection))}
          </View>
        ) : (
          renderEmptyState()
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 🎯 NEW: Search Component */}
      <SearchComponent
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        searchType="collection"
        onSearch={handleSearch}
        onResultPress={handleSearchResultPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Search button
  searchButton: {
    width: 40,
    height: 40,
    ...Layout.columnCenter,
  },
  searchIcon: {
    fontSize: 20,
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

  // Content
  content: {
    flex: 1,
  },

  // Summary Card
  summaryCard: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  summaryTitle: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  summaryText: {
    ...Typography.bodySmallMuted,
  },

  // Filter Tabs
  filterContainer: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginRight: Layout.spacing.sm,
  },
  activeFilterText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  filterCount: {
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.round,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCountText: {
    ...Typography.badge,
    fontSize: 9,
  },

  // Collection Grid
  collectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.spacing.lg,
  },
  collectionItem: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },

  // Image Container
  imageContainer: {
    position: 'relative',
  },
  collectionImage: {
    width: '100%',
    height: 160,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    ...Layout.columnCenter,
  },
  unavailableText: {
    ...Typography.h6,
    color: Colors.error,
  },
  removeButton: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.blackTransparent,
    ...Layout.columnCenter,
  },
  removeIcon: {
    fontSize: 16,
  },
  artistInfo: {
    position: 'absolute',
    bottom: Layout.spacing.sm,
    left: Layout.spacing.sm,
    ...Layout.row,
  },
  artistAvatar: {
    width: 24,
    height: 24,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  artistName: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Collection Info
  collectionInfo: {
    padding: Layout.spacing.md,
  },
  collectionTitle: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
    lineHeight: 18,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  price: {
    ...Typography.h6,
    color: Colors.secondary,
    marginBottom: Layout.spacing.sm,
  },
  tagsContainer: {
    ...Layout.row,
    marginBottom: Layout.spacing.xs,
  },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.radius.sm,
    marginRight: Layout.spacing.xs,
  },
  tagText: {
    ...Typography.badge,
    fontSize: 8,
  },
  savedDate: {
    ...Typography.caption,
    color: Colors.textDisabled,
    fontSize: 10,
  },

  bottomPadding: {
    height: Layout.spacing.xxxl,
  },
});

export default GalleryCollectionPage;