import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'delivered': return '#2196F3';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🎨';
      case 'delivered': return '📦';
      default: return '❓';
    }
  };

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
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
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
          <View style={styles.ratedBadge}>
            <Text style={styles.ratedText}>⭐ Rated {item.rating}/5</Text>
          </View>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Purchased Gallery</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your purchases...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
            tintColor="#00A8FF"
            colors={['#00A8FF']}
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
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No items found</Text>
            <Text style={styles.emptyStateText}>
              No items with "{activeFilter}" status found.
            </Text>
          </View>
        ) : null}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
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
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  
  // Filter Tabs
  filterContainer: {
    paddingVertical: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#00A8FF',
  },
  filterText: {
    fontSize: 16,
    color: '#888',
  },
  activeFilterText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  filterCount: {
    backgroundColor: '#333',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Welcome Card
  welcomeCard: {
    backgroundColor: '#1A2A3A',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00A8FF',
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00A8FF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },

  // Content
  content: {
    flex: 1,
  },

  // Purchased Item Card
  purchasedItem: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemBasicInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  artistMiniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  artistName: {
    fontSize: 14,
    color: '#888',
  },
  orderNumber: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Progress Section
  progressSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00A8FF',
    borderRadius: 3,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#888',
  },

  // Delivery Section
  deliverySection: {
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  deliveredFiles: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  deliveredFile: {
    marginRight: 12,
    alignItems: 'center',
  },
  deliveredFileImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  fileLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratedBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ratedText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Purchase Info
  purchaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  purchaseDate: {
    fontSize: 12,
    color: '#888',
  },
  deadline: {
    fontSize: 12,
    color: '#888',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
});

export default PurchasedGalleryPage;