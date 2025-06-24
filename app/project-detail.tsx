// project-detail.tsx - Enhanced with Artist Application Feature
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [isRecruiting, setIsRecruiting] = useState(true);
  
  // 🎯 NEW: Artist application states
  const [isArtistMode, setIsArtistMode] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedTimeline: '',
    portfolioLinks: '',
    rate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [selectedArtists, setSelectedArtists] = useState([]);

  // 🎯 NEW: Load user mode and application status
  useEffect(() => {
    loadUserMode();
    checkApplicationStatus();
  }, [projectId]);

  const loadUserMode = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const savedMode = await AsyncStorage.getItem('isArtistMode');
      
      if (userInfoString) {
        const userData = JSON.parse(userInfoString);
        const artistMode = savedMode === 'true' && userData.isArtist;
        setIsArtistMode(artistMode);
      }
    } catch (error) {
      console.error('Error loading user mode:', error);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const appliedProjectsData = await AsyncStorage.getItem('appliedProjects');
      if (appliedProjectsData) {
        const appliedProjects = JSON.parse(appliedProjectsData);
        const hasAppliedToThisProject = appliedProjects.some(
          (project: any) => project.id.toString() === projectId
        );
        setHasApplied(hasAppliedToThisProject);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  // 🎯 NEW: Handle artist application
  const handleApplyProject = () => {
    if (!isArtistMode) {
      Alert.alert(
        'Artist Mode Required',
        'Switch to Artist Mode to apply for projects.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Switch Mode', onPress: () => router.push('/profile') }
        ]
      );
      return;
    }

    if (hasApplied) {
      Alert.alert(
        'Already Applied',
        'You have already applied for this project. Check your application status in your profile.',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    if (!applicationData.coverLetter.trim()) {
      Alert.alert('Missing Information', 'Please write a cover letter explaining why you\'re interested in this project.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save application to local storage
      const newApplication = {
        id: parseInt(projectId as string),
        title: title,
        status: 'pending',
        appliedAt: new Date().toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        budget: budget,
        clientName: 'Project Client',
        coverLetter: applicationData.coverLetter,
        proposedTimeline: applicationData.proposedTimeline,
        portfolioLinks: applicationData.portfolioLinks,
        rate: applicationData.rate
      };

      // Update applied projects
      const existingApplications = await AsyncStorage.getItem('appliedProjects');
      const applications = existingApplications ? JSON.parse(existingApplications) : [];
      applications.push(newApplication);
      await AsyncStorage.setItem('appliedProjects', JSON.stringify(applications));

      // Update applicant count (simulate)
      setApplicantArtists(prev => [...prev, {
        id: Date.now(),
        name: 'You',
        avatar: 'https://i.pravatar.cc/60?img=10',
        rating: 4.9,
        completedProjects: 50,
        responseTime: '1h',
        appliedAt: new Date().toLocaleString(),
        portfolio: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
        isSelected: false
      }]);

      setHasApplied(true);
      setShowApplicationModal(false);

      Alert.alert(
        'Application Submitted! 🎉',
        'Your application has been sent to the client. You can track the status in your profile under "Applied Projects".',
        [
          {
            text: 'View My Applications',
            onPress: () => router.push('/applied-projects')
          },
          { text: 'OK' }
        ]
      );

    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎯 NEW: Application Modal Component
  const ApplicationModal = () => (
    <Modal
      visible={showApplicationModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowApplicationModal(false)}
    >
      <View style={styles.applicationModalOverlay}>
        <View style={styles.applicationModalContent}>
          {/* Header */}
          <View style={styles.applicationModalHeader}>
            <Text style={styles.applicationModalTitle}>Apply for Project</Text>
            <TouchableOpacity 
              onPress={() => setShowApplicationModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.applicationForm} showsVerticalScrollIndicator={false}>
            {/* Project Info Summary */}
            <View style={styles.projectSummary}>
              <Text style={styles.projectSummaryTitle}>{title}</Text>
              <Text style={styles.projectSummaryMeta}>Budget: {budget} • Deadline: {deadline}</Text>
            </View>

            {/* Cover Letter */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Cover Letter *</Text>
              <Text style={styles.formHint}>Explain why you're perfect for this project</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={applicationData.coverLetter}
                onChangeText={(text) => setApplicationData(prev => ({ ...prev, coverLetter: text }))}
                placeholder="Dear client, I'm excited about this project because..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={6}
                maxLength={500}
              />
              <Text style={styles.characterCount}>{applicationData.coverLetter.length}/500</Text>
            </View>

            {/* Proposed Timeline */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Proposed Timeline</Text>
              <TextInput
                style={styles.textInput}
                value={applicationData.proposedTimeline}
                onChangeText={(text) => setApplicationData(prev => ({ ...prev, proposedTimeline: text }))}
                placeholder="e.g., 5-7 days for completion"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            {/* Your Rate */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Your Rate (Optional)</Text>
              <Text style={styles.formHint}>Specify your rate if different from budget</Text>
              <View style={styles.rateInputContainer}>
                <Text style={styles.rateSymbol}>$</Text>
                <TextInput
                  style={styles.rateInput}
                  value={applicationData.rate}
                  onChangeText={(text) => setApplicationData(prev => ({ ...prev, rate: text.replace(/[^0-9]/g, '') }))}
                  placeholder="250"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Portfolio Links */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Relevant Portfolio Links</Text>
              <Text style={styles.formHint}>Share links to similar work</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={applicationData.portfolioLinks}
                onChangeText={(text) => setApplicationData(prev => ({ ...prev, portfolioLinks: text }))}
                placeholder="https://your-portfolio.com/project1&#10;https://instagram.com/your-art"
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Application Tips */}
            <View style={styles.applicationTips}>
              <Text style={styles.tipsTitle}>💡 Application Tips</Text>
              <Text style={styles.tipsText}>
                • Be specific about your experience with similar projects{'\n'}
                • Include relevant portfolio samples{'\n'}
                • Mention your understanding of the project requirements{'\n'}
                • Be professional and enthusiastic
              </Text>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.applicationModalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowApplicationModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!applicationData.coverLetter.trim() || isSubmitting) && styles.disabledButton
              ]}
              onPress={submitApplication}
              disabled={!applicationData.coverLetter.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>Submitting...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // 招募状态管理
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
    const artist = applicantArtists.find(a => a.id === artistId);
    
    setApplicantArtists(prev => 
      prev.map(artist => 
        artist.id === artistId 
          ? { ...artist, isSelected: !artist.isSelected }
          : artist
      )
    );

    setSelectedArtists(prev => {
      const isCurrentlySelected = prev.some(a => a.id === artistId);
      
      if (isCurrentlySelected) {
        return prev.filter(a => a.id !== artistId);
      } else {
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
    setSelectedArtists(prev => prev.filter(a => a.id !== artistId));
    
    setApplicantArtists(prev => 
      prev.map(artist => 
        artist.id === artistId 
          ? { ...artist, isSelected: false }
          : artist
      )
    );
  };

  const handleInviteArtist = () => {
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
      {/* Header with unified padding */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
        
        {/* 🎯 NEW: Show Apply/Applied button for artists, or recruiting toggle for clients */}
        {isArtistMode ? (
          <TouchableOpacity 
            style={[
              styles.applyButton,
              hasApplied && styles.appliedButton
            ]}
            onPress={handleApplyProject}
            disabled={hasApplied}
          >
            <Text style={[
              styles.applyButtonText,
              hasApplied && styles.appliedButtonText
            ]}>
              {hasApplied ? '✓ Applied' : 'Apply'}
            </Text>
          </TouchableOpacity>
        ) : (
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
              {isRecruiting ? 'Recruiting' : 'Closed'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 招募状态提示 */}
        {!isRecruiting && !isArtistMode && (
          <View style={styles.recruitingClosedBanner}>
            <Text style={styles.bannerIcon}>🚫</Text>
            <Text style={styles.bannerText}>
              This project is no longer accepting new applications. Artists cannot see this project in the project list.
            </Text>
          </View>
        )}

        {/* 🎯 NEW: Project not available message for artists */}
        {!isRecruiting && isArtistMode && (
          <View style={styles.projectUnavailableBanner}>
            <Text style={styles.bannerIcon}>⏰</Text>
            <Text style={styles.bannerText}>
              This project is no longer accepting applications. The client has closed recruitment.
            </Text>
          </View>
        )}

        {/* Project Info */}
        <View style={styles.projectInfoCard}>
          <Text style={styles.projectTitle}>{title}</Text>
          <Text style={styles.projectMeta}>
            Deadline: {deadline} • 39 days left
          </Text>
          
          {/* 🎯 NEW: Show project description for artists */}
          {isArtistMode && description && (
            <View style={styles.projectDescription}>
              <Text style={styles.descriptionTitle}>Project Description</Text>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          )}
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
                <Text style={styles.tipTitle}>
                  {isArtistMode 
                    ? 'Ready to apply for this project?' 
                    : 'First time commissioning? Not sure about the process?'
                  }
                </Text>
                <Text style={styles.tipSubtitle}>
                  {isArtistMode 
                    ? 'Make sure to read the requirements carefully and showcase relevant work'
                    : 'Click to view MiPainter commission process guide'
                  }
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 🎯 NEW: Different content based on user mode */}
        {isArtistMode ? (
          // Artist view - show project requirements and application status
          <View style={styles.artistProjectView}>
            <Text style={styles.sectionTitle}>Project Requirements</Text>
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Budget Range:</Text>
                <Text style={styles.requirementValue}>{budget}</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Category:</Text>
                <Text style={styles.requirementValue}>{category}</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Deadline:</Text>
                <Text style={styles.requirementValue}>{deadline}</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Applications:</Text>
                <Text style={styles.requirementValue}>{applicantCount} artists applied</Text>
              </View>
            </View>

            {hasApplied && (
              <View style={styles.applicationStatusCard}>
                <StatusBadge status="pending" text="Application Pending" size="small" />
                <Text style={styles.applicationStatusText}>
                  Your application is under review. You'll be notified of any updates.
                </Text>
                <TouchableOpacity 
                  style={styles.viewApplicationButton}
                  onPress={() => router.push('/applied-projects')}
                >
                  <Text style={styles.viewApplicationButtonText}>View My Applications</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          // Client view - show applicant management tabs
          <>
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
          </>
        )}

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>

      {/* 🎯 NEW: Application Modal */}
      <ApplicationModal />
    </View>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 50,
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

  // 🎯 NEW: Apply Button Styles
  applyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    minWidth: 80,
    alignItems: 'center',
  },
  appliedButton: {
    backgroundColor: Colors.success,
  },
  applyButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
    fontWeight: 'bold',
  },
  appliedButtonText: {
    color: Colors.text,
  },

  // 招募状态切换按钮
  recruitingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
    position: 'relative',
    minWidth: 100,
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

  content: {
    flex: 1,
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
  
  // 🎯 NEW: Project unavailable banner for artists
  projectUnavailableBanner: {
    backgroundColor: Colors.error,
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
  
  // 🎯 NEW: Project Description for Artists
  projectDescription: {
    marginTop: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  descriptionTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
  },
  descriptionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
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

  // 🎯 NEW: Artist Project View
  artistProjectView: {
    ...Layout.paddingHorizontal,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
  },
  requirementsList: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  requirementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  requirementLabel: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  requirementValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  
  // 🎯 NEW: Application Status Card
  applicationStatusCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  applicationStatusText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: Layout.spacing.md,
    lineHeight: 20,
  },
  viewApplicationButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
  },
  viewApplicationButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
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

  // 🎯 NEW: Application Modal Styles
  applicationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  applicationModalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    maxHeight: '85%',
  },
  applicationModalHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    padding: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  applicationModalTitle: {
    ...Typography.h5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.textMuted,
    fontSize: 18,
    fontWeight: 'bold',
  },
  applicationForm: {
    flex: 1,
    padding: Layout.spacing.xl,
  },
  projectSummary: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  projectSummaryTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  projectSummaryMeta: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  formSection: {
    marginBottom: Layout.spacing.xl,
  },
  formLabel: {
    ...Typography.label,
    marginBottom: Layout.spacing.sm,
  },
  formHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.md,
  },
  textInput: {
    ...Layout.input,
    ...Typography.body,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: Layout.spacing.xs,
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Layout.spacing.lg,
  },
  rateSymbol: {
    ...Typography.h5,
    color: Colors.primary,
    marginRight: Layout.spacing.sm,
  },
  rateInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Layout.spacing.lg,
  },
  applicationTips: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  tipsTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
  },
  tipsText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  applicationModalActions: {
    flexDirection: 'row',
    padding: Layout.spacing.xl,
    gap: Layout.spacing.md,
    ...Layout.borderTop,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.textMuted,
  },
  submitButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.card,
    opacity: 0.5,
  },
  submitButtonText: {
    ...Typography.button,
  },
});

export default ProjectDetailPage;