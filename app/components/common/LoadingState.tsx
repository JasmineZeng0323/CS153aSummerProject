// app/components/LoadingState.tsx
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface LoadingStateProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: any;
  showText?: boolean;
  animationType?: 'fade' | 'pulse' | 'bounce' | 'spin';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'Loading...',
  size = 'large',
  color = '#00A8FF',
  style,
  showText = true,
  animationType = 'fade'
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = () => {
      switch (animationType) {
        case 'pulse':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
            ])
          );
        case 'bounce':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          );
        case 'spin':
          return Animated.loop(
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            })
          );
        default: // fade
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          );
      }
    };

    const animation = createAnimation();
    animation.start();

    return () => animation.stop();
  }, [animationType, animatedValue]);

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'pulse':
        return {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2],
            }),
          }],
        };
      case 'bounce':
        return {
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -10],
            }),
          }],
        };
      case 'spin':
        return {
          transform: [{
            rotate: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          }],
        };
      default: // fade
        return {
          opacity: animatedValue,
        };
    }
  };

  return (
    <View style={[styles.loadingContainer, style]}>
      <Animated.View style={[styles.loadingContent, getAnimatedStyle()]}>
        <ActivityIndicator size={size} color={color} />
      </Animated.View>
      
      {showText && (
        <Text style={[styles.loadingText, { color }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

// Preset loading components for common scenarios
export const PageLoadingState: React.FC<Omit<LoadingStateProps, 'text'>> = (props) => (
  <LoadingState
    text="Loading page..."
    {...props}
  />
);

export const DataLoadingState: React.FC<Omit<LoadingStateProps, 'text' | 'size'>> = (props) => (
  <LoadingState
    text="Loading data..."
    size="small"
    {...props}
  />
);

export const UploadingState: React.FC<Omit<LoadingStateProps, 'text' | 'animationType'>> = (props) => (
  <LoadingState
    text="Uploading..."
    animationType="pulse"
    {...props}
  />
);

export const ProcessingState: React.FC<Omit<LoadingStateProps, 'text' | 'animationType'>> = (props) => (
  <LoadingState
    text="Processing..."
    animationType="spin"
    {...props}
  />
);

export const SavingState: React.FC<Omit<LoadingStateProps, 'text' | 'size'>> = (props) => (
  <LoadingState
    text="Saving..."
    size="small"
    {...props}
  />
);

// Loading overlay for full screen loading
export const LoadingOverlay: React.FC<LoadingStateProps> = (props) => (
  <View style={styles.overlay}>
    <LoadingState {...props} />
  </View>
);

// Inline loading for buttons
export const ButtonLoadingState: React.FC<Omit<LoadingStateProps, 'showText' | 'size'>> = (props) => (
  <LoadingState
    showText={false}
    size="small"
    {...props}
  />
);

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContent: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default LoadingState;