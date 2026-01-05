# Design Validation Checklist

Use this checklist after deployment to verify all Technical Brutalist design elements are rendering correctly.

---

## Admin Dashboard (/admin)

### Background Elements
| Element | Expected | How to Check |
|---------|----------|--------------|
| Fractal Blobs | 3 colored gradient circles floating in background | Should see pink/purple/blue blurred shapes |
| Noise Texture | Subtle grain overlay on entire page | Look for fine texture, especially visible on light areas |
| Background Color | Light: white (#FFFFFF), Dark: navy (#0f0f23) | Check overall page background |

### Header
| Element | Expected | How to Check |
|---------|----------|--------------|
| Glassmorphism | Semi-transparent with blur effect | Header should have frosted glass look |
| Sticky Position | Header stays at top when scrolling | Scroll down and verify |
| Border | Bottom border visible | Thin line under header |

### Stat Cards (Revenue Metrics)
| Element | Expected | How to Check |
|---------|----------|--------------|
| Sharp Corners | No rounded corners (border-radius: 0) | Cards should have 90° corners |
| Left Accent Line | 4px indigo line on left edge on hover | Hover over card |
| Hover Animation | Card shifts right 4px on hover | Hover and watch movement |
| Glassmorphism | Semi-transparent background with blur | Compare to solid cards |

### Section Cards
| Element | Expected | How to Check |
|---------|----------|--------------|
| Sharp Corners | No rounded corners | 90° corners on all cards |
| Hover Shadow | Offset shadow appears on hover | Hover over card |
| Section Titles | Uppercase, monospace font, horizontal line | Check "Tier Distribution", "Payment Methods", etc. |

### Info Tooltips
| Section | Has Tooltip? |
|---------|-------------|
| Revenue Metrics | ✓ (i) icon next to title |
| Tier Distribution | ✓ (i) icon next to title |
| Payment Methods | ✓ (i) icon next to title |
| Email Subscribers | ✓ (i) icon next to title |
| Transaction History | ✓ (i) icon next to title |
| System Logs | ✓ (i) icon next to title |

---

## Demo Analysis (/demo-analysis)

### Background Elements
| Element | Expected | How to Check |
|---------|----------|--------------|
| Fractal Blobs | 3 colored gradient circles | Same as Admin Dashboard |
| Fixed Position | Blobs don't scroll with content | Scroll and verify blobs stay in place |

### Header
| Element | Expected | How to Check |
|---------|----------|--------------|
| Glassmorphism | backdrop-blur-xl effect | Frosted glass appearance |
| Sticky Position | Stays at top | Scroll to verify |
| Monospace Font | "Demo Analysis" in mono font | Check font style |
| Uppercase Text | Title is ALL CAPS | Visual check |

### Content Cards
| Element | Expected | How to Check |
|---------|----------|--------------|
| demo-card class | Applied to main content cards | Inspect element or visual check |

---

## Common Issues & Fixes

### Issue: No blur effect on cards/header
**Cause:** Browser doesn't support `backdrop-filter`
**Fix:** Works in Chrome, Safari, Edge. Firefox needs `layout.css.backdrop-filter.enabled` flag.

### Issue: Fractal blobs not visible
**Cause:** CSS classes not loading or z-index issue
**Fix:** Check if `.fractal-blob` classes exist in compiled CSS. Verify `z-index: 0` on blobs.

### Issue: Cards have rounded corners
**Cause:** Default Tailwind/shadcn styles overriding
**Fix:** Ensure `border-radius: 0` or `rounded-none` is applied.

### Issue: Noise texture not visible
**Cause:** `--noise-opacity` variable set to 0 in light mode
**Fix:** This is intentional - noise is more visible in dark mode.

### Issue: Hover effects not working
**Cause:** Touch device or CSS not loaded
**Fix:** Hover effects only work on desktop. Check if `:hover` styles are in CSS.

---

## Quick Visual Test

1. **Open Admin Dashboard** → Should see floating colored blobs in background
2. **Hover over stat card** → Card should shift right with indigo accent line
3. **Click (i) icon** → Tooltip should appear with explanation
4. **Switch to dark mode** → Background should change to navy, noise texture more visible
5. **Open Demo Analysis** → Same blob background, glassmorphism header

---

## CSS Classes Reference

```css
/* Main containers */
.admin-container    /* Admin page wrapper with noise overlay */
.demo-card          /* Demo Analysis cards */

/* Cards */
.admin-card         /* Standard card with glassmorphism */
.admin-stat-card    /* Stat card with left accent on hover */

/* Typography */
.admin-section-title /* Uppercase mono with horizontal line */

/* Background */
.fractal-blob       /* Animated gradient circles */
.bg-noise           /* Noise texture overlay */
```

---

*Last updated: January 5, 2026*
