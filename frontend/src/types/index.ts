export interface Contribution {
  id: string;
  amount: string;
  createdAt: string;
  userEmail: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  targetAmount: string;
  currency: string;
  totalSaved: string;
  createdAt: string;
  contributions?: Contribution[];
  progress?: number;
  userRole?: "owner" | "member";
}

export type Currency = "RWF" | "KES" | "UGX" | "NGN" | "GHS" | "USD";

export const CURRENCIES: Currency[] = [
  "RWF",
  "KES",
  "UGX",
  "NGN",
  "GHS",
  "USD",
];

export interface CreateGroupPayload {
  name: string;
  description?: string;
  targetAmount: number;
  currency: Currency;
}

export interface ContributePayload {
  memberName?: string;
  amount: number;
}
