import { describe, expect, it } from "vitest";
import { negotiate, redactPrivateTerms, termsHash } from "../src/policy.js";

describe("ShadeDeal negotiation policy", () => {
  it("accepts a quote inside private budget and deadline", () => {
    const result = negotiate(
      { capability: "risk report", maxBudgetUsd: 750, deadlineHours: 6, deliverable: "report" },
      { priceUsd: 620, etaHours: 4, guarantee: "stake reputation" }
    );
    expect(result.accepted).toBe(true);
    expect(result.finalPriceUsd).toBe(620);
    expect(result.spreadUsd).toBe(130);
  });

  it("rejects a quote above private budget", () => {
    const result = negotiate(
      { capability: "risk report", maxBudgetUsd: 500, deadlineHours: 6, deliverable: "report" },
      { priceUsd: 620, etaHours: 4, guarantee: "stake reputation" }
    );
    expect(result.accepted).toBe(false);
    expect(result.reason).toContain("exceeds");
  });

  it("hashes terms and redacts sensitive terms", () => {
    expect(termsHash({ a: 1 })).toMatch(/^0x[0-9a-f]{64}$/);
    expect(redactPrivateTerms("budget=$750 price=$620 ask=$620")).not.toContain("750");
  });
});
