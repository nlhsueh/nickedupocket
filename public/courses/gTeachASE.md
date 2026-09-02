# Advanced Software Engineering (進階軟體工程)

## Introduction to Software Engineering

### [Activity: ase-ch01-ccq1] Introduction to Software Engineering CCQ 1
#### [CCQ] * **Correct Answer**: **B** (1968) * **Explanation**: The NATO Science Committee convened a landmark conference in Garmisch, Germany, in October 1968, where the term "Software Engineering" was formally adopted to address the Software Crisis and establish engineering rigor for software. * [⬆ Return to Section 1.2](#12-the-genesis-of-software-engineering-and-the-software-crisis)

### [Activity: ase-ch01-ccq2] Introduction to Software Engineering CCQ 2
#### [CCQ] * **Correct Answer**: **B** (The crisis was a cognitive and organizational failure in managing system complexity, which faster hardware only amplified). * **Explanation**: Increasing hardware capacity allowed organizations to dream up systems of unprecedented scale. However, because human programmers were still using ad-hoc, informal techniques, larger codebases rapidly exceeded human intellectual limits. Faster CPU chips do not fix missing requirements, tangled spaghetti dependencies, or miscommunicated interface contracts. * [⬆ Return to Section 1.2](#12-the-genesis-of-software-engineering-and-the-software-crisis)

### [Activity: ase-ch01-ccq3] Introduction to Software Engineering CCQ 3
#### [CCQ] * **Correct Answer**: **C** (CPU processor hardware and physical memory units) * **Explanation**: The IEEE standard defines software as computer programs, procedures, and possibly associated documentation and data. CPU hardware and physical memory are physical electronic devices (hardware) that execute software, rather than components of the software itself. * [⬆ Return to Section 1.3.1](#131-the-ieee-definition-of-software)

### [Activity: ase-ch01-ccq4] Introduction to Software Engineering CCQ 4
#### [CCQ] * **Correct Answer**: **A** (Functionality, Reliability, Usability, Efficiency, Maintainability, Portability.) * **Explanation**: The ISO 9126 model defines exactly these six primary characteristics of software quality. Other attributes like Performance, Security, and Availability are either sub-characteristics under these primary categories (e.g., Security is under Functionality, Availability is under Reliability) or general engineering metrics. * [⬆ Return to Section 1.4](#14-what-defines-a-good-software-system-the-iso-9126-quality-model)

### [Activity: ase-ch01-ccq5] Introduction to Software Engineering CCQ 5
#### [CCQ] * **Correct Answer**: **B** (A system crash occurring when a third-party API goes offline $\rightarrow$ Reliability (Fault Tolerance)) * **Explanation**: * **B** is correct: A system's ability to cope with external service failures without crashing is the definition of Fault Tolerance (a sub-characteristic of Reliability). * **A** is incorrect: slow query performance is an Efficiency (Time Behavior) issue. * **C** is incorrect: testability issues belong to Maintainability, not Portability. * **D** is incorrect: OS compatibility issues belong to Portability (Adaptability), not Usability. * [⬆ Return to Section 1.4](#14-what-defines-a-good-software-system-the-iso-9126-quality-model)

### [Activity: ase-ch01-ccq6] Introduction to Software Engineering CCQ 6
#### [CCQ] * **Correct Answer**: **A** (Conducting stakeholder interviews to draft user stories $\rightarrow$ Software Specification) * **Explanation**: * **A** is correct: Eliciting and modeling requirements through stakeholder interviews is a direct action in Software Specification. * **B** is incorrect: Writing automated unit tests belongs to Software Validation (specifically verification testing), not Design & Implementation. * **C** is incorrect: Refactoring database schemas is a Software Evolution activity (preventive/perfective maintenance), not Validation. * **D** is incorrect: Swapping APIs belongs to Design & Implementation (or Evolution), not Specification. * [⬆ Return to Section 1.6.3](#163-the-core-activities-of-the-software-engineering-process)

### [Activity: ase-ch01-ccq7] Introduction to Software Engineering CCQ 7
#### [CCQ] * **Correct Answer**: **B** (The project will be delayed even further because senior developers must stop coding to train and coordinate the new hires). * **Explanation**: Frederick Brooks demonstrated in *The Mythical Man-Month* that complex software tasks are not cleanly partitionable like manual labor (e.g., digging a ditch). When new engineers join a project in its final critical phase: 1. Senior developers must context-switch away from coding to onboard and mentor the newcomers. 2. The number of inter-personal communication channels increases quadratically according to $\frac{n(n-1)}{2}$. * [⬆ Return to Section 1.6.5](#165-dispelling-common-software-myths)

## 軟體工程導論 (Introduction to Software Engineering)

### [Activity: ase-ch01-ccq1] 軟體工程導論 (Introduction to Software Engineering) CCQ 1
#### [CCQ] * **正確答案**：**B** (1968) * **詳細解析**：北約科學委員會於 1968 年 10 月在德國加米施召開了歷史性會議，正式確立了「軟體工程」一詞，這被公認為軟體工程作為一門正式學科的起點。 * [⬆ 返回 Section 1.2](#12-軟體工程的起源與軟體危機)

