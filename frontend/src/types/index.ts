export interface AuthUser {
  id: string;
  email: string;
  role: "user" | "system_admin";
}

export interface Contribution {
  id: string;
  amount: string;
  createdAt: string;
  userEmail: string;
}

export interface Member {
  id: string;
  email: string;
  role: "owner" | "member";
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  targetAmount: string;
  currency: string;
  totalSaved: string;
  status: "active" | "closed";
  endDate?: string;
  createdAt: string;
  contributions?: Contribution[];
  members?: Member[];
  progress?: number;
  userRole?: "owner" | "member";
}

export type Currency = "RWF" | "KES" | "UGX" | "NGN" | "GHS" | "USD";

export const CURRENCIES: Currency[] = ["RWF", "KES", "UGX", "NGN", "GHS", "USD"];

export interface CreateGroupPayload {
  name: string;
  description?: string;
  targetAmount: number;
  currency: Currency;
  endDate?: string;
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
  targetAmount?: number;
  endDate?: string;
}

export interface ContributePayload {
  amount: number;
}
