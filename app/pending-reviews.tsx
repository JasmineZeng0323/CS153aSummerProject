//pending-reviews.tsx
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

interface PendingReview {
  id: number;
  title: string;
  artist: string;
  artistAvatar: string;
  completedDate: string;
  price: number;
  image: string;
  orderNumber: string;
  category: string;
  deliveredFiles: number;
  daysAgo: number;
}

const PendingReviewsPage = () => {
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      // Mock pending reviews
      const mockReviews: PendingReview[] = [
        {
          id: 1,
          title: 'Character Design Commission',
          artist: 'Alice Chen',
          artistAvatar: 'https://i.pravatar.cc/60?img=1',
          completedDate: '2025-06-20',
          price: 157,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
          orderNumber: 'ORD-2025-001',
          category: 'Character Design',
          deliveredFiles: 3,
          daysAgo: 2
        },
        {
          id: 2,
          title: 'Anime Portrait Commission',
          artist: 'Marco Rodriguez',
          artistAvatar: 'https://i.pravatar.cc/60?img=2',
          completedDate: '2025-06-18',
          price: 89,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
          orderNumber: 'ORD-2025-002',
          category: 'Portrait',
          deliveredFiles: 2,
          daysAgo: 4
        }
      ];

      setPendingReviews(mockReviews);
    } catch (error) {
      console.error('Error loading pending reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingReviews();
    setRefreshing(false);
  };

  const handleWriteReview = (review: PendingReview) => {
    router.push({
      pathname: '/write-review',
      params: {
        orderId: review.id,
        artistName: review.artist,
        title: review.title
      }
    });
  };

  const handleSkipReview = (reviewId: number) => {
    Alert.alert(
      'Skip Review',
      'Are you sure you want to skip writing a review? You can always write one later from your order history.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: () => {
            setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
            Alert.alert('Skipped', 'Review skipped. You can write it later from your order history.');
          }
        }
      ]
    );
  };

  const handleViewOrder = (review: PendingReview) => {
    router.push({
      pathname: '/order-detail',
      params: {
        orderId: review.id,
        orderNumber: review.orderNumber,
        title: review.title,
        artistName: review.artist,
        artistAvatar: review.artistAvatar,
        image: review.image,
        status: 'completed',
        completedDate: review.completedDate
      }
    });
  };

  const handleContactArtist = (review: PendingReview) => {
    router.push({
      pathname: '/chat',
      params: {
        chatId: review.artist,
        chatName: review.artist,
        chatAvatar: review.artistAvatar
      }
    });
  };

  const getUrgencyColor = (daysAgo: number) => {
    if (daysAgo >= 7) return Colors.error; // Red for overdue
    if (daysAgo >= 3) return Colors.warning; // Orange for soon due
    return Colors.success; // Green for recent
  };

  const getUrgencyText = (daysAgo: number) => {
    if (daysAgo >= 7) return 'Review Overdue';
    if (daysAgo >= 3) return 'Review Due Soon';
    return 'Recently Completed';
  };

  // Help button component
  const HelpButton = () => (
    <TouchableOpacity style={styles.helpButton}>
      <Text style={styles.helpIcon}>❓</Text>
    </TouchableOpacity>
  );

  // Info banner component
  const InfoBanner = () => (
    <View style={styles.infoBanner}>
      <Text style={styles.infoBannerIcon}>⭐</Text>
      <View style={styles.infoBannerContent}>
        <Text style={styles.infoBannerTitle}>Help Other Clients</Text>
        <Text style={styles.infoBannerText}>
          Your reviews help other clients choose the right artist for their projects.
        </Text>
      </View>
    </View>
  );

  // Review card component
  const ReviewCard = ({ review }: { review: PendingReview }) => (
    <View style={styles.reviewCard}>
      <TouchableOpacity 
        style={styles.reviewImageContainer}
        onPress={() => handleViewOrder(review)}
      >
        <Image source={{ uri: review.image }} style={styles.reviewImage} />
        <View style={styles.imageOverlay}>
          <Text style={styles.viewOrderText}>👁️ View Order</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.reviewInfo}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle} numberOfLines={2}>{review.title}</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(review.daysAgo) }]}>
            <Text style={styles.urgencyText}>{getUrgencyText(review.daysAgo)}</Text>
          </View>
        </View>
        
        <View style={styles.reviewArtistRow}>
          <Image source={{ uri: review.artistAvatar }} style={styles.reviewArtistAvatar} />
          <View style={styles.artistInfo}>
            <Text style={styles.reviewArtist}>{review.artist}</Text>
            <Text style={styles.reviewCategory}>{review.category}</Text>
          </View>
          <TouchableOpacity 
            style={styles.contactArtistButton}
            onPress={() => handleContactArtist(review)}
          >
            <Text style={styles.contactArtistIcon}>💬</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewCompleted}>Completed: {review.completedDate}</Text>
          <Text style={styles.reviewFiles}>📎 {review.deliveredFiles} files delivered</Text>
        </View>
        
        <View style={styles.reviewPriceRow}>
          <Text style={styles.reviewPrice}>${review.price}</Text>
          <Text style={styles.orderNumber}>#{review.orderNumber}</Text>
        </View>
        
        <View style={styles.reviewActions}>
          <TouchableOpacity 
            style={styles.writeReviewButton}
            onPress={() => handleWriteReview(review)}
          >
            <Text style={styles.writeReviewText}>⭐ Write Review</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => handleSkipReview(review.id)}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Tips section component
  const TipsSection = () => (
    <View style={styles.tipsSection}>
      <Text style={styles.tipsTitle}>💡 Review Writing Tips</Text>
      <View style={styles.tipsList}>
        <Text style={styles.tipItem}>• Be honest about your experience</Text>
        <Text style={styles.tipItem}>• Mention communication quality</Text>
        <Text style={styles.tipItem}>• Rate the final artwork quality</Text>
        <Text style={styles.tipItem}>• Note if deadlines were met</Text>
      </View>
    </View>
  );

  // Custom empty state
  const CustomEmptyState = () => (
    <EmptyState
      icon="✅"
      title="All caught up!"
      description="You have no pending reviews. Reviews will appear here when your orders are completed."
      buttonText="View Order History"
      onButtonPress={() => router.push('/purchased-gallery')}
      size="medium"
    />
  );

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header 
          title="Pending Reviews" 
          showBackButton={true}
          onBackPress={() => router.back()}
          rightElement={<HelpButton />}
          style={AppStyles.header}
        />
        <LoadingState text="Loading pending reviews..." />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      {/* Header using common Header component */}
      <Header 
        title="Pending Reviews" 
        showBackButton={true}
        onBackPress={() => router.back()}
        rightElement={<HelpButton />}
        style={AppStyles.header}
      />

      {/* Info Banner */}
      {pendingReviews.length > 0 && <InfoBanner />}

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
        {pendingReviews.length > 0 ? (
          <View style={styles.reviewsList}>
            <Text style={styles.reviewsHeader}>
              {pendingReviews.length} {pendingReviews.length === 1 ? 'order needs' : 'orders need'} your review
            </Text>
            {pendingReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            
            {/* Tips Section */}
            <TipsSection />
          </View>
        ) : (
          <CustomEmptyState />
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Help button
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 20,
  },
  
  // Info Banner
  infoBanner: {
    backgroundColor: '#1A2A3A',
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoBannerIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    ...Typography.h6,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  infoBannerText: {
    ...Typography.bodyMuted,
    lineHeight: 18,
  },

  content: {
    flex: 1,
  },
  reviewsList: {
    paddingHorizontal: Layout.spacing.xl,
  },
  reviewsHeader: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },
  
  // Review Card
  reviewCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
    flexDirection: 'row',
  },
  reviewImageContainer: {
    position: 'relative',
    marginRight: Layout.spacing.lg,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: Layout.radius.md,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    borderRadius: Layout.radius.md,
    ...Layout.columnCenter,
    opacity: 0.8,
  },
  viewOrderText: {
    ...Typography.caption,
    fontWeight: 'bold',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  reviewTitle: {
    ...Typography.h6,
    flex: 1,
    marginRight: Layout.spacing.sm,
    lineHeight: 20,
  },
  urgencyBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.md,
  },
  urgencyText: {
    ...Typography.badge,
    fontSize: 10,
  },
  reviewArtistRow: {
    ...Layout.row,
    marginBottom: Layout.spacing.md,
  },
  reviewArtistAvatar: {
    ...Layout.avatarSmall,
    marginRight: Layout.spacing.md,
  },
  artistInfo: {
    flex: 1,
  },
  reviewArtist: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewCategory: {
    ...Typography.caption,
  },
  contactArtistButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.primary,
    ...Layout.columnCenter,
  },
  contactArtistIcon: {
    fontSize: 14,
  },
  reviewMeta: {
    marginBottom: Layout.spacing.md,
  },
  reviewCompleted: {
    ...Typography.caption,
    marginBottom: Layout.spacing.xs,
  },
  reviewFiles: {
    ...Typography.caption,
    color: Colors.success,
  },
  reviewPriceRow: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.lg,
  },
  reviewPrice: {
    ...Typography.price,
  },
  orderNumber: {
    ...Typography.caption,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  writeReviewButton: {
    flex: 1,
    backgroundColor: Colors.warning,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    alignItems: 'center',
  },
  writeReviewText: {
    ...Typography.buttonSmall,
  },
  skipButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    alignItems: 'center',
  },
  skipButtonText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },

  // Tips Section
  tipsSection: {
    backgroundColor: '#1A2A1A',
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginTop: Layout.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  tipsTitle: {
    ...Typography.h6,
    color: Colors.success,
    marginBottom: Layout.spacing.md,
  },
  tipsList: {
    marginLeft: Layout.spacing.sm,
  },
  tipItem: {
    ...Typography.bodyMuted,
    lineHeight: 20,
    marginBottom: Layout.spacing.xs,
  },

  bottomPadding: {
    height: Layout.spacing.xxxl,
  },
});

export default PendingReviewsPage;