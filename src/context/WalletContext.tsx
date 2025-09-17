import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WalletData } from '../utils/wallet';
import { BalanceData } from '../services/balanceService';
import { WalletManager } from '../utils/wallet';
import { BalanceService } from '../services/balanceService';
import { StorageManager } from '../utils/storage';

interface WalletContextType {
  wallet: WalletData | null;
  balance: BalanceData;
  isLoading: boolean;
  createWallet: () => Promise<void>;
  importWallet: (mnemonic: string) => Promise<void>;
  clearWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [balance, setBalance] = useState<BalanceData>({
    balance: '0',
    balanceInEth: '0.0',
    isLoading: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load wallet on app start
  useEffect(() => {
    loadWallet();
  }, []);

  // Refresh balance when wallet changes
  useEffect(() => {
    if (wallet) {
      refreshBalance();
    }
  }, [wallet]);

  const loadWallet = async () => {
    try {
      setIsLoading(true);
      const savedWallet = await StorageManager.loadWallet();
      setWallet(savedWallet);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      setIsLoading(true);
      const newWallet = WalletManager.generateWallet();
      await StorageManager.saveWallet(newWallet);
      setWallet(newWallet);
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const importWallet = async (mnemonic: string) => {
    try {
      setIsLoading(true);
      const importedWallet = WalletManager.importWallet(mnemonic);
      await StorageManager.saveWallet(importedWallet);
      setWallet(importedWallet);
    } catch (error) {
      console.error('Failed to import wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearWallet = async () => {
    try {
      await StorageManager.clearWallet();
      setWallet(null);
      setBalance({
        balance: '0',
        balanceInEth: '0.0',
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to clear wallet:', error);
    }
  };

  const refreshBalance = async () => {
    if (!wallet) return;

    try {
      setBalance(prev => ({ ...prev, isLoading: true }));
      const balanceData = await BalanceService.getBalance(wallet.address);
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      setBalance(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch balance'
      }));
    }
  };

  const value: WalletContextType = {
    wallet,
    balance,
    isLoading,
    createWallet,
    importWallet,
    clearWallet,
    refreshBalance
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
