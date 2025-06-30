//app/components/common/ArtistCard.tsx
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface ArtistCardProps {
  id: string | number;
  name: string;
  username?: string;
  secondaryUsername?: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  artworks: string[];
  isVerified?: boolean;
  onPress?: () => void;
  style?: any;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  id,
  name,
  username,
  secondaryUsername,
  rating,
  reviewCount,
  avatar,
  artworks,
  isVerified = false,
  onPress,
  style
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/artist-detail',
        params: {
          artistId: id,
          artistName: name,
          artistAvatar: avatar
        }
      });
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.artistCard, style]}
      onPress={handlePress}
    >
      <View style={styles.artistHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.artistAvatar} />
          {isVerified && (
            <View style={styles.verificationBadge}>
              <Text style={styles.verificationBadgeText}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.artistInfo}>
          <View style={styles.artistNameContainer}>
            <Text style={styles.artistName}>{name}</Text>
            <View style={styles.tagContainer}>
              {username && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{username}</Text>
                </View>
              )}
              {secondaryUsername && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{secondaryUsername}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐{rating}</Text>
            <Text style={styles.reviewCount}>{reviewCount} Reviews</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.artworkGrid}>
        {artworks.slice(0, 3).map((artwork, index) => (
          <View key={index} style={styles.artworkContainer}>
            <Image source={{ uri: artwork }} style={styles.artworkImage} />
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  artistCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  artistHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  verificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  artistInfo: {
    flex: 1,
  },
  artistNameContainer: {
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  artworkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  artworkContainer: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
});

export default ArtistCard;