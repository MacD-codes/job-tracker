"use client";

import React, { useState } from "react";
import { X, Mail, Copy, CheckCheck, Loader2, Send } from "lucide-react";
import { JobEmail } from "@/types";

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobEmail | null;
}

export function FollowUpModal({ isOpen, onClose, job }: FollowUpModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState<{
    subject: string;
    body: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  React.useEffect(() => {
    if (isOpen && job && !generated) {
      generateDraft();
    }
    if (!isOpen) {
      setDraft(null);
      setGenerated(false);
      setCopied(false);
    }
  }, [isOpen, job]);

  const generateDraft = async () => {
    if (!job) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: job.company,
          role: job.role,
          date_received: job.date_received,
        }),
      });
      const data = await res.json();
      setDraft(data);
      setGenerated(true);
    } catch {
      setDraft({
        subject: `Following Up – ${job.role} Application`,
        body: `Hi [Hiring Manager's Name],\n\nI wanted to follow up on my application for the ${job.role} position at ${job.company}. I remain very interested in this opportunity.\n\nPlease let me know if you need any additional information.\n\nBest regards,\n[Your Name]`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!draft) return;
    const text = `Subject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white border border-surface-200 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-900 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-surface-900 font-bold text-base">
                Follow-Up Email Draft
              </h2>
              <p className="text-surface-400 text-xs">
                {job.company} · {job.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-surface-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-surface-400 animate-spin" />
              <p className="text-surface-400 text-sm">
                Drafting your follow-up...
              </p>
            </div>
          ) : draft ? (
            <>
              {/* Subject line */}
              <div>
                <label className="text-surface-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Subject
                </label>
                <div className="px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-800 text-sm font-medium">
                  {draft.subject}
                </div>
              </div>

              {/* Email body */}
              <div>
                <label className="text-surface-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Email Body
                </label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, body: e.target.value } : null))
                  }
                  className="w-full h-64 px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-800 text-sm leading-relaxed resize-none outline-none focus:border-surface-400 focus:bg-white transition-all font-mono"
                />
              </div>

              {/* Hint */}
              <p className="text-surface-400 text-xs">
                💡 Replace placeholders in{" "}
                <span className="font-semibold text-surface-600">[brackets]</span>{" "}
                with your actual information before sending.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={generateDraft}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 hover:bg-surface-100 text-surface-600 hover:text-surface-900 text-sm font-medium transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-700 text-white font-semibold text-sm transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Full Email
                    </>
                  )}
                </button>
                <a
                  href={`mailto:?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 hover:bg-surface-100 text-surface-600 hover:text-surface-900 text-sm font-medium transition-all"
                >
                  <Send className="w-4 h-4" />
                  Open in Mail
                </a>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
