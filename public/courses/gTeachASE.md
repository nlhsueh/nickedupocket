# Advanced Software Engineering (進階軟體工程)

## Chapter 1: Introduction to Software Engineering

### [Activity: ase-ch01-ccq1] Concept Check (CCQ 1) — The Software Crisis
#### [CCQ] Why couldn't the 1968 Software Crisis be resolved simply by purchasing faster computer hardware or larger memory?
- Computer hardware manufacturing and memory fabrication completely stagnated in the late 1960s, preventing computational speedups.
- The crisis was fundamentally an intellectual and organizational challenge of system complexity, which faster hardware only amplified. (Correct)
- Programming languages of that era strictly lacked mathematical calculation primitives and compiler memory allocation capabilities.
- Early mainframe computers were physically incompatible with shared telecommunication networks and multi-terminal architectures.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: The crisis was fundamentally an intellectual and organizational failure in managing system complexity. Increasing hardware capacity allowed organizations to build systems of unprecedented scale, which human programmers using ad-hoc, informal techniques could not manage. Faster CPU chips do not fix missing requirements, tangled spaghetti dependencies, or miscommunicated interface contracts.
</details>

### [Activity: ase-ch01-ccq2] Concept Check (CCQ 2) — The IEEE Definition of Software
#### [CCQ] According to the IEEE standard definition of software, which of the following is NOT considered a component of software?
- Executable computer programs and source code files.
- System database schemas and configuration files.
- CPU processor hardware and physical memory units. (Correct)
- Software installation and deployment procedures.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: C
**Explanation**: The IEEE standard defines software as computer programs, procedures, and possibly associated documentation and data. CPU hardware and physical memory are physical electronic devices (hardware) that execute software, rather than components of the software itself.
</details>

### [Activity: ase-ch01-ccq3] Concept Check (CCQ 3) — Core Universal Activities of the Software Process
#### [CCQ] Which of the following pairs correctly matches a specific software engineering action with its corresponding universal core activity?
- Conducting stakeholder interviews to draft user stories $\rightarrow$ Software Specification (Correct)
- Writing automated unit tests to mock database responses $\rightarrow$ Software Design & Implementation
- Refactoring database schemas to improve query speed $\rightarrow$ Software Validation
- Swapping a third-party payment API for a new gateway $\rightarrow$ Software Specification

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: Eliciting and modeling requirements through stakeholder interviews is a direct action in Software Specification. Writing unit tests is part of Software Validation (specifically verification). Refactoring database schemas is Software Evolution (preventive/perfective maintenance). Swapping APIs is Design & Implementation or Evolution.
</details>

### [Activity: ase-ch01-ccq4] Concept Check (CCQ 4) — Brooks's Law and Project Dynamics
#### [CCQ] A project is 3 weeks behind schedule with 2 weeks remaining before release. The manager hires 4 junior programmers to speed up progress. What will happen according to Brooks's Law?
- The project will finish 1 week early.
- The project will be delayed further because senior engineers must spend time onboarding and mentoring new hires. (Correct)
- The existing developers will code twice as fast.
- Communication complexity remains unchanged.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: Frederick Brooks demonstrated in The Mythical Man-Month that complex software development is not partitionable like manual labor. Adding people to a late project increases communication overhead quadratically according to n(n-1)/2, while senior engineers must stop productive coding to onboard newcomers.
</details>

### [Activity: ase-ch01-ccq5] Concept Check (CCQ 5) — Fundamental Design Principles
#### [CCQ] An order-processing module directly handles HTTP requests, executes payment transactions, queries the SQL database, and generates HTML receipt emails. Which fundamental design principle is most severely violated?
- Separation of Concerns: Multiple distinct responsibilities are tightly tangled in a single module. (Correct)
- YAGNI: Speculative future features are implemented before actual business requirements emerge.
- Brooks's Law: Adding developers to the order module increases communication complexity exponentially.
- Anticipation of Change: System configurations are hardcoded into compiled production binaries.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: Separation of Concerns (and the Single Responsibility Principle) dictates that a module should have only one reason to change and encapsulate a single coherent responsibility. Tangling HTTP routing, business payment processing, database access, and UI rendering in one module creates severe coupling and high fragility.
</details>

