'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { walletService } from '@/lib/services/wallet';
import { formatCurrency } from '@/lib/utils';

type Transaction = {
  id: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund';
  description: string;
  created_at: string;
};

export function WalletBalance() {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  async function loadWalletData() {
    try {
      const balance = await walletService.getBalance(user!.id);
      const { transactions } = await walletService.getTransactions(user!.id);
      setBalance(balance);
      setTransactions(transactions);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading wallet...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h2 className="text-lg font-semibold text-textPrimary">Wallet Balance</h2>
        <p className="text-3xl font-bold text-primary mt-2">
          {formatCurrency(balance)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="text-textPrimary font-medium">{tx.description}</p>
                <p className="text-sm text-textSecondary">
                  {new Date(tx.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className={tx.type === 'credit' ? 'text-success' : 'text-error'}>
                {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-textSecondary py-4">
              No transactions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
