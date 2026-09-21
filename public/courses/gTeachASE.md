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

## Chapter 3: Requirements Engineering

### [Activity: ase-ch03-ccq1] Concept Check (CCQ 1) — User Requirements vs. System Requirements
#### [CCQ] In requirements engineering, what is the critical operational distinction between **User Requirements** and **System Requirements**?
- User requirements are high-level stakeholder goals; system requirements are detailed functional contracts for developers. (Correct)
- User requirements specify UI wireframes; system requirements specify backend database schemas.
- User requirements can never change; system requirements are refactored continuously during daily scrums.
- User requirements come from external legal auditors; system requirements are generated by compiler tools.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: User requirements communicate the overarching business capabilities to non-technical stakeholders, while system requirements bridge those desires into precise, contract-level engineering specifications.
</details>

### [Activity: ase-ch03-ccq2] Concept Check (CCQ 2) — Domain Requirements Classification
#### [CCQ] Consider the following specification for the UberEats platform: > *"Due to municipal food hygiene regulations, perishable warm food delivery transit time shall not exceed 45 minutes, and containers must maintain a temperature above 60°C throughout transit."* What category of software requirement does this statement represent?
- Domain Requirement (a constraint imposed by the operational environment, industry regulations, or physical laws) (Correct)
- Functional Requirement (a specification of an active software computation, user feature, or system service)
- Non-Functional Requirement (a general software quality attribute concerning performance, scalability, or uptime)
- User Requirement (a high-level, natural-language goal or business vision expressed by end consumers)

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: While this requirement mentions a 45-minute timing constraint, it does not arise from user preference or general system performance tuning. Instead, it is dictated by external municipal health laws and thermodynamic physical properties of food safety. In software engineering, constraints that originate from industry regulations, physics, or the operating domain are classified as Domain Requirements.
</details>

### [Activity: ase-ch03-ccq3] Concept Check (CCQ 3) — Verifiable Non-Functional Requirements & Metrics
#### [CCQ] A client provides an imprecise non-functional goal: *"The order checkout system must be blazing fast and highly reliable."* Which of the following correctly transforms this vague goal into a **verifiable, testable engineering metric**?
- 99% of checkouts shall have response time $\le 500$ ms, and peak uptime shall be $\ge 99.95\%$. (Correct)
- The checkout UI shall use sleek animations so customers perceive maximum speed.
- All checkout services shall use memory-safe code to guarantee bug-free execution.
- The cloud database shall allocate unlimited RAM whenever transaction load increases.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: A verifiable NFR must be quantifiable so that test engineers can objectively measure pass or fail. Specifying 95th- or 99th-percentile latency under 500 milliseconds and four-nines availability provides an unambiguous, enforceable engineering contract.
</details>

### [Activity: ase-ch03-ccq4] Concept Check (CCQ 4) — Root Cause Elicitation & The 5 Whys
#### [CCQ] During a requirements elicitation interview, an executive insists: *"Our clinical software must include a blockchain ledger to record patient vitals."* What is the most effective engineering interview heuristic to apply?
- Apply the "5 Whys" to investigate the underlying data integrity and audit problem rather than prematurely locking in the suggested technology. (Correct)
- Immediately begin drafting smart contracts and relational database schemas for the requested blockchain feature.
- Reject the executive's request outright because non-technical stakeholders are prohibited from proposing system capabilities.
- Politely terminate the interview and switch exclusively to passive workplace observation.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: Stakeholders frequently suggest specific technical tools because they heard a buzzword, when their real business requirement is data integrity or regulatory traceability. An engineer's job is to uncover the underlying problem, not prematurely implement proposed technical band-aids.
</details>

### [Activity: ase-ch03-ccq5] Concept Check (CCQ 5) — Ethnography & Tacit Knowledge
#### [CCQ] In requirements engineering, why is **Ethnography (workplace observation)** uniquely vital when analyzing complex operational environments such as hospital emergency rooms or air traffic control?
- It uncovers tacit knowledge—ingrained habits, physical workarounds, and unwritten shortcuts that users perform automatically but never mention during interviews. (Correct)
- It automatically compiles natural language requirements directly into executable acceptance test suites without human intervention.
- It eliminates the need for subsequent software architecture design, database modeling, or code review phases.
- It guarantees that the resulting software requirements will achieve 100% mathematical completeness on the initial development sprint.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: People often cannot articulate everything they do because habits become second nature. By observing practitioners in their actual physical workspace, engineers uncover critical tacit knowledge—like sticky notes, manual spreadsheets, and physical handoffs—that never appear in official manuals or interviews.
</details>

