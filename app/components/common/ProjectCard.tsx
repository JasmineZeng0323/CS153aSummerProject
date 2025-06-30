// app/components/common/ProjectCard.tsx
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../styles/Colors';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  clientName: string;
  clientAvatar: string;
  isVerified?: boolean;
  isHighQuality?: boolean;
  image: string;
  tags?: string[];
  onPress?: (project: ProjectCardProps) => void;
  onActionPress?: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  budget,
  deadline,
  clientName,
  clientAvatar,
  isVerified = false,
  isHighQuality = false,
  image,
  tags = [],
  onPress,
  onActionPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress({
        id,
        title,
        description,
        budget,
        deadline,
        clientName,
        clientAvatar,
        isVerified,
        isHighQuality,
        image,
        tags,
      });
    }
  };

  const handleActionPress = (e: any) => {
    e.stopPropagation();
    if (onActionPress) {
      onActionPress(id);
    }
  };

  return (
    <TouchableOpacity style={styles.projectCard} onPress={handlePress}>
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>{title}</Text>
          <Text style={styles.projectDescription} numberOfLines={2}>
            {description}
          </Text>
          
          {/* Tags */}
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.projectDetails}>
            <Text style={styles.budget}>{budget}</Text>
            <Text style={styles.deadline}>{deadline} Deadline</Text>
          </View>

          {/* Client Info */}
          <View style={styles.clientInfo}>
            <Image source={{ uri: clientAvatar }} style={styles.clientAvatar} />
            <Text style={styles.clientName}>{clientName}</Text>
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.projectImageContainer}>
          <Image source={{ uri: image }} style={styles.projectImage} />
          <View style={styles.projectActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleActionPress}>
              <Text style={styles.actionIcon}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  projectHeader: {
    flexDirection: 'row',
  },
  projectInfo: {
    flex: 1,
    marginRight: Layout.spacing.lg,
  },
  projectTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.sm,
  },
  projectDescription: {
    ...Typography.bodyMuted,
    lineHeight: 20,
    marginBottom: Layout.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Layout.spacing.md,
  },
  tag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  tagText: {
    ...Typography.badge,
  },
  projectDetails: {
    marginBottom: Layout.spacing.md,
  },
  budget: {
    ...Typography.price,
    marginBottom: Layout.spacing.xs,
  },
  deadline: {
    ...Typography.bodySmallMuted,
  },
  clientInfo: {
    ...Layout.row,
    alignItems: 'center',
  },
  clientAvatar: {
    ...Layout.avatarSmall,
    marginRight: Layout.spacing.sm,
  },
  clientName: {
    ...Typography.bodySmall,
    flex: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: Layout.radius.round,
    backgroundColor: Colors.verified,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  projectImageContainer: {
    position: 'relative',
  },
  projectImage: {
    width: 120,
    height: 120,
    borderRadius: Layout.radius.md,
  },
  projectActions: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
});

export default ProjectCard;