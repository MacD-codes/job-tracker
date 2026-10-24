"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  TriangleAlert,
} from "lucide-react";
import { LinkedInVerifyResult } from "@/types";

export function LinkedInVerifier() {
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LinkedInVerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!postContent.trim()) {
      setError("Please paste a LinkedIn post before verifying.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/verify-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postContent }),
      });

      if (!res.ok) throw new Error("Server error");

      const data: LinkedInVerifyResult = await res.json();
      setResult(data);
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPostContent("");
    setResult(null);
    setError(null);
  };

  // Risk band helpers
  function getRiskBand(score: number): {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    strokeColor: string;
  } {
    if (score <= 25) {
      return {
        label: "Low Risk",
        color: "#16a34a",
        bgColor: "#f0fdf4",
        borderColor: "#bbf7d0",
        textColor: "#15803d",
        strokeColor: "#16a34a",
      };
    } else if (score <= 50) {
      return {
        label: "Moderate Risk",
        color: "#d97706",
        bgColor: "#fffbeb",
        borderColor: "#fde68a",
        textColor: "#b45309",
        strokeColor: "#f59e0b",
      };
    } else if (score <= 75) {
      return {
        label: "High Risk",
        color: "#dc2626",
        bgColor: "#fef2f2",
        borderColor: "#fecaca",
        textColor: "#b91c1c",
        strokeColor: "#ef4444",
      };
    } else {
      return {
        label: "Critical Risk",
        color: "#991b1b",
        bgColor: "#fef2f2",
        borderColor: "#ef4444",
        textColor: "#7f1d1d",
        strokeColor: "#dc2626",
      };
    }
  }

  // SVG ring circumference for a r=40 circle: 2π×40 ≈ 251.2
  const CIRC = 251.2;

  const renderResult = () => {
    if (!result) return null;
    const band = getRiskBand(result.risk_score);
    const isVerifiable = result.is_verifiable;
    const dashOffset = CIRC - (result.risk_score / 100) * CIRC;

    return (
      <div
        className="mt-6 border rounded-xl overflow-hidden animate-fade-in"
        style={{
          borderColor: isVerifiable ? "#d1d5db" : "#dc2626",
          borderWidth: isVerifiable ? "1px" : "2px",
        }}
        id="linkedin-verify-result"
      >
        {/* Result Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: isVerifiable ? "#f9fafb" : "#fef2f2",
            borderBottom: `1px solid ${isVerifiable ? "#e5e7eb" : "#fecaca"}`,
          }}
        >
          <div className="flex items-center gap-3">
            {isVerifiable ? (
              <ShieldCheck className="w-6 h-6 text-green-700" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-red-600" />
            )}
            <div>
              <p
                className="font-bold text-base"
                style={{ color: isVerifiable ? "#15803d" : "#b91c1c" }}
              >
                {isVerifiable
                  ? "✓ Verifiable Job Post"
                  : "⚠ Suspicious / Fishy Posting"}
              </p>
              {result.company_detected && (
                <p className="text-xs text-surface-500 mt-0.5">
                  Company detected:{" "}
                  <span className="font-semibold text-surface-700">
                    {result.company_detected}
                  </span>
                </p>
              )}
              {!result.company_detected && (
                <p className="text-xs text-red-600 mt-0.5">
                  No verifiable company name found
                </p>
              )}
            </div>
          </div>

          {/* Stamp */}
          <div
            className="hidden sm:flex items-center justify-center w-20 h-20 rounded-full border-4 rotate-[-8deg] flex-shrink-0"
            style={{
              borderColor: isVerifiable ? "#16a34a" : "#dc2626",
              color: isVerifiable ? "#16a34a" : "#dc2626",
            }}
          >
            <div className="text-center leading-tight">
              {isVerifiable ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-0.5" />
                  <span className="text-[9px] font-black tracking-widest uppercase block">
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mx-auto mb-0.5" />
                  <span className="text-[9px] font-black tracking-widest uppercase block">
                    Fishy
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 bg-white space-y-6">
          {/* Risk Score Ring + Summary side by side */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* SVG Ring */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <svg width="90" height="90" viewBox="0 0 90 90">
                {/* Track */}
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="7"
                />
                {/* Score arc */}
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  fill="none"
                  stroke={band.strokeColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 45 45)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
                <text
                  x="45"
                  y="45"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="18"
                  fontWeight="800"
                  fill={band.color}
                >
                  {result.risk_score}
                </text>
              </svg>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: band.textColor }}
              >
                {band.label}
              </span>
              <span className="text-xs text-surface-400">Risk Score / 100</span>
            </div>

            {/* Verdict summary */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">
                Verdict Summary
              </p>
              <p className="text-sm text-surface-700 leading-relaxed">
                {result.verdict_summary}
              </p>
            </div>
          </div>

          {/* Red Flags */}
          {result.red_flags.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1.5">
                <TriangleAlert className="w-3.5 h-3.5" />
                Red Flags Detected ({result.red_flags.length})
              </p>
              <ul className="space-y-2">
                {result.red_flags.map((flag, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <span className="mt-1 w-4 h-4 rounded-full border-2 border-red-400 flex items-center justify-center flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 block" />
                    </span>
                    <span className="text-surface-700 leading-snug">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>No structural red flags identified in this post.</span>
            </div>
          )}
        </div>

        {/* Reset link */}
        <div className="px-6 py-3 bg-surface-50 border-t border-surface-200 flex justify-end">
          <button
            onClick={handleReset}
            className="text-xs text-surface-400 hover:text-surface-700 transition-colors underline"
          >
            Clear & verify another post
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Panel header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-surface-900 flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6" />
          LinkedIn Post Verifier
        </h2>
        <p className="text-surface-500 text-sm mt-1 max-w-xl">
          Paste any LinkedIn job post below to instantly check for engagement
          traps, anonymous recruiters, high-risk phrases, and scam patterns.
        </p>
      </div>

      {/* Input card */}
      <div className="mono-card p-6 space-y-4">
        <div>
          <label
            htmlFor="linkedin-post-input"
            className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2"
          >
            Raw LinkedIn Post Content
          </label>
          <textarea
            id="linkedin-post-input"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            disabled={isLoading}
            placeholder={`Paste the LinkedIn post text here…\n\nExample:\n"🚨 We're hiring! Top MNC is looking for Software Engineers.\nComment 'Interested' below to receive the JD.\nOr join our Telegram: t.me/jobs123\nImmediate joining, daily payout guaranteed!"`}
            rows={9}
            className="w-full resize-none rounded-lg border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-300 font-mono leading-relaxed focus:outline-none focus:border-surface-400 focus:bg-white transition-colors disabled:opacity-50"
          />
        </div>

        {/* Character count */}
        {postContent.trim() && (
          <p className="text-xs text-surface-400">
            {postContent.length.toLocaleString()} characters ·{" "}
            {postContent.split("\n").length} lines
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-100 border border-surface-200">
            <Loader2 className="w-4 h-4 text-surface-600 animate-spin" />
            <span className="text-surface-600 text-sm font-medium">
              Analysing post for fraud signals…
            </span>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            id="verify-linkedin-btn"
            onClick={handleVerify}
            disabled={isLoading || !postContent.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-surface-900 hover:bg-surface-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verify Post
              </>
            )}
          </button>

          {postContent.trim() && !isLoading && !result && (
            <button
              onClick={handleReset}
              className="text-xs text-surface-400 hover:text-surface-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {renderResult()}

      {/* How it works */}
      {!result && !isLoading && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: "🏢",
              title: "Company Integrity",
              desc: "Checks if a real, named corporate entity can be identified vs. anonymous 'Top MNC' references.",
            },
            {
              icon: "💬",
              title: "Engagement Traps",
              desc: "Flags posts that force users to comment 'Interested' or drop emails in public threads.",
            },
            {
              icon: "⚠️",
              title: "High-Risk Phrases",
              desc: "Detects Telegram redirects, daily payout promises, and off-platform application routes.",
            },
            {
              icon: "🔗",
              title: "Structural Legitimacy",
              desc: "Verifies presence of role, location, and an official ATS/careers link.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-4 rounded-lg bg-surface-50 border border-surface-200"
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-surface-800">
                  {item.title}
                </p>
                <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
