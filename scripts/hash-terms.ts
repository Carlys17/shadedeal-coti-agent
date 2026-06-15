import { keccak256, toBytes } from "viem";

const payload = {
  app: "ShadeDeal",
  kind: process.env.DEAL_KIND || "deal-request",
  messageId: process.env.MESSAGE_ID || "91",
  text: process.env.DEAL_TEXT || "SD:req budget750 eta6h",
  seller: process.env.SELLER_AGENT_ADDRESS || "0x11Fa1f88E5F838cDF37C17bA2b964f5A83FB0A73"
};

const json = JSON.stringify(payload);
console.log(json);
console.log(keccak256(toBytes(json)));
