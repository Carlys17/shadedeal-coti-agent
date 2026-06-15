import type { HardhatUserConfig } from "hardhat/config";
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    cotiTestnet: {
      type: "http",
      url: process.env.COTI_TESTNET_RPC_URL || "https://testnet.coti.io/rpc",
      chainId: 7082400,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};

export default config;
