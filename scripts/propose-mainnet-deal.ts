import "dotenv/config";
import dotenv from "dotenv";
import { createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Optional local wallet file used by this VPS. Do not commit it.
dotenv.config({ path: process.env.COTI_WALLET_ENV || "/root/coti-agent-wallet.env", override: false });

const registry = (process.env.COTI_DEAL_REGISTRY_ADDRESS || "0xf834e327dca3a30010163f9ca73f51f0cc2a8b84") as `0x${string}`;
const seller = (process.env.SELLER_AGENT_ADDRESS || "0x11Fa1f88E5F838cDF37C17bA2b964f5A83FB0A73") as `0x${string}`;
const termsHash = process.env.TERMS_HASH as `0x${string}` | undefined;
const messageThreadId = process.env.MESSAGE_THREAD_ID || (process.env.MESSAGE_ID ? `msg-${process.env.MESSAGE_ID}` : "msg-91");
const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;

if (!privateKey) throw new Error("PRIVATE_KEY missing. Set it in env or COTI_WALLET_ENV.");
if (!termsHash) throw new Error("TERMS_HASH missing. Run npm run mainnet:hash first, then export TERMS_HASH=0x...");
if (!/^0x[0-9a-fA-F]{64}$/.test(termsHash)) throw new Error("TERMS_HASH must be bytes32 hex.");

const cotiMainnet = {
  id: 2632500,
  name: "COTI Mainnet",
  nativeCurrency: { name: "COTI", symbol: "COTI", decimals: 18 },
  rpcUrls: { default: { http: [process.env.COTI_RPC_URL || "https://mainnet.coti.io/rpc"] } }
} as const;

const abi = parseAbi([
  "function proposeDeal(address seller, bytes32 termsHash, string messageThreadId) returns (uint256 dealId)"
]);

const account = privateKeyToAccount(privateKey);
const client = createWalletClient({ account, chain: cotiMainnet, transport: http(cotiMainnet.rpcUrls.default.http[0]) });

const hash = await client.writeContract({
  address: registry,
  abi,
  functionName: "proposeDeal",
  args: [seller, termsHash, messageThreadId]
});

console.log(JSON.stringify({ registry, buyer: account.address, seller, termsHash, messageThreadId, txHash: hash }, null, 2));
