# Advanced Software Engineering (進階軟體工程)

## Introduction to Software Engineering

### [Activity: ase-ch01-ccq1] Introduction to Software Engineering CCQ 1
#### [CCQ] Why couldn't the 1968 Software Crisis be resolved simply by purchasing faster computer hardware or larger memory?
- Computer hardware manufacturing and memory fabrication completely stagnated in the late 1960s, preventing computational speedups.
- The crisis was fundamentally an intellectual and organizational challenge of system complexity, which faster hardware only amplified. (Correct)
- Programming languages of that era strictly lacked mathematical calculation primitives and compiler memory allocation capabilities.
- Early mainframe computers were physically incompatible with shared telecommunication networks and multi-terminal architectures.

### [Activity: ase-ch01-ccq2] Introduction to Software Engineering CCQ 2
#### [CCQ] According to the IEEE standard definition of software, which of the following is NOT considered a component of software?
- Executable computer programs and source code files.
- System database schemas and configuration files.
- CPU processor hardware and physical memory units. (Correct)
- Software installation and deployment procedures.

### [Activity: ase-ch01-ccq3] Introduction to Software Engineering CCQ 3
#### [CCQ] Which of the following pairs correctly matches a specific software engineering action with its corresponding universal core activity?
- Conducting stakeholder interviews to draft user stories $\rightarrow$ Software Specification (Correct)
- Writing automated unit tests to mock database responses $\rightarrow$ Software Design & Implementation
- Refactoring database schemas to improve query speed $\rightarrow$ Software Validation
- Swapping a third-party payment API for a new gateway $\rightarrow$ Software Specification

### [Activity: ase-ch01-ccq4] Introduction to Software Engineering CCQ 4
#### [CCQ] A project is 3 weeks behind schedule with 2 weeks remaining before release. The manager hires 4 junior programmers to speed up progress. What will happen according to Brooks's Law?
- The project will finish 1 week early.
- The project will be delayed further because senior engineers must spend time onboarding and mentoring new hires. (Correct)
- The existing developers will code twice as fast.
- Communication complexity remains unchanged.

### [Activity: ase-ch01-ccq5] Introduction to Software Engineering CCQ 5
#### [CCQ] An order-processing module directly handles HTTP requests, executes payment transactions, queries the SQL database, and generates HTML receipt emails. Which fundamental design principle is most severely violated?
- Separation of Concerns: Multiple distinct responsibilities are tightly tangled in a single module. (Correct)
- YAGNI: Speculative future features are implemented before actual business requirements emerge.
- Brooks's Law: Adding developers to the order module increases communication complexity exponentially.
- Anticipation of Change: System configurations are hardcoded into compiled production binaries.

### [Activity: ase-ch01-ccq6] Introduction to Software Engineering CCQ 6
#### [CCQ] Which of the following matches a real-world software issue with its corresponding ISO 25010 quality characteristic?
- A database query taking 15 seconds to return results $\rightarrow$ Maintainability (Testability)
- A system crash occurring when a third-party API goes offline $\rightarrow$ Reliability (Fault Tolerance) (Correct)
- Developers struggling to write unit tests due to tight coupling $\rightarrow$ Portability (Adaptability)
- An unencrypted session cookie allowing account takeover $\rightarrow$ Usability (Operability)

### [Activity: ase-ch01-ccq7] Introduction to Software Engineering CCQ 7
#### [CCQ] Under the ACM/IEEE Code of Ethics, if an employer directs an engineer to implement an algorithm that falsifies safety compliance reports, what is the engineer's obligation?
- Comply, because the employer pays the engineer's salary.
- Refuse and escalate, because the Public Interest takes precedence over Employer loyalty. (Correct)
- Implement the code but omit documentation.
- Outsource the code to an external vendor.

### [Activity: ase-ch01-ccq8] Introduction to Software Engineering CCQ 8
#### [CCQ] In empirical studies evaluating AI coding assistants (such as GitClear's analysis of 150M lines of code), "Code Churn" emerged as a major warning sign. What does high Code Churn indicate in an AI-assisted codebase?
- Code is rapidly rewritten, deleted, or patched shortly after commit, indicating brittle code accepted without sufficient verification. (Correct)
- Compilers and bundlers are aggressively removing unreachable dead code from application binaries during automated deployment.
- Software engineering teams are switching programming languages frequently due to automated polyglot syntax translation.
- Automated test cases are executing too quickly and depleting available CI/CD pipeline virtual machine compute resources.

