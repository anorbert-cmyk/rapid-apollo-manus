/**
 * Perplexity API Service for APEX Tier Analysis
 * Uses Perplexity's sonar-pro model for deep research with web search
 */

import { generateApexPartPrompt } from "../../shared/apexPrompt";

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

interface ApexAnalysisResult {
  parts: string[];
  fullMarkdown: string;
  totalTokens: number;
  searchResults: Array<{ title: string; url: string; date?: string }>;
  generatedAt: number;
}

interface ApexCallbacks {
  onPartStart?: (partNumber: number) => void;
  onPartComplete?: (partNumber: number, content: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Check if Perplexity API is configured
 */
export function isPerplexityConfigured(): boolean {
  return !!process.env.PERPLEXITY_API_KEY;
}

/**
 * Invoke Perplexity API for chat completions
 */
async function invokePerplexity(
  messages: PerplexityMessage[],
  maxTokens: number = 3000
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
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
      search_mode: "web",
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
 * Execute 4-part APEX analysis with Perplexity API
 * Maintains conversation context across all parts via multi-turn API calls
 */
export async function executeApexAnalysis(
  userProblem: string,
  callbacks?: ApexCallbacks
): Promise<ApexAnalysisResult> {
  const parts: string[] = [];
  let totalTokens = 0;
  const allSearchResults: Array<{ title: string; url: string; date?: string }> = [];
  
  // Maintain conversation history for multi-turn context
  const conversationHistory: PerplexityMessage[] = [];

  console.log("[PerplexityAPI] Starting APEX 4-part analysis");

  for (let partNumber = 1; partNumber <= 4; partNumber++) {
    callbacks?.onPartStart?.(partNumber);
    console.log(`[PerplexityAPI] Starting Part ${partNumber}/4`);

    // Build messages with conversation history
    const systemPrompt = generateApexPartPrompt(userProblem, partNumber);
    
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...conversationHistory,
      {
        role: "user",
        content: partNumber === 1 
          ? `Analyze this problem/idea and execute PART 1 of the UX strategy analysis:\n\n"${userProblem}"`
          : `Continue with PART ${partNumber} of the analysis. Build on the insights from previous parts.`,
      },
    ];

    try {
      // Determine max tokens based on part (Parts 2 & 3 need more)
      const maxTokens = partNumber === 1 || partNumber === 4 ? 2500 : 3000;
      
      const response = await invokePerplexity(messages, maxTokens);

      const content = response.choices[0]?.message?.content || "";
      parts.push(content);
      totalTokens += response.usage?.total_tokens || 0;

      // Collect search results (unique by URL)
      if (response.search_results) {
        for (const sr of response.search_results) {
          if (!allSearchResults.some(existing => existing.url === sr.url)) {
            allSearchResults.push({
              title: sr.title,
              url: sr.url,
              date: sr.date,
            });
          }
        }
      }

      // Add to conversation history for context preservation
      conversationHistory.push(
        { role: "user", content: messages[messages.length - 1].content },
        { role: "assistant", content }
      );

      // Callback for progress updates
      callbacks?.onPartComplete?.(partNumber, content);
      console.log(`[PerplexityAPI] Completed Part ${partNumber}/4, length: ${content.length}`);

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(`[PerplexityAPI] Part ${partNumber} failed:`, err);
      callbacks?.onError?.(err);
      throw err;
    }
  }

  // Combine all parts into full markdown
  const fullMarkdown = [
    "# 🎯 APEX UX Strategy Analysis\n",
    "---\n",
    "## Part 1: Discovery & Problem Analysis\n",
    parts[0] || "",
    "\n---\n",
    "## Part 2: Strategic Design & Roadmap\n",
    parts[1] || "",
    "\n---\n",
    "## Part 3: AI Toolkit, Deliverables & Figma Prompts\n",
    parts[2] || "",
    "\n---\n",
    "## Part 4: Risk, Metrics & Strategic Rationale\n",
    parts[3] || "",
    "\n---\n",
    "## Sources & References\n",
    allSearchResults.length > 0 
      ? allSearchResults.map((sr, i) => `${i + 1}. [${sr.title}](${sr.url})${sr.date ? ` (${sr.date})` : ""}`).join("\n")
      : "No external sources cited.",
  ].join("\n");

  console.log(`[PerplexityAPI] APEX analysis completed, total tokens: ${totalTokens}`);

  return {
    parts,
    fullMarkdown,
    totalTokens,
    searchResults: allSearchResults,
    generatedAt: Date.now(),
  };
}
