import { ethers } from 'ethers';
import * as bip39 from 'bip39';

export interface WalletData {
  address: string;
  mnemonic: string;
  privateKey: string;
}

export class WalletManager {
  private static readonly DERIVATION_PATH = "m/44'/60'/0'/0/0"; // BIP-44 for Ethereum

  /**
   * Generate a new wallet with 12-word BIP-39 mnemonic
   */
  static generateWallet(): WalletData {
    const mnemonic = bip39.generateMnemonic(128); // 12 words
    return this.importWallet(mnemonic);
  }

  /**
   * Import wallet from mnemonic (12 or 24 words)
   */
  static importWallet(mnemonic: string): WalletData {
    // Validate mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    try {
      // Use bip39 to get seed, then create wallet with ethers
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const hdNode = ethers.HDNodeWallet.fromSeed(seed);
      
      // Derive the specific path for Ethereum
      const derivedNode = hdNode.derivePath(this.DERIVATION_PATH);
      
      return {
        address: this.toChecksumAddress(derivedNode.address),
        mnemonic,
        privateKey: derivedNode.privateKey
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet from mnemonic');
    }
  }

  /**
   * Convert address to EIP-55 checksum format
   */
  static toChecksumAddress(address: string): string {
    return ethers.getAddress(address);
  }

  /**
   * Validate if address is valid Ethereum address
   */
  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Validate mnemonic phrase
   */
  static validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }

  /**
   * Get derivation path for Ethereum
   */
  static getDerivationPath(): string {
    return this.DERIVATION_PATH;
  }
}
