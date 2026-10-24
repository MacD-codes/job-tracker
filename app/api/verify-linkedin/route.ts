import { NextRequest, NextResponse } from "next/server";

const VERIFY_SYSTEM_PROMPT = `You are a LinkedIn job-post fraud analyst. A user will paste a LinkedIn post verbatim.
Your job is to evaluate whether the post represents a legitimate, verifiable job opening or a suspicious / scam posting.

EVALUATION CRITERIA — check each carefully:

1. COMPANY INTEGRITY
   - Can you extract a real, named, publicly verifiable corporate entity from the post?
   - Anonymous recruiters hiding behind phrases like "Top MNC hiring", "Leading company", "Big 4 firm", "DM for info" are HIGH RISK.
   - Missing company name or recruiter without visible profile = flag it.

2. ENGAGEMENT TRAPS (SOCIAL ENGINEERING)
   - Does the post ask users to "comment Interested", "drop your email in comments", "type YES to receive JD"?
   - These are engagement-farming tactics common in scam posts. Flag them.

3. HIGH-RISK PHRASES / APPLICATION VECTORS
   - Telegram channel links or "join our Telegram" for job application.
   - "Daily payout", "weekly salary", "earn from home", "no experience needed" combined with vague roles.
   - Application routes that bypass official ATS portals (e.g., WhatsApp, personal email, Telegram only).
   - Promises like "immediate joining", "joining bonus guaranteed before interview".
   - Requests for upfront payment, security deposit, or equipment purchase.

4. STRUCTURAL LEGITIMACY
   - Does the post mention a specific role title, team, location, and link to an official careers page or ATS?
   - Are compensation ranges realistic and explicitly stated?
   - Is the recruiter's company clearly visible on their profile?

Return ONLY a raw JSON object (no markdown, no code fences) with this exact structure:
{
  "is_verifiable": boolean,
  "company_detected": "Company Name or null if unidentifiable",
  "risk_score": integer from 0 to 100 (0 = completely safe, 100 = definite scam),
  "verdict_summary": "2-3 sentence clear explanation of your verdict",
  "red_flags": ["array of specific red flag strings found, or empty array if none"]
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postContent } = body as { postContent: string };

    if (!postContent || postContent.trim().length < 20) {
      return NextResponse.json(
        { error: "postContent is required and must be meaningful text." },
        { status: 400 }
      );
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey) {
      // ── OpenAI path ──────────────────────────────────────────
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
              { role: "system", content: VERIFY_SYSTEM_PROMPT },
              {
                role: "user",
                content: `Analyze this LinkedIn post:\n\n${postContent}`,
              },
            ],
            temperature: 0.1,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("OpenAI verify error:", err);
        throw new Error("OpenAI API error");
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return NextResponse.json(result);
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
          max_tokens: 1024,
          system:
            VERIFY_SYSTEM_PROMPT +
            "\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no code fences.",
          messages: [
            {
              role: "user",
              content: `Analyze this LinkedIn post:\n\n${postContent}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Anthropic verify error:", err);
        throw new Error("Anthropic API error");
      }

      const data = await response.json();
      const text = data.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in Anthropic response");
      const result = JSON.parse(jsonMatch[0]);
      return NextResponse.json(result);
    } else {
      // ── Mock fallback ─────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 1000));

      // Deterministic mock: analyze text for obvious red-flag keywords
      const lower = postContent.toLowerCase();
      const redFlags: string[] = [];

      if (lower.includes("telegram"))
        redFlags.push("Redirects to Telegram instead of an official ATS portal");
      if (lower.includes("comment") && (lower.includes("interested") || lower.includes("yes")))
        redFlags.push('Engagement trap: asks users to comment "Interested" or "Yes"');
      if (lower.includes("daily payout") || lower.includes("weekly salary"))
        redFlags.push("Suspicious payout promise (daily/weekly pay claims)");
      if (lower.includes("dm") && !lower.includes("dm me"))
        redFlags.push("Application route via DM rather than official job board");
      if (lower.includes("top mnc") || lower.includes("leading company") || lower.includes("big 4"))
        redFlags.push("Anonymous company reference — no verifiable corporate entity named");
      if (lower.includes("no experience") || lower.includes("earn from home"))
        redFlags.push("Suspicious phrasing: 'no experience needed' or 'earn from home'");
      if (lower.includes("deposit") || lower.includes("fee") || lower.includes("pay"))
        redFlags.push("Potential upfront payment request detected");
      if (lower.includes("drop your email") || lower.includes("email in comments"))
        redFlags.push("Asks for personal emails in public comment section");

      // Detect company name (crude heuristic: look for "at " or "@" followed by caps)
      const companyMatch =
        postContent.match(/(?:at|@)\s+([A-Z][A-Za-z\s&.]{2,30})/)?.[1] ||
        postContent.match(/(?:hiring at|working at|join)\s+([A-Z][A-Za-z\s&.]{2,30})/i)?.[1] ||
        null;

      const riskScore = Math.min(
        100,
        redFlags.length * 20 + (companyMatch ? 0 : 15)
      );
      const isVerifiable = riskScore < 40 && companyMatch !== null;

      let verdictSummary: string;
      if (riskScore === 0) {
        verdictSummary =
          "No red flags detected. The post references a verifiable entity and follows standard job-post structure.";
      } else if (riskScore < 40) {
        verdictSummary = `Minor concerns detected. The post shows ${redFlags.length} potential issue(s) but may still be legitimate. Verify independently before applying.`;
      } else if (riskScore < 70) {
        verdictSummary = `Moderate risk. ${redFlags.length} red flag(s) found. This post exhibits common patterns associated with engagement farming or unverified job listings.`;
      } else {
        verdictSummary = `High risk of fraud. ${redFlags.length} serious red flag(s) detected. This post matches known scam patterns — do not share personal details or click external links.`;
      }

      return NextResponse.json({
        is_verifiable: isVerifiable,
        company_detected: companyMatch?.trim() ?? null,
        risk_score: riskScore,
        verdict_summary: verdictSummary,
        red_flags: redFlags,
      });
    }
  } catch (error) {
    console.error("verify-linkedin error:", error);
    return NextResponse.json(
      {
        error: "Verification failed. Please try again.",
        is_verifiable: false,
        company_detected: null,
        risk_score: 50,
        verdict_summary: "Unable to complete analysis due to a server error.",
        red_flags: [],
      },
      { status: 500 }
    );
  }
}
