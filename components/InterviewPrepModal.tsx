"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Loader2,
  BookOpen,
  MessageSquare,
  Building2,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { JobEmail, PrepNote } from "@/types";
import ReactMarkdown from "react-markdown";

interface InterviewPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobEmail | null;
}

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

export function InterviewPrepModal({
  isOpen,
  onClose,
  job,
}: InterviewPrepModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [prep, setPrep] = useState<PrepNote | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && job) {
      generatePrep();
    }
    if (!isOpen) {
      setPrep(null);
      setExpandedQuestion(null);
    }
  }, [isOpen, job]);

  const generatePrep = async () => {
    if (!job) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: job.company, role: job.role }),
      });
      const data = await res.json();
      setPrep(data);
    } catch {
      setPrep({
        questions: [
          `Describe your most complex project related to ${job?.role || "this role"}.`,
          `How do you approach working in a fast-paced, cross-functional team environment?`,
          `What's your approach to debugging a production issue with limited information?`,
        ],
        company_summary: `${job?.company || "This company"} is a leading technology organization known for innovation and engineering excellence.`,
        star_example: `**STAR Framework Example**\n\n**Situation:** Faced a critical deadline on a complex project.\n\n**Task:** Deliver a working solution within tight constraints.\n\n**Action:** Broke the problem down, collaborated with the team, and iterated quickly.\n\n**Result:** Delivered on time with high quality, earning stakeholder praise.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  const companyInitial = job.company.charAt(0).toUpperCase();
  const avatarShade = getAvatarShade(job.company);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-surface-200 rounded-2xl shadow-2xl animate-fade-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${avatarShade} flex items-center justify-center text-white font-bold`}
            >
              {companyInitial}
            </div>
            <div>
              <h2 className="text-surface-900 font-bold text-base flex items-center gap-2">
                Interview Prep
                <Sparkles className="w-4 h-4 text-surface-400" />
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

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-surface-500 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-surface-600 font-medium">
                  Generating Your Prep Notes
                </p>
                <p className="text-surface-400 text-sm mt-1">
                  Researching {job.company} and tailoring questions for{" "}
                  {job.role}...
                </p>
              </div>
            </div>
          ) : prep ? (
            <>
              {/* Company Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-surface-500" />
                  <h3 className="text-surface-500 text-sm font-semibold uppercase tracking-wider">
                    About {job.company}
                  </h3>
                </div>
                <div className="px-4 py-3 rounded-xl bg-surface-50 border border-surface-200">
                  <p className="text-surface-700 text-sm leading-relaxed">
                    {prep.company_summary}
                  </p>
                </div>
              </div>

              {/* Interview Questions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-surface-500" />
                  <h3 className="text-surface-500 text-sm font-semibold uppercase tracking-wider">
                    Likely Interview Questions
                  </h3>
                </div>
                <div className="space-y-2">
                  {prep.questions.map((q, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-surface-200 bg-white hover:bg-surface-50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedQuestion(expandedQuestion === i ? null : i)
                      }
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div className="w-6 h-6 rounded-lg bg-surface-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-surface-700 text-sm leading-relaxed flex-1">
                          {q}
                        </p>
                        {expandedQuestion === i ? (
                          <ChevronUp className="w-4 h-4 text-surface-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-surface-400 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                      {expandedQuestion === i && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="ml-9 p-3 rounded-lg bg-surface-100 border border-surface-200">
                            <p className="text-surface-500 text-xs font-semibold mb-1">
                              💡 Tip:
                            </p>
                            <p className="text-surface-500 text-xs leading-relaxed">
                              Use the STAR method below to structure your
                              answer. Focus on quantifiable outcomes and lessons
                              learned.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* STAR Method */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-surface-500" />
                  <h3 className="text-surface-500 text-sm font-semibold uppercase tracking-wider">
                    STAR Method Answer Framework
                  </h3>
                </div>
                <div className="px-5 py-4 rounded-xl bg-surface-50 border border-surface-200">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-surface-900 font-bold text-sm mt-4 mb-1 first:mt-0">
                            {children}
                          </h2>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-surface-900 font-bold">
                            {children}
                          </strong>
                        ),
                        p: ({ children }) => (
                          <p className="text-surface-600 text-sm leading-relaxed mb-2">
                            {children}
                          </p>
                        ),
                        li: ({ children }) => (
                          <li className="text-surface-600 text-sm">
                            {children}
                          </li>
                        ),
                      }}
                    >
                      {prep.star_example}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Regenerate */}
              <button
                onClick={generatePrep}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 hover:bg-surface-100 text-surface-500 hover:text-surface-800 text-sm font-medium transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Regenerate Prep Notes
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
