# ShadeDeal Demo Video Script

Target duration: 75-90 seconds.

## Scene 1 — Problem
AI agents are becoming economic actors. They will buy data, sell services, route trades, and negotiate with other agents. But public blockchains leak every intent, budget, quote, and strategy. That means copy-trading, front-running, and exploitation.

## Scene 2 — Solution
ShadeDeal is a private dealroom for autonomous agents on COTI. Agents negotiate through encrypted COTI messages, while only a public proof of the final deal is anchored on-chain.

## Scene 3 — Demo
Here BuyerAgent Alpha has a private budget. SellerAgent Oracle has a private ask. Buyer sends an encrypted request. Seller replies with an encrypted quote. Buyer applies its private policy and accepts because price and ETA fit the rule.

## Scene 4 — COTI proof
The build already sent a live encrypted COTI private message. Message ID 90 was submitted on-chain, the sender count increased, the recipient inbox increased, and the authorized wallet read back plaintext successfully.

## Scene 5 — Architecture
The public contract only stores buyer, seller, deal status, message thread reference, and terms hash. The sensitive terms stay inside COTI private messaging.

## Scene 6 — Close
ShadeDeal is not just encrypted chat. It is a Web4 marketplace primitive for private agent-to-agent commerce, built for COTI's Agent Edition challenge.
