# ShadeDeal mainnet commands

These are the real COTI mainnet commands used by ShadeDeal. The web UI stays safe in mock mode by default so visitors do not spend gas. Real mainnet actions are done from the CLI with the wallet env loaded locally.

## 1. Verify app and contract

```bash
cd /root/shadedeal
npm run build
curl -sS https://shadedeal.vercel.app/api/health
DEAL_ID=1 npm run mainnet:read
```

## 2. Compute a real private terms hash

```bash
cd /root/shadedeal
MESSAGE_ID=91 \
DEAL_TEXT='SD:req budget750 eta6h' \
SELLER_AGENT_ADDRESS=0x11Fa1f88E5F838cDF37C17bA2b964f5A83FB0A73 \
npm run mainnet:hash
```

The second output line is the `TERMS_HASH` to anchor in `DealRegistry`.

## 3. Send the encrypted COTI private message

The Hermes COTI MCP server performs the encrypted send. The message body is encrypted on-chain and only sender/recipient can decrypt it.

Current real mainnet proof already sent:

```text
messageId: 91
tx: 0xfbecfeced2d03578dbc3880facd35fb433ef782e1179d682ddf53ed9624f423d
plaintext readback by authorized wallet: SD:req budget750 eta6h
recipient: 0x11Fa1f88E5F838cDF37C17bA2b964f5A83FB0A73
```

Explorer:

```text
https://mainnet.cotiscan.io/tx/0xfbecfeced2d03578dbc3880facd35fb433ef782e1179d682ddf53ed9624f423d
```

If running through Hermes, call the `coti-agent-messaging.send_message` MCP tool with:

```json
{
  "to": "0x11Fa1f88E5F838cDF37C17bA2b964f5A83FB0A73",
  "plaintext": "SD:req budget750 eta6h",
  "maxChunkBytes": 24,
  "gasBufferBps": 1000
}
```

## 4. Propose the real deal on COTI mainnet DealRegistry

```bash
cd /root/shadedeal
export COTI_WALLET_ENV=/root/coti-agent-wallet.env
export COTI_DEAL_REGISTRY_ADDRESS=0xf834e327dca3a30010163f9ca73f51f0cc2a8b84
export SELLER_AGENT_ADDRESS=0x11Fa1f88E5F838cDF37C17bA2b964f5A83FB0A73
export MESSAGE_THREAD_ID=msg-91
export TERMS_HASH=0x493729d0803317d2b32ae2ce757f3e6ec90616cc51364044d32ae7e9f1ea68b9
npm run mainnet:propose
```

Current real mainnet proof already proposed:

```text
dealId: 1
tx: 0xb3af18f64950604795a35aaf78988fc8c5fb5ea429829942be9228eddf49c70a
registry: 0xf834e327dca3a30010163f9CA73f51F0cC2a8b84
status: Proposed
```

Explorer:

```text
https://mainnet.cotiscan.io/tx/0xb3af18f64950604795a35aaf78988fc8c5fb5ea429829942be9228eddf49c70a
```

## 5. Read the real on-chain deal

```bash
cd /root/shadedeal
DEAL_ID=1 npm run mainnet:read
```

Expected current output includes:

```json
{
  "dealId": "1",
  "buyer": "0x00781155A9B4a83555EddF1CD52A7D9913fA82c6",
  "seller": "0x11Fa1f88E5F838cDF37C17bA2b964f5A83FB0A73",
  "termsHash": "0x493729d0803317d2b32ae2ce757f3e6ec90616cc51364044d32ae7e9f1ea68b9",
  "messageThreadId": "msg-91",
  "statusLabel": "Proposed"
}
```

## Why UI is not default-real

The deployed public UI is intentionally defaulted to mock mode because a public Vercel endpoint that spends mainnet gas would let anyone drain the wallet. The real path is CLI-gated with wallet env on the VPS. For production, add login/rate-limit/signature auth before exposing a `/api/mainnet/*` endpoint.
