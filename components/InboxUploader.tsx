"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mail,
  ChevronRight,
  Zap,
} from "lucide-react";
import { JobEmail } from "@/types";
import { SAMPLE_EMAIL_CORPUS } from "@/lib/mockData";

interface InboxUploaderProps {
  onParsed: (jobs: JobEmail[], source: string) => void;
}

export function InboxUploader({ onParsed }: InboxUploaderProps) {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = async (text: string) => {
    if (!text.trim()) {
      setError("Please paste some email content first.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const steps = [
      "Splitting email corpus...",
      "Extracting structured data...",
      "Running fraud detection...",
      "Building Kanban board...",
    ];

    for (const step of steps) {
      setLoadingStep(step);
      await new Promise((r) => setTimeout(r, 400));
    }

    try {
      const res = await fetch("/api/parse-inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      onParsed(data.emails, data.source);
    } catch {
      setError("Failed to parse emails. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_EMAIL_CORPUS);
    setError(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (ev) => setRawText(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setRawText(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Card */}
      <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-8 pt-7 pb-6 border-b border-surface-200">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-surface-900 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-surface-900 font-bold text-xl">
                Email Ingestion Hub
              </h2>
              <p className="text-surface-400 text-sm">
                Paste your raw job email corpus below
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-5">
          {/* Drop Zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDragOver
                ? "border-surface-400 bg-surface-100"
                : "border-surface-200 hover:border-surface-300 bg-surface-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
          >
            <textarea
              id="inbox-textarea"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Paste your raw email corpus here...\n\n--- EMAIL 1 ---\nFrom: careers@stripe.com\nSubject: Application Received\n...\n\n--- EMAIL 2 ---\n...`}
              className="w-full h-64 bg-transparent text-surface-800 text-sm font-mono p-5 resize-none outline-none placeholder:text-surface-300 leading-relaxed"
              disabled={isLoading}
            />

            {/* Upload overlay hint */}
            {!rawText && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-surface-400 hover:text-surface-700 text-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload .txt file
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,text/plain"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Character count */}
          {rawText && (
            <div className="flex items-center gap-2 text-surface-400 text-xs">
              <FileText className="w-3.5 h-3.5" />
              {rawText.length.toLocaleString()} characters ·{" "}
              {rawText.split("\n").length} lines
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border-2 border-red-500 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-100 border border-surface-200">
              <Loader2 className="w-4 h-4 text-surface-600 animate-spin" />
              <span className="text-surface-600 text-sm font-medium">
                {loadingStep}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="load-sample-btn"
              onClick={handleLoadSample}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-surface-200 bg-surface-50 hover:bg-surface-100 hover:border-surface-300 text-surface-600 hover:text-surface-900 text-sm font-medium transition-all duration-150 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              Load Sample Corpus (20 Emails)
            </button>

            <button
              id="parse-inbox-btn"
              onClick={() => handleParse(rawText)}
              disabled={isLoading || !rawText.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-surface-900 hover:bg-surface-700 text-white font-semibold text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Parse Inbox &amp; Build Tracker
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Feature hints */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              {
                icon: "🤖",
                title: "AI Parsing",
                desc: "LLM splits & structures each email automatically",
              },
              {
                icon: "🚨",
                title: "Fraud Detection",
                desc: "3-rule system flags scams, fee requests & spoofed domains",
              },
              {
                icon: "📋",
                title: "Auto Kanban",
                desc: "Applied → Interview → Rejected → Offer board",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 border border-surface-200"
              >
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-surface-700 text-xs font-semibold">
                    {f.title}
                  </p>
                  <p className="text-surface-400 text-xs mt-0.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