### [Activity: ase-ch03-ccq6] Concept Check (CCQ 6) — Use Case Diagrams vs. Textual Descriptions
#### [CCQ] A software engineering team creates a UML Use Case Diagram showing an actor connected to the "Withdraw Cash" use case. Why must engineers author a detailed textual **Use Case Description** in addition to the diagram?
- Diagrams only show high-level scope; descriptions define sequential flows, preconditions, postconditions, and exception handling. (Correct)
- UML diagrams cannot be rendered by web browsers without accompanying markdown text.
- Compilers require use case descriptions to allocate heap memory for actor threads.
- Descriptions convert non-functional requirements into automated GUI wireframes.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: A use case diagram is just a visual table of contents; it shows who interacts with what feature. But engineers cannot write code or tests from an ellipse alone. They need the textual use case description to know the exact preconditions, the sequential normal flow, and how to handle exception flows when things go wrong.
</details>

### [Activity: ase-ch03-ccq7] Concept Check (CCQ 7) — Cost of Late Requirements Defects
#### [CCQ] Why is fixing a requirements error after software delivery significantly more expensive than fixing an error during early development?
- Requirements documents cannot be legally modified once signed by clients.
- A late fix requires redesigning, recoding, retesting, and redeploying cascading components that were built on the flawed premise. (Correct)
- Compilers automatically lock code repositories against changes after the first production release.
- Automated unit tests lose their validity after code has been deployed to cloud environments.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**: When a requirement defect escapes into production, all the downstream work built on that false premise—the architectural design, database schemas, API contracts, frontend views, and automated tests—must be ripped out and rebuilt. That cascading rework is what causes the 100x cost explosion.
</details>

### [Activity: ase-ch03-ccq8] Concept Check (CCQ 8) — Generative AI & Human-in-the-Loop Verification
#### [CCQ] When software engineering teams use Large Language Models (LLMs) to generate requirements specifications from stakeholder interview transcripts, what is the primary operational risk requiring human-in-the-loop verification?
- The LLM may hallucinate plausible-sounding but fictitious business logic, omitted edge-case constraints, and non-existent external API integrations. (Correct)
- The LLM cannot output text formatted in Markdown bullet points or standard user story Given-When-Then acceptance criteria.
- The LLM will consume excessive server memory and cause database deadlock errors across production microservice clusters.
- The LLM strictly enforces waterfall development practices and refuses to generate requirements for iterative agile sprint cycles.

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**: LLMs are fluent text predictors, not domain experts. They frequently invent plausible-sounding business rules or overlook subtle safety constraints that were never stated by the stakeholder. An experienced requirements engineer must critically audit every generated requirement.
</details>

## Chapter X01: 課程學習起點與背景調查 (Chapter X01: Course Orientation & Survey)

### [Activity: ase-x01-survey-grad] Chapter X01: Graduate Student Background & AI Coding Survey (6 Questions)
#### [Survey] Question 1: What is your prior academic background in Software Engineering (SE) courses?
- A. Completed one or more formal undergraduate SE courses (e.g., Software Engineering, OOAD)
- B. Taken software-adjacent courses (e.g., Web/Mobile Development, Database Systems), but no formal SE course
- C. Learned software development concepts primarily self-taught, through online courses, or bootcamps
- D. Transitioning from a non-CS / non-engineering background with minimal prior SE coursework

#### [Survey] Question 2: How would you describe your practical software development experience?
- A. Beginner: Solved introductory coding exercises, but haven't built complete multi-module applications
- B. Coursework Projects: Completed semester course projects or undergraduate capstone systems
- C. Independent Projects: Built and maintained independent full-stack applications or open-source projects using Git
- D. Industry Internship: Worked on real-world commercial software products in a professional development team
- E. Experienced / Full-time Engineer: 1+ years of full-time software engineering or production system maintenance

#### [Survey] Question 3: Which software engineering practices have you actively practiced in projects?
- A. Version control workflows (Git branches, pull requests, code reviews, issue tracking)
- B. Automated testing (unit testing frameworks, integration tests, mock objects)
- C. CI/CD pipelines, containerization (Docker), or automated cloud deployments
- D. Agile/Scrum methodologies (user stories, sprint planning, daily standups)
- E. Primarily solo programming with single scripts; minimal exposure to structured engineering workflows

#### [Survey] Question 4: How frequently do you use Generative AI coding assistants (e.g., GitHub Copilot, Cursor, ChatGPT, Claude)?
- A. Heavy Daily User: Integrated into my IDE/workflow for almost every coding task
- B. Frequent User: Several times a week for boilerplate generation, syntax lookups, or speeding up dev
- C. Occasional User: Only when encountering bottlenecks, obscure error messages, or unfamiliar APIs
- D. Rare / Curious: Tried it a few times, but still rely mainly on manual coding and official documentation
- E. Never Used: Have not used generative AI tools for programming tasks

#### [Survey] Question 5: In which area do you find AI coding tools most helpful in your development workflow?
- A. Auto-completing repetitive boilerplate and routine function implementations
- B. Debugging, interpreting stack traces, and diagnosing compiler/runtime errors
- C. Brainstorming system architecture, algorithms, and exploring design trade-offs
- D. Generating unit test cases, mock datasets, and edge cases
- E. Rapidly ramping up on unfamiliar programming languages, frameworks, or APIs
- F. None of the above

#### [Survey] Question 6: How do you verify and trust AI-generated code before adopting it?
- A. Rigorous Inspection: I read and comprehend every single line, and write/run tests before committing
- B. Empirical Smoke Test: I skim the code and run it to see if the main happy path functions properly
- C. Test Suite Driven: I rely on comprehensive automated tests; if tests pass, I adopt the code
- D. High Trust / Minimal Review: I generally assume AI code is correct and deploy with little review
- E. High Skepticism: I frequently find AI hallucinations or subtle flaws, requiring heavy manual rewrites
- F. None of the above

### [Activity: ase-x01-survey-undergrad] Chapter X01: 專班大學生背景與 AI 輔助開發問卷 (7題問卷)
#### [問卷] 第 1 題：請問你過去修習軟體工程相關課程的經歷為何？
- A. 曾在大專院校修過「軟體工程」或「物件導向分析與設計」等正式課程
- B. 修過程式設計、網頁開發或資料庫等實務技術課程，但尚未修過系統性的軟體工程課
- C. 主要透過自學、線上課程、或職業培訓機構（Bootcamp）學習軟體開發
- D. 過去完全未曾接觸過軟體工程相關課程，目前仍在摸索基礎程式概念

#### [問卷] 第 2 題：你評估自己目前的程式開發與專案實作經驗約為何？
- A. 初學摸索階段：能撰寫基本邏輯或練習題，尚未獨立或合作完成完整系統
- B. 課堂作業專案：能完成期末專案或課堂指派專案，熟悉基本語法與套件使用
- C. 完整專案開發：曾獨立或與同儕完成具備前後端、資料庫整合的完整應用系統
- D. 業界實習或實務：有參與商業軟體開發、產學合作或職場系統維護之實務經驗
- E. 資深或全職工程師：具備多年產業開發實務，熟悉部署維運、效能調校與架構維護

#### [問卷] 第 3 題：在過往的專案或開發過程中，你熟悉並常使用哪些軟體工程實務？
- A. 版本控制協作（如 Git 分支管理、GitHub/GitLab PR 與 Code Review）
- B. 自動化測試（如撰寫單元測試 Unit Test、整合測試）
- C. 容器化技術或自動化流程（如 Docker、CI/CD 管線）
- D. 敏捷開發與專案管理（如 Trello、Jira、Scrum 衝刺運作）
- E. 目前以個人單機編程為主，尚未頻繁使用上述團隊工程流程

#### [問卷] 第 4 題：在日常學習、工作或撰寫程式時，你使用 AI 程式輔助工具（如 Copilot、Cursor、ChatGPT、Claude）的頻率為何？
- A. 重度依賴：已融入日常開發，幾乎每次寫程式都會使用
- B. 經常使用：每週或遇到較大專案時都會用，加速樣板程式碼或功能實作
- C. 偶爾使用：卡關、報錯看不懂或特定語法不熟悉時才當作諮詢顧問
- D. 極少使用：只有初步體驗嘗鮮過，目前仍習慣純手工撰寫並查閱官方文件
- E. 從未使用：完全沒有在寫程式時使用過生成式 AI 工具

#### [問卷] 第 5 題：你覺得目前生成式 AI 對你的程式開發在哪一方面幫助最大？
- A. 自動生成重複樣板程式碼與快速補全，大幅提升開發與輸入速度
- B. 解讀錯誤訊息（Stack Trace / Error Log）與排查難解 Bug
- C. 協助構思專案架構、演算法思路與設計方案比較
- D. 輔助撰寫測試案例（Unit Test）與產生測試假資料
- E. 快速上手不熟悉的程式語言、框架或 API 語法
- F. None of the above

