import 'dotenv/config';
import { createPublicClient, createWalletClient, http, parseGwei } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import artifact from '../artifacts/contracts/DealRegistry.sol/DealRegistry.json' with { type: 'json' };

const rpcUrl = process.env.COTI_MAINNET_RPC_URL || 'https://mainnet.coti.io/rpc';
const pk = process.env.PRIVATE_KEY;
if (!pk || !pk.startsWith('0x')) throw new Error('PRIVATE_KEY missing');

const chain = { id: 2632500, name: 'COTI Mainnet', nativeCurrency: { name: 'COTI', symbol: 'COTI', decimals: 18 }, rpcUrls: { default: { http: [rpcUrl] } } } as const;
const account = privateKeyToAccount(pk as `0x${string}`);
const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, chain, transport: http(rpcUrl) });

const balance = await publicClient.getBalance({ address: account.address });
console.log(`deployer=${account.address}`);
console.log(`balanceWei=${balance}`);

const hash = await walletClient.deployContract({
  abi: artifact.abi,
  bytecode: artifact.bytecode as `0x${string}`,
  account,
  gasPrice: parseGwei('2')
});
console.log(`tx=${hash}`);
const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
console.log(`status=${receipt.status}`);
console.log(`contract=${receipt.contractAddress}`);
console.log(`gasUsed=${receipt.gasUsed}`);
