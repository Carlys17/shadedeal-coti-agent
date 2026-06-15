import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCotiAdapter } from "./cotiAdapter.js";
import { defaultAgents, runNegotiation } from "./agents.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "ShadeDeal", mode: process.env.COTI_MODE || "mock" });
});

app.post("/api/run-demo", async (_req, res, next) => {
  try {
    const { buyer } = defaultAgents();
    const adapter = createCotiAdapter(buyer.address);
    res.json(await runNegotiation(adapter));
  } catch (err) {
    next(err);
  }
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : String(err);
  res.status(500).json({ ok: false, error: message });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`ShadeDeal listening on http://localhost:${port}`));
