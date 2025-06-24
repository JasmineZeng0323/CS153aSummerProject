// messages.tsx - Updated with Search Integration
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BottomNavigation from './components/BottomNavigation';
import SearchComponent from './components/common/SearchComponent'; // 🎯 NEW
import { Colors } from './components/styles/Colors';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

// Unified container style without padding
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

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  isOnline: boolean;
  messageType?: 'text' | 'image' | 'commission' | 'payment'; // 🎯 NEW: Message type for search
  tags?: string[]; // 🎯 NEW: Tags for better search
}

const MessagesPage = () => {
  const [showSearch, setShowSearch] = useState(false); // 🎯 NEW: Search modal state
  const [searchQuery, setSearchQuery] = useState(''); // 🎯 NEW: Current search query
  const [activeFilter, setActiveFilter] = useState('All'); // 🎯 NEW: Active filter
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Alice Chen',
      avatar: 'https://picsum.photos/seed/artist1/60/60',
      lastMessage: 'Draft received, looks amazing!',
      time: '2m ago',
      unread: true,
      isOnline: true,
      messageType: 'commission',
      tags: ['artist', 'commission', 'draft', 'work', 'progress']
    },
    {
      id: 2,
      name: 'Marco Rodriguez',
      avatar: 'https://picsum.photos/seed/artist2/60/60',
      lastMessage: 'When can we schedule the next milestone?',
      time: '15m ago',
      unread: false,
      isOnline: true,
      messageType: 'commission',
      tags: ['artist', 'commission', 'milestone', 'schedule', 'planning']
    },
    {
      id: 3,
      name: 'Sakura Tanaka',
      avatar: 'https://picsum.photos/seed/artist3/60/60',
      lastMessage: 'Thank you so much! The artwork is perfect 😊❤️',
      time: '1h ago',
      unread: false,
      isOnline: false,
      messageType: 'text',
      tags: ['artist', 'feedback', 'completed', 'positive', 'appreciation']
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: 'https://picsum.photos/seed/artist4/60/60',
      lastMessage: 'I can start working on your commission next week',
      time: '3h ago',
      unread: false,
      isOnline: true,
      messageType: 'commission',
      tags: ['artist', 'commission', 'schedule', 'planning', 'availability']
    },
    {
      id: 5,
      name: 'Emma Thompson',
      avatar: 'https://picsum.photos/seed/artist5/60/60',
      lastMessage: 'Here are some style references for your character',
      time: 'Yesterday',
      unread: true,
      isOnline: false,
      messageType: 'image',
      tags: ['artist', 'reference', 'character', 'style', 'design']
    },
    {
      id: 6,
      name: 'Alex Petrov',
      avatar: 'https://picsum.photos/seed/artist6/60/60',
      lastMessage: 'Commission completed! Please check and confirm 🎨',
      time: 'Yesterday',
      unread: false,
      isOnline: true,
      messageType: 'commission',
      tags: ['artist', 'commission', 'completed', 'confirmation', 'finished']
    },
    {
      id: 7,
      name: 'Luna Martinez',
      avatar: 'https://picsum.photos/seed/artist7/60/60',
      lastMessage: 'I love the concept art you shared!',
      time: '2 days ago',
      unread: false,
      isOnline: false,
      messageType: 'text',
      tags: ['artist', 'concept', 'feedback', 'positive', 'art']
    },
    {
      id: 8,
      name: 'Jin Wong',
      avatar: 'https://picsum.photos/seed/artist8/60/60',
      lastMessage: 'Payment received. Starting your project now!',
      time: '3 days ago',
      unread: false,
      isOnline: true,
      messageType: 'payment',
      tags: ['artist', 'payment', 'project', 'start', 'transaction']
    },
    {
      id: 9,
      name: 'Sophie Miller',
      avatar: 'https://picsum.photos/seed/artist9/60/60',
      lastMessage: 'Would you like any revisions to the sketch?',
      time: '1 week ago',
      unread: false,
      isOnline: false,
      messageType: 'commission',
      tags: ['artist', 'revision', 'sketch', 'feedback', 'iteration']
    },
    {
      id: 10,
      name: 'Carlos Silva',
      avatar: 'https://picsum.photos/seed/artist10/60/60',
      lastMessage: 'Thanks for choosing me for your project! 🙏',
      time: '1 week ago',
      unread: false,
      isOnline: true,
      messageType: 'text',
      tags: ['artist', 'appreciation', 'project', 'start', 'gratitude']
    }
  ]);

  // 🎯 NEW: Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching conversations for: ${query}`);
  };

  const handleSearchResultPress = (result: any) => {
    console.log('Search result pressed:', result);
    // Navigate to the conversation
    const conversation = conversations.find(c => c.id.toString() === result.id);
    if (conversation) {
      handleConversationPress(conversation);
    }
  };

  // 🎯 NEW: Filter conversations based on search query and active filter
  const getFilteredConversations = () => {
    let filtered = conversations;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(conversation => 
        conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conversation.tags && conversation.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'Unread':
        filtered = filtered.filter(c => c.unread);
        break;
      case 'Online':
        filtered = filtered.filter(c => c.isOnline);
        break;
      case 'Commission':
        filtered = filtered.filter(c => c.messageType === 'commission');
        break;
      case 'Payment':
        filtered = filtered.filter(c => c.messageType === 'payment');
        break;
      case 'All':
      default:
        // No additional filtering
        break;
    }

    return filtered;
  };

  const handleConversationPress = (conversation: Conversation) => {
    router.push({
      pathname: '/chat',
      params: {
        chatId: conversation.id,
        chatName: conversation.name,
        chatAvatar: conversation.avatar,
        isOnline: conversation.isOnline
      }
    });
  };

  // 🎯 NEW: Quick filter buttons
  const filterOptions = [
    { id: 'All', title: 'All', icon: '💬' },
    { id: 'Unread', title: 'Unread', icon: '📬' },
    { id: 'Online', title: 'Online', icon: '🟢' },
    { id: 'Commission', title: 'Commission', icon: '🎨' },
    { id: 'Payment', title: 'Payment', icon: '💰' }
  ];

  const filteredConversations = getFilteredConversations();

  return (
    <View style={AppStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Search Bar - 🎯 UPDATED: Now clickable */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Header - 🎯 NEW */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>
            Results for "{searchQuery}" ({filteredConversations.length})
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Tabs - 🎯 NEW: Quick filter buttons */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText
              ]}>
                {filter.title}
              </Text>
              {/* Show count */}
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>
                  {filter.id === 'All' ? conversations.length :
                   filter.id === 'Unread' ? conversations.filter(c => c.unread).length :
                   filter.id === 'Online' ? conversations.filter(c => c.isOnline).length :
                   filter.id === 'Commission' ? conversations.filter(c => c.messageType === 'commission').length :
                   filter.id === 'Payment' ? conversations.filter(c => c.messageType === 'payment').length : 0}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Tab - 🎯 UPDATED: Shows current filter */}
      <View style={styles.tabContainer}>
        <View style={styles.activeTab}>
          <Text style={styles.activeTabText}>
            {activeFilter === 'All' ? 'Conversations' : `${activeFilter} Conversations`}
          </Text>
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {filteredConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationItem}
            onPress={() => handleConversationPress(conversation)}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
              {conversation.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conversation.name}</Text>
                <View style={styles.conversationMeta}>
                  {/* 🎯 NEW: Message type indicator */}
                  {conversation.messageType && (
                    <View style={[styles.messageTypeBadge, { backgroundColor: getMessageTypeColor(conversation.messageType) }]}>
                      <Text style={styles.messageTypeText}>
                        {getMessageTypeIcon(conversation.messageType)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.conversationTime}>{conversation.time}</Text>
                </View>
              </View>
              
              <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
            </View>

            {conversation.unread && (
              <View style={styles.unreadIndicator} />
            )}
          </TouchableOpacity>
        ))}

        {/* 🎯 NEW: Empty search results */}
        {filteredConversations.length === 0 && (
          <View style={styles.emptySearchResults}>
            <Text style={styles.emptySearchIcon}>
              {searchQuery.trim() ? '🔍' : '💬'}
            </Text>
            <Text style={styles.emptySearchTitle}>
              {searchQuery.trim() ? 'No conversations found' : 
               activeFilter !== 'All' ? `No ${activeFilter.toLowerCase()} conversations` : 'No conversations'}
            </Text>
            <Text style={styles.emptySearchDescription}>
              {searchQuery.trim() 
                ? 'Try adjusting your search terms' 
                : activeFilter !== 'All' 
                ? 'Try a different filter or start a new conversation'
                : 'Start a conversation with an artist'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavigation activeTab="messages" />

      {/* 🎯 NEW: Search Component */}
      <SearchComponent
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        searchType="messages"
        onSearch={handleSearch}
        onResultPress={handleSearchResultPress}
      />
    </View>
  );
};

// 🎯 NEW: Helper functions for message type styling
const getMessageTypeColor = (type: string): string => {
  switch (type) {
    case 'commission': return Colors.primary;
    case 'payment': return Colors.success;
    case 'image': return Colors.secondary;
    case 'text': return Colors.textMuted;
    default: return Colors.textMuted;
  }
};

const getMessageTypeIcon = (type: string): string => {
  switch (type) {
    case 'commission': return '🎨';
    case 'payment': return '💰';
    case 'image': return '🖼️';
    case 'text': return '💬';
    default: return '💬';
  }
};

const styles = StyleSheet.create({
  // Header - keep exact original layout
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 50, // Status bar height
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },

  // Search section - 🎯 UPDATED: Now clickable
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBar: {
    backgroundColor: Colors.surface,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: Colors.textMuted,
  },
  searchPlaceholder: {
    color: Colors.textMuted,
    fontSize: 16,
  },

  // 🎯 NEW: Search results header
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: Layout.spacing.md,
  },
  searchResultsText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  clearSearchText: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },

  // 🎯 NEW: Filter tabs
  filtersContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    marginRight: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: Layout.spacing.sm,
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginRight: Layout.spacing.sm,
  },
  activeFilterText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  filterCount: {
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.round,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCountText: {
    ...Typography.badge,
    fontSize: 9,
  },

  // Tab section - keep original layout
  tabContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  activeTab: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  activeTabText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Conversations list - keep original layout
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.online,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  // 🎯 NEW: Conversation meta section
  conversationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  messageTypeText: {
    fontSize: 10,
  },
  conversationTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    marginLeft: 12,
  },

  // 🎯 NEW: Empty search results
  emptySearchResults: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxxl,
    paddingHorizontal: Layout.spacing.xl,
  },
  emptySearchIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.lg,
  },
  emptySearchTitle: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  emptySearchDescription: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MessagesPage;