### [Activity: ase-ch01-ccq6] Concept Check (CCQ 6) — Matching Real-World Issues to ISO 25010 Quality Characteristics
#### [CCQ] Which of the following matches a real-world software issue with its corresponding ISO 25010 quality characteristic?
- A database query taking 15 seconds to return results $\rightarrow$ Maintainability (Testability)
- A system crash occurring when a third-party API goes offline $\rightarrow$ Reliability (Fault Tolerance) (Correct)
- Developers struggling to write unit tests due to tight coupling $\rightarrow$ Portability (Adaptability)
- An unencrypted session cookie allowing account takeover $\rightarrow$ Usability (Operability)

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: A system's ability to cope with external service failures without crashing is the definition of Fault Tolerance (a sub-characteristic of Reliability). Slow query execution is Performance Efficiency (Time Behavior). Struggling to write unit tests is Maintainability (Testability). Unencrypted session cookies belong to Security (Confidentiality).
</details>

### [Activity: ase-ch01-ccq7] Concept Check (CCQ 7) — Engineering Ethics and the Public Interest
#### [CCQ] Under the ACM/IEEE Code of Ethics, if an employer directs an engineer to implement an algorithm that falsifies safety compliance reports, what is the engineer's obligation?
- Comply, because the employer pays the engineer's salary.
- Refuse and escalate, because the Public Interest takes precedence over Employer loyalty. (Correct)
- Implement the code but omit documentation.
- Outsource the code to an external vendor.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: Principle 1 of the ACM/IEEE Software Engineering Code of Ethics states that software engineers shall act consistently with the public interest, which takes absolute precedence over loyalty to an employer or client.
</details>

### [Activity: ase-ch01-ccq8] Concept Check (CCQ 8) — AI Coding & Code Churn
#### [CCQ] In empirical studies evaluating AI coding assistants (such as GitClear's analysis of 150M lines of code), "Code Churn" emerged as a major warning sign. What does high Code Churn indicate in an AI-assisted codebase?
- Code is rapidly rewritten, deleted, or patched shortly after commit, indicating brittle code accepted without sufficient verification. (Correct)
- Compilers and bundlers are aggressively removing unreachable dead code from application binaries during automated deployment.
- Software engineering teams are switching programming languages frequently due to automated polyglot syntax translation.
- Automated test cases are executing too quickly and depleting available CI/CD pipeline virtual machine compute resources.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: Code churn measures the percentage of code that is modified, replaced, or deleted within two weeks of being committed. In AI coding environments, high code churn reveals that developers rapidly accept AI suggestions that compile on localhost but fail under real-world integration, forcing frequent rewrites and accumulating maintainability debt.
</details>

### [Activity: ase-ch01-ccq9] Concept Check (CCQ 9) — AI Verification & Echo-Chamber Testing
#### [CCQ] An engineer prompts an AI to generate a complex payment calculation module, and then asks the same AI to write unit tests without providing a formal specification. All tests pass. What is the primary risk?
- Echo-chamber validation: The generated tests merely mirror the AI's internal flawed assumptions rather than actual business requirements. (Correct)
- Performance bottleneck: AI-generated test assertions take significantly longer to execute than human-written assertions.
- Compilation failure: Testing frameworks cannot parse automated mock datasets generated by large language models.
- Version lock-in: The test suite becomes tightly coupled to a single specific cloud runtime environment.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: When AI writes both the implementation and its own test cases without an independent specification contract, it falls into "echo-chamber testing"—validating only what it assumed, rather than what the system is actually required to do. Independent verification is required ("Who tests the tester?").
</details>

## Ch 1: 軟體工程導論 (中文版)

### [Activity: ase-ch01-zh-ccq1] 1968 北約會議與軟體工程起源 (CCQ 1)
#### [CCQ] * **正確答案**：**B** (1968) * **詳細解析**：北約科學委員會於 1968 年 10 月在德國加米施召開了歷史性會議，正式確立了「軟體工程」一詞，這被公認為軟體工程作為一門正式學科的起點。 * [⬆ 返回 Section 1.2](#12-軟體工程的起源與軟體危機)

### [Activity: ase-ch01-zh-ccq2] 軟體危機本質與心智複雜度 (CCQ 2)
#### [CCQ] * **正確答案**：**B** (危機本質上是人類心智面對架構複雜度、跨人溝通成本與缺乏規範的認知危機，更快的硬體只會放大問題規模) * **詳細解析**：增加硬體效能只會讓組織有信心去構想出更大規模、更複雜的系統。然而，由於開發人員當時仍在使用隨意、無序的手工編程做法，龐大的程式庫迅速超出了人類的心智控制極限。運算速度再快的 CPU，也無法解決模糊的需求規格、錯綜複雜的麵條程式依賴、或是團隊內部溝通失效等根本問題。 * [⬆ 返回 Section 1.2](#12-軟體工程的起源與軟體危機)

### [Activity: ase-ch01-zh-ccq3] IEEE 軟體定義與硬體區分 (CCQ 3)
#### [CCQ] * **正確答案**：**C** (CPU 處理器硬體與物理記憶體單元) * **詳細解析**：IEEE 標準明確將軟體定義為電腦程式、程序、以及可能伴隨的文件與資料。CPU 硬體與記憶體單元屬於硬體（Hardware）範疇，是用來執行軟體的物理媒介，不屬於軟體本身的組成元件。 * [⬆ 返回 Section 1.3.1](#131-ieee-的軟體標準定義)

### [Activity: ase-ch01-zh-ccq4] ISO 9126 六大品質特徵 (CCQ 4)
#### [CCQ] * **正確答案**：**A** (Functionality, Reliability, Usability, Efficiency, Maintainability, Portability.) * **詳細解析**：ISO 9126 標準明確規範了軟體品質的這六大主要特徵。其他如效能 (Performance)、資安 (Security) 與可用性 (Availability) 則是這些主要特徵底下的子屬性特徵（如資安屬於功能性，可用性屬於可靠性）。 * [⬆ 返回 Section 1.4](#14-何謂好軟體iso-9126-品質模型)

### [Activity: ase-ch01-zh-ccq5] 容錯性與系統可靠度 (CCQ 5)
#### [CCQ] * **正確答案**：**B** (當第三方 API 斷線時，系統發生崩潰 $\rightarrow$ Reliability (Fault Tolerance)) * **詳細解析**： * **B** 正確：系統在面臨外部第三方 API 故障時不崩潰、能妥善處理例外並維持基本運作，這正是**可靠性**中的**容錯性 (Fault Tolerance)** 子特徵的定義。 * **A** 錯誤：資料庫查詢耗時 10 餘秒屬於效能（效率性 - Time Behavior）問題。 * **C** 錯誤：難以撰寫單元測試屬於可維護性 (Testability) 範疇。 * **D** 錯誤：無法在特定 OS 上執行屬於可攜性 (Adaptability) 問題。 * [⬆ 返回 Section 1.4](#14-何謂好軟體iso-9126-品質模型)

### [Activity: ase-ch01-zh-ccq6] 需求規格制定核心活動 (CCQ 6)
#### [CCQ] * **正確答案**：**A** (進行利害關係人訪談以撰寫使用者故事 $\rightarrow$ Software Specification) * **詳細解析**： * **A** 正確：透過與利害關係人進行訪談來釐清需求並撰寫成使用者故事，是「需求規格制定 (Specification)」活動的核心工作。 * **B** 錯誤：撰寫測試程式屬於「驗證與確認 (Validation)」活動，而非設計與實現。 * **C** 錯誤：重構資料庫綱要以改善查詢速度屬於軟體在生命週期中的「維護與演進 (Evolution)」活動。 * **D** 錯誤：實作並替換 API 閘道屬於「設計與實現 (Design & Implementation)」活動。 * [⬆ 返回 Section 1.6.3](#163-軟體工程流程的核心活動)

### [Activity: ase-ch01-zh-ccq7] 人月神話與布魯克斯法則 (CCQ 7)
#### [CCQ] * **正確答案**：**B** (專案將會面臨更嚴重的延遲，因為資深開發人員必須停下工作來培訓與協調新進人員) * **詳細解析**：布魯克斯（Frederick Brooks）在其名著《人月神話》中指出，軟體開發是高度複雜的腦力工作，並不能像挖土溝那樣簡單地透過增加人手來等比例縮短時間。當新進人員加入時，資深工程師必須暫停開發工作以協助其 onboard，且團隊中人與人之間的溝通管道數量會呈現 $\frac{n(n-1)}{2}$ 的二次方攀升。這使得落後的專案引入新人只會導致專案更為延遲。 * [⬆ 返回 Section 1.6.5](#165-破解常見的軟體迷思)

