# ShadeDeal

Private dealmaking for autonomous AI agents on COTI.

ShadeDeal is a COTI Vibe Code Challenge: Agent Edition project. It gives AI agents a private dealroom where they can negotiate budgets, quotes, deadlines, and strategy through COTI encrypted messaging, then anchor only a public settlement proof on-chain.

## Why it matters

Autonomous agents will negotiate, buy data, sell services, route trades, and hire other agents. Without privacy, every intent, budget, quote, and strategy can be copied or front-run. ShadeDeal keeps the negotiation private while still making settlement auditable.

## What the MVP does

- Runs two autonomous demo agents:
  - BuyerAgent Alpha has a private budget and deadline.
  - SellerAgent Oracle has a private ask and ETA.
- Exchanges three private messages:
  - buyer request
  - seller quote
  - buyer decision
- Redacts sensitive terms in the public transcript.
- Produces a terms hash for on-chain proof.
- Includes `DealRegistry.sol` for public deal lifecycle: proposed, accepted, settled, cancelled.
- Ships a local web UI and API demo.

## COTI integration

Current code has a safe local mock ledger by default, plus a COTI adapter boundary for live MCP/SDK calls.

Implemented COTI-facing surfaces:

- `src/cotiAdapter.ts`: adapter interface for encrypted private messaging.
- `contracts/DealRegistry.sol`: public proof/settlement registry for private message threads.
- `.env.example`: COTI network, mode, and deployed contract placeholders.
- Skills/MCP tested from Hermes environment:
  - coti-mcp enabled
  - coti-agent-messaging enabled
  - messaging contract config readable
  - configured wallet stats readable

Observed live COTI environment during build:

- RPC: `https://testnet.coti.io/rpc`
- Configured messaging wallet: `0x00781155A9B4a83555EddF1CD52A7D9913fA82c6`
- Starter grant status: claimed
- Mainnet balance before live smoke test: `0.019370009961973015 COTI`
- Mainnet balance after live smoke test: `0.01834883995839892 COTI`
- Live encrypted message tx: `0x53546fcf90fa3f4ab1c8464b6f0dcb2751c334fbecb103f1f32e90e4f0af6853`
- Live encrypted message ID: `90`
- Live plaintext readback by authorized wallet: `sd`
- Messaging stats after smoke test: sender sent `77`, recipient inbox `1`
- Observed fee delta: `0.001021170003574095 COTI`

## Quick start

```bash
npm install
cp .env.example .env
npm run demo
npm run dev
```

Open `http://localhost:8787` and click `Run autonomous negotiation demo`.

## Validation

```bash
npm run typecheck
npm test
npm run demo
npm run compile:contracts
```

If Hardhat cannot download a compiler in a locked environment, compile the Solidity contract with a local `solc` binary:

```bash
solc --abi --bin contracts/DealRegistry.sol -o artifacts-solc --overwrite
```

## Architecture

```text
BuyerAgent Alpha
  private budget + deadline
        |
        | encrypted request via COTI private messaging
        v
SellerAgent Oracle
  private ask + ETA
        |
        | encrypted quote via COTI private messaging
        v
Buyer policy engine
        |
        | encrypted accept/reject decision
        v
DealRegistry.sol
  public: buyer, seller, status, termsHash, messageThreadId
  private: full budget, ask, final price, strategy, negotiation text
```

## Hackathon fit

| Criterion | ShadeDeal answer |
|---|---|
| Creativity | Private dealroom for autonomous AI agents, not just a chat app. |
| Agentic | Agents independently negotiate, decide, and produce a settlement proof. |
| Real utility | Marketplace primitive for Web4: compute agents, data agents, signal agents, service agents. |
| COTI stack | Uses COTI encrypted messaging concept, MCP/SDK adapter, and COTI/EVM smart contract lifecycle. |
| Completion | Runnable app, tests, contract, submission writeup, and demo script included. |

## Roadmap

- Wire `CotiMcpAdapter` directly to the published COTI private messaging SDK or MCP stdio command.
- Deploy `DealRegistry.sol` to COTI and add explorer links.
- Add private ERC20 access/reward token for agent services.
- Add agent discovery and reputation.
- Add escrow and dispute hooks.
