# Prescription Tokens

A blockchain-powered medical prescription management demo built on [BSV](https://bsvblockchain.org). It walks through the full lifecycle of a prescription — from issuance to patient acknowledgement — with each step recorded as an on-chain token using [PushDrop](https://docs.bsvblockchain.org).

## How It Works

The app simulates four actors (doctor, patient, pharmacist, patient again) passing custody of a prescription token through four stages:

| Stage | Actor | What Happens |
|-------|-------|-------------|
| **1. Issuance** | Doctor | Creates a PushDrop token containing prescription data, signed and locked to the patient |
| **2. Presentation** | Patient | Unlocks the doctor's token, re-locks it for the pharmacy |
| **3. Dispensing** | Pharmacist | Unlocks the patient's token, creates a new lock for the patient |
| **4. Acknowledgement** | Patient | Unlocks the pharmacy's token, writes an OP_RETURN (proof of receipt) |

Each transition is a real BSV transaction broadcast to mainnet via [ARC](https://arc.gorillapool.io). The result is a verifiable, immutable chain of custody for the prescription.

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **MUI 7** — Component library
- **Vite 6** — Build tooling
- **@bsv/sdk** — Transaction creation, PushDrop token protocol, key management
- **@bsv/wallet-toolbox-client** — Wallet storage for the doctor role
- **IndexedDB** — Local persistence of transaction history

## Prerequisites

- Node.js 18+
- Three BSV private keys (256-bit hex) for the doctor, patient, and pharmacy roles
- A wallet storage endpoint for the doctor wallet

## Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/bsv-blockchain-demos/prescription-tokens.git
cd prescription-tokens
npm install
```

2. Create a `.env` file with the required keys:

```env
VITE_DOCTOR_KEY=<256-bit hex private key>
VITE_PATIENT_KEY=<256-bit hex private key>
VITE_PHARMACY_KEY=<256-bit hex private key>
VITE_WALLET_STORAGE_URL=https://storage.babbage.systems
```

3. Start the dev server:

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── App.tsx                              # Main layout with 4-stage workflow
├── main.tsx                             # Entry point, providers
├── i18n/
│   └── translations.ts                 # EN/ES translation strings
├── context/
│   ├── broadcast.tsx                    # Token state + ARC broadcast queue
│   └── language.tsx                     # Language context (EN/ES toggle)
├── components/
│   ├── ResultBox.tsx                    # Token data display + blockchain status
│   ├── SubmissionsLog.tsx               # Transaction history drawer
│   ├── types.ts                         # DataEntry, Token, Submission interfaces
│   ├── styles/
│   │   └── CardStyles.tsx               # Shared card styling
│   └── stages/
│       ├── 1CreatePrescriptionCard.tsx   # Doctor creates prescription
│       ├── 2PresentPrescriptionCard.tsx  # Patient presents to pharmacy
│       ├── 3DispensePrescriptionCard.tsx # Pharmacist dispenses medication
│       └── 4AcknowledgeReceiptCard.tsx   # Patient acknowledges receipt
├── theme/
│   └── theme.ts                         # MUI theme configuration
└── utils/
    ├── wallets.ts                       # BSV wallet setup (doctor, patient, pharmacy)
    ├── prescriptions.ts                 # Sample prescription data (EN/ES)
    └── db.ts                            # IndexedDB persistence
```

## Language Toggle

The app supports English and Spanish. A toggle in the header switches all UI text, field labels, status values, and sample data. The choice persists in `localStorage`.

## License

ISC