## Chapter 2: Software Development Processes & Methodologies

### [Activity: ase-ch02-ccq1] Concept Check (CCQ 1) — Operational Drawbacks of the Waterfall Model
#### [CCQ] What is the primary operational drawback of the traditional Waterfall model?
- It produces inadequate documentation for external auditing and compliance.
- It makes accommodating changing requirements extremely difficult and costly once underway. (Correct)
- It eliminates the need for component and system testing during execution.
- It cannot be deployed across large-scale multi-site engineering organizations.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: The Waterfall model rigidly partitions activities into sequential stages with formal handoffs. Accommodating changing user needs requires costly backward iterations, contract renegotiation, and massive specification rework.
</details>

### [Activity: ase-ch02-ccq2] Concept Check (CCQ 2) — V-Model Proactive Test Planning
#### [CCQ] What is the primary engineering advantage of the V-Model over the classic Waterfall model?
- It produces working software increments in short two-week sprint iterations.
- It enforces test planning and acceptance criteria design concurrently with early specification phases. (Correct)
- It eliminates the need for detailed architecture design and interface contracts.
- It allows customers to dynamically modify requirements at zero cost during implementation.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: The V-Model's definitive breakthrough is horizontal symmetry: test suites are authored concurrently with their corresponding specification phases (e.g., acceptance tests designed during requirements analysis), front-loading defect discovery.
</details>

### [Activity: ase-ch02-ccq3] Concept Check (CCQ 3) — Incremental vs. Iterative Distinction
#### [CCQ] In software process engineering, what is the fundamental conceptual difference between "Incremental" and "Iterative" development?
- Incremental focuses on automated testing; Iterative focuses on UI design.
- Incremental delivers finished functional slices stage-by-stage; Iterative refines an end-to-end working draft over repeated cycles. (Correct)
- Incremental is managed by product owners; Iterative is managed exclusively by external regulators.
- Incremental follows waterfall rules; Iterative produces no documentation.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: Incremental builds software piece by piece by vertical functional slices; iterative starts with a rough draft of the entire system and progressively refines depth, fidelity, and polish through repeated cycles.
</details>

### [Activity: ase-ch02-ccq4] Concept Check (CCQ 4) — MVP Skateboard Analogy Anti-Pattern
#### [CCQ] In Henrik Kniberg's famous Minimum Viable Product (MVP) analogy (Skateboard to Car), why is delivering a standalone car wheel in the first release considered an anti-pattern?
- Because manufacturing an isolated wheel is significantly more expensive than building a skateboard.
- Because an isolated wheel provides zero end-to-end transportation value, preventing users from validating core problem assumptions. (Correct)
- Because modern vehicle designs prohibit upgrading wheels into scooters.
- Because software engineering standards mandate that all early increments must be rectangular.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: An MVP must deliver standalone, end-to-end usable value that solves a real user problem. A single wheel cannot transport a person, leaving the user dissatisfied and generating zero empirical feedback on transportation needs.
</details>

### [Activity: ase-ch02-ccq5] Concept Check (CCQ 5) — Working Software over Comprehensive Documentation
#### [CCQ] The Agile Manifesto states: *"Working software over comprehensive documentation."* What does this value primarily advocate in practice?
- Engineering teams are completely prohibited from writing architecture blueprints or API specifications.
- While documentation has value, delivering working, tested, and validated software is the primary measure of progress and customer value. (Correct)
- Projects should be evaluated solely on executive PowerPoint presentations.
- Source code comments must be erased before deployment to production.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: The Agile Manifesto emphasizes that running, tested software delivering actual business value takes precedence over generating exhaustive paperwork. Documentation is authored when it serves an essential communicative purpose, but never at the expense of working software.
</details>

### [Activity: ase-ch02-ccq6] Concept Check (CCQ 6) — Sustainable Pace
#### [CCQ] Agile Principle 8 states: *"Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely."* What is the primary engineering motivation?
- To prevent code quality degradation, accumulated defects, and developer burnout caused by chronic overtime and crunch periods. (Correct)
- To mandate that developers submit at least 50 pull requests per day.
- To eliminate the need for software upgrades after initial system launch.
- To restrict development teams to working only on legacy systems.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: Chronic overtime causes severe cognitive fatigue, multiplying defect injection rates and accelerating developer burnout. A sustainable, predictable pace produces higher quality code and predictable delivery velocity over years.
</details>

