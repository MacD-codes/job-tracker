"use client";

import React from "react";
import { JobStatus } from "@/types";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; classes: string; dot: string }
> = {
  Applied: {
    label: "Applied",
    classes: "bg-surface-100 text-surface-600 border border-surface-200",
    dot: "bg-surface-400",
  },
  Interview: {
    label: "Interview",
    classes: "bg-surface-900 text-white border border-surface-900",
    dot: "bg-white",
  },
  Rejected: {
    label: "Rejected",
    classes: "bg-surface-50 text-surface-400 border border-surface-200",
    dot: "bg-surface-300",
  },
  Offer: {
    label: "Offer 🎉",
    classes: "bg-surface-800 text-white border border-surface-700",
    dot: "bg-surface-300",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
