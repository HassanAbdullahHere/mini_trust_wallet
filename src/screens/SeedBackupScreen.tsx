import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';

interface SeedBackupScreenProps {
  navigation: any;
}

export default function SeedBackupScreen({ navigation }: SeedBackupScreenProps) {
  const { wallet } = useWallet();
  const [isRevealed, setIsRevealed] = useState(false);

  if (!wallet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>No wallet found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleReveal = () => {
    Alert.alert(
      '⚠️ Security Warning',
      'Never share your seed phrase with anyone. Anyone with access to this phrase can control your wallet. Make sure you are in a private location.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'I Understand',
          onPress: () => setIsRevealed(true),
        },
      ]
    );
  };

  const handleHide = () => {
    setIsRevealed(false);
  };

  const handleCopy = async () => {
    try {
      await Share.share({
        message: wallet.mnemonic,
        title: 'Seed Phrase',
      });
    } catch (error) {
      console.error('Failed to copy seed phrase:', error);
    }
  };

  const handleBack = () => {
    if (isRevealed) {
      Alert.alert(
        'Hide Seed Phrase',
        'Are you sure you want to hide the seed phrase?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Hide',
            onPress: () => {
              setIsRevealed(false);
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Backup Seed Phrase</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={24} color="#FF9500" />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Keep Your Seed Phrase Safe</Text>
            <Text style={styles.warningDescription}>
              • Never share your seed phrase with anyone{'\n'}
              • Store it in a secure location{'\n'}
              • Anyone with this phrase can access your wallet{'\n'}
              • Write it down on paper, not digitally
            </Text>
          </View>
        </View>

        {/* Seed Phrase */}
        <View style={styles.seedContainer}>
          <Text style={styles.seedLabel}>Your 12-Word Recovery Phrase</Text>
          
          {!isRevealed ? (
            <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
              <Ionicons name="eye-outline" size={24} color="#007AFF" />
              <Text style={styles.revealButtonText}>Tap to Reveal</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.seedPhraseContainer}>
              <View style={styles.seedWords}>
                {wallet.mnemonic.split(' ').map((word, index) => (
                  <View key={index} style={styles.seedWord}>
                    <Text style={styles.seedWordNumber}>{index + 1}</Text>
                    <Text style={styles.seedWordText}>{word}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.seedActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                  <Ionicons name="copy-outline" size={20} color="#007AFF" />
                  <Text style={styles.actionButtonText}>Copy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleHide}>
                  <Ionicons name="eye-off-outline" size={20} color="#666" />
                  <Text style={styles.actionButtonText}>Hide</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Backup:</Text>
          <Text style={styles.instructionsText}>
            1. Write down each word in the exact order shown{'\n'}
            2. Store the written phrase in a secure location{'\n'}
            3. Never take a screenshot or store digitally{'\n'}
            4. Test your backup by importing the wallet elsewhere
          </Text>
        </View>

        {/* Security Tips */}
        <View style={styles.securityTips}>
          <Text style={styles.securityTitle}>Security Tips:</Text>
          <Text style={styles.securityText}>
            • Use a hardware wallet for large amounts{'\n'}
            • Consider using a passphrase for extra security{'\n'}
            • Keep multiple copies in different locations{'\n'}
            • Never enter your seed phrase on suspicious websites
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  warningText: {
    marginLeft: 16,
    flex: 1,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffc107',
    marginBottom: 12,
  },
  warningDescription: {
    fontSize: 15,
    color: '#ffc107',
    lineHeight: 24,
    fontWeight: '500',
  },
  seedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  seedLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  revealButtonText: {
    fontSize: 18,
    color: '#667eea',
    marginLeft: 12,
    fontWeight: '600',
  },
  seedPhraseContainer: {
    alignItems: 'center',
  },
  seedWords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  seedWord: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  seedWordNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667eea',
    marginRight: 12,
    minWidth: 24,
  },
  seedWordText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    fontWeight: '600',
  },
  seedActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.5)',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 6,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  instructionsText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
    fontWeight: '500',
  },
  securityTips: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  securityText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 50,
    fontWeight: '600',
  },
});
