// app/components/common/GalleryCard.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface GalleryCardProps {
  id: string | number;
  title: string;
  price: number;
  sold?: number;
  artistName: string;
  artistAvatar: string;
  image: string;
  isExpress?: boolean;
  category?: string;
  onPress?: () => void;
  onLike?: (id: string | number, isLiked: boolean) => void;
  isLiked?: boolean;
  style?: any;
  showLikeButton?: boolean;
  showArtistInfo?: boolean;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  title,
  price,
  sold,
  artistName,
  artistAvatar,
  image,
  isExpress = false,
  category,
  onPress,
  onLike,
  isLiked = false,
  style,
  showLikeButton = false,
  showArtistInfo = true
}) => {
  const [liked, setLiked] = useState(isLiked);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/gallery-detail',
        params: { 
          galleryId: id,
          title: title,
          price: price,
          artistName: artistName,
          artistAvatar: artistAvatar,
          image: image,
          sold: sold,
          category: category,
          isExpress: isExpress
        }
      });
    }
  };

  const handleLike = (e: any) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    if (onLike) {
      onLike(id, newLikedState);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.galleryItem, style]}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.galleryImage} />
        
        {isExpress && (
          <View style={styles.expressTag}>
            <Text style={styles.expressText}>24H</Text>
          </View>
        )}
        
        {showArtistInfo && (
          <View style={styles.artistInfo}>
            <Image source={{ uri: artistAvatar }} style={styles.artistAvatar} />
            <Text style={styles.artistName}>{artistName}</Text>
          </View>
        )}

        {showLikeButton && (
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={handleLike}
          >
            <Text style={[styles.likeIcon, liked && styles.likedIcon]}>
              {liked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{title}</Text>
        
        {category && (
          <Text style={styles.category}>{category}</Text>
        )}
        
        <View style={styles.priceInfo}>
          <Text style={styles.price}>${price}</Text>
          {sold !== undefined && (
            <Text style={styles.soldCount}>Sold {sold}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  galleryItem: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#333',
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
  artistInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 18,
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 18,
  },
  category: {
    color: '#00A8FF',
    fontSize: 12,
    marginBottom: 8,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  soldCount: {
    color: '#888',
    fontSize: 12,
  },
});

export default GalleryCard;