#### [問卷] 第 6 題：當使用 AI 產生程式碼後，你通常會如何確認其正確性與品質？
- A. 嚴謹審查：必定逐行閱讀完全讀懂，並手動或自動測試確認邏輯無誤才採用
- B. 功能驗證：快速瀏覽程式碼，只要實際執行結果符合預期就直接採用
- C. 測試驅動：準備齊全的測試案例進行驗證，測試綠燈通過即採用
- D. 高度信任：直覺相信 AI 產出的程式碼通常沒問題，鮮少深入檢查
- E. 保持警惕：常發現 AI 生成有幻覺或潛在缺陷，通常需要手動大幅修改重寫
- F. None of the above

#### [Short] 第 7 題（簡答）：請問你過去或目前的主要專業領域為何？（例如：語文、設計、製造、金融、醫療、行政、資通訊等）

### [Activity: ase-x01-game] Classroom Challenge Game: ISO 25010 Product Quality Characteristics Match-Up (10 Questions)

#### [Game] Question 1: [ATM Cash Dispenser Failure] A customer withdraws $1,000 from an ATM. The system deducts the amount from the account balance and prints a transaction receipt, but the cash dispenser mechanism jams and dispenses no bills while the account remains debited. Which ISO 25010 product quality characteristic is primarily violated?
- Functional Suitability (Correct)
- Reliability
- Performance Efficiency
- Usability
- Security
- Maintainability
- Portability
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: A
**Explanation**:
* **Option A is correct**: **Functional Suitability** represents the degree to which a product provides functions that meet stated and implied needs, specifically Functional Correctness (providing correct results with the needed degree of precision). Deducting balance without dispensing the cash is a failure of the core business function.
* **Option B note**: While triggered by a hardware fault, the fundamental issue is that the transactional business capability failed to produce the correct functional outcome.
</details>

#### [Game] Question 2: [Midnight Flash Sale Traffic Spike] During an e-commerce midnight flash sale, 500,000 shoppers arrive simultaneously. Server CPU utilization surges to 100%, API response latency escalates from 150ms to 40 seconds, and mass connection timeouts occur. Which ISO 25010 quality characteristic is primarily being tested or degraded?
- Functional Suitability
- Reliability
- Performance Efficiency (Correct)
- Usability
- Security
- Maintainability
- Portability
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: C
**Explanation**:
* **Option C is correct**: **Performance Efficiency** evaluates performance relative to the amount of resources used under stated conditions, including Time Behavior (response times, throughput) and Capacity (handling maximum peak loads). Severe latency surges and CPU saturation are prototypical performance efficiency concerns.
</details>

#### [Game] Question 3: [Fatal Adjacent Buttons] In a cloud management console, the "Restart Server" and "Destroy Instance" buttons are placed side-by-side with identical color styling and lack a secondary confirmation dialog. A DevOps engineer clicks the wrong button and inadvertently wipes out the production database. Which ISO 25010 quality characteristic is primarily violated?
- Functional Suitability
- Reliability
- Performance Efficiency
- Usability (Correct)
- Security
- Maintainability
- Portability
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: D
**Explanation**:
* **Option D is correct**: **Usability** includes the key sub-characteristic User Error Protection (protecting users against making errors during operation). Placing highly destructive actions adjacent to routine actions without clear visual hierarchy or confirmation safeguards is a severe usability flaw.
</details>

#### [Game] Question 4: [Spaghetti Code Ripple Effect] When adding a simple "nickname" attribute to the user profile schema, the engineering team encounters cascading compile-time errors across 8 unrelated services (Cart, Billing, Recommendations, etc.), requiring 3 days of arduous refactoring. Which ISO 25010 quality characteristic is severely deficient?
- Functional Suitability
- Reliability
- Performance Efficiency
- Usability
- Security
- Maintainability (Correct)
- Portability
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: F
**Explanation**:
* **Option F is correct**: **Maintainability** measures the effectiveness and efficiency with which software can be modified, encompassing Modularity and Modifiability. Modifying a single localized attribute causing widespread ripple breakages indicates tight coupling and poor maintainability.
</details>

#### [Game] Question 5: [Instant Power Outage Self-Healing] When a database server node experiences an abrupt power cut, the standby replica completes automated failover within 3 seconds and replays Write-Ahead Logs (WAL) to guarantee zero transaction loss, with client connections observing only minor latency jitter. Which ISO 25010 quality characteristic is showcased here?
- Functional Suitability
- Reliability (Correct)
- Performance Efficiency
- Usability
- Security
- Maintainability
- Portability
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**:
* **Option B is correct**: **Reliability** measures how well a system maintains a specified level of performance under specified conditions over time. Sub-characteristics include Fault Tolerance and Recoverability (the ability to recover affected data and re-establish the desired operational state following a failure).
</details>

#### [Game] Question 6: [Incompatible Cross-System Date Formats] An e-commerce system integrates with a third-party courier logistics API. Due to conflicting date format specifications (`YYYY-MM-DD` vs `DD/MM/YYYY`), all batch shipment dispatches fail to process. Which ISO 25010 quality characteristic is primarily challenged or violated?
- Functional Suitability
- Reliability
- Performance Efficiency
- Usability
- Security
- Maintainability
- Portability
- Compatibility (Correct)
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: H
**Explanation**:
* **Option H is correct**: **Compatibility** represents the degree to which a product can exchange information with other products and perform its required functions in a shared environment. Its key sub-characteristic is Interoperability (the ability of two or more systems to exchange and effectively utilize information).
</details>

#### [Game] Question 7: [Direct Object Reference Exposes User Data] An attacker modifies the profile URL parameter in a web browser from `userId=1001` to `userId=1002`. The backend performs no authorization verification and immediately returns another customer's complete credit card details and residential address. Which ISO 25010 quality characteristic does this critical vulnerability violate?
- Functional Suitability
- Reliability
- Performance Efficiency
- Usability
- Security (Correct)
- Maintainability
- Portability
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: E
**Explanation**:
* **Option E is correct**: **Security** assesses the degree to which information and assets are protected so that unauthorized entities cannot access or modify them. This scenario is a textbook Insecure Direct Object Reference (IDOR / BOLA) vulnerability, directly compromising Confidentiality.
</details>

#### [Game] Question 8: [Works on My Mac, Crashes on Linux] A microservice runs seamlessly on a developer's macOS machine (case-insensitive file system), but once deployed into a production Linux Docker container, it immediately crashes because file paths were hardcoded with mismatched casing (Linux is strictly case-sensitive). Which ISO 25010 quality characteristic is primarily lacking?
- Functional Suitability
- Reliability
- Performance Efficiency
- Usability
- Security
- Maintainability
- Portability (Correct)
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: G
**Explanation**:
* **Option G is correct**: **Portability** measures the ease with which a software system can be transferred from one hardware, software, or operational environment to another. Its primary sub-characteristic here is Adaptability (the capability to adapt to different target operating systems and execution environments).
</details>

#### [Game] Question 9: [Offline Caching & Automatic Sync in Basement] When a courier enters an underground garage with zero cellular reception, the mobile app smoothly switches to offline mode and caches the package delivery confirmation locally. Upon returning to street level and regaining a 5G signal, it automatically resends and synchronizes the updates. Which ISO 25010 quality characteristic is best demonstrated?
- Functional Suitability
- Reliability (Correct)
- Performance Efficiency
- Usability
- Security
- Maintainability
- Portability
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: B
**Explanation**:
* **Option B is correct**: **Reliability** sub-characteristics include Fault Tolerance (the system continuing to operate gracefully despite environmental failures like network disruptions) and Availability (operational readiness across adverse conditions).
</details>

#### [Game] Question 10: [One-Click Multi-Cloud Container Deployment] A backend microservice is packaged into an OCI-compliant container image. Whether deployed to AWS ECS, GCP GKE, Azure AKS, or an on-premise Kubernetes cluster, it launches and executes identically within 10 seconds using a standardized configuration manifest. Which ISO 25010 quality characteristic does this demonstrate?
- Functional Suitability
- Reliability
- Performance Efficiency
- Usability
- Security
- Maintainability
- Portability (Correct)
- Compatibility
Time: 30

<details>
<summary>Click to view Answer & Explanation</summary>

**Correct Answer**: G
**Explanation**:
* **Option G is correct**: **Portability** encompasses Installability (the effectiveness and efficiency with which software can be deployed in a specified environment) and Adaptability (the capability to execute across diverse cloud infrastructures). Standardized multi-cloud container deployment is an exemplary implementation of portability.
</details>