### [Activity: ase-ch01-ccq2] 軟體工程導論 (Introduction to Software Engineering) CCQ 2
#### [CCQ] * **正確答案**：**B** (危機本質上是人類心智面對架構複雜度、跨人溝通成本與缺乏規範的認知危機，更快的硬體只會放大問題規模) * **詳細解析**：增加硬體效能只會讓組織有信心去構想出更大規模、更複雜的系統。然而，由於開發人員當時仍在使用隨意、無序的手工編程做法，龐大的程式庫迅速超出了人類的心智控制極限。運算速度再快的 CPU，也無法解決模糊的需求規格、錯綜複雜的麵條程式依賴、或是團隊內部溝通失效等根本問題。 * [⬆ 返回 Section 1.2](#12-軟體工程的起源與軟體危機)

### [Activity: ase-ch01-ccq3] 軟體工程導論 (Introduction to Software Engineering) CCQ 3
#### [CCQ] * **正確答案**：**C** (CPU 處理器硬體與物理記憶體單元) * **詳細解析**：IEEE 標準明確將軟體定義為電腦程式、程序、以及可能伴隨的文件與資料。CPU 硬體與記憶體單元屬於硬體（Hardware）範疇，是用來執行軟體的物理媒介，不屬於軟體本身的組成元件。 * [⬆ 返回 Section 1.3.1](#131-ieee-的軟體標準定義)

### [Activity: ase-ch01-ccq4] 軟體工程導論 (Introduction to Software Engineering) CCQ 4
#### [CCQ] * **正確答案**：**A** (Functionality, Reliability, Usability, Efficiency, Maintainability, Portability.) * **詳細解析**：ISO 9126 標準明確規範了軟體品質的這六大主要特徵。其他如效能 (Performance)、資安 (Security) 與可用性 (Availability) 則是這些主要特徵底下的子屬性特徵（如資安屬於功能性，可用性屬於可靠性）。 * [⬆ 返回 Section 1.4](#14-何謂好軟體iso-9126-品質模型)

### [Activity: ase-ch01-ccq5] 軟體工程導論 (Introduction to Software Engineering) CCQ 5
#### [CCQ] * **正確答案**：**B** (當第三方 API 斷線時，系統發生崩潰 $\rightarrow$ Reliability (Fault Tolerance)) * **詳細解析**： * **B** 正確：系統在面臨外部第三方 API 故障時不崩潰、能妥善處理例外並維持基本運作，這正是**可靠性**中的**容錯性 (Fault Tolerance)** 子特徵的定義。 * **A** 錯誤：資料庫查詢耗時 10 餘秒屬於效能（效率性 - Time Behavior）問題。 * **C** 錯誤：難以撰寫單元測試屬於可維護性 (Testability) 範疇。 * **D** 錯誤：無法在特定 OS 上執行屬於可攜性 (Adaptability) 問題。 * [⬆ 返回 Section 1.4](#14-何謂好軟體iso-9126-品質模型)

### [Activity: ase-ch01-ccq6] 軟體工程導論 (Introduction to Software Engineering) CCQ 6
#### [CCQ] * **正確答案**：**A** (進行利害關係人訪談以撰寫使用者故事 $\rightarrow$ Software Specification) * **詳細解析**： * **A** 正確：透過與利害關係人進行訪談來釐清需求並撰寫成使用者故事，是「需求規格制定 (Specification)」活動的核心工作。 * **B** 錯誤：撰寫測試程式屬於「驗證與確認 (Validation)」活動，而非設計與實現。 * **C** 錯誤：重構資料庫綱要以改善查詢速度屬於軟體在生命週期中的「維護與演進 (Evolution)」活動。 * **D** 錯誤：實作並替換 API 閘道屬於「設計與實現 (Design & Implementation)」活動。 * [⬆ 返回 Section 1.6.3](#163-軟體工程流程的核心活動)

### [Activity: ase-ch01-ccq7] 軟體工程導論 (Introduction to Software Engineering) CCQ 7
#### [CCQ] * **正確答案**：**B** (專案將會面臨更嚴重的延遲，因為資深開發人員必須停下工作來培訓與協調新進人員) * **詳細解析**：布魯克斯（Frederick Brooks）在其名著《人月神話》中指出，軟體開發是高度複雜的腦力工作，並不能像挖土溝那樣簡單地透過增加人手來等比例縮短時間。當新進人員加入時，資深工程師必須暫停開發工作以協助其 onboard，且團隊中人與人之間的溝通管道數量會呈現 $\frac{n(n-1)}{2}$ 的二次方攀升。這使得落後的專案引入新人只會導致專案更為延遲。 * [⬆ 返回 Section 1.6.5](#165-破解常見的軟體迷思)
