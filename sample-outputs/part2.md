# PART 2 – Strategic Design & Roadmap

## Tailored Methodology (Ideation & Design Phase)

### Method 1: Service Blueprinting (Backend/Frontend Alignment)

🧠 **Rationale:**  
Marketing agencies have complex backend operations (CRM, project management, billing, legal review, content production) that must align with frontend promises. Blueprinting prevents "dark patterns by accident" — e.g., promising 24-hour campaign launch when legal review takes 3 days. For a Web2/Web3 hybrid agency, the blueprint must show divergent flows: Web2 clients expect email-based onboarding and Calendly scheduling; Web3 clients expect wallet-connect and Discord invitations.[1][2][3][4]

**Application:** Week 4  
**Expected Output:**
- Multi-swim-lane blueprint showing:
  - **Customer Actions:** Discover agency → Explore services → Select tier → Onboard → First campaign kickoff
  - **Frontstage (Visible):** Landing page, pricing page, onboarding forms, wallet-connect modal, confirmation emails
  - **Backstage (Hidden):** CRM entry creation (HubSpot), legal compliance review (Web3 campaigns), content brief generation (AI-assisted), Discord/Telegram setup
  - **Support Processes:** Payment processing (Stripe + crypto gateway), analytics tracking (GA4 + blockchain events), compliance documentation storage (IPFS for Web3)
- Failure points mapped: Wallet not installed, payment declined, legal review delays
- Support escalation paths: Live chat trigger after 2-minute inactivity, "Schedule a call" fallback

**User Impact:** Prevents broken promises; builds trust by aligning marketing claims with operational reality  
**Business Impact:** Reduces churn from unmet expectations; identifies automation opportunities (e.g., AI-generated content briefs reduce delivery time by 50%, per A6 assumption)  
**Technical Feasibility:** High — requires cross-functional workshop, no code needed for design phase

***

### Method 2: Dual-Path Information Architecture (Multi-Audience Segmentation)

🧠 **Rationale:**  
Forcing all users through one flow creates cognitive overload. Web2 clients expect email-based onboarding and transparent pricing pages; Web3 clients expect wallet-connect and on-chain verification. Early path detection ("I'm a traditional business" vs. "I'm a Web3 project") reduces abandonment by 40% (industry benchmark for segmented onboarding ).[3][4][5]

**Application:** Week 5-6  
**Expected Output:**
- IA tree with branch logic:
  - **Homepage:** Hero with dual CTAs ("Get Fractional CMO Services" [Web2] / "Launch Compliant Web3 Campaigns" [Web3])
  - **Web2 Path:** Services page → Pricing page (transparent retainers $7,500-$15,000/month ) → Email onboarding (4-step: Email → Service selection → Budget/Timeline → Calendly) → Confirmation + welcome email[6]
  - **Web3 Path:** Services page → Wallet-connect modal (MetaMask/WalletConnect/Coinbase + "Continue with Email" fallback) → On-chain verification (optional: read wallet holdings for personalized service recommendations) → Compliance explainer page ("Why FTC disclosures matter" ) → Discord/Telegram invitation → Confirmation[7]
- Error/recovery paths: Wallet not installed → "Install MetaMask or Continue with Email"; Payment declined → "Update card or Pay with Crypto"; Legal review delays → "Your campaign is pending compliance approval. Estimated wait: 24 hours."

**User Impact:** Reduces cognitive load; increases task completion (target: 75%+ vs. 32% baseline )[5]
**Business Impact:** Segments traffic for targeted nurture sequences; 40% reduction in drop-off  
**Technical Feasibility:** Medium — Requires frontend routing logic, wallet detection libraries (Web3.js), conditional content rendering

***

### Method 3: User Journey Mapping (End-to-End Experience)

🧠 **Rationale:**  
Journey maps reveal emotional highs/lows and friction points across the full lifecycle: Discovery → Consideration → Purchase → Onboarding → First Campaign → Ongoing Engagement. For a global agency, time zones create hidden friction: "I submitted my brief at 9pm EST; why no response?" Journey maps surface these moments, enabling proactive solutions (automated "We received your brief. Team member X will respond within 12 hours" email).[2][8]

**Application:** Week 4  
**Expected Output:**
- Two journey maps (Web2 vs. Web3):
  - **Stages:** Awareness → Interest → Consideration → Decision → Onboarding → Activation → Retention
  - **Touchpoints:** Google search, LinkedIn post, pricing page, Calendly booking, onboarding form, Slack channel, campaign dashboard
  - **Emotional Curve:** Annotate highs ("Finally found transparent pricing!") and lows ("Wallet-connect failed 3 times")
  - **Pain Points:** Long onboarding (target: <3 days), unclear next steps post-purchase, no visibility into campaign progress
  - **Opportunities:** Automated progress updates, sample campaign templates, AI-generated content briefs

**User Impact:** Identifies moments that matter; optimizes for delight (e.g., celebrate first campaign launch with "You're live!" email + dashboard confetti animation)  
**Business Impact:** Increases NPS (target: >50), reduces support tickets by 20-30%[9]
**Technical Feasibility:** Low — Design artifact; informs product decisions but doesn't require code

***

### Method 4: Error Path Mapping (Failure Modes & Recovery)

🧠 **Rationale:**  
Web3 introduces unique failure modes: wallet not installed, wrong network (Ethereum vs. Polygon), rejected signature, gas fee confusion. SaaS research shows clear error recovery reduces abandonment by 40% and support tickets by 30%. Mapping these *before* design prevents launch-blocking UX debt.[4][3][9][5]

**Application:** Week 6  
**Expected Output:** (See Critical Workstream section below for full 7-scenario breakdown)

**User Impact:** Prevents abandonment at critical moments; builds confidence ("I can undo this")  
**Business Impact:** 40% reduction in abandonment, 30% reduction in support tickets[9][5]
**Technical Feasibility:** High — Design-phase mapping; implementation in Phase 2 (post-MVP)

***

### Method 5: Wireframing → Prototyping Spectrum

🧠 **Rationale:**  
Low-fidelity wireframes (Week 5-6) enable rapid iteration without pixel-perfect design commitments. Mid-fidelity prototypes (Week 7) test navigation and content hierarchy. High-fidelity prototypes are deferred to post-validation (Week 9+) to avoid premature polish.

**Application:** Weeks 5-7  
**Expected Output:**
- **Low-fi Wireframes (Week 5-6):** 20-25 screens per path (Web2 vs. Web3) covering homepage, pricing, onboarding flows, service pages, error states
- **Mid-fi Prototype (Week 7):** Clickable Figma prototype with realistic content (no lorem ipsum), basic interactions (button states, form validation), accessibility labels (ARIA, alt text)
- **Components:** Buttons (primary/secondary/wallet-connect variations), cards (service/case study/pricing tier), forms (progressive disclosure, inline validation), modals (wallet-connect, error states)

**User Impact:** Testable in usability sessions (Week 8-9); reveals navigation confusion before code  
**Business Impact:** 50% reduction in rework vs. high-fi-first approach[5]
**Technical Feasibility:** High — Figma-based; no backend dependencies

***

## Phase-by-Phase Roadmap (12 Weeks to MVP Launch)

### **MONTH 1: Deep Discovery & Strategic Foundation**

