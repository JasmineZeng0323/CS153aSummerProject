import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Import your component library
import LoadingState from './components/common/LoadingState';
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const { width, height } = Dimensions.get('window');

const QRScannerPage = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={GlobalStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <View style={styles.placeholder} />
        </View>
        <LoadingState text="Loading camera..." />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={GlobalStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to show the camera</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={requestPermission}
          >
            <Text style={styles.retryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    console.log('QR Code scanned:', { type, data });
    

    let message = `Scanned: ${data}`;
    let actions = [
      {
        text: 'Scan Again',
        onPress: () => setScanned(false)
      },
      {
        text: 'OK',
        onPress: () => router.back()
      }
    ];

    // if is artist link jump to it
    if (data.includes('artist') || data.includes('profile')) {
      message = `Artist profile detected!\n${data}`;
      actions = [
        {
          text: 'Scan Again',
          onPress: () => setScanned(false)
        },
        {
          text: 'Visit Profile',
          onPress: () => {
            router.back();
            // router.push(`/artist-detail?artistId=${extractArtistId(data)}`);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => router.back()
        }
      ];
    }

    Alert.alert('QR Code Scanned!', message, actions);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => !current);
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert(
          'Image Selected',
          'QR code detection from images requires additional libraries. For now, please use camera scanning.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header - 手动实现确保正确的 padding */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
          <Text style={styles.flipIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash ? 'on' : 'off'}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'pdf417'],
          }}
        >
          {/* Scanner Overlay */}
          <View style={styles.scannerOverlay}>
            
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            
            
            {scanned && (
              <View style={styles.scannedOverlay}>
                <Text style={styles.scannedText}>✓ Scanned!</Text>
              </View>
            )}
          </View>

          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Scan QR Code</Text>
            <Text style={styles.instructionText}>
              Position the QR code within the frame to scan
            </Text>
          </View>

          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, flash && styles.activeActionButton]}
              onPress={toggleFlash}
            >
              <Text style={styles.actionIcon}>💡</Text>
              <Text style={styles.actionText}>Flash</Text>
            </TouchableOpacity>

            
            {scanned && (
              <TouchableOpacity 
                style={styles.rescanButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.rescanButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.actionIcon}>🖼️</Text>
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* 使用说明 */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>How to scan:</Text>
        <Text style={styles.helpText}>
          • Hold your device steady{'\n'}
          • Make sure the QR code is clearly visible{'\n'}
          • Keep adequate lighting{'\n'}
          • Tap flash if needed in dark environments
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Header 
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 50, 
    paddingBottom: Layout.spacing.lg,
    backgroundColor: Colors.surface,
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
  flipButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIcon: {
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },

  // Permission Container
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xxxl,
  },
  permissionText: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xxl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xxl,
  },
  retryButtonText: {
    ...Typography.button,
  },

  // Camera
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },

  // Scanner Overlay
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  // Scanned State
  scannedOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
  },
  scannedText: {
    ...Typography.bodyLarge,
    fontWeight: 'bold',
  },

  // Instructions
  instructionContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionTitle: {
    ...Typography.h3,
    marginBottom: Layout.spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Actions
  actionsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    ...Layout.row,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xxxl,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: Colors.whiteTransparent,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    minWidth: 80,
  },
  activeActionButton: {
    backgroundColor: 'rgba(255,193,7,0.8)',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Layout.spacing.xs,
  },
  actionText: {
    ...Typography.caption,
    fontWeight: 'bold',
  },
  rescanButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xxl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xxl,
  },
  rescanButtonText: {
    ...Typography.button,
  },

  // Help Container
  helpContainer: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.xl,
  },
  helpTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
  },
  helpText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default QRScannerPage;