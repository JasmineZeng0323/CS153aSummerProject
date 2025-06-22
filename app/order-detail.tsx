import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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

const { width: screenWidth } = Dimensions.get('window');

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

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
      },
      {
        id: 3,
        name: 'Process_Sketch.jpg',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
        size: '1.2 MB',
        format: 'JPG',
        resolution: '1500x1500'
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
        stage: 'Artist Accepted',
        date: '2025-06-20 15:45',
        status: 'completed',
        description: 'Artist accepted the commission and started working'
      },
      {
        id: 3,
        stage: 'Sketch Phase',
        date: '2025-06-21 10:20',
        status: 'completed',
        description: 'Initial sketch completed and approved by client'
      },
      {
        id: 4,
        stage: 'Final Artwork',
        date: '2025-06-22 16:15',
        status: 'completed',
        description: 'Final artwork completed and delivered'
      },
      {
        id: 5,
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
      format: 'PNG, JPG',
      colorMode: 'RGB',
      deliveryTime: '3 hours',
      revisions: '2 minor revisions included',
      usage: 'Personal use only'
    },
    paymentInfo: {
      subtotal: price || '157',
      platformFee: '7.85',
      total: (parseFloat(price || '157') + 7.85).toFixed(2),
      paymentMethod: 'Wallet Balance',
      transactionId: 'TXN-2025-000123'
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'delivered': return '#2196F3';
      case 'cancelled': return '#FF5722';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleDownloadFile = (file) => {
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

  const handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'What type of issue would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quality Issue', onPress: () => console.log('Quality issue reported') },
        { text: 'Delivery Issue', onPress: () => console.log('Delivery issue reported') },
        { text: 'Other', onPress: () => console.log('Other issue reported') }
      ]
    );
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

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Order Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderData.status) }]}>
            <Text style={styles.statusText}>{getStatusText(orderData.status)}</Text>
          </View>
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
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{orderData.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Purchase Date:</Text>
          <Text style={styles.detailValue}>{orderData.purchaseDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>{orderData.deadline}</Text>
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
        <TouchableOpacity style={styles.actionButton} onPress={handleReportIssue}>
          <Text style={styles.actionIcon}>⚠️</Text>
          <Text style={styles.actionText}>Report Issue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Delivered Files ({orderData.deliveredFiles.length})</Text>
      
      {orderData.deliveredFiles.map((file) => (
        <View key={file.id} style={styles.fileCard}>
          <TouchableOpacity 
            style={styles.filePreview}
            onPress={() => handleImagePress(file.url)}
          >
            <Image source={{ uri: file.url }} style={styles.fileImage} />
          </TouchableOpacity>
          
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

      <View style={styles.downloadAllContainer}>
        <TouchableOpacity style={styles.downloadAllButton}>
          <Text style={styles.downloadAllText}>📦 Download All Files</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTimelineTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Order Timeline</Text>
      
      {orderData.timeline.map((item, index) => (
        <View key={item.id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={[
              styles.timelineIndicator,
              item.status === 'completed' && styles.timelineIndicatorCompleted
            ]}>
              {item.status === 'completed' && <Text style={styles.timelineCheck}>✓</Text>}
            </View>
            {index < orderData.timeline.length - 1 && (
              <View style={styles.timelineLine} />
            )}
          </View>
          
          <View style={styles.timelineContent}>
            <Text style={styles.timelineStage}>{item.stage}</Text>
            <Text style={styles.timelineDate}>{item.date}</Text>
            <Text style={styles.timelineDescription}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderSpecsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Specifications</Text>
      
      <View style={styles.specsCard}>
        {Object.entries(orderData.specifications).map(([key, value]) => (
          <View key={key} style={styles.specRow}>
            <Text style={styles.specLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
            </Text>
            <Text style={styles.specValue}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.tabTitle}>Payment Information</Text>
      
      <View style={styles.specsCard}>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Subtotal:</Text>
          <Text style={styles.specValue}>${orderData.paymentInfo.subtotal}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Platform Fee:</Text>
          <Text style={styles.specValue}>${orderData.paymentInfo.platformFee}</Text>
        </View>
        <View style={[styles.specRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${orderData.paymentInfo.total}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Payment Method:</Text>
          <Text style={styles.specValue}>{orderData.paymentInfo.paymentMethod}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Transaction ID:</Text>
          <Text style={styles.specValue}>{orderData.paymentInfo.transactionId}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

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
        {['Overview', 'Files', 'Timeline', 'Specs'].map((tab) => (
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
        {activeTab === 'Overview' && renderOverviewTab()}
        {activeTab === 'Files' && renderFilesTab()}
        {activeTab === 'Timeline' && renderTimelineTab()}
        {activeTab === 'Specs' && renderSpecsTab()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity 
            style={styles.imageModalClose}
            onPress={() => setShowImageModal(false)}
          >
            <Text style={styles.imageModalCloseText}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#00A8FF',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabButtonText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },

  // Content
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  // Overview Tab
  statusCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedDate: {
    fontSize: 14,
    color: '#888',
  },

  artistCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  artistRating: {
    fontSize: 14,
    color: '#888',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 18,
  },

  detailsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  priceValue: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },

  actionsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  // Files Tab
  fileCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  filePreview: {
    marginRight: 16,
  },
  fileImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fileSpecs: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  downloadIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  downloadAllContainer: {
    marginTop: 16,
  },
  downloadAllButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadAllText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Timeline Tab
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIndicatorCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#333',
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#00A8FF',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },

  // Specs Tab
  specsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specLabel: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 2,
    textAlign: 'right',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    flex: 2,
    textAlign: 'right',
  },

  // Image Modal
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 12,
  },

  bottomPadding: {
    height: 40,
  },
});

export default OrderDetailPage;