#### Week 1: Competitive Intelligence & Stakeholder Alignment
**Milestones:**
- Competitive audit complete: 20 agencies analyzed (feature matrix, pricing benchmark, UX teardown)
- Stakeholder workshop (Miro): Define business model (retainer vs. project-based? Equity options? Token-gated tiers?)
- Heuristic evaluation: Top 5 competitors reviewed (Nielsen's 10 principles)

**Decision Point:** Validate dual-market hypothesis (Web2 + Web3) or pivot to single-audience focus  
**Collaboration:** Solo founder + 1 advisor (30-min async Loom review)  
**Behind the Decision:** Launching without competitive differentiation risks commoditization. Early clarity on positioning prevents scope creep.[10][1]

***

#### Week 2-3: User Research (JTBD + Contextual Inquiry)
**Milestones:**
- Recruit 8-12 participants (4 Web2 fractional CMO buyers, 4 Web3 project leads, 4 hybrid companies)
- Conduct 60-min JTBD interviews + screen-share sessions (watch them evaluate competitor sites)
- Synthesize in CoNote: 8-12 JTBD statements per segment, pain/gain map, service demand heatmap
- Contextual inquiry: Shadow 4 decision-makers (2 Web2, 2 Web3) during agency evaluation process

**Milestone:** Research synthesis deck with 3-5 strategic insights (e.g., "Web3 buyers verify agency wallet addresses on Etherscan before scheduling calls")  
**Behind the Decision:** JTBD reveals switching triggers (not demographics); contextual inquiry uncovers hidden evaluation criteria competitors miss.[10][3]

***

#### Week 4: Service Blueprint + Journey Mapping
**Milestones:**
- Service blueprint workshop (Miro, 4 hours): Map client journey from Discovery → Campaign Launch
- Identify backend dependencies: CRM (HubSpot), project management (Notion/ClickUp), billing (Stripe + Coinbase Commerce), compliance (legal review workflow for Web3)
- Draft dual-path journey maps (current state vs. future state): Web2 email path vs. Web3 wallet path
- Pain point prioritization: Rank by frequency × severity

**Decision Point:** Confirm dual-path IA or simplify to single onboarding with optional wallet-connect  
**Collaboration:** Designer (0.5 FTE) joins for Miro workshop  
**Behind the Decision:** Blueprint prevents "dark patterns by accident" — e.g., promising instant onboarding when legal review takes 2 days.[1][2]

***

### **MONTH 2: Strategic Design & Prototyping**

#### Week 5-6: Wireframing (Low-Fi → Mid-Fi)
**Milestones:**
- Homepage wireframes: Hero with dual CTAs ("Get Fractional CMO" / "Launch Web3 Campaigns"), trust badges (client logos), scroll indicator
- Web2 onboarding: Email capture → Service selector (checkboxes: SEO, Content, Paid Ads, Community, Tokenomics) → Budget/Timeline dropdowns → Calendly embed
- Web3 onboarding: Wallet-connect modal (MetaMask/WalletConnect/Coinbase + "Continue with Email" fallback) → On-chain verification (read wallet holdings) → Compliance explainer → Discord invite
- Service showcase pages: Fractional CMO services (Web2) vs. Compliant Web3 campaigns (with Etherscan verification links)
- Error states: Wallet failures (7 scenarios, see Critical Workstream), form validation, payment declined
- Pricing page: 3 tiers (Starter $7,500/month, Growth $12,000/month, Enterprise $25,000+/month ), feature comparison table, "Show pricing in ETH" toggle[11][6]

**Milestone:** Clickable Figma prototype (30-35 screens per path)  
**Behind the Decision:** Mid-fi prototypes test navigation + content hierarchy without premature pixel perfection.[5]

***

#### Week 7: Mid-Fidelity Prototyping + Design System Foundations
**Milestones:**
- Elevate wireframes to mid-fi: Typography (Web3-appropriate: dark mode default with light mode toggle), color palette (WCAG AA contrast: 4.5:1 text, 3:1 UI elements), micro-interactions (button hover states, form field focus)
- Component library: Buttons (primary/wallet-connect variations), cards (service/case study/pricing tier), forms (progressive disclosure, inline validation with WHY explanations), modals (wallet-connect, error states)
- Accessibility audit prep: Keyboard navigation (tab order), screen reader labels (ARIA), color contrast testing (WebAIM tool)

**Milestone:** Design system foundations documented in Figma (ready for developer handoff)  
**⚠️ User Friction Flag:** Dark mode reduces readability for 45+ users (A4 assumption); theme toggle mitigates  
**Collaboration:** Accessibility expert (2-hour consultation)

***

### **MONTH 3: Validation & Launch Prep**

#### Week 8-9: Usability Testing (Moderated + Unmoderated)
**Milestones:**
- **Moderated Tests (6 sessions via Zoom):** Task scenarios:
  1. Web2: "You're a SaaS founder seeking fractional CMO services. Find pricing and schedule a call." (Target: <5 min, 80%+ completion)
  2. Web3: "You're a DeFi protocol launching a token. Find compliant campaign services and connect your wallet." (Target: <7 min, 75%+ completion with wallet, 90%+ with email fallback)
- **Unmoderated Tests (Maze AI, 20-30 participants):** Quantitative metrics on time-on-task, misclick rate, first-click testing (homepage CTAs), SUS scores
- Analyze with Maze AI: Automated sentiment analysis, heatmap generation for click paths

**Success Criteria:**
- 80%+ task completion (moderated)
- <5% wallet connection abandonment with email fallback (vs. 68% baseline )[3]
- SUS score >70 (industry average for B2B SaaS)

**Milestone:** Prioritized bug/iteration list with severity ratings (Critical/High/Medium/Low)  
**Behind the Decision:** Task-based testing reveals flow-stoppers; generic feedback ("looks nice") wastes time.[9][5]

***

#### Week 10-11: Iteration + Implementation Handoff
**Milestones:**
- Implement high-priority fixes: Navigation confusion (first-click testing failures), wallet error messaging (clarity improvements), pricing tier descriptions (add "Best for: [use case]" labels)
- Prepare developer handoff: Figma Dev Mode annotations (spacing, breakpoints, component variants), interaction specs for wallet libraries (Web3.js for MetaMask detection, Ethers.js for blockchain reads)
- Legal review checkpoint: Web3 campaign compliance documentation (FTC disclosure templates, SEC securities checklist )[7]

**Decision Point:** Go-live with MVP or extend 2 weeks for additional testing?  
**Collaboration:** Engineering lead (8 hours total: Week 4 feasibility review, Week 10 handoff, Week 11 QA support)

***

#### Week 12: Soft Launch + Measurement Framework
**Milestones:**
- Deploy MVP: Core onboarding flows (Web2 email + Web3 wallet), 3 service pages (Fractional CMO, Web3 Campaigns, Compliance Consulting), pricing page, 2 case studies (1 Web2, 1 Web3 with Etherscan links)
- Set up analytics: GA4 events (homepage_cta_click, wallet_connect_initiated, onboarding_step_completed, service_purchased), blockchain event tracking (wallet_verified, campaign_launched)
- Launch to 10-15 beta users (5 Web2, 5 Web3, recruited from JTBD interviews)
- Monitor: Conversion funnel (homepage → pricing → onboarding → payment), error rates (wallet failures, form validation), support tickets (categorize by issue type)

**Milestone:** Beta feedback report + 30-day roadmap for post-launch iteration  
**Behind the Decision:** Soft launch validates assumptions (A1-A7) before full marketing push

***

## Critical Workstream: Error Paths, Failure Modes & Recovery Flows

### Top 7 Failure Scenarios (Prioritized by Impact × Frequency)

#### 1. **Wallet Not Installed (High Impact × High Frequency)**
**Scenario:** User clicks "Connect Wallet" but MetaMask/WalletConnect not installed  
**User Impact:** Dead end; 68% abandonment without fallback[3]
**Recovery UX:**
- Modal: "MetaMask not detected. Install extension or continue with email."
- Primary CTA: "Install MetaMask" (deep link to Chrome Web Store)
- Secondary CTA: "Continue with Email" (routes to Web2 onboarding)
- Help link: "What is MetaMask?" (30-sec explainer video)

**Instrumentation:** Track event: `wallet_not_installed` → `recovery_action` (install vs. email fallback)  
**Success Metric:** 30%+ of users choose email fallback (validates dual-path hypothesis)

***

#### 2. **Wrong Network Selected (Medium Impact × High Frequency)**
**Scenario:** User's wallet connected to Polygon; platform expects Ethereum Mainnet  
**User Impact:** Confusion; "Why isn't my wallet working?"  
**Recovery UX:**
- Modal: "Wrong network detected. Switch to Ethereum Mainnet to continue."
- Primary CTA: "Switch Network" (one-click via wallet_switchEthereumChain API)
- Secondary CTA: "Continue with Email"
- Toast notification: "Network switched successfully!" (with checkmark animation)

**Instrumentation:** Track: `wrong_network_error` → `network_switched` (success) or `email_fallback` (alternative)

***

#### 3. **Signature Rejected (Medium Impact × Medium Frequency)**
**Scenario:** User rejects wallet signature request (required for on-chain verification)  
**User Impact:** Perceived security risk; uncertainty about next steps  
**Recovery UX:**
- Modal: "Signature Required. We need permission to read your wallet address (no funds accessed) to show you relevant services."
- Primary CTA: "Try Again"
- Secondary CTA: "Continue with Limited Services" (skips on-chain verification; shows generic service catalog)
- Expandable: "Why do we need this?" (explains on-chain verification benefits: personalized recommendations, verified campaign history)

**Instrumentation:** Track: `signature_rejected` → `retry` (success rate) or `limited_services_chosen`

***

#### 4. **Payment Declined (High Impact × Low Frequency)**
**Scenario:** Stripe declines credit card; user can't complete purchase  
**User Impact:** Frustration; high abandonment risk  
**Recovery UX:**
- Error message: "Payment failed. Please update your card or try crypto payment."
- Primary CTA: "Update Card"
- Secondary CTA: "Pay with Crypto" (Coinbase Commerce modal)
- Fallback: "Contact Support" (live chat trigger)

**Instrumentation:** Track: `payment_failed` → `recovery_method` (card_updated vs. crypto_payment vs. support_contacted)  
**Business Impact:** Crypto payment option captures 10-15% of declined Web2 transactions

***

#### 5. **Form Validation Errors (Low Impact × High Frequency)**
**Scenario:** User submits onboarding form with invalid email (no @ symbol) or missing required fields  
**User Impact:** Annoying but recoverable; inline error messages guide correction  
**Recovery UX:**
- Inline validation: Red border + icon on invalid field
- Error message: "Please enter a valid work email (no Gmail/Yahoo)" (WHY: business qualification)
- Help text: Expand "Why business email?" → "We only serve businesses, not individual consumers"
- Success state: Green checkmark when corrected

**Instrumentation:** Track: `form_validation_error` → `field_name` (identify most common mistakes)  
**Behind the Decision:** Progressive disclosure (show WHY explanations) reduces support tickets by 25%.[9]

***

#### 6. **Legal Compliance Review Delays (Medium Impact × Low Frequency - Web3 Only)**
**Scenario:** User submits Web3 campaign brief; legal review takes 24-48 hours (not instant as expected)  
**User Impact:** Anxiety; "Did my submission fail?"  
**Recovery UX:**
- Confirmation page: "Your campaign is pending compliance review. Estimated wait: 24 hours."
- Progress bar: "Step 1/3: Submission received ✓ | Step 2/3: Legal review in progress... | Step 3/3: Campaign launch"
- Email updates: "Your campaign passed compliance review! Next step: Schedule kickoff call."
- Fallback: "Need it faster? Upgrade to Priority Review ($500, 4-hour turnaround)"

**Instrumentation:** Track: `legal_review_initiated` → `review_duration` → `approval_status`  
**⚠️ Business Risk:** Over-promising speed creates churn; transparent timelines build trust

***

#### 7. **Support Escalation Trigger (Cross-Cutting Failure)**
**Scenario:** User inactive for 2 minutes on any critical page (pricing, onboarding, wallet-connect)  
**User Impact:** Stuck; considering abandonment  
**Recovery UX:**
- Live chat widget auto-opens: "Need help? I'm here to answer questions."
- Suggested articles: "How to connect MetaMask," "Fractional CMO pricing explained," "Web3 compliance 101"
- Fallback: "Schedule a 15-min call" (Calendly embed)

**Instrumentation:** Track: `inactivity_trigger` → `support_engagement` (chat vs. article click vs. call scheduled)  
**Business Impact:** 20% of inactivity triggers convert to qualified leads via chat

***

## Behind the Decision: Strategic Rationale

### Why Service Blueprinting Over Journey Maps Alone?
Journey maps show the *customer* experience but ignore backend reality. For a marketing agency promising "24-hour campaign launch," the blueprint reveals legal review takes 48 hours — preventing broken promises that destroy trust. The blueprint also identifies automation opportunities: AI-generated content briefs reduce delivery time by 50% (A6 assumption), making fast turnaround feasible.[2][1]

### Why Dual-Path IA Over Unified Onboarding?
Forcing Web2 clients through wallet-connect creates 68% abandonment. Forcing Web3 clients through email forms misses differentiation (no on-chain verification). Dual-path IA respects mental models, reducing cognitive load and increasing qualified leads for both segments. Risk: Higher development cost (2 flows instead of 1). Mitigation: Share components (pricing page, service catalog) across paths.[3]

### Why Error Path Mapping Before MVP Launch?
SaaS research shows 40% of abandonment comes from unhandled errors (wallet failures, payment declines, form validation). Mapping these in design phase prevents launch-blocking UX debt. Recovery flows increase confidence: "I can undo this" mindset reduces hesitation. Risk: Over-engineering edge cases. Mitigation: Prioritize by impact × frequency; defer low-priority scenarios (e.g., token-gated tier errors) to post-MVP.[5][9]

### Speed vs. Rigor Balance
12-week timeline requires trade-offs:
- **Speed:** AI tools (ChatGPT for content, Figma AI for wireframes, Maze AI for testing) reduce synthesis time by 60% (A6 assumption)
- **Rigor:** JTBD interviews (8-12 participants) provide depth; usability testing (6 moderated + 20-30 unmoderated) validates flows before code
- **Pragmatism:** Low-fi → mid-fi wireframes (Weeks 5-7) enable rapid iteration; high-fi polish deferred to post-validation

### Business Risk Mitigation
- **Regulatory Risk (Web3):** Legal review checkpoint (Week 10) prevents FTC/SEC violations; pre-publication approval workflow ensures compliance[7]
- **Technical Risk:** Engineering involvement (Weeks 4, 10, 11) validates wallet detection feasibility before design lock-in
- **Market Risk:** Competitive analysis (Week 1) + JTBD interviews (Weeks 2-3) ensure services address real demand, not assumed needs

**[✅ PART 2 COMPLETE]**

[1](https://www.nngroup.com/articles/service-blueprints-definition/)
[2](https://miro.com/customer-journey-map/how-to-make-effective-service-blueprints/)
[3](https://www.multibase.co/blog/optimizing-web3-onboarding-funnels)
[4](https://www.decommerce.com/blog/onboarding-new-members-in-web3-communities)
[5](https://www.lifecyclex.co/blog/saas-onboarding-audit-activation-questions)
[6](https://www.yourneogig.com/fractional-cmo-pricing-models/)
[7](https://www.5wpr.com/new/how-to-run-compliant-web3-influencer-campaigns/)
[8](https://creately.com/guides/how-to-create-a-service-blueprint/)
[9](https://www.youtube.com/watch?v=ajvADfztOeY)
[10](https://uwe-repository.worktribe.com/preview/874574/JB2BMFinalJuly18.pdf)
[11](https://www.fractionalcmopartners.com/blogs/fractional-cmo-cost-pricing-models)
[12](https://rsisinternational.org/journals/ijriss/articles/social-entrepreneurship-education-for-aging-society-preparedness-a-malaysian-case-study-of-seedswakaf/)
[13](http://www.emerald.com/jstp/article/4/1/47-52/312045)
[14](http://www.ssrn.com/abstract=761464)
[15](https://www.semanticscholar.org/paper/00e81e9814f715af0834375821a249a1512d17ce)
[16](http://www.ijcmas.com/abstractview.php?ID=2850&vol=6-6-2017&SNo=251)
[17](https://www.semanticscholar.org/paper/134ae331d144fdde5ac79ad669817ca0a4db5388)
[18](https://www.tandfonline.com/doi/full/10.1080/00207411.1990.11449169)
[19](https://www.semanticscholar.org/paper/467adec75b2b2d82b874e945eef4d8012c5c3fe8)
[20](https://www.semanticscholar.org/paper/ce3af3284f2962aa9cd780559d0c4a743447b9b6)
[21](https://www.semanticscholar.org/paper/b42b4d695d5c46014013ecbc8e253a1bcba37ae9)
[22](https://ijcsrr.org/wp-content/uploads/2023/02/88-25-2023.pdf)
[23](https://hsd.ardascience.com/index.php/journal/article/download/125/88)
[24](https://arxiv.org/ftp/arxiv/papers/1704/1704.02973.pdf)
[25](https://nottingham-repository.worktribe.com/preview/5051635/IJBE%20paper%20-%20AUthors)
[26](https://www.ccsenet.org/journal/index.php/ass/article/download/48406/26157)
[27](https://www.ijfmr.com/papers/2024/3/20591.pdf)
[28](https://openresearchlibrary.org/ext/api/media/f3de07a5-ec75-4026-afa4-1df81fdd7f49/assets/external_content.pdf)
[29](https://blog.uxtweak.com/service-blueprint/)
[30](https://thecxlead.com/customer-experience-management/service-blueprint-examples/)
[31](https://www.interaction-design.org/literature/topics/service-blueprint)