export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, app: "ShadeDeal", mode: process.env.COTI_MODE || "mock", runtime: "vercel" });
}