### [Activity: ase-ch02-ccq7] Concept Check (CCQ 7) — Kanban WIP Limits
#### [CCQ] In the Kanban process framework, what is the primary operational purpose of enforcing strict "Work In Progress" (WIP) limits on columns?
- To prevent developers from modifying automated unit test scripts.
- To expose bottlenecks, reduce multitasking context-switching waste, and maximize delivery flow throughput. (Correct)
- To mandate that every team member attends daily 15-minute standup meetings.
- To ensure all software increments are packaged into fixed 2-week sprint iterations.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: By restricting WIP limits, teams prevent hidden queues, eliminate context-switching waste, and immediately highlight process bottlenecks where cards pile up.
</details>

### [Activity: ase-ch02-ccq8] Concept Check (CCQ 8) — Sprint Retrospective Objective
#### [CCQ] In the Scrum framework, what is the primary operational objective of the **Sprint Retrospective** held at the end of each sprint?
- To demonstrate working software increments to external business stakeholders.
- To inspect internal team collaboration, engineering practices, and tools, and identify actionable process improvements for the next sprint. (Correct)
- To assign individual performance ratings and conduct annual salary reviews.
- To rewrite the entire product backlog and discard unfinished user stories.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: While the Sprint Review focuses on inspecting the product with stakeholders, the Sprint Retrospective focuses inward on the team's processes, collaboration dynamics, and engineering practices to implement continuous self-improvement.
</details>

### [Activity: ase-ch02-ccq9] Concept Check (CCQ 9) — Compounding Interest of Technical Debt
#### [CCQ] According to Ward Cunningham's Technical Debt metaphor, what represents the "compounding interest" paid by a software organization?
- The annual licensing fees paid for cloud hosting infrastructure and IDEs.
- The ongoing extra time, degraded velocity, and regression defects suffered during all future development. (Correct)
- The bonus compensation paid to engineers who complete sprint tickets ahead of schedule.
- The legal costs of acquiring open-source third-party dependencies.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: The interest on technical debt is the extra friction and slowed velocity encountered every time engineers attempt to add new features or modify brittle, untested, poorly factored code.
</details>

### [Activity: ase-ch02-ccq10] Concept Check (CCQ 10) — Martin Fowler's "Flaccid Scrum"
#### [CCQ] Martin Fowler coined the term **"Flaccid Scrum"** to describe which critical software engineering failure?
- Adopting Scrum management ceremonies (daily standups, sprints, story points) while completely neglecting technical engineering practices like TDD, refactoring, and CI. (Correct)
- Refusing to use Jira or commercial issue tracking software in favor of physical sticky notes.
- Allowing product owners to adjust backlog priorities between sprint planning sessions.
- Enforcing automated test execution on every Git commit in the continuous integration pipeline.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: Flaccid Scrum occurs when organizations adopt agile project management rituals but ignore engineering craftsmanship. Without automated tests, refactoring, and clean architecture, code quickly becomes fragile and unmaintainable.
</details>

### [Activity: ase-ch02-ccq11] Concept Check (CCQ 11) — Extreme Programming: The Navigator Role
#### [CCQ] In Extreme Programming (XP), what is the primary role of the "Navigator" during a pair programming session?
- Typing out code syntax and executing local terminal commands.
- Thinking strategically, reviewing code in real time, considering edge cases, and looking at the broader architecture. (Correct)
- Serving as the official sprint facilitator and managing Jira backlog ticket status.
- Negotiating customer contracts and approving annual engineering budgets.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: In pair programming, the Driver types the code while the Navigator thinks strategically, reviews code in real time, catches bugs, considers edge cases, and ensures the implementation aligns with overall architecture.
</details>

### [Activity: ase-ch02-ccq12] Concept Check (CCQ 12) — TDD: The Refactor Step
#### [CCQ] In Extreme Programming's Test-Driven Development (TDD), what is the specific objective of the **"Refactor"** step in the Red-Green-Refactor cycle?
- Adding new functional capabilities and expanding the module's public API contract.
- Improving the internal structure and readability of the code while ensuring all existing automated tests continue to pass. (Correct)
- Removing unit tests that take longer than one second to execute in the local test suite.
- Rewriting the application from an object-oriented language to a functional programming language.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: Refactoring strictly means altering the internal structure of software to make it easier to understand and cheaper to modify without changing its observable external behavior, protected by passing unit tests.
</details>

