# Prescription Tokens

A React demonstration of a four-stage prescription handover using PushDrop tokens on BSV: a doctor issues a token, a patient presents it, a pharmacy dispenses, and the patient acknowledges receipt. The app uses generated sample prescription records and provides English and Spanish interfaces.

**This is a demonstration with real mainnet transactions.** All three role keys are loaded into the same browser application. It does not provide separate authenticated doctor, patient or pharmacy accounts.

## What is recorded

| Stage | Signing role | Transaction output |
| --- | --- | --- |
| Issue | Doctor | A three-satoshi PushDrop output containing the hash of the generated prescription data, locked for the patient. |
| Present | Patient | A two-satoshi PushDrop output with a status/timestamp and data hash, locked for the pharmacy. |
| Dispense | Pharmacy | A one-satoshi PushDrop output with a status/timestamp and prescription identifier, locked for the patient. |
| Acknowledge | Patient | A zero-satoshi `OP_FALSE OP_RETURN` output containing the acknowledgement and identifier. |

Each transition spends the previous token output. Full sample prescription data and transaction history are kept locally in IndexedDB; the on-chain fields vary by stage and do not contain the complete prescription record.

The doctor uses a wallet storage provider to create the initial funded transaction. The patient and pharmacy use local SDK `ProtoWallet` instances to sign later transitions. A background queue submits BEEF transactions to `https://arc.gorillapool.io/v1/tx`.

## Prerequisites

- Node.js 22 and npm.
- Three disposable demonstration private keys in hexadecimal format.
- A mainnet wallet storage endpoint compatible with the wallet-toolbox client.
- A doctor wallet with spendable outputs available through that storage provider.
- Network access to the storage provider and ARC endpoint.

The application includes a tracked `.env` and previously built files under `frontend/`. Treat any keys already distributed with this repository as exposed. Vite embeds `VITE_*` values in the browser bundle, so replacing those keys does not make the roles private from users of a deployed build.

## Local setup

```sh
git clone https://github.com/bsv-blockchain-demos/prescription-tokens.git
cd prescription-tokens
npm ci
```

Create a git-ignored `.env.local` with your demonstration configuration:

```dotenv
VITE_DOCTOR_KEY=<disposable doctor private key in hex>
VITE_PATIENT_KEY=<disposable patient private key in hex>
VITE_PHARMACY_KEY=<disposable pharmacy private key in hex>
VITE_WALLET_STORAGE_URL=<mainnet wallet storage URL>
```

Use distinct role keys and only funds intended for this demonstration. The doctor wallet needs usable wallet-managed outputs; a private key alone does not provision or fund its storage account. The application fixes the doctor wallet network to `main` and provides no environment-based network switch.

```sh
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. Configuration is read when the frontend starts or is built. Restart development or rebuild after changing it. The tracked `VITE_TAAL_TOKEN` setting is not read by the current broadcast code.

## Try the workflow

1. Select English or Spanish and use the first card to generate and issue a sample prescription.
2. Use the presentation, dispensing and acknowledgement cards in sequence.
3. Inspect each result and open the submissions log to see the locally retained transactions.
4. Check transaction acceptance separately before treating a stage as successfully recorded on-chain.

The UI advances and writes local history before the asynchronous broadcast queue has established success. Failed submissions are removed from the queue rather than retried automatically. A displayed stage or local log entry therefore does not establish network acceptance or mining.

IndexedDB stores history under `gas-chain-db`; the active handover is held in React state. Reloading does not automatically restore an in-progress workflow. Language preference is stored separately in `localStorage`.

## Development

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite. |
| `npm run build` | Type-check and build into `frontend/`. |
| `npm run preview` | Preview the generated frontend. |
| `npm run lint` | Run ESLint. |

No automated test script is defined. A successful frontend build does not verify funded wallet setup, ARC acceptance or a complete four-stage transaction chain.

- [src/utils/wallets.ts](src/utils/wallets.ts): role identities and wallet storage integration.
- [src/components/stages](src/components/stages): transaction creation for each handover.
- [src/context/broadcast.tsx](src/context/broadcast.tsx): submission queue and ARC requests.
- [src/utils/db.ts](src/utils/db.ts): local transaction history.
- [src/utils/prescriptions.ts](src/utils/prescriptions.ts): sample records.

## Licence

**Documented licence: ISC.** This is the declaration recorded in the project documentation. No standalone licence file or package licence declaration is included in this repository.
