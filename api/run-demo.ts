import { createCotiAdapter } from "../src/cotiAdapter.js";
import { defaultAgents, runNegotiation } from "../src/agents.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  try {
    const { buyer } = defaultAgents();
    const adapter = createCotiAdapter(buyer.address);
    const result = await runNegotiation(adapter);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message });
  }
}
