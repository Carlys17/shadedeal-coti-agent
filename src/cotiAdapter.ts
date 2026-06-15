import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { PrivateMessage } from "./types.js";

export interface CotiAdapter {
  sendPrivateMessage(to: `0x${string}`, plaintext: string, from?: `0x${string}`): Promise<PrivateMessage>;
  listMessages(address: `0x${string}`): Promise<PrivateMessage[]>;
}

const dataDir = path.join(process.cwd(), "data");
const ledgerPath = path.join(dataDir, "mock-ledger.json");

async function readLedger(): Promise<PrivateMessage[]> {
  try {
    return JSON.parse(await fs.readFile(ledgerPath, "utf8")) as PrivateMessage[];
  } catch {
    return [];
  }
}

async function writeLedger(messages: PrivateMessage[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(ledgerPath, JSON.stringify(messages, null, 2));
}

export class MockCotiAdapter implements CotiAdapter {
  constructor(private defaultFrom: `0x${string}`) {}

  async sendPrivateMessage(to: `0x${string}`, plaintext: string, from: `0x${string}` = this.defaultFrom): Promise<PrivateMessage> {
    const msg: PrivateMessage = {
      id: `mock-${randomUUID()}`,
      from,
      to,
      plaintext,
      ciphertextPreview: `coti-gc:${Buffer.from(plaintext).toString("base64").slice(0, 20)}…`,
      createdAt: new Date().toISOString(),
      channel: "mock"
    };
    const ledger = await readLedger();
    ledger.push(msg);
    await writeLedger(ledger);
    return msg;
  }

  async listMessages(address: `0x${string}`): Promise<PrivateMessage[]> {
    const ledger = await readLedger();
    return ledger.filter((m) => m.to.toLowerCase() === address.toLowerCase() || m.from.toLowerCase() === address.toLowerCase());
  }
}

export class CotiMcpAdapter implements CotiAdapter {
  async sendPrivateMessage(to: `0x${string}`, plaintext: string): Promise<PrivateMessage> {
    throw new Error(
      `COTI_MODE=mcp selected, but this distributable uses Hermes MCP tools for live calls. ` +
      `Run the provided smoke-test instructions or wire your MCP stdio command here. Target=${to}, bytes=${Buffer.byteLength(plaintext)}`
    );
  }

  async listMessages(): Promise<PrivateMessage[]> {
    throw new Error("COTI_MODE=mcp listMessages requires the coti-agent-messaging MCP bridge.");
  }
}

export function createCotiAdapter(defaultFrom: `0x${string}`): CotiAdapter {
  return process.env.COTI_MODE === "mcp" ? new CotiMcpAdapter() : new MockCotiAdapter(defaultFrom);
}