### [Activity: ase-ch01-ccq9] Introduction to Software Engineering CCQ 9
#### [CCQ] An engineer prompts an AI to generate a complex payment calculation module, and then asks the same AI to write unit tests without providing a formal specification. All tests pass. What is the primary risk?
- Echo-chamber validation: The generated tests merely mirror the AI's internal flawed assumptions rather than actual business requirements. (Correct)
- Performance bottleneck: AI-generated test assertions take significantly longer to execute than human-written assertions.
- Compilation failure: Testing frameworks cannot parse automated mock datasets generated by large language models.
- Version lock-in: The test suite becomes tightly coupled to a single specific cloud runtime environment.

## Software Development Processes & Methodologies

### [Activity: ase-ch02-ccq1] Software Development Processes & Methodologies CCQ 1
#### [CCQ] What is the primary operational drawback of the traditional Waterfall model?
- It produces inadequate documentation for external auditing and compliance.
- It makes accommodating changing requirements extremely difficult and costly once underway. (Correct)
- It eliminates the need for component and system testing during execution.
- It cannot be deployed across large-scale multi-site engineering organizations.

### [Activity: ase-ch02-ccq2] Software Development Processes & Methodologies CCQ 2
#### [CCQ] What is the primary engineering advantage of the V-Model over the classic Waterfall model?
- It produces working software increments in short two-week sprint iterations.
- It enforces test planning and acceptance criteria design concurrently with early specification phases. (Correct)
- It eliminates the need for detailed architecture design and interface contracts.
- It allows customers to dynamically modify requirements at zero cost during implementation.

### [Activity: ase-ch02-ccq3] Software Development Processes & Methodologies CCQ 3
#### [CCQ] In software process engineering, what is the fundamental conceptual difference between "Incremental" and "Iterative" development?
- Incremental focuses on automated testing; Iterative focuses on UI design.
- Incremental delivers finished functional slices stage-by-stage; Iterative refines an end-to-end working draft over repeated cycles. (Correct)
- Incremental is managed by product owners; Iterative is managed exclusively by external regulators.
- Incremental follows waterfall rules; Iterative produces no documentation.

### [Activity: ase-ch02-ccq4] Software Development Processes & Methodologies CCQ 4
#### [CCQ] In Henrik Kniberg's famous Minimum Viable Product (MVP) analogy (Skateboard to Car), why is delivering a standalone car wheel in the first release considered an anti-pattern?
- Because manufacturing an isolated wheel is significantly more expensive than building a skateboard.
- Because an isolated wheel provides zero end-to-end transportation value, preventing users from validating core problem assumptions. (Correct)
- Because modern vehicle designs prohibit upgrading wheels into scooters.
- Because software engineering standards mandate that all early increments must be rectangular.

### [Activity: ase-ch02-ccq5] Software Development Processes & Methodologies CCQ 5
#### [CCQ] The Agile Manifesto states: *"Working software over comprehensive documentation."* What does this value primarily advocate in practice?
- Engineering teams are completely prohibited from writing architecture blueprints or API specifications.
- While documentation has value, delivering working, tested, and validated software is the primary measure of progress and customer value. (Correct)
- Projects should be evaluated solely on executive PowerPoint presentations.
- Source code comments must be erased before deployment to production.

### [Activity: ase-ch02-ccq6] Software Development Processes & Methodologies CCQ 6
#### [CCQ] Agile Principle 8 states: *"Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely."* What is the primary engineering motivation?
- To prevent code quality degradation, accumulated defects, and developer burnout caused by chronic overtime and crunch periods. (Correct)
- To mandate that developers submit at least 50 pull requests per day.
- To eliminate the need for software upgrades after initial system launch.
- To restrict development teams to working only on legacy systems.

