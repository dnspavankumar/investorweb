export type UserRole = "startup" | "investor";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FounderProfile {
  uid: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  funding: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorProfile {
  uid: string;
  firmName: string;
  minTicket: string;
  maxTicket: string;
  thesis: string;
  coInvestment: string;
  valueAdd: string[];
  preferredSectors: string[];
  stage: string;
  antiPortfolio: string;
  diligenceTimeframe: string;
  regionalFocus: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  id: string;
  name: string;
  type: string;
  industry: string;
  ticketSize: string;
  geography: string;
  matchScore: number;
  reasoning: string;
}

export interface MatchFilters {
  stage?: string;
  industry?: string;
}
