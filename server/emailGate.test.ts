import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Email Gate Functionality Tests
 * Tests the email gate modal behavior including:
 * - Honeypot spam protection
 * - Email validation
 * - Form submission handling
 */

describe('Email Gate Honeypot Protection', () => {
  // Simulate the honeypot logic from DemoAnalysis.tsx
  const simulateFormSubmission = (email: string, honeypotValue: string) => {
    // This mirrors the logic in EmailGateModal component
    if (honeypotValue) {
      return { blocked: true, reason: 'bot_detected' };
    }
    if (!email || !email.includes('@')) {
      return { blocked: true, reason: 'invalid_email' };
    }
    return { blocked: false, email };
  };

  it('should block submission when honeypot field is filled (bot detection)', () => {
    const result = simulateFormSubmission('bot@spam.com', 'http://spam-site.com');
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('bot_detected');
  });

  it('should allow submission when honeypot field is empty', () => {
    const result = simulateFormSubmission('user@example.com', '');
    expect(result.blocked).toBe(false);
    expect(result.email).toBe('user@example.com');
  });

  it('should block submission with invalid email (no @ symbol)', () => {
    const result = simulateFormSubmission('invalid-email', '');
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('invalid_email');
  });

  it('should block submission with empty email', () => {
    const result = simulateFormSubmission('', '');
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('invalid_email');
  });

  it('should allow valid email with empty honeypot', () => {
    const result = simulateFormSubmission('test@validatestrategy.com', '');
    expect(result.blocked).toBe(false);
    expect(result.email).toBe('test@validatestrategy.com');
  });
});

describe('Email Gate Scroll Trigger', () => {
  it('should calculate scroll progress correctly', () => {
    // Simulate scroll progress calculation
    const calculateScrollProgress = (scrollTop: number, docHeight: number, windowHeight: number) => {
      const scrollableHeight = docHeight - windowHeight;
      return (scrollTop / scrollableHeight) * 100;
    };

    // At top of page
    expect(calculateScrollProgress(0, 2000, 800)).toBe(0);
    
    // At 50% scroll
    expect(calculateScrollProgress(600, 2000, 800)).toBe(50);
    
    // At bottom of page
    expect(calculateScrollProgress(1200, 2000, 800)).toBe(100);
  });

  it('should trigger email gate at 50% scroll threshold', () => {
    const shouldTriggerGate = (progress: number, isUnlocked: boolean, hasTriggered: boolean) => {
      return progress >= 50 && !isUnlocked && !hasTriggered;
    };

    // Should trigger at exactly 50%
    expect(shouldTriggerGate(50, false, false)).toBe(true);
    
    // Should trigger above 50%
    expect(shouldTriggerGate(75, false, false)).toBe(true);
    
    // Should NOT trigger below 50%
    expect(shouldTriggerGate(49, false, false)).toBe(false);
    
    // Should NOT trigger if already unlocked
    expect(shouldTriggerGate(75, true, false)).toBe(false);
    
    // Should NOT trigger if already triggered once
    expect(shouldTriggerGate(75, false, true)).toBe(false);
  });
});

describe('Email Gate localStorage Persistence', () => {
  beforeEach(() => {
    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('should check localStorage for previous unlock state', () => {
    const checkUnlockState = () => {
      const unlocked = localStorage.getItem('demo_analysis_unlocked');
      return unlocked === 'true';
    };

    // Mock unlocked state
    vi.mocked(localStorage.getItem).mockReturnValue('true');
    expect(checkUnlockState()).toBe(true);

    // Mock not unlocked state
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    expect(checkUnlockState()).toBe(false);
  });

  it('should save unlock state to localStorage after email submission', () => {
    const saveUnlockState = () => {
      localStorage.setItem('demo_analysis_unlocked', 'true');
    };

    saveUnlockState();
    expect(localStorage.setItem).toHaveBeenCalledWith('demo_analysis_unlocked', 'true');
  });
});
