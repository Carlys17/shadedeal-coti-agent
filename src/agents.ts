import type { AgentProfile, DealProposal, DealQuote, DealRecord } from "./types.js";
import type { CotiAdapter } from "./cotiAdapter.js";
import { negotiate, redactPrivateTerms, termsHash } from "./policy.js";

export function defaultAgents(): { buyer: AgentProfile; seller: AgentProfile } {
  return {
    buyer: {
      id: "buyer-alpha",
      role: "buyer",
      name: "BuyerAgent Alpha",
      address: (process.env.BUYER_AGENT_ADDRESS || "0x1111111111111111111111111111111111111111") as `0x${string}`,
      privateBudgetUsd: 750,
      riskLimit: "medium"
    },
    seller: {
      id: "seller-oracle",
      role: "seller",
      name: "SellerAgent Oracle",
      address: (process.env.SELLER_AGENT_ADDRESS || "0x2222222222222222222222222222222222222222") as `0x${string}`,
      privateAskUsd: 620,
      riskLimit: "low"
    }
  };
}

export async function runNegotiation(adapter: CotiAdapter) {
  const { buyer, seller } = defaultAgents();
  const proposal: DealProposal = {
    capability: "Generate a private market-risk report for an AI treasury agent",
    maxBudgetUsd: buyer.privateBudgetUsd ?? 0,
    deadlineHours: 6,
    deliverable: "Encrypted report summary + public completion proof"
  };

  const requestText = `REQUEST capability=${proposal.capability}; budget=$${proposal.maxBudgetUsd}; deadline=${proposal.deadlineHours}h; deliverable=${proposal.deliverable}`;
  const req = await adapter.sendPrivateMessage(seller.address, requestText, buyer.address);

  const quote: DealQuote = {
    priceUsd: seller.privateAskUsd ?? 0,
    etaHours: 4,
    guarantee: "seller stakes reputation; sensitive methods remain private"
  };
  const quoteText = `QUOTE price=$${quote.priceUsd}; eta=${quote.etaHours}h; guarantee=${quote.guarantee}; ref=${req.id}`;
  const q = await adapter.sendPrivateMessage(buyer.address, quoteText, seller.address);

  const decision = negotiate(proposal, quote);
  const decisionText = `DECISION accepted=${decision.accepted}; reason=${decision.reason}; finalPrice=$${decision.finalPriceUsd ?? 0}; quote=${q.id}`;
  const d = await adapter.sendPrivateMessage(seller.address, decisionText, buyer.address);

  const privateTerms = { proposal, quote, decision, requestMessageId: req.id, quoteMessageId: q.id, decisionMessageId: d.id };
  const deal: DealRecord = {
    dealId: `local-${Date.now()}`,
    buyer: buyer.address,
    seller: seller.address,
    status: decision.accepted ? "accepted" : "cancelled",
    termsHash: termsHash(privateTerms),
    messageIds: [req.id, q.id, d.id],
    createdAt: new Date().toISOString()
  };

  return {
    agents: { buyer: { ...buyer, privateBudgetUsd: undefined }, seller: { ...seller, privateAskUsd: undefined } },
    transcript: [req, q, d].map((m) => ({ ...m, plaintext: m.plaintext ? redactPrivateTerms(m.plaintext) : undefined })),
    decision,
    deal,
    privacyNote: "Budget, ask, final price, and negotiation strategy travel through encrypted COTI messages; only termsHash is intended for public settlement."
  };
}
