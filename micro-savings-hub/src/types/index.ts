export interface Contribution {
  id: string;
  group_id: string;
  member_name: string;
  amount: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  target_amount: string;
  currency: string;
  total_saved: string;
  created_at: string;
  contributions?: Contribution[];
}

export type Currency = 'RWF' | 'KES' | 'UGX' | 'NGN' | 'GHS' | 'USD';

export const CURRENCIES: Currency[] = ['RWF', 'KES', 'UGX', 'NGN', 'GHS', 'USD'];

export interface CreateGroupPayload {
  name: string;
  description?: string;
  targetAmount: number;
  currency: Currency;
}

export interface ContributePayload {
  memberName: string;
  amount: number;
}
