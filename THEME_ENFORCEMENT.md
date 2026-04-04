# Theme Enforcement Strategy (Phase 5)

## Overview
This document outlines the automated enforcement mechanisms for maintaining the warm theme across Chromatique.

## Enforcement Layers

### 1. Local Pre-Commit Hook
**Location:** `.husky/pre-commit`

Before each commit, the hook runs:
```bash
npm run check:warm-theme
```

**Trigger:** Automatically on `git commit` (requires `husky` installation)

**Setup:** Run once after cloning:
```bash
npm install
npx husky install
```

**What it checks:**
- No cool-tone Tailwind utilities (slate, indigo, blue, purple, violet)
- No banned hex colors (#6366f1, #7c3aed, #60a5fa, #3b82f6, #a78bfa, #34d399)
- No cool rgba patterns
- No undefined slate token references

**Bypass:** ⚠️ Not recommended
```bash
git commit --no-verify
```

### 2. Continuous Integration (GitHub Actions)
**Location:** `.github/workflows/theme-compliance.yml`

Runs on every PR and push to `main`:

**Steps:**
1. Install dependencies
2. Run warm theme compliance check (blocks if failed)
3. Build project verification
4. Test suite validation
5. Accessibility checks

**Status:** Required check—PRs cannot merge until passing.

### 3. Build-Time Check
**Command:** `npm run check:all`

Runs both:
- `npm run check:warm-theme` (compliance)
- `npm run build` (production build)

Recommended before deployment.

### 4. Manual Lint Command
**Command:** `npm run check:warm-theme`

Standalone compliance check for development:
```bash
npm run check:warm-theme
```

**Output:**
```
✅ Warm theme compliance check passed across 20 files.
```

or

```
❌ Found cool-tone violations:
  src/components/Example.jsx:42: Banned class: text-slate-700
  src/styles/theme.css:15: Banned hex: #3b82f6
```

## Whitelisted Educational Content

The following strings are explicitly whitelisted (not flagged as violations):
- Educational color-blindness terminology ("blue", "purple", "yellow", "violet" in non-UI text)
- Test fixture color names
- Comments explaining historical cool-tone usage

**Whitelist location:** `scripts/check-warm-theme.mjs` (lines with `exceptions` array)

## Token Reference for Developers

All UI colors must use design tokens from `src/styles/design-tokens.css`:

### Core Tokens
```css
--color-brand-primary: #9d7e60;      /* Warm brown */
--color-brand-secondary: #b87333;    /* Copper */
--color-brand-accent: #d4af37;       /* Gold */
```

### State Tokens
```css
--color-input-border-focus: rgba(212, 175, 55, 0.4);
--color-interactive-hover: rgba(184, 115, 51, 0.15);
--color-selection-bg: rgba(212, 175, 55, 0.15);
```

### Usage Example
```jsx
// ❌ Hardcoded (violation)
<button style={{ borderColor: '#34d399' }}>Click</button>

// ✅ Token-based (correct)
<button style={{ borderColor: 'var(--color-brand-accent)' }}>Click</button>

// ✅ Tailwind warm utility (correct)
<button className="border-amber-500">Click</button>
```

## Reporting and Remediation

If you encounter a violation during commit/CI:

1. **Run locally:** `npm run check:warm-theme`
2. **Identify violations:** Review output with file/line numbers
3. **Fix options:**
   - Replace with token reference: `var(--color-brand-accent)`
   - Replace with warm Tailwind class: `text-amber-*`, `bg-stone-*`
   - Add to whitelist if legitimate (contacts maintainers)
4. **Verify:** `npm run check:all` (compliance + build)
5. **Commit:** `git commit` (pre-commit hook validates)

## Maintenance & Updates

### Adding New Design Tokens
1. Define token in `src/styles/design-tokens.css`
2. Use token in component styles
3. No need to update checker (unless introducing new colors)

### Updating Compliance Rules
- Edit `scripts/check-warm-theme.mjs`
- Update `bannedPatterns` or `bannedHexValues` arrays
- Test with: `npm run check:warm-theme`

### Reviewing CI Results
- GitHub Actions workflow: `.github/workflows/theme-compliance.yml`
- View logs in PR checks tab
- All checks must pass before merge

## Future Enhancements

- [ ] Automated color contrast validation in CI
- [ ] Visual regression testing on theme changes
- [ ] WCAG 2.1 accessibility audit in CI
- [ ] Component snapshot testing for visual consistency
- [ ] Pre-push hooks for extended validation
