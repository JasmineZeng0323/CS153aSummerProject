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

// Import your component library
import EmptyState from './components/common/EmptyState';
import StatusBadge from './components/common/StatusBadge';
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const ProjectDetailPage = () => {
  const params = useLocalSearchParams();
  const { 
    projectId, 
    title, 
    category, 
    deadline, 
    budget, 
    status,
    applicantCount,
    invitedCount,
    selectedArtistCount,
    description 
  } = params;

  const [activeTab, setActiveTab] = useState('Applicants');
  const [showTipCard, setShowTipCard] = useState(true);
  
  // 招募状态管理
  const [isRecruiting, setIsRecruiting] = useState(true);

  // Mock data for artists
  const [applicantArtists, setApplicantArtists] = useState([
    {
      id: 1,
      name: 'ArtistOne',
      avatar: 'https://i.pravatar.cc/60?img=1',
      rating: 4.9,
      completedProjects: 156,
      responseTime: '2h',
      appliedAt: '2025-06-22 10:30',
      portfolio: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      isSelected: false
    },
    {
      id: 2,
      name: 'CreativeDesigner',
      avatar: 'https://i.pravatar.cc/60?img=2',
      rating: 5.0,
      completedProjects: 203,
      responseTime: '1h',
      appliedAt: '2025-06-22 14:15',
      portfolio: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
      isSelected: false
    },
    {
      id: 3,
      name: 'PixelMaster',
      avatar: 'https://i.pravatar.cc/60?img=3',
      rating: 4.8,
      completedProjects: 98,
      responseTime: '4h',
      appliedAt: '2025-06-23 09:20',
      portfolio: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
      isSelected: false
    }
  ]);

  const [invitedArtists] = useState([
    {
      id: 4,
      name: 'InvitedArtist',
      avatar: 'https://i.pravatar.cc/60?img=4',
      rating: 4.7,
      completedProjects: 134,
      responseTime: '3h',
      invitedAt: '2025-06-21 16:45',
      portfolio: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      hasResponded: false
    }
  ]);

  // Selected artists - dynamically updated when artists are selected
  const [selectedArtists, setSelectedArtists] = useState([]);

  // 处理招募状态切换
  const handleRecruitingToggle = () => {
    const newStatus = !isRecruiting;
    
    Alert.alert(
      'Change Recruiting Status',
      `Are you sure you want to ${newStatus ? 'open' : 'close'} recruiting for this project?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setIsRecruiting(newStatus);
            // 这里可以添加 API 调用来更新服务器上的状态
            console.log(`Project ${projectId} recruiting status changed to: ${newStatus ? 'Open' : 'Closed'}`);
          },
        },
      ]
    );
  };

  const handleArtistPress = (artistId) => {
    router.push({
      pathname: '/artist-detail',
      params: {
        artistId: artistId
      }
    });
  };

  const handleSelectArtist = (artistId) => {
    // Find the artist being selected/deselected
    const artist = applicantArtists.find(a => a.id === artistId);
    
    // Update applicant artists selection status
    setApplicantArtists(prev => 
      prev.map(artist => 
        artist.id === artistId 
          ? { ...artist, isSelected: !artist.isSelected }
          : artist
      )
    );

    // Update selected artists list
    setSelectedArtists(prev => {
      const isCurrentlySelected = prev.some(a => a.id === artistId);
      
      if (isCurrentlySelected) {
        // Remove from selected list
        return prev.filter(a => a.id !== artistId);
      } else {
        // Add to selected list with selection timestamp
        const selectedArtist = {
          ...artist,
          selectedAt: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          isSelected: true
        };
        return [...prev, selectedArtist];
      }
    });

    console.log('Select artist:', artistId);
  };

  const handleDeselectArtist = (artistId) => {
    // Remove from selected artists
    setSelectedArtists(prev => prev.filter(a => a.id !== artistId));
    
    // Update applicant status
    setApplicantArtists(prev => 
      prev.map(artist => 
        artist.id === artistId 
          ? { ...artist, isSelected: false }
          : artist
      )
    );
  };

  const handleInviteArtist = () => {
    // Navigate to artist search/invite page
    router.push('/invite-artists');
  };

  const renderArtistCard = (artist, showActions = false, isInSelectedTab = false) => (
    <TouchableOpacity 
      key={artist.id} 
      style={styles.artistCard}
      onPress={() => handleArtistPress(artist.id)}
    >
      <View style={styles.artistInfo}>
        <Image source={{ uri: artist.avatar }} style={Layout.avatar} />
        <View style={styles.artistDetails}>
          <Text style={styles.artistName}>{artist.name}</Text>
          <View style={styles.artistMeta}>
            <Text style={styles.artistRating}>⭐{artist.rating}</Text>
            <Text style={styles.artistProjects}>• {artist.completedProjects} projects</Text>
            <Text style={styles.artistResponse}>• {artist.responseTime} response</Text>
          </View>
          <Text style={styles.artistTime}>
            {artist.appliedAt && `Applied: ${artist.appliedAt}`}
            {artist.invitedAt && `Invited: ${artist.invitedAt}`}
            {artist.selectedAt && `Selected: ${artist.selectedAt}`}
          </Text>
        </View>
        <Image source={{ uri: artist.portfolio }} style={styles.artistPortfolio} />
      </View>
      
      {showActions && (
        <View style={styles.artistActions}>
          {artist.isSelected ? (
            <StatusBadge 
              status="completed" 
              text="Selected" 
              icon="✓"
              size="small"
            />
          ) : (
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={(e) => {
                e.stopPropagation();
                handleSelectArtist(artist.id);
              }}
            >
              <Text style={styles.selectButtonText}>Select Artist</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isInSelectedTab && (
        <View style={styles.artistActions}>
          <TouchableOpacity 
            style={styles.deselectButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeselectArtist(artist.id);
            }}
          >
            <Text style={styles.deselectButtonText}>Remove Selection</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Applicants':
        return (
          <View style={styles.tabContent}>
            {applicantArtists.length > 0 ? (
              applicantArtists.map(artist => renderArtistCard(artist, true))
            ) : (
              <EmptyState
                icon="🎨"
                title="No artists have applied yet"
                description="Improve your project rating to get better quality applications!"
                buttonText="View Rating Details"
                onButtonPress={() => console.log('View rating details')}
                style={styles.emptyStateWithRating}
              >
                <View style={styles.ratingDisplay}>
                  <Text style={styles.ratingLabel}>Project Rating</Text>
                  <Text style={styles.ratingScore}>45</Text>
                </View>
              </EmptyState>
            )}
          </View>
        );
      
      case 'Invited':
        return (
          <View style={styles.tabContent}>
            {invitedArtists.length > 0 ? (
              invitedArtists.map(artist => renderArtistCard(artist))
            ) : (
              <EmptyState
                icon="📧"
                title="You haven't invited any artists yet"
                description="You can send invitations to artists to join this project"
                buttonText="Invite Artists Now"
                onButtonPress={handleInviteArtist}
              />
            )}
          </View>
        );
      
      case 'Selected':
        return (
          <View style={styles.tabContent}>
            {selectedArtists.length > 0 ? (
              selectedArtists.map(artist => renderArtistCard(artist, false, true))
            ) : (
              <EmptyState
                icon="✅"
                title="No artists selected yet"
                description="Review applications and select artists to work on your project"
              />
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Header with unified padding - 手动实现以保持与其他页面一致 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
        
        {/* 招募状态切换按钮 */}
        <TouchableOpacity 
          style={[
            styles.recruitingToggle,
            { backgroundColor: isRecruiting ? Colors.success : Colors.textMuted }
          ]}
          onPress={handleRecruitingToggle}
        >
          <View style={[
            styles.toggleIndicator,
            { 
              backgroundColor: Colors.text,
              transform: [{ translateX: isRecruiting ? 0 : 14 }]
            }
          ]} />
          <Text style={[
            styles.recruitingText,
            { 
              marginLeft: isRecruiting ? 28 : 8,
              color: Colors.text
            }
          ]}>
            {isRecruiting ? 'Recruiting' : 'Recruiting Closed'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 招募状态提示 */}
        {!isRecruiting && (
          <View style={styles.recruitingClosedBanner}>
            <Text style={styles.bannerIcon}>🚫</Text>
            <Text style={styles.bannerText}>
              This project is no longer accepting new applications. Artists cannot see this project in the project list.
            </Text>
          </View>
        )}

        {/* Project Info */}
        <View style={styles.projectInfoCard}>
          <Text style={styles.projectTitle}>{title}</Text>
          <Text style={styles.projectMeta}>
            Deadline: {deadline} • 39 days left
          </Text>
        </View>

        {/* Tip Card */}
        {showTipCard && (
          <View style={styles.tipCard}>
            <TouchableOpacity 
              style={styles.tipCloseButton}
              onPress={() => setShowTipCard(false)}
            >
              <Text style={styles.tipCloseIcon}>✕</Text>
            </TouchableOpacity>
            <View style={styles.tipContent}>
              <Text style={styles.tipIcon}>🎨</Text>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>First time commissioning? Not sure about the process?</Text>
                <Text style={styles.tipSubtitle}>Click to view MiPainter commission process guide</Text>
              </View>
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {['Applicants', 'Invited', 'Selected'].map((tab) => (
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
        {renderTabContent()}

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header - 与其他页面保持完全一致
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 50, // 关键！与其他页面一致的状态栏高度
    paddingBottom: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  headerTitle: {
    ...Typography.h5,
    flex: 1,
    textAlign: 'center',
  },

  content: {
    flex: 1,
  },

  // 招募状态切换按钮
  recruitingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
    position: 'relative',
    minWidth: 140,
  },
  toggleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    left: 6,
  },
  recruitingText: {
    ...Typography.caption,
    fontWeight: '600',
  },

  // 招募关闭横幅
  recruitingClosedBanner: {
    backgroundColor: Colors.warning,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.md,
  },
  bannerText: {
    ...Typography.bodySmall,
    flex: 1,
    color: Colors.text,
    lineHeight: 18,
  },

  // Project Info Card
  projectInfoCard: {
    ...Layout.card,
    ...Layout.marginHorizontal,
    marginBottom: Layout.spacing.lg,
  },
  projectTitle: {
    ...Typography.h4,
    marginBottom: Layout.spacing.sm,
  },
  projectMeta: {
    ...Typography.bodySmallMuted,
  },

  // Tip Card
  tipCard: {
    backgroundColor: '#F5F5F5',
    ...Layout.marginHorizontal,
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    position: 'relative',
  },
  tipCloseButton: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipCloseIcon: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  tipContent: {
    ...Layout.row,
    alignItems: 'flex-start',
    paddingRight: 30,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: Layout.spacing.md,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  tipSubtitle: {
    ...Typography.bodySmall,
    color: '#666',
  },
  
  // Tab Navigation
  tabNavigation: {
    ...Layout.row,
    ...Layout.paddingHorizontal,
    marginBottom: Layout.spacing.xl,
  },
  tabButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    marginRight: Layout.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Colors.primary,
  },
  tabButtonText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  activeTabButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Tab Content
  tabContent: {
    ...Layout.paddingHorizontal,
  },
  
  // Artist Card
  artistCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.md,
  },
  artistInfo: {
    ...Layout.row,
    alignItems: 'center',
  },
  artistDetails: {
    flex: 1,
    marginHorizontal: Layout.spacing.md,
  },
  artistName: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  artistMeta: {
    ...Layout.row,
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  artistRating: {
    ...Typography.caption,
    color: Colors.rating,
  },
  artistProjects: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  artistResponse: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  artistTime: {
    fontSize: 11,
    color: Colors.textDisabled,
  },
  artistPortfolio: {
    width: 60,
    height: 60,
    borderRadius: Layout.radius.sm,
  },
  artistActions: {
    marginTop: Layout.spacing.md,
    alignItems: 'flex-end',
  },
  selectButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
  },
  selectButtonText: {
    ...Typography.buttonSmall,
  },
  deselectButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
  },
  deselectButtonText: {
    ...Typography.buttonSmall,
  },

  // Custom Empty State with Rating
  emptyStateWithRating: {
    paddingVertical: Layout.spacing.xxxl,
  },
  ratingDisplay: {
    alignItems: 'center',
    marginVertical: Layout.spacing.xl,
  },
  ratingLabel: {
    ...Typography.bodySmallMuted,
    marginBottom: Layout.spacing.sm,
  },
  ratingScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default ProjectDetailPage;