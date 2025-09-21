# 🚀 Mini Trust Wallet

A modern, secure Ethereum wallet built with React Native and Expo. Features a beautiful dark theme with glass morphism effects, BIP-39 mnemonic generation, and real-time balance fetching.

![Mini Trust Wallet](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)

## ✨ Features

### 🔐 Security
- **BIP-39 Mnemonic Generation**: 12-word recovery phrases
- **BIP-44 Derivation Path**: Standard Ethereum derivation (`m/44'/60'/0'/0/0`)
- **EIP-55 Checksummed Addresses**: Enhanced address validation
- **Secure Storage**: Uses Expo SecureStore for sensitive data
- **Private Key Management**: Secure key generation and storage

### 💰 Wallet Functionality
- **Create New Wallet**: Generate new Ethereum wallets
- **Import Existing Wallet**: Import using 12 or 24-word recovery phrases
- **Real-time Balance**: Fetch ETH balance from multiple RPC endpoints
- **QR Code Generation**: Share wallet addresses via QR codes
- **Address Copying**: Easy address sharing functionality

### 🎨 Modern UI/UX
- **Dark Theme**: Professional crypto wallet appearance
- **Glass Morphism**: Modern card designs with transparency effects
- **Gradient Accents**: Beautiful purple-blue gradients
- **Responsive Design**: Optimized for mobile devices
- **Smooth Animations**: Fluid user interactions

### 🔧 Technical Features
- **Multiple RPC Endpoints**: Reliable balance fetching with fallbacks
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth user experience during operations
- **TypeScript**: Full type safety throughout the application

## 📱 Screens

### Wallet Home
- Modern gradient balance card
- QR code for address sharing
- Real-time ETH balance display
- Clean, professional interface

### Onboarding
- Welcome screen with wallet creation options
- Secure seed phrase generation and display
- Import wallet functionality
- Clear instructions and warnings

### Settings
- Wallet information display
- Seed phrase backup functionality
- About information
- Logout functionality

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mini-trust-wallet.git
   cd mini-trust-wallet
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 📦 Dependencies

### Core Dependencies
- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library

### Crypto & Blockchain
- **ethers.js**: Ethereum library for wallet operations
- **bip39**: BIP-39 mnemonic generation and validation
- **expo-secure-store**: Secure storage for sensitive data

### UI & Styling
- **expo-linear-gradient**: Gradient backgrounds
- **react-native-svg**: SVG support for QR codes
- **@expo/vector-icons**: Icon library
- **react-native-qrcode-svg**: QR code generation

### Development
- **react-native-gesture-handler**: Gesture handling
- **react-native-reanimated**: Animations
- **@react-native-async-storage/async-storage**: Async storage

## 🏗️ Project Structure

```
mini_trust_wallet/
├── src/
│   ├── components/          # Reusable components
│   ├── context/            # React Context providers
│   │   └── WalletContext.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── OnboardingScreen.tsx
│   │   ├── WalletHomeScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── SeedBackupScreen.tsx
│   ├── services/          # External services
│   │   └── balanceService.ts
│   └── utils/             # Utility functions
│       ├── wallet.ts
│       └── storage.ts
├── app.json              # Expo configuration
├── App.tsx               # Main app component
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Configuration

### RPC Endpoints
The app uses multiple RPC endpoints for reliable balance fetching:

```typescript
private static readonly RPC_URLS = [
  'https://eth.llamarpc.com',
  'https://1rpc.io/eth',
  'https://ethereum-rpc.publicnode.com',
  'https://rpc.ankr.com/eth',
  'https://cloudflare-eth.com'
];
```

### Security Settings
- **Derivation Path**: `m/44'/60'/0'/0/0` (BIP-44 standard for Ethereum BlockChain)
- **Mnemonic Length**: 12 words (128-bit entropy)
- **Address Format**: EIP-55 checksummed addresses

## 🚀 Usage

### Creating a New Wallet
1. Open the app
2. Tap "Create New Wallet"
3. Securely save your 12-word recovery phrase
4. Confirm you've saved the phrase
5. Access your new wallet

### Importing an Existing Wallet
1. Open the app
2. Tap "Import Wallet"
3. Enter your 12 or 24-word recovery phrase
4. Tap "Import Wallet"
5. Access your imported wallet

### Managing Your Wallet
- **View Balance**: See your ETH balance in real-time
- **Share Address**: Copy address or share via QR code
- **Backup Seed**: View and backup your recovery phrase
- **Settings**: Access wallet information and logout

## 🔒 Security Considerations

### ⚠️ Important Security Notes
- **Never share your recovery phrase** with anyone
- **Store your recovery phrase securely** offline
- **This is a read-only wallet** - you can view balances but cannot send transactions
- **Test with small amounts** before using with significant funds
- **Keep your device secure** and updated

### Security Features
- Private keys never leave the device
- Secure storage using Expo SecureStore
- BIP-39 standard mnemonic generation
- EIP-55 address checksumming
- No network transmission of sensitive data

## 🧪 Testing

### Test with Known Addresses
You can test the balance fetching functionality with known addresses:
- **Vitalik's Address**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
- **Ethereum Foundation**: `0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe`

### Development Testing
```bash
# Run tests
npm test

# Run with specific environment
NODE_ENV=development npx expo start

# Clear cache and restart
npx expo start --clear
```

## 🐛 Troubleshooting

### Common Issues

#### Balance Not Loading
- Check internet connection
- Try refreshing the balance
- The app automatically tries multiple RPC endpoints

#### Import Wallet Failing
- Ensure recovery phrase is correct (12 or 24 words)
- Check for typos or extra spaces
- Words should be separated by single spaces

#### App Crashes
- Clear app cache: `npx expo start --clear`
- Restart the development server
- Check console for error messages

### Debug Mode
Enable debug logging by checking the console output for detailed information about:
- RPC endpoint usage
- Balance fetching attempts
- Error messages and stack traces

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethereum Foundation** for the Ethereum blockchain
- **Expo Team** for the amazing development platform
- **React Native Community** for the robust mobile framework
- **ethers.js Team** for the comprehensive Ethereum library
- **BIP-39/BIP-44** standards for wallet security

## 📞 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

## 🔮 Roadmap

### Planned Features
- [ ] Multi-currency support (ERC-20 tokens)
- [ ] Transaction history
- [ ] Send transactions (with proper security)
- [ ] DApp browser integration
- [ ] Hardware wallet support
- [ ] Biometric authentication
- [ ] Push notifications
- [ ] Dark/Light theme toggle

### Version History
- **v1.0.0** - Initial release with core wallet functionality
- **v1.1.0** - Enhanced UI/UX with modern design
- **v1.2.0** - Improved RPC reliability and error handling

---

**⚠️ Disclaimer**: This is a demonstration project. Always use established, audited wallets for significant funds. This software is provided "as is" without warranty of any kind.

**🔒 Security First**: Never share your recovery phrase, keep your device secure, and always verify addresses before transactions.

---

Made with ❤️ using React Native, Expo, and TypeScript
