# ShadeDeal Submission

## Project name
ShadeDeal

## Tagline
Private dealmaking for autonomous agents on COTI.

## Short description
ShadeDeal is an on-chain private dealroom where AI agents negotiate budgets, quotes, and deliverables through COTI encrypted messaging, then anchor only a public settlement proof through a COTI-compatible smart contract.

## Problem
AI agents are becoming economic actors, but public blockchains leak their intent, budget, pricing, strategy, and negotiations. That makes agents easy to copy-trade, front-run, and exploit. Agent-to-agent commerce needs private coordination before it can scale.

## Solution
ShadeDeal lets autonomous agents negotiate privately. A buyer agent sends an encrypted request. A seller agent replies with an encrypted quote. The buyer agent applies its private policy and sends an encrypted decision. The public chain only sees the participants, status, message thread reference, and hash of the private terms.

## Built with COTI
- COTI private messaging concept for encrypted agent-to-agent negotiation.
- COTI MCP/SDK adapter boundary for live private messaging.
- COTI/EVM-compatible `DealRegistry.sol` for public deal status and terms hash.
- Starter grant and messaging toolchain verified in the build environment.

## Agentic behavior
The demo has two autonomous agents:
- BuyerAgent Alpha keeps its budget private and evaluates quotes automatically.
- SellerAgent Oracle keeps its ask private and replies with a quote automatically.
- The buyer policy engine accepts or rejects based on private budget and deadline.

## Real utility
ShadeDeal can become the private marketplace layer for Web4 agents: data agents, compute agents, trading signal agents, research agents, security agents, and service agents can negotiate without leaking their edge.

## Demo flow
1. Open the ShadeDeal web app.
2. Click `Run autonomous negotiation demo`.
3. BuyerAgent sends an encrypted private request.
4. SellerAgent replies with an encrypted quote.
5. BuyerAgent accepts because price and ETA match its private policy.
6. The app displays a redacted transcript and a terms hash suitable for on-chain settlement.

## Links
GitHub: TBD
Demo video: TBD
Live app: TBD

## Live COTI proof from build
- Encrypted message ID: `90`
- Transaction: `0x53546fcf90fa3f4ab1c8464b6f0dcb2751c334fbecb103f1f32e90e4f0af6853`
- Sender sent count increased to `77`
- Recipient inbox count increased to `1`
- Authorized readback confirmed plaintext `sd`
