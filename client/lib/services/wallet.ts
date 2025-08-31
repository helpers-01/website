import { supabase } from './clients';
import type { Database } from '@/types/database.types';

type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Insert'];

export const walletService = {
  async getBalance(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data?.wallet_balance || 0;
  },

  async addFunds(userId: string, amount: number, referenceId: string): Promise<void> {
    const transaction: WalletTransaction = {
      user_id: userId,
      amount,
      type: 'credit',
      status: 'completed',
      reference_id: referenceId,
      description: 'Added funds to wallet'
    };

    const { error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert(transaction);

    if (transactionError) throw transactionError;

    const { error: updateError } = await supabase.rpc('increment_wallet_balance', {
      user_id: userId,
      increment_amount: amount
    });

    if (updateError) throw updateError;
  },

  async deductFunds(userId: string, amount: number, description: string): Promise<void> {
    const transaction: WalletTransaction = {
      user_id: userId,
      amount,
      type: 'debit',
      status: 'completed',
      description
    };

    const { error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert(transaction);

    if (transactionError) throw transactionError;

    const { error: updateError } = await supabase.rpc('decrement_wallet_balance', {
      user_id: userId,
      decrement_amount: amount
    });

    if (updateError) throw updateError;
  },

  async getTransactions(userId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    return { transactions: data, total: count };
  }
};
