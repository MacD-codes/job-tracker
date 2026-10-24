import { NextRequest, NextResponse } from "next/server";
import { MOCK_PARSED_EMAILS } from "@/lib/mockParsed";
import { JobEmail } from "@/types";

const LLM_SYSTEM_PROMPT = `You are an expert email parser and fraud detection specialist for job seekers.
You will receive a raw text corpus containing multiple job-related emails concatenated together.

Your task:
1. Split the corpus into individual emails.
2. For each email, extract the structured information and evaluate it for fraud.

FRAUD RULES — mark is_fraud: true if ANY of these apply:
- TRAINING FEE SCAM: Email requests money, payment, wire transfers, or fees for equipment, onboarding, courses, or training.
- DOMAIN SPOOFING: Sender uses a free email provider (gmail.com, outlook.com, yahoo.com, hotmail.com, etc.) while claiming to represent a formal corporation or well-known company.
- PREMATURE IDENTITY REQUEST: Email requests highly sensitive personal documents (Social Security Number/SSN, Aadhaar card, PAN card, passport, or bank account details) BEFORE any verified live video interview has been completed.

For is_fraud, populate fraud_reason with a clear, specific explanation citing which rule was violated and what evidence in the email triggered the flag.

STATUS RULES:
- "Applied": Application confirmation or acknowledgment emails
- "Interview": Emails inviting to or scheduling interviews, technical screens, or next steps in the process
- "Rejected": Emails declining the application or moving forward with other candidates
- "Offer": Emails extending an official or verbal job offer with compensation details

Return a JSON object with this exact structure:
{
  "emails": [
    {
      "id": "uuid-v4-string",
      "sender_email": "string",
      "sender_name": "string",
      "company": "string",
      "role": "string",
      "date_received": "YYYY-MM-DD",
      "email_body": "concise 2-3 sentence summary of the email content",
      "status": "Applied" | "Interview" | "Rejected" | "Offer",
      "is_fraud": boolean,
      "fraud_reason": "string or null"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText } = body as { rawText: string };

    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json(
        { error: "rawText is required" },
        { status: 400 }
      );
    }

    // Check for API keys
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey) {
      // ── OpenAI path ─────────────────────────────────────────
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: LLM_SYSTEM_PROMPT },
              {
                role: "user",
                content: `Parse the following email corpus:\n\n${rawText}`,
              },
            ],
            temperature: 0.1,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("OpenAI error:", err);
        throw new Error("OpenAI API error");
      }

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content) as {
        emails: JobEmail[];
      };
      return NextResponse.json({ emails: parsed.emails, source: "openai" });
    } else if (anthropicKey) {
      // ── Anthropic path ───────────────────────────────────────
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 8192,
          system:
            LLM_SYSTEM_PROMPT +
            "\n\nIMPORTANT: Return ONLY valid JSON, no markdown or extra text.",
          messages: [
            {
              role: "user",
              content: `Parse the following email corpus:\n\n${rawText}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Anthropic error:", err);
        throw new Error("Anthropic API error");
      }

      const data = await response.json();
      const text = data.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in Anthropic response");
      const parsed = JSON.parse(jsonMatch[0]) as { emails: JobEmail[] };
      return NextResponse.json({ emails: parsed.emails, source: "anthropic" });
    } else {
      // ── Mock fallback ────────────────────────────────────────
      // Simulate a realistic processing delay
      await new Promise((r) => setTimeout(r, 1200));
      return NextResponse.json({
        emails: MOCK_PARSED_EMAILS,
        source: "mock",
      });
    }
  } catch (error) {
    console.error("parse-inbox error:", error);
    // Fall back to mock data on any error
    return NextResponse.json({
      emails: MOCK_PARSED_EMAILS,
      source: "mock-fallback",
    });
  }
}
