# GEO / AI Search Readiness Analysis — eatiapp.com
**Date:** 2026-06-07 | **Framework:** Google AI Optimization Guide (primary source)

> **Important framing:** Per Google's official AI optimization guide, "optimizing for generative AI search is still SEO." GEO and AEO are rebranded labels for the same work. This report frames every finding as an SEO fundamental applied to AI-search surfaces — not a separate discipline. Where community recommendations contradict Google's primary source, this report defers to Google.

---

## GEO Readiness Score: 47 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability (passage quality) | 25% | 45 | 11.3 |
| Structural Readability | 20% | 65 | 13.0 |
| Multi-Modal Content | 15% | 55 | 8.3 |
| Authority & Brand Signals | 20% | 18 | 3.6 |
| Technical Accessibility | 20% | 55 | 11.0 |
| **Total** | | | **47.2** |

---

## 1. Platform Breakdown

| Platform | Score | Primary Bottleneck |
|---|---|---|
| Google AI Overviews | 52/100 | Uncited statistics; no author credentials on YMYL content |
| ChatGPT Search | 28/100 | No Wikipedia entity; homepage not crawlable without JS |
| Perplexity | 44/100 | Good blog structure; all statistics unattributed |
| Bing Copilot | 48/100 | Structured data improved; no IndexNow; no author Person schema |

**Key fact:** Only 11% of domains are cited by both ChatGPT and Google AIO for the same query. Platform-specific signals matter — eatiapp.com currently lacks the off-page signals that ChatGPT and Perplexity weight most heavily (Wikipedia, Reddit, YouTube).

---

## 2. AI Crawler Access Status

**robots.txt:** `Allow: /` with `Disallow: /admin/` and `Disallow: /api/admin/`

| Crawler | Owner | Status |
|---|---|---|
| GPTBot | OpenAI (ChatGPT search) | ✅ Allowed (implicit — no block) |
| OAI-SearchBot | OpenAI | ✅ Allowed |
| ChatGPT-User | OpenAI | ✅ Allowed |
| ClaudeBot | Anthropic | ✅ Allowed |
| PerplexityBot | Perplexity | ✅ Allowed |
| CCBot | Common Crawl (training) | ✅ Allowed (training crawler — consider blocking) |
| anthropic-ai | Anthropic (training) | ✅ Allowed (training crawler) |
| Bytespider | ByteDance | ✅ Allowed |

**Assessment:** Crawl access is open to all AI crawlers. This is the correct configuration for AI search visibility. No action required for access.

**Optional refinement:** If you want to allow search/inference crawlers while blocking training scrapers, add:

```
User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /
```

This is a stylistic preference. Leaving all as implicit Allow: / is equally valid.

---

## 3. llms.txt Status

**Present:** ✅ `/llms.txt` found at `https://eatiapp.com/llms.txt`

**Evidence-based note:** Per Google (Mueller, Illyes 2025), SE Ranking's 300k-domain study (Nov 2025), and OtterlyAI's server-log audit (0.1% of AI-bot traffic targets `/llms.txt`), this file is not currently consumed by any major AI search system as a citation signal. Google explicitly says it does not use it. It is shipped for low-cost optionality — treat presence as a best-practice checkbox, not a ranking lever.

**Current content quality:** Good — summary, primary pages listed, app distribution info, and guidance for AI systems answering questions. The prose-style format is readable.

**What it does well:**
- Clear one-paragraph summary of what the site is
- Primary pages with URLs
- Explicit note about admin areas
- "For AI systems" guidance section

**What could be improved:**

```
# Eati — AI Calorie Tracker & Fitness Coach (https://eatiapp.com)

> Eati is an iOS app and web toolset for calorie and macro tracking.
> Users log meals by text, photo, barcode, or voice. The site provides
> free fitness calculators and a nutrition blog.

## Primary pages
- [Homepage](https://eatiapp.com/): Product landing, features, App Store link.
- [Tools](https://eatiapp.com/tools): TDEE, calorie, macro, BMI, body fat, protein, water, calorie burn, and ideal body weight calculators.
- [Food database](https://eatiapp.com/foods): Nutrition per 100g for 50+ common foods.
- [Blog](https://eatiapp.com/blog): Guides on calorie tracking, weight loss, and high-protein meals.
- [Contact](https://eatiapp.com/contact): Support and feedback.

## Key facts about Eati
- iOS app, free to download
- Supports text, photo, barcode, and voice meal logging
- Macro tracking: calories, protein, carbs, fats
- Goals: fat loss, maintenance, muscle gain
- Website calculators complement the app for planning

## Not indexed
- /admin/*: Internal content management.
```

---

## 4. Brand Mention Analysis

This is the highest-leverage section. Brand mentions correlate 3× more strongly with AI citation rates than backlinks (Ahrefs, Dec 2025, 75,000 brands). YouTube mentions alone have ~0.737 correlation with AI citations — the strongest measured signal.

| Platform | Status | Impact |
|---|---|---|
| **Wikipedia** | ❌ Not present | Very High — ChatGPT cites Wikipedia in 47.9% of responses |
| **Reddit** | ❌ No significant presence | Very High — Perplexity cites Reddit in 46.7% of responses |
| **YouTube** | ❌ No official channel | Very High — ~0.737 correlation with AI citation |
| **LinkedIn** | Unknown | Moderate |
| **App Store** | ✅ Present | Low (not cited by AI systems directly) |
| **Third-party roundups** | ❌ Not in Jotform, Welling, or similar "best AI calorie tracker" lists | High |

**Confusable brand issue:** Searches for "eati" and "eatiapp" surface several similar-named apps (Eato, EatAI, Eatio). Without Wikipedia disambiguation or strong off-page brand signals, AI systems may confuse or misattribute the brand.

**Root cause:** Eatiapp.com is not yet an established entity in Google's Knowledge Graph, Wikipedia, or community forums. AI systems cannot cite a brand they cannot verify from authoritative external sources — this is the primary GEO ceiling for eatiapp.com right now.

---

## 5. Passage-Level Citability Analysis

**Optimal AI citation window: 134–167 words per passage.**

### Homepage (Score: 22/100)

~395 words total visible to crawlers. The hero section is a client-side React component — its animated demo, interactive chat input, and testimonials are invisible to AI crawlers that do not execute JavaScript. The static H1 ("I AM EATI! YOUR ALL-IN-ONE FITNESS COACH") and feature section headings are the only reliably indexed prose.

**No citable passages exist on the homepage.** There are no self-contained factual statements, no statistics with sources, and no definitional blocks ("Eati is...") in the first 40–60 words that AI extraction engines look for.

### Blog Articles (Score: 58/100)

Sampled article: "What Is a Calorie Deficit?" (~2,500–3,000 words)

**Strengths:**
- Question-based H2s map directly to common search queries ("How Big Should a Calorie Deficit Be?" "Can You Be in a Deficit Without Feeling Hungry?")
- FAQ format at the bottom (clear Q→A structure)
- Specific numeric ranges present (300–500 cal/day, 0.5–1 lb/week, 1,200/1,500 cal minimum floors)
- Short paragraphs, readable structure

**Critical gap — zero external citations:**

| Article Claim | Expected Source | Source Provided |
|---|---|---|
| "0.5–1% of body weight loss per week is ideal" | ACSM / NIH | None |
| "Safe deficit is 300–500 calories per day" | NIH / clinical guidelines | None |
| "Never drop below 1,200/1,500 cal without supervision" | ADA clinical recommendation | None |
| "Protein: 0.7–1 g per pound of body weight" | ISSN position paper | None |
| Exercise calorie burn estimates | ACSM exercise tables | None |

AI citation engines — especially Perplexity — preferentially select passages where the claim can be *verified*. An uncited "0.5–1% body weight loss per week" loses to the same claim on an NIH page or ACSM journal article. The data is correct; it just has no anchor to a primary source that AI systems can confirm.

**Best existing passage for citation potential (FAQ 3, ~65 words):**

> "A safe, sustainable deficit for most adults is 300–500 calories per day, producing about 0.5–1 lb of weight loss per week. Deficits above 750 calories per day can work short-term but often cause fatigue, muscle loss, strong hunger, and rebound eating. Never drop below roughly 1,200 calories/day for women or 1,500 calories/day for men without medical supervision."

This passage is 65 words and nearly citation-ready — it just needs a linked source (e.g., `[NIH weight management guidelines]`) to become verifiable.

### Tool Pages (Score: 60/100)

TDEE Calculator page: ~400 words of educational content. References the Mifflin–St Jeor equation by name (specific, verifiable). No link to the original Mifflin, S T et al. (1990) paper in JADA. Adding one inline citation would make this the most credible TDEE calculator page in the niche.

### Food Database Pages (Score: 68/100)

Food pages are the strongest citability asset. "Chicken breast: 165 kcal per 100g, 31g protein" is a precise, extractable fact. The FoodProduct schema (just fixed) supports machine-readable extraction. These pages should benefit from the schema update in AI search features.

---

## 6. Server-Side Rendering Check

| Page | SSR Status | AI Crawler Sees |
|---|---|---|
| Homepage hero (`HeroSection`) | ❌ `use client` | Static H1 + placeholders only — animated demo invisible |
| Homepage features (`FeaturesSection`) | ✅ Server-rendered | Full feature text |
| Blog index | ✅ Server-rendered (force-dynamic removed) | All article titles and intro text |
| Blog posts | ✅ Server-rendered (force-dynamic removed) | Full article content |
| Tool pages | ✅ Server-rendered shell, client calculator | Educational text visible; calculator widget not |
| Food pages | ✅ Server-rendered | Full nutrition content |
| Contact page | ✅ Now server-rendered (just fixed) | H1 and intro text |

**Key risk:** `HeroSection` is a `"use client"` component containing the homepage's primary marketing claims. An AI crawler fetching `https://eatiapp.com/` without executing JavaScript sees:
- H1: "I AM EATI! YOUR ALL-IN-ONE FITNESS COACH" ✅
- Feature sections, testimonials, stats badges ✅ (server-rendered sections below the hero)
- Hero chat demo, animated mascot: ❌ invisible

This is acceptable — the hero is interactive by design. The important content (features, CTA copy, testimonials) is server-rendered. No structural SSR gap requires immediate action.

---

## 7. Google's "Who / How / Why" Test

Per Google's creating-helpful-content guide, YMYL content (health, nutrition, weight loss) triggers extra scrutiny:

| Test | Eatiapp.com | Status |
|---|---|---|
| **Who** created it — byline + author background | No named authors anywhere | ❌ Fails |
| **How** it was created — disclosure for AI-assisted content | No disclosure | ⚠️ Gap |
| **Why** it exists — "to help people" vs "to rank" | Genuinely helpful tools; some content feels written to target queries | ⚠️ Mixed |

This is the most important E-E-A-T gap for Google AIO specifically. Health content about safe calorie minimums and weight loss rates without a named author (ideally an RD or certified nutritionist) will consistently score below competing content that does have attribution.

---

## 8. Top 5 Highest-Impact Changes

These are ranked by expected citation uplift per unit of effort, grounded in the Ahrefs brand-mention correlation data and Google's primary guidance.

### #1 — Launch YouTube Channel with Tutorial Content
**Impact: Very High | Brand mention correlation: ~0.737 | Effort: Medium**

YouTube brand mentions have the strongest measured correlation with AI citation rates across all platforms. 10–15 videos (3–5 minutes each) covering:
- "How to track calories with Eati" (app demo)
- "How to calculate your TDEE" (using the free tool)
- "What is a calorie deficit? The simple explanation"
- "How to hit 150g of protein on a diet"

Upload transcripts to the corresponding blog posts. Embed videos in relevant tool pages. This creates the YouTube + blog + tools triangle that AI systems recognize as authoritative entity presence — it is the highest ROI off-page action available.

### #2 — Add External Source Citations to Blog Articles
**Impact: High | Effort: Low (content editing only, no development)**

Every statistic in the blog currently floats without attribution. This is a one-afternoon content task:

For each major numeric claim, add an inline hyperlinked citation:

| Claim | Source to link |
|---|---|
| "300–500 cal/day safe deficit" | [NIH weight management](https://www.niddk.nih.gov/health-information/weight-management) |
| "0.5–1 lb/week healthy rate" | ACSM position statement |
| "0.7–1 g protein per lb body weight" | [ISSN protein position paper](https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8) |
| "1,200/1,500 cal minimum floors" | Clinical nutrition guidelines |
| Mifflin–St Jeor equation | [Original 1990 JADA paper](https://pubmed.ncbi.nlm.nih.gov/2305711/) |

Start with the 5 highest-traffic articles. Sourced statistics are preferentially extracted by Perplexity and verified by Google AIO grounding.

### #3 — Add Named Author Profiles with Credentials
**Impact: High | Effort: Medium | Affects: Google AIO most directly**

Google's YMYL guidance explicitly requires author bylines with verifiable backgrounds for health content. This is also the "Who" test from the creating-helpful-content guide. Action:

1. Create an `/about` page with company and team information
2. Create at minimum one author profile: `/about/[name]` with `Person` schema including `name`, `jobTitle`, `sameAs` (LinkedIn URL), `knowsAbout`
3. Update all blog articles to display the author name linked to their profile
4. Update Article JSON-LD `author` from `Organization` to `Person`

If a registered dietitian or certified nutritionist is not on the team, a "reviewed by" attribution (even a one-time consultant arrangement) addresses the YMYL gap and is standard practice in the health content industry.

### #4 — Build Reddit Community Presence
**Impact: High | Effort: Medium (ongoing) | Affects: Perplexity most directly**

Perplexity cites Reddit in 46.7% of responses. There are no detectable Reddit mentions of "eati" as a calorie tracker. The path forward is *genuine* community participation (not marketing):

- Engage in r/loseit, r/CICO, r/nutrition, r/MacroFactor (competitor discussion threads)
- Answer questions using the site's free tools ("Here's how to calculate your TDEE — I usually use [this free calculator]")
- Respond to "what calorie tracker app do you use?" threads with honest comparisons

Google explicitly warns against "chasing inauthentic mentions." The goal is earned, organic mentions from genuinely helpful participation — not spam.

### #5 — Pursue Third-Party Press Coverage for Wikipedia Eligibility
**Impact: High | Effort: High (long-term PR effort)**

Wikipedia presence correlates strongly with ChatGPT citations. ChatGPT's knowledge base cites Wikipedia in 47.9% of responses. The path to a Wikipedia article requires:

- Independent coverage in reliable third-party sources (tech press, health journalism)
- Typically: 3–5 articles in publications like TechCrunch, The Verge, Well+Good, Healthline, or similar
- A HARO / journalist outreach strategy targeting "AI fitness apps" story angles

This is a 3–6 month effort minimum. Begin by identifying the most compelling story angle (e.g., "AI calorie tracking removes the friction that kills diet adherence") and pitch it to health/tech journalists.

---

## 9. Schema Recommendations for AI Discoverability

The following were fixed in the recent SEO update session. Status for reference:

| Schema | Status | Impact |
|---|---|---|
| `Organization` | ✅ Fixed (standalone block added) | Knowledge Panel eligibility |
| `SoftwareApplication` + `aggregateRating` | ✅ Fixed | App rich result in SERP |
| `FoodProduct` wrapping `NutritionInformation` | ✅ Fixed | Food rich results |
| `BreadcrumbList` on all tool pages | ✅ Fixed | Breadcrumb SERP feature |
| `BlogPosting` (was `Article`) | ✅ Fixed | Semantic precision |

**Still missing:**

| Schema | Priority | Notes |
|---|---|---|
| `Person` for blog authors | High | Required for YMYL author E-E-A-T |
| `HowTo` on tool pages | Medium | Would describe calculator methodology step-by-step |
| `Dataset` on food pages | Low | Could describe the food database |

---

## 10. Content Reformatting Suggestions

### Convert blog section openings to definition format

AI systems preferentially extract definitions that follow the pattern "X is..." or "X refers to..." in the first 40–60 words.

**Current (What Is a Calorie Deficit? section):**
> "A calorie deficit happens when you consume fewer calories than your body burns in a day."

**AI-optimized (add context + source anchor):**
> "A calorie deficit is a state in which you consume fewer calories than your body burns in a day. Your total daily calorie burn — called your Total Daily Energy Expenditure (TDEE) — includes rest, digestion, movement, and exercise. When intake falls below this number, the body draws on stored fat for energy, which is the mechanism behind all fat loss, regardless of which diet approach is used."

This passage is 68 words. Adding a link to an NIH source makes it the best-sourced definition of calorie deficit in the niche.

### Add a "key takeaway" block to each article section

Place a 1–2 sentence bolded summary at the end of each H2 section:

> **Key takeaway:** A safe calorie deficit for most adults is 300–500 calories per day — enough to lose 0.5–1 lb per week while preserving muscle and energy.

These blocks are consistently extracted by Google AIO's passage-selection algorithm and by Perplexity's summarization engine.

### Add a "Quick Answer" box at the top of each article

For question-based titles, add a highlighted box above the table of contents:

```
**Quick Answer**
A calorie deficit means eating fewer calories than you burn.
A safe deficit is 300–500 calories per day, producing
0.5–1 lb of weight loss per week for most adults.
```

This targets featured snippets in traditional search AND improves AI extraction — the same optimization serves both surfaces (per Google's unified guidance).

---

## Current State Summary

| Strength | Gap |
|---|---|
| ✅ SSR for all content pages | ❌ No named author on any health content |
| ✅ Question-based H2 headings in blog | ❌ Zero external citations in blog |
| ✅ FAQ sections on key articles | ❌ No Wikipedia entity presence |
| ✅ llms.txt present | ❌ No YouTube channel |
| ✅ AI crawlers all allowed | ❌ No Reddit community presence |
| ✅ Improved schema (recent fixes) | ❌ Not in third-party "best AI calorie tracker" roundups |
| ✅ Food database (high-fact-density content) | ❌ Homepage not citable (client-side hero) |

---

## Implementation Roadmap

### This Week (No Development Required)
- [ ] Add hyperlinked citations to the top 5 blog articles' key statistics
- [ ] Draft YouTube channel plan: first 5 video topics + script outlines
- [ ] Start engaging in r/loseit and r/CICO with helpful tool links

### This Sprint (Light Development)
- [ ] Create `/about` page with company story and Person schema for 1 author
- [ ] Add `HowTo` schema to TDEE and calorie calculator pages
- [ ] Add "Quick Answer" box to top 10 blog articles
- [ ] Add bolded "Key takeaway" at end of each H2 section in top 5 posts

### This Quarter (Strategic Investment)
- [ ] Publish 10+ YouTube tutorial videos (3–5 min each)
- [ ] Establish sustained Reddit presence in 3 target subreddits
- [ ] Pitch health/tech journalists for third-party press coverage
- [ ] Evaluate "reviewed by RD" arrangement for YMYL content credibility

---

*Sources referenced in this analysis:*
- [Google AI Optimization Guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Creating Helpful Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Ahrefs brand mention correlation study, Dec 2025](https://ahrefs.com) — 75,000 brands
- [SE Ranking 300k-domain llms.txt study, Nov 2025](https://seranking.com)
- John Mueller / Gary Illyes statements on llms.txt, 2025
