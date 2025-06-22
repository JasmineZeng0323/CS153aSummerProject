// project-detail.tsx - 具体企划详情页面（工作版）
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

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
        <Image source={{ uri: artist.avatar }} style={styles.artistAvatar} />
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
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedText}>✓ Selected</Text>
            </View>
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
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🎨</Text>
                <Text style={styles.emptyStateTitle}>No artists have applied yet</Text>
                <Text style={styles.emptyStateText}>
                  Improve your project rating to get better quality applications!
                </Text>
                <View style={styles.ratingDisplay}>
                  <Text style={styles.ratingLabel}>Project Rating</Text>
                  <Text style={styles.ratingScore}>45</Text>
                </View>
                <TouchableOpacity style={styles.ratingButton}>
                  <Text style={styles.ratingButtonText}>View Rating Details</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      
      case 'Invited':
        return (
          <View style={styles.tabContent}>
            {invitedArtists.length > 0 ? (
              invitedArtists.map(artist => renderArtistCard(artist))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📧</Text>
                <Text style={styles.emptyStateTitle}>You haven't invited any artists yet</Text>
                <Text style={styles.emptyStateText}>
                  You can send invitations to artists to join this project
                </Text>
                <TouchableOpacity style={styles.inviteButton} onPress={handleInviteArtist}>
                  <Text style={styles.inviteButtonText}>Invite Artists Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      
      case 'Selected':
        return (
          <View style={styles.tabContent}>
            {selectedArtists.length > 0 ? (
              selectedArtists.map(artist => renderArtistCard(artist, false, true))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>✅</Text>
                <Text style={styles.emptyStateTitle}>No artists selected yet</Text>
                <Text style={styles.emptyStateText}>
                  Review applications and select artists to work on your project
                </Text>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
        <TouchableOpacity style={styles.toggleButton}>
          <Text style={styles.toggleIcon}>⚪</Text>
          <Text style={styles.toggleText}>Recruiting Closed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  toggleIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  toggleText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },

  // Project Detail Styles
  projectInfoCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  projectMeta: {
    fontSize: 14,
    color: '#888',
  },
  tipCard: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  tipCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipCloseIcon: {
    fontSize: 16,
    color: '#888',
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 30,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A8FF',
    marginBottom: 4,
  },
  tipSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  
  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#00A8FF',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabButtonText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },

  // Tab Content
  tabContent: {
    paddingHorizontal: 20,
  },
  
  // Artist Card
  artistCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  artistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  artistRating: {
    fontSize: 12,
    color: '#FFD700',
  },
  artistProjects: {
    fontSize: 12,
    color: '#888',
  },
  artistResponse: {
    fontSize: 12,
    color: '#888',
  },
  artistTime: {
    fontSize: 11,
    color: '#666',
  },
  artistPortfolio: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  artistActions: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  selectButton: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deselectButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deselectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ratingDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  ratingScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00A8FF',
  },
  ratingButton: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ratingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inviteButton: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProjectDetailPage;