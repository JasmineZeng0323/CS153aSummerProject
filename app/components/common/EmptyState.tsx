
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonPress?: () => void;
  style?: any;
  size?: 'small' | 'medium' | 'large';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📱',
  title,
  description,
  buttonText,
  onButtonPress,
  style,
  size = 'medium'
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 30,
          paddingHorizontal: 20,
        };
      case 'large':
        return {
          paddingVertical: 80,
          paddingHorizontal: 40,
        };
      default: // medium
        return {
          paddingVertical: 60,
          paddingHorizontal: 40,
        };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 48;
      case 'large': return 80;
      default: return 64;
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  const getDescriptionSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 16;
      default: return 14;
    }
  };

  return (
    <View style={[styles.emptyState, getSizeStyles(), style]}>
      <Text style={[styles.emptyStateIcon, { fontSize: getIconSize() }]}>
        {icon}
      </Text>
      
      <Text style={[styles.emptyStateTitle, { fontSize: getTitleSize() }]}>
        {title}
      </Text>
      
      <Text style={[styles.emptyStateText, { fontSize: getDescriptionSize() }]}>
        {description}
      </Text>
      
      {buttonText && onButtonPress && (
        <TouchableOpacity 
          style={styles.emptyStateButton}
          onPress={onButtonPress}
        >
          <Text style={styles.emptyStateButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Preset empty state components for common scenarios
export const NoDataEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon="📋"
    title="No Data Available"
    description="There's nothing to show here yet."
    {...props}
  />
);

export const NoResultsEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon="🔍"
    title="No Results Found"
    description="We couldn't find anything matching your search."
    {...props}
  />
);

export const NoArtistsEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon="🎨"
    title="No Artists Found"
    description="Start exploring and discover talented artists."
    {...props}
  />
);

export const NoOrdersEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon="🛒"
    title="No Orders Yet"
    description="Your orders will appear here when you make a purchase."
    {...props}
  />
);

export const NoMessagesEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon="💬"
    title="No Messages"
    description="Start a conversation with an artist."
    {...props}
  />
);

export const NetworkErrorEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <EmptyState
    icon="📡"
    title="Connection Error"
    description="Please check your internet connection and try again."
    {...props}
  />
);

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmptyState;