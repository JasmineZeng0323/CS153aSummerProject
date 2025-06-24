// app/components/common/StatusBadge.tsx
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export type StatusType = 
  | 'completed' 
  | 'in_progress' 
  | 'delivered' 
  | 'cancelled' 
  | 'pending' 
  | 'verified'
  | 'active'
  | 'draft'
  | 'available'
  | 'unavailable';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'circular'; 
  style?: any;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  icon,
  size = 'medium',
  variant = 'default',
  style
}) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'delivered': return '#2196F3';
      case 'cancelled': return '#FF5722';
      case 'pending': return '#FFC107';
      case 'verified': return '#4CAF50';
      case 'active': return '#4CAF50';
      case 'draft': return '#9E9E9E';
      case 'available': return '#4CAF50';
      case 'unavailable': return '#FF5722';
      default: return '#888';
    }
  };

  const getStatusText = (status: StatusType) => {
    if (text) return text;
    
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'pending': return 'Pending';
      case 'verified': return 'Verified';
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'available': return 'Available';
      case 'unavailable': return 'Unavailable';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: StatusType) => {
    if (icon) return icon;
    
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🎨';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      case 'pending': return '⏳';
      case 'verified': return '✓';
      case 'active': return '🟢';
      case 'draft': return '📝';
      case 'available': return '🟢';
      case 'unavailable': return '🔴';
      default: return '❓';
    }
  };

  const getSizeStyles = (size: 'small' | 'medium' | 'large', variant: string) => {
    if (variant === 'circular') {
      switch (size) {
        case 'small':
          return {
            width: 20,
            height: 20,
            borderRadius: 10,
          };
        case 'large':
          return {
            width: 32,
            height: 32,
            borderRadius: 16,
          };
        default: // medium
          return {
            width: 28,
            height: 28,
            borderRadius: 14,
          };
      }
    } else {
      switch (size) {
        case 'small':
          return {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
          };
        case 'large':
          return {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
          };
        default: // medium
          return {
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          };
      }
    }
  };

  const getTextSize = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 10;
      case 'large': return 16;
      default: return 12;
    }
  };

  const getIconSize = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 10;
      case 'large': return 16;
      default: return 12;
    }
  };

  const isCircular = variant === 'circular';
  const displayText = isCircular ? text : getStatusText(status);
  const displayIcon = isCircular ? null : getStatusIcon(status);

  return (
    <View 
      style={[
        styles.statusBadge,
        { backgroundColor: getStatusColor(status) },
        getSizeStyles(size, variant),
        isCircular && styles.circularBadge,
        style
      ]}
    >
      {!isCircular && displayIcon && (
        <Text 
          style={[
            styles.statusIcon, 
            { fontSize: getIconSize(size) }
          ]}
        >
          {displayIcon}
        </Text>
      )}
      {displayText && (
        <Text 
          style={[
            styles.statusText, 
            { fontSize: getTextSize(size) },
            isCircular && styles.circularText
          ]}
        >
          {displayText}
        </Text>
      )}
    </View>
  );
};

// Preset status badge components for common use cases
export const CompletedBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="completed" {...props} />
);

export const InProgressBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="in_progress" {...props} />
);

export const DeliveredBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="delivered" {...props} />
);

export const VerifiedBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="verified" {...props} />
);

export const AvailableBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="available" {...props} />
);

export const CircularBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="circular" {...props} />
);

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  circularBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
    color: '#FFFFFF',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  circularText: {
    textAlign: 'center',
    marginRight: 0, 
  },
});

export default StatusBadge;