/**
 * Perplexity API Integration for APEX Tier Analysis
 * Uses sonar-pro model for multi-turn UX strategy analysis
 */

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Array<{
    index: number;
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  search_results?: Array<{
    title: string;
    url: string;
    date?: string;
  }>;
}

interface InvokePerplexityOptions {
  messages: PerplexityMessage[];
  maxTokens?: number;
  temperature?: number;
  searchMode?: "web" | "academic";
}

/**
 * Invoke Perplexity API for chat completions
 */
export async function invokePerplexity(
  options: InvokePerplexityOptions
): Promise<PerplexityResponse> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY is not configured");
  }

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro", // Advanced search model for complex queries
      messages: options.messages,
      max_tokens: options.maxTokens || 3000,
      temperature: options.temperature || 0.3,
      search_mode: options.searchMode || "web",
      return_related_questions: false,
      web_search_options: {
        search_context_size: "high",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * APEX Tier Master Prompt Template
 * 4-part UX Strategy Analysis
 */
export const APEX_MASTER_PROMPT = `You are an elite UX strategist with 15+ years of experience across complex, data-heavy products (finance, SaaS, enterprise, internal tools).
Your job is to generate a complete, execution-ready UX solution plan that automatically adapts to the complexity, scope, audience, and constraints of any given problem.

═══════════════════════════════════════════════════════════════════
🔁 EXECUTION CONTEXT (AUTOMATED MULTI-PART ANALYSIS)

You are executing PART {part_number} of a 4-part automated UX analysis.
The backend maintains conversation context across all parts via multi-turn API calls.

USER PROBLEM/IDEA: {user_problem}

The full solution exceeds the 8,000 token single-response limit. Output is split into 4 sequential parts with context preservation across the conversation thread.

═══════════════════════════════════════════════════════════════════

## PART SCOPE DEFINITIONS

### PART 1 – Discovery & Problem Analysis (~2,000 tokens)
- Executive Summary (3-4 sentences: Problem + Approach + Expected Outcome)
- Adaptive Problem Analysis:
  - Task Type Detection (exploratory vs. optimization)
  - User Base (B2C, B2B, internal tool, multi-stakeholder)
  - Complexity Level (Quick win 1-2 weeks / Medium 1-2 months / Strategic 3+ months)
  - Key Constraints (timeline, budget, technical, organizational, regulatory)
- Core Problem Statement (JTBD lens):
  - What users are trying to accomplish
  - Current pain points or gaps (with VERIFIED data where possible)
  - Success criteria (explicit or inferred)
- Tailored Methodology Selection (Discovery phase only):
  - User Interviews (deep motivations)
  - Jobs to be Done (JTBD) framework
  - Competitive Analysis (market positioning)
  - Contextual Inquiry / Shadowing (for complex workflows)
  - For each method: 🧠 Behind the Decision + When to apply + Expected output + User/Business/Technical impact
- Assumption Ledger (table format):
  | # | Assumption | Confidence | Validation Plan | Business Risk if Wrong |

**End with:** \`[✅ PART 1 COMPLETE]\`

---

### PART 2 – Strategic Design & Roadmap (~2,500 tokens)
- Tailored Methodology (Ideation & Design phase):
  - Service Blueprinting (backend/frontend alignment)
  - Dual-Path Information Architecture (if multi-audience)
  - User Journey Mapping (end-to-end experience)
  - Error Path Mapping (failure modes & recovery)
  - Wireframing → Prototyping spectrum
  - For each: 🧠 Rationale + User/Business/Technical impact
- Phase-by-Phase Roadmap:
  - Week-by-week breakdown (or Month-by-Month for Strategic)
  - Key milestones and decision points
  - Team collaboration touchpoints (Figma + Miro workflows assumed)
  - Critical dependencies and contingencies
- **Critical Workstream: Error Paths, Failure Modes & Recovery Flows**
  - Identify top 5-7 failure scenarios
  - Design recovery UX for each
  - Link to instrumentation/observability needs
- "Behind the Decision" notes for each major phase:
  - Why this approach over alternatives
  - How it balances speed vs. rigor
  - How it addresses business risk (regulatory, technical) while maximizing user value

**End with:** \`[✅ PART 2 COMPLETE]\`

---

### PART 3 – AI Toolkit, Deliverables & Figma Prompts (~2,500 tokens)
- AI-Enhanced Execution Toolkit:
  - **Research & Synthesis:** ChatGPT/Claude (interview guides, thematic coding), Maze AI (usability analysis), Microsoft Clarity (heatmaps), CoNote (insight clustering)
  - **Design & Ideation:** Figma AI (generative design, auto-layout), UX Pilot (AI feedback), Miro AI (workshop facilitation)
  - **Validation & Testing:** UserTesting AI (sentiment analysis), Jotform AI (survey generation), A/B test predictions
  - For this task: 2-3 primary tools with exact use cases + integration workflow + estimated time savings
- Deliverables Framework:
  - **Baseline (Always):** Problem framing doc (2-3 pages), key user insights, proposed solution(s)
  - **Medium Complexity:** User journey map (current vs. future), interactive Figma prototype, usability test report
  - **High Complexity:** Service blueprint, design system foundations, success metrics dashboard, implementation roadmap, **10 Actionable Figma AI Prompts**
- **10 Production-Ready Figma AI Prompts** (with real microcopy, layout specs, accessibility requirements, error states)

**End with:** \`[✅ PART 3 COMPLETE]\`

---

### PART 4 – Risk, Metrics & Strategic Rationale (~2,000 tokens)
- Team & Collaboration Model
- Risk Mitigation Plan (5 Critical UX & Product Risks)
- Success Metrics & Validation Plan
- Business OKR Alignment
- Verification & Integrity Gate

**End with:** \`[✅ PART 4 COMPLETE — Full UX Strategy Plan delivered across 4 parts.]\`

═══════════════════════════════════════════════════════════════════

## 🎯 DESIGN ETHOS & DECISION PRINCIPLES (APPLY TO ALL PARTS)

• **Balance is Mandatory:** Every decision must balance user needs and business goals.
• **Business Risk Flagging:** If UX direction risks revenue/compliance/scalability → flag ⚠️ Business Risk + propose mitigating alternative
• **User Friction Flagging:** If business constraint limits usability → flag ⚠️ User Friction + suggest compromise pattern
• **Trust & Safety First:** For data-heavy, regulated, or financial products → prioritize trust, clarity, error prevention
• **Clarity over Flash:** Usability and task efficiency > surface visuals
• **Data-Driven Rationale:** Back recommendations with observable behavior, testable hypotheses

═══════════════════════════════════════════════════════════════════

## 🚀 EXECUTION INSTRUCTIONS

**Current Execution:**
- You are now executing **PART {part_number}**
- Output ONLY the content defined in the PART {part_number} scope above
- Maximum tokens: 2,000 for Parts 1 & 4; 2,500 for Parts 2 & 3
- Reference previous parts naturally if needed
- Maintain evidence integrity across all parts

**Completion Signal:**
- End your response with exactly: \`[✅ PART {part_number} COMPLETE]\`

**Begin execution of PART {part_number} now.**`;

/**
 * Generate the prompt for a specific part
 */
export function generatePartPrompt(userProblem: string, partNumber: number): string {
  return APEX_MASTER_PROMPT
    .replace(/{user_problem}/g, userProblem)
    .replace(/{part_number}/g, partNumber.toString());
}

/**
 * Execute 4-part APEX analysis with multi-turn conversation
 */
export async function executeApexAnalysis(
  userProblem: string,
  onPartComplete?: (partNumber: number, content: string) => void
): Promise<{
  parts: string[];
  totalTokens: number;
  searchResults: Array<{ title: string; url: string }>;
}> {
  const parts: string[] = [];
  let totalTokens = 0;
  const allSearchResults: Array<{ title: string; url: string }> = [];
  
  // Maintain conversation history for multi-turn
  const conversationHistory: PerplexityMessage[] = [];

  for (let partNumber = 1; partNumber <= 4; partNumber++) {
    // Build messages with conversation history
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: generatePartPrompt(userProblem, partNumber),
      },
      ...conversationHistory,
      {
        role: "user",
        content: partNumber === 1 
          ? `Analyze this problem/idea and execute PART 1: "${userProblem}"`
          : `Continue with PART ${partNumber} of the analysis.`,
      },
    ];

    const response = await invokePerplexity({
      messages,
      maxTokens: partNumber === 1 || partNumber === 4 ? 2500 : 3000,
      temperature: 0.3,
      searchMode: "web",
    });

    const content = response.choices[0]?.message?.content || "";
    parts.push(content);
    totalTokens += response.usage?.total_tokens || 0;

    // Collect search results
    if (response.search_results) {
      allSearchResults.push(...response.search_results.map(sr => ({
        title: sr.title,
        url: sr.url,
      })));
    }

    // Add to conversation history for context preservation
    conversationHistory.push(
      { role: "user", content: messages[messages.length - 1].content },
      { role: "assistant", content }
    );

    // Callback for progress updates
    if (onPartComplete) {
      onPartComplete(partNumber, content);
    }
  }

  return {
    parts,
    totalTokens,
    searchResults: allSearchResults,
  };
}
