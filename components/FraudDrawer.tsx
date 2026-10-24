"use client";

import React from "react";
import { X, AlertTriangle, ShieldAlert, Mail, Calendar } from "lucide-react";
import { JobEmail } from "@/types";

interface FraudDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fraudJobs: JobEmail[];
}

const FRAUD_RULE_ICONS: Record<string, string> = {
  "TRAINING FEE": "💸",
  "DOMAIN SPOOF": "🎭",
  "PREMATURE IDENTITY": "🪪",
};

function getFraudIcon(reason: string): string {
  const upper = reason.toUpperCase();
  for (const [key, icon] of Object.entries(FRAUD_RULE_ICONS)) {
    if (upper.includes(key)) return icon;
  }
  return "⚠️";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FraudDrawer({ isOpen, onClose, fraudJobs }: FraudDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer — white panel with solid red left border */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l-4 border-l-red-600 border-t border-b border-r border-surface-200 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-surface-900 font-bold text-base">
                Fraud Alerts
              </h2>
              <p className="text-red-600 text-xs font-semibold">
                {fraudJobs.length} suspicious email
                {fraudJobs.length !== 1 ? "s" : ""} detected
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

        {/* Warning banner */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-red-50 border-2 border-red-500">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-xs leading-relaxed">
              <strong className="text-red-700">Do not respond</strong> to these
              emails. Never send money, personal documents, or sensitive
              information to unverified senders.
            </p>
          </div>
        </div>

        {/* Fraud cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {fraudJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-surface-400">
              <ShieldAlert className="w-12 h-12 mb-3 text-surface-300" />
              <p className="text-sm font-medium text-surface-500">
                No fraud detected!
              </p>
              <p className="text-xs mt-1">Your inbox looks clean.</p>
            </div>
          ) : (
            fraudJobs.map((job, idx) => (
              <div
                key={job.id}
                className="rounded-xl border-2 border-red-500 bg-white overflow-hidden"
              >
                {/* Fraud card header */}
                <div className="px-4 py-3 bg-red-600 flex items-center gap-2">
                  <span className="text-lg">{getFraudIcon(job.fraud_reason || "")}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">
                      {job.company}
                    </p>
                    <p className="text-red-200 text-xs truncate">{job.role}</p>
                  </div>
                  <span className="text-red-200 text-xs font-mono">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Sender info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                      <Mail className="w-3 h-3" />
                      <span className="font-mono text-surface-600 truncate">
                        {job.sender_email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(job.date_received)}</span>
                    </div>
                  </div>

                  {/* Fraud reason */}
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-red-600 text-xs font-bold mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Why This Is Fraudulent:
                    </p>
                    <p className="text-red-700 text-xs leading-relaxed">
                      {job.fraud_reason}
                    </p>
                  </div>

                  {/* Email preview */}
                  <p className="text-surface-400 text-xs leading-relaxed line-clamp-3 italic">
                    &ldquo;{job.email_body.slice(0, 180)}...&rdquo;
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-200 text-center bg-surface-50">
          <p className="text-surface-400 text-xs">
            Report suspicious emails to{" "}
            <span className="text-surface-600 font-medium underline">
              reportfraud@ftc.gov
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
