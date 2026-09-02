# Software Testing & Quality Assurance (軟體品質與測試)

## Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程

### [Activity: test-patriot-ccq] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 CCQ 1
#### [CCQ] 愛國者反導彈系統（1991）在達蘭基地攔截失效的根本軟體原因為何？
- 通訊網路中斷導致雷達無法傳送指令給飛彈發射架
- 24-bit 時鐘暫存器的浮點捨入誤差在連續運行 100 小時後累加達 0.33 秒 (Correct)
- 程式碼發生記憶體洩漏（Memory Leak）導致作業系統當機
- 雷達演算法誤將美軍戰機辨識為敵方飛毛腿飛彈

### [Activity: sqa-ch01-wordcloud1] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 WORDCLOUD 2
#### [WordCloud] **互動提問** 請大家回想自己日常生活中接觸過、使用過的所有產品（**不論是軟體或硬體**），**你覺得「品質很棒」的產品是什麼？** 請在線上輸入產品名稱（例如：iPhone、Notion筆記、IKEA 提袋等），並想一想它是因為具備了 Garvin 的哪一種品質觀點（超自然、使用者、製造、產品、價值）讓你留下深刻印象！

### [Activity: sqa-ch01-ccq2] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 CCQ 3
#### [CCQ] 某專案團隊開發的電商 App 完全符合合約規格書上的每一條需求（製造觀點合格），但因為底層架構高度耦合且完全沒有寫單元測試，半年後客戶想新增一個促銷功能時，工程團隊發現必須重寫整個系統。這代表該軟體在 Garvin 的哪一個品質觀點上嚴重不及格？
- 產品觀點 (Product View) (Correct)
- 製造觀點 (Manufacturing View)
- 法律合約觀點 (Legal Contract View)
- 超自然觀點 (Transcendental View)

### [Activity: sqa-ch01-ccq1] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 CCQ 4
#### [CCQ] 某軟體團隊為醫院開發一套急診掛號分流系統。開發團隊嚴格按照原先簽訂的「系統需求規格書」完成所有功能實作，且單元測試與程式碼審查（Code Review）皆 100% 通過、完全無錯誤（Bug）。但實際上線在急診室臨床試用時，醫護人員發現分流操作流程完全不符合急救現場的真實節奏與急迫需求，導致無法在實務中使用。根據軟體工程定義，此系統在下列哪一項做得很好，但在哪一項嚴重失敗？
- Verification（驗證）做得很好，但 Validation（確認）嚴重失敗 (Correct)
- Validation（確認）做得很好，但 Verification（驗證）嚴重失敗
- Verification 與 Validation 兩者皆成功，純屬醫護人員操作習慣問題
- Verification 與 Validation 兩者皆失敗，因為使用者無法順利使用就代表底層邏輯有語法錯誤

### [Activity: sqa-ch01-ordering1] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 ORDERING 5
#### [Ordering] 在傳統 V 模型（V-Model）中，軟體的「左側開發階段（規格制定與分解）」與「右側測試層級（組裝與驗證）」具有嚴密的對稱與依賴關係。請將下列 8 項軟體工程活動，依照**「實際執行生命週期順序（從最初需求分析到最終驗收）」**由先至後排列出正確順序：
1. 需求分析與規格定義 (Requirements Analysis)
2. 系統架構設計 (System Architecture Design)
3. 元件/模組詳細設計 (Component Design)
4. 程式碼編寫與實作 (Coding)
5. 單元測試執行 (Unit Testing)
6. 整合測試執行 (Integration Testing)
7. 系統測試執行 (System Testing)
8. 驗收測試執行 (Acceptance Testing)

## Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging)

### [Activity: sqa-ch02-ccq1] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 1
#### [CCQ] 工程師在撰寫銀行轉帳演算法時，誤將手續費計算公式的減號寫成加號，並將程式碼編譯部署到伺服器。但在當天的日常營運中，所有客戶轉帳金額均未達到觸發扣除手續費的門檻，因此沒有任何客戶發現轉帳異常。依據 IEEE 軟體工程定義，此時系統處於何種狀態？
- 系統已發生失效 (Failure)
- 程式碼中存在缺陷 (Fault/Defect)，但尚未表現為系統失效 (Failure) (Correct)
- 工程師並未犯錯 (Mistake)，因為系統正常運作
- 該程式碼完全符合軟體品質的正確性定義

### [Activity: sqa-ch02-ccq2] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 2
#### [CCQ] 某專案經理向客戶抱怨：「使用者輸入了負數的年齡導致伺服器當機，這是使用者的操作錯誤，不是我們程式的 Bug，因為規格書上根本沒寫年齡可以是負數！」從現代軟體工程與 SQA 的角度，下列評述何者最為正確？
- 專案經理說得完全正確，未在規格書載明的輸入情況，開發團隊不負任何責任
- 這是典型的「規格遺漏」與「缺乏防禦性設計」，專業軟體應主動對非法輸入進行驗證並優雅回傳錯誤，而非直接 Crash (Correct)
- 只要資料庫欄位設為 Integer，任何數字輸入都不應該算是 Bug
- 只要客戶願意加錢，所有未明訂的規格才需要被修復

### [Activity: sqa-ch02-ccq3] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 3
#### [CCQ] 資深工程師在進行 Code Review 時，發現後輩工程師寫了一段 150 行的付款結帳方法 `checkout()`，裡面充斥著 5 層 if-else 巢狀判斷，並且作者在旁邊寫了 40 行詳細的註解解釋每一層判斷的用途。根據 Clean Code 與軟體品質設計原則，下列哪一項重構建議最為恰當？
- 只要註解寫得夠詳細且測試有過，150 行與 5 層巢狀是完全可接受的，不需要重構
- 應利用「提早回傳 (Guard Clauses)」減少巢狀層級，並運用「萃取方法 (Extract Method)」將驗證、計算折扣、扣款等子邏輯拆分成具備自我解釋能力的小函式，進而刪除冗餘的解釋性註解 (Correct)
- 應將註解全部翻譯成英文以提升國際化品質，其餘邏輯保持不變
- 應把所有 150 行程式碼壓縮成一行 Lambda 表達式以減少行數

### [Activity: sqa-ch02-ccq4] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 4
#### [CCQ] 某新進工程師向研發主管報告：「這段金融交易模組的程式碼經過徹底重構，完全符合 Clean Code 原則——變數命名精準、每個函式不超過 10 行、無任何深層巢狀、且完全消除了重複代碼。因此我可以 100% 保證這段模組上線後絕對不會有任何 Bug！」從軟體品質保證 (SQA) 與軟體工程的角度，下列評述何者最為精準？
- 該工程師的說法完全正確，因為 Clean Code 的核心定義就是無瑕疵、無缺陷的程式碼
- 該工程師混淆了「內部品質」與「外部品質」；Clean Code 雖然極大化了程式碼的可讀性與可維護性，但無法保證業務規則理解正確或算式毫無漏洞，仍需仰賴自動化測試與規格驗證來確保無 Bug (Correct)
- 只要函式行數在 10 行以內，現代 IDE 與編譯器就會自動進行形式化邏輯證明，確保無邏輯錯誤
- Clean Code 主要是針對前端 UI 介面的規範，後端核心交易模組的重構並不會帶來實質品質效益

### [Activity: sqa-ch02-ccq5] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 5
#### [CCQ] 當生產環境拋出 `ConcurrentModificationException` 時，工程師直接將整段程式碼貼給 AI，AI 建議在出錯的迴圈外層直接包裹一個空的 `try-catch` 區塊將例外吞掉。關於這種做法，下列評價何者最為精準？
- 這是絕佳的快速修復方案，因為系統再也不會拋出例外中斷服務
- 這是危險的「治標不治本（Swallowing Exception）」，雖然表象不報錯，但底層多執行緒並發衝突與資料不一致依然存在，日後會引發更嚴重的資料損壞 (Correct)
- 只要 AI 給出的程式碼能通過編譯，就代表已經通過軟體品質驗證
- 只有在 Java 8 以前才會有並發問題，現代 Java 框架不需要理會此例外

## Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版)

### [Activity: sqa-ch03-ccq1] Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版) CCQ 1
#### [CCQ] 在契約式設計 (Design by Contract) 中，由「呼叫者 (Caller)」負責滿足、若不滿足則被呼叫方法將拒絕執行，這在契約三要素中屬於？
- 前置條件 (Preconditions) (Correct)
- 後置條件 (Postconditions)
- 類別不變量 (Class Invariants)
- 異常防護 (Exceptions)

### [Activity: sqa-ch03-ccq2] Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版) CCQ 2
#### [CCQ] 某工程師使用 AI 秒速生成了一套複雜的利息計算演算法，並隨即讓同一個 AI 幫忙生成單元測試。測試跑出 100% 覆蓋率全綠燈通過，但在實際上線後卻被金融主管機關判定年息計算公式違反法規。依據 ISTQB 軟體測試 7 大原則，這最主要反映了何種問題？
- 測試工程師未安裝最新的 JDK 執行環境
- AI 測試陷入「殺蟲劑悖論（自我印證盲區）」與「原則 7：無錯謬誤（代碼無語法錯誤但偏離法規與真實業務需求）」 (Correct)
- 只要測試覆蓋率達到 100%，系統必然在法律上具備合規性
- 這是硬體浮點數運算器的製造缺陷

