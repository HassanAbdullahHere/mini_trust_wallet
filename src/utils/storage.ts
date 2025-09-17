import * as SecureStore from 'expo-secure-store';
import { WalletData } from './wallet';

export class StorageManager {
  private static readonly WALLET_KEY = 'wallet_data';
  private static readonly ONBOARDING_KEY = 'onboarding_completed';

  /**
   * Save wallet data securely
   */
  static async saveWallet(walletData: WalletData): Promise<void> {
    try {
      const walletJson = JSON.stringify(walletData);
      await SecureStore.setItemAsync(this.WALLET_KEY, walletJson);
    } catch (error) {
      console.error('Failed to save wallet:', error);
      throw new Error('Failed to save wallet data');
    }
  }

  /**
   * Load wallet data
   */
  static async loadWallet(): Promise<WalletData | null> {
    try {
      const walletJson = await SecureStore.getItemAsync(this.WALLET_KEY);
      if (!walletJson) {
        return null;
      }
      return JSON.parse(walletJson) as WalletData;
    } catch (error) {
      console.error('Failed to load wallet:', error);
      return null;
    }
  }

  /**
   * Clear wallet data
   */
  static async clearWallet(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.WALLET_KEY);
    } catch (error) {
      console.error('Failed to clear wallet:', error);
    }
  }

  /**
   * Check if onboarding is completed
   */
  static async isOnboardingCompleted(): Promise<boolean> {
    try {
      const completed = await SecureStore.getItemAsync(this.ONBOARDING_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async setOnboardingCompleted(): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Failed to set onboarding completed:', error);
    }
  }

  /**
   * Reset onboarding status
   */
  static async resetOnboarding(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.ONBOARDING_KEY);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  }
}
