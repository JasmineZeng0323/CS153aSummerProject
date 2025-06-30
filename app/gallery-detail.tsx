//gallery-detail.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
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

const { width } = Dimensions.get('window');

const GalleryDetailPage = () => {
  // Receive parameters from homepage
  const params = useLocalSearchParams();
  const { galleryId, title, price, artistName } = params;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeSection, setActiveSection] = useState('Gallery');
  const [showNavigation, setShowNavigation] = useState(false);
  const [stock, setStock] = useState(2);
  const [isStockLoaded, setIsStockLoaded] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Load stock from storage on component mount
  useEffect(() => {
    loadGalleryStock();
  }, [galleryId]);

  // Reload stock when page is focused (returning from payment)
  useFocusEffect(
    useCallback(() => {
      loadGalleryStock();
    }, [galleryId])
  );

  const loadGalleryStock = async () => {
    try {
      const stockData = await AsyncStorage.getItem('galleryStocks');
      if (stockData) {
        const stocks = JSON.parse(stockData);
        const currentStock = stocks[galleryId as string];
        if (currentStock !== undefined) {
          setStock(currentStock);
        }
      }
      setIsStockLoaded(true);
    } catch (error) {
      console.error('Error loading stock:', error);
      setIsStockLoaded(true);
    }
  };

  const updateGalleryStock = async (newStock: number) => {
    try {
      const stockData = await AsyncStorage.getItem('galleryStocks');
      const stocks = stockData ? JSON.parse(stockData) : {};
      stocks[galleryId as string] = newStock;
      await AsyncStorage.setItem('galleryStocks', JSON.stringify(stocks));
      setStock(newStock);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  // Mock gallery data
  const galleryItem = {
    id: galleryId || 1,
    title: title || 'Anime Style Portrait with Glasses',
    price: price || 89,
    sold: 13,
    category: 'Half Body',
    deadline: '2 days after artist accepts order',
    stock: `${Math.max(0, stock)}/${stock + 13}`,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
    ],
    artist: {
      id: 'artist_001',
      name: artistName || 'Little Cookie Fox',
      rating: 5.0,
      reviewCount: 208,
      avatar: 'https://i.pravatar.cc/60?img=1',
      completionRate: 100,
      onTimeRate: 99,
      avgResponseTime: '1-6h'
    },
    details: {
      content: 'Monochrome Half Body Portrait',
      preferredTypes: 'Japanese Style, Realistic',
      notAcceptedTypes: 'Real Person, Ancient Style, Gradient Hair Color',
      acceptsTextDesign: false,
      description: `After placing the order, adding discounts or modifications will not require extra charges!
      
The picture quality has been reduced a bit so the price is discounted...

Art style reference below: Adult males, young boys, adult females, young girls are all acceptable.
White hair preferred...

No.1 Draft Requirements:
- One clear character reference image (complete face and upper body)
- Character personality and background description
- If you want specific angles, poses, and actions, please inform in advance!!!!!

Unable to reply within two hours, hope you can be patient and wait for the creation process to be very focused TT
!!!!!

No.2 Modification Related:
- No modifications except for wrong image errors and extra hands
- Supports adding various discounts (such as accessories, earrings, etc.)`,
      milestones: [
        { stage: 'Draft', percentage: 70 },
        { stage: 'Final', percentage: 100 }
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
      ]
    },
    specs: {
      type: 'Half Body',
      colorMode: 'RGB',
      dimensions: '1500, 1000',
      format: 'JPG',
      publishRights: 'Artist can publish with watermark',
      contentStyle: 'Realistic, Male, Female'
    }
  };

  const reviews = [
    {
      id: 1,
      userName: 'Loooo12',
      rating: 5,
      comment: 'Amazing work! Super fast and high quality. Really delicious art style!!! Thank you teacher!',
      avatar: 'https://i.pravatar.cc/40?img=2'
    },
    {
      id: 2,
      userName: 'StarWatcher',
      rating: 5,
      comment: 'Absolutely stunning work',
      avatar: 'https://i.pravatar.cc/40?img=3'
    },
    {
      id: 3,
      userName: 'MuseumOwl',
      rating: 5,
      comment: 'Incredibly cute artistic style',
      avatar: 'https://i.pravatar.cc/40?img=4'
    }
  ];

  const recommendedItems = [
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      isExpress: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
      isExpress: false
    }
  ];

  const [sectionOffsets, setSectionOffsets] = useState({
    gallery: 0,
    details: 0,
    reviews: 0,
    recommended: 0
  });

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      setShowNavigation(value > width * 0.8);
    });
    return () => scrollY.removeListener(listener);
  }, []);

  const handleImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundedIndex = Math.round(index);
    setCurrentImageIndex(roundedIndex);
  };

  const handlePurchase = () => {
    if (!isStockLoaded) {
      Alert.alert('Loading', 'Please wait while we load the latest information.');
      return;
    }

    if (stock <= 0) {
      Alert.alert(
        'Out of Stock 😔',
        'This gallery is currently sold out. The artist may restock in the future. Would you like to add it to your wishlist to get notified?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add to Wishlist', 
            onPress: () => {
              setIsWishlisted(true);
              Alert.alert('Added!', 'We\'ll notify you when this item is back in stock.');
            }
          }
        ]
      );
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `You're about to purchase "${galleryItem.title}" for $${galleryItem.price}.\n\nRemaining stock: ${stock}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue',
          onPress: () => {
            router.push({
              pathname: '/payment',
              params: {
                galleryId: galleryItem.id,
                title: galleryItem.title,
                price: galleryItem.price,
                artistName: galleryItem.artist.name,
                artistAvatar: galleryItem.artist.avatar,
                galleryImage: galleryItem.images[0],
                deadline: galleryItem.deadline,
                stock: galleryItem.stock
              }
            });
          }
        }
      ]
    );
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    
    switch (section) {
      case 'Gallery':
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        break;
      case 'Details':
        scrollViewRef.current?.scrollTo({ y: sectionOffsets.details, animated: true });
        break;
      case 'Reviews':
        scrollViewRef.current?.scrollTo({ y: sectionOffsets.reviews, animated: true });
        break;
      case 'Recommended':
        scrollViewRef.current?.scrollTo({ y: sectionOffsets.recommended, animated: true });
        break;
    }
  };

  const handleSectionLayout = (section: string, event: any) => {
    const { y } = event.nativeEvent.layout;
    setSectionOffsets(prev => ({
      ...prev,
      [section]: y - 100
    }));
  };

  const renderImageWithPadding = (imageUri: string, index: number) => {
    return (
      <View style={styles.imageContainer} key={index}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.galleryImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  const handleArtistPress = () => {
    router.push({
      pathname: '/artist-detail',
      params: {
        artistId: galleryItem.artist.id,
        artistName: galleryItem.artist.name,
        artistAvatar: galleryItem.artist.avatar
      }
    });
  };

  // Stock display with better messaging
  const getStockDisplay = () => {
    if (!isStockLoaded) return 'Loading...';
    if (stock <= 0) return 'Sold Out';
    if (stock <= 2) return `Only ${stock} left!`;
    return `Stock ${galleryItem.stock}`;
  };

  const getStockColor = () => {
    if (!isStockLoaded) return Colors.textMuted;
    if (stock <= 0) return Colors.error;
    if (stock <= 2) return Colors.warning;
    return Colors.textMuted;
  };

  // Custom floating header tabs component
  const FloatingHeaderTabs = () => (
    <Animated.View style={[
      styles.fixedHeader,
      {
        opacity: scrollY.interpolate({
          inputRange: [width * 0.7, width * 0.9],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [width * 0.7, width * 0.9],
            outputRange: [-60, 0],
            extrapolate: 'clamp',
          }),
        }],
      }
    ]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <View style={styles.headerTabs}>
        {['Gallery', 'Details', 'Reviews', 'Recommended'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => scrollToSection(tab)}
            style={styles.headerTabButton}
          >
            <Text style={[
              styles.headerTab,
              activeSection === tab && styles.activeHeaderTab
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.moreButtonContainer}>
        <Text style={styles.moreButton}>⋯</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Custom floating more button component
  const FloatingMoreButton = () => (
    <Animated.View style={[
      styles.floatingMoreButton,
      {
        opacity: scrollY.interpolate({
          inputRange: [width * 0.7, width * 0.9],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        }),
      }
    ]}>
      <TouchableOpacity>
        <Text style={styles.moreButton}>⋯</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Artist card component
  const ArtistCard = () => (
    <View style={styles.artistBox}>
      <TouchableOpacity style={styles.artistCard} onPress={handleArtistPress}>
        <View style={styles.artistInfo}>
          <Image source={{ uri: galleryItem.artist.avatar }} style={styles.artistAvatar} />
          <View style={styles.artistDetails}>
            <Text style={styles.artistName}>{galleryItem.artist.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐{galleryItem.artist.rating}</Text>
              <Text style={styles.reviewCount}>{galleryItem.artist.reviewCount} reviews</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
        <View style={styles.artistStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{galleryItem.artist.completionRate}%</Text>
            <Text style={styles.statLabel}>Order Completion Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{galleryItem.artist.onTimeRate}%</Text>
            <Text style={styles.statLabel}>On-time Delivery Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{galleryItem.artist.avgResponseTime}</Text>
            <Text style={styles.statLabel}>Avg Response Time</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (!isStockLoaded) {
    return (
      <View style={AppStyles.container}>
        <LoadingState text="Loading gallery details..." />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      {/* Floating Header Tabs */}
      <FloatingHeaderTabs />

      {/* Floating More Button */}
      <FloatingMoreButton />

      <Animated.ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <FlatList
            ref={flatListRef}
            data={galleryItem.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => renderImageWithPadding(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.imageIndicators}>
            {galleryItem.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
          
          {/* Stock alerts using StatusBadge concept */}
          {stock <= 2 && stock > 0 && (
            <View style={styles.stockAlert}>
              <Text style={styles.stockAlertText}>⚡ Limited Stock!</Text>
            </View>
          )}
          
          {stock <= 0 && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfoBox}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${galleryItem.price}</Text>
            <Text style={styles.soldCount}>Sold {galleryItem.sold}</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{galleryItem.title}</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{galleryItem.category}</Text>
            </View>
          </View>
          <Text style={styles.deadline}>⏱ Deadline: {galleryItem.deadline}</Text>
          
          {/* Enhanced Stock Display */}
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Availability:</Text>
            <Text style={[styles.stockText, { color: getStockColor() }]}>
              {getStockDisplay()}
            </Text>
          </View>
        </View>

        {/* Artist Info using component pattern */}
        <ArtistCard />

        {/* Gallery Details Box */}
        <View 
          style={styles.detailsBox}
          onLayout={(event) => handleSectionLayout('details', event)}
        >
          <Text style={styles.sectionTitle}>Gallery Details</Text>
          
          <View style={[styles.detailSection, styles.contentSection]}>
            <Text style={styles.detailSectionTitle}>🎨 Content</Text>
            <Text style={styles.detailSectionContent}>{galleryItem.details.content}</Text>
          </View>

          <View style={[styles.detailSection, styles.preferredSection]}>
            <Text style={styles.detailSectionTitle}>❤️ Preferred Types</Text>
            <Text style={styles.detailSectionContent}>{galleryItem.details.preferredTypes}</Text>
          </View>

          <View style={[styles.detailSection, styles.notAcceptedSection]}>
            <Text style={styles.detailSectionTitle}>🚫 Not Accepted Types</Text>
            <Text style={styles.detailSectionContent}>{galleryItem.details.notAcceptedTypes}</Text>
          </View>

          <View style={[styles.detailCard, styles.acceptsTextSection]}>
            <Text style={styles.detailIcon}>📝</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Accepts Text Design</Text>
              <Text style={styles.detailValue}>{galleryItem.details.acceptsTextDesign ? '✓' : '✗'}</Text>
            </View>
          </View>

          <Text style={styles.detailDescription}>{galleryItem.details.description}</Text>

          <View style={styles.galleryImagesSection}>
            <Text style={styles.galleryImagesTitle}>Gallery Preview</Text>
            {galleryItem.details.galleryImages.map((image, index) => (
              <View key={index} style={styles.verticalImageContainer}>
                <Image 
                  source={{ uri: image }} 
                  style={styles.verticalGalleryImage} 
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Specifications Box */}
        <View style={styles.specificationsBox}>
          <Text style={styles.sectionTitle}>Artwork Specifications</Text>
          <View style={styles.specTable}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Gallery Type</Text>
              <Text style={styles.specValue}>{galleryItem.specs.type}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Color Mode</Text>
              <Text style={styles.specValue}>{galleryItem.specs.colorMode}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Dimensions</Text>
              <Text style={styles.specValue}>{galleryItem.specs.dimensions}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>File Format</Text>
              <Text style={styles.specValue}>{galleryItem.specs.format}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Publishing Rights</Text>
              <Text style={styles.specValue}>{galleryItem.specs.publishRights}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Content Style</Text>
              <Text style={styles.specValue}>{galleryItem.specs.contentStyle}</Text>
            </View>
          </View>
        </View>

        {/* Creation Milestones Box */}
        <View style={styles.milestonesBox}>
          <Text style={styles.sectionTitle}>Creation Milestones</Text>
          <Text style={styles.milestonesDescription}>
            The artist will provide updates at the following milestones for buyer confirmation. 
            If disputes arise due to buyer reasons during collaboration, buyers must pay according to confirmed milestones.
          </Text>
          <View style={styles.milestoneSlider}>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderProgress} />
              <View style={[styles.sliderPoint, styles.sliderPointActive]} />
              <View style={[styles.sliderPoint, styles.sliderPointActive]} />
            </View>
            <View style={styles.milestoneLabels}>
              <Text style={styles.milestoneLabel}>70%\nDraft</Text>
              <Text style={styles.milestoneLabel}>100%\nFinal</Text>
            </View>
          </View>
        </View>

        {/* Reviews Box */}
        <View 
          style={styles.reviewsBox}
          onLayout={(event) => handleSectionLayout('reviews', event)}
        >
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Gallery Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
          
          {reviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewUserName}>{review.userName}</Text>
                <View style={styles.reviewStars}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Text key={i} style={styles.star}>⭐</Text>
                  ))}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllReviews}>
            <Text style={styles.viewAllReviewsText}>View all 11 reviews ›</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Box */}
        <View 
          style={styles.recommendedBox}
          onLayout={(event) => handleSectionLayout('recommended', event)}
        >
          <Text style={styles.recommendedTitle}>💖 You might also like these galleries from this artist</Text>
          <View style={styles.recommendedGrid}>
            {recommendedItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.recommendedItem}>
                <View style={styles.recommendedImageContainer}>
                  <View style={styles.recommendedPlaceholder}>
                    <Text style={styles.placeholderText}>🎨</Text>
                  </View>
                  {item.isExpress && (
                    <View style={styles.expressTag}>
                      <Text style={styles.expressText}>24H</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.bottomAction}
          onPress={() => setIsFavorited(!isFavorited)}
        >
          <Text style={[styles.bottomActionIcon, isFavorited && styles.activeAction]}>
            {isFavorited ? '⭐' : '☆'}
          </Text>
          <Text style={[styles.bottomActionText, isFavorited && styles.activeActionText]}>
            Favorite
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomAction}
          onPress={() => setIsWishlisted(!isWishlisted)}
        >
          <Text style={[styles.bottomActionIcon, isWishlisted && styles.activeWishlist]}>
            {isWishlisted ? '💖' : '🤍'}
          </Text>
          <Text style={[styles.bottomActionText, isWishlisted && styles.activeActionText]}>
            Wishlist
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.purchaseButton, 
            stock <= 0 && styles.soldOutButton,
            !isStockLoaded && styles.loadingButton
          ]}
          onPress={handlePurchase}
          disabled={!isStockLoaded}
        >
          <View style={styles.purchaseButtonContent}>
            {!isStockLoaded ? (
              <>
                <Text style={styles.loadingText}>Loading...</Text>
              </>
            ) : stock > 0 ? (
              <>
                <View style={styles.purchaseButtonLeft}>
                  <Text style={styles.deadlineText}>
                    {galleryItem.deadline.split(' ').slice(0, 3).join(' ')}
                  </Text>
                  <Text style={styles.stockText}>{getStockDisplay()}</Text>
                </View>
                <View style={styles.purchaseButtonDivider} />
                <Text style={styles.purchaseButtonText}>Buy Now</Text>
              </>
            ) : (
              <>
                <View style={styles.purchaseButtonLeft}>
                  <Text style={styles.deadlineText}>Notify when restocked</Text>
                  <Text style={styles.stockText}>Out of Stock</Text>
                </View>
                <View style={styles.purchaseButtonDivider} />
                <Text style={styles.purchaseButtonText}>🔔 Notify Me</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Fixed header
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    ...AppStyles.header,
    backgroundColor: Colors.background,
    ...Layout.borderBottom,
    zIndex: 1000,
  },
  floatingMoreButton: {
    position: 'absolute',
    top: 50,
    right: Layout.spacing.xl,
    zIndex: 999,
  },
  backButton: {
    fontSize: 24,
    color: Colors.text,
  },
  headerTabs: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: Layout.spacing.xl,
    paddingRight: Layout.spacing.md,
  },
  headerTabButton: {
    paddingVertical: Layout.spacing.xs,
  },
  headerTab: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  activeHeaderTab: {
    color: Colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: Layout.spacing.xs,
  },
  moreButtonContainer: {
    width: 30,
    alignItems: 'center',
  },
  moreButton: {
    fontSize: 24,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  imageGallery: {
    height: width,
    position: 'relative',
    backgroundColor: Colors.background,
  },
  imageContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  galleryImage: {
    width: width,
    height: width,
  },
  imageIndicators: {
    position: 'absolute',
    top: Layout.spacing.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.blackTransparent,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: Layout.radius.xs,
    backgroundColor: Colors.whiteTransparent,
    marginHorizontal: Layout.spacing.xs,
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
  },
  
  // Stock alerts
  stockAlert: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: Colors.warning,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
  },
  stockAlertText: {
    color: Colors.text,
    ...Typography.bodySmall,
    fontWeight: 'bold',
  },
  soldOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    ...Layout.columnCenter,
  },
  soldOutText: {
    color: Colors.error,
    fontSize: 32,
    fontWeight: 'bold',
    transform: [{ rotate: '-15deg' }],
  },

  basicInfoBox: {
    backgroundColor: Colors.background,
    padding: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },
  priceRow: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.md,
  },
  price: {
    ...Typography.price,
    fontSize: 28,
  },
  soldCount: {
    ...Typography.bodySmallMuted,
  },
  titleRow: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.md,
  },
  title: {
    ...Typography.h4,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  categoryTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.lg,
  },
  categoryText: {
    ...Typography.badge,
  },
  deadline: {
    ...Typography.bodySmallMuted,
    marginBottom: Layout.spacing.sm,
  },
  
  // Enhanced stock display
  stockRow: {
    ...Layout.rowSpaceBetween,
  },
  stockLabel: {
    ...Typography.bodySmallMuted,
  },
  stockText: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
  },

  artistBox: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },
  artistCard: {
    padding: Layout.spacing.lg,
  },
  artistInfo: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
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
  ratingRow: {
    ...Layout.row,
  },
  rating: {
    ...Typography.rating,
    marginRight: Layout.spacing.sm,
  },
  reviewCount: {
    ...Typography.bodySmallMuted,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  artistStats: {
    ...Layout.row,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...Typography.h5,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },
  detailsBox: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.xl,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
  },
  detailSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  contentSection: {
    backgroundColor: '#1A2A3A',
  },
  preferredSection: {
    backgroundColor: '#2A3A2A',
  },
  notAcceptedSection: {
    backgroundColor: '#3A2A1A',
  },
  acceptsTextSection: {
    backgroundColor: '#1A2A3A',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  detailSectionContent: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  galleryImagesSection: {
    marginBottom: Layout.spacing.lg,
  },
  galleryImagesTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
  },
  verticalImageContainer: {
    width: '100%',
    height: 200,
    marginBottom: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  verticalGalleryImage: {
    width: '100%',
    height: '100%',
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  detailDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginTop: 16,
  },
  specificationsBox: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.xl,
  },
  specTable: {
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    overflow: 'hidden',
  },
  specRow: {
    ...Layout.rowSpaceBetween,
    padding: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  specLabel: {
    ...Typography.bodySmallMuted,
    flex: 1,
  },
  specValue: {
    ...Typography.bodySmall,
    flex: 2,
    textAlign: 'right',
  },
  milestonesBox: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.xl,
  },
  milestonesDescription: {
    ...Typography.bodyMuted,
    lineHeight: 20,
    marginBottom: Layout.spacing.xl,
  },
  milestoneSlider: {
    alignItems: 'center',
  },
  sliderTrack: {
    width: 200,
    height: 4,
    backgroundColor: Colors.card,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  sliderProgress: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sliderPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  sliderPointActive: {
    backgroundColor: Colors.primary,
  },
  milestoneLabels: {
    ...Layout.row,
    justifyContent: 'space-between',
    width: 200,
    marginTop: Layout.spacing.md,
  },
  milestoneLabel: {
    ...Typography.caption,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  reviewsBox: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.xl,
  },
  reviewsHeader: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.lg,
  },
  reviewItem: {
    ...Layout.row,
    marginBottom: Layout.spacing.lg,
  },
  reviewAvatar: {
    ...Layout.avatar,
    marginRight: Layout.spacing.md,
  },
  reviewContent: {
    flex: 1,
  },
  reviewUserName: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  reviewStars: {
    ...Layout.row,
    marginBottom: Layout.spacing.sm,
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  reviewComment: {
    ...Typography.body,
    lineHeight: 20,
  },
  viewAllReviews: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  viewAllReviewsText: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  recommendedBox: {
    ...Layout.card,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.xl,
  },
  recommendedTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  recommendedGrid: {
    ...Layout.row,
    justifyContent: 'space-between',
  },
  recommendedItem: {
    width: '48%',
    position: 'relative',
  },
  recommendedImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },
  recommendedPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.card,
    ...Layout.columnCenter,
  },
  placeholderText: {
    fontSize: 32,
    color: Colors.textMuted,
  },
  expressTag: {
    position: 'absolute',
    top: Layout.spacing.sm,
    left: Layout.spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
  },
  expressText: {
    ...Typography.badge,
  },
  bottomPadding: {
    height: 100,
  },

  // Enhanced Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    paddingBottom: Layout.spacing.lg,
    ...Layout.borderTop,
  },
  bottomAction: {
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
    padding: Layout.spacing.xs,
  },
  bottomActionIcon: {
    fontSize: 18,
    marginBottom: 2,
    color: Colors.textMuted,
  },
  activeAction: {
    color: Colors.rating,
  },
  activeWishlist: {
    color: '#FF6B9D',
  },
  bottomActionText: {
    ...Typography.caption,
  },
  activeActionText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    alignItems: 'center',
  },
  soldOutButton: {
    backgroundColor: Colors.textMuted,
  },
  loadingButton: {
    backgroundColor: Colors.card,
  },
  purchaseButtonContent: {
    ...Layout.rowSpaceBetween,
    width: '100%',
  },
  purchaseButtonLeft: {
    alignItems: 'flex-start',
  },
  deadlineText: {
    color: Colors.text,
    fontSize: 10,
    opacity: 0.9,
    marginBottom: 2,
  },
  purchaseButtonDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.whiteTransparent,
    marginHorizontal: Layout.spacing.md,
  },
  purchaseButtonText: {
    ...Typography.button,
    fontSize: 13,
  },
  loadingText: {
    ...Typography.body,
    fontWeight: 'bold',
  },
});

export default GalleryDetailPage;