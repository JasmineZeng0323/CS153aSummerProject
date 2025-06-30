// app/components/common/SearchComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../styles/Colors';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SearchProps {
  visible: boolean;
  onClose: () => void;
  placeholder?: string;
  searchType: 'gallery' | 'projects' | 'artists' | 'messages' | 'following' | 'collection';
  onSearch: (query: string, filters?: any) => void;
  onResultPress?: (result: any) => void;
}

interface SearchResult {
  id: string;
  type: 'artist' | 'gallery' | 'project' | 'message' | 'collection';
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  data?: any;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'category';
  icon?: string;
}

const SearchComponent: React.FC<SearchProps> = ({
  visible,
  onClose,
  placeholder = "Search...",
  searchType,
  onSearch,
  onResultPress
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const inputRef = useRef<TextInput>(null);

  // Mock data based on search type
  const getTrendingSuggestions = (): SearchSuggestion[] => {
    const suggestions: Record<string, SearchSuggestion[]> = {
      gallery: [
        { id: '1', text: 'Anime Portrait', type: 'trending', icon: '🔥' },
        { id: '2', text: 'Character Design', type: 'trending', icon: '🔥' },
        { id: '3', text: 'Fantasy Art', type: 'trending', icon: '🔥' },
        { id: '4', text: 'Chibi Style', type: 'category', icon: '🎭' },
        { id: '5', text: 'Digital Art', type: 'category', icon: '💻' }
      ],
      projects: [
        { id: '1', text: 'Character Commission', type: 'trending', icon: '🔥' },
        { id: '2', text: 'Logo Design', type: 'trending', icon: '🔥' },
        { id: '3', text: 'Game Art', type: 'trending', icon: '🔥' },
        { id: '4', text: 'High Budget', type: 'category', icon: '💰' },
        { id: '5', text: 'Urgent Projects', type: 'category', icon: '⚡' }
      ],
      artists: [
        { id: '1', text: 'Available Artists', type: 'trending', icon: '🔥' },
        { id: '2', text: 'Top Rated', type: 'trending', icon: '🔥' },
        { id: '3', text: 'Anime Style', type: 'category', icon: '🎌' },
        { id: '4', text: 'Character Artists', type: 'category', icon: '👤' },
        { id: '5', text: 'Digital Artists', type: 'category', icon: '💻' }
      ],
      messages: [
        { id: '1', text: 'Unread Messages', type: 'category', icon: '📬' },
        { id: '2', text: 'Recent Chats', type: 'category', icon: '💬' },
        { id: '3', text: 'Project Discussions', type: 'category', icon: '🎨' },
        { id: '4', text: 'Commission Updates', type: 'category', icon: '📋' }
      ],
      following: [
        { id: '1', text: 'Online Artists', type: 'category', icon: '🟢' },
        { id: '2', text: 'Available Now', type: 'category', icon: '✅' },
        { id: '3', text: 'Recently Active', type: 'category', icon: '🕒' },
        { id: '4', text: 'New Updates', type: 'category', icon: '🆕' }
      ],
      collection: [
        { id: '1', text: 'Recently Saved', type: 'category', icon: '🕒' },
        { id: '2', text: 'Available Items', type: 'category', icon: '✅' },
        { id: '3', text: 'Portrait Collection', type: 'category', icon: '🖼️' },
        { id: '4', text: 'Character Art', type: 'category', icon: '👤' }
      ]
    };
    
    return suggestions[searchType] || [];
  };

  const getSearchPlaceholder = () => {
    const placeholders: Record<string, string> = {
      gallery: 'Search galleries, artists, styles...',
      projects: 'Search projects, categories, budgets...',
      artists: 'Search artists, styles, availability...',
      messages: 'Search conversations, names...',
      following: 'Search followed artists...',
      collection: 'Search saved galleries...'
    };
    
    return placeholders[searchType] || placeholder;
  };

  // Mock search results
  const getMockResults = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    const mockResults: Record<string, SearchResult[]> = {
      gallery: [
        {
          id: '1',
          type: 'gallery',
          title: 'Anime Style Portrait',
          subtitle: 'by Alice Chen',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop',
          badge: '$89'
        },
        {
          id: '2',
          type: 'artist',
          title: 'Alice Chen',
          subtitle: '⭐4.9 • Available',
          image: 'https://i.pravatar.cc/60?img=1',
          badge: 'Artist'
        }
      ],
      projects: [
        {
          id: '1',
          type: 'project',
          title: 'Character Design Commission',
          subtitle: '$200-500 • 2 weeks',
          badge: 'Active'
        },
        {
          id: '2',
          type: 'project',
          title: 'Logo Design Project',
          subtitle: '$150-300 • Urgent',
          badge: 'Hot'
        }
      ],
      artists: [
        {
          id: '1',
          type: 'artist',
          title: 'Alice Chen',
          subtitle: '⭐4.9 • 234 reviews',
          image: 'https://i.pravatar.cc/60?img=1',
          badge: 'Available'
        },
        {
          id: '2',
          type: 'artist',
          title: 'Marco Rodriguez',
          subtitle: '⭐5.0 • 186 reviews',
          image: 'https://i.pravatar.cc/60?img=2',
          badge: 'Queue'
        }
      ],
      messages: [
        {
          id: '1',
          type: 'message',
          title: 'Alice Chen',
          subtitle: 'Draft received, looks amazing!',
          image: 'https://i.pravatar.cc/60?img=1',
          badge: 'Unread'
        }
      ],
      following: [
        {
          id: '1',
          type: 'artist',
          title: 'Alice Chen',
          subtitle: 'Online • Available',
          image: 'https://i.pravatar.cc/60?img=1',
          badge: 'Online'
        }
      ],
      collection: [
        {
          id: '1',
          type: 'collection',
          title: 'Anime Style Portrait',
          subtitle: 'by Alice Chen • $89',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop',
          badge: 'Saved'
        }
      ]
    };
    
    return mockResults[searchType] || [];
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        // Simulate search delay
        setTimeout(() => {
          const results = getMockResults(searchQuery);
          setSearchResults(results);
          setShowResults(true);
          setIsSearching(false);
        }, 500);
      } else {
        setSearchResults([]);
        setShowResults(false);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to history
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item !== query);
        return [query, ...filtered].slice(0, 10);
      });
      
      onSearch(query);
      onClose();
    }
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleResultPress = (result: SearchResult) => {
    if (onResultPress) {
      onResultPress(result);
    }
    onClose();
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const renderSuggestions = () => {
    const trendingSuggestions = getTrendingSuggestions();
    
    return (
      <View style={styles.suggestionsContainer}>
        {/* Search History */}
        {searchHistory.length > 0 && (
          <View style={styles.suggestionSection}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
            {searchHistory.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSearch(item)}
              >
                <Text style={styles.suggestionIcon}>🕒</Text>
                <Text style={styles.suggestionText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => setSearchHistory(prev => prev.filter(h => h !== item))}
                >
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Trending & Categories */}
        <View style={styles.suggestionSection}>
          <Text style={styles.suggestionTitle}>
            {searchType === 'messages' || searchType === 'following' || searchType === 'collection' 
              ? 'Quick Filters' 
              : 'Trending & Categories'}
          </Text>
          {trendingSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
              <Text style={styles.suggestionType}>
                {suggestion.type === 'trending' ? 'Trending' : 'Category'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderResults = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (searchResults.length === 0 && searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyDescription}>
            Try adjusting your search terms or browse categories
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
        {searchResults.map((result) => (
          <TouchableOpacity
            key={result.id}
            style={styles.resultItem}
            onPress={() => handleResultPress(result)}
          >
            {result.image && (
              <Image source={{ uri: result.image }} style={styles.resultImage} />
            )}
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              {result.subtitle && (
                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
              )}
            </View>
            {result.badge && (
              <View style={[styles.resultBadge, result.badge === 'Hot' && styles.hotBadge]}>
                <Text style={styles.resultBadgeText}>{result.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.searchInputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={getSearchPlaceholder()}
                placeholderTextColor={Colors.textMuted}
                returnKeyType="search"
                onSubmitEditing={() => handleSearch(searchQuery)}
              />
              
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearInputButton}
                  onPress={() => {
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                >
                  <Text style={styles.clearInputIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            {showResults ? renderResults() : renderSuggestions()}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 50, // Status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xl,
    paddingHorizontal: Layout.spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: Layout.spacing.md,
  },
  clearInputButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearInputIcon: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  content: {
    flex: 1,
  },

  // Suggestions
  suggestionsContainer: {
    padding: Layout.spacing.lg,
  },
  suggestionSection: {
    marginBottom: Layout.spacing.xl,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  suggestionTitle: {
    ...Typography.h6,
    color: Colors.text,
  },
  clearButton: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.sm,
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.md,
  },
  suggestionText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  suggestionType: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  removeIcon: {
    fontSize: 12,
    color: Colors.textMuted,
    padding: Layout.spacing.sm,
  },

  // Results
  resultsContainer: {
    padding: Layout.spacing.lg,
  },
  resultsTitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.sm,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  resultSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  resultBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.primary,
  },
  hotBadge: {
    backgroundColor: Colors.error,
  },
  resultBadgeText: {
    ...Typography.badge,
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Loading & Empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxxl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxxl,
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.lg,
  },
  emptyTitle: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchComponent;