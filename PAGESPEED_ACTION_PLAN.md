# PageSpeed Optimization Action Plan

**Dátum:** 2026. január 5.  
**Jelenlegi pontszámok (Mobile):**
- Performance: **67/100** → Cél: **90+**
- Accessibility: **90/100** → Cél: **95+**
- Best Practices: **81/100** → Cél: **90+**
- SEO: **100/100** ✅

---

## Jelenlegi Core Web Vitals Metrikák

| Metrika | Jelenlegi | Cél | Státusz |
|---------|-----------|-----|---------|
| First Contentful Paint (FCP) | 3.5s | <1.8s | 🔴 Kritikus |
| Largest Contentful Paint (LCP) | 4.7s | <2.5s | 🔴 Kritikus |
| Total Blocking Time (TBT) | 250ms | <200ms | 🟡 Javítandó |
| Cumulative Layout Shift (CLS) | 0 | <0.1 | ✅ OK |
| Speed Index | 5.6s | <3.4s | 🔴 Kritikus |

---

## Azonosított Problémák és Megoldások

### 🔴 KRITIKUS - Phase 1: Render-Blocking Resources (Est. 250ms savings)

**Probléma:** CSS blokkolja az initial render-t
- `/assets/index-DbzPeNW8.css` - 29.7 KiB, 480ms késleltetés

**Megoldás:**
1. Critical CSS inline-olása a `<head>`-be
2. Non-critical CSS async betöltése `media="print" onload="this.media='all'"`
3. Font preload hozzáadása

**Implementáció:**
```html
<!-- Critical CSS inline -->
<style>
  /* Above-the-fold styles */
</style>

<!-- Non-critical CSS async -->
<link rel="preload" href="/assets/index.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/assets/index.css"></noscript>
```

---

### 🔴 KRITIKUS - Phase 2: Reduce Unused JavaScript (Est. 191 KiB savings)

**Probléma:** Nagy JavaScript bundle-ök
- `validatestrategy.com` - 256.9 KiB → 124.2 KiB megtakarítható
- `https://validatestrategy.com` - 102.7 KiB → 62.8 KiB megtakarítható
- `/assets/index-D1qH9kSE.js` - 154.2 KiB → 61.4 KiB megtakarítható

**Megoldás:**
1. **Route-based code splitting** - Már implementálva React.lazy()-vel
2. **Tree shaking** - Vite config optimalizálás
3. **Dynamic imports** - Nehéz komponensek lazy load-ja
4. **Bundle analyzer** - Felesleges függőségek azonosítása

**Implementáció:**
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-charts': ['recharts'],
        'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
      }
    }
  }
}
```

---

### 🟡 KÖZEPES - Phase 3: Network Dependency Tree

**Probléma:** Kritikus útvonal késleltetés - 2,761ms
- Initial Navigation → JS → tRPC batch → CSS

**Megoldás:**
1. **Preconnect** hozzáadása külső origin-ekhez
2. **DNS-prefetch** optimalizálás
3. **Resource hints** prioritizálás

**Implementáció:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://api.manus.im">
```

---

### 🟡 KÖZEPES - Legacy JavaScript (Est. 8 KiB savings)

**Probléma:** Modern böngészőknek nem szükséges polyfill-ek

**Megoldás:**
1. `browserslist` config frissítése
2. `@babel/preset-env` targets beállítása
3. Felesleges polyfill-ek eltávolítása

---

### 🟡 KÖZEPES - Accessibility Fixes

**Probléma 1:** Buttons do not have an accessible name
- Icon-only gombok aria-label nélkül

**Megoldás:**
```tsx
<Button aria-label="Refresh data">
  <RefreshCw className="h-4 w-4" />
</Button>
```

**Probléma 2:** Background and foreground colors do not have sufficient contrast ratio
- Muted text színek túl halványak

**Megoldás:**
- `text-muted-foreground` kontraszt növelése
- Minimum 4.5:1 kontraszt arány biztosítása

---

## Implementációs Ütemterv

### Phase 1: Critical Rendering Path (Becsült hatás: +10-15 pont)
- [ ] Critical CSS azonosítása és inline-olása
- [ ] CSS async betöltés implementálása
- [ ] Font preload optimalizálás
- **Becsült idő:** 30 perc

### Phase 2: JavaScript Optimization (Becsült hatás: +15-20 pont)
- [ ] Vite config manual chunks beállítása
- [ ] Vendor bundle szeparálás
- [ ] Unused code tree shaking
- [ ] Dynamic imports nehéz komponensekhez
- **Becsült idő:** 45 perc

### Phase 3: Accessibility (Becsült hatás: +5 pont)
- [ ] Icon button aria-label-ek hozzáadása
- [ ] Kontraszt arányok javítása
- [ ] Focus states ellenőrzése
- **Becsült idő:** 20 perc

---

## Várható Eredmények

| Metrika | Előtte | Utána (becsült) |
|---------|--------|-----------------|
| Performance | 67 | 85-95 |
| Accessibility | 90 | 95+ |
| Best Practices | 81 | 90+ |
| FCP | 3.5s | <2.0s |
| LCP | 4.7s | <2.5s |
| TBT | 250ms | <150ms |

---

## Kockázatok és Megjegyzések

1. **3rd party scripts** (manuscdn.com) - 200.2 KiB, nem tudjuk közvetlenül optimalizálni
2. **tRPC batch calls** - A kritikus útvonalon van, de szükséges az auth-hoz
3. **Recharts library** - Nagy méretű, de szükséges a dashboard-hoz

---

## Következő Lépések

1. ✅ Action plan elkészítése
2. ⏳ Phase 1 implementálása
3. ⏳ Phase 2 implementálása
4. ⏳ Phase 3 implementálása
5. ⏳ Újratesztelés PageSpeed Insights-szal
