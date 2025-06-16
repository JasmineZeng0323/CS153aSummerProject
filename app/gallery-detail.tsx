import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const GalleryDetailPage = () => {
  // 接收从homepage传递的参数
  const params = useLocalSearchParams();
  const { galleryId, title, price, artistName } = params;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeSection, setActiveSection] = useState('Gallery');
  const [showNavigation, setShowNavigation] = useState(false);
  const [stock, setStock] = useState(2); // 可变库存用于测试
  
  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Mock data for the gallery item (可以根据传递的参数动态修改)
  const galleryItem = {
    id: galleryId || 1,
    title: title || 'Anime Style Portrait with Glasses',
    price: price || 89,
    sold: 13,
    category: 'Half Body',
    deadline: '2 days after artist accepts order',
    stock: `1/${stock}`,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
    ],
    artist: {
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
      // 添加图片展示数据
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

  // 添加各部分的ref引用
  const galleryRef = useRef<View>(null);
  const detailsRef = useRef<View>(null);
  const reviewsRef = useRef<View>(null);
  const recommendedRef = useRef<View>(null);

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
    if (stock <= 0) {
      alert('This gallery is sold out. Please wait for the artist to restock.');
      return;
    }

    // 跳转到支付页面，传递必要的参数
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
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    let offset = 0;
    
    switch (section) {
      case 'Gallery':
        offset = 0;
        break;
      case 'Details':
        // 跳转到Gallery Details部分
        offset = width + 450; // 图片高度 + 基本信息 + 画师信息
        break;
      case 'Reviews':
        // 跳转到Gallery Reviews部分
        offset = width + 1200;
        break;
      case 'Recommended':
        // 跳转到推荐部分
        offset = width + 1600;
        break;
    }
    
    scrollViewRef.current?.scrollTo({ y: offset, animated: true });
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header - Only show when scrolled */}
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

      {/* Floating More Button - Only show when header is hidden */}
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
        <View ref={galleryRef} style={styles.imageGallery}>
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
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfoBox}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>¥{galleryItem.price}</Text>
            <Text style={styles.soldCount}>Sold {galleryItem.sold}</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{galleryItem.title}</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{galleryItem.category}</Text>
            </View>
          </View>
          <Text style={styles.deadline}>⏱ Deadline: {galleryItem.deadline}</Text>
        </View>

        {/* Artist Info Box */}
        <View style={styles.artistBox}>
          <TouchableOpacity style={styles.artistCard}>
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

        {/* Gallery Details Box - 按照要求分成三个部分 */}
        <View ref={detailsRef} style={styles.detailsBox}>
          <Text style={styles.sectionTitle}>Gallery Details</Text>
          
          {/* 第一部分：Content */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>🎨 Content</Text>
            <Text style={styles.detailSectionContent}>{galleryItem.details.content}</Text>
          </View>

          {/* 第二部分：Preferred Types */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>❤️ Preferred Types</Text>
            <Text style={styles.detailSectionContent}>{galleryItem.details.preferredTypes}</Text>
          </View>

          {/* 第三部分：Not Accepted Types */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>🚫 Not Accepted Types</Text>
            <Text style={styles.detailSectionContent}>{galleryItem.details.notAcceptedTypes}</Text>
          </View>

          {/* 图片展示区域 - 大图展示 */}
          <View style={styles.galleryImagesSection}>
            <Text style={styles.galleryImagesTitle}>Gallery Preview</Text>
            <View style={styles.largeImageContainer}>
              <Image 
                source={{ uri: galleryItem.details.galleryImages[0] }} 
                style={styles.largeGalleryImage} 
                resizeMode="contain"
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryImagesScroll}>
              {galleryItem.details.galleryImages.map((image, index) => (
                <TouchableOpacity key={index} style={styles.galleryImageItem}>
                  <Image source={{ uri: image }} style={styles.galleryImagePreview} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailIcon}>📝</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Accepts Text Design</Text>
              <Text style={styles.detailValue}>{galleryItem.details.acceptsTextDesign ? '✓' : '✗'}</Text>
            </View>
          </View>

          <Text style={styles.detailDescription}>{galleryItem.details.description}</Text>
        </View>

        {/* Specifications Box - 添加更多参数 */}
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
        <View ref={reviewsRef} style={styles.reviewsBox}>
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
        <View ref={recommendedRef} style={styles.recommendedBox}>
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

      {/* Fixed Bottom Bar - 修改样式参考图片 */}
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
          style={[styles.purchaseButton, stock <= 0 && styles.soldOutButton]}
          onPress={handlePurchase}
        >
          <View style={styles.purchaseButtonContent}>
            {stock > 0 ? (
              <>
                <View style={styles.purchaseButtonLeft}>
                  <Text style={styles.deadlineText}>
                    {galleryItem.deadline.split(' ').slice(0, 3).join(' ')}
                  </Text>
                  <Text style={styles.stockText}>Stock {galleryItem.stock}</Text>
                </View>
                <View style={styles.purchaseButtonDivider} />
                <Text style={styles.purchaseButtonText}>Buy Now</Text>
              </>
            ) : (
              <>
                <View style={styles.purchaseButtonLeft}>
                  <Text style={styles.deadlineText}>Sep 29 Restocked</Text>
                  <Text style={styles.stockText}>Stock 0</Text>
                </View>
                <View style={styles.purchaseButtonDivider} />
                <Text style={styles.purchaseButtonText}>🔔 Notify Me</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    zIndex: 1000,
  },
  floatingMoreButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 999,
  },
  backButton: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTabs: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  headerTab: {
    fontSize: 16,
    color: '#888',
    marginHorizontal: 16,
  },
  activeHeaderTab: {
    color: '#00A8FF',
    borderBottomWidth: 2,
    borderBottomColor: '#00A8FF',
    paddingBottom: 4,
  },
  moreButtonContainer: {
    width: 30,
    alignItems: 'center',
  },
  moreButton: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  imageGallery: {
    height: width,
    position: 'relative',
    backgroundColor: '#000',
  },
  imageContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  galleryImage: {
    width: width,
    height: width,
  },
  imageIndicators: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#00A8FF',
  },
  basicInfoBox: {
    backgroundColor: '#0A0A0A',
    padding: 20,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  soldCount: {
    fontSize: 14,
    color: '#888',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  categoryTag: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deadline: {
    fontSize: 14,
    color: '#888',
  },
  artistBox: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  artistCard: {
    padding: 16,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  chevron: {
    fontSize: 20,
    color: '#888',
  },
  artistStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  detailsBox: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  // 新增的三个区块样式
  detailSection: {
    backgroundColor: '#2A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailSectionContent: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  // 图片展示区域样式 - 修改为大图展示
  galleryImagesSection: {
    marginBottom: 16,
  },
  galleryImagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  largeImageContainer: {
    width: '100%',
    height: 250,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  largeGalleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryImagesScroll: {
    flexDirection: 'row',
  },
  galleryImageItem: {
    marginRight: 12,
  },
  galleryImagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#2A1A1A',
    padding: 12,
    borderRadius: 8,
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
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  detailDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
    marginTop: 16,
  },
  specificationsBox: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
  },
  specTable: {
    backgroundColor: '#2A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  milestonesBox: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
  },
  milestonesDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 20,
  },
  milestoneSlider: {
    alignItems: 'center',
  },
  sliderTrack: {
    width: 200,
    height: 4,
    backgroundColor: '#333',
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
    backgroundColor: '#00A8FF',
    borderRadius: 2,
  },
  sliderPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  sliderPointActive: {
    backgroundColor: '#00A8FF',
  },
  milestoneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 12,
  },
  milestoneLabel: {
    fontSize: 12,
    color: '#00A8FF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  reviewsBox: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  viewAllReviews: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllReviewsText: {
    fontSize: 14,
    color: '#00A8FF',
  },
  recommendedBox: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
  },
  recommendedTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  recommendedGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendedItem: {
    width: '48%',
    position: 'relative',
  },
  recommendedImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendedPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: '#666',
  },
  expressTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00A8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  expressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100,
  },
  // 修改后的底部栏样式 - 不透明且更紧凑
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A', // 不透明背景
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12, // 减少垂直内边距
    paddingBottom: 16, // 减少底部内边距
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  bottomAction: {
    alignItems: 'center',
    marginRight: 16, // 减少右边距
    padding: 4, // 减少内边距
  },
  bottomActionIcon: {
    fontSize: 18, // 减少图标大小
    marginBottom: 2, // 减少底边距
    color: '#888',
  },
  activeAction: {
    color: '#FFD700',
  },
  activeWishlist: {
    color: '#FF6B9D',
  },
  bottomActionText: {
    fontSize: 10, // 减少文字大小
    color: '#888',
  },
  activeActionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: '#00A8FF',
    paddingVertical: 10, // 减少垂直内边距
    paddingHorizontal: 16,
    borderRadius: 16, // 减少圆角
    alignItems: 'center',
  },
  soldOutButton: {
    backgroundColor: '#666',
  },
  purchaseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  purchaseButtonLeft: {
    alignItems: 'flex-start',
  },
  deadlineText: {
    color: '#FFFFFF',
    fontSize: 10, // 减少文字大小
    opacity: 0.9,
    marginBottom: 2,
  },
  stockText: {
    color: '#FFFFFF',
    fontSize: 12, // 减少文字大小
    fontWeight: 'bold',
  },
  purchaseButtonDivider: {
    width: 1,
    height: 20, // 减少高度
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 13, // 减少文字大小
    fontWeight: 'bold',
  },
});

export default GalleryDetailPage;