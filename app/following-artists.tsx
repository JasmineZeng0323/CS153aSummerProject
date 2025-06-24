// following-artists.tsx - Updated with Search Integration
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
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

interface Artist {
  id: number;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  isAvailable: boolean;
  followedDate: string;
  latestWork: string;
  specialties: string[];
  averagePrice: string;
  responseTime: string;
  completionRate: number;
  bio?: string; // 🎯 NEW: For better search
  artStyles?: string[]; // 🎯 NEW: For search by style
}

const FollowingArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showSearch, setShowSearch] = useState(false); // 🎯 NEW: Search modal state
  const [searchQuery, setSearchQuery] = useState(''); // 🎯 NEW: Current search query

  useEffect(() => {
    loadFollowingArtists();
  }, []);

  const loadFollowingArtists = async () => {
    try {
      // Mock data for followed artists - 🎯 ENHANCED with search fields
      const mockArtists: Artist[] = [
        {
          id: 1,
          name: 'Alice Chen',
          username: '@aliceart',
          avatar: 'https://i.pravatar.cc/60?img=1',
          rating: 4.9,
          reviewCount: 234,
          isOnline: true,
          isAvailable: true,
          followedDate: '2025-01-15',
          latestWork: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
          specialties: ['Character Design', 'Portraits'],
          averagePrice: '$150-300',
          responseTime: '2h',
          completionRate: 98,
          bio: 'Professional character designer with 5+ years experience in anime and gaming industry',
          artStyles: ['Anime', 'Character Design', 'Digital Art']
        },
        {
          id: 2,
          name: 'Marco Rodriguez',
          username: '@marcoart',
          avatar: 'https://i.pravatar.cc/60?img=2',
          rating: 5.0,
          reviewCount: 186,
          isOnline: true,
          isAvailable: false,
          followedDate: '2025-02-20',
          latestWork: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
          specialties: ['Anime Style', 'Full Body'],
          averagePrice: '$200-500',
          responseTime: '1h',
          completionRate: 100,
          bio: 'Anime specialist creating stunning full-body illustrations and character sheets',
          artStyles: ['Anime', 'Full Body', 'Character Sheets']
        },
        {
          id: 3,
          name: 'Sakura Tanaka',
          username: '@sakuraart',
          avatar: 'https://i.pravatar.cc/60?img=3',
          rating: 4.8,
          reviewCount: 156,
          isOnline: false,
          isAvailable: true,
          followedDate: '2025-03-10',
          latestWork: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
          specialties: ['Traditional Art', 'Watercolor'],
          averagePrice: '$100-250',
          responseTime: '4h',
          completionRate: 95,
          bio: 'Traditional watercolor artist specializing in delicate and expressive portraits',
          artStyles: ['Traditional', 'Watercolor', 'Portrait']
        },
        {
          id: 4,
          name: 'David Kim',
          username: '@davidillustrates',
          avatar: 'https://i.pravatar.cc/60?img=4',
          rating: 4.7,
          reviewCount: 289,
          isOnline: false,
          isAvailable: false,
          followedDate: '2025-04-05',
          latestWork: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
          specialties: ['Concept Art', 'Game Design'],
          averagePrice: '$300-800',
          responseTime: '6h',
          completionRate: 92,
          bio: 'Concept artist and game designer with AAA studio experience',
          artStyles: ['Concept Art', 'Game Design', 'Digital Painting']
        },
        {
          id: 5,
          name: 'Emma Thompson',
          username: '@emmacreates',
          avatar: 'https://i.pravatar.cc/60?img=5',
          rating: 4.9,
          reviewCount: 198,
          isOnline: true,
          isAvailable: true,
          followedDate: '2025-05-12',
          latestWork: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
          specialties: ['Digital Art', 'Fantasy'],
          averagePrice: '$180-400',
          responseTime: '3h',
          completionRate: 96,
          bio: 'Fantasy digital artist creating magical worlds and mythical creatures',
          artStyles: ['Fantasy', 'Digital Art', 'Creature Design']
        }
      ];

      setArtists(mockArtists);
    } catch (error) {
      console.error('Error loading following artists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFollowingArtists();
    setRefreshing(false);
  };

  // 🎯 NEW: Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching following artists for: ${query}`);
  };

  const handleSearchResultPress = (result: any) => {
    console.log('Search result pressed:', result);
    // Navigate to artist detail
    const artist = artists.find(a => a.id.toString() === result.id);
    if (artist) {
      handleArtistPress(artist);
    }
  };

  const handleUnfollow = (artistId: number, artistName: string) => {
    Alert.alert(
      'Unfollow Artist',
      `Stop following ${artistName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unfollow', 
          style: 'destructive',
          onPress: () => {
            setArtists(prev => prev.filter(artist => artist.id !== artistId));
            Alert.alert('Unfollowed', `You are no longer following ${artistName}.`);
          }
        }
      ]
    );
  };

  const handleArtistPress = (artist: Artist) => {
    router.push({
      pathname: '/artist-detail',
      params: {
        artistId: artist.id,
        artistName: artist.name,
        artistAvatar: artist.avatar
      }
    });
  };

  const handleMessageArtist = (artist: Artist) => {
    router.push({
      pathname: '/chat',
      params: {
        chatId: artist.id,
        chatName: artist.name,
        chatAvatar: artist.avatar,
        isOnline: artist.isOnline
      }
    });
  };

  // 🎯 ENHANCED: Filter artists with search functionality
  const getFilteredArtists = (): Artist[] => {
    let filtered = artists;

    // Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(artist => 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (artist.artStyles && artist.artStyles.some(style => 
          style.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        artist.averagePrice.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'Online':
        return filtered.filter(artist => artist.isOnline);
      case 'Available':
        return filtered.filter(artist => artist.isAvailable);
      default:
        return filtered;
    }
  };

  const getStatusColor = (artist: Artist): string => {
    if (artist.isOnline) return Colors.online;
    return Colors.textMuted;
  };

  const getAvailabilityText = (artist: Artist): string => {
    if (artist.isAvailable) {
      return artist.isOnline ? 'Available Now' : 'Available';
    }
    return 'Queue Full';
  };

  const getAvailabilityColor = (artist: Artist): string => {
    if (artist.isAvailable) return Colors.success;
    return Colors.warning;
  };

  // Render summary card
  const renderSummaryCard = () => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryStats}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{artists.length}</Text>
          <Text style={styles.summaryLabel}>Following</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{artists.filter(a => a.isOnline).length}</Text>
          <Text style={styles.summaryLabel}>Online</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{artists.filter(a => a.isAvailable).length}</Text>
          <Text style={styles.summaryLabel}>Available</Text>
        </View>
      </View>
    </View>
  );

  // Render filter tabs
  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {['All', 'Online', 'Available'].map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
          onPress={() => setActiveFilter(filter)}
        >
          <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
            {filter}
          </Text>
          <View style={styles.filterCount}>
            <Text style={styles.filterCountText}>
              {filter === 'All' ? getFilteredArtists().length : 
               filter === 'Online' ? artists.filter(a => a.isOnline).length :
               artists.filter(a => a.isAvailable).length}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render artist card
  const renderArtist = (artist: Artist) => (
    <TouchableOpacity 
      key={artist.id} 
      style={styles.artistCard}
      onPress={() => handleArtistPress(artist)}
    >
      <View style={styles.artistHeader}>
        <View style={styles.artistBasicInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: artist.avatar }} style={styles.artistAvatar} />
            <View style={[styles.onlineIndicator, { backgroundColor: getStatusColor(artist) }]} />
          </View>
          
          <View style={styles.artistInfo}>
            <Text style={styles.artistName}>{artist.name}</Text>
            <Text style={styles.artistUsername}>{artist.username}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐{artist.rating}</Text>
              <Text style={styles.reviewCount}>({artist.reviewCount})</Text>
              <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(artist) }]}>
                <Text style={styles.availabilityText}>{getAvailabilityText(artist)}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.artistActions}>
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={(e) => {
              e.stopPropagation();
              handleMessageArtist(artist);
            }}
          >
            <Text style={styles.messageIcon}>💬</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.unfollowButton}
            onPress={(e) => {
              e.stopPropagation();
              handleUnfollow(artist.id, artist.name);
            }}
          >
            <Text style={styles.unfollowIcon}>❤️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Latest Work */}
      <View style={styles.latestWorkSection}>
        <Text style={styles.latestWorkTitle}>Latest Work</Text>
        <Image source={{ uri: artist.latestWork }} style={styles.latestWorkImage} />
      </View>

      {/* Artist Stats */}
      <View style={styles.artistStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {artist.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg Price</Text>
            <Text style={styles.statValue}>{artist.averagePrice}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Response</Text>
            <Text style={styles.statValue}>{artist.responseTime}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Completion</Text>
            <Text style={styles.statValue}>{artist.completionRate}%</Text>
          </View>
        </View>
      </View>

      <Text style={styles.followedDate}>Following since {artist.followedDate}</Text>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <EmptyState
      icon="👥"
      title={
        searchQuery.trim() ? 'No artists found' :
        activeFilter === 'All' ? 'No artists followed yet' : 
        activeFilter === 'Online' ? 'No artists online' : 
        'No available artists'
      }
      description={
        searchQuery.trim() 
          ? 'Try adjusting your search terms or browse categories'
          : activeFilter === 'All' 
          ? 'Discover and follow talented artists to see their updates here.'
          : 'Check back later or try a different filter.'
      }
      buttonText={searchQuery.trim() ? undefined : activeFilter === 'All' ? 'Discover Artists' : undefined}
      onButtonPress={searchQuery.trim() ? undefined : activeFilter === 'All' ? () => router.push('/artists') : undefined}
    />
  );

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header 
          title="Following Artists" 
          showBackButton={true}
          style={AppStyles.header}
          rightElement={
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          }
        />
        <LoadingState text="Loading your followed artists..." />
      </View>
    );
  }

  const filteredArtists = getFilteredArtists();

  return (
    <View style={AppStyles.container}>
      {/* Header */}
      <Header 
        title="Following Artists" 
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

      {/* Summary Stats */}
      {renderSummaryCard()}

      {/* Search Results Header - 🎯 NEW */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            Results for "{searchQuery}" ({filteredArtists.length})
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
        {filteredArtists.length > 0 ? (
          <View style={styles.artistsList}>
            {filteredArtists.map((artist) => renderArtist(artist))}
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
        searchType="following"
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
  
  // Summary Card
  summaryCard: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
  },
  summaryStats: {
    ...Layout.row,
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // Filter Tabs
  filterContainer: {
    ...Layout.row,
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  filterTab: {
    ...Layout.row,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
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
    minWidth: 20,
    height: 20,
    ...Layout.columnCenter,
  },
  filterCountText: {
    ...Typography.badge,
    fontSize: 10,
  },

  // Content
  content: {
    flex: 1,
  },
  artistsList: {
    paddingHorizontal: Layout.spacing.xl,
  },
  
  // Artist Card
  artistCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  artistHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.lg,
  },
  artistBasicInfo: {
    ...Layout.row,
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Layout.spacing.lg,
  },
  artistAvatar: {
    ...Layout.avatarLarge,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: Layout.radius.round,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  artistUsername: {
    ...Typography.bodySmallMuted,
    marginBottom: Layout.spacing.sm,
  },
  ratingContainer: {
    ...Layout.row,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    ...Typography.bodySmall,
    color: Colors.rating,
    marginRight: Layout.spacing.xs,
  },
  reviewCount: {
    ...Typography.bodySmallMuted,
    marginRight: Layout.spacing.md,
  },
  availabilityBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.radius.md,
  },
  availabilityText: {
    ...Typography.badge,
    fontSize: 10,
  },
  artistActions: {
    ...Layout.row,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    ...Layout.columnCenter,
    marginRight: Layout.spacing.md,
  },
  messageIcon: {
    fontSize: 16,
  },
  unfollowButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.card,
    ...Layout.columnCenter,
  },
  unfollowIcon: {
    fontSize: 16,
  },

  // Latest Work
  latestWorkSection: {
    marginBottom: Layout.spacing.lg,
  },
  latestWorkTitle: {
    ...Typography.h6,
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  latestWorkImage: {
    width: '100%',
    height: 120,
    borderRadius: Layout.radius.md,
  },

  // Artist Stats
  artistStats: {
    marginBottom: Layout.spacing.md,
  },
  statItem: {
    marginBottom: Layout.spacing.sm,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  statValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: 'bold',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  specialtyText: {
    ...Typography.badge,
    fontSize: 10,
  },
  statsRow: {
    ...Layout.row,
    justifyContent: 'space-between',
  },
  followedDate: {
    ...Typography.caption,
    color: Colors.textDisabled,
    fontStyle: 'italic',
  },

  bottomPadding: {
    height: Layout.spacing.xxxl,
  },
});

export default FollowingArtistsPage;