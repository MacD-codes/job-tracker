import { NextRequest, NextResponse } from "next/server";

const MOCK_PREP_DATA: Record<string, { questions: string[]; company_summary: string; star_example: string }> = {
  shopify: {
    questions: [
      "Design a high-throughput payment processing system that handles Black Friday traffic spikes — walk us through your architecture choices.",
      "How would you approach database sharding for a multi-tenant e-commerce platform serving millions of merchants?",
      "Tell me about a time you had to optimize a slow backend service under production pressure — what was your debugging approach?",
    ],
    company_summary:
      "Shopify is a leading global commerce platform that empowers entrepreneurs and businesses to build, launch, and scale their online stores. Their technology stack handles billions of dollars in GMV and serves millions of merchants worldwide.",
    star_example:
      "**STAR Framework — Handling System Bottlenecks:**\n\n**Situation:** At my previous role, our order processing pipeline was dropping 3% of transactions during peak sale events, impacting merchant revenue.\n\n**Task:** I was tasked with identifying the bottleneck and delivering a fix within one sprint, with no downtime allowed.\n\n**Action:** I profiled the system with distributed tracing, identified a synchronous database lock in the inventory service, refactored it to use optimistic concurrency with a Redis-backed queue, and rolled out a canary deployment.\n\n**Result:** Transaction drop rate fell to 0.01%, peak throughput increased by 40%, and the solution was adopted as a platform-wide pattern.",
  },
  openai: {
    questions: [
      "Walk us through how you'd design an evaluation pipeline for a new LLM behavior — what metrics matter for alignment and safety?",
      "How would you approach a research problem where the ground truth is subjective or hard to quantify?",
      "Describe your experience with reinforcement learning from human feedback (RLHF) or similar techniques.",
    ],
    company_summary:
      "OpenAI is an AI safety and research company at the frontier of developing artificial general intelligence. They build and deploy large-scale AI systems including the GPT family and DALL-E, focusing on ensuring AI is safe, beneficial, and aligned with human values.",
    star_example:
      "**STAR Framework — Research Under Ambiguity:**\n\n**Situation:** I was tasked with improving the factual accuracy of a retrieval-augmented generation system where 'correctness' was hard to define objectively.\n\n**Task:** Design and run an evaluation study that the team could trust, within a 6-week timeline.\n\n**Action:** I built a multi-rater annotation framework using expert evaluators, defined a rubric spanning factual precision, citation relevance, and hedging appropriateness, then used inter-rater reliability (Cohen's kappa) to validate consistency. I iterated the rubric through three pilot rounds.\n\n**Result:** The final evaluation pipeline achieved κ=0.81 and revealed that our system had a 23% hallucination rate on medical queries, directly informing a safety filter that reduced it to under 5%.",
  },
  datadog: {
    questions: [
      "How would you design a distributed metrics ingestion pipeline that processes 1 million events per second with sub-second latency?",
      "Walk us through your approach to debugging a production incident where you have no prior context on the service.",
      "How do you think about the trade-offs between consistency and availability in a monitoring system?",
    ],
    company_summary:
      "Datadog is a cloud monitoring and analytics platform that provides observability for developers, IT operations, and business teams. Their platform unifies metrics, traces, and logs at petabyte scale, serving thousands of enterprise customers across cloud infrastructure.",
    star_example:
      "**STAR Framework — Scaling Observability Systems:**\n\n**Situation:** Our internal monitoring platform was struggling to ingest logs from 500+ microservices, causing 15-minute blind spots during incidents.\n\n**Task:** Redesign the ingestion layer to handle 10x the current load with guaranteed delivery.\n\n**Action:** I re-architected from a synchronous push model to a Kafka-backed event streaming pipeline with per-service partitioning, implemented backpressure mechanisms, and added a dead-letter queue for replay. I also introduced sampling strategies for high-volume, low-priority logs.\n\n**Result:** Ingestion latency dropped from 15 minutes to under 30 seconds, the system handled 50x traffic during a synthetic load test, and on-call engineers reported 60% faster MTTD (mean time to detect).",
  },
};

function getMockPrep(company: string, role: string) {
  const companyKey = company.toLowerCase().split(" ")[0];
  const cached = MOCK_PREP_DATA[companyKey];

  if (cached) return cached;

  // Generic fallback for any company
  return {
    questions: [
      `Tell me about a complex technical challenge you faced and how you resolved it — relevant to the ${role} role.`,
      `How do you stay current with industry trends and emerging technologies relevant to ${role} work?`,
      `Walk me through a project where you had to collaborate across teams to deliver a successful outcome at scale.`,
    ],
    company_summary: `${company} is an innovative technology company operating at the intersection of product and engineering excellence. They seek candidates who bring a blend of technical depth, collaborative spirit, and a results-driven mindset to help scale their platform and impact.`,
    star_example: `**STAR Framework — Cross-functional Delivery:**\n\n**Situation:** I was leading a ${role} initiative that required coordinating with 4 different teams with conflicting priorities.\n\n**Task:** Deliver a core feature within a tight quarter deadline while managing dependencies across design, backend, data, and QA.\n\n**Action:** I established a weekly cross-team sync with a shared RAID log, broke the project into independently-releasable milestones, and negotiated scope trade-offs with stakeholders using data on user impact.\n\n**Result:** We shipped on time with all critical features intact. Post-launch metrics showed a 35% improvement in the target KPI, and the coordination model I introduced was adopted by two other project teams.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { company, role } = await req.json();

    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const prompt = `Generate interview preparation notes for a candidate interviewing for the "${role}" position at ${company}.

Return a JSON object with exactly these keys:
{
  "questions": ["question1", "question2", "question3"],
  "company_summary": "A 2-sentence summary of what ${company} does and why it matters",
  "star_example": "A detailed STAR method behavioral answer framework tailored to this role — include headers for Situation, Task, Action, Result with realistic content specific to ${role} work. Format as markdown."
}

Make the questions specific to the role and company. Make the STAR example realistic and detailed.`;

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
                  "You are an expert interview coach. Return only valid JSON.",
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
          max_tokens: 2048,
          system:
            "You are an expert interview coach. Return only valid JSON with keys: questions (array of 3 strings), company_summary (string), star_example (markdown string).",
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
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json(getMockPrep(company, role));
  } catch (error) {
    console.error("generate-prep error:", error);
    return NextResponse.json(getMockPrep("the company", "this role"));
  }
}
