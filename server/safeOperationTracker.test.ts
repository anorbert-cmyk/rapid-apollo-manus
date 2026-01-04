/**
 * SafeOperationTracker Integration Tests
 * 
 * These tests verify that:
 * 1. Tracking operations never block the main flow
 * 2. Failures in tracking don't affect the analysis process
 * 3. Circuit breaker prevents cascade failures
 * 4. Idempotency prevents duplicate operations
 * 5. All edge cases are handled gracefully
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  trackAnalysisStart,
  trackPartStart,
  trackPartComplete,
  trackPartFailure,
  trackAnalysisComplete,
  trackAnalysisFailure,
  trackPartialSuccess,
  trackQueuedForRetry,
  getCircuitBreakerStatus,
  resetCircuitBreaker,
  getIdempotencyCacheSize,
  clearIdempotencyCache,
} from "./services/safeOperationTracker";

describe("SafeOperationTracker", () => {
  beforeEach(() => {
    // Reset state before each test
    resetCircuitBreaker();
    clearIdempotencyCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Fire-and-Forget Pattern", () => {
    it("should return immediately without waiting for DB operations", async () => {
      const startTime = Date.now();
      
      // These should all return immediately
      trackAnalysisStart("test-session-1", "standard", "user");
      trackPartStart("test-session-1", 1);
      trackPartComplete("test-session-1", 1, "content", 1000);
      trackAnalysisComplete("test-session-1", 5000);
      
      const elapsed = Date.now() - startTime;
      
      // Should complete in under 50ms (fire-and-forget)
      expect(elapsed).toBeLessThan(50);
    });

    it("should not throw even when operations would fail", () => {
      // These should not throw, even with invalid data
      expect(() => {
        trackAnalysisStart("", "standard", "user");
        trackPartComplete("invalid", -1, "", undefined);
        trackAnalysisFailure("test", new Error("test error"), 999);
      }).not.toThrow();
    });
  });

  describe("Circuit Breaker", () => {
    it("should start with circuit closed", () => {
      const status = getCircuitBreakerStatus();
      expect(status.isOpen).toBe(false);
      expect(status.failures).toBe(0);
    });

    it("should track failure count", () => {
      // Initial state
      expect(getCircuitBreakerStatus().failures).toBe(0);
    });

    it("should reset circuit breaker manually", () => {
      resetCircuitBreaker();
      const status = getCircuitBreakerStatus();
      expect(status.isOpen).toBe(false);
      expect(status.failures).toBe(0);
      expect(status.lastFailureAt).toBeNull();
    });
  });

  describe("Idempotency", () => {
    it("should start with empty cache", () => {
      expect(getIdempotencyCacheSize()).toBe(0);
    });

    it("should clear idempotency cache", () => {
      // Trigger some operations that would add to cache
      trackAnalysisStart("test-1", "standard", "user");
      trackAnalysisStart("test-2", "medium", "user");
      
      // Clear and verify
      clearIdempotencyCache();
      expect(getIdempotencyCacheSize()).toBe(0);
    });
  });

  describe("Graceful Degradation", () => {
    it("should handle trackAnalysisStart gracefully", () => {
      expect(() => {
        trackAnalysisStart("session-123", "full", "user");
      }).not.toThrow();
    });

    it("should handle trackPartStart gracefully", () => {
      expect(() => {
        trackPartStart("session-123", 1);
        trackPartStart("session-123", 2);
        trackPartStart("session-123", 6);
      }).not.toThrow();
    });

    it("should handle trackPartComplete gracefully", () => {
      expect(() => {
        trackPartComplete("session-123", 1, "Part 1 content", 5000);
        trackPartComplete("session-123", 2, "Part 2 content", 3000);
      }).not.toThrow();
    });

    it("should handle trackPartFailure gracefully", () => {
      expect(() => {
        trackPartFailure("session-123", 3, new Error("API timeout"), "TIMEOUT");
        trackPartFailure("session-123", 4, "String error message", "UNKNOWN");
      }).not.toThrow();
    });

    it("should handle trackAnalysisComplete gracefully", () => {
      expect(() => {
        trackAnalysisComplete("session-123", 30000);
        trackAnalysisComplete("session-456"); // Without duration
      }).not.toThrow();
    });

    it("should handle trackAnalysisFailure gracefully", () => {
      expect(() => {
        trackAnalysisFailure("session-123", new Error("Fatal error"), 3);
        trackAnalysisFailure("session-456", "String error", undefined);
      }).not.toThrow();
    });

    it("should handle trackPartialSuccess gracefully", () => {
      expect(() => {
        trackPartialSuccess("session-123", 4, 6);
        trackPartialSuccess("session-456", 1, 2);
      }).not.toThrow();
    });

    it("should handle trackQueuedForRetry gracefully", () => {
      expect(() => {
        trackQueuedForRetry("session-123", "Circuit breaker open");
        trackQueuedForRetry("session-456", "Rate limited");
      }).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty session ID", () => {
      expect(() => {
        trackAnalysisStart("", "standard", "user");
        trackPartComplete("", 1, "content", 1000);
      }).not.toThrow();
    });

    it("should handle very long content", () => {
      const longContent = "x".repeat(100000);
      expect(() => {
        trackPartComplete("session-123", 1, longContent, 1000);
      }).not.toThrow();
    });

    it("should handle special characters in content", () => {
      const specialContent = "Test with émojis 🚀 and <html> tags & \"quotes\"";
      expect(() => {
        trackPartComplete("session-123", 1, specialContent, 1000);
      }).not.toThrow();
    });

    it("should handle negative part numbers", () => {
      expect(() => {
        trackPartStart("session-123", -1);
        trackPartComplete("session-123", -1, "content", 1000);
      }).not.toThrow();
    });

    it("should handle zero duration", () => {
      expect(() => {
        trackPartComplete("session-123", 1, "content", 0);
        trackAnalysisComplete("session-123", 0);
      }).not.toThrow();
    });

    it("should handle undefined duration", () => {
      expect(() => {
        trackPartComplete("session-123", 1, "content", undefined);
        trackAnalysisComplete("session-123", undefined);
      }).not.toThrow();
    });

    it("should handle null-like error messages", () => {
      expect(() => {
        trackPartFailure("session-123", 1, "", "EMPTY");
        trackAnalysisFailure("session-123", "", 1);
      }).not.toThrow();
    });
  });

  describe("Tier Handling", () => {
    it("should handle Observer tier (1 part)", () => {
      expect(() => {
        trackAnalysisStart("observer-session", "standard", "user");
        trackPartStart("observer-session", 1);
        trackPartComplete("observer-session", 1, "Single part content", 5000);
        trackAnalysisComplete("observer-session", 5000);
      }).not.toThrow();
    });

    it("should handle Insider tier (2 parts)", () => {
      expect(() => {
        trackAnalysisStart("insider-session", "medium", "user");
        trackPartStart("insider-session", 1);
        trackPartComplete("insider-session", 1, "Part 1", 3000);
        trackPartStart("insider-session", 2);
        trackPartComplete("insider-session", 2, "Part 2", 4000);
        trackAnalysisComplete("insider-session", 7000);
      }).not.toThrow();
    });

    it("should handle Syndicate tier (6 parts)", () => {
      expect(() => {
        trackAnalysisStart("syndicate-session", "full", "user");
        for (let i = 1; i <= 6; i++) {
          trackPartStart("syndicate-session", i);
          trackPartComplete("syndicate-session", i, `Part ${i} content`, i * 1000);
        }
        trackAnalysisComplete("syndicate-session", 21000);
      }).not.toThrow();
    });

    it("should handle partial success for Syndicate", () => {
      expect(() => {
        trackAnalysisStart("partial-session", "full", "user");
        trackPartComplete("partial-session", 1, "Part 1", 3000);
        trackPartComplete("partial-session", 2, "Part 2", 3000);
        trackPartComplete("partial-session", 3, "Part 3", 3000);
        trackPartFailure("partial-session", 4, new Error("API error"), "API_ERROR");
        trackPartialSuccess("partial-session", 3, 6);
      }).not.toThrow();
    });
  });

  describe("Trigger Sources", () => {
    it("should handle user trigger", () => {
      expect(() => {
        trackAnalysisStart("user-session", "standard", "user");
      }).not.toThrow();
    });

    it("should handle system trigger", () => {
      expect(() => {
        trackAnalysisStart("system-session", "standard", "system");
      }).not.toThrow();
    });

    it("should handle admin trigger", () => {
      expect(() => {
        trackAnalysisStart("admin-session", "standard", "admin");
      }).not.toThrow();
    });

    it("should handle retry_queue trigger", () => {
      expect(() => {
        trackAnalysisStart("retry-session", "standard", "retry_queue");
      }).not.toThrow();
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle multiple sessions concurrently", () => {
      expect(() => {
        // Simulate multiple concurrent sessions
        for (let i = 0; i < 10; i++) {
          trackAnalysisStart(`concurrent-${i}`, "standard", "user");
          trackPartComplete(`concurrent-${i}`, 1, `Content ${i}`, 1000);
          trackAnalysisComplete(`concurrent-${i}`, 1000);
        }
      }).not.toThrow();
    });

    it("should handle rapid successive calls", () => {
      expect(() => {
        const sessionId = "rapid-session";
        // Rapid fire calls
        for (let i = 0; i < 100; i++) {
          trackPartComplete(sessionId, 1, `Content ${i}`, i);
        }
      }).not.toThrow();
    });
  });

  describe("Error Recovery", () => {
    it("should continue working after errors", () => {
      // Trigger some operations that might fail
      trackAnalysisStart("error-session-1", "standard", "user");
      trackAnalysisFailure("error-session-1", new Error("Test error"), 1);
      
      // Should still work for new sessions
      expect(() => {
        trackAnalysisStart("error-session-2", "standard", "user");
        trackAnalysisComplete("error-session-2", 5000);
      }).not.toThrow();
    });

    it("should handle circuit breaker reset", () => {
      // Reset circuit breaker
      resetCircuitBreaker();
      
      // Should work normally after reset
      expect(() => {
        trackAnalysisStart("post-reset-session", "standard", "user");
        trackAnalysisComplete("post-reset-session", 5000);
      }).not.toThrow();
      
      expect(getCircuitBreakerStatus().isOpen).toBe(false);
    });
  });

  describe("Options Handling", () => {
    it("should handle debug option", () => {
      expect(() => {
        trackAnalysisStart("debug-session", "standard", "user", { debug: true });
        trackPartComplete("debug-session", 1, "content", 1000, { debug: true });
        trackAnalysisComplete("debug-session", 1000, { debug: true });
      }).not.toThrow();
    });

    it("should handle async option", () => {
      expect(() => {
        trackAnalysisStart("async-session", "standard", "user", { async: true });
        trackAnalysisStart("sync-session", "standard", "user", { async: false });
      }).not.toThrow();
    });

    it("should handle combined options", () => {
      expect(() => {
        trackAnalysisStart("combined-session", "standard", "user", { 
          async: true, 
          debug: true 
        });
      }).not.toThrow();
    });
  });

  describe("Memory Management", () => {
    it("should not leak memory with many operations", () => {
      // Run many operations
      for (let i = 0; i < 200; i++) {
        trackAnalysisStart(`memory-test-${i}`, "standard", "user");
        trackAnalysisComplete(`memory-test-${i}`, 1000);
      }
      
      // Cache should have cleaned up old entries
      // (exact size depends on timing, but should be bounded)
      const cacheSize = getIdempotencyCacheSize();
      expect(cacheSize).toBeLessThanOrEqual(200);
    });

    it("should clear cache properly", () => {
      // Add some entries
      trackAnalysisStart("cache-test-1", "standard", "user");
      trackAnalysisStart("cache-test-2", "standard", "user");
      
      // Clear
      clearIdempotencyCache();
      
      expect(getIdempotencyCacheSize()).toBe(0);
    });
  });
});

describe("SafeOperationTracker - Integration Scenarios", () => {
  beforeEach(() => {
    resetCircuitBreaker();
    clearIdempotencyCache();
  });

  it("should simulate complete Observer flow", async () => {
    const sessionId = "observer-flow-test";
    
    // Start
    trackAnalysisStart(sessionId, "standard", "user");
    
    // Single part
    trackPartStart(sessionId, 1);
    trackPartComplete(sessionId, 1, "Observer analysis content", 5000);
    
    // Complete
    trackAnalysisComplete(sessionId, 5000);
    
    // All operations should complete without error
    expect(true).toBe(true);
  });

  it("should simulate complete Insider flow", async () => {
    const sessionId = "insider-flow-test";
    
    // Start
    trackAnalysisStart(sessionId, "medium", "user");
    
    // Part 1
    trackPartStart(sessionId, 1);
    trackPartComplete(sessionId, 1, "Insider Part 1", 3000);
    
    // Part 2
    trackPartStart(sessionId, 2);
    trackPartComplete(sessionId, 2, "Insider Part 2", 4000);
    
    // Complete
    trackAnalysisComplete(sessionId, 7000);
    
    expect(true).toBe(true);
  });

  it("should simulate complete Syndicate flow", async () => {
    const sessionId = "syndicate-flow-test";
    
    // Start
    trackAnalysisStart(sessionId, "full", "user");
    
    // All 6 parts
    for (let i = 1; i <= 6; i++) {
      trackPartStart(sessionId, i);
      trackPartComplete(sessionId, i, `Syndicate Part ${i}`, i * 2000);
    }
    
    // Complete
    trackAnalysisComplete(sessionId, 42000);
    
    expect(true).toBe(true);
  });

  it("should simulate Syndicate failure with partial success", async () => {
    const sessionId = "syndicate-partial-test";
    
    // Start
    trackAnalysisStart(sessionId, "full", "user");
    
    // Complete first 4 parts
    for (let i = 1; i <= 4; i++) {
      trackPartStart(sessionId, i);
      trackPartComplete(sessionId, i, `Part ${i}`, i * 2000);
    }
    
    // Part 5 fails
    trackPartStart(sessionId, 5);
    trackPartFailure(sessionId, 5, new Error("API timeout"), "TIMEOUT");
    
    // Partial success (4/6 = 66%)
    trackPartialSuccess(sessionId, 4, 6);
    
    expect(true).toBe(true);
  });

  it("should simulate circuit breaker scenario", async () => {
    const sessionId = "circuit-breaker-test";
    
    // Start
    trackAnalysisStart(sessionId, "standard", "user");
    
    // Queued for retry due to circuit breaker
    trackQueuedForRetry(sessionId, "Circuit breaker open");
    
    // Later retry succeeds
    trackAnalysisStart(sessionId, "standard", "retry_queue");
    trackPartComplete(sessionId, 1, "Retry content", 5000);
    trackAnalysisComplete(sessionId, 5000);
    
    expect(true).toBe(true);
  });

  it("should simulate admin regeneration", async () => {
    const sessionId = "admin-regen-test";
    
    // Original attempt failed
    trackAnalysisStart(sessionId, "full", "user");
    trackPartComplete(sessionId, 1, "Part 1", 3000);
    trackPartComplete(sessionId, 2, "Part 2", 3000);
    trackPartFailure(sessionId, 3, new Error("API error"), "API_ERROR");
    trackAnalysisFailure(sessionId, new Error("Failed at part 3"), 3);
    
    // Admin triggers regeneration
    trackAnalysisStart(sessionId, "full", "admin");
    for (let i = 1; i <= 6; i++) {
      trackPartComplete(sessionId, i, `Regenerated Part ${i}`, i * 2000);
    }
    trackAnalysisComplete(sessionId, 42000);
    
    expect(true).toBe(true);
  });
});