### [Activity: ase-ch02-ccq13] Concept Check (CCQ 13) — Continuous Delivery vs. Continuous Deployment
#### [CCQ] What is the defining operational distinction between "Continuous Delivery" and "Continuous Deployment"?
- Continuous Delivery requires manual code compilation; Continuous Deployment automates compilation.
- Continuous Delivery stops at staging and requires human business approval to release; Continuous Deployment automatically deploys passing builds directly to live production. (Correct)
- Continuous Delivery is used solely for mobile apps; Continuous Deployment is used solely for backend databases.
- Continuous Delivery eliminates unit testing; Continuous Deployment mandates pair programming.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: Continuous Delivery ensures that every build passing the automated pipeline is immediately deployable to production, but waits for a human business decision. Continuous Deployment automatically promotes every passing build straight to production with zero manual gates.
</details>

### [Activity: ase-ch02-ccq14] Concept Check (CCQ 14) — AI Specification-Driven CI/CD Verification Gates
#### [CCQ] In modern AI Specification-Driven development, what is the primary role of automated CI/CD verification gates?
- To prevent human developers from reviewing artificial intelligence output.
- To enforce deterministic quality, test compliance, and defect containment before AI-generated code merges into production. (Correct)
- To convert natural language prompts directly into cloud infrastructure invoices.
- To replace software specifications with unverified prompt histories.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: AI coding agents can generate code rapidly, but they may introduce subtle hallucinations or security flaws. Automated CI/CD gates provide deterministic verification barriers that prevent unverified code from reaching production.
</details>

## Chapter X01: 課程學習起點與背景調查 (Chapter X01: Course Orientation & Survey)

### [Activity: ase-x01-survey-grad] Graduate Student Background & AI Coding Survey (6 Questions)
#### [Poll] Question 1: What is your prior academic background in Software Engineering (SE) courses?
- Completed one or more formal undergraduate SE courses (e.g., Software Engineering, OOAD)
- Taken software-adjacent courses (e.g., Web/Mobile Development, Database Systems), but no formal SE course
- Learned software development concepts primarily self-taught, through online courses, or bootcamps
- Transitioning from a non-CS / non-engineering background with minimal prior SE coursework
#### [Poll] Question 2: How would you describe your practical software development experience?
- Beginner: Solved introductory coding exercises, but haven't built complete multi-module applications
- Coursework Projects: Completed semester course projects or undergraduate capstone systems
- Independent Projects: Built and maintained independent full-stack applications or open-source projects using Git
- Industry Internship: Worked on real-world commercial software products in a professional development team
- Experienced / Full-time Engineer: 1+ years of full-time software engineering or production system maintenance
#### [Poll] Question 3: Which software engineering practices have you actively practiced in projects?
- Version control workflows (Git branches, pull requests, code reviews, issue tracking)
- Automated testing (unit testing frameworks, integration tests, mock objects)
- CI/CD pipelines, containerization (Docker), or automated cloud deployments
- Agile/Scrum methodologies (user stories, sprint planning, daily standups)
- Primarily solo programming with single scripts; minimal exposure to structured engineering workflows
#### [Poll] Question 4: How frequently do you use Generative AI coding assistants (e.g., GitHub Copilot, Cursor, ChatGPT, Claude)?
- Heavy Daily User: Integrated into my IDE/workflow for almost every coding task
- Frequent User: Several times a week for boilerplate generation, syntax lookups, or speeding up dev
- Occasional User: Only when encountering bottlenecks, obscure error messages, or unfamiliar APIs
- Rare / Curious: Tried it a few times, but still rely mainly on manual coding and official documentation
- Never Used: Have not used generative AI tools for programming tasks
#### [Poll] Question 5: In which area do you find AI coding tools most helpful in your development workflow?
- Auto-completing repetitive boilerplate and routine function implementations
- Debugging, interpreting stack traces, and diagnosing compiler/runtime errors
- Brainstorming system architecture, algorithms, and exploring design trade-offs
- Generating unit test cases, mock datasets, and edge cases
- Rapidly ramping up on unfamiliar programming languages, frameworks, or APIs
- None of the above
#### [Poll] Question 6: How do you verify and trust AI-generated code before adopting it?
- Rigorous Inspection: I read and comprehend every single line, and write/run tests before committing
- Empirical Smoke Test: I skim the code and run it to see if the main happy path functions properly
- Test Suite Driven: I rely on comprehensive automated tests; if tests pass, I adopt the code
- High Trust / Minimal Review: I generally assume AI code is correct and deploy with little review
- High Skepticism: I frequently find AI hallucinations or subtle flaws, requiring heavy manual rewrites
- None of the above

