// published-galleries.tsx - Manage Artist's Published Galleries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

// Import components
import EmptyState from './components/common/EmptyState';
import Header from './components/common/Header';
import LoadingState from './components/common/LoadingState';
import StatusBadge from './components/common/StatusBadge';
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

interface PublishedGallery {
  id: number;
  title: string;
  price: number;
  sold: number;
  stock: number;
  totalStock: number;
  status: 'active' | 'paused' | 'sold_out' | 'draft';
  createdAt: string;
  image: string;
  category: string;
  views: number;
  likes: number;
  revenue: number;
}

const PublishedGalleriesPage = () => {
  const [galleries, setGalleries] = useState<PublishedGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Load galleries when page focuses
  useFocusEffect(
    useCallback(() => {
      loadPublishedGalleries();
    }, [])
  );

  const loadPublishedGalleries = async () => {
    try {
      setIsLoading(true);
      
      const galleriesData = await AsyncStorage.getItem('myGalleries');
      if (galleriesData) {
        const galleries = JSON.parse(galleriesData);
        setGalleries(galleries);
      } else {
        // Mock data for demonstration
        const mockGalleries: PublishedGallery[] = [
          {
            id: 1,
            title: 'Anime Style Portrait',
            price: 89,
            sold: 13,
            stock: 5,
            totalStock: 18,
            status: 'active',
            createdAt: '2025-06-15',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
            category: 'Portrait',
            views: 245,
            likes: 32,
            revenue: 1157
          },
          {
            id: 2,
            title: 'Character Design Set',
            price: 156,
            sold: 8,
            stock: 2,
            totalStock: 10,
            status: 'active',
            createdAt: '2025-06-10',
            image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
            category: 'Character Design',
            views: 189,
            likes: 28,
            revenue: 1248
          },
          {
            id: 3,
            title: 'Fantasy Portrait Collection',
            price: 120,
            sold: 25,
            stock: 0,
            totalStock: 25,
            status: 'sold_out',
            createdAt: '2025-06-05',
            image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
            category: 'Portrait',
            views: 432,
            likes: 67,
            revenue: 3000
          },
          {
            id: 4,
            title: 'Chibi Character Pack',
            price: 45,
            sold: 0,
            stock: 10,
            totalStock: 10,
            status: 'paused',
            createdAt: '2025-06-20',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
            category: 'Q-Version',
            views: 67,
            likes: 12,
            revenue: 0
          },
          {
            id: 5,
            title: 'Logo Design Template',
            price: 25,
            sold: 3,
            stock: 47,
            totalStock: 50,
            status: 'active',
            createdAt: '2025-06-18',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
            category: 'Graphic Design',
            views: 123,
            likes: 18,
            revenue: 75
          }
        ];
        
        setGalleries(mockGalleries);
        await AsyncStorage.setItem('myGalleries', JSON.stringify(mockGalleries));
      }
    } catch (error) {
      console.error('Error loading galleries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPublishedGalleries();
    setIsRefreshing(false);
  };

  const getFilteredGalleries = () => {
    if (activeFilter === 'all') return galleries;
    return galleries.filter(gallery => gallery.status === activeFilter);
  };

  const getStatusCounts = () => {
    return {
      all: galleries.length,
      active: galleries.filter(g => g.status === 'active').length,
      paused: galleries.filter(g => g.status === 'paused').length,
      sold_out: galleries.filter(g => g.status === 'sold_out').length,
      draft: galleries.filter(g => g.status === 'draft').length,
    };
  };

  const getTotalStats = () => {
    return {
      totalRevenue: galleries.reduce((sum, g) => sum + g.revenue, 0),
      totalSold: galleries.reduce((sum, g) => sum + g.sold, 0),
      totalViews: galleries.reduce((sum, g) => sum + g.views, 0),
      totalLikes: galleries.reduce((sum, g) => sum + g.likes, 0),
    };
  };

  const handleGalleryPress = (gallery: PublishedGallery) => {
    router.push({
      pathname: '/gallery-detail',
      params: {
        galleryId: gallery.id,
        title: gallery.title,
        price: gallery.price,
        artistName: 'You',
        artistAvatar: 'https://i.pravatar.cc/60?img=1',
        image: gallery.image,
        sold: gallery.sold,
        category: gallery.category
      }
    });
  };

  const handleEditGallery = (galleryId: number) => {
    router.push({
      pathname: '/edit-gallery',
      params: { galleryId }
    });
  };

  const handleToggleStatus = async (galleryId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    Alert.alert(
      `${newStatus === 'active' ? 'Activate' : 'Pause'} Gallery`,
      `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'pause'} this gallery?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: newStatus === 'active' ? 'Activate' : 'Pause',
          onPress: async () => {
            try {
              const updatedGalleries = galleries.map(g =>
                g.id === galleryId ? { ...g, status: newStatus as any } : g
              );
              setGalleries(updatedGalleries);
              await AsyncStorage.setItem('myGalleries', JSON.stringify(updatedGalleries));
              
              Alert.alert(
                'Success', 
                `Gallery ${newStatus === 'active' ? 'activated' : 'paused'} successfully.`
              );
            } catch (error) {
              console.error('Error updating gallery status:', error);
              Alert.alert('Error', 'Failed to update gallery status. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDuplicateGallery = (gallery: PublishedGallery) => {
    Alert.alert(
      'Duplicate Gallery',
      'Create a copy of this gallery with the same settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Duplicate',
          onPress: () => {
            router.push({
              pathname: '/publish-gallery',
              params: {
                duplicateFrom: gallery.id,
                title: `${gallery.title} (Copy)`,
                price: gallery.price,
                category: gallery.category
              }
            });
          }
        }
      ]
    );
  };

  const handleDeleteGallery = (galleryId: number) => {
    Alert.alert(
      'Delete Gallery',
      'Are you sure you want to delete this gallery? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedGalleries = galleries.filter(g => g.id !== galleryId);
              setGalleries(updatedGalleries);
              await AsyncStorage.setItem('myGalleries', JSON.stringify(updatedGalleries));
              
              Alert.alert('Success', 'Gallery deleted successfully.');
            } catch (error) {
              console.error('Error deleting gallery:', error);
              Alert.alert('Error', 'Failed to delete gallery. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderGalleryCard = (gallery: PublishedGallery) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return Colors.success;
        case 'paused': return Colors.warning;
        case 'sold_out': return Colors.error;
        case 'draft': return Colors.textMuted;
        default: return Colors.textMuted;
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'active': return 'Active';
        case 'paused': return 'Paused';
        case 'sold_out': return 'Sold Out';
        case 'draft': return 'Draft';
        default: return status;
      }
    };

    const stockPercentage = gallery.totalStock > 0 ? (gallery.stock / gallery.totalStock) * 100 : 0;
    const isLowStock = stockPercentage < 20 && gallery.stock > 0;

    return (
      <TouchableOpacity 
        key={gallery.id}
        style={styles.galleryCard}
        onPress={() => handleGalleryPress(gallery)}
      >
        <View style={styles.galleryHeader}>
          <Image source={{ uri: gallery.image }} style={styles.galleryImage} />
          
          <View style={styles.galleryInfo}>
            <Text style={styles.galleryTitle} numberOfLines={2}>{gallery.title}</Text>
            <Text style={styles.galleryCategory}>{gallery.category}</Text>
            
            <View style={styles.galleryMeta}>
              <Text style={styles.galleryPrice}>${gallery.price}</Text>
              <StatusBadge 
                status={gallery.status as any}
                text={getStatusText(gallery.status)}
                size="small"
              />
            </View>
            
            <View style={styles.galleryStats}>
              <Text style={styles.statText}>Sold: {gallery.sold}</Text>
              <Text style={styles.statText}>•</Text>
              <Text style={styles.statText}>Views: {gallery.views}</Text>
              <Text style={styles.statText}>•</Text>
              <Text style={styles.statText}>❤️ {gallery.likes}</Text>
            </View>
          </View>
        </View>

        {/* Stock Information */}
        <View style={styles.stockInfo}>
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Stock:</Text>
            <Text style={[
              styles.stockValue,
              isLowStock && styles.lowStockValue,
              gallery.stock === 0 && styles.outOfStockValue
            ]}>
              {gallery.stock}/{gallery.totalStock}
            </Text>
          </View>
          
          <View style={styles.stockBar}>
            <View 
              style={[
                styles.stockFill,
                { 
                  width: `${stockPercentage}%`,
                  backgroundColor: gallery.stock === 0 ? Colors.error : 
                                 isLowStock ? Colors.warning : Colors.success
                }
              ]} 
            />
          </View>
        </View>

        {/* Revenue Information */}
        <View style={styles.revenueInfo}>
          <Text style={styles.revenueLabel}>Revenue:</Text>
          <Text style={styles.revenueValue}>${(gallery.revenue || 0).toLocaleString()}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.galleryActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditGallery(gallery.id)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          {gallery.status !== 'sold_out' && (
            <TouchableOpacity 
              style={[
                styles.actionButton,
                gallery.status === 'active' ? styles.pauseButton : styles.activateButton
              ]}
              onPress={() => handleToggleStatus(gallery.id, gallery.status)}
            >
              <Text style={[
                styles.actionButtonText,
                gallery.status === 'active' ? styles.pauseButtonText : styles.activateButtonText
              ]}>
                {gallery.status === 'active' ? 'Pause' : 'Activate'}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => showMoreOptions(gallery)}
          >
            <Text style={styles.moreButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const showMoreOptions = (gallery: PublishedGallery) => {
    Alert.alert(
      gallery.title,
      'Choose an action',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Duplicate', 
          onPress: () => handleDuplicateGallery(gallery)
        },
        { 
          text: 'Analytics', 
          onPress: () => router.push({
            pathname: '/gallery-analytics',
            params: { galleryId: gallery.id }
          })
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => handleDeleteGallery(gallery.id)
        }
      ]
    );
  };

  const renderFilterTabs = () => {
    const filters = [
      { key: 'all', label: 'All' },
      { key: 'active', label: 'Active' },
      { key: 'paused', label: 'Paused' },
      { key: 'sold_out', label: 'Sold Out' },
      { key: 'draft', label: 'Draft' }
    ];

    const counts = getStatusCounts();

    return (
      <View style={styles.filterTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.activeFilterTabText
              ]}>
                {filter.label}
              </Text>
              {counts[filter.key] > 0 && (
                <View style={styles.filterCount}>
                  <Text style={styles.filterCountText}>{counts[filter.key]}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSummaryStats = () => {
    const stats = getTotalStats();
    
    return (
      <View style={styles.summaryStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>${(stats.totalRevenue || 0).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalSold || 0}</Text>
          <Text style={styles.statLabel}>Total Sold</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalViews || 0}</Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalLikes || 0}</Text>
          <Text style={styles.statLabel}>Total Likes</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header title="Published Galleries" style={AppStyles.header} />
        <LoadingState text="Loading your galleries..." />
      </View>
    );
  }

  const filteredGalleries = getFilteredGalleries();

  return (
    <View style={AppStyles.container}>
      <Header 
        title="Published Galleries"
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/publish-gallery')}
          >
            <Text style={styles.headerButtonIcon}>+</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Summary Stats */}
        {galleries.length > 0 && renderSummaryStats()}

        {/* Quick Actions */}
        {galleries.length > 0 && (
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/publish-gallery')}
            >
              <Text style={styles.quickActionIcon}>🎨</Text>
              <Text style={styles.quickActionText}>New Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/gallery-analytics')}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filter Tabs */}
        {galleries.length > 0 && renderFilterTabs()}

        {/* Galleries List */}
        <View style={styles.galleriesList}>
          {filteredGalleries.length > 0 ? (
            filteredGalleries.map(renderGalleryCard)
          ) : galleries.length === 0 ? (
            <EmptyState
              icon="🖼️"
              title="No Galleries Published"
              description="Start building your portfolio by publishing your first gallery. Showcase your artwork and start earning!"
              buttonText="Publish Your First Gallery"
              onButtonPress={() => router.push('/publish-gallery')}
              size="large"
            />
          ) : (
            <EmptyState
              icon="🔍"
              title={`No ${activeFilter === 'all' ? '' : activeFilter.replace('_', ' ')} Galleries`}
              description={`You don't have any ${activeFilter === 'all' ? '' : activeFilter.replace('_', ' ')} galleries.`}
              buttonText="View All Galleries"
              onButtonPress={() => setActiveFilter('all')}
              size="medium"
            />
          )}
        </View>

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  // Header Button
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonIcon: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Summary Stats
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    justifyContent: 'space-between', // Changed from no justification
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.xl, // Increased padding for better touch area
    alignItems: 'center',
    marginHorizontal: Layout.spacing.md, // Increased margin for better spacing
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: Layout.spacing.sm,
  },
  quickActionText: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },

  // Filter Tabs
  filterTabs: {
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.xl,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  activeFilterTabText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  filterCount: {
    backgroundColor: Colors.error,
    borderRadius: Layout.radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: Layout.spacing.xs,
    minWidth: 18,
    alignItems: 'center',
  },
  filterCountText: {
    ...Typography.badge,
    fontSize: 10,
  },

  // Galleries List
  galleriesList: {
    paddingHorizontal: Layout.spacing.xl,
  },

  // Gallery Card
  galleryCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  galleryHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.md,
  },
  galleryInfo: {
    flex: 1,
  },
  galleryTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  galleryCategory: {
    ...Typography.bodySmall,
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  galleryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  galleryPrice: {
    ...Typography.price,
    fontSize: 18,
  },
  galleryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginRight: Layout.spacing.xs,
  },

  // Stock Information
  stockInfo: {
    marginBottom: Layout.spacing.md,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  stockLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  stockValue: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  lowStockValue: {
    color: Colors.warning,
  },
  outOfStockValue: {
    color: Colors.error,
  },
  stockBar: {
    height: 4,
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.xs,
    overflow: 'hidden',
  },
  stockFill: {
    height: '100%',
    borderRadius: Layout.radius.xs,
  },

  // Revenue Information
  revenueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
  },
  revenueLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  revenueValue: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    color: Colors.success,
  },

  // Gallery Actions
  galleryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    marginLeft: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
    borderColor: Colors.warning,
  },
  pauseButtonText: {
    color: Colors.text,
  },
  activateButton: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  activateButtonText: {
    color: Colors.text,
  },
  moreButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    marginLeft: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 40,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});

export default PublishedGalleriesPage;