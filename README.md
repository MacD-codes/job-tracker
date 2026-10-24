# JobTrackr — AI-Powered Job Application Tracker & Fraud Detector

A full-stack Next.js 14 application that transforms a raw dump of job-seeker emails into an automated tracker board with fraud detection, follow-up reminders, and AI interview prep.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — [Download here](https://nodejs.org)
- **npm** (included with Node.js)

### Setup

```bash
# 1. Navigate to the project
cd job-tracker

# 2. Install dependencies
npm install

# 3. (Optional) Add API key for real LLM parsing
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY or ANTHROPIC_API_KEY

# 4. Start the dev server
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Email Ingestion Hub** | Paste raw email corpus or upload a `.txt` file |
| **AI Parsing** | LLM splits and structures each email (GPT-4o / Claude 3.5 / Mock) |
| **Kanban Board** | Drag-and-drop board: Applied → Interview → Rejected → Offer |
| **Fraud Detection** | 3-rule system: Training Fees, Domain Spoofing, Premature Identity Requests |
| **Fraud Drawer** | Slide-in panel with full fraud explanations for each flagged email |
| **Follow-Up Engine** | Cards older than 7 days show "Follow-Up Due" banner with draft generator |
| **Interview Prep** | Click any Interview card → AI-generated questions + STAR method example |

---

## 🏗 Project Structure

```
job-tracker/
├── app/
│   ├── api/
│   │   ├── parse-inbox/route.ts      # Email parsing endpoint
│   │   ├── generate-followup/route.ts # Follow-up draft generator
│   │   └── generate-prep/route.ts     # Interview prep generator
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Main page
├── components/
│   ├── InboxUploader.tsx              # Email paste/upload UI
│   ├── KanbanBoard.tsx                # Drag-and-drop Kanban
│   ├── JobCard.tsx                    # Individual job card
│   ├── StatusBadge.tsx                # Color-coded status pills
│   ├── FraudDrawer.tsx                # Fraud alerts side panel
│   ├── FollowUpModal.tsx              # Follow-up email modal
│   └── InterviewPrepModal.tsx         # Interview prep modal
├── lib/
│   ├── mockData.ts                    # Raw 20-email corpus
│   └── mockParsed.ts                  # Pre-parsed fallback data
└── types/
    └── index.ts                       # TypeScript interfaces
```

---

## 🛡 Fraud Detection Rules

The system flags emails matching **any** of these 3 rules:

1. **Training Fee Scam** — Requesting money, fees, or wire transfers for equipment/onboarding
2. **Domain Spoofing** — Using free email (Gmail, Outlook) while claiming to represent a corporation  
3. **Premature Identity Request** — Asking for SSN, Aadhaar, PAN, passport, or bank details before a live interview

---

## 🤖 API Configuration

The app works **without any API key** using realistic mock data (20 emails, 3 scams pre-loaded).

To enable real LLM parsing:
- **OpenAI**: Set `OPENAI_API_KEY` in `.env.local` → uses GPT-4o with JSON mode
- **Anthropic**: Set `ANTHROPIC_API_KEY` in `.env.local` → uses Claude 3.5 Sonnet

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Markdown**: react-markdown
- **AI**: OpenAI GPT-4o / Anthropic Claude 3.5 / Mock fallback
