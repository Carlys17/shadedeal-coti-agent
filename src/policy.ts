import { createHash } from "node:crypto";
import type { DealProposal, DealQuote, NegotiationResult } from "./types.js";

export function negotiate(proposal: DealProposal, quote: DealQuote): NegotiationResult {
  const spreadUsd = proposal.maxBudgetUsd - quote.priceUsd;
  if (quote.priceUsd > proposal.maxBudgetUsd) {
    return { accepted: false, reason: `quote exceeds private budget by $${Math.abs(spreadUsd)}`, spreadUsd };
  }
  if (quote.etaHours > proposal.deadlineHours) {
    return { accepted: false, reason: `ETA ${quote.etaHours}h misses deadline ${proposal.deadlineHours}h`, spreadUsd };
  }
  return { accepted: true, reason: "price and ETA satisfy buyer policy", spreadUsd, finalPriceUsd: quote.priceUsd };
}

export function termsHash(payload: unknown): `0x${string}` {
  return `0x${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`;
}

export function redactPrivateTerms(text: string): string {
  return text
    .replace(/budget\s*[:=]\s*\$?\d+/gi, "budget: [encrypted]")
    .replace(/ask\s*[:=]\s*\$?\d+/gi, "ask: [encrypted]")
    .replace(/price\s*[:=]\s*\$?\d+/gi, "price: [encrypted]");
}
