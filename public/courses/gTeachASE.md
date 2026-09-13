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


