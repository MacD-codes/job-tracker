export type JobStatus = "Applied" | "Interview" | "Rejected" | "Offer";

export interface JobEmail {
  id: string;
  sender_email: string;
  sender_name: string;
  company: string;
  role: string;
  date_received: string; // YYYY-MM-DD
  email_body: string;
  status: JobStatus;
  is_fraud: boolean;
  fraud_reason: string | null;
}

export interface KanbanColumn {
  id: JobStatus;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  countColor: string;
}

export interface PrepNote {
  questions: string[];
  company_summary: string;
  star_example: string;
}

export interface FollowUpDraft {
  subject: string;
  body: string;
}

// LinkedIn verifier types
export interface LinkedInVerifyResult {
  is_verifiable: boolean;
  company_detected: string | null;
  risk_score: number;
  verdict_summary: string;
  red_flags: string[];
}

// Monochrome Kanban column definitions
export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "Applied",
    label: "Applied",
    bgColor: "bg-surface-50",
    borderColor: "border-surface-200",
    textColor: "text-surface-700",
    countColor: "bg-surface-200 text-surface-600",
  },
  {
    id: "Interview",
    label: "Interview",
    bgColor: "bg-surface-100",
    borderColor: "border-surface-300",
    textColor: "text-surface-800",
    countColor: "bg-surface-300 text-surface-700",
  },
  {
    id: "Rejected",
    label: "Rejected",
    bgColor: "bg-surface-50",
    borderColor: "border-surface-200",
    textColor: "text-surface-500",
    countColor: "bg-surface-200 text-surface-400",
  },
  {
    id: "Offer",
    label: "Offer 🎉",
    bgColor: "bg-surface-900",
    borderColor: "border-surface-800",
    textColor: "text-white",
    countColor: "bg-surface-700 text-surface-200",
  },
];
