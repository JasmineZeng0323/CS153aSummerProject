//my-projects.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import EmptyState from './components/common/EmptyState';
import Header from './components/common/Header';
import StatusBadge from './components/common/StatusBadge';
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

const MyProjectsPage = () => {
  // Mock data for user's projects with recruiting status
  const [projects] = useState([
    {
      id: 1,
      title: 'Test Project',
      category: 'Graphic Design',
      deadline: '2025-07-31',
      daysLeft: 39,
      budget: '$52-22k',
      status: 'active',
      applicantCount: 3,
      invitedCount: 1,
      selectedArtistCount: 0,
      description: 'Test project description for graphic design work...',
      createdAt: '2025-06-22',
      isRecruiting: true // 招募中
    },
    {
      id: 2,
      title: 'Character Design Commission',
      category: 'Character Design',
      deadline: '2025-08-15',
      daysLeft: 54,
      budget: '$200-500',
      status: 'active',
      applicantCount: 7,
      invitedCount: 2,
      selectedArtistCount: 1,
      description: 'Looking for an original character design with anime style...',
      createdAt: '2025-06-20',
      isRecruiting: false // 招募关闭
    },
    {
      id: 3,
      title: 'Logo Design Project',
      category: 'Graphic Design',
      deadline: '2025-06-30',
      daysLeft: 8,
      budget: '$300-800',
      status: 'completed',
      applicantCount: 12,
      invitedCount: 0,
      selectedArtistCount: 1,
      description: 'Professional logo design for startup company...',
      createdAt: '2025-06-10',
      isRecruiting: false // 已完成项目
    },
    {
      id: 4,
      title: 'Website Banner Design',
      category: 'Web Design',
      deadline: '2025-09-01',
      daysLeft: 70,
      budget: '$150-400',
      status: 'active',
      applicantCount: 0,
      invitedCount: 0,
      selectedArtistCount: 0,
      description: 'Modern banner design for company website...',
      createdAt: '2025-06-24',
      isRecruiting: true // 招募中
    }
  ]);

  // Handle project card press
  const handleProjectPress = (project) => {
    router.push({
      pathname: '/project-detail',
      params: {
        projectId: project.id,
        title: project.title,
        category: project.category,
        deadline: project.deadline,
        budget: project.budget,
        status: project.status,
        applicantCount: project.applicantCount,
        invitedCount: project.invitedCount,
        selectedArtistCount: project.selectedArtistCount,
        description: project.description,
        isRecruiting: project.isRecruiting
      }
    });
  };

  // Get recruiting status badge
  const getRecruitingStatusBadge = (project) => {
    if (project.status === 'completed') {
      return (
        <StatusBadge 
          status="completed"
          text="Completed"
          size="small"
        />
      );
    } else if (project.status === 'cancelled') {
      return (
        <StatusBadge 
          status="cancelled"
          text="Cancelled"
          size="small"
        />
      );
    } else {
      return (
        <StatusBadge 
          status={project.isRecruiting ? "active" : "unavailable"}
          text={project.isRecruiting ? "Recruiting" : "Recruiting Closed"}
          size="small"
        />
      );
    }
  };

  // Render project card in traditional list style (image 2)
  const renderProjectCard = (project) => (
    <TouchableOpacity
      key={project.id}
      style={styles.projectCard}
      onPress={() => handleProjectPress(project)}
    >
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            {getRecruitingStatusBadge(project)}
          </View>
          <View style={styles.projectMeta}>
            <Text style={styles.projectCategory}>📐 {project.category}</Text>
            {/* 如果招募关闭且项目还在进行中，显示额外提示 */}
            {!project.isRecruiting && project.status === 'active' && (
              <View style={styles.hiddenIndicator}>
                <Text style={styles.hiddenText}>👁️‍🗨️ Hidden from artists</Text>
              </View>
            )}
          </View>
          <Text style={styles.projectDescription} numberOfLines={2}>
            {project.description}
          </Text>
        </View>
      </View>

      <View style={styles.projectDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Budget:</Text>
          <Text style={styles.detailValue}>{project.budget}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>{project.deadline} ({project.daysLeft} days left)</Text>
        </View>
      </View>

      {/* Artist Stats */}
      <View style={styles.artistStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{project.applicantCount}</Text>
          <Text style={styles.statLabel}>Applicants</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{project.invitedCount}</Text>
          <Text style={styles.statLabel}>Invited</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{project.selectedArtistCount}</Text>
          <Text style={styles.statLabel}>Selected</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  // 按招募状态分组项目
  const recruitingProjects = projects.filter(p => p.isRecruiting && p.status === 'active');
  const closedProjects = projects.filter(p => !p.isRecruiting || p.status !== 'active');

  return (
    <View style={AppStyles.container}>
      {/* Header using common Header component with unified padding */}
      <Header 
        title="My Projects" 
        showBackButton={true}
        onBackPress={() => router.back()}
        style={AppStyles.header}
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Projects Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Project Overview</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{recruitingProjects.length}</Text>
              <Text style={styles.summaryLabel}>Recruiting</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{closedProjects.length}</Text>
              <Text style={styles.summaryLabel}>Closed/Completed</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{projects.length}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Recruiting Projects Section */}
        {recruitingProjects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🟢 Currently Recruiting ({recruitingProjects.length})</Text>
            </View>
            {recruitingProjects.map((project) => renderProjectCard(project))}
          </View>
        )}

        {/* Closed/Completed Projects Section */}
        {closedProjects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📝 Closed & Completed ({closedProjects.length})</Text>
            </View>
            {closedProjects.map((project) => renderProjectCard(project))}
          </View>
        )}

        {/* Empty state when no projects */}
        {projects.length === 0 && (
          <EmptyState
            icon="📋"
            title="No Projects Yet"
            description="You haven't created any projects yet. Start by posting your first project to find talented artists."
            buttonText="Create Project"
            onButtonPress={() => router.push('/create-project')}
            size="medium"
          />
        )}

        {/* Bottom padding matching other pages */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Content
  content: {
    flex: 1,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.xl,
  },
  summaryTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // Section Headers
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionHeader: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    ...Typography.h6,
    color: Colors.text,
  },

  // Project List Styles (Traditional style like image 2)
  projectCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.xl,
    position: 'relative',
  },
  projectHeader: {
    marginBottom: Layout.spacing.lg,
  },
  projectInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  projectTitle: {
    ...Typography.h4,
    color: Colors.text,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
    flexWrap: 'wrap',
  },
  projectCategory: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginRight: Layout.spacing.md,
  },
  hiddenIndicator: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
    marginLeft: Layout.spacing.sm,
  },
  hiddenText: {
    ...Typography.caption,
    color: Colors.text,
    fontSize: 10,
  },
  projectDescription: {
    ...Typography.bodyMuted,
    lineHeight: 20,
  },
  projectDetails: {
    marginBottom: Layout.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.xs,
  },
  detailLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    width: 80,
  },
  detailValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  artistStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h4,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  chevron: {
    position: 'absolute',
    top: Layout.spacing.xl,
    right: Layout.spacing.xl,
    fontSize: 20,
    color: Colors.textMuted,
  },

  bottomPadding: {
    height: Layout.spacing.xxxl,
  },
});

export default MyProjectsPage;