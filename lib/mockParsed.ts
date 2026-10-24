import { JobEmail } from "@/types";

// Pre-parsed fallback data — used when no LLM API key is present.
// Dates are set relative to today (2026-10-24) so follow-up logic works correctly.
export const MOCK_PARSED_EMAILS: JobEmail[] = [
  // ── APPLIED ──────────────────────────────────────────────
  {
    id: "a1b2c3d4-0001-0000-0000-000000000001",
    sender_email: "careers@stripe.com",
    sender_name: "Stripe Recruiting Team",
    company: "Stripe",
    role: "Software Engineer, Payments Infrastructure",
    date_received: "2026-10-17",
    email_body:
      "Thank you for applying to the Software Engineer, Payments Infrastructure role at Stripe! We've received your application and our recruiting team will be reviewing it over the next 1–2 weeks.",
    status: "Applied",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0002-0000-0000-000000000002",
    sender_email: "recruiting@notion.so",
    sender_name: "Notion HR",
    company: "Notion",
    role: "Product Designer",
    date_received: "2026-10-18",
    email_body:
      "We're excited to let you know that we received your application for the Product Designer position at Notion. Our team is currently reviewing applications and will reach out by November 1st.",
    status: "Applied",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0003-0000-0000-000000000003",
    sender_email: "talent@linear.app",
    sender_name: "Linear Talent Team",
    company: "Linear",
    role: "Frontend Engineer",
    date_received: "2026-10-13",
    email_body:
      "This email confirms we received your application for the Frontend Engineer role at Linear. We appreciate your interest and will review your profile shortly.",
    status: "Applied",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0004-0000-0000-000000000004",
    sender_email: "jobs@vercel.com",
    sender_name: "Vercel Careers",
    company: "Vercel",
    role: "Staff Engineer, Edge Runtime",
    date_received: "2026-10-10",
    email_body:
      "Your application for the Staff Engineer, Edge Runtime position has been received by the Vercel team. We'll review your submission and get back to you within two weeks.",
    status: "Applied",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0005-0000-0000-000000000005",
    sender_email: "applications@figma.com",
    sender_name: "Figma Recruiting",
    company: "Figma",
    role: "Senior Full-Stack Engineer",
    date_received: "2026-10-09",
    email_body:
      "Thank you for applying to the Senior Full-Stack Engineer role at Figma! We appreciate your interest in working with us. Our team reviews applications on a rolling basis and we'll be in touch.",
    status: "Applied",
    is_fraud: false,
    fraud_reason: null,
  },

  // ── INTERVIEW ─────────────────────────────────────────────
  {
    id: "a1b2c3d4-0006-0000-0000-000000000006",
    sender_email: "hr@shopify.com",
    sender_name: "Jake Morrison",
    company: "Shopify",
    role: "Senior Backend Engineer",
    date_received: "2026-10-20",
    email_body:
      "We've reviewed your application and we'd love to invite you to a technical interview for the Senior Backend Engineer role at Shopify! Please schedule a 60-minute video call with our engineering team.",
    status: "Interview",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0007-0000-0000-000000000007",
    sender_email: "recruit@datadog.com",
    sender_name: "Priya Nair",
    company: "Datadog",
    role: "Software Engineer II",
    date_received: "2026-10-21",
    email_body:
      "Great news! After reviewing your application, we'd like to move you forward to a technical screen for the Software Engineer II position at Datadog. This will be a 45-minute live coding session on CoderPad.",
    status: "Interview",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0008-0000-0000-000000000008",
    sender_email: "talent@openai.com",
    sender_name: "OpenAI Recruiting",
    company: "OpenAI",
    role: "Research Engineer, Alignment",
    date_received: "2026-10-22",
    email_body:
      "We're thrilled to move you forward in our hiring process for the Research Engineer, Alignment role at OpenAI! Your first-round interview has been scheduled for October 29th at 10:00 AM PST. Format: Technical discussion + system design, 90 minutes.",
    status: "Interview",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0009-0000-0000-000000000009",
    sender_email: "hiring@anthropic.com",
    sender_name: "Marcus Webb",
    company: "Anthropic",
    role: "Prompt Engineer, Claude Team",
    date_received: "2026-10-19",
    email_body:
      "Following your initial screening call, we'd like to invite you to a technical interview for the Prompt Engineer position on the Claude team at Anthropic. Please expect a calendar invite for November 2nd at 2:00 PM EST.",
    status: "Interview",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0010-0000-0000-000000000010",
    sender_email: "careers@github.com",
    sender_name: "GitHub Careers Team",
    company: "GitHub",
    role: "Developer Advocate",
    date_received: "2026-10-23",
    email_body:
      "Thank you for your patience! We've completed our initial review and would love to move forward with you for the Developer Advocate role at GitHub. A recruiter will reach out within 24 hours to schedule a call.",
    status: "Interview",
    is_fraud: false,
    fraud_reason: null,
  },

  // ── REJECTED ──────────────────────────────────────────────
  {
    id: "a1b2c3d4-0011-0000-0000-000000000011",
    sender_email: "no-reply@amazon.jobs",
    sender_name: "Amazon Talent Acquisition",
    company: "Amazon",
    role: "Software Development Engineer",
    date_received: "2026-10-14",
    email_body:
      "Thank you for your interest in the Software Development Engineer position at Amazon. After careful consideration, we have decided to move forward with other candidates at this time.",
    status: "Rejected",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0012-0000-0000-000000000012",
    sender_email: "careers@microsoft.com",
    sender_name: "Microsoft Careers Team",
    company: "Microsoft",
    role: "Cloud Solutions Architect",
    date_received: "2026-10-16",
    email_body:
      "Thank you for applying for the Cloud Solutions Architect role at Microsoft. We've completed our review and have decided not to move forward with your application at this point.",
    status: "Rejected",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0013-0000-0000-000000000013",
    sender_email: "noreply@meta.com",
    sender_name: "Meta Recruiting",
    company: "Meta",
    role: "Data Engineer, Reality Labs",
    date_received: "2026-10-18",
    email_body:
      "After reviewing your background, we won't be moving forward with your application for the Data Engineer, Reality Labs position at this time. Thank you for considering Meta.",
    status: "Rejected",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0014-0000-0000-000000000014",
    sender_email: "careers@spotify.com",
    sender_name: "The Spotify Team",
    company: "Spotify",
    role: "Backend Engineer",
    date_received: "2026-10-20",
    email_body:
      "Thank you for your enthusiasm about joining Spotify. We've carefully reviewed your application for the Backend Engineer role and will be moving in a different direction. We wish you the best in your search.",
    status: "Rejected",
    is_fraud: false,
    fraud_reason: null,
  },

  // ── OFFER ─────────────────────────────────────────────────
  {
    id: "a1b2c3d4-0015-0000-0000-000000000015",
    sender_email: "offers@stripe.com",
    sender_name: "Stripe People Team",
    company: "Stripe",
    role: "Software Engineer, Payments Infrastructure",
    date_received: "2026-10-23",
    email_body:
      "We are delighted to extend an offer for the Software Engineer, Payments Infrastructure position at Stripe! Base Salary: $185,000/year. Equity: 10,000 RSUs. Signing Bonus: $20,000. Please sign by October 30, 2026.",
    status: "Offer",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0016-0000-0000-000000000016",
    sender_email: "offers@datadog.com",
    sender_name: "Priya Nair",
    company: "Datadog",
    role: "Software Engineer II",
    date_received: "2026-10-24",
    email_body:
      "Congratulations! We are thrilled to offer you the Software Engineer II position at Datadog. Base: $165,000, RSUs: $40,000, Signing Bonus: $10,000. Please respond by October 31, 2026.",
    status: "Offer",
    is_fraud: false,
    fraud_reason: null,
  },
  {
    id: "a1b2c3d4-0017-0000-0000-000000000017",
    sender_email: "hiring@openai.com",
    sender_name: "OpenAI Recruiting",
    company: "OpenAI",
    role: "Research Engineer, Alignment",
    date_received: "2026-10-24",
    email_body:
      "Following your excellent performance in all interview rounds, we are pleased to extend an offer for the Research Engineer, Alignment role at OpenAI. The official letter will arrive via DocuSign within 48 hours.",
    status: "Offer",
    is_fraud: false,
    fraud_reason: null,
  },

  // ── FRAUD: SCAM 1 — Training Fee ──────────────────────────
  {
    id: "a1b2c3d4-0018-0000-0000-000000000018",
    sender_email: "globaltalentgroup.recruiter@gmail.com",
    sender_name: '"Google" HR Division',
    company: "Google (Impersonated)",
    role: "Senior Software Engineer",
    date_received: "2026-10-15",
    email_body:
      "Congratulations! You have been SELECTED for the Senior Software Engineer position at Google LLC! To reserve your position, you must pay a one-time refundable equipment and training fee of $299 via wire transfer within 48 hours.",
    status: "Applied",
    is_fraud: true,
    fraud_reason:
      "TRAINING FEE SCAM: Legitimate employers never request payment for equipment, onboarding, or training. This email demands a $299 wire transfer — a classic advance-fee fraud tactic.",
  },

  // ── FRAUD: SCAM 2 — Domain Spoofing ──────────────────────
  {
    id: "a1b2c3d4-0019-0000-0000-000000000019",
    sender_email: "googlehr.recruiter@gmail.com",
    sender_name: "Jennifer Walsh",
    company: "Google (Impersonated)",
    role: "Software Engineer (Remote)",
    date_received: "2026-10-19",
    email_body:
      "My name is Jennifer Walsh and I'm a senior HR manager at Google. We found your profile on LinkedIn and would like to offer you a Software Engineer position. Note: All communication will be through this Gmail account as our corporate email system is currently undergoing maintenance.",
    status: "Applied",
    is_fraud: true,
    fraud_reason:
      "DOMAIN SPOOFING: Sender claims to represent Google but is using a personal Gmail address (googlehr.recruiter@gmail.com). Google's official recruiting domains are @google.com. The excuse about 'corporate email maintenance' is a known social engineering tactic.",
  },

  // ── FRAUD: SCAM 3 — Premature Identity Request ────────────
  {
    id: "a1b2c3d4-0020-0000-0000-000000000020",
    sender_email: "hiring.fasttrack@outlook.com",
    sender_name: "FinCorp HR Fast-Track Division",
    company: "FinCorp Global Solutions (Unverified)",
    role: "Data Analyst",
    date_received: "2026-10-21",
    email_body:
      "We represent FinCorp Global Solutions and you have been selected for a Data Analyst position. To proceed, we require: Social Security Number (SSN), Aadhaar Card / PAN Card copy, Passport photo page, and Bank account details — all within 24 hours.",
    status: "Applied",
    is_fraud: true,
    fraud_reason:
      "PREMATURE IDENTITY REQUEST: This email demands highly sensitive documents (SSN, Aadhaar/PAN, passport, bank details) before any verified live interview has taken place. Legitimate employers never collect government IDs or bank information at the application stage. Sender uses a free Outlook address while claiming to represent a corporation.",
  },
];
