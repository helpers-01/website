import { supabase } from '../supabase/client';
import type { Database } from '@/types/database.types';

type Referral = Database['public']['Tables']['referrals']['Insert'];

export const referralService = {
  async generateCode(userId: string): Promise<string> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { error } = await supabase
      .from('profiles')
      .update({ referral_code: code })
      .eq('id', userId);
    
    if (error) throw error;
    return code;
  },

  async applyReferral(code: string, userId: string): Promise<void> {
    // Get referrer details
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', code)
      .single();

    if (referrerError) throw referrerError;
    if (!referrer) throw new Error('Invalid referral code');

    // Create referral record
    const referral: Referral = {
      referrer_id: referrer.id,
      referred_id: userId,
      code,
      status: 'pending',
      reward_amount: 100 // Configure reward amount as needed
    };

    const { error } = await supabase
      .from('referrals')
      .insert(referral);

    if (error) throw error;
  },

  async claimReward(referralId: string): Promise<void> {
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .single();

    if (referralError) throw referralError;
    if (!referral || referral.reward_claimed) {
      throw new Error('Reward already claimed or invalid referral');
    }

    // Update referral status
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'completed',
        reward_claimed: true,
        claimed_at: new Date().toISOString()
      })
      .eq('id', referralId);

    if (updateError) throw updateError;

    // Add reward to referrer's wallet
    await walletService.addFunds(
      referral.referrer_id,
      referral.reward_amount,
      `Referral reward for code ${referral.code}`
    );
  },

  async getReferralHistory(userId: string) {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:profiles!referred_id(email)
      `)
      .eq('referrer_id', userId);

    if (error) throw error;
    return data;
  }
};
