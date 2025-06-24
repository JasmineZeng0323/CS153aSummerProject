import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from './components/common/Header';
import StatusBadge from './components/common/StatusBadge';
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

const OrderDetailPage = () => {
  const params = useLocalSearchParams();
  const { 
    orderId, 
    orderNumber, 
    title, 
    price, 
    artistName, 
    artistAvatar, 
    image, 
    status, 
    purchaseDate, 
    deadline 
  } = params;

  const [activeTab, setActiveTab] = useState('Overview');

  // Mock detailed order data
  const orderData = {
    id: orderId || '1',
    orderNumber: orderNumber || 'ORD-2025-001',
    title: title || 'Ultra Fast Portrait [3h]',
    price: price || '157',
    status: status || 'completed',
    purchaseDate: purchaseDate || '2025-06-20',
    deadline: deadline || '2025-06-23',
    completedDate: '2025-06-22',
    category: 'Portrait',
    artist: {
      id: 'artist_001',
      name: artistName || 'huh',
      avatar: artistAvatar || 'https://i.pravatar.cc/60?img=1',
      rating: 4.9,
      responseTime: '2h'
    },
    originalImage: image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    deliveredFiles: [
      {
        id: 1,
        name: 'Final_Portrait_HD.png',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
        size: '2.4 MB',
        format: 'PNG',
        resolution: '2000x2000'
      },
      {
        id: 2,
        name: 'Final_Portrait_4K.png',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=1200&fit=crop',
        size: '5.8 MB',
        format: 'PNG',
        resolution: '4000x4000'
      }
    ],
    timeline: [
      {
        id: 1,
        stage: 'Order Placed',
        date: '2025-06-20 14:30',
        status: 'completed',
        description: 'Order successfully placed and payment received'
      },
      {
        id: 2,
        stage: 'Order Completed',
        date: '2025-06-22 16:30',
        status: 'completed',
        description: 'Client confirmed receipt and order completed'
      }
    ],
    specifications: {
      type: 'Portrait',
      style: 'Anime/Manga',
      resolution: '2000x2000px, 4000x4000px',
      format: 'PNG',
      deliveryTime: '3 hours'
    },
    paymentInfo: {
      subtotal: price || '157',
      platformFee: '7.85',
      total: (parseFloat(price || '157') + 7.85).toFixed(2),
      paymentMethod: 'Wallet Balance',
      transactionId: 'TXN-2025-000123'
    }
  };

  const handleDownloadFile = (file: any) => {
    Alert.alert(
      'Download File',
      `Download ${file.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            console.log('Downloading file:', file.name);
            Alert.alert('Download Started', `${file.name} is being downloaded...`);
          }
        }
      ]
    );
  };

  const handleContactArtist = () => {
    router.push({
      pathname: '/chat',
      params: {
        chatId: orderData.artist.id,
        chatName: orderData.artist.name,
        chatAvatar: orderData.artist.avatar
      }
    });
  };

  const handleWriteReview = () => {
    router.push({
      pathname: '/write-review',
      params: {
        orderId: orderData.id,
        artistName: orderData.artist.name,
        title: orderData.title
      }
    });
  };

  // Share button component with functionality
  const ShareButton = () => {
    const handleShare = () => {
      Alert.alert(
        'Share Order',
        'How would you like to share this order?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Copy Link', 
            onPress: () => {
              console.log('Order link copied to clipboard');
              Alert.alert('Success', 'Order link copied to clipboard');
            }
          },
          { 
            text: 'Share Image', 
            onPress: () => {
              console.log('Sharing order image');
              Alert.alert('Share', 'Sharing order artwork...');
            }
          },
          { 
            text: 'Share Details', 
            onPress: () => {
              console.log('Sharing order details');
              Alert.alert('Share', 'Sharing order details...');
            }
          }
        ]
      );
    };

    return (
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareIcon}>📤</Text>
      </TouchableOpacity>
    );
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Order Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <StatusBadge 
            status={orderData.status as any} 
            size="medium"
          />
          <Text style={styles.completedDate}>
            Completed: {orderData.completedDate}
          </Text>
        </View>
      </View>

      {/* Artist Info */}
      <View style={styles.artistCard}>
        <View style={styles.artistInfo}>
          <Image source={{ uri: orderData.artist.avatar }} style={styles.artistAvatar} />
          <View style={styles.artistDetails}>
            <Text style={styles.artistName}>{orderData.artist.name}</Text>
            <Text style={styles.artistRating}>⭐ {orderData.artist.rating} • {orderData.artist.responseTime} response</Text>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactArtist}>
            <Text style={styles.contactButtonText}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Order Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Number:</Text>
          <Text style={styles.detailValue}>{orderData.orderNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={[styles.detailValue, styles.priceValue]}>${orderData.paymentInfo.total}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionButton} onPress={handleWriteReview}>
          <Text style={styles.actionIcon}>⭐</Text>
          <Text style={styles.actionText}>Write Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Delivered Files ({orderData.deliveredFiles.length})</Text>
      
      {orderData.deliveredFiles.map((file) => (
        <View key={file.id} style={styles.fileCard}>
          <Image source={{ uri: file.url }} style={styles.fileImage} />
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{file.name}</Text>
            <Text style={styles.fileSpecs}>
              {file.format} • {file.resolution} • {file.size}
            </Text>
            
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => handleDownloadFile(file)}
            >
              <Text style={styles.downloadIcon}>⬇️</Text>
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverviewTab();
      case 'Files':
        return renderFilesTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <View style={AppStyles.container}>
      {/* Header using common Header component */}
      <Header 
        title="Order Details" 
        showBackButton={true}
        onBackPress={() => router.back()}
        rightElement={<ShareButton />}
        style={AppStyles.header}
      />

      {/* Order Header */}
      <View style={styles.orderHeader}>
        <Image source={{ uri: orderData.originalImage }} style={styles.orderImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle}>{orderData.title}</Text>
          <Text style={styles.orderPrice}>${orderData.price}</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {['Overview', 'Files'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Share button
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },

  // Order Header
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.lg,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.sm,
  },
  orderPrice: {
    ...Typography.price,
  },

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  tabButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    marginRight: Layout.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Colors.primary,
  },
  tabButtonText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  activeTabButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Content
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },
  tabTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
  },

  // Cards
  statusCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedDate: {
    ...Typography.bodySmallMuted,
  },

  artistCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistAvatar: {
    ...Layout.avatar,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Layout.spacing.md,
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  artistRating: {
    ...Typography.bodySmallMuted,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 18,
  },

  detailsCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  cardTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  detailLabel: {
    ...Typography.bodySmallMuted,
  },
  detailValue: {
    ...Typography.bodySmall,
    textAlign: 'right',
    flex: 1,
    marginLeft: Layout.spacing.lg,
  },
  priceValue: {
    color: Colors.secondary,
    fontWeight: 'bold',
  },

  actionsCard: {
    ...Layout.card,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: Layout.spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Layout.spacing.sm,
  },
  actionText: {
    ...Typography.bodySmall,
  },

  // Files Tab
  fileCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
    flexDirection: 'row',
  },
  fileImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.sm,
    marginRight: Layout.spacing.lg,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  fileSpecs: {
    ...Typography.caption,
    marginBottom: Layout.spacing.md,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
    alignSelf: 'flex-start',
  },
  downloadIcon: {
    fontSize: 14,
    marginRight: Layout.spacing.sm,
  },
  downloadText: {
    ...Typography.buttonSmall,
  },

  bottomPadding: {
    height: Layout.spacing.xxxl,
  },
});

export default OrderDetailPage;