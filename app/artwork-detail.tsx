import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ArtworkDetailPage = () => {
  const params = useLocalSearchParams();
  const { artworkId, title, artist, image, likes, isLiked } = params;

  const [liked, setLiked] = useState(isLiked === 'true');
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes as string) || 0);

  // Mock artist data
  const artistData = {
    name: artist || 'Artist Name',
    avatar: 'https://i.pravatar.cc/60?img=1',
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Modal visible={true} animationType="fade" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Minimal Header - floating over image */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Image Container - 支持图片滚动查看 */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          maximumZoomScale={3.0}
          minimumZoomScale={1.0}
          bouncesZoom={true}
        >
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: image as string }} 
              style={styles.mainImage}
              resizeMode="contain"
            />
          </View>
        </ScrollView>

        {/* Like button overlay - Fixed position */}
        <View style={styles.likeContainer}>
          <TouchableOpacity style={styles.imageLikeButton} onPress={handleLike}>
            <Text style={styles.imageLikeIcon}>
              {liked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.likeCountText}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Artist Info - Fixed at bottom */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.artistContainer}
            onPress={() => {
              router.push({
                pathname: '/artist-detail',
                params: {
                  artistId: 1,
                  artistName: artistData.name,
                  artistAvatar: artistData.avatar
                }
              });
            }}
          >
            <Image source={{ uri: artistData.avatar }} style={styles.artistAvatar} />
            <View style={styles.artistDetails}>
              <Text style={styles.artistName}>{artistData.name}</Text>
            </View>
          </TouchableOpacity>

          {/* Follow Button */}
          <TouchableOpacity 
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollow}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 100, // 顶部按钮空间
    paddingBottom: 120, // 底部信息空间
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: screenHeight - 220,
  },
  imageWrapper: {
    width: screenWidth,
    minHeight: screenHeight - 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainImage: {
    width: screenWidth - 40,
    height: screenHeight - 220,
    maxWidth: screenWidth - 40,
    maxHeight: screenHeight - 220,
  },
  likeContainer: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    zIndex: 999,
  },
  imageLikeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 15,
    minWidth: 60,
  },
  imageLikeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  likeCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(15px)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 35,
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  followButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  followingButton: {
    backgroundColor: 'rgba(0,168,255,0.2)',
    borderColor: '#00A8FF',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#00A8FF',
  },
});

export default ArtworkDetailPage;