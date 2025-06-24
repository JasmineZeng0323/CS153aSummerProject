// app/blocked-users.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import EmptyState from './components/common/EmptyState';
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  blockedDate: string;
  reason: string;
}

const BlockedUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: '1',
      name: 'John Spammer',
      username: '@johnspam',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=john',
      blockedDate: '2024-06-15',
      reason: 'Spam messages'
    },
    {
      id: '2',
      name: 'Rude Artist',
      username: '@rudeart',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=rude',
      blockedDate: '2024-06-10',
      reason: 'Inappropriate behavior'
    },
    {
      id: '3',
      name: 'Fake Profile',
      username: '@fakeuser123',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=fake',
      blockedDate: '2024-06-05',
      reason: 'Suspicious activity'
    }
  ]);

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnblockUser = (userId: string, userName: string) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}? They will be able to contact you and see your content again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => {
            setBlockedUsers(users => users.filter(user => user.id !== userId));
            // In real app, this would be an API call
            // unblockUser(userId);
          }
        }
      ]
    );
  };

  const handleBlockNewUser = () => {
    Alert.alert(
      'Block User',
      'Enter the username or email of the user you want to block:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          onPress: () => {
            // In real app, this would navigate to a search/block interface
            console.log('Navigate to block user interface');
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const BlockedUserItem = ({ user }: { user: BlockedUser }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userUsername}>{user.username}</Text>
          <View style={styles.userMeta}>
            <Text style={styles.blockedDate}>
              Blocked {formatDate(user.blockedDate)}
            </Text>
            {user.reason && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <Text style={styles.blockReason}>{user.reason}</Text>
              </>
            )}
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.unblockButton}
        onPress={() => handleUnblockUser(user.id, user.name)}
      >
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <TouchableOpacity onPress={handleBlockNewUser} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search blocked users..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          {searchQuery.length > 0 ? (
            <EmptyState
              icon="🔍"
              title="No Results Found"
              description={`No blocked users found matching "${searchQuery}"`}
              size="medium"
            />
          ) : (
            <EmptyState
              icon="🚫"
              title="No Blocked Users"
              description="You haven't blocked any users yet. When you block someone, they'll appear here."
              buttonText="Learn About Blocking"
              onButtonPress={() => {
                Alert.alert(
                  'About Blocking',
                  'Blocking a user prevents them from:\n\n• Sending you direct messages\n• Viewing your profile\n• Commenting on your posts\n• Commissioning artwork from you\n\nYou can unblock users at any time.',
                  [{ text: 'Got it' }]
                );
              }}
              size="large"
            />
          )}
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerIcon}>ℹ️</Text>
            <View style={styles.infoBannerContent}>
              <Text style={styles.infoBannerTitle}>About Blocked Users</Text>
              <Text style={styles.infoBannerText}>
                Blocked users cannot contact you, view your profile, or commission work from you.
              </Text>
            </View>
          </View>

          {/* Results Count */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} blocked
            </Text>
          </View>

          {/* Blocked Users List */}
          <View style={styles.usersList}>
            {filteredUsers.map((user, index) => (
              <View key={user.id}>
                <BlockedUserItem user={user} />
                {index < filteredUsers.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <View style={GlobalStyles.bottomPadding} />
        </ScrollView>
      )}
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
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Search
  searchContainer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },
  searchInputContainer: {
    ...Layout.row,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  // Content
  content: {
    flex: 1,
  },

  // Info Banner
  infoBanner: {
    backgroundColor: Colors.surface,
    ...Layout.marginHorizontal,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoBannerIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.md,
    marginTop: 2,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    ...Typography.labelSmall,
    marginBottom: Layout.spacing.xs,
  },
  infoBannerText: {
    ...Typography.bodySmallMuted,
    lineHeight: 18,
  },

  // Results
  resultsHeader: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  resultsCount: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },

  // Users List
  usersList: {
    backgroundColor: Colors.surface,
    ...Layout.marginHorizontal,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },

  // User Item
  userItem: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },
  userInfo: {
    ...Layout.row,
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    ...Layout.avatar,
    marginRight: Layout.spacing.lg,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...Typography.body,
    marginBottom: Layout.spacing.xs,
  },
  userUsername: {
    ...Typography.bodySmallMuted,
    marginBottom: Layout.spacing.xs,
  },
  userMeta: {
    ...Layout.row,
    alignItems: 'center',
  },
  blockedDate: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  metaDivider: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginHorizontal: Layout.spacing.sm,
  },
  blockReason: {
    ...Typography.caption,
    color: Colors.warning,
  },
  unblockButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  unblockButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Layout.spacing.xl,
  },
});

export default BlockedUsersPage;