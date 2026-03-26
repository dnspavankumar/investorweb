import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  FounderProfile,
  InvestorProfile,
  MatchFilters,
  MatchResult,
  UserProfile,
  UserRole,
} from "@/types/firestore";

const USERS_COLLECTION = "users";
const FOUNDERS_COLLECTION = "founders";
const INVESTORS_COLLECTION = "investors";

const nowIso = () => new Date().toISOString();

const parseNumber = (value: string) => {
  const parsed = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatInr = (value: string | number) => {
  const numeric = typeof value === "number" ? value : parseNumber(value);
  if (!numeric) return "0";

  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numeric);
};

const clampScore = (score: number) => Math.max(45, Math.min(98, Math.round(score)));

const normalizeCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const founderInvestorScore = (founder: FounderProfile, investor: InvestorProfile) => {
  let score = 52;

  if (investor.preferredSectors.includes(founder.industry)) score += 24;
  if (investor.stage === founder.stage) score += 16;

  const locationLower = founder.location.toLowerCase();
  if (
    investor.regionalFocus.some(
      (region) =>
        region.toLowerCase().includes("pan-india") ||
        locationLower.includes(region.toLowerCase()) ||
        region.toLowerCase().includes(locationLower)
    )
  ) {
    score += 6;
  }

  if (investor.valueAdd.length > 0) score += 4;

  return clampScore(score);
};

const investorFounderScore = (investor: InvestorProfile, founder: FounderProfile) => {
  let score = 50;

  if (investor.preferredSectors.includes(founder.industry)) score += 24;
  if (investor.stage === founder.stage) score += 16;

  const ask = parseNumber(founder.funding);
  const min = parseNumber(investor.minTicket);
  const max = parseNumber(investor.maxTicket);
  if (ask > 0 && min > 0 && max > 0 && ask >= min && ask <= max) score += 6;

  const anti = normalizeCsv(investor.antiPortfolio);
  if (anti.length > 0 && anti.some((keyword) => founder.industry.toLowerCase().includes(keyword))) {
    score -= 14;
  }

  return clampScore(score);
};

const founderReasoning = (founder: FounderProfile, investor: InvestorProfile) => {
  const reasons: string[] = [];

  if (investor.preferredSectors.includes(founder.industry)) {
    reasons.push(`Strong sector fit in ${founder.industry}`);
  }
  if (investor.stage === founder.stage) {
    reasons.push(`Aligned on ${founder.stage.replace("_", " ")} stage`);
  }
  if (investor.valueAdd.length > 0) {
    reasons.push(`Can support with ${investor.valueAdd.slice(0, 2).join(" and ")}`);
  }

  return reasons.length > 0
    ? `${reasons.join(". ")}.`
    : "General profile compatibility based on investment preferences and startup profile.";
};

const investorReasoning = (investor: InvestorProfile, founder: FounderProfile) => {
  const reasons: string[] = [];

  if (investor.preferredSectors.includes(founder.industry)) {
    reasons.push(`Matches your ${founder.industry} sector focus`);
  }
  if (investor.stage === founder.stage) {
    reasons.push(`Fits your preferred ${founder.stage.replace("_", " ")} stage`);
  }

  const ask = parseNumber(founder.funding);
  const min = parseNumber(investor.minTicket);
  const max = parseNumber(investor.maxTicket);
  if (ask > 0 && min > 0 && max > 0 && ask >= min && ask <= max) {
    reasons.push("Funding ask is within your typical ticket range");
  }

  return reasons.length > 0
    ? `${reasons.join(". ")}.`
    : "Potential match based on available founder profile signals.";
};

export const upsertUserProfile = async ({
  uid,
  email,
  name,
  role,
}: {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}) => {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(ref);
  const existing = snapshot.data() as Partial<UserProfile> | undefined;

  const profile: UserProfile = {
    uid,
    email,
    name,
    role,
    onboardingCompleted: existing?.onboardingCompleted ?? false,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await setDoc(ref, profile, { merge: true });
  return profile;
};

export const getUserProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
};

export const setOnboardingCompleted = async (uid: string, completed: boolean) => {
  await setDoc(
    doc(db, USERS_COLLECTION, uid),
    { onboardingCompleted: completed, updatedAt: nowIso() },
    { merge: true }
  );
};

export const saveFounderProfile = async (
  uid: string,
  payload: Omit<FounderProfile, "uid" | "createdAt" | "updatedAt">
) => {
  const ref = doc(db, FOUNDERS_COLLECTION, uid);
  const snapshot = await getDoc(ref);
  const existing = snapshot.data() as Partial<FounderProfile> | undefined;

  const founder: FounderProfile = {
    uid,
    ...payload,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await setDoc(ref, founder, { merge: true });
  return founder;
};

export const saveInvestorProfile = async (
  uid: string,
  payload: Omit<InvestorProfile, "uid" | "createdAt" | "updatedAt">
) => {
  const ref = doc(db, INVESTORS_COLLECTION, uid);
  const snapshot = await getDoc(ref);
  const existing = snapshot.data() as Partial<InvestorProfile> | undefined;

  const investor: InvestorProfile = {
    uid,
    ...payload,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await setDoc(ref, investor, { merge: true });
  return investor;
};

export const getFounderProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, FOUNDERS_COLLECTION, uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as FounderProfile;
};

export const getInvestorProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, INVESTORS_COLLECTION, uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as InvestorProfile;
};

export const findMatchesForFounder = async (uid: string, filters: MatchFilters = {}) => {
  const founder = await getFounderProfile(uid);
  if (!founder) return [];

  const snapshot = await getDocs(query(collection(db, INVESTORS_COLLECTION), limit(100)));

  const matches: MatchResult[] = snapshot.docs
    .map((entry) => entry.data() as InvestorProfile)
    .filter((investor) => {
      if (filters.industry && !investor.preferredSectors.includes(filters.industry)) return false;
      if (filters.stage && investor.stage !== filters.stage) return false;
      return true;
    })
    .map((investor) => ({
      id: investor.uid,
      name: investor.firmName,
      type: "Investor",
      industry: investor.preferredSectors.slice(0, 2).join(", ") || "Generalist",
      ticketSize: `INR ${formatInr(investor.minTicket)} - INR ${formatInr(investor.maxTicket)}`,
      geography: investor.regionalFocus.join(", ") || "Global",
      matchScore: founderInvestorScore(founder, investor),
      reasoning: founderReasoning(founder, investor),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return matches;
};

export const findMatchesForInvestor = async (uid: string, filters: MatchFilters = {}) => {
  const investor = await getInvestorProfile(uid);
  if (!investor) return [];

  const snapshot = await getDocs(query(collection(db, FOUNDERS_COLLECTION), limit(100)));

  const matches: MatchResult[] = snapshot.docs
    .map((entry) => entry.data() as FounderProfile)
    .filter((founder) => {
      if (filters.industry && founder.industry !== filters.industry) return false;
      if (filters.stage && founder.stage !== filters.stage) return false;
      return true;
    })
    .map((founder) => ({
      id: founder.uid,
      name: founder.name,
      type: "Startup",
      industry: founder.industry,
      ticketSize: `Seeking INR ${formatInr(founder.funding)}`,
      geography: founder.location || "Not shared",
      matchScore: investorFounderScore(investor, founder),
      reasoning: investorReasoning(investor, founder),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return matches;
};
