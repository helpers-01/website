'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { referralService } from '@/lib/services/referral';

type ReferralHistory = {
  id: string;
  code: string;
  status: 'pending' | 'completed' | 'expired';
  reward_amount: number;
  reward_claimed: boolean;
  referred: {
    email: string;
  };
  created_at: string;
};

export function ReferralProgram() {
  const { user } = useAuthStore();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [history, setHistory] = useState<ReferralHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  async function loadReferralData() {
    try {
      // Generate code if not exists
      if (!referralCode) {
        const code = await referralService.generateCode(user!.id);
        setReferralCode(code);
      }

      // Load history
      const history = await referralService.getReferralHistory(user!.id);
      setHistory(history);
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (referralCode) {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading referral program...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h2 className="text-lg font-semibold text-textPrimary">Your Referral Code</h2>
        <div className="mt-4 flex items-center gap-4">
          <code className="bg-surface px-4 py-2 rounded-lg text-lg font-mono">
            {referralCode}
          </code>
          <button
            onClick={copyCode}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primaryLight transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Referral History</h3>
        <div className="space-y-4">
          {history.map((ref) => (
            <div
              key={ref.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="text-textPrimary font-medium">
                  Referred {ref.referred.email}
                </p>
                <p className="text-sm text-textSecondary">
                  {new Date(ref.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-textPrimary font-medium">
                  ₹{ref.reward_amount}
                </p>
                <p className={`text-sm ${
                  ref.status === 'completed' ? 'text-success' :
                  ref.status === 'expired' ? 'text-error' :
                  'text-warning'
                }`}>
                  {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-center text-textSecondary py-4">
              No referrals yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
