"use client";

import React, { useState, useCallback } from "react";
import {
  Inbox,
  LayoutDashboard,
  ShieldAlert,
  RefreshCw,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Linkedin,
  ShieldCheck,
} from "lucide-react";
import { JobEmail } from "@/types";
import { InboxUploader } from "@/components/InboxUploader";
import { KanbanBoard } from "@/components/KanbanBoard";
import { FraudDrawer } from "@/components/FraudDrawer";
import { FollowUpModal } from "@/components/FollowUpModal";
import { InterviewPrepModal } from "@/components/InterviewPrepModal";
import { LinkedInVerifier } from "@/components/LinkedInVerifier";

type View = "upload" | "board";
type Tab = "tracker" | "linkedin";

export default function HomePage() {
  const [view, setView] = useState<View>("upload");
  const [activeTab, setActiveTab] = useState<Tab>("tracker");
  const [jobs, setJobs] = useState<JobEmail[]>([]);
  const [parseSource, setParseSource] = useState<string>("");
  const [isFraudDrawerOpen, setIsFraudDrawerOpen] = useState(false);
  const [followUpJob, setFollowUpJob] = useState<JobEmail | null>(null);
  const [prepJob, setPrepJob] = useState<JobEmail | null>(null);

  const fraudJobs = jobs.filter((j) => j.is_fraud);
  const followUpDue = jobs.filter((j) => {
    const daysAgo = Math.floor(
      (new Date().getTime() - new Date(j.date_received).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return j.status === "Applied" && daysAgo > 7 && !j.is_fraud;
  });

  const handleParsed = useCallback((parsedJobs: JobEmail[], source: string) => {
    setJobs(parsedJobs);
    setParseSource(source);
    setView("board");
    if (parsedJobs.some((j) => j.is_fraud)) {
      setTimeout(() => setIsFraudDrawerOpen(true), 600);
    }
  }, []);

  const handleReset = () => {
    setView("upload");
    setJobs([]);
    setParseSource("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Navigation ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-surface-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-900 flex items-center justify-center">
              <Inbox className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-surface-900 text-lg tracking-tight">
              JobTrackr
            </span>
            <span className="hidden sm:block text-surface-400 text-xs border border-surface-200 rounded-full px-2 py-0.5 font-mono">
              v1.0
            </span>
          </div>

          {/* Tab navigation (always visible) */}
          <nav className="flex items-center gap-1">
            <button
              id="tab-tracker"
              onClick={() => setActiveTab("tracker")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "tracker"
                  ? "bg-surface-900 text-white"
                  : "text-surface-500 hover:text-surface-800 hover:bg-surface-100"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Job Tracker
            </button>
            <button
              id="tab-linkedin"
              onClick={() => setActiveTab("linkedin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "linkedin"
                  ? "bg-surface-900 text-white"
                  : "text-surface-500 hover:text-surface-800 hover:bg-surface-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              LinkedIn Verifier
            </button>
          </nav>

          {/* Board-only actions */}
          {activeTab === "tracker" && view === "board" && (
            <div className="flex items-center gap-2">
              {/* Parse source badge */}
              {parseSource && (
                <span
                  className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${
                    parseSource === "mock" || parseSource === "mock-fallback"
                      ? "bg-surface-100 border-surface-200 text-surface-500"
                      : "bg-surface-50 border-surface-200 text-surface-600"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {parseSource === "mock" || parseSource === "mock-fallback"
                    ? "Mock Mode"
                    : `Parsed via ${parseSource}`}
                </span>
              )}

              {/* Fraud alert button — only red element in header */}
              {fraudJobs.length > 0 && (
                <button
                  id="fraud-drawer-btn"
                  onClick={() => setIsFraudDrawerOpen(true)}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border-2 border-red-500 text-red-600 text-xs font-bold transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>
                    {fraudJobs.length} Fraud Alert
                    {fraudJobs.length !== 1 ? "s" : ""}
                  </span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </button>
              )}

              {/* Follow-up badge */}
              {followUpDue.length > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-200 text-surface-600 text-xs font-semibold">
                  <Bell className="w-3.5 h-3.5" />
                  {followUpDue.length} Follow-Up
                  {followUpDue.length !== 1 ? "s" : ""}
                </div>
              )}

              {/* Reset */}
              <button
                id="reset-btn"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-50 text-surface-500 hover:text-surface-800 text-xs font-medium transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Inbox
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main className="flex-1">
        {/* ── LinkedIn Verifier Tab ─────────────────────────────── */}
        {activeTab === "linkedin" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <LinkedInVerifier />
          </div>
        )}

        {/* ── Job Tracker Tab ───────────────────────────────────── */}
        {activeTab === "tracker" && (
          <>
            {view === "upload" ? (
              /* ── Landing / Upload View ─────────────────────── */
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                {/* Hero */}
                <div className="text-center mb-12">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-surface-900 flex items-center justify-center shadow-lg">
                      <Inbox className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-red-600 border-2 border-white flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-black text-surface-900 mb-4 leading-tight">
                    Your Job Application Tracker
                  </h1>
                  <p className="text-surface-500 text-lg max-w-2xl mx-auto leading-relaxed">
                    Paste your job email inbox and get an instant Kanban board,
                    fraud detection, follow-up reminders, and AI interview prep
                    — all in one place.
                  </p>

                  {/* Feature grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
                    {[
                      {
                        emoji: "📊",
                        label: "Kanban Board",
                        desc: "Auto-organized",
                      },
                      {
                        emoji: "🚨",
                        label: "Fraud Detection",
                        desc: "3-rule system",
                      },
                      { emoji: "⏰", label: "Follow-Ups", desc: "7-day alerts" },
                      {
                        emoji: "✨",
                        label: "Interview Prep",
                        desc: "STAR method",
                      },
                    ].map((f) => (
                      <div
                        key={f.label}
                        className="rounded-xl p-4 text-center border border-surface-200 bg-surface-50 hover:border-surface-300 hover:bg-white transition-all"
                      >
                        <div className="text-2xl mb-2">{f.emoji}</div>
                        <p className="text-surface-800 text-sm font-semibold">
                          {f.label}
                        </p>
                        <p className="text-surface-400 text-xs mt-0.5">
                          {f.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uploader */}
                <InboxUploader onParsed={handleParsed} />
              </div>
            ) : (
              /* ── Kanban Board View ───────────────────────────── */
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                {/* Board header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-surface-900 flex items-center gap-3">
                      <LayoutDashboard className="w-6 h-6" />
                      Application Tracker
                    </h2>
                    <p className="text-surface-400 text-sm mt-1">
                      {jobs.length} applications tracked ·{" "}
                      {fraudJobs.length > 0 ? (
                        <span className="text-red-600 font-semibold">
                          {fraudJobs.length} fraud alert
                          {fraudJobs.length !== 1 ? "s" : ""} —{" "}
                          <button
                            onClick={() => setIsFraudDrawerOpen(true)}
                            className="underline hover:text-red-700 transition-colors"
                          >
                            review now
                          </button>
                        </span>
                      ) : (
                        <span className="text-surface-500">inbox is clean ✓</span>
                      )}
                    </p>
                  </div>
                </div>

                <KanbanBoard
                  jobs={jobs}
                  onJobsChange={setJobs}
                  onGenerateFollowUp={setFollowUpJob}
                  onOpenPrepModal={setPrepJob}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-200 py-5 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-surface-400 text-xs">
            JobTrackr · Built with Next.js, Tailwind CSS &amp; AI parsing
          </p>
          <p className="text-surface-400 text-xs">
            🔒 All data stays in your browser — nothing is stored
          </p>
        </div>
      </footer>

      {/* ── Modals & Drawers ──────────────────────────────────────── */}
      <FraudDrawer
        isOpen={isFraudDrawerOpen}
        onClose={() => setIsFraudDrawerOpen(false)}
        fraudJobs={fraudJobs}
      />

      <FollowUpModal
        isOpen={!!followUpJob}
        onClose={() => setFollowUpJob(null)}
        job={followUpJob}
      />

      <InterviewPrepModal
        isOpen={!!prepJob}
        onClose={() => setPrepJob(null)}
        job={prepJob}
      />
    </div>
  );
}
