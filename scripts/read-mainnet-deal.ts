import { createPublicClient, http, parseAbi } from "viem";

const registry = (process.env.COTI_DEAL_REGISTRY_ADDRESS || "0xf834e327dca3a30010163f9ca73f51f0cc2a8b84") as `0x${string}`;
const dealId = BigInt(process.env.DEAL_ID || "1");

const cotiMainnet = {
  id: 2632500,
  name: "COTI Mainnet",
  nativeCurrency: { name: "COTI", symbol: "COTI", decimals: 18 },
  rpcUrls: { default: { http: [process.env.COTI_RPC_URL || "https://mainnet.coti.io/rpc"] } }
} as const;

const abi = parseAbi([
  "function nextDealId() view returns (uint256)",
  "function deals(uint256) view returns (address buyer,address seller,bytes32 termsHash,string messageThreadId,uint8 status,uint256 createdAt,uint256 updatedAt)"
]);

const client = createPublicClient({ chain: cotiMainnet, transport: http(cotiMainnet.rpcUrls.default.http[0]) });
const nextDealId = await client.readContract({ address: registry, abi, functionName: "nextDealId" });
const d = await client.readContract({ address: registry, abi, functionName: "deals", args: [dealId] });

console.log(JSON.stringify({
  registry,
  nextDealId: nextDealId.toString(),
  dealId: dealId.toString(),
  buyer: d[0],
  seller: d[1],
  termsHash: d[2],
  messageThreadId: d[3],
  status: Number(d[4]),
  statusLabel: ["Proposed", "Accepted", "Settled", "Cancelled"][Number(d[4])] || "Unknown",
  createdAt: d[5].toString(),
  updatedAt: d[6].toString()
}, null, 2));
