// applied-projects.tsx - Manage Artist Applications
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Import components
import EmptyState from './components/common/EmptyState';
import Header from './components/common/Header';
import LoadingState from './components/common/LoadingState';
import StatusBadge from './components/common/StatusBadge';
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0, 
  },
  header: {
    paddingTop: 50, 
  },
};

interface AppliedProject {
  id: number;
  title: string;
  status: 'pending' | 'selected' | 'rejected' | 'completed' | 'in_progress';
  appliedAt: string;
  budget: string;
  clientName: string;
  coverLetter?: string;
  proposedTimeline?: string;
  portfolioLinks?: string;
  rate?: string;
  updatedAt?: string;
  feedback?: string;
}

const AppliedProjectsPage = () => {
  const [appliedProjects, setAppliedProjects] = useState<AppliedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Load applied projects when page focuses
  useFocusEffect(
    useCallback(() => {
      loadAppliedProjects();
    }, [])
  );

  const loadAppliedProjects = async () => {
    try {
      setIsLoading(true);
      
      const appliedProjectsData = await AsyncStorage.getItem('appliedProjects');
      if (appliedProjectsData) {
        const projects = JSON.parse(appliedProjectsData);
        setAppliedProjects(projects);
      } else {
        // Mock data for demonstration
        const mockProjects: AppliedProject[] = [
          {
            id: 1,
            title: 'Character Design Commission',
            status: 'pending',
            appliedAt: '2025-06-22 10:30',
            budget: '$200-500',
            clientName: 'Anonymous Client',
            coverLetter: 'I\'m very interested in this character design project...',
            proposedTimeline: '5-7 days',
            rate: '350'
          },
          {
            id: 2,
            title: 'Anime Portrait Project',
            status: 'selected',
            appliedAt: '2025-06-20 14:15',
            budget: '$150-300',
            clientName: 'Art Lover',
            coverLetter: 'I have extensive experience with anime portraits...',
            proposedTimeline: '3-5 days',
            rate: '200',
            updatedAt: '2025-06-21 09:30',
            feedback: 'We love your portfolio! Please proceed with the project.'
          },
          {
            id: 3,
            title: 'Logo Design for Startup',
            status: 'rejected',
            appliedAt: '2025-06-18 09:20',
            budget: '$100-200',
            clientName: 'StartupCo',
            coverLetter: 'I can create a modern logo for your startup...',
            proposedTimeline: '2-3 days',
            rate: '150',
            updatedAt: '2025-06-19 16:45',
            feedback: 'Thank you for your application. We decided to go with another artist.'
          },
          {
            id: 4,
            title: 'Fantasy Character Art',
            status: 'completed',
            appliedAt: '2025-06-15 11:00',
            budget: '$300-600',
            clientName: 'Game Studio',
            coverLetter: 'I specialize in fantasy character designs...',
            proposedTimeline: '7-10 days',
            rate: '450',
            updatedAt: '2025-06-25 14:20',
            feedback: 'Excellent work! Looking forward to future collaborations.'
          },
          {
            id: 5,
            title: 'Comic Book Illustration',
            status: 'in_progress',
            appliedAt: '2025-06-16 13:45',
            budget: '$400-800',
            clientName: 'Indie Publisher',
            coverLetter: 'I have experience with comic book illustrations...',
            proposedTimeline: '10-14 days',
            rate: '600',
            updatedAt: '2025-06-22 10:15'
          }
        ];
        
        setAppliedProjects(mockProjects);
        await AsyncStorage.setItem('appliedProjects', JSON.stringify(mockProjects));
      }
    } catch (error) {
      console.error('Error loading applied projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAppliedProjects();
    setIsRefreshing(false);
  };

  const getFilteredProjects = () => {
    if (activeFilter === 'all') return appliedProjects;
    return appliedProjects.filter(project => project.status === activeFilter);
  };

  const getStatusCounts = () => {
    return {
      all: appliedProjects.length,
      pending: appliedProjects.filter(p => p.status === 'pending').length,
      selected: appliedProjects.filter(p => p.status === 'selected').length,
      in_progress: appliedProjects.filter(p => p.status === 'in_progress').length,
      completed: appliedProjects.filter(p => p.status === 'completed').length,
      rejected: appliedProjects.filter(p => p.status === 'rejected').length,
    };
  };

  const handleProjectPress = (project: AppliedProject) => {
    if (project.status === 'selected' || project.status === 'in_progress') {
      // Navigate to project workspace/collaboration page
      router.push({
        pathname: '/project-workspace',
        params: {
          projectId: project.id,
          title: project.title,
          status: project.status
        }
      });
    } else {
      // Show project details modal or navigate to detail page
      showProjectDetails(project);
    }
  };

  const showProjectDetails = (project: AppliedProject) => {
    Alert.alert(
      project.title,
      `Status: ${project.status.replace('_', ' ').toUpperCase()}\n` +
      `Applied: ${project.appliedAt}\n` +
      `Budget: ${project.budget}\n` +
      `Your Rate: $${project.rate}\n` +
      (project.feedback ? `\nFeedback: ${project.feedback}` : ''),
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'View Original Project',
          onPress: () => router.push({
            pathname: '/project-detail',
            params: { projectId: project.id }
          })
        }
      ]
    );
  };

  const handleWithdrawApplication = (projectId: number) => {
    Alert.alert(
      'Withdraw Application',
      'Are you sure you want to withdraw your application? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedProjects = appliedProjects.filter(p => p.id !== projectId);
              setAppliedProjects(updatedProjects);
              await AsyncStorage.setItem('appliedProjects', JSON.stringify(updatedProjects));
              
              Alert.alert('Success', 'Your application has been withdrawn.');
            } catch (error) {
              console.error('Error withdrawing application:', error);
              Alert.alert('Error', 'Failed to withdraw application. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderProjectCard = (project: AppliedProject) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return Colors.warning;
        case 'selected': return Colors.success;
        case 'in_progress': return Colors.primary;
        case 'completed': return Colors.verified;
        case 'rejected': return Colors.error;
        default: return Colors.textMuted;
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'pending': return 'Under Review';
        case 'selected': return 'Selected';
        case 'in_progress': return 'In Progress';
        case 'completed': return 'Completed';
        case 'rejected': return 'Not Selected';
        default: return status;
      }
    };

    const canWithdraw = project.status === 'pending';
    const showFeedback = project.feedback && (project.status === 'selected' || project.status === 'rejected' || project.status === 'completed');

    return (
      <TouchableOpacity 
        key={project.id}
        style={styles.projectCard}
        onPress={() => handleProjectPress(project)}
      >
        <View style={styles.projectHeader}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectMeta}>
              Applied: {project.appliedAt} • Budget: {project.budget}
            </Text>
            {project.updatedAt && (
              <Text style={styles.updateTime}>
                Updated: {project.updatedAt}
              </Text>
            )}
          </View>
          
          <View style={styles.projectStatus}>
            <StatusBadge 
              status={project.status as any}
              text={getStatusText(project.status)}
              size="small"
            />
          </View>
        </View>

        <View style={styles.projectDetails}>
          <View style={styles.proposalInfo}>
            <Text style={styles.proposalLabel}>Your Proposal:</Text>
            <Text style={styles.proposalValue}>
              ${project.rate} • {project.proposedTimeline}
            </Text>
          </View>
          
          {showFeedback && (
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackLabel}>Client Feedback:</Text>
              <Text style={styles.feedbackText}>{project.feedback}</Text>
            </View>
          )}
        </View>

        <View style={styles.projectActions}>
          {project.status === 'selected' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push({
                pathname: '/project-workspace',
                params: { projectId: project.id, title: project.title }
              })}
            >
              <Text style={styles.actionButtonText}>Start Working</Text>
            </TouchableOpacity>
          )}
          
          {project.status === 'in_progress' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push({
                pathname: '/project-workspace',
                params: { projectId: project.id, title: project.title }
              })}
            >
              <Text style={styles.actionButtonText}>Continue Work</Text>
            </TouchableOpacity>
          )}
          
          {canWithdraw && (
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={() => handleWithdrawApplication(project.id)}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => showProjectDetails(project)}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterTabs = () => {
    const filters = [
      { key: 'all', label: 'All' },
      { key: 'pending', label: 'Pending' },
      { key: 'selected', label: 'Selected' },
      { key: 'in_progress', label: 'In Progress' },
      { key: 'completed', label: 'Completed' },
      { key: 'rejected', label: 'Rejected' }
    ];

    const counts = getStatusCounts();

    return (
      <View style={styles.filterTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.activeFilterTabText
              ]}>
                {filter.label}
              </Text>
              {counts[filter.key] > 0 && (
                <View style={styles.filterCount}>
                  <Text style={styles.filterCountText}>{counts[filter.key]}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSummaryStats = () => {
    const counts = getStatusCounts();
    
    return (
      <View style={styles.summaryStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{counts.all}</Text>
          <Text style={styles.statLabel}>Total Applied</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{counts.selected + counts.in_progress}</Text>
          <Text style={styles.statLabel}>Active Projects</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{counts.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {counts.all > 0 ? Math.round(((counts.selected + counts.completed + counts.in_progress) / counts.all) * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header title="Applied Projects" style={AppStyles.header} />
        <LoadingState text="Loading your applications..." />
      </View>
    );
  }

  const filteredProjects = getFilteredProjects();

  return (
    <View style={AppStyles.container}>
      <Header 
        title="Applied Projects"
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/projects')}
          >
            <Text style={styles.headerButtonIcon}>🔍</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Summary Stats */}
        {appliedProjects.length > 0 && renderSummaryStats()}

        {/* Filter Tabs */}
        {appliedProjects.length > 0 && renderFilterTabs()}

        {/* Projects List */}
        <View style={styles.projectsList}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map(renderProjectCard)
          ) : appliedProjects.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No Applications Yet"
              description="You haven't applied for any projects yet. Browse available projects and start applying!"
              buttonText="Browse Projects"
              onButtonPress={() => router.push('/projects')}
              size="large"
            />
          ) : (
            <EmptyState
              icon="🔍"
              title={`No ${activeFilter === 'all' ? '' : activeFilter.replace('_', ' ')} Projects`}
              description={`You don't have any ${activeFilter === 'all' ? '' : activeFilter.replace('_', ' ')} applications.`}
              buttonText="View All Applications"
              onButtonPress={() => setActiveFilter('all')}
              size="medium"
            />
          )}
        </View>

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  // Header Button
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonIcon: {
    fontSize: 18,
  },

  // Summary Stats
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Filter Tabs
  filterTabs: {
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.xl,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  activeFilterTabText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  filterCount: {
    backgroundColor: Colors.error,
    borderRadius: Layout.radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: Layout.spacing.xs,
    minWidth: 18,
    alignItems: 'center',
  },
  filterCountText: {
    ...Typography.badge,
    fontSize: 10,
  },

  // Projects List
  projectsList: {
    paddingHorizontal: Layout.spacing.xl,
  },

  // Project Card
  projectCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  projectInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  projectTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  projectMeta: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  updateTime: {
    ...Typography.caption,
    color: Colors.textDisabled,
  },
  projectStatus: {
    alignItems: 'flex-end',
  },

  // Project Details
  projectDetails: {
    marginBottom: Layout.spacing.md,
  },
  proposalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  proposalLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  proposalValue: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  feedbackSection: {
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  feedbackLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    marginBottom: Layout.spacing.xs,
  },
  feedbackText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Project Actions
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    marginLeft: Layout.spacing.sm,
  },
  actionButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  withdrawButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    marginLeft: Layout.spacing.sm,
  },
  withdrawButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  detailsButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    marginLeft: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailsButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
});

export default AppliedProjectsPage;