### [Activity: ase-ch02-ccq7] Software Development Processes & Methodologies CCQ 7
#### [CCQ] In the Kanban process framework, what is the primary operational purpose of enforcing strict "Work In Progress" (WIP) limits on columns?
- To prevent developers from modifying automated unit test scripts.
- To expose bottlenecks, reduce multitasking context-switching waste, and maximize delivery flow throughput. (Correct)
- To mandate that every team member attends daily 15-minute standup meetings.
- To ensure all software increments are packaged into fixed 2-week sprint iterations.

### [Activity: ase-ch02-ccq8] Software Development Processes & Methodologies CCQ 8
#### [CCQ] In the Scrum framework, what is the primary operational objective of the **Sprint Retrospective** held at the end of each sprint?
- To demonstrate working software increments to external business stakeholders.
- To inspect internal team collaboration, engineering practices, and tools, and identify actionable process improvements for the next sprint. (Correct)
- To assign individual performance ratings and conduct annual salary reviews.
- To rewrite the entire product backlog and discard unfinished user stories.

### [Activity: ase-ch02-ccq9] Software Development Processes & Methodologies CCQ 9
#### [CCQ] According to Ward Cunningham's Technical Debt metaphor, what represents the "compounding interest" paid by a software organization?
- The annual licensing fees paid for cloud hosting infrastructure and IDEs.
- The ongoing extra time, degraded velocity, and regression defects suffered during all future development. (Correct)
- The bonus compensation paid to engineers who complete sprint tickets ahead of schedule.
- The legal costs of acquiring open-source third-party dependencies.

### [Activity: ase-ch02-ccq10] Software Development Processes & Methodologies CCQ 10
#### [CCQ] Martin Fowler coined the term **"Flaccid Scrum"** to describe which critical software engineering failure?
- Adopting Scrum management ceremonies (daily standups, sprints, story points) while completely neglecting technical engineering practices like TDD, refactoring, and CI. (Correct)
- Refusing to use Jira or commercial issue tracking software in favor of physical sticky notes.
- Allowing product owners to adjust backlog priorities between sprint planning sessions.
- Enforcing automated test execution on every Git commit in the continuous integration pipeline.

### [Activity: ase-ch02-ccq11] Software Development Processes & Methodologies CCQ 11
#### [CCQ] In Extreme Programming (XP), what is the primary role of the "Navigator" during a pair programming session?
- Typing out code syntax and executing local terminal commands.
- Thinking strategically, reviewing code in real time, considering edge cases, and looking at the broader architecture. (Correct)
- Serving as the official sprint facilitator and managing Jira backlog ticket status.
- Negotiating customer contracts and approving annual engineering budgets.

### [Activity: ase-ch02-ccq12] Software Development Processes & Methodologies CCQ 12
#### [CCQ] In Extreme Programming's Test-Driven Development (TDD), what is the specific objective of the **"Refactor"** step in the Red-Green-Refactor cycle?
- Adding new functional capabilities and expanding the module's public API contract.
- Improving the internal structure and readability of the code while ensuring all existing automated tests continue to pass. (Correct)
- Removing unit tests that take longer than one second to execute in the local test suite.
- Rewriting the application from an object-oriented language to a functional programming language.

### [Activity: ase-ch02-ccq13] Software Development Processes & Methodologies CCQ 13
#### [CCQ] What is the defining operational distinction between "Continuous Delivery" and "Continuous Deployment"?
- Continuous Delivery requires manual code compilation; Continuous Deployment automates compilation.
- Continuous Delivery stops at staging and requires human business approval to release; Continuous Deployment automatically deploys passing builds directly to live production. (Correct)
- Continuous Delivery is used solely for mobile apps; Continuous Deployment is used solely for backend databases.
- Continuous Delivery eliminates unit testing; Continuous Deployment mandates pair programming.

### [Activity: ase-ch02-ccq14] Software Development Processes & Methodologies CCQ 14
#### [CCQ] In modern AI Specification-Driven development, what is the primary role of automated CI/CD verification gates?
- To prevent human developers from reviewing artificial intelligence output.
- To enforce deterministic quality, test compliance, and defect containment before AI-generated code merges into production. (Correct)
- To convert natural language prompts directly into cloud infrastructure invoices.
- To replace software specifications with unverified prompt histories.

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
