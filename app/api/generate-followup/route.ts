import { NextRequest, NextResponse } from "next/server";

function generateMockFollowUp(
  company: string,
  role: string,
  dateReceived: string
): { subject: string; body: string } {
  const subject = `Following Up – ${role} Application at ${company}`;
  const body = `Hi [Hiring Manager's Name],

I hope this message finds you well. I wanted to follow up on my application for the ${role} position at ${company}, which I submitted on ${dateReceived}.

I remain very enthusiastic about the opportunity to contribute to ${company}'s team and am confident that my background aligns well with the role's requirements.

I completely understand that the review process takes time, and I don't want to be a disruption. I just wanted to reiterate my strong interest and ask if there are any updates on the timeline or next steps.

Please let me know if there's anything additional you need from me. I'd love the chance to discuss how I can contribute to the team.

Thank you so much for your time and consideration.

Warm regards,
[Your Name]
[Your Email] | [Your Phone] | [LinkedIn URL]`;

  return { subject, body };
}

export async function POST(req: NextRequest) {
  let company = "the company";
  let role = "the role";
  let date_received = "recently";

  try {
    const body = await req.json();
    company = body.company ?? company;
    role = body.role ?? role;
    date_received = body.date_received ?? date_received;

    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const prompt = `Write a professional, warm, and concise follow-up email from a job seeker who applied for the "${role}" position at ${company} on ${date_received}. 
    
    The email should:
    - Be polite and non-pushy
    - Reiterate genuine interest in the role and company
    - Ask about next steps or timeline
    - Be 3-4 short paragraphs max
    - Include placeholder brackets for [Hiring Manager's Name] and [Your Name]
    
    Return a JSON object with keys "subject" (email subject line) and "body" (email body).`;

    if (openaiKey) {
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
              {
                role: "system",
                content:
                  "You are an expert career coach who writes professional follow-up emails. Return only valid JSON.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        }
      );
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return NextResponse.json(result);
    } else if (anthropicKey) {
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
            "You are an expert career coach who writes professional follow-up emails. Return only valid JSON with keys 'subject' and 'body'.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json(result);
      }
    }

    // Mock fallback
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(generateMockFollowUp(company, role, date_received));
  } catch (error) {
    console.error("generate-followup error:", error);
    return NextResponse.json(generateMockFollowUp(company, role, date_received));
  }
}
