import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Import your component library
import EmptyState from './components/common/EmptyState';
import Header from './components/common/Header';
import LoadingState from './components/common/LoadingState';
import StatusBadge from './components/common/StatusBadge';
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const { width: screenWidth } = Dimensions.get('window');

const PurchasedGalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  const loadPurchasedItems = async () => {
    try {
      const storedPurchases = await AsyncStorage.getItem('purchasedGalleries');
      if (storedPurchases) {
        const purchases = JSON.parse(storedPurchases);
        setPurchasedItems(purchases);
      } else {
        // If no purchases exist, create some sample data
        const sampleData = [
          {
            id: 1,
            title: 'Ultra Fast Portrait [3h]',
            price: 157,
            artistName: 'huh',
            artistAvatar: 'https://i.pravatar.cc/40?img=1',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
            category: 'Portrait',
            purchaseDate: '2025-06-20',
            status: 'completed',
            deadline: '2025-06-23',
            orderNumber: 'ORD-2025-001',
            deliveredFiles: [
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=1200&fit=crop'
            ],
            rating: 5,
            hasReviewed: true,
            totalPaid: '171.25'
          }
        ];
        setPurchasedItems(sampleData);
        await AsyncStorage.setItem('purchasedGalleries', JSON.stringify(sampleData));
      }
    } catch (error) {
      console.error('Error loading purchased items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPurchasedItems();
    setRefreshing(false);
  };

  const filterOptions = ['All', 'In Progress', 'Delivered', 'Completed'];

  const filteredItems = purchasedItems.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'In Progress') return item.status === 'in_progress';
    if (activeFilter === 'Delivered') return item.status === 'delivered';
    if (activeFilter === 'Completed') return item.status === 'completed';
    return true;
  });

  const handleItemPress = (item) => {
    router.push({
      pathname: '/order-detail',
      params: {
        orderId: item.id,
        orderNumber: item.orderNumber,
        title: item.title,
        price: item.price,
        artistName: item.artistName,
        artistAvatar: item.artistAvatar,
        image: item.image,
        status: item.status,
        purchaseDate: item.purchaseDate,
        deadline: item.deadline,
        totalPaid: item.totalPaid
      }
    });
  };

  const handleContactArtist = (item) => {
    router.push({
      pathname: '/chat',
      params: {
        chatId: item.artistName,
        chatName: item.artistName,
        chatAvatar: item.artistAvatar
      }
    });
  };

  const handleConfirmDelivery = async (itemId) => {
    try {
      const updatedItems = purchasedItems.map(item => 
        item.id === itemId 
          ? { ...item, status: 'completed', needsConfirmation: false }
          : item
      );
      setPurchasedItems(updatedItems);
      await AsyncStorage.setItem('purchasedGalleries', JSON.stringify(updatedItems));
      
      console.log('Delivery confirmed for item:', itemId);
    } catch (error) {
      console.error('Error confirming delivery:', error);
    }
  };

  const handleWriteReview = (item) => {
    router.push({
      pathname: '/write-review',
      params: {
        orderId: item.id,
        artistName: item.artistName,
        title: item.title
      }
    });
  };

  const renderPurchasedItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.purchasedItem}
      onPress={() => handleItemPress(item)}
    >
      {/* Item Header */}
      <View style={styles.itemHeader}>
        <View style={styles.itemBasicInfo}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.artistInfo}>
              <Image source={{ uri: item.artistAvatar }} style={styles.artistMiniAvatar} />
              <Text style={styles.artistName}>{item.artistName}</Text>
            </View>
            <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
          </View>
        </View>
        
        <View style={styles.itemMeta}>
          <Text style={styles.itemPrice}>${item.totalPaid || item.price}</Text>
          <StatusBadge 
            status={item.status === 'in_progress' ? 'in_progress' : 
                   item.status === 'delivered' ? 'delivered' : 'completed'}
            size="small"
          />
        </View>
      </View>

      {/* Progress Bar for In Progress Items */}
      {item.status === 'in_progress' && item.progress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{item.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.lastUpdate}>Last update: {item.lastUpdate}</Text>
        </View>
      )}

      {/* Delivery Files for Completed/Delivered Items */}
      {(item.status === 'completed' || item.status === 'delivered') && item.deliveredFiles && (
        <View style={styles.deliverySection}>
          <Text style={styles.deliveryTitle}>Delivered Files ({item.deliveredFiles.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.deliveredFiles}>
              {item.deliveredFiles.map((fileUrl, index) => (
                <TouchableOpacity key={index} style={styles.deliveredFile}>
                  <Image source={{ uri: fileUrl }} style={styles.deliveredFileImage} />
                  <Text style={styles.fileLabel}>File {index + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={(e) => {
            e.stopPropagation();
            handleContactArtist(item);
          }}
        >
          <Text style={styles.contactButtonText}>💬 Contact Artist</Text>
        </TouchableOpacity>

        {item.status === 'delivered' && item.needsConfirmation && (
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={(e) => {
              e.stopPropagation();
              handleConfirmDelivery(item.id);
            }}
          >
            <Text style={styles.confirmButtonText}>✅ Confirm Receipt</Text>
          </TouchableOpacity>
        )}

        {item.status === 'completed' && !item.hasReviewed && (
          <TouchableOpacity 
            style={styles.reviewButton}
            onPress={(e) => {
              e.stopPropagation();
              handleWriteReview(item);
            }}
          >
            <Text style={styles.reviewButtonText}>⭐ Write Review</Text>
          </TouchableOpacity>
        )}

        {item.hasReviewed && (
          <StatusBadge 
            status="completed" 
            text={`Rated ${item.rating}/5`}
            icon="⭐"
            size="small"
            style={styles.ratedBadge}
          />
        )}
      </View>

      {/* Purchase Info */}
      <View style={styles.purchaseInfo}>
        <Text style={styles.purchaseDate}>Purchased: {item.purchaseDate}</Text>
        <Text style={styles.deadline}>Deadline: {item.deadline}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={GlobalStyles.container}>
        <Header 
          title="Purchased Gallery"
          rightElement={<View style={styles.placeholder} />}
        />
        <LoadingState text="Loading your purchases..." />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      {/* Header - 手动实现以确保正确的 padding */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchased Gallery</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter}
              </Text>
              {filter !== 'All' && (
                <View style={styles.filterCount}>
                  <Text style={styles.filterCountText}>
                    {purchasedItems.filter(item => {
                      if (filter === 'In Progress') return item.status === 'in_progress';
                      if (filter === 'Delivered') return item.status === 'delivered';
                      if (filter === 'Completed') return item.status === 'completed';
                      return false;
                    }).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Purchase Summary */}
      {purchasedItems.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Purchase Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{purchasedItems.length}</Text>
              <Text style={styles.summaryLabel}>Total Orders</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {purchasedItems.filter(i => i.status === 'in_progress').length}
              </Text>
              <Text style={styles.summaryLabel}>In Progress</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {purchasedItems.filter(i => i.status === 'completed').length}
              </Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                ${purchasedItems.reduce((total, item) => total + parseFloat(item.totalPaid || item.price), 0).toFixed(0)}
              </Text>
              <Text style={styles.summaryLabel}>Total Spent</Text>
            </View>
          </View>
        </View>
      )}

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
        {/* New Purchase Tip */}
        {purchasedItems.length === 0 && (
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeIcon}>🎉</Text>
            <Text style={styles.welcomeTitle}>Welcome to Your Gallery!</Text>
            <Text style={styles.welcomeText}>
              This is where you'll see all your commissioned artwork. Start by browsing our talented artists!
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/homepage')}
            >
              <Text style={styles.browseButtonText}>Browse Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Purchased Items List */}
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => renderPurchasedItem(item))
        ) : purchasedItems.length > 0 ? (
          <EmptyState
            icon="🔍"
            title="No items found"
            description={`No items with "${activeFilter}" status found.`}
            size="medium"
          />
        ) : null}

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 50, 
    paddingBottom: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  headerTitle: {
    ...Typography.h5,
  },

  // Header elements
  placeholder: {
    width: 40,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 20,
  },
  
  filterContainer: {
    paddingVertical: Layout.spacing.sm, 
    paddingLeft: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  filterTab: {
    ...Layout.row,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm, 
    marginRight: Layout.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: Colors.primary,
  },
  filterText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  activeFilterText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  filterCount: {
    backgroundColor: Colors.border,
    borderRadius: Layout.radius.md,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.sm,
  },
  filterCountText: {
    ...Typography.badge,
    fontSize: 10,
  },

  // Welcome Card
  welcomeCard: {
    backgroundColor: Colors.artist,
    ...Layout.marginHorizontal,
    marginVertical: Layout.spacing.xl,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.lg,
  },
  welcomeTitle: {
    ...Typography.h4,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  welcomeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Layout.spacing.xl,
  },

  // Summary Card
  summaryCard: {
    ...Layout.card,
    ...Layout.marginHorizontal,
    marginVertical: Layout.spacing.lg,
  },
  summaryTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.md,
  },
  summaryStats: {
    ...Layout.row,
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    ...Typography.h4,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  summaryLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Content
  content: {
    flex: 1,
  },

  // Purchased Item Card
  purchasedItem: {
    ...Layout.card,
    ...Layout.marginHorizontal,
    marginBottom: Layout.spacing.lg,
  },
  itemHeader: {
    ...Layout.row,
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  itemBasicInfo: {
    ...Layout.row,
    flex: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
    lineHeight: 20,
  },
  artistInfo: {
    ...Layout.row,
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  artistMiniAvatar: {
    width: 20,
    height: 20,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.sm,
  },
  artistName: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  orderNumber: {
    ...Typography.caption,
    color: Colors.textDisabled,
    marginTop: 2,
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    ...Typography.price,
    marginBottom: Layout.spacing.sm,
  },

  // Progress Section
  progressSection: {
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
  },
  progressHeader: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.sm,
  },
  progressLabel: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
  },
  progressPercentage: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    ...GlobalStyles.progressBar,
    marginBottom: Layout.spacing.sm,
  },
  progressFill: {
    ...GlobalStyles.progressFill,
  },
  lastUpdate: {
    ...Typography.caption,
  },

  // Delivery Section
  deliverySection: {
    marginBottom: Layout.spacing.md,
  },
  deliveryTitle: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
  },
  deliveredFiles: {
    ...Layout.row,
    paddingRight: Layout.spacing.lg,
  },
  deliveredFile: {
    marginRight: Layout.spacing.md,
    alignItems: 'center',
  },
  deliveredFileImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.sm,
    marginBottom: Layout.spacing.xs,
  },
  fileLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Action Buttons
  actionButtons: {
    ...Layout.row,
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
  },
  contactButtonText: {
    ...Typography.buttonSmall,
  },
  confirmButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
  },
  confirmButtonText: {
    ...Typography.buttonSmall,
  },
  reviewButton: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
  },
  reviewButtonText: {
    ...Typography.buttonSmall,
  },
  ratedBadge: {
    backgroundColor: Colors.rating,
  },


  purchaseInfo: {
    ...Layout.rowSpaceBetween,
    paddingTop: Layout.spacing.md,
    ...Layout.borderTop,
  },
  purchaseDate: {
    ...Typography.caption,
    flex: 1, 
  },
  deadline: {
    ...Typography.caption,
    flex: 1, 
    textAlign: 'right', 
  },


  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xxl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xxl,
  },
  browseButtonText: {
    ...Typography.button,
  },
});

export default PurchasedGalleryPage;