### [Activity: sqa-ch03-ccq3] Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版) CCQ 3
#### [CCQ] 在標準 V 開發模型中，依據「高階架構設計文件 (ADD)」所定義的模組介面與通訊協定，所對應執行的測試層級為何？
- 單元測試 (Unit Testing)
- 整合測試 (Integration Testing) (Correct)
- 驗收測試 (Acceptance Testing)
- 靜態程式碼檢視 (Code Review)

### [Activity: sqa-ch03-short1] Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版) SHORT 4
#### [Short] 1. **變質測試 (Metamorphic Testing)**： * 利用領域對稱性質：例如 sin(x) = cos(90° - x) = -sin(-x)。 * 對 AI 影像辨識系統：將一張貓的照片旋轉 10 度或調整亮度 5%，辨識結果**依然必須是貓（不變量關係）**！ 2. **差分測試 (Differential Testing)**： * 將相同輸入餵給兩種獨立實作（例如 Claude vs GPT、舊版演算法 vs 新版微服務）進行交叉比對。 3. **LLM-as-a-Judge 與防護欄 (Guardrails)**： * 使用經過專門微調的評估模型，針對輸出進行忠實度（Faithfulness）、安全性與不變量檢驗。

## Chapter 4: 軟體檢視

### [Activity: sqa-ch04-ccq1] Chapter 4: 軟體檢視 CCQ 1
#### [CCQ] 靜態測試（如軟體檢視、規格檢視）可以在程式碼實際執行之前，檢查需求、設計、程式碼甚至測試資料中的異常，以早期發現錯誤、降低整體的軟體品質成本。
- 正確 (True) (Correct)
- 錯誤 (False)

### [Activity: sqa-ch04-ccq2] Chapter 4: 軟體檢視 CCQ 2
#### [CCQ] 在 Fagan 提出的軟體檢視（Inspection）標準流程中，下列哪一個階段的主要目的是由作者向檢視小組說明背景資料與規則，而非進行實際的程式碼除錯？
- 準備 (Preparation)
- 概述 (Overview) (Correct)
- 檢視會議 (Inspection Meeting)
- 重做 (Rework)

### [Activity: sqa-ch04-ccq3] Chapter 4: 軟體檢視 CCQ 3
#### [CCQ] 為了在需求與系統規格階段做到「雙向追溯 (Bidirectional Traceability)」，規格書應該確保具備下列何種關係特性？
- 每個使用者需求均可對應到特定的系統規格，且每個系統規格皆能回溯到其來源需求 (Traced & Traceable) (Correct)
- 規格書的字數與最終程式碼行數必須成固定正比關係
- 每一行程式碼都必須直接對應到 UML 類別圖的所有屬性
- 規格書必須僅由開發人員撰寫，完全不允許顧客檢閱以防模糊焦點

### [Activity: sqa-ch04-ccq4] Chapter 4: 軟體檢視 CCQ 4
#### [CCQ] 設計檢視（Design Review）最理想的執行時機，是在系統所有模組的單元測試與整合測試皆通過之後，以確保實際產出的系統與設計文件相符。
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: sqa-ch04-ccq5] Chapter 4: 軟體檢視 CCQ 5
#### [CCQ] 在程式碼檢視中，若發現系統直接將詳細的例外錯誤堆疊資訊（如 `e.printStackTrace()`）輸出至前端頁面或公開日誌，這屬於 OWASP Top 10 中的「A05:2021-安全設定錯誤 (Security Misconfiguration)」漏洞範疇。
- 正確 (True) (Correct)
- 錯誤 (False)

### [Activity: sqa-ch04-ccq6] Chapter 4: 軟體檢視 CCQ 6
#### [CCQ] 組織在推行軟體檢視與審查時，常會使用度量指標來評估其效率。下列關於「檢視速率 (Review Rate)」與「檢視品質」的敘述，何者最為正確？
- 檢視速率愈快（如每小時檢視 2000 行），代表檢視品質愈高、找出的缺陷愈多
- 檢視速率過快通常會導致缺陷遺漏率（Defect Leakage）增高，因此應維持在建議的合理速率內 (Correct)
- 為了大幅提升開發速度，檢視會議應儘可能限制在 5 分鐘內結束
- 度量指標在軟體工程中的主要目的是用於懲罰寫出最多缺陷的工程師

