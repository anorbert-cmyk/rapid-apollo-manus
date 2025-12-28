/**
 * Perplexity API Key Validation Test
 * Tests that the API key is valid by making a lightweight API call
 */

import { describe, it, expect } from "vitest";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

describe("Perplexity API Key Validation", () => {
  it("should have PERPLEXITY_API_KEY configured", () => {
    expect(process.env.PERPLEXITY_API_KEY).toBeDefined();
    expect(process.env.PERPLEXITY_API_KEY).not.toBe("");
  });

  it("should successfully authenticate with Perplexity API", async () => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      throw new Error("PERPLEXITY_API_KEY is not configured");
    }

    // Make a minimal API call to validate the key
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar", // Use cheapest model for validation
        messages: [
          { role: "user", content: "Hi" }
        ],
        max_tokens: 5, // Minimal tokens to save cost
      }),
    });

    // Check if authentication succeeded (200 OK or valid response)
    if (!response.ok) {
      const errorText = await response.text();
      
      // 401 = Invalid API key
      if (response.status === 401) {
        throw new Error(`Invalid Perplexity API key: ${errorText}`);
      }
      
      // 429 = Rate limited (key is valid but rate limited)
      if (response.status === 429) {
        console.log("API key is valid but rate limited - this is acceptable");
        return;
      }
      
      // Other errors
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Verify we got a valid response structure
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("choices");
    expect(data.choices).toBeInstanceOf(Array);
    expect(data.choices.length).toBeGreaterThan(0);
    
    console.log("✅ Perplexity API key is valid!");
  }, 30000); // 30 second timeout for API call
});
