# The Agentic AI Infrastructure Race (r1.0)
## 智能体AI基础设施竞赛

Strategic Insight Report | 战略洞察报告
February 2026 — Release 1.0

---

# Slide 1 — Cover

**The Agentic AI Infrastructure Race**
**智能体AI基础设施竞赛**

7 Players · Custom Silicon · GW-Scale Data Centers · Frontier Models · Agentic Products

*How Amazon, Google, Microsoft, xAI+SpaceX, Meta, NVIDIA, and OpenAI are deploying capital, silicon, and software to capture the agentic AI market.*

February 2026 — Release 1.0

---

# Slide 2 — Amazon: Custom Silicon Portfolio | 亚马逊：自研芯片组合

Amazon has the broadest custom AI silicon portfolio among hyperscalers, spanning training, inference, and general compute:

| Chip | Type | Key Specs | Status |
|------|------|-----------|--------|
| **Trainium2** | Training | 4× perf vs Trainium1; UltraCluster supports 100K chips | In production |
| **Trainium3** | Training | Expected 2-3× over Trainium2 | 2026 |
| **Trainium4** | Training | Next-gen architecture | In development |
| **Inferentia2** | Inference | Cost-optimized, high throughput | In production |
| **Graviton4** | General CPU | ARM-based, 30% over Graviton3 | In production |

**Project Rainier**: Joint initiative with Anthropic — the largest Trainium2 cluster, dedicated to Claude model training. Trainium2 training costs are reported at **30-40% lower** than equivalent NVIDIA GPU instances.

Amazon is the only hyperscaler with **three generations of custom AI training silicon** in production or active development (Trainium 2/3/4).

---

# Slide 3 — Amazon: Infrastructure & Anthropic Investment | 亚马逊：基础设施与Anthropic投资

| Metric | Value | Source Period |
|--------|-------|-------------|
| **2026 CapEx** | $200B (+50% YoY) | Guidance |
| **Anthropic Investment** | $8B total | Cumulative through 2025 |
| **AWS Annualized Run Rate** | $115B+ | 2025 |
| **AWS AI Services Growth** | 100%+ YoY | 2025 |
| **Global Infrastructure** | 34 regions, 108 availability zones | Feb 2026 |

### The Anthropic Partnership Structure
- Anthropic uses AWS as primary cloud provider
- Claude models train on Trainium chips via Project Rainier
- AWS Bedrock gets first-party Claude integration
- Amazon's $8B represents the largest single investment in an AI lab

### AWS Bedrock: Model-Agnostic Platform
Bedrock offers Claude (Anthropic), Llama (Meta), Mistral, Cohere, AI21, Amazon Nova, and Stability AI models. Unlike Microsoft (Azure OpenAI) or Google (Vertex Gemini-first), Amazon positions Bedrock as **model-agnostic** — enterprises choose the best model per task.

---

# Slide 4 — Amazon: Bedrock AgentCore & Enterprise Agentic | 亚马逊：Bedrock AgentCore

### Enterprise Agentic Products

| Product | Function |
|---------|----------|
| **Bedrock AgentCore** | Managed agent infrastructure — identity (IAM roles), persistent memory, orchestration, sandboxed code execution, full reasoning trace observability |
| **Amazon Q Developer** | AI coding assistant — competing with GitHub Copilot |
| **Amazon Q Business** | Enterprise knowledge assistant with RAG |
| **Bedrock Guardrails** | Safety, compliance, content filtering for agent outputs |
| **Bedrock Knowledge Bases** | Retrieval-Augmented Generation (RAG) infrastructure |

### AgentCore Architecture
- Agents receive **IAM roles** (not just API keys) — enterprise-grade identity
- **Persistent session memory** across conversations
- **Multi-agent orchestration** with coordination primitives
- **Full tracing** of agent reasoning chains for audit and compliance

---

# Slide 5 — Google: TPU & Networking Architecture | 谷歌：TPU与网络架构

Seven generations of custom AI silicon, with the latest designed inference-first:

| Chip | Year | Key Specs |
|------|------|-----------|
| **TPU v5p** | 2024 | 459 TFLOPS BF16, 95GB HBM3, scales to 8,960 chips |
| **TPU v6e (Trillium)** | 2024 | 4.7× compute/chip over v5e; 91 exaFLOPS per cluster |
| **TPU v7 (Ironwood)** | 2025 | **4,614 TFLOPS FP8**, 192GB HBM3e, 7.37 TB/s bandwidth |

### TPU v7 Ironwood vs NVIDIA B200
| Metric | Ironwood | NVIDIA B200 |
|--------|----------|-------------|
| **FP8 Performance** | 4,614 TFLOPS | ~4,500 TFLOPS |
| **HBM Capacity** | 192GB HBM3e | 192GB HBM3e |
| **Native Scale** | 9,216 chips via ICI | 72 GPUs via NVLink |
| **TCO (Full Config)** | ~44% lower than GB200 | Baseline |

### All-Optical Cross-Connect (Project Apollo)
- Saved Google **$3B+** in infrastructure costs since 2018
- MEMS mirrors create fiber port-to-port mappings entirely in optical domain
- **Speed-agnostic**: no hardware refresh needed for 400G → 800G → 1.6T transitions
- **40% power reduction**, 30% CapEx reduction vs electrical switching
- Each v5p superpod uses 48 OCS units managing **13,824 optical ports**
- Enables Google's **9,216-chip native TPU pods** — impossible with traditional electrical switching
- OCP formed OCS subproject in 2025 with Google, Microsoft, NVIDIA as founding members

---

# Slide 6 — Google: Gemini 3.0 & Model Strategy | 谷歌：Gemini 3.0与模型战略

Released November 18, 2025. First model to break **1500 LMArena Elo** (1501).

### Benchmark Performance

| Benchmark | Gemini 3.0 Pro | Best Competitor |
|-----------|---------------|-----------------|
| **Humanity's Last Exam (w/ tools)** | 45.8% | GPT-5 Pro: 31.64% |
| **ARC-AGI-2** | 31.1% | GPT-5.1: 17.6% |
| **AIME 2025 (w/ code)** | 100% | — |
| **MMMU-Pro** | 81.0% | — |
| **ScreenSpot-Pro** | 2× Claude 4.5, 20× GPT-5.1 | — |
| **SWE-Bench Verified** | 76.2% | Claude 4.5: 77.2% |

### Architecture
- **Unified early-fusion multimodal transformer** with Mixture of Experts (MoE)
- All modalities (text, image, audio, video, code) share a single token space and transformer backbone
- **1 million token context window**
- **Agentic Vision**: converts static image understanding into step-by-step inspection and manipulation
- **2 billion+ users** across Google products (Search, Gmail, Docs, Android, Chrome)

---

# Slide 7 — Google: NotebookLM & Agentic Products | 谷歌：NotebookLM与智能体产品

### NotebookLM Metrics

| Metric | Value |
|--------|-------|
| **Monthly Visits** | 48M+ (56% increase over prior 6 months) |
| **MAU Growth** | 120% QoQ in Q4 2024 (driven by Audio Overviews) |
| **Market Reach Growth** | 180% (Q3 2023 to Q1 2025) |
| **Languages** | 80+ (expanded September 2025) |
| **Tiers** | Free, Plus (Workspace/Google One), Enterprise (Cloud) |

Enterprise tier features: SSO with AD/Okta, US/EU/Global data residency, IAM controls, Microsoft Office document support. Became a **Workspace core service** in February 2025.

### Full Agentic Product Portfolio

| Product | Function | Target |
|---------|----------|--------|
| **Project Mariner** | Browser agent | Consumer |
| **Project Astra** | Multimodal real-world assistant | Consumer |
| **Gemini Code Assist** | AI coding assistant | Developer |
| **Vertex AI Agent Builder** | Enterprise agent platform | Enterprise |
| **Google Agentspace** | Enterprise knowledge + agent hub | Enterprise |
| **NotebookLM** | Research & knowledge synthesis | Prosumer / Enterprise |

### Infrastructure Investment
- **2025 Actual CapEx**: $91.4B (beat initial $75B guidance; Q4 alone was $27.9B)
- **2026 Guidance**: **$175-185B** (~2× 2025 actual)
- **Google Cloud Backlog**: $240B (doubled YoY, up 55% sequentially)
- **Google Cloud Revenue Growth**: ~48% YoY in Q4 2025

---

# Slide 8 — Microsoft: Copilot Enterprise Distribution | 微软：Copilot企业分发

### Distribution Surface

| Product | Reach | AI Integration |
|---------|-------|----------------|
| **Microsoft 365** | 400M+ commercial seats | M365 Copilot ($30/user/month add-on) |
| **Azure** | #2 cloud (60%+ Fortune 500) | Azure OpenAI Service, AI Foundry (1,900+ models) |
| **GitHub** | 100M+ developers | GitHub Copilot (agent mode, multi-model) |
| **Teams** | 320M+ monthly users | Copilot in Teams |
| **LinkedIn** | 1B+ members | AI-powered recruiting, learning |
| **Windows** | 1.4B+ devices | Copilot in OS |

### M365 Copilot Adoption (Q2 FY2026, January 2026)

| Metric | Value |
|--------|-------|
| **Paid Seats** | 15M (+160% YoY) |
| **Daily Active Users** | 10× YoY increase |
| **Conversations Per User** | Doubled |
| **Customers with 35,000+ Seats** | Tripled YoY |
| **Fortune 500 Using Copilot** | 90%+ |
| **Notable Deployment** | PwC: 200,000+ seats, 30M interactions in 6 months |

Microsoft is transitioning M365 Copilot toward a **consumption-based model** (pay-per-use) alongside the $30/seat/month pricing.

---

# Slide 9 — Microsoft: Maia 200 & Infrastructure | 微软：Maia 200与基础设施

### Maia 200 AI Accelerator (Announced January 26, 2026)

| Spec | Value |
|------|-------|
| **Process** | TSMC 3nm, 140B+ transistors |
| **FP4 Compute** | 10+ PFLOPS |
| **FP8 Compute** | 5+ PFLOPS |
| **Memory** | 216GB HBM3e, 7 TB/s bandwidth |
| **On-Chip SRAM** | 272MB |
| **TDP** | 750W |
| **Status** | Live in US Central Azure data center |

Microsoft claims Maia 200 delivers **3× FP4 performance of Amazon Trainium3** and **FP8 above Google TPU v7**. Reports **30% better perf/dollar** than anything else in Microsoft's fleet. Purpose-built for **inference only** — NVIDIA remains required for training.

### Chip Roadmap Delays

| Codename | Original Target | Current Status |
|----------|-----------------|----------------|
| **Braga** (next-gen) | 2025 | 6 months late → mass production 2026 |
| **Braga-R** (revision) | 2026 | Pushed to **2028** |
| **Clea** (3rd-gen) | 2027 | Slipped to **post-2028** |

Delays attributed to OpenAI-requested features that destabilized chip simulations, staffing constraints, and silicon team turnover.

### Infrastructure Scale (Q2 FY2026)

| Metric | Value |
|--------|-------|
| **Quarterly CapEx** | $37.5B (+66% YoY) |
| **FY2025 AI CapEx** | $80B |
| **Azure Regions** | 60+ globally |
| **AI Capacity Growth Target** | 80%+ through FY2026 |
| **Commercial Backlog (RPO)** | $625B (+110% YoY) |

Canceled ~2GW of non-binding LOIs (portfolio optimization, not retreat). Retains **5GW of pre-leased capacity** under binding contracts through 2028.

---

# Slide 10 — Microsoft: Azure AI & OpenAI Relationship | 微软：Azure AI与OpenAI关系

### Azure Financial Performance (Q2 FY2026)

| Metric | Value |
|--------|-------|
| **Azure Revenue Growth** | 39% YoY (38% constant currency) |
| **Intelligent Cloud Segment** | $32.9B (+29% YoY) |
| **Microsoft Cloud Total** | $51.5B (+26% YoY) |
| **AI Contribution to Azure Growth** | ~16 percentage points |
| **AI Revenue Run Rate** | $13B+ |
| **Total Revenue** | $81.3B (+17% YoY) |

### Azure AI Foundry
- **1,900+ models** from OpenAI, Anthropic (Claude), Meta (Llama), Mistral, DeepSeek, xAI, Cohere, NVIDIA
- Claude now **available in Office 365** — signaling multi-model diversification beyond OpenAI

### OpenAI Partnership Restructuring (October 28, 2025)

| Term | Detail |
|------|--------|
| **Microsoft Equity** | ~27% of OpenAI PBC (~$135B) |
| **Azure Commitment** | OpenAI contracted $250B incremental Azure spend |
| **IP Rights** | Extended through 2032, includes post-AGI models |
| **Exclusivity** | **Lost**: No right of first refusal as compute provider |
| **Multi-Cloud** | OpenAI signed $300B Oracle contract, $38B AWS deal |

### GitHub Copilot (Q2 FY2026)

| Metric | Value |
|--------|-------|
| **Cumulative Users** | 20M+ (4× YoY) |
| **Paid Subscribers** | 4.7M (+75% YoY) |
| **GitHub Revenue Growth** | 40% YoY |
| **Market Share (Paid AI Coding)** | 42% |
| **Fortune 100 Adoption** | 90% |
| **Agent Mode** | GA — autonomous issue-to-PR, multi-model (GPT-5.x, Claude Opus 4.5) |

---

# Slide 11 — xAI: Colossus Infrastructure | xAI：Colossus基础设施

### The Fastest Infrastructure Buildout in AI History

| Metric | Value |
|--------|-------|
| **GPU Count** | 555,000+ (H100, H200, transitioning to Blackwell) |
| **Colossus v1** | 100K H100 GPUs, built in **122 days** (Memphis, TN) |
| **Colossus v2** | Expanded to 200K GPUs |
| **Current Power Capacity** | 2 GW (operational + under construction) |
| **Target Power** | 5 GW+ by 2027 |
| **CapEx Committed** | $50B+ |
| **Build Speed** | 122 days vs 18-24 month industry norm |

Tesla Megapack battery systems provide power smoothing. Direct-to-grid power procurement bypasses traditional utility timelines.

### Grok Model Family

| Model | Status | Key Capabilities |
|-------|--------|-----------------|
| **Grok 3** | Released 2025 | Competitive reasoning and coding |
| **Grok 4** | Released 2025 | PhD-level benchmark performance |
| **Grok 4.1 Fast** | Current | Optimized for tool calling, low-latency inference |
| **Grok 5** | In training | Training on full Colossus cluster |

xAI's compute infrastructure is **100% NVIDIA-dependent** — no custom chip program announced.

---

# Slide 12 — xAI: Macrohard & Vertical Integration | xAI：巨硬与垂直整合

### Macrohard Trademark (Filed August 2025, USPTO)
Covers: AI-driven software, voice/text generation, game development, interactive simulation, complex system modeling.

### Vertical Integration Comparison

| Layer | xAI | Microsoft |
|-------|-----|-----------|
| **Real-Time Data** | X Platform (500M+ users) | LinkedIn (professional, delayed) |
| **Foundation Model** | Grok (self-developed) | OpenAI GPT (partner dependency) |
| **Compute** | Colossus (555K GPUs, self-operated) | Azure (shared with customers) |
| **Distribution** | X Platform (zero customer acquisition cost) | M365 ($30/seat upsell) |
| **Custom Silicon** | None (NVIDIA-dependent) | Maia 200 (inference only) |

### SpaceX Synergies

| Entity | Estimated Valuation | Contribution |
|--------|-------------------|-------------|
| **xAI** | ~$230B | AI models, Colossus infrastructure |
| **SpaceX** | ~$600-700B | Starlink (6,000+ satellites), launch capability |
| **X (Twitter)** | ~$30-40B | Real-time data, distribution |

Starlink constellation enables the orbital data center thesis — compute unconstrained by terrestrial power grids.

### Oracle Partnership
- Grok models available on **Oracle Cloud Infrastructure (OCI)**
- Access to Oracle's Fortune 500 customer base (finance, government)
- Oracle also partners with OpenAI's Stargate ($300B contract)

---

# Slide 13 — Meta: Llama & The Open-Source Question | Meta：Llama与开源之问

### Llama 4 Model Family (Released April 2025)

| Model | Active Params | Architecture | Key Feature |
|-------|-------------|-------------|-------------|
| **Llama 4 Scout** | 17B | MoE, 16 experts | **10M token context window** |
| **Llama 4 Maverick** | 17B | MoE, 128 experts | Natively multimodal |
| **Llama 4 Behemoth** | 288B | MoE, 16 experts | ~2T total params; teacher model |

- Llama downloads surpassed **1 billion** by March 2025
- License: Free for commercial use below **700 million monthly active users**; not OSI-approved

### The Open-Source Reversal
- Llama 4 launch in April 2025 was broadly viewed as **underwhelming**
- DeepSeek's R1 model incorporated Llama architecture components — raising concerns about strategic cost of open-sourcing
- Next-generation models **"Mango"** (image/video) and **"Avocado"** (text LLM) are reported as **proprietary/closed-source** — a potential reversal of Meta's core AI strategy
- Avocado release delayed to **Q1 2026**
- Meta Superintelligence Labs leadership has questioned the open-source strategy

### MTIA Custom Silicon

| Generation | Codename | Process | Status |
|-----------|----------|---------|--------|
| **MTIA v2** | — | 5nm | In production; 354 TOPS INT8; **44% lower TCO** vs GPUs |
| **MTIA v3** | Iris | 3nm | Deploying H2 2026; 8× HBM3E stacks, 3.5+ TB/s bandwidth |
| **MTIA v4** | Santa Barbara | — | ~2027 |
| **MTIA v5** | Olympus | — | ~2027-2028 |
| **MTIA v6** | Universal Core | — | ~2028 |

Target: **35%+ of inference fleet on MTIA** by end of 2026. Also reportedly testing **RISC-V based AI chips** for training.

---

# Slide 14 — Meta: Superintelligence Lab & Consumer AI | Meta：超级智能实验室与消费者AI

### Meta Superintelligence Labs (MSL)

| Detail | Value |
|--------|-------|
| **Formation** | June 2025 |
| **Scale AI Investment** | $14.3B (brought Alexandr Wang as CAIO) |
| **Co-Leader** | Nat Friedman (former GitHub CEO) |
| **Workforce** | ~3,000 employees after restructuring |
| **Layoffs** | ~600 positions cut (October 2025) |
| **Yann LeCun** | Departed November 2025; launching "world models" startup |

MSL consolidated research (FAIR), product, infrastructure, and LLM initiatives under product-focused leadership.

### Consumer AI Metrics

| Product | Metric |
|---------|--------|
| **Meta AI** | 1B+ MAU (driven by passive exposure across 3.3B-user apps) |
| **Meta AI Standalone App** | 4.2M DAU, 26.6M MAU (Dec 2025) |
| **Ray-Ban Meta Smart Glasses** | 2M pairs sold (Feb 2025); sales tripled H1 2025; **73% smart glasses market share** |
| **Ray-Ban Meta Display** | $799, 600×600 in-lens display, Neural Band EMG wristband (Sep 2025) |
| **Production Target** | Scaling from 10M → **20M annual units** by end of 2026 |

### Infrastructure Investment

| Metric | Value |
|--------|-------|
| **2025 CapEx** | ~$72.2B |
| **2026 Guidance** | **$115-135B** |
| **Hyperion Campus (Louisiana)** | $27B total development (Blue Owl JV: 80% Blue Owl / 20% Meta) |
| **Hyperion Power** | 2+ GW; three combined-cycle plants by Entergy Louisiana |
| **US Data Center Commitment** | $600B by 2028 |
| **Fiber Optic Deal** | $6B with Corning through 2030 |

---

# Slide 15 — Meta: The Enterprise Gap | Meta：企业市场缺口

### Direct AI Revenue Comparison

| Company | Enterprise AI Revenue Vehicle | AI Revenue (Annual) |
|---------|------------------------------|-------------------|
| **Microsoft** | Azure + Copilot | $13B+ run rate |
| **Amazon** | AWS Bedrock + Q | $115B+ AWS run rate (AI growing 100%+ YoY) |
| **Google** | Google Cloud | $15.15B/quarter cloud revenue (+48% YoY) |
| **Meta** | None (advertising only) | **$0 direct AI services revenue** |

Meta builds comparable infrastructure without the enterprise contracts that generate direct AI revenue. AI improvements flow through **advertising effectiveness** — Meta's $160B+ annual ad business — rather than direct AI service fees.

### Structural Factors
- No cloud business, no enterprise sales force, no B2B SLAs
- By open-sourcing Llama, Meta enabled AWS, Azure, and GCP to host and monetize Meta's own models
- Llama API (previewed with Llama 4) is nascent with no enterprise traction
- Acquired **Manus** (autonomous agent developer) in December 2025
- Zuckerberg teased **agentic commerce tools** (AI shopping agents) at January 2026 earnings call

---

# Slide 16 — NVIDIA: The Circular Investment Model | 英伟达：循环投资模型

### Neo-Cloud Investment Portfolio

| Company | NVIDIA Investment | GPU Fleet / Scale | Differentiation |
|---------|------------------|-------------------|-----------------|
| **CoreWeave** | $2B equity (11.5% stake) + $6.3B usage guarantee through 2032 | 250K+ GPUs, 33 data centers, 470MW | GPU-native bare-metal; 40% higher MFU; first to deploy GB300 NVL72 |
| **Lambda Labs** | Participated in $480M round | 18K GPUs leased back to NVIDIA for $1.5B | Developer-first; H100 PCIe at $2.49/hr |
| **Nebius** | ~$134M equity | 5 data centers (Finland, France, UK) | EU data sovereignty; first European GB300 NVL72 |
| **Crusoe Energy** | Participated in $1.38B Series E | Blackwell-powered instances | Stranded/renewable energy; 45GW power pipeline |
| **Nscale** | Participated in $1.1B round | 200K+ GB300 GPUs contracted with Microsoft | UK/Europe expansion |

### CoreWeave Financial Detail

| Metric | Value |
|--------|-------|
| **IPO** | March 2025, Nasdaq (CRWV), $40/share |
| **Peak Market Cap** | $60B+ ($187/share, June 2025) |
| **2025 Revenue Guidance** | $5.05-5.15B (164-170% YoY) |
| **Revenue Backlog** | $55.6B (nearly doubled Q2→Q3 2025) |
| **OpenAI Contract** | $22.4B through 2029 |
| **Meta Contract** | $14.2B |

### The Flywheel
NVIDIA invests equity → neo-clouds buy GPUs → GPU revenue drives NVIDIA stock → NVIDIA invests more equity. Bloomberg characterizes this as "circular deals." Neo-cloud segment has grown at a **five-year CAGR of 82%** (JLL data).

---

# Slide 17 — NVIDIA: Blackwell Architecture & Supply | 英伟达：Blackwell架构与供应

| Chip | Memory | Performance | Power | Status |
|------|--------|-------------|-------|--------|
| **B200** | 192GB HBM3e | 2.5× over H100 | 1,000W | In production |
| **GB200 NVL72** | 72 GPUs + 36 Grace CPUs | NVLink rack-scale | ~120kW | Shipping to clouds |
| **B300 (Ultra)** | 288GB HBM3e | 15 PFLOPS FP4 | 1,400W | Shipping since Sep 2025 |
| **GB300 NVL72** | 72 GPUs | **1.1 EXAFLOPS FP4** | Rack-scale | First deployments Q4 2025 |

### Supply Status

| Metric | Value |
|--------|-------|
| **Backlog** | 3.6 million units |
| **Availability** | Sold out through mid-2026 |
| **Bottleneck** | TSMC CoWoS advanced packaging capacity |
| **Jensen Huang Quote** | Demand is "insane" |

### CUDA Ecosystem

| Metric | Value |
|--------|-------|
| **Developers** | 4+ million |
| **GPU-Accelerated Applications** | 3,000+ |
| **Companies Using CUDA** | 40,000+ |
| **Switching Cost** | Months of work + hundreds of thousands of dollars to rewrite for AMD ROCm |

---

# Slide 18 — NVIDIA: Software & Platform | 英伟达：软件与平台

### Product Portfolio

| Product | Function | Pricing |
|---------|----------|---------|
| **DGX Cloud** | Managed GPU cloud on AWS/Azure/GCP/OCI | $36,999/instance/month |
| **DGX Cloud Lepton** | Unified compute marketplace across 10+ neo-cloud partners | — |
| **NIM** (Inference Microservices) | Pre-optimized inference containers; 2.6× throughput vs off-the-shelf | Free prototyping; production: $4,500/GPU/year |
| **AgentIQ** | Open-source agent toolkit — framework-agnostic (LangChain, CrewAI, Semantic Kernel, Google ADK) | Open source |
| **NeMo** | LLM training, fine-tuning, deployment | Part of AI Enterprise |
| **NVIDIA AI Enterprise** | Full software stack license | $4,500/GPU/year or ~$1/GPU/hr cloud |

### DGX Cloud Lepton
Aggregates GPUs from CoreWeave, Crusoe, Lambda, Nebius, Nscale, Firmus, Foxconn, GMI Cloud, SoftBank Corp., Yotta — single interface for developers. NVIDIA's shift from **chip supplier to ecosystem orchestrator**.

### NIM Developer Access
- 1,000 free API credits via NVIDIA Developer Program
- Free prototyping endpoints at build.nvidia.com
- Supports Llama, Mistral, Nemotron, DeepSeek-R1, and custom models
- **NVIDIA Dynamo**: open-source inference serving framework for distributed environments

---

# Slide 19 — OpenAI: Growth Metrics | OpenAI：增长数据

| Metric | Value | Date |
|--------|-------|------|
| **Weekly Active Users** | 900M+ | December 2025 |
| **WAU Target** | 1B | Q1 2026 |
| **Annual Recurring Revenue** | $20B (tripled from 2024) | End 2025 |
| **First $1B Revenue Month** | July 2025 | — |
| **Business Customers** | 1M+ | 2025 |
| **Workplace Seats** | 7M+ (Business + Enterprise) | 2025 |
| **ChatGPT Plus Subscribers** | 10M | 2025 |
| **Fortune 500 Adoption** | 92% | 2025 |
| **Valuation** | ~$730B (in talks for $100B round) | February 2026 |
| **IPO Target** | Up to $1T (H2 2026 filing, 2027 listing) | — |

### Revenue Trajectory

| Period | ARR |
|--------|-----|
| 2023 | ~$2B |
| 2024 | ~$3.7-6B |
| June 2025 | $10B |
| End 2025 | $20B |
| 2026 projected | $20-29B |
| 2029 internal target | $100-200B |

### Operating Losses

| Year | Operating Loss |
|------|----------------|
| 2025 | ~$8B |
| 2026 projected | ~$14B |
| 2024-2029 cumulative | ~$143B negative free cash flow |
| Profitability target | 2029 |

### Corporate Structure (October 28, 2025)
- **OpenAI Group PBC** (for-profit Public Benefit Corporation)
- **OpenAI Foundation** (nonprofit): 26% equity (~$130B), appoints all board directors
- **Microsoft**: ~27% equity (~$135B)

---

# Slide 20 — OpenAI: Stargate & Custom Silicon | OpenAI：星门与自研芯片

### Stargate Project (Announced January 21, 2025)

| Metric | Value |
|--------|-------|
| **Total Commitment** | $500B by 2029 |
| **Partners** | OpenAI, SoftBank, Oracle, MGX (Abu Dhabi) |
| **Announced Capacity** | ~7 GW, targeting 10 GW |
| **Key Sites** | Abilene TX, Milam County TX (1.2 GW), Lordstown OH, + 5 additional sites, Stargate UAE |
| **Oracle Contract** | $300B for infrastructure |
| **Technology Partners** | NVIDIA, Cisco |

### Custom Chip: XPU (Announced October 13, 2025)

| Detail | Specification |
|--------|--------------|
| **Design Partner** | Broadcom |
| **Foundry** | TSMC 3nm |
| **Architecture** | Systolic array optimized for inference |
| **Memory** | HBM3E or HBM4 |
| **Mass Production** | H2 2026 |
| **Order Value** | $10B+ |
| **Commercial Sale** | No — internal use only |

### Multi-Cloud Contracts

| Cloud Partner | Contract Value |
|---------------|----------------|
| **Microsoft Azure** | $250B |
| **Oracle** | $300B |
| **Amazon Web Services** | $38B |

The AWS deal (announced 2025) formally ended Microsoft's exclusive cloud relationship.

---

# Slide 21 — OpenAI: Agentic Products | OpenAI：智能体产品

### Product Timeline

| Date | Product | Description |
|------|---------|-------------|
| Jan 2025 | **Operator** | Browser agent (CUA model, GPT-4o vision + RL-trained GUI interaction) |
| Jul 2025 | **ChatGPT Agent** | Operator integrated into ChatGPT; separate Operator deprecated |
| Aug 2025 | **GPT-5** | 400K context, $1.25/$10.00 per M tokens |
| Oct 2025 | **ChatGPT Atlas** | Full Chromium-based browser with AI sidebar and agent mode |
| 2025 | **Codex** | Cloud-based coding agent (GPT-5.3-Codex: 25% faster than GPT-5.2-Codex) |
| Aug 2025 | **GPT-OSS** | First open-weight models since GPT-2 (120B + 20B, Apache 2.0) |

### ChatGPT Atlas
- Chromium-based standalone browser with **ChatGPT sidebar**
- Agent mode: navigates websites and completes tasks autonomously
- "Browser memories" — remembers context from visited sites
- Available on macOS; Windows, iOS, Android coming

### Codex Capabilities
- Runs in sandboxed cloud environments preloaded with user repositories
- Interactive steering: guide the agent while it works without losing context
- Multi-agent orchestration UI for parallel coding tasks
- Free tier for ChatGPT Free/Go users

### Enterprise Plans

| Plan | Price | Key Features |
|------|-------|-------------|
| **Business** (fka Team) | $25-30/user/month | Shared workspace, custom GPTs, data not used for training |
| **Enterprise** | Custom | Unlimited GPT-5, SOC 2, SSO, analytics dashboards |
| **API** | Pay-per-token | GPT-5: $1.25/$10 per M tokens; batch: $0.625/$5 |

---

# Slide 22 — Comparative Data: Infrastructure Investment | 基础设施投资对比

### 2026 Capital Expenditure

| Company | 2026 CapEx | YoY Growth | Primary Focus |
|---------|-----------|------------|---------------|
| **Amazon** | $200B | +50% | AI data centers, Trainium chips, Anthropic partnership |
| **Google** | $175-185B | ~2× 2025 | TPU v7, all-optical networking, global DC expansion |
| **Microsoft** | ~$150B (annualized from $37.5B/quarter) | +66% | Azure AI, Maia 200, OpenAI infrastructure |
| **Meta** | $115-135B | ~2× 2025 | Superintelligence Lab, MTIA, Hyperion campus |
| **xAI** | $50B+ | N/A (first major cycle) | Colossus expansion, Grok training |
| **OpenAI** | $40B+ (via Stargate partners) | N/A | Stargate sites, XPU chip development |
| **NVIDIA** | N/A (arms dealer) | — | Neo-cloud investments ($2B+ equity) |

**Combined 2026 infrastructure spending: ~$700B+**

### Custom Silicon Comparison

| Company | Chip | Process | Training | Inference | Production Status |
|---------|------|---------|----------|-----------|-------------------|
| **Google** | TPU v7 Ironwood | — | Yes | Yes (primary) | Approaching GA 2025 |
| **Amazon** | Trainium2 | — | Yes | — | In production |
| **Microsoft** | Maia 200 | 3nm | No | Yes | Live (Jan 2026) |
| **Meta** | MTIA v3 Iris | 3nm | No | Yes | Deploying H2 2026 |
| **OpenAI** | XPU | 3nm | No | Yes | Mass production H2 2026 |
| **xAI** | None | — | — | — | Fully NVIDIA-dependent |
| **NVIDIA** | Blackwell (B300) | — | Yes | Yes | Sold out through mid-2026 |

---

# Slide 23 — Comparative Data: Models & Agentic Products | 模型与智能体产品对比

### Foundation Models

| Company | Frontier Model | Context Window | Open Source | Key Metric |
|---------|---------------|---------------|-------------|------------|
| **Google** | Gemini 3.0 Pro | 1M tokens | No | First to break 1500 LMArena Elo |
| **OpenAI** | GPT-5 / GPT-5.2 | 400K tokens | GPT-OSS (120B, 20B) | 900M WAU |
| **Meta** | Llama 4 Behemoth | 10M (Scout) | Yes (below 700M MAU) | 1B+ downloads |
| **xAI** | Grok 4 | — | No | PhD-level benchmarks |
| **Amazon** | Nova + Claude (Anthropic) | — | No (partner models) | Model-agnostic platform |
| **Microsoft** | GPT (OpenAI) + Phi-4 + Claude | — | No | 1,900+ models in AI Foundry |
| **NVIDIA** | Nemotron (NIM) | — | NIM containers | 2.6× throughput optimization |

### Agentic Product Reach

| Company | Primary Agent Product | User Base / Reach |
|---------|----------------------|-------------------|
| **OpenAI** | ChatGPT Agent / Atlas / Codex | 900M+ WAU |
| **Google** | Mariner / Astra / Gemini Code Assist / NotebookLM | 2B+ across Google products |
| **Microsoft** | M365 Copilot / GitHub Copilot / Copilot Studio | 400M+ M365 seats; 20M+ GitHub users |
| **Amazon** | Bedrock AgentCore / Q Developer / Q Business | 31% global cloud share |
| **Meta** | Meta AI / AI Studio / Ray-Ban AI | 3.3B daily users across apps |
| **xAI** | Grok API / Grok Enterprise | 500M+ X users |
| **NVIDIA** | AgentIQ / NIM / DGX Cloud Lepton | 4M+ CUDA developers |

---

*Document Version: r1.0*
*Release Date: February 2026*
*Slides: 23 (1 Cover + 3 Amazon + 3 Google + 3 Microsoft + 2 xAI + 3 Meta + 3 NVIDIA + 3 OpenAI + 2 Comparative)*