### [Activity: ase-x01-survey-undergrad] 專班大學生背景與 AI 輔助開發問卷 (7題問卷)
#### [Poll] **第 1 題：請問你過去修習軟體工程相關課程的經歷為何？**
- 曾在大專院校修過「軟體工程」或「物件導向分析與設計」等正式課程
- 修過程式設計、網頁開發或資料庫等實務技術課程，但尚未修過系統性的軟體工程課
- 主要透過自學、線上課程、或職業培訓機構（Bootcamp）學習軟體開發
- 過去完全未曾接觸過軟體工程相關課程，目前仍在摸索基礎程式概念
#### [Poll] **第 2 題：你評估自己目前的程式開發與專案實作經驗約為何？**
- 初學摸索階段：能撰寫基本邏輯或練習題，尚未獨立或合作完成完整系統
- 課堂作業專案：能完成期末專案或課堂指派專案，熟悉基本語法與套件使用
- 完整專案開發：曾獨立或與同儕完成具備前後端、資料庫整合的完整應用系統
- 業界實習或實務：有參與商業軟體開發、產學合作或職場系統維護之實務經驗
- 資深或全職工程師：具備多年產業開發實務，熟悉部署維運、效能調校與架構維護
#### [Poll] **第 3 題：在過往的專案或開發過程中，你熟悉並常使用哪些軟體工程實務？**
- 版本控制協作（如 Git 分支管理、GitHub/GitLab PR 與 Code Review）
- 自動化測試（如撰寫單元測試 Unit Test、整合測試）
- 容器化技術或自動化流程（如 Docker、CI/CD 管線）
- 敏捷開發與專案管理（如 Trello、Jira、Scrum 衝刺運作）
- 目前以個人單機編程為主，尚未頻繁使用上述團隊工程流程
#### [Poll] **第 4 題：在日常學習、工作或撰寫程式時，你使用 AI 程式輔助工具（如 Copilot、Cursor、ChatGPT、Claude）的頻率為何？**
- 重度依賴：已融入日常開發，幾乎每次寫程式都會使用
- 經常使用：每週或遇到較大專案時都會用，加速樣板程式碼或功能實作
- 偶爾使用：卡關、報錯看不懂或特定語法不熟悉時才當作諮詢顧問
- 極少使用：只有初步體驗嘗鮮過，目前仍習慣純手工撰寫並查閱官方文件
- 從未使用：完全沒有在寫程式時使用過生成式 AI 工具
#### [Poll] **第 5 題：你覺得目前生成式 AI 對你的程式開發在哪一方面幫助最大？**
- 自動生成重複樣板程式碼與快速補全，大幅提升開發與輸入速度
- 解讀錯誤訊息（Stack Trace / Error Log）與排查難解 Bug
- 協助構思專案架構、演算法思路與設計方案比較
- 輔助撰寫測試案例（Unit Test）與產生測試假資料
- 快速上手不熟悉的程式語言、框架或 API 語法
- None of the above
#### [Poll] **第 6 題：當使用 AI 產生程式碼後，你通常會如何確認其正確性與品質？**
- 嚴謹審查：必定逐行閱讀完全讀懂，並手動或自動測試確認邏輯無誤才採用
- 功能驗證：快速瀏覽程式碼，只要實際執行結果符合預期就直接採用
- 測試驅動：準備齊全的測試案例進行驗證，測試綠燈通過即採用
- 高度信任：直覺相信 AI 產出的程式碼通常沒問題，鮮少深入檢查
- 保持警惕：常發現 AI 生成有幻覺或潛在缺陷，通常需要手動大幅修改重寫
- None of the above
#### [Poll] **第 7 題（簡答）：請問你過去或目前的主要專業領域為何？（例如：語文、設計、製造、金融、醫療、行政、資通訊等）**
