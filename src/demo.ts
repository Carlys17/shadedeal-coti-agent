import "dotenv/config";
import { createCotiAdapter } from "./cotiAdapter.js";
import { defaultAgents, runNegotiation } from "./agents.js";

const { buyer } = defaultAgents();
const result = await runNegotiation(createCotiAdapter(buyer.address));
console.log(JSON.stringify(result, null, 2));
