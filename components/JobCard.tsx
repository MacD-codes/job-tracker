"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Building2,
  Briefcase,
  ChevronRight,
  Mail,
  Sparkles,
} from "lucide-react";
import { JobEmail } from "@/types";
import { StatusBadge } from "./StatusBadge";

interface JobCardProps {
  job: JobEmail;
  onGenerateFollowUp: (job: JobEmail) => void;
  onOpenPrepModal: (job: JobEmail) => void;
  isDragging?: boolean;
}

function getDaysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Deterministic initial for the company avatar (single letter, monochrome shade)
function getAvatarShade(company: string): string {
  const shades = [
    "bg-surface-700",
    "bg-surface-800",
    "bg-surface-600",
    "bg-surface-500",
    "bg-surface-900",
  ];
  return shades[company.charCodeAt(0) % shades.length];
}

export function JobCard({
  job,
  onGenerateFollowUp,
  onOpenPrepModal,
  isDragging = false,
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const daysAgo = getDaysAgo(job.date_received);
  const isFollowUpDue = job.status === "Applied" && daysAgo > 7 && !job.is_fraud;
  const isInterview = job.status === "Interview";

  // Fraud cards: solid red border (the only red accent in the board)
  const cardClasses = `
    relative group rounded-xl border transition-all duration-200 cursor-pointer bg-white
    ${isDragging ? "shadow-xl rotate-1 scale-105 opacity-90" : "hover:shadow-sm hover:-translate-y-px"}
    ${
      job.is_fraud
        ? "border-red-500 shadow-sm fraud-border"
        : "border-surface-200 hover:border-surface-300"
    }
  `;

  const companyInitial = job.company.charAt(0).toUpperCase();
  const avatarShade = getAvatarShade(job.company);

  return (
    <div
      className={cardClasses}
      onClick={() => {
        if (isInterview) onOpenPrepModal(job);
        else setIsExpanded(!isExpanded);
      }}
    >
      {/* Fraud Banner — solid red background, high contrast */}
      {job.is_fraud && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-t-xl">
          <AlertTriangle className="w-3.5 h-3.5 text-white flex-shrink-0" />
          <span className="text-white text-xs font-bold tracking-wide uppercase">
            ⚠ Fraud Alert Detected
          </span>
        </div>
      )}

      {/* Follow-up Due Banner */}
      {isFollowUpDue && (
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-100 border-b border-surface-200 rounded-t-xl">
          <Clock className="w-3.5 h-3.5 text-surface-500 flex-shrink-0" />
          <span className="text-surface-600 text-xs font-semibold">
            Follow-Up Due — {daysAgo} days since application
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Company Avatar */}
          <div
            className={`w-9 h-9 rounded-lg ${avatarShade} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
          >
            {companyInitial}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-surface-900 font-semibold text-sm truncate leading-tight">
                  {job.company}
                </p>
                <p className="text-surface-400 text-xs truncate mt-0.5">
                  {job.role}
                </p>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-surface-300 flex-shrink-0 transition-transform mt-0.5 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-surface-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(job.date_received)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <StatusBadge status={job.status} />
          {isInterview && (
            <span className="text-surface-400 text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Click to prep
            </span>
          )}
        </div>

        {/* Expanded: fraud reason or email body */}
        {(isExpanded || job.is_fraud) && (
          <div
            className={`mt-3 pt-3 border-t ${
              job.is_fraud ? "border-red-200" : "border-surface-100"
            }`}
          >
            {job.is_fraud && job.fraud_reason && (
              <div className="mb-3">
                <p className="text-red-600 text-xs font-bold mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Why this is suspicious:
                </p>
                <p className="text-red-600 text-xs leading-relaxed bg-red-50 border border-red-200 rounded p-2">
                  {job.fraud_reason}
                </p>
              </div>
            )}
            {isExpanded && !job.is_fraud && (
              <p className="text-surface-500 text-xs leading-relaxed line-clamp-4">
                {job.email_body}
              </p>
            )}
            {isExpanded && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1 text-surface-400 text-xs">
                  <Mail className="w-3 h-3" />
                  <span className="truncate font-mono">{job.sender_email}</span>
                </div>
                {job.sender_name && (
                  <div className="flex items-center gap-1 text-surface-400 text-xs">
                    <Building2 className="w-3 h-3" />
                    <span>{job.sender_name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Follow-up action button */}
        {isFollowUpDue && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerateFollowUp(job);
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-200 hover:border-surface-300 text-surface-700 text-xs font-semibold transition-all duration-150"
          >
            <Mail className="w-3.5 h-3.5" />
            Generate Follow-Up Email
            <ChevronRight className="w-3 h-3" />
          </button>
        )}

        {/* Interview prep hint */}
        {isInterview && !isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPrepModal(job);
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-900 hover:bg-surface-700 text-white text-xs font-semibold transition-all duration-150"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Interview Prep
          </button>
        )}
      </div>
    </div>
  );
}