## Chapter 5: 黑箱測試

### [Activity: sqa-ch05-ccq1] Chapter 5: 黑箱測試 CCQ 1
#### [CCQ] 在 JUnit 中，`assertSame(a, b)` 斷言的作用與 `assertEquals(a, b)` 完全相同，都是在驗證兩個物件的內容值是否相等（即比對 `a.equals(b)`）。

### [Activity: sqa-ch05-ccq2] Chapter 5: 黑箱測試 CCQ 2
#### [CCQ] 假設某個受測方法接受 3 個彼此獨立的輸入參數。若採用「獨立型強固邊界測試 (Independent Robust BVA)」，其設計出的測試案例數量應為多少？
- 13
- 19 (Correct)
- 125
- 343

### [Activity: sqa-ch05-ccq3] Chapter 5: 黑箱測試 CCQ 3
#### [CCQ] 在等價分割測試 (Equivalence Partitioning) 中，「弱 (Weak)」與「強 (Strong)」分類法的主要區別是什麼？
- 「弱」只涵蓋有效等價類，而「強」同時涵蓋有效與無效等價類
- 「弱」基於單一錯誤假設（每個測試案例只測試一個區間的代表值），而「強」則基於多重錯誤假設（測試參數間代表值的笛卡爾積組合） (Correct)
- 「弱」不需要程式碼規格書，而「強」必須完全依照 SRS
- 「弱」的測試案例數量一定比「強」多

### [Activity: sqa-ch05-ccq4] Chapter 5: 黑箱測試 CCQ 4
#### [CCQ] 全成對測試 (Pairwise / All-Pairs Testing) 能夠大幅縮減測試案例數量，其在工程上的核心理論依據是什麼？
- 軟體系統中的缺陷通常需要至少三個以上的參數交互作用才會觸發
- 絕大多數的軟體缺陷都是由「單一變數」或「任意兩個變數之間的交互作用 (2-way Interaction)」所引起的 (Correct)
- 配對測試是白箱測試的一種，可以直接涵蓋所有的程式碼分支路徑
- 成對測試可以保證 100% 涵蓋多變數系統的所有笛卡爾積組合

### [Activity: sqa-ch05-ccq5] Chapter 5: 黑箱測試 CCQ 5
#### [CCQ] 關於「正交表測試 (Orthogonal Array Testing)」與一般「成對測試 (Pairwise Testing)」的比較，下列敘述何者正確？
- 正交表測試是隨機產生的，而 Pairwise 必須透過數學嚴格推導
- 兩者都關注參數間的配對，但正交表更強調各因子組合的「均勻平衡性（正交性）」，而 Pairwise 僅要求任意兩因子的組合至少出現一次，因此 Pairwise 的案例數量通常更少且更有彈性 (Correct)
- 只要變數的個數相同，正交表與 Pairwise 產生的測試案例清單必定完全一致
- 正交表測試只能處理二分值（True/False）的變數組合

### [Activity: sqa-ch05-ccq6] Chapter 5: 黑箱測試 CCQ 6
#### [CCQ] 在軟體測試實務中，下列哪一種受測情境最適合優先採用「決策表測試 (Decision Table Testing)」來設計案例？
- 系統輸入參數彼此完全獨立，且有連續性數值邊界
- 輸入參數之間存在複雜的商務邏輯與制約關係，不同的條件組合會觸發不同的系統動作或輸出結果 (Correct)
- 系統的輸出僅與目前輸入值有關，與輸入條件的組合邏輯無涉
- 系統的運作強烈依賴時間序列與物件歷史狀態的轉移

### [Activity: sqa-ch05-ccq7] Chapter 5: 黑箱測試 CCQ 7
#### [CCQ] 在狀態測試 (State Testing) 中，關於「狀態覆蓋 (State Coverage)」與「轉移覆蓋 (Transition Coverage)」的強度關係，下列敘述何者正確？
- 達到狀態覆蓋必定代表同時達到了轉移覆蓋
- 轉移覆蓋的強度大於狀態覆蓋；若測試案例達到了轉移覆蓋（驗證了所有可能的轉移路徑），則必定已涵蓋了所有狀態（達到狀態覆蓋） (Correct)
- 兩者互相獨立，沒有任何包含或強弱關係
- 狀態測試不需要考慮無效轉移（即在某狀態下輸入非法事件的反應）

### [Activity: sqa-ch05-ccq8] Chapter 5: 黑箱測試 CCQ 8
#### [CCQ] 在屬性基礎測試 (Property-Based Testing) 中，我們不需要手動為每一組測試寫出確切的預期輸出數值，而是定義程式執行時必須永遠維持的「屬性或不變量」，並交由測試框架隨機生成大量測資來尋找反例。
- 正確 (True) (Correct)
- 錯誤 (False)

