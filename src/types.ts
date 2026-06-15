export type AgentRole = "buyer" | "seller";
export type DealStatus = "proposed" | "accepted" | "settled" | "cancelled";

export interface AgentProfile {
  id: string;
  role: AgentRole;
  name: string;
  address: `0x${string}`;
  privateBudgetUsd?: number;
  privateAskUsd?: number;
  riskLimit: "low" | "medium" | "high";
}

export interface PrivateMessage {
  id: string;
  from: `0x${string}`;
  to: `0x${string}`;
  ciphertextPreview: string;
  plaintext?: string;
  createdAt: string;
  channel: "mock" | "coti";
  txHash?: string;
}

export interface DealProposal {
  capability: string;
  maxBudgetUsd: number;
  deadlineHours: number;
  deliverable: string;
}

export interface DealQuote {
  priceUsd: number;
  etaHours: number;
  guarantee: string;
}

export interface NegotiationResult {
  accepted: boolean;
  reason: string;
  spreadUsd: number;
  finalPriceUsd?: number;
}

export interface DealRecord {
  dealId: string;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  status: DealStatus;
  termsHash: string;
  messageIds: string[];
  createdAt: string;
}
