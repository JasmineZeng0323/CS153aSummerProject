import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from './components/styles/Colors';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ArtworkDetailPage = () => {
  const params = useLocalSearchParams();
  const { artworkId, title, artist, image, likes, isLiked } = params;

  const [liked, setLiked] = useState(isLiked === 'true');
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes as string) || 0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    StatusBar.setBackgroundColor(Colors.background, true);
    
    return () => {
      StatusBar.setBarStyle('default', true);
    };
  }, []);

  // Mock artist data
  const artistData = {
    name: artist || 'Artist Name',
    avatar: 'https://i.pravatar.cc/60?img=1',
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.back();
    }, 50);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleArtistPress = () => {
    router.push({
      pathname: '/artist-detail',
      params: {
        artistId: 1,
        artistName: artistData.name,
        artistAvatar: artistData.avatar
      }
    });
  };

  if (!isVisible) {
    return <View style={styles.container} />;
  }

  const renderFloatingHeader = () => (
    <View style={styles.floatingHeader}>
      <TouchableOpacity onPress={handleBack} style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>←</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => {
          Alert.alert(
            'Share Artwork',
            'How would you like to share this artwork?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Copy Link', 
                onPress: () => {
                  console.log('Artwork link copied');
                  Alert.alert('Success', 'Artwork link copied to clipboard');
                }
              },
              { 
                text: 'Save Image', 
                onPress: () => {
                  console.log('Saving artwork image');
                  Alert.alert('Success', 'Artwork saved to gallery');
                }
              },
              { 
                text: 'Share to Social', 
                onPress: () => {
                  console.log('Sharing to social media');
                  Alert.alert('Share', 'Opening social media...');
                }
              }
            ]
          );
        }}
      >
        <Text style={styles.floatingButtonText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLikeButton = () => (
    <View style={styles.likeContainer}>
      <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
        <Text style={styles.likeIcon}>
          {liked ? '❤️' : '🤍'}
        </Text>
        <Text style={styles.likeCountText}>{likeCount}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderArtistInfo = () => (
    <View style={styles.bottomContainer}>
      <TouchableOpacity style={styles.artistContainer} onPress={handleArtistPress}>
        <Image source={{ uri: artistData.avatar }} style={styles.artistAvatar} />
        <View style={styles.artistDetails}>
          <Text style={styles.artistName}>{artistData.name}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.followButton,
          isFollowing && styles.followingButton
        ]}
        onPress={handleFollow}
      >
        <Text style={[
          styles.followButtonText,
          isFollowing && styles.followingButtonText
        ]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {renderFloatingHeader()}

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

      {renderLikeButton()}

      {renderArtistInfo()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  floatingHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    ...Layout.rowSpaceBetween,
    paddingHorizontal: Layout.spacing.xl,
    zIndex: 1000,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.round,
    backgroundColor: Colors.blackTransparent,
    ...Layout.columnCenter,
  },
  floatingButtonText: {
    ...Typography.h4,
    color: Colors.text,
  },

  scrollContainer: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 120,
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
    ...Layout.columnCenter,
    paddingHorizontal: Layout.spacing.xl,
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
    right: Layout.spacing.xl,
    zIndex: 999,
  },
  likeButton: {
    ...Layout.columnCenter,
    backgroundColor: Colors.blackTransparent,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 15,
    minWidth: 60,
  },
  likeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  likeCountText: {
    ...Typography.badge,
    color: Colors.text,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.blackTransparent,
    ...Layout.rowSpaceBetween,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.xl,
    paddingBottom: 35,
  },
  artistContainer: {
    ...Layout.row,
    flex: 1,
  },
  artistAvatar: {
    ...Layout.avatarLarge,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.text,
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    ...Typography.h5,
    color: Colors.text,
  },

  followButton: {
    backgroundColor: Colors.whiteTransparent,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    borderWidth: 1,
    borderColor: Colors.whiteTransparent,
  },
  followingButton: {
    backgroundColor: 'rgba(0,168,255,0.2)',
    borderColor: Colors.primary,
  },
  followButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  followingButtonText: {
    color: Colors.primary,
  },
});

export default ArtworkDetailPage;