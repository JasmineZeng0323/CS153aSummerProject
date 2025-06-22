import { router } from 'expo-router';
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

const MessagesPage = () => {
  // Mock conversations with random data
  const [conversations] = useState([
    {
      id: 1,
      name: 'Alice Chen',
      avatar: 'https://picsum.photos/seed/artist1/60/60',
      lastMessage: 'Draft received, looks amazing!',
      time: '2m ago',
      unread: true,
      isOnline: true
    },
    {
      id: 2,
      name: 'Marco Rodriguez',
      avatar: 'https://picsum.photos/seed/artist2/60/60',
      lastMessage: 'When can we schedule the next milestone?',
      time: '15m ago',
      unread: false,
      isOnline: true
    },
    {
      id: 3,
      name: 'Sakura Tanaka',
      avatar: 'https://picsum.photos/seed/artist3/60/60',
      lastMessage: 'Thank you so much! The artwork is perfect 😊❤️',
      time: '1h ago',
      unread: false,
      isOnline: false
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: 'https://picsum.photos/seed/artist4/60/60',
      lastMessage: 'I can start working on your commission next week',
      time: '3h ago',
      unread: false,
      isOnline: true
    },
    {
      id: 5,
      name: 'Emma Thompson',
      avatar: 'https://picsum.photos/seed/artist5/60/60',
      lastMessage: 'Here are some style references for your character',
      time: 'Yesterday',
      unread: true,
      isOnline: false
    },
    {
      id: 6,
      name: 'Alex Petrov',
      avatar: 'https://picsum.photos/seed/artist6/60/60',
      lastMessage: 'Commission completed! Please check and confirm 🎨',
      time: 'Yesterday',
      unread: false,
      isOnline: true
    },
    {
      id: 7,
      name: 'Luna Martinez',
      avatar: 'https://picsum.photos/seed/artist7/60/60',
      lastMessage: 'I love the concept art you shared!',
      time: '2 days ago',
      unread: false,
      isOnline: false
    },
    {
      id: 8,
      name: 'Jin Wong',
      avatar: 'https://picsum.photos/seed/artist8/60/60',
      lastMessage: 'Payment received. Starting your project now!',
      time: '3 days ago',
      unread: false,
      isOnline: true
    },
    {
      id: 9,
      name: 'Sophie Miller',
      avatar: 'https://picsum.photos/seed/artist9/60/60',
      lastMessage: 'Would you like any revisions to the sketch?',
      time: '1 week ago',
      unread: false,
      isOnline: false
    },
    {
      id: 10,
      name: 'Carlos Silva',
      avatar: 'https://picsum.photos/seed/artist10/60/60',
      lastMessage: 'Thanks for choosing me for your project! 🙏',
      time: '1 week ago',
      unread: false,
      isOnline: true
    }
  ]);

  const handleConversationPress = (conversation) => {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      {/* Chat Tab */}
      <View style={styles.tabContainer}>
        <View style={styles.activeTab}>
          <Text style={styles.activeTabText}>Conversations</Text>
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {conversations.map((conversation) => (
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
                <Text style={styles.conversationTime}>{conversation.time}</Text>
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
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/homepage')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/artists')}
        >
          <Text style={styles.navIcon}>🎨</Text>
          <Text style={styles.navText}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, styles.activeNavIcon]}>💬</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Messages</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>●</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBar: {
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#666',
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  tabContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  activeTab: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#00A8FF',
  },
  activeTabText: {
    color: '#00A8FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
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
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#0A0A0A',
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
    color: '#FFFFFF',
  },
  conversationTime: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#AAA',
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
    marginLeft: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: 'relative',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#666',
  },
  activeNavIcon: {
    color: '#00A8FF',
  },
  navText: {
    fontSize: 12,
    color: '#888',
  },
  activeNavText: {
    color: '#00A8FF',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 20,
    backgroundColor: '#FF4444',
    borderRadius: 4,
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FF4444',
    fontSize: 8,
  },
  profileBadge: {
    position: 'absolute',
    top: 4,
    right: 18,
    backgroundColor: '#00A8FF',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MessagesPage;