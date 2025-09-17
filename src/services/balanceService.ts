import { ethers } from 'ethers';

export interface BalanceData {
  balance: string;
  balanceInEth: string;
  isLoading: boolean;
  error?: string;
  rpcEndpoint?: string;
}

export class BalanceService {
  private static readonly RPC_URLS = [
    'https://eth.llamarpc.com',
    'https://1rpc.io/eth',
    'https://ethereum-rpc.publicnode.com',
    'https://rpc.ankr.com/eth',
    'https://cloudflare-eth.com'
  ];

  private static pendingRequests = new Map<string, Promise<BalanceData>>();


  /**
   * Fetch ETH balance for an address
   */
  static async getBalance(address: string): Promise<BalanceData> {
    // Check if there's already a pending request for this address
    if (this.pendingRequests.has(address)) {
      console.log('⏳ Reusing pending request for address:', address);
      return this.pendingRequests.get(address)!;
    }

    console.log('Fetching balance for address:', address);
    console.log('Using RPC URLs:', this.RPC_URLS);

    const balancePromise = this.fetchBalanceFromRPCs(address);
    this.pendingRequests.set(address, balancePromise);

    try {
      const result = await balancePromise;
      return result;
    } finally {
      // Clean up the pending request
      this.pendingRequests.delete(address);
    }
  }

  private static async fetchBalanceFromRPCs(address: string): Promise<BalanceData> {
    for (let i = 0; i < this.RPC_URLS.length; i++) {
      const rpcUrl = this.RPC_URLS[i];
      console.log(`Trying RPC ${i + 1}/${this.RPC_URLS.length}: ${rpcUrl}`);
      
      try {
        const provider = new ethers.JsonRpcProvider(rpcUrl, 'mainnet', {
          staticNetwork: true
        });
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const balancePromise = provider.getBalance(address);
        const balance = await Promise.race([balancePromise, timeoutPromise]) as bigint;
        const balanceInEth = ethers.formatEther(balance);
        
        console.log(`✅ Successfully fetched balance from ${rpcUrl}: ${balanceInEth} ETH`);
        
        return {
          balance: balance.toString(),
          balanceInEth,
          isLoading: false,
          rpcEndpoint: rpcUrl
        };
      } catch (error) {
        console.warn(`❌ Failed to fetch balance from ${rpcUrl}:`, error);
        // Small delay before trying next RPC
        if (i < this.RPC_URLS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        continue;
      }
    }

    console.error('❌ All RPC endpoints failed');
    return {
      balance: '0',
      balanceInEth: '0.0',
      isLoading: false,
      error: 'Failed to fetch balance from all RPC endpoints'
    };
  }

  /**
   * Format balance for display
   */
  static formatBalance(balanceInEth: string): string {
    const balance = parseFloat(balanceInEth);
    
    if (balance === 0) {
      return '0.00 ETH';
    } else if (balance < 0.000001) {
      return `${balance.toFixed(8)} ETH`;
    } else if (balance < 0.001) {
      return `${balance.toFixed(6)} ETH`;
    } else if (balance < 1) {
      return `${balance.toFixed(4)} ETH`;
    } else {
      return `${balance.toFixed(2)} ETH`;
    }
  }
}
