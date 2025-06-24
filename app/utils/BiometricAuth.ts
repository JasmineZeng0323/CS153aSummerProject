
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricConfig {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

class BiometricAuthService {
  // Check if biometric authentication is available
  static async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Biometric availability check failed:', error);
      return false;
    }
  }

  // Get supported authentication types
  static async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Failed to get supported auth types:', error);
      return [];
    }
  }

  // Get biometric type name for display
  static async getBiometricTypeName(): Promise<string> {
    try {
      const types = await this.getSupportedTypes();
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'Face ID';
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'Touch ID';
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'Iris Scanner';
      }
      
      return 'Biometric Authentication';
    } catch (error) {
      console.error('Failed to get biometric type name:', error);
      return 'Biometric Authentication';
    }
  }

  // Authenticate user with biometrics
  static async authenticate(config: BiometricConfig = {}): Promise<{
    success: boolean;
    error?: string;
    warning?: string;
  }> {
    try {
      // Check if biometrics are available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device'
        };
      }

      const biometricName = await this.getBiometricTypeName();
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: config.promptMessage || `Use ${biometricName} to authenticate`,
        cancelLabel: config.cancelLabel || 'Cancel',
        fallbackLabel: config.fallbackLabel || 'Use Password',
        disableDeviceFallback: config.disableDeviceFallback || false,
      });

      if (result.success) {
        return { success: true };
      } else {
        let errorMessage = 'Authentication failed';
        
        if (result.error === 'user_cancel') {
          errorMessage = 'Authentication was cancelled';
        } else if (result.error === 'user_fallback') {
          errorMessage = 'User chose to use fallback authentication';
        } else if (result.error === 'system_cancel') {
          errorMessage = 'Authentication was cancelled by the system';
        } else if (result.error === 'passcode_not_set') {
          errorMessage = 'Passcode is not set on the device';
        } else if (result.error === 'biometric_not_available') {
          errorMessage = 'Biometric authentication is not available';
        } else if (result.error === 'biometric_not_enrolled') {
          errorMessage = 'No biometric credentials are enrolled';
        } else if (result.error === 'biometric_locked_out') {
          errorMessage = 'Biometric authentication is locked out';
        }

        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during authentication'
      };
    }
  }

  // Enable biometric authentication for the app
  static async enableBiometricAuth(): Promise<boolean> {
    try {
      const authResult = await this.authenticate({
        promptMessage: 'Authenticate to enable biometric login',
        disableDeviceFallback: false
      });

      if (authResult.success) {
        await AsyncStorage.setItem('biometricEnabled', 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to enable biometric auth:', error);
      return false;
    }
  }

  // Disable biometric authentication for the app
  static async disableBiometricAuth(): Promise<void> {
    try {
      await AsyncStorage.removeItem('biometricEnabled');
    } catch (error) {
      console.error('Failed to disable biometric auth:', error);
    }
  }

  // Check if biometric authentication is enabled for the app
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      return enabled === 'true';
    } catch (error) {
      console.error('Failed to check biometric status:', error);
      return false;
    }
  }

  // Prompt for biometric authentication on app launch
  static async promptForBiometricLogin(): Promise<boolean> {
    try {
      const isEnabled = await this.isBiometricEnabled();
      const isAvailable = await this.isAvailable();

      if (!isEnabled || !isAvailable) {
        return false;
      }

      const authResult = await this.authenticate({
        promptMessage: 'Use biometric authentication to sign in',
        disableDeviceFallback: false
      });

      return authResult.success;
    } catch (error) {
      console.error('Biometric login prompt failed:', error);
      return false;
    }
  }
}

export default BiometricAuthService;