## Chapter 6: 白箱測試

### [Activity: sqa-ch06-ccq1] Chapter 6: 白箱測試 CCQ 1
#### [CCQ] JaCoCo 作為 Java 軟體測試覆蓋率工具，在測量覆蓋率時是透過修改 Java 原始碼檔 (.java) 並插入計數器變數來追蹤執行狀態的。
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: sqa-ch06-ccq2] Chapter 6: 白箱測試 CCQ 2
#### [CCQ] 在包含短路求值 (Short-circuit evaluation) 的條件句 `if (A && B)` 中，若我們設計的測試案例集達到了 100% 分支涵蓋度 (Branch Coverage)，是否必定能達成 100% 條件涵蓋度 (Condition Coverage)？
- 必定可以，因為分支涵蓋度強度高於條件涵蓋度
- 不一定，因為短路求值可能使得第二個條件 B 在某些測試案例中完全沒有被執行到，導致其 True 或 False 狀態未被覆蓋 (Correct)
- 必定不可以，因為兩者沒有任何邏輯涵蓋關係
- 取決於編譯器優化，與短路求值無關

### [Activity: sqa-ch06-ccq3] Chapter 6: 白箱測試 CCQ 3
#### [CCQ] 考慮一個包含 n 個彼此獨立之布林條件的複雜判斷式（例如 `A && B && C`，n = 3）。若要滿足 MC/DC 覆蓋率，最少與最多分別需要設計幾個測試案例？
- 最少 n + 1 個，最多 2n 個 (Correct)
- 最少 n + 1 個，最多 2ⁿ 個
- 最少 2ⁿ 個，最多 2ⁿ 個
- 最少 2n 個，最多 2ⁿ 個

### [Activity: sqa-ch06-ccq4] Chapter 6: 白箱測試 CCQ 4
#### [CCQ] 關於圈複雜度 (Cyclomatic Complexity, CC) 的計算與基本路徑測試，下列敘述何者錯誤？
- 圈複雜度定義了該方法之控制流程圖中，線性獨立路徑（Linearly Independent Paths）數量的上限
- 若一個方法完全不包含任何決策/判斷敘述（如 `if`、`while`），則其圈複雜度為 0 (Correct)
- 圈複雜度可以透過公式 V(G) = P + 1 計算，其中 P 是判定節點（Predicate Nodes）的數量
- 基本路徑測試設計出的測試案例集可以保證 100% 的分支涵蓋度與 100% 的敘述涵蓋度

### [Activity: sqa-ch06-ccq5] Chapter 6: 白箱測試 CCQ 5
#### [CCQ] 關於變異測試中的「等價變異體 (Equivalent Mutants)」，下列敘述何者正確？
- 等價變異體是指與原程式結構與語意完全相同，因此兩者的抽象語法樹 (AST) 沒有任何差異
- 等價變異體在所有可能的測試輸入下，其輸出行為都與原程式完全相同，因此無法被任何測試案例殺死 (Kill) (Correct)
- 等價變異體是由於編譯器優化產生的，只要在測試時關閉編譯器優化即可順利殺死
- 在計算變異分數 (Mutation Score) 時，等價變異體應計入被殺死變異體 (Killed Mutants) 的數量中

### [Activity: sqa-ch06-ccq6] Chapter 6: 白箱測試 CCQ 6
#### [CCQ] 利用 LLM 輔助生成白箱測試單元測試（如使用 JUnit 生成測試套件）以提高覆蓋率時，下列何者通常是 AI 最難以自動驗證、最需要軟體工程師介入進行人工審查（做為 Oracle）的核心部分？
- 設計正確的控制流輸入值以觸發特定的分支與邊界條件
- 撰寫正確的 Mockito 語法來模擬外部依賴的行為
- 判斷測試中的斷言 (Assertions) 是否真正符合業務真實邏輯，而非單純「鎖定與合理化」現有程式碼的可能錯誤行為 (Correct)
- 將單元測試程式碼格式化為符合規範的 JUnit 語法結構

## Chapter 8: 系統測試

### [Activity: sqa-ch08-ccq1] Chapter 8: 系統測試 CCQ 1
#### [CCQ] 在 Cucumber (Gherkin 語法) 中，若要使用同一套測試步驟來測試多組不同的輸入值與預期輸出值，應該使用 `Scenario` (情境) 搭配 `Background` (背景) 來撰寫。
- 是 (True)
- 否 (False) (Correct)
