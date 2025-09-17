import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../context/WalletContext';
import { WalletManager } from '../utils/wallet';
import { StorageManager } from '../utils/storage';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const { createWallet, importWallet, isLoading } = useWallet();
  const [step, setStep] = useState<'welcome' | 'create' | 'import' | 'seed' | 'confirm'>('welcome');
  const [mnemonic, setMnemonic] = useState('');
  const [importMnemonic, setImportMnemonic] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleCreateWallet = async () => {
    try {
      setIsCreating(true);
      await createWallet();
      // Get the generated mnemonic for display
      const wallet = await StorageManager.loadWallet();
      if (wallet) {
        setMnemonic(wallet.mnemonic);
        setStep('seed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleImportWallet = async () => {
    if (!importMnemonic.trim()) {
      Alert.alert('Error', 'Please enter a valid mnemonic phrase.');
      return;
    }

    try {
      setIsImporting(true);
      await importWallet(importMnemonic.trim());
      setStep('confirm');
    } catch (error) {
      Alert.alert('Error', 'Invalid mnemonic phrase. Please check and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleContinue = async () => {
    try {
      await StorageManager.setOnboardingCompleted();
      navigation.navigate('Main' as never);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    }
  };

  const renderWelcome = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Mini Trust Wallet</Text>
        <Text style={styles.subtitle}>
          Your secure gateway to the Ethereum ecosystem
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => setStep('create')}
        >
          <Text style={styles.buttonText}>Create New Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setStep('import')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Import Existing Wallet
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreate = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Wallet</Text>
        <Text style={styles.subtitle}>
          We'll generate a secure 12-word recovery phrase for you
        </Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Important: Write down your recovery phrase and store it safely. 
          Anyone with access to this phrase can control your wallet.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCreateWallet}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Wallet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setStep('welcome')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImport = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Import Wallet</Text>
        <Text style={styles.subtitle}>
          Enter your 12 or 24-word recovery phrase
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Enter your recovery phrase (12 or 24 words separated by spaces):
        </Text>
        <TextInput
          style={styles.textArea}
          value={importMnemonic}
          onChangeText={setImportMnemonic}
          placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleImportWallet}
          disabled={isImporting}
        >
          {isImporting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Import Wallet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setStep('welcome')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSeed = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          Write down these 12 words in the exact order shown
        </Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Never share this phrase with anyone. Store it in a safe place.
        </Text>
      </View>

      <View style={styles.seedContainer}>
        {mnemonic.split(' ').map((word, index) => (
          <View key={index} style={styles.seedWord}>
            <Text style={styles.seedWordNumber}>{index + 1}</Text>
            <Text style={styles.seedWordText}>{word}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>I've Saved My Phrase</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderConfirm = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet Imported Successfully!</Text>
        <Text style={styles.subtitle}>
          Your wallet is ready to use
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue to Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {step === 'welcome' && renderWelcome()}
      {step === 'create' && renderCreate()}
      {step === 'import' && renderImport()}
      {step === 'seed' && renderSeed()}
      {step === 'confirm' && renderConfirm()}
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
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 50,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: '#ffffff',
  },
  warningBox: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  warningText: {
    color: '#ffc107',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    textAlignVertical: 'top',
  },
  seedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
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
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
