
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const MyProjectsPage = () => {
  // Mock data for user's projects
  const [projects] = useState([
    {
      id: 1,
      title: 'Test Project',
      category: 'Graphic Design',
      deadline: '2025-07-31',
      daysLeft: 39,
      budget: '$52-22k',
      status: 'active', // active, completed, cancelled
      applicantCount: 3,
      invitedCount: 1,
      selectedArtistCount: 0,
      description: 'Test project description for graphic design work...',
      createdAt: '2025-06-22'
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
      createdAt: '2025-06-20'
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
      createdAt: '2025-06-10'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#FF5722';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

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
        description: project.description
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Projects</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Projects List */}
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => handleProjectPress(project)}
          >
            <View style={styles.projectHeader}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <View style={styles.projectMeta}>
                  <Text style={styles.projectCategory}>📐 {project.category}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
                  </View>
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
        ))}

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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  
  // Project List Styles
  projectCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  projectHeader: {
    marginBottom: 16,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectCategory: {
    fontSize: 14,
    color: '#888',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  projectDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  artistStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00A8FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  chevron: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 20,
    color: '#888',
  },
  bottomPadding: {
    height: 40,
  },
});

export default MyProjectsPage;