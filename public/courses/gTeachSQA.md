# Software Testing & Quality Assurance (軟體品質與測試)

## Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程

### [Activity: sqa-ch01-ccq1] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 CCQ 1
#### [CCQ] 愛國者反導彈系統（1991）在達蘭基地攔截失效的根本軟體原因為何？
- 通訊網路中斷導致雷達無法傳送指令給飛彈發射架
- 24-bit 時鐘暫存器的浮點捨入誤差在連續運行 100 小時後累加達 0.33 秒 (Correct)
- 程式碼發生記憶體洩漏（Memory Leak）導致作業系統當機
- 雷達演算法誤將美軍戰機辨識為敵方飛毛腿飛彈

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 愛國者系統採用 24-bit 浮點數記錄時間，每小時有微小的截斷誤差。連開 100 小時累積了 0.33 秒延遲，對 4.2 馬赫的飛彈造成約 600 公尺偏差，導致雷達搜尋窗無法鎖定飛彈。
</details>

### [Activity: sqa-ch01-pair1] 真實世界的軟體失敗案例
#### [Pair] > * **討論任務**：請與鄰近同學組成雙人小組，分享一件你曾遇過、聽過，或透過網路搜尋找到的真實軟體失敗/事故案例（例如：2024 年 CrowdStrike 全球藍屏事件、Knight Capital 交易系統 45 分鐘虧損 4.6 億美元、熱門售票系統或遊戲上線當機等）。 > * **引導思考與討論**： >   1. **事件情境與影響**：該系統發生了什麼異常？對使用者、企業營運或整體社會帶來了哪些具體的衝擊與損失？ >   2. **根本原因（Root Cause）**：為什麼會發生這個錯誤？（是需求誤解、邏輯缺陷、數值捨入誤差、並行競爭、缺乏程式碼審查，還是部署流程漏洞？） >   3. **預防策略（Prevention）**：若站在軟體品質保證（SQA）與軟體測試的角度，團隊應採取哪些防護機制或工程實踐（例如：單元測試、自動化回歸測試、靜態分析、金絲雀發布、容錯設計等）來避免類似問題發生？

### [Activity: sqa-ch01-ccq2] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 CCQ 3
#### [CCQ] 在評估生成式 AI（如 GitHub Copilot、ChatGPT）對軟體專案品質的影響時，軟體工程度量研究（如 GitClear）常使用 **「程式碼流失率（Code Churn）」** 作為關鍵指標。關於 Code Churn 的定義及其在 AI 時代所反映的品質現象，下列敘述何者最為精準？
- 指專案從一個程式語言遷移至另一個語言時，因語法不相容而遺失的程式碼行數比例
- 指新寫入並 Commit 的程式碼在極短時間內（如兩週內）就被刪除、修改或替換的比例；高 Code Churn 反映出 AI 生成程式碼看似快速但本質脆弱、未經深思熟慮與充分驗證 (Correct)
- 指編譯器與建置工具在優化打包過程中，自動剔除未引用死代碼（Dead Code）的效率
- 指自動化測試案例因系統版本迭代而自然失效無法執行的比率

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **Code Churn（程式碼流失率 / 變動率）**：衡量剛提交 (Commit) 的程式碼在短時間內（通常為 2 週內）就被後續 Commit 刪除或重寫的行數比例。
  * **AI 時代的警訊**：AI 輔助寫程式讓工程師能輕易「一鍵採納」大段代碼，但這些代碼往往缺乏對邊界條件、架構約束與業務邏輯的深思熟慮。一旦進入測試或整合便漏洞百出，導致工程師必須頻繁推翻重寫。這種「產出快、丟棄也快」的高流失現象，正是 AI 生成代碼帶來**長期維護性技術債（Maintainability Debt）**與**系統脆弱性**的具體體現。
</details>
#### [CCQ] > 📚 **參考資料出處 (References)**： > 1. **Lasso Security**: [AI Package Hallucinations](https://www.lasso.security/blog/ai-package-hallucinations) — 研究指出 AI 幻覺套件（如 `huggingface-cli`）可能引發 Slopsquatting 攻擊，惡意套件在數月內被無辜下載超過 3 萬次。 > 2. **CRN**: [AWS Outage Was Not AI-Caused Via Kiro Coding Tool, Amazon Confirms](https://www.crn.com/news/cloud/2026/aws-outage-was-not-ai-caused-via-kiro-coding-tool-amazon-confirms) — 報導亞馬遜內部大推 AI 寫程式工具 Kiro 以及相關系統故障引發的代碼安全重整爭議與澄清。 > 3. **Threat Landscape**: [Lovable.dev Data Breach: BOLA Vulnerability in Vibe Coding](https://threatlandscape.io/blog/lovable-dev-data-breach-bola-vulnerability-vibe-coding) — 詳細分析 AI 自動建置應用平台 Lovable 於 2026 年爆發的 BOLA (IDOR) 越權漏洞與產生的程式碼/金鑰暴露風險。 > 4. **GitGuardian**: [State of Secrets Sprawl Report 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026) — 數據顯示 AI 輔助開發的金鑰與憑證洩漏率是人類開發者的兩倍（如 Claude Code 輔助提交的洩漏率達 3.2%）。 > 5. **GitClear**: [Coding on Copilot: 2024 Developer Research](https://gitclear-public.s3.us-west-2.amazonaws.com/Coding-on-Copilot-2024-Developer-Research.pdf) — 針對 1.5 億行程式碼進行的縱向分析，指出 AI 輔助開發使程式碼重複率與流失率增加，並降低了主動重構的頻率。 > 6. **Purdue University**: [Is Stack Overflow Obsolete? An Empirical Study of the Characteristics of ChatGPT Answers to Stack Overflow Questions](https://arxiv.org/abs/2308.02312) — 實證研究發現 ChatGPT 在回答軟體工程問題時，52% 的解答包含錯誤程式碼或資訊，且有 39% 的使用者採信了錯誤回答。 > 7. **New York University (NYU)**: [Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions](https://arxiv.org/abs/2108.09293) — 學術安全掃描研究指出，在無安全提示引導下，AI 生成的程式碼中有約 40% 包含常見的安全弱點（CWE Top 25 漏洞）。

### [Activity: sqa-ch01-wordcloud1] 品質觀點
#### [WordCloud] 你覺得哪一個觀點是最重要的品質指標？請寫下來。

### [Activity: sqa-ch01-ccq3] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 CCQ 5
#### [CCQ] 某專案團隊開發的電商 App 完全符合合約規格書上的每一條需求（製造觀點合格），但因為底層架構高度耦合且完全沒有寫單元測試，半年後客戶想新增一個促銷功能時，工程團隊發現必須重寫整個系統。這代表該軟體在 Garvin 的哪一個品質觀點上嚴重不及格？
- 產品觀點 (Product View) (Correct)
- 製造觀點 (Manufacturing View)
- 法律合約觀點 (Legal Contract View)
- 超自然觀點 (Transcendental View)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **選項 A 正確**：產品觀點著重於軟體內在結構特性（如模組化、架構整潔、可維護性與可測試性）。雖然符合製造觀點的合約規格，但內在架構腐敗。
</details>

### [Activity: sqa-ch01-ccq4] Chapter 1: 軟體危機、品質模型與 AI 時代的可靠性工程 CCQ 6
#### [CCQ] 某軟體團隊為醫院開發一套急診掛號分流系統。開發團隊嚴格按照原先簽訂的「系統需求規格書」完成所有功能實作，且單元測試與程式碼審查（Code Review）皆 100% 通過、完全無錯誤（Bug）。但實際上線在急診室臨床試用時，醫護人員發現分流操作流程完全不符合急救現場的真實節奏與急迫需求，導致無法在實務中使用。根據軟體工程定義，此系統在下列哪一項做得很好，但在哪一項嚴重失敗？
- Verification（驗證）做得很好，但 Validation（確認）嚴重失敗 (Correct)
- Validation（確認）做得很好，但 Verification（驗證）嚴重失敗
- Verification 與 Validation 兩者皆成功，純屬醫護人員操作習慣問題
- Verification 與 Validation 兩者皆失敗，因為使用者無法順利使用就代表底層邏輯有語法錯誤

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **Verification（驗證，*Are we building the product right?*）**：檢核軟體產出是否符合上一階段設定的規格、設計與技術要求。該系統完全依照規格書開發並通過單元測試與審查，因此 Verification 成功。
  * **Validation（確認，*Are we building the right product?*）**：確認軟體是否真正解決使用者的問題、滿足實際業務場景的需求。由於系統無法滿足急診現場的真實作業節奏與臨床需求，因此 Validation 失敗。
</details>

### [Activity: sqa-ch01-ordering1] V 模型（V-Model）開發與測試生命週期活動排序
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

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：工程師犯錯 (Mistake) 已將錯誤邏輯植入程式碼中形成缺陷 (Fault)。由於該分支邏輯在當天未被執行或未造成對外行為偏離，因此尚未轉化為可被觀察到的系統失效 (Failure)。
  * **選項 A 錯誤**：客戶未觀察到異常行為，尚未發生 Failure。
  * **選項 C/D 錯誤**：程式碼內確實存在潛伏的邏輯錯誤。
</details>

### [Activity: sqa-ch02-ccq2] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 2
#### [CCQ] 某專案經理向客戶抱怨：「使用者輸入了負數的年齡導致伺服器當機，這是使用者的操作錯誤，不是我們程式的 Bug，因為規格書上根本沒寫年齡可以是負數！」從現代軟體工程與 SQA 的角度，下列評述何者最為正確？
- 專案經理說得完全正確，未在規格書載明的輸入情況，開發團隊不負任何責任
- 這是典型的「規格遺漏」與「缺乏防禦性設計」，專業軟體應主動對非法輸入進行驗證並優雅回傳錯誤，而非直接 Crash (Correct)
- 只要資料庫欄位設為 Integer，任何數字輸入都不應該算是 Bug
- 只要客戶願意加錢，所有未明訂的規格才需要被修復

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：專業軟體品質保證強調防禦性架構（Robustness & Input Validation）。即使規格書未詳盡列出所有非法數值，系統也絕不能因為未受檢驗的輸入而發生未捕獲的例外或崩潰。
</details>

### [Activity: sqa-ch02-ccq3] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 3
#### [CCQ] 資深工程師在進行 Code Review 時，發現後輩工程師寫了一段 150 行的付款結帳方法 `checkout()`，裡面充斥著 5 層 if-else 巢狀判斷，並且作者在旁邊寫了 40 行詳細的註解解釋每一層判斷的用途。根據 Clean Code 與軟體品質設計原則，下列哪一項重構建議最為恰當？
- 只要註解寫得夠詳細且測試有過，150 行與 5 層巢狀是完全可接受的，不需要重構
- 應利用「提早回傳 (Guard Clauses)」減少巢狀層級，並運用「萃取方法 (Extract Method)」將驗證、計算折扣、扣款等子邏輯拆分成具備自我解釋能力的小函式，進而刪除冗餘的解釋性註解 (Correct)
- 應將註解全部翻譯成英文以提升國際化品質，其餘邏輯保持不變
- 應把所有 150 行程式碼壓縮成一行 Lambda 表達式以減少行數

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：Clean Code 的核心是「程式碼即文件」。過長的函式與深層巢狀是典型的 Code Smell，應透過 Guard Clauses 扁平化邏輯，並抽取小函式讓代碼意圖自明，而不是靠大量註解來「粉飾」難讀的邏輯。
  * **選項 A 錯誤**：過長函式與深層巢狀極易在日後引發隱蔽的邏輯缺陷。
  * **選項 C 錯誤**：未解決結構複雜度與可讀性的根因。
  * **選項 D 錯誤**：刻意過度壓縮只會摧毀程式碼的可讀性與可維護性。
</details>

### [Activity: sqa-ch02-ccq4] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 4
#### [CCQ] 某新進工程師向研發主管報告：「這段金融交易模組的程式碼經過徹底重構，完全符合 Clean Code 原則——變數命名精準、每個函式不超過 10 行、無任何深層巢狀、且完全消除了重複代碼。因此我可以 100% 保證這段模組上線後絕對不會有任何 Bug！」從軟體品質保證 (SQA) 與軟體工程的角度，下列評述何者最為精準？
- 該工程師的說法完全正確，因為 Clean Code 的核心定義就是無瑕疵、無缺陷的程式碼
- 該工程師混淆了「內部品質」與「外部品質」；Clean Code 雖然極大化了程式碼的可讀性與可維護性，但無法保證業務規則理解正確或算式毫無漏洞，仍需仰賴自動化測試與規格驗證來確保無 Bug (Correct)
- 只要函式行數在 10 行以內，現代 IDE 與編譯器就會自動進行形式化邏輯證明，確保無邏輯錯誤
- Clean Code 主要是針對前端 UI 介面的規範，後端核心交易模組的重構並不會帶來實質品質效益

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：Clean Code 關注的是內部品質（結構優雅、易讀、易改）。即使程式碼極其整潔，依然可能因為演算法寫錯、規格遺漏或領域知識誤解而產生嚴重的缺陷。Clean Code 的真正價值在於讓 Bug 難以隱藏、並讓測試與修復變得極其容易，但它無法直接等同於外部品質的正確性。
  * **選項 A 錯誤**：Clean Code 絕非零 Bug 的代名詞。
  * **選項 C 錯誤**：編譯器與 IDE 無法自動證明高階商業邏輯與演算法的正確性。
  * **選項 D 錯誤**：Clean Code 是跨領域適用的核心工程實踐。
</details>

### [Activity: sqa-ch02-ccq5] Chapter 2: 錯與除錯 (Bugs, Faults, and Debugging) CCQ 5
#### [CCQ] 當生產環境拋出 `ConcurrentModificationException` 時，工程師直接將整段程式碼貼給 AI，AI 建議在出錯的迴圈外層直接包裹一個空的 `try-catch` 區塊將例外吞掉。關於這種做法，下列評價何者最為精準？
- 這是絕佳的快速修復方案，因為系統再也不會拋出例外中斷服務
- 這是危險的「治標不治本（Swallowing Exception）」，雖然表象不報錯，但底層多執行緒並發衝突與資料不一致依然存在，日後會引發更嚴重的資料損壞 (Correct)
- 只要 AI 給出的程式碼能通過編譯，就代表已經通過軟體品質驗證
- 只有在 Java 8 以前才會有並發問題，現代 Java 框架不需要理會此例外

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：吞掉例外（Swallowing Exceptions）是嚴重的反模式（Anti-pattern）。它只是掩蓋了錯誤徵兆，實質上的並發競爭依然存在，並會導致資料悄悄被破壞。
</details>

## Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版)

### [Activity: sqa-ch03-ccq1] Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版) CCQ 1
#### [CCQ] 在契約式設計 (Design by Contract) 中，由「呼叫者 (Caller)」負責滿足、若不滿足則被呼叫方法將拒絕執行，這在契約三要素中屬於？
- 前置條件 (Preconditions) (Correct)
- 後置條件 (Postconditions)
- 類別不變量 (Class Invariants)
- 異常防護 (Exceptions)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **選項 A 正確**：前置條件 (Preconditions) 是呼叫者必須滿足的契約條件，用以保護被呼叫方法免於不合法的輸入；後置條件由被呼叫者保證達成；類別不變量是物件狀態在方法執行前後均須滿足的約束。
</details>

### [Activity: sqa-ch03-ccq2] Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版) CCQ 2
#### [CCQ] 某工程師使用 AI 秒速生成了一套複雜的利息計算演算法，並隨即讓同一個 AI 幫忙生成單元測試。測試跑出 100% 覆蓋率全綠燈通過，但在實際上線後卻被金融主管機關判定年息計算公式違反法規。依據 ISTQB 軟體測試 7 大原則，這最主要反映了何種問題？
- 測試工程師未安裝最新的 JDK 執行環境
- AI 測試陷入「殺蟲劑悖論（自我印證盲區）」與「原則 7：無錯謬誤（代碼無語法錯誤但偏離法規與真實業務需求）」 (Correct)
- 只要測試覆蓋率達到 100%，系統必然在法律上具備合規性
- 這是硬體浮點數運算器的製造缺陷

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：讓 AI 為自己生成的代碼寫測試，極易陷入自我印證的殺蟲劑抗藥性；同時，程式碼無編譯錯誤並不等於符合業務與法規需求（無錯謬誤）。人類工程師必須親自定義領域規格（Domain Spec）與 Test Oracle。
</details>

### [Activity: sqa-ch03-ccq3] Chapter 3: 軟體測試原則、理論與架構模型 (AI 時代前沿版) CCQ 3
#### [CCQ] 在標準 V 開發模型中，依據「高階架構設計文件 (ADD)」所定義的模組介面與通訊協定，所對應執行的測試層級為何？
- 單元測試 (Unit Testing)
- 整合測試 (Integration Testing) (Correct)
- 驗收測試 (Acceptance Testing)
- 靜態程式碼檢視 (Code Review)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：高階架構設計定義了子系統與模組間的 API 介面與資料傳遞協定，其直接對應的驗證層級為整合測試 (Integration Testing)。
</details>

## Chapter 4: 軟體檢視

### [Activity: sqa-ch04-ccq1] Chapter 4: 軟體檢視 CCQ 1
#### [CCQ] 靜態測試（如軟體檢視、規格檢視）可以在程式碼實際執行之前，檢查需求、設計、程式碼甚至測試資料中的異常，以早期發現錯誤、降低整體的軟體品質成本。
- 正確 (True) (Correct)
- 錯誤 (False)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **正確**：靜態測試的主要優勢在於不需執行程式即可找出問題。它可應用於軟體開發生命週期的任何階段（包括規格書、設計圖與程式碼），透過早期發現缺陷，能大幅降低後期修復 Bug 的成本（品質成本）。
</details>

### [Activity: sqa-ch04-ccq2] Chapter 4: 軟體檢視 CCQ 2
#### [CCQ] 在 Fagan 提出的軟體檢視（Inspection）標準流程中，下列哪一個階段的主要目的是由作者向檢視小組說明背景資料與規則，而非進行實際的程式碼除錯？
- 準備 (Preparation)
- 概述 (Overview) (Correct)
- 檢視會議 (Inspection Meeting)
- 重做 (Rework)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **A) 錯誤**：準備階段是參與者各自研讀材料、尋找缺陷的獨立活動。
  * **B) 正確**：概述（Overview）階段是由作者向小組簡報，說明待檢視內容的背景脈絡、規格與應注意的設計規則，幫助小組成員建立共識。
  * **C) 錯誤**：檢視會議是全體角色聚集，以朗讀和討論方式逐步發現與記錄缺陷的會議。
  * **D) 錯誤**：重做階段是作者在會議後修復發現缺陷的階段。
</details>

### [Activity: sqa-ch04-ccq3] Chapter 4: 軟體檢視 CCQ 3
#### [CCQ] 為了在需求與系統規格階段做到「雙向追溯 (Bidirectional Traceability)」，規格書應該確保具備下列何種關係特性？
- 每個使用者需求均可對應到特定的系統規格，且每個系統規格皆能回溯到其來源需求 (Traced & Traceable) (Correct)
- 規格書的字數與最終程式碼行數必須成固定正比關係
- 每一行程式碼都必須直接對應到 UML 類別圖的所有屬性
- 規格書必須僅由開發人員撰寫，完全不允許顧客檢閱以防模糊焦點

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **A) 正確**：雙向追溯（Bidirectional Traceability）是指前向追溯（每一項使用者需求都有對應的系統規格與測試案例來滿足）與後向追溯（每一項系統規格、程式碼與測試案例都有明確的來源需求，而非憑空捏造）。這能確保開發既不遺漏需求，也沒有開發不必要的功能。
  * **B) 錯誤**：規格書長度與程式碼行數並無此正比規律。
  * **C) 錯誤**：規格書是針對系統需求與規格的追溯，不是逐行對應程式碼與類別屬性。
  * **D) 錯誤**：規格檢視必須有顧客或領域專家的參與，以確認系統設計與其真實期望一致。
</details>

### [Activity: sqa-ch04-ccq4] Chapter 4: 軟體檢視 CCQ 4
#### [CCQ] 設計檢視（Design Review）最理想的執行時機，是在系統所有模組的單元測試與整合測試皆通過之後，以確保實際產出的系統與設計文件相符。
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **錯誤**：設計檢視應遵循「及早測試（Shift-Left）」原則，在**程式碼撰寫（Coding）開始之前**就進行。如果等到測試階段才發現架構設計的瑕疵，此時資料庫與程式碼都已成形，修改的代價將會非常高昂。
</details>
#### [CCQ] 下圖為一個簡約的設計查核表，檢查設計是滿足完整性、邏輯性、特殊情況的處理、方法呼叫、命名、與標準是否符合規範。 #### desgin_checklist | 項目     | 說明                                                           | Pass? | 備註 | | -------- | -------------------------------------------------------------- | ----- | ---- | | 一般性   | 是否完成每一個審查步驟。                                       |       |      | | 完整性   | 是否此設計規格，涵蓋所有相關需求描述、需求規格、高階設計規格。 |       |      | | 邏輯性   | 驗證數學公式、運算流程的正確性。                               |       |      | | 特殊情況 | 檢查所有特殊狀況，是否處理所有不正確的輸入。                   |       |      | | 方法呼叫 | 檢查所有介面都精確的定義。                                     |       |      | | 命名     | 所有特別的名稱和型態都被清楚定義。                             |       |      | | 標準     | 是否遵循所有相關組織標準。                                     |       |      | 更完整的設計檢核表可歸納為以下五大核心維度（組織亦可依特性客製調整）： 1. **實體與介面完整性 (Entities & Interfaces)** - 各設計實體（模組、資料庫、檔案）皆具備唯一識別碼、明確目的與相依關係。 - 元件介面細節完整（副程式名稱、參數型態、回傳值、前置/後置條件等）。 - 避免洩漏不必要的內部實作細節，維持良好模組封裝。 2. **架構品質與設計原則 (Architecture & Principles)** - 符合高內聚力、低耦合度（High Cohesion, Low Coupling）原則。 - 採用階層式模組聚合，架構簡潔直覺、易於理解與維護。 - 優先重複利用標準化、成熟穩定的元件。 3. **需求追溯與功能完整 (Traceability & Completeness)** - 架構完整涵蓋所有系統需求，並清楚記錄採取此架構設計之決策理由。 - 逐一檢視關鍵與高風險需求，確認架構能被確實滿足。 - 提出的解決方案具備工程可行性，元件可被單獨建構與順暢整合。 4. **多維度架構視角 (Architectural Views)** - **邏輯視角 (Logical View)**：透過類別圖或概念模型明確定義各邏輯實體職責。 - **行程視角 (Process View)**：清楚描述執行緒配置、並行控制、狀態互動與生命週期。 - **實體與開發視角 (Physical & Development View)**：透過部署圖（Deployment Diagram）定義硬體/網路配置與系統建置結構。 5. **關鍵非功能設計議題 (Key Design Issues)** - 例外處理與系統復原機制（Exception handling, Initialization & Reset）。 - 資源管理與安全防護（Memory management & Security）。 - 國際化與內建測試/輔助機制（Internationalization, Built-in help & Test facilities）。

### [Activity: sqa-ch04-ccq5] Chapter 4: 軟體檢視 CCQ 5
#### [CCQ] 在程式碼檢視中，若發現系統直接將詳細的例外錯誤堆疊資訊（如 `e.printStackTrace()`）輸出至前端頁面或公開日誌，這屬於 OWASP Top 10 中的「A05:2021-安全設定錯誤 (Security Misconfiguration)」漏洞範疇。
- 正確 (True) (Correct)
- 錯誤 (False)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **正確**：在生產環境中輸出詳細的 Debug 資訊或錯誤堆疊（Stack Trace），會將系統內部的元件版本、程式碼路徑及資料庫結構暴露給外部，這屬於典型且嚴重的「安全設定錯誤 (Security Misconfiguration)」。正確做法應使用結構化日誌（如 Logback/SLF4J）將詳細錯誤記在後台受保護的日誌檔中，對前端使用者則回傳友善且模糊的錯誤訊息（如「系統發生未知錯誤，請聯絡管理員」）。
</details>

### [Activity: sqa-ch04-ccq6] Chapter 4: 軟體檢視 CCQ 6
#### [CCQ] 組織在推行軟體檢視與審查時，常會使用度量指標來評估其效率。下列關於「檢視速率 (Review Rate)」與「檢視品質」的敘述，何者最為正確？
- 檢視速率愈快（如每小時檢視 2000 行），代表檢視品質愈高、找出的缺陷愈多
- 檢視速率過快通常會導致缺陷遺漏率（Defect Leakage）增高，因此應維持在建議的合理速率內 (Correct)
- 為了大幅提升開發速度，檢視會議應儘可能限制在 5 分鐘內結束
- 度量指標在軟體工程中的主要目的是用於懲罰寫出最多缺陷的工程師

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **A) 錯誤**：檢視速率太快代表走馬看花，通常會漏掉許多深層的設計或邏輯錯誤，品質反而下降。
  * **B) 正確**：如果檢視人員每小時閱讀的程式碼或規格書行數超出合理負荷，便無法仔細推敲，導致缺陷漏到後續階段（Defect Leakage），因此維持在組織建議的步調內非常重要。
  * **C) 錯誤**：檢視會議需要充分的時間朗讀並發掘缺陷，限時 5 分鐘無法達成檢視目的。
  * **D) 錯誤**：度量指標的目的是進行過程改善、預測軟體品質與衡量檢視活動本身的成效，絕非用來懲罰員工。
</details>

## Chapter 5: 黑箱測試

### [Activity: sqa-ch05-ccq1] Chapter 5: 黑箱測試 CCQ 1
#### [CCQ] 在 JUnit 中，`assertSame(a, b)` 斷言的作用與 `assertEquals(a, b)` 完全相同，都是在驗證兩個物件的內容值是否相等（即比對 `a.equals(b)`）。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `assertSame(a, b)` 驗證的是**參照同一性 (Reference Equality)**，即比對記憶體地址是否相同（`a == b`）。
  * `assertEquals(a, b)` 驗證的是**內容等價性 (Value Equality)**，即呼叫 `a.equals(b)`。兩者概念不同，是 Java 測試中最常混淆的地方。
</details>

### [Activity: sqa-ch05-ccq2] Chapter 5: 黑箱測試 CCQ 2
#### [CCQ] 假設某個受測方法接受 3 個彼此獨立的輸入參數。若採用「獨立型強固邊界測試 (Independent Robust BVA)」，其設計出的測試案例數量應為多少？
- 13
- 19 (Correct)
- 125
- 343

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 每個變數有 6 個邊界點 (`min-`, `min`, `min+`, `max-`, `max`, `max+`)，加上所有變數都取正常值 (`norm`) 的 1 個中心案例。
  * 當測試某個變數的邊界時，其他變數皆保持為 `norm`（單一錯誤假設）。因此總數為 6 × n + 1 = 6n + 1。
  * 選項 A 為一般邊界測試 (4n + 1)，選項 C 為最壞狀況測試 (5ⁿ)。
</details>

### [Activity: sqa-ch05-ccq3] Chapter 5: 黑箱測試 CCQ 3
#### [CCQ] 在等價分割測試 (Equivalence Partitioning) 中，「弱 (Weak)」與「強 (Strong)」分類法的主要區別是什麼？
- 「弱」只涵蓋有效等價類，而「強」同時涵蓋有效與無效等價類
- 「弱」基於單一錯誤假設（每個測試案例只測試一個區間的代表值），而「強」則基於多重錯誤假設（測試參數間代表值的笛卡爾積組合） (Correct)
- 「弱」不需要程式碼規格書，而「強」必須完全依照 SRS
- 「弱」的測試案例數量一定比「強」多

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **弱等價**基於「單一錯誤假設」，目標是讓每個等價類（Class）的代表值在所有測試案例中至少被涵蓋一次。
  * **強等價**基於「多重錯誤假設」，要求測試所有變數等價類的笛卡爾積組合（所有組合皆要測到），因此強等價生成的測試案例數量會遠多於弱等價。
</details>

### [Activity: sqa-ch05-ccq4] Chapter 5: 黑箱測試 CCQ 4
#### [CCQ] 全成對測試 (Pairwise / All-Pairs Testing) 能夠大幅縮減測試案例數量，其在工程上的核心理論依據是什麼？
- 軟體系統中的缺陷通常需要至少三個以上的參數交互作用才會觸發
- 絕大多數的軟體缺陷都是由「單一變數」或「任意兩個變數之間的交互作用 (2-way Interaction)」所引起的 (Correct)
- 配對測試是白箱測試的一種，可以直接涵蓋所有的程式碼分支路徑
- 成對測試可以保證 100% 涵蓋多變數系統的所有笛卡爾積組合

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 根據經驗法則與統計研究（例如 NIST 的研究），大約 60% 至 90% 的軟體缺陷可以由單一變數與雙變數交互作用（2-way）觸發。
  * 因此，全成對測試只要求「任意兩個變數的可能取值組合都至少出現過一次」，在大幅減少測試案例數量（從指數級降為多項式級）的同時，仍能保持極高的缺陷發現率。
</details>

### [Activity: sqa-ch05-ccq5] Chapter 5: 黑箱測試 CCQ 5
#### [CCQ] 關於「正交表測試 (Orthogonal Array Testing)」與一般「成對測試 (Pairwise Testing)」的比較，下列敘述何者正確？
- 正交表測試是隨機產生的，而 Pairwise 必須透過數學嚴格推導
- 兩者都關注參數間的配對，但正交表更強調各因子組合的「均勻平衡性（正交性）」，而 Pairwise 僅要求任意兩因子的組合至少出現一次，因此 Pairwise 的案例數量通常更少且更有彈性 (Correct)
- 只要變數的個數相同，正交表與 Pairwise 產生的測試案例清單必定完全一致
- 正交表測試只能處理二分值（True/False）的變數組合

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 正交表 (OATS) 是一種高度結構化的數學工具，要求任意兩列中所有水平組合出現的次數必須「完全相同」（均勻平衡）。
  * Pairwise 則打破了次數必須相等的平衡限制，只求「至少出現一次（>= 1）」，因此在處理不規則水平時，Pairwise 能產生更精簡、更具彈性的測試套件。
</details>

### [Activity: sqa-ch05-ccq6] Chapter 5: 黑箱測試 CCQ 6
#### [CCQ] 在軟體測試實務中，下列哪一種受測情境最適合優先採用「決策表測試 (Decision Table Testing)」來設計案例？
- 系統輸入參數彼此完全獨立，且有連續性數值邊界
- 輸入參數之間存在複雜的商務邏輯與制約關係，不同的條件組合會觸發不同的系統動作或輸出結果 (Correct)
- 系統的輸出僅與目前輸入值有關，與輸入條件的組合邏輯無涉
- 系統的運作強烈依賴時間序列與物件歷史狀態的轉移

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 決策表是表達**「條件組合與動作（輸入組合與輸出行為）之間因果邏輯關係」**的最強工具，非常適合用來分析業務邏輯極其複雜的商務規則。
  * 選項 A 適合邊界值分析，選項 D 適合狀態測試 (State Testing)。
</details>

### [Activity: sqa-ch05-ccq7] Chapter 5: 黑箱測試 CCQ 7
#### [CCQ] 在狀態測試 (State Testing) 中，關於「狀態覆蓋 (State Coverage)」與「轉移覆蓋 (Transition Coverage)」的強度關係，下列敘述何者正確？
- 達到狀態覆蓋必定代表同時達到了轉移覆蓋
- 轉移覆蓋的強度大於狀態覆蓋；若測試案例達到了轉移覆蓋（驗證了所有可能的轉移路徑），則必定已涵蓋了所有狀態（達到狀態覆蓋） (Correct)
- 兩者互相獨立，沒有任何包含或強弱關係
- 狀態測試不需要考慮無效轉移（即在某狀態下輸入非法事件的反應）

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **狀態覆蓋**僅要求系統的每個狀態都至少被訪問過一次（節點覆蓋）。
  * **轉移覆蓋**要求系統中每條合法的狀態轉移弧線（邊，Edges）都至少被執行過一次。由於要走過每條邊，勢必會造訪所有的狀態節點，因此轉移覆蓋的測試強度高於狀態覆蓋。
</details>

### [Activity: sqa-ch05-ccq8] Chapter 5: 黑箱測試 CCQ 8
#### [CCQ] 在屬性基礎測試 (Property-Based Testing) 中，我們不需要手動為每一組測試寫出確切的預期輸出數值，而是定義程式執行時必須永遠維持的「屬性或不變量」，並交由測試框架隨機生成大量測資來尋找反例。
- 正確 (True) (Correct)
- 錯誤 (False)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **正確**：PBT 的核心就是「規格即測試」。它不關注個別的特定輸入與輸出配對（Example），而是關注系統通用不變量（Property），框架會模擬極端狀態自動發送上萬組隨機輸入，若發現任何失敗的反例，還會進行收斂（Shrinking）以回報最簡潔的錯誤測資。
</details>

## Chapter 6: 白箱測試

### [Activity: sqa-ch06-ccq1] 6.1.1 概念核對問答 (CCQ 1)
#### [CCQ] JaCoCo 作為 Java 軟體測試覆蓋率工具，在測量覆蓋率時是透過修改 Java 原始碼檔 (.java) 並插入計數器變數來追蹤執行狀態的。
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **錯誤**：JaCoCo 並不修改原始碼，而是利用 Java Agent 技術，在 JVM 載入類別檔案時，動態對編譯後的位元組碼（Bytecode, .class 檔案）進行插樁（On-the-fly Instrumentation）。這使得測試與開發程式碼解耦，無需改動原始碼即可測量覆蓋率。
</details>

### [Activity: sqa-ch06-ccq2] 6.2.4.1 概念核對問答 (CCQ 2)
#### [CCQ] 在包含短路求值 (Short-circuit evaluation) 的條件句 `if (A && B)` 中，若我們設計的測試案例集達到了 100% 分支涵蓋度 (Branch Coverage)，是否必定能達成 100% 條件涵蓋度 (Condition Coverage)？
- 必定可以，因為分支涵蓋度強度高於條件涵蓋度
- 不一定，因為短路求值可能使得第二個條件 B 在某些測試案例中完全沒有被執行到，導致其 True 或 False 狀態未被覆蓋 (Correct)
- 必定不可以，因為兩者沒有任何邏輯涵蓋關係
- 取決於編譯器優化，與短路求值無關

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **正確**：在 `A && B` 中，如果第一個測試案例為 (A=False, B=True)，此時由於 A 為 False，短路求值會直接跳過條件 B 的評估。如果第二個測試案例為 (A=True, B=False)。這兩個案例可以讓整個 `if` 判斷產生 True（不成立）與 False（成立）的分支變化，從而達成 100% 分支覆蓋。然而，條件 B 的 True 狀態實際上從未被評估與覆蓋到，因此條件涵蓋度並非 100%。
</details>

### [Activity: sqa-ch06-ccq3] 6.2.7.1 概念核對問答 (CCQ 3)
#### [CCQ] 考慮一個包含 n 個彼此獨立之布林條件的複雜判斷式（例如 `A && B && C`，n = 3）。若要滿足 MC/DC 覆蓋率，最少與最多分別需要設計幾個測試案例？
- 最少 n + 1 個，最多 2n 個 (Correct)
- 最少 n + 1 個，最多 2ⁿ 個
- 最少 2ⁿ 個，最多 2ⁿ 個
- 最少 2n 個，最多 2ⁿ 個

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **正確**：MC/DC 透過尋找「獨立影響對 (Independence Pairs)」來大幅精簡測試案例。對於 n 個布林條件，滿足 MC/DC 所需的測試案例數為線性的 n + 1 到 2n 個（通常情況下為 n + 1 個，這也是相較於多重條件組合覆蓋 2ⁿ 的最大優勢）。
</details>

### [Activity: sqa-ch06-ccq4] 6.3.1 概念核對問答 (CCQ 4)
#### [CCQ] 關於圈複雜度 (Cyclomatic Complexity, CC) 的計算與基本路徑測試，下列敘述何者錯誤？
- 圈複雜度定義了該方法之控制流程圖中，線性獨立路徑（Linearly Independent Paths）數量的上限
- 若一個方法完全不包含任何決策/判斷敘述（如 `if`、`while`），則其圈複雜度為 0 (Correct)
- 圈複雜度可以透過公式 V(G) = P + 1 計算，其中 P 是判定節點（Predicate Nodes）的數量
- 基本路徑測試設計出的測試案例集可以保證 100% 的分支涵蓋度與 100% 的敘述涵蓋度

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **錯誤**：若一個方法只有順序性敘述，完全不包含任何判斷控制結構，其控制流程圖中只有一條唯一的路徑。因此其圈複雜度為 1，而非 0（公式為 V(G) = E - N + 2，對單一節點或線性順序節點計算結果為 1；或利用 P + 1 計算，判定節點 P = 0 時 V(G) = 1）。
</details>

### [Activity: sqa-ch06-ccq5] 6.4.4.1 概念核對問答 (CCQ 5)
#### [CCQ] 關於變異測試中的「等價變異體 (Equivalent Mutants)」，下列敘述何者正確？
- 等價變異體是指與原程式結構與語意完全相同，因此兩者的抽象語法樹 (AST) 沒有任何差異
- 等價變異體在所有可能的測試輸入下，其輸出行為都與原程式完全相同，因此無法被任何測試案例殺死 (Kill) (Correct)
- 等價變異體是由於編譯器優化產生的，只要在測試時關閉編譯器優化即可順利殺死
- 在計算變異分數 (Mutation Score) 時，等價變異體應計入被殺死變異體 (Killed Mutants) 的數量中

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **A 錯誤**：等價變異體在原始碼結構（包含變異算子的修改）上與原程式是有差異的，因此 AST 會不同，但在「執行語意與行為」上與原程式完全相同。
  * **B 正確**：等價變異體（Equivalent Mutant）在語意上與原程式完全等價，代表對於所有可能的輸入，其輸出都與原程式相同。因此，沒有測試案例能夠區分兩者並將其殺死。
  * **C 錯誤**：等價變異體是程式碼本身的邏輯語意問題（例如把整數的 `a < b` 變成 `a <= b - 1`），與編譯器優化無關。
  * **D 錯誤**：在計算變異分數時，公式為 `MS = K / (M - E)`，其中等價變異體數 E 應從總變異體數 M 中扣除，以反映真實的測試集殺死率。
</details>
#### [CCQ] 在實務上，變異測試需要搭配工具才能使用，因為一個程式所產生出的變異體需要很多，這需要自動化的產生，而比對變異體的執行結果與原程式是否相異也需要透過系統自動檢查，才能發揮此方法的效益。

### [Activity: sqa-ch06-ccq6] 6.5.5 概念核對問答 (CCQ 6)
#### [CCQ] 利用 LLM 輔助生成白箱測試單元測試（如使用 JUnit 生成測試套件）以提高覆蓋率時，下列何者通常是 AI 最難以自動驗證、最需要軟體工程師介入進行人工審查（做為 Oracle）的核心部分？
- 設計正確的控制流輸入值以觸發特定的分支與邊界條件
- 撰寫正確的 Mockito 語法來模擬外部依賴的行為
- 判斷測試中的斷言 (Assertions) 是否真正符合業務真實邏輯，而非單純「鎖定與合理化」現有程式碼的可能錯誤行為 (Correct)
- 將單元測試程式碼格式化為符合規範的 JUnit 語法結構

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* **正確**：AI 擅長分析程式碼結構並生成測資以觸發特定路徑，或者寫出正確的 Mock 語法。然而，如果程式碼本身已經寫錯了（例如邏輯寫反了），AI 在生成測試時，只會根據錯的程式碼生成斷言以使其通過（即將錯誤視為正確）。這被稱為「合理化現有行為 (Reasoning about existing behavior)」，如果沒有工程師作為 Oracle 來確認業務邏輯的正確性，測試將失去尋找 Bug 的功能。
</details>

## Chapter 8: 系統測試

### [Activity: sqa-ch08-ccq1] 8.2.4 概念核對問答 (CCQ 1)
#### [CCQ] 在 Cucumber (Gherkin 語法) 中，若要使用同一套測試步驟來測試多組不同的輸入值與預期輸出值，應該使用 `Scenario` (情境) 搭配 `Background` (背景) 來撰寫。
- 是 (True)
- 否 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 若要測試多組不同的輸入值與預期輸出值（參數化測試），應該使用 **`Scenario Outline`（情境大綱）** 搭配 **`Examples`（範例表格）**，而非 `Scenario` 搭配 `Background`。`Background` 是用於在每個情境執行前設定共同的前置步驟（例如登入系統），無法實現表格化的參數對照測試。
</details>

## Unit 1: AI 程式碼破壞實驗 (AI Code Attack & Reliability Lab)

### [Activity: sqa-u01-codebreak-ccq1] AI 寫程式與單元測試的「自我印證盲區」
#### [CCQ] 工程師使用 LLM 快速生成了電子錢包扣款邏輯，接著又請同一個 AI 為該方法生成單元測試。測試執行結果呈現 100% 綠燈通過，且涵蓋率高達 100%。然而一上線面對促銷搶購的高並發情境，帳戶卻瞬間被超賣穿透、餘額變成負數破產。依據軟體測試與 SQA 原則，這主要體現了何種核心問題？
- 殺蟲劑悖論與 Happy Path 偏誤：AI 依據自身單執行緒、循序的靜態語意設計測試，導致測試案例與被測程式碼「共同錯在同一個並發與時間交錯盲區」，帶來極度危險的假安全感 (Correct)
- 測試原則宣告「窮盡測試是不可能的」，因此線上故障純屬無法預防的偶發機率
- 單元測試執行次數太少，若在單執行緒環境下重複跑 10 萬次 Happy Path 就必定能測出並發問題
- 這是作業系統與 CPU 硬體的暫存器故障，與軟體測試品質無關

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **選項 A 正確**：這正是 AI 輔助開發最嚴重的技術債盲區。AI 生成的程式碼在單執行緒（Happy Path）下看似無懈可擊，若再由 AI 自己出測試，AI 只會針對它所預想的正常路徑設計測試案例。測試與程式碼存在相同的盲點，產生「100% 綠燈的假安全感」，唯有人類工程師主動注入多執行緒競爭（Race Condition）與邊界攻擊，才能破除此盲區。
  * **選項 B/C/D 錯誤**：並發問題需要專門的並發測試（如利用 `CountDownLatch` 瞬間鳴槍起跑）才能觸發，單純重複單執行緒 Happy Path 永遠無法重現問題。
</details>

### [Activity: sqa-u01-codebreak-ccq2] 並發防禦順序（Check-Then-Act 與 TOCTOU 漏洞）
#### [CCQ] 在修復 `WalletService` 的並發扣款缺陷時，某同學將程式碼改成如下： ```java public boolean withdraw(double amount) { if (amount <= 0) return false; if (balance >= amount) { // 👈 步驟 1：先在鎖定外面檢查餘額 synchronized (this) { // 👈 步驟 2：只在扣款瞬間加鎖 balance -= amount; return true; } } return false; } ``` 請問這段程式碼在面對多執行緒並發攻擊時，能否有效防止帳戶餘額被扣成負數？
- 可以，因為 `balance -= amount` 已經被 `synchronized` 區塊保護，保證了記憶體寫入的原子性
- 不能，因為「檢查餘額」發生在取得鎖定之前，多個執行緒仍可同時通過 `balance >= amount` 的檢查，隨後依序排隊進去把餘額扣成負數（典型 TOCTOU 漏洞） (Correct)
- 可以，因為 JVM 會自動將外層的 `if` 條件與內層的 `synchronized` 區塊智慧合併鎖定
- 不能，因為 `synchronized` 只能修飾整個方法，不能以程式碼區塊（Block）形式使用

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：這屬於經典的 **TOCTOU（Time-of-Check to Time-of-Use）** 漏洞。當帳戶餘額為 $100，有 5 個執行緒同時進入該方法時，大家都在鎖定區之外檢查並判定「餘額 >= $100 成立」；接著這 5 個執行緒雖然排隊進入 `synchronized`，但因為已經通過檢查，每個執行緒都會扣款一次，最終餘額變成 -$400！**正確做法必須「先鎖定 ➔ 再檢查 ➔ 後修改」**，將檢查與修改完整包進同一個臨界區段。
  * **選項 A 錯誤**：雖然扣款本身不會有變數寫入衝突，但業務邏輯狀態（餘額不為負）已被破壞。
  * **選項 C/D 錯誤**：JVM 不會自動合併鎖定；`synchronized (this)` 是合法且標準的區塊語法。
</details>

### [Activity: sqa-u01-codebreak-ccq3] 金融數值精度與型別防禦
#### [CCQ] 在 Java 金融交易、電子錢包與電商購物車系統中，處理金額加減與結算時，為什麼業界軟體工程標準「強烈禁止」直接使用 `double` 或 `float`？其品質工程防禦方案為何？
- 因為 `double` 只能儲存正數，無法表示扣款後的負數餘額
- 因為 IEEE 754 二進位浮點數無法精確表示 `0.1` 等十進位小數，頻繁累加會產生微小截斷偏差導致帳目不平；應全面改採 `BigDecimal`（且須使用字串建構子 `new BigDecimal("0.1")`）或以最小貨幣單位（如整數分、厘）的 `long` 儲存 (Correct)
- 因為 `double` 運算需要龐大 CPU 浮點數處理單元，在高並發時會導致作業系統當機
- 因為主流關聯式資料庫（如 PostgreSQL、MySQL）不支援儲存任何小數型別

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：十進位小數（如 0.1、0.2）轉換成二進位時是無限循環小數，以 `double`（64-bit IEEE 754）儲存必定存在微小的截斷捨入誤差。百萬次累加或跨幣別換算後會產生實質差額，造成嚴重的稽核帳目不符。防禦方案是使用專門的高精度數值類別 `BigDecimal`，或是統一將金額以最小貨幣單位（例如：台幣以「元」、美金以「分 (Cent)」）轉為整數 `long` 進行計算。
  * **選項 A/C/D 錯誤**：皆非禁止使用浮點數的真實原因。
</details>

## Unit 1: Google Antigravity IDE 介紹與 Java Maven 開發實務指南

### [Activity: sqa-u01-antigravity-ccq1] Agentic AI 與傳統 Copilot 的核心本質區別
#### [CCQ] 傳統的程式碼輔助工具（如早期 GitHub Copilot）與 Google Antigravity 的「Agentic 代理人協作模式」相比，後者最關鍵的架構突破為何？
- 代理人模式能將程式碼直接轉換為機器碼以提升 CPU 執行效率
- 具備環境感測能力（全局索引專案、讀取編譯與測試日誌）與自主工具調用能力（檔案精準讀寫、執行終端機指令、形成自動修復閉環） (Correct)
- 代理人模式完全不需要人類工程師參與或下達 Prompt，就會自主開發完成系統並發布上線
- 代理人模式只能在雲端伺服器運作，無法在本機 IDE 編輯器中執行

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：傳統 Copilot 多停留在「被動程式碼補全」或「聊天室問答」，開發者仍須手動複製貼上與編譯排查；而 Agentic AI 具備感知工作區狀態（讀取 `pom.xml`、終端機報錯）、自主操作工具（檔案修改、執行 `mvn test`）的能力，能形成「修改 ➔ 測試 ➔ 偵錯 ➔ 再驗證」的主動自主閉環。
  * **選項 A 錯誤**：編譯為機器碼是 JVM / JIT 編譯器的職責，非 AI 模型的功能。
  * **選項 C 錯誤**：AI 代理人仍需人類工程師提供需求目標，且重大操作需人類審查核准（Human-in-the-Loop）。
  * **選項 D 錯誤**：Antigravity IDE 為整合於本機桌面的原生開發環境。
</details>

### [Activity: sqa-u01-antigravity-ccq2] 三大 AI 互動模式之情境選用
#### [CCQ] 工程師正在檢視 `GCD.java`，發現其中一個輔助函式邏輯巢狀太深。他只想針對「選取的這 10 行程式碼」進行原地重構與加入 JavaDoc 說明，不想改動或干擾工作區的其他任何檔案。請問下列哪一種互動模式最迅速且最合適？
- 啟動 Planning Mode 生成全局架構實作計畫書
- 使用 Inline Command 行內指引模式（按下 `Cmd + I` / `Ctrl + I`） (Correct)
- 呼叫 Browser Subagent 開啟無頭瀏覽器
- 切換至全域終端機執行 `agy` 命令列背景排程

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：**Inline Command（`Cmd + I` / `Ctrl + I`）** 專門用於「局部程式碼修改與重構」，它直接針對游標選取的區域進行原地優化、解說或修正，輕量迅速且完全不影響檔案外的其他邏輯。
  * **選項 A 錯誤**：Planning Mode 適合跨檔案、多步驟或具有架構影響的複合型任務，局部修改使用它會顯得過於繁瑣。
  * **選項 C/D 錯誤**：Browser Subagent 用於 Web E2E 介面測試驗收，非編輯器內重構工具。
</details>

### [Activity: sqa-u01-antigravity-ccq3] 安全沙盒與指令執行審查
#### [CCQ] 在 Antigravity 預設的「標準沙盒隔離模式（Standard Sandbox Mode）」下，當 Agent 為了修復 Bug 而嘗試在終端機執行可能影響系統環境或高風險的指令時，系統會如何處理？
- 為了追求最高自主效率，IDE 會一律自動靜默執行，不通知使用者
- 系統會直接強制關閉 IDE 並鎖死作業系統
- 指令會被安全攔截並彈出審查提示，清楚呈現即將執行的完整指令，必須由開發者手動點擊核准（Approve）後方可執行 (Correct)
- 沙盒模式下嚴禁執行任何終端機指令，即使是 `git status` 或 `mvn compile` 等唯讀指令也會被永久阻斷

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* **選項 C 正確**：Antigravity 設計了嚴格的人機協同安全防護（Human-in-the-Loop）。在沙盒防護下，可能危害系統或逃逸沙盒的指令均須經過開發者透明審查與顯式授權，確保 Agent 的自主操作完全在人類的掌控邊界之內。
  * **選項 A 錯誤**：靜默執行重大風險指令會帶來極大的安全隱患。
  * **選項 B/D 錯誤**：無此極端行為；一般讀取與安全指令可依設定自動放行或受控執行。
</details>

### [Activity: sqa-u01-antigravity-ccq4] Java 專案開啟根目錄與 Classpath 解析
#### [CCQ] 在 Antigravity / VS Code 開發 Java Maven 專案時，指引特別強調「必須直接開啟包含 `pom.xml` 的專案資料夾（如 `LabDemo/`），而不要開啟最外層的父目錄（如 `gTeachSQA/`）」。其背後最關鍵的技術原因為何？
- 開啟外層目錄會超過作業系統的檔案路徑長度限制
- Java Language Server 必須以開啟的資料夾根目錄為基準定位 `pom.xml`，才能正確解析相依套件庫並建立編譯 Classpath；若開外層目錄會導致語法提示失效甚至執行時報出 `ClassNotFoundException` (Correct)
- Maven 專案規格強制規定一個資料夾內只能有一個檔案，外層有多個子目錄會破壞規範
- 外層目錄通常包含 Git 版本控制，IDE 禁止載入含有 `.git` 的資料夾

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：VS Code 與 Antigravity 的 Java Language Server 依賴根目錄的 `pom.xml` 來辨識專案結構與建立 Classpath。若開啟外層目錄，IDE 會將內部子資料夾視為普通資料夾而非 Java 專案，無法正確下載並掛載依賴庫，導致主程式無法執行並報出 `ClassNotFoundException`。
  * **選項 A/C/D 錯誤**：皆非技術事實。
</details>

## Unit 1: 除錯實務與科學假設檢驗 (Debug Lab)

### [Activity: sqa-u01-debug-ccq1] 中斷點暫停時機與變數狀態
#### [CCQ] 在 Java 程式碼中： ```java int a = 100; a = a + 1; // 👈 在此行設定中斷點 ``` 當除錯器執行到該行並高亮暫停時，在 Variables 變數監視視窗中，變數 `a` 此時呈現的值是多少？
- `100` (Correct)
- `101`
- `0`
- 尚未宣告，無法查看

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* **選項 A 正確**：中斷點的機制是「在該行指令**執行之前**暫停（Pause before execution）」。因此，當程式停在 `a = a + 1;` 這一行時，加法與賦值運算尚未發生，變數 `a` 的值仍保留為前一行賦予的 `100`。
  * **選項 B 錯誤**：必須按下 Step Over（單步執行下一行）之後，`a` 的值才會被更新為 `101`。
  * **選項 C/D 錯誤**：變數 `a` 已經在前一行完成宣告與初始化。
</details>

### [Activity: sqa-u01-debug-ccq2] 單步執行操作（Step Over vs. Step Into）
#### [CCQ] 工程師在 `main` 方法中除錯，目前程式暫停於呼叫自訂函式的敘述： ```java computeArea(); // 👈 目前停在這一行 ``` 若工程師希望「跟隨執行流程，進入 `computeArea()` 函式內部逐行追蹤其邏輯」，應在除錯工具列上選擇哪一項操作？
- **Step Over (單步跳過 / F10)**：直接執行完該行並跳到下一行指令
- **Step Into (單步進入 / F11)**：進入被呼叫函式內部追蹤 (Correct)
- **Step Out (單步跳出 / Shift + F11)**：跳出當前函式返回呼叫端
- **Resume / Continue (繼續執行 / F5)**：忽略所有中斷點執行到程式結束

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：**Step Into** 的功能是跟隨呼叫流程進入函式內部，適合排查特定副程式內部的詳細運算。
  * **選項 A 錯誤**：**Step Over** 會將 `computeArea()` 作為一整個步驟直接在背景執行完畢，停在 `main` 的下一行，不會走進該函式內部。
  * **選項 C 錯誤**：**Step Out** 是當你已經在函式內部時，執行完剩餘邏輯並直接跳回外層呼叫點。
  * **選項 D 錯誤**：**Resume** 會讓程式全力跑動，直到撞到下一個中斷點或程式終止。
</details>

### [Activity: sqa-u01-debug-ccq3] 整數除法截斷缺陷分析
#### [CCQ] 檢視本單元 Demo 中的圓面積計算程式碼： ```java int diameter = input.nextInt(); // 使用者輸入直徑 double area = Math.PI * Math.pow(diameter / 2, 2); ``` 當使用者輸入奇數直徑（例如 `diameter = 5`，正確半徑應為 `2.5`，面積應約為 `19.63`）時，計算出的面積卻只有 `12.56`。透過除錯器查看發現半徑被算成了 `2.0`。這屬於下列何種根本原因？
- `Math.pow()` 只支援整數運算，不支援小數運算
- `Math.PI` 精度遺失導致截斷
- `diameter / 2` 屬於整數除法（Integer Division），小數部分在運算當下被強制捨去截斷 (Correct)
- `Scanner.nextInt()` 無法讀取大於 4 的數值

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* **選項 C 正確**：在 Java 語法中，當運算元兩者皆為整數型別（`int / int`）時，運算結果強制為 `int`，小數點直接被截斷（`5 / 2 = 2`），隨後傳入 `Math.pow(2, 2)` 計算出的半徑平方為 `4.0` 而非預期的 `6.25`。修復方式是讓除數為浮點數（例如 `diameter / 2.0`）以觸發浮點數除法。
  * **選項 A/B/D 錯誤**：皆非引發此問題的原因。
</details>

## Unit 1: Maven 與 `pom.xml` 完整指南：生命週期、依賴管理與 SQA 實務

### [Activity: sqa-u01-maven-ccq1] Maven 生命週期執行順序
#### [CCQ] 工程師在終端機輸入 `mvn package` 指令試圖將專案打包成 JAR 檔。依據 Maven 預設的建置生命週期（Default Lifecycle），下列敘述何者正確？
- Maven 會直接將程式碼打包成 JAR，不會編譯也不會執行單元測試
- Maven 會依序執行 `compile` ➔ `test-compile` ➔ `test`，只有在所有單元測試皆通過（綠燈）的情況下，才會進入 `package` 打包產出 JAR (Correct)
- `package` 階段會在 `test` 階段之前執行，以確保打包失敗時不會浪費時間跑測試
- 只有手動執行 `mvn test` 才會跑測試，`mvn package` 預設完全跳過測試

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：Maven 的生命週期具有相依遞進特性，呼叫特定階段時，Maven 會自動依序執行其前面所有的階段。因此執行 `mvn package` 一定會先執行主程式編譯（`compile`）、測試編譯（`test-compile`）與單元測試（`test`）；若有任何測試失敗，Maven 會立即中斷構建（Build Failure），阻止產生包含缺陷的 JAR 檔。
  * **選項 A/C/D 錯誤**：皆違背 Maven 生命週期的前置順序與品質把關機制。
</details>

### [Activity: sqa-u01-maven-ccq2] 依賴範圍（Scope）與發行環境安全
#### [CCQ] 在 `pom.xml` 中引入單元測試框架（如 JUnit 5）或模擬物件庫（如 Mockito）時，若工程師漏寫了 `<scope>test</scope>`，導致其採用預設的 `<scope>compile</scope>`。從軟體品質與維運安全的角度來看，這會造成何種不良影響？
- 專案完全無法編譯，Maven 會回傳語法錯誤
- 測試程式碼無法引用 JUnit 的 `@Test` 註解
- 測試用程式庫會被打包進正式生產環境（Production）的發行 JAR 檔中，徒增成品體積並擴大潛在資安攻擊面 (Correct)
- CI 伺服器在執行 `mvn test` 時會找不到測試類別

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* **選項 C 正確**：`compile` 是 Maven 的預設範圍，意味著主程式編譯、測試與最終打包發行皆包含此套件。測試專用的程式庫（如 JUnit、Mockito、AssertJ）僅供研發階段檢驗品質使用，若誤打包進生產環境，除了膨脹部署包大小，還可能因測試工具內部開放的反射或偵錯通道引入非預期的安全漏洞。
  * **選項 A/B/D 錯誤**：`compile` 範圍在編譯與測試時皆能正常運作，因此功能上不會報錯，但違反了最小權限與乾淨依賴原則。
</details>

### [Activity: sqa-u01-maven-ccq3] 跳過測試指令的品質風險
#### [CCQ] 在緊急部署修復時，某工程師在 CI/CD 管道中使用 `mvn package -DskipTests` 來加速構建與發布。關於此行為在軟體品質保證 (SQA) 中的評述，何者最為精準？
- 這是業界推薦的最佳實務，因為生產環境只需要可執行檔，不需要測試程式碼
- `-DskipTests` 會編譯測試程式但跳過執行，這代表人為繞過了自動化回歸測試防線，可能將未察覺的回歸缺陷（Regression Bug）直接推上線 (Correct)
- `-DskipTests` 會自動將測試報告全部標記為 100% 通過，並產出完美的 JaCoCo 覆蓋率報告
- `-DskipTests` 會強制刪除所有測試原始碼以節省雲端伺服器磁碟空間

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：`-DskipTests` 雖然能節省測試執行時間，但它直接關閉了最關鍵的「自動化驗證防護網」。在 SQA 體系中，未經測試通過的發行物具有極高風險，除非經過嚴格授權且有替代性驗證，否則在正式 CI/CD 流程中嚴禁預設跳過測試。
  * **選項 A 錯誤**：此舉屬高風險捷徑，非推薦實務。
  * **選項 C/D 錯誤**：跳過測試不會產出執行報告，亦不會刪除程式碼。
</details>

### [Activity: sqa-u01-maven-ccq4] JaCoCo 覆蓋率外掛與品質守門員（Build Breaker）
#### [CCQ] 團隊希望落實品質把關機制：「若單元測試的程式碼涵蓋率（Code Coverage）未達到 80%，Maven 構建必須直接中斷失敗（Build Failure），並拒絕程式碼合併到 `main` 分支」。請問這項覆蓋率門檻檢核應該綁定在 Maven 生命週期的哪一個階段最合適？
- `clean`（清除階段）
- `compile`（主程式編譯階段）
- `verify`（驗證階段，於 `test` 之後執行） (Correct)
- `deploy`（遠端倉庫部署階段）

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* **選項 C 正確**：程式碼涵蓋率必須等單元測試（`test`）全數執行完畢、收集到執行探針數據後才能計算與判定。Maven 的 `verify` 階段專門用於執行整合測試與品質檢查，透過 `jacoco-maven-plugin` 的 `check` goal 綁定至 `verify`，一旦未達標便觸發 Build Breaker 中斷流程。
  * **選項 A/B 錯誤**：此時單元測試根本尚未執行，無法獲得覆蓋率數據。
  * **選項 D 錯誤**：`deploy` 是最後發布階段，此時才檢查為時已晚。
</details>

## Chapter 9: 現代端對端 (E2E) 自動化測試、無頭瀏覽器與高併發模擬 (Modern E2E Testing & Headless Automation)

### [Activity: sqa-ch09-ccq1] Chapter 9: 測試金字塔現代權衡 CCQ 1
#### [CCQ] 在經典「測試金字塔 (Test Pyramid)」模型中，端對端（E2E / UI）測試通常位居塔尖，其測試數量遠少於底層的單元測試（Unit Test）。關於 E2E 測試在現代大型軟體系統中的價值與限制，下列敘述何者最為精準？
- E2E 測試完全沒有價值，現代敏捷團隊應 100% 依賴單元測試與契約測試（Contract Testing）
- E2E 測試最能模擬真實使用者的業務流程與端到端整合驗證，但具有執行速度慢、維護成本高、且容易因網路延遲或 DOM 渲染時序產生「測試脆弱性（Flaky Tests）」的特性 (Correct)
- E2E 測試一旦寫好就不需要任何維護，能保證系統絕對不會發生後端並行競爭或資料庫死鎖
- E2E 測試在 CI/CD 流水線中的執行成本與單元測試完全相同，團隊應追求將所有測試案例升級為 E2E 測試

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：E2E 測試串連了前後端、網路、資料庫與外部依賴，最能直接反映真實使用者的商業價值（Happy Path）。然而，因其涉及瀏覽器渲染、非同步請求與環境狀態，執行耗時常為單元測試的數百倍，且極易因時序不一致產生「有時通過、有時失敗」的測試脆弱性（Flakiness），因此在金字塔中應維持精簡高價值的策略。
  * **選項 A 錯誤**：單元測試無法驗證各元件整合後的端到端行為與真實瀏覽器環境。
  * **選項 C 錯誤**：UI 行為經常迭代，E2E 測試維護代價通常是各測試層級中最高的。
  * **選項 D 錯誤**：若把大量邊界測試全做成 E2E，會導致「冰淇淋甜筒（Ice-Cream Cone）」反模式，造成 CI/CD 執行時間長達數小時且誤報率極高。
</details>

### [Activity: sqa-ch09-ccq2] Chapter 9: 無頭瀏覽器 (Headless Browser) 技術本質 CCQ 2
#### [CCQ] 現代 E2E 測試框架（如 Playwright、Puppeteer、Cypress）在 CI/CD 伺服器上執行時，通常會預設啟用 **無頭模式（Headless Mode）**。關於「無頭瀏覽器」的運作機制與特性，下列敘述何者正確？
- 它只是一個文字介面的 HTTP 爬蟲工具（如 curl），無法解析 CSS 與執行 JavaScript
- 它是一個具備完整排版引擎（Blink/WebKit）與 JavaScript 虛擬機的真實瀏覽器，只是省略了向作業系統 GUI 繪製視窗圖形的開銷，執行速度更快且佔用資源更少 (Correct)
- 無頭瀏覽器無法觸發任何前端滑鼠點擊（click）或鍵盤輸入（keypress）事件
- 無頭瀏覽器因缺少螢幕硬體支援，無法截圖（Screenshot）或錄製操作影片

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：Headless 模式下運行的就是正牌的 Chromium、Firefox 或 WebKit。它擁有完整的 DOM 樹解析、CSS 樣式計算、JavaScript 執行環境與 Cookie/LocalStorage 機制。差別僅在於它不把像素輸出到人類肉眼可見的實體螢幕或作業系統視窗上，因此非常適合在無圖形介面的 Linux 伺服器與 CI/CD 容器中快速執行。
  * **選項 A 錯誤**：curl 只能拿純文字，無頭瀏覽器是真正能完整執行前端 SPA (如 React/Vue) 的瀏覽器。
  * **選項 C/D 錯誤**：無頭瀏覽器完全支援點擊、輸入、甚至透過記憶體幀緩衝區輸出全頁截圖與錄影。
</details>

### [Activity: sqa-ch09-ccq3] Chapter 9: 測試策略選型：UI 自動化 vs. 協定併發 CCQ 3
#### [CCQ] 某線上互動課堂系統（如 NickPocket Edu）即將迎來 100 位學生同時進入活動大廳並在 5 秒內搶答的情境。身為 SQA 工程師，若你的任務是「驗證即時通訊後台（MQTT / WebSocket）在 100 人高併發作答下的負載穩定度與資料一致性」，下列哪一種測試架構方案最符合工程效益與最佳實踐？
- 在測試伺服器上透過 Playwright 同時啟動 100 個無頭 Chrome 視窗，並點擊作答按鈕
- 撰寫輕量化的協定驅動腳本（Protocol-driven Script，如使用 Node.js / Python / k6），直接透過 WebSocket/MQTT 併發連線發送 100 筆模擬作答封包，同時保留單一真實瀏覽器作為觀察者 (Correct)
- 要求 100 位人工測試員坐在電腦前手動點擊，因為自動化程式無法產生真實的網路封包
- 僅撰寫針對單一純函式（Pure Function）的單元測試，無須針對分散式併發進行驗證

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **選項 B 正確**：負載與壓力測試（Load / Stress Testing）的關鍵在於對後端連線、執行緒池與資料庫造成高併發衝擊。若啟動 100 個 Chrome 實例會消耗大量 CPU 與數十 GB 記憶體，容易在測試端（Client）就先因資源耗盡而失真。採用協定驅動（Protocol-driven）腳本能以極低的資源開銷產生百人甚至萬人的真實網路流量，並以單一老師端視窗即時檢驗同步結果，性價比最高。
  * **選項 A 錯誤**：開 100 個 Chrome 瀏覽器會引發測試機本機資源耗盡（Client-side bottleneck）。
  * **選項 C/D 錯誤**：人工手動測試不可重複且成本高昂；純單元測試無法發現真實高併發下的競態條件（Race Condition）。
</details>

### [Activity: sqa-ch09-pair1] 消除測試脆弱性 (Flaky Tests)
#### [Pair] > * **討論任務**：在 E2E 自動化測試實務中，最令人頭痛的就是「在開發者本機執行 100% 成功，但在 GitHub Actions 或 Jenkins CI 上卻偶爾隨機失敗」的**測試脆弱性（Flaky Tests）**。請與鄰近夥伴組成雙人小組，探討：
> 1. **根因探討**：哪些常見的編程壞習慣（例如：依賴固定秒數休眠 `sleep(3000)`、忽視非同步網路延遲、動畫 CSS 尚未播放完畢即點擊、共用測試資料庫污染等）是導致 Flaky Tests 的元兇？
> 2. **工程解方**：現代測試框架（如 Playwright）如何透過「自動等待機制（Auto-waiting）」、「網路請求攔截與等待（waitForResponse）」或「測試環境資料隔離（Isolated Context）」來根除這些隨機失敗？

### [Activity: sqa-ch09-wordcloud1] E2E 測試的最大痛點
#### [WordCloud] 依據你目前對軟體測試與專案開發的體驗，你認為在團隊中推行「端對端 (E2E) 自動化測試」時，面臨的最大挑戰或代價是什麼？請輸入 1~3 個關鍵詞。

### [Activity: sqa-ch09-game] Chapter 9: 現代自動化測試觀念限時搶答
#### [Game] 第 1 題：在編寫 E2E 自動化測試腳本時，當需要等待後端 API 回應渲染按鈕，下列何種做法最符合 SQA 最佳實踐？
- 使用 `time.sleep(5)` 強制等待 5 秒以確保網路絕對回傳
- 使用測試框架提供的顯式等待（Explicit Wait / `waitForSelector`），條件滿足即立刻繼續 (Correct)
- 將測試伺服器網路頻寬限縮為 0，避免非同步並行
- 移除該驗證步驟，只做靜態斷言

<details>
<summary>答案</summary>
**正確答案**：B
</details>

#### [Game] 第 2 題：測試團隊將 80% 的精力都用來寫脆弱易碎的 UI E2E 測試，而底層單元測試覆蓋率不到 10%，這種軟體測試反模式（Anti-pattern）稱作什麼？
- 測試金字塔 (Test Pyramid)
- 測試甜甜圈 (Test Doughnut)
- 冰淇淋甜筒反模式 (Ice-Cream Cone Anti-pattern) (Correct)
- 蜂巢架構 (Testing Trophy)

<details>
<summary>答案</summary>
**正確答案**：C
</details>

#### [Game] 第 3 題：無頭瀏覽器（Headless Browser）透過何種通訊協議與測試框架（如 Puppeteer / Playwright）進行底層溝通與指令派送？
- SMTP 郵件傳輸協定
- Chrome DevTools Protocol (CDP) / WebSocket (Correct)
- FTP 檔案傳輸協定
- POP3 協定

<details>
<summary>答案</summary>
**正確答案**：B
</details>

## Chapter X01: 課程起點與學習背景調查 (Chapter X01: Course Orientation & Survey)

### [Activity: sqa-x01-survey] Chapter X01: SQA 學習起點與軟體開發背景問卷 (5題問卷)
#### [問卷] 第 1 題：請問你目前的就讀年級為何？
- A. 大一 / 大二
- B. 大三
- C. 大四
- D. 碩士班研究生
- E. 博士班 / 其他

#### [問卷] 第 2 題：你評估自己目前的程式開發與專案實作經驗約為何？
- A. 初學階段：修過基礎程式設計，但尚未獨立或團隊完整寫過中大型專案
- B. 課堂作業專案：能完成學期專案或期末專題，熟悉基本語法與函式庫應用
- C. 完整專案開發：具備前後端、資料庫整合或 App 獨立開發經驗，曾參與團隊協作（如 Git）
- D. 實習或產學經驗：有業界實習、接案或參與開源（Open Source）專案的實務經驗
- E. 資深開發者：長期維護中大型專案，具備 CI/CD、自動化部署或微服務架構經驗

#### [問卷] 第 3 題：截至目前為止，你是否有參與開發過「真正部署上線（Production）」並供大眾或外部真實使用者使用的軟體系統？
- A. 是，有參與過商業產品、校級系統或已有大量外部真實用戶（如上架 App、公眾 Web 平台）
- B. 是，有部署至雲端或公開網路，曾給少數外部特定使用者試用（如社團、親友或小規模用戶）
- C. 否，目前僅在本地端（Localhost）或學校展示環境運行過，尚未真正對外正式上線
- D. 否，目前僅有個人練習與課堂作業經驗

#### [問卷] 第 4 題：在你的直覺與目前認知中，下列哪一種描述最符合你心目中對「高品質軟體」的定義？
- A. 使用者滿意的：介面直覺好用、流暢不卡頓、能真正解決使用者的問題
- B. 零缺陷與符合規格：沒有 Bug、完全符合需求規格書的所有功能規定
- C. 卓越與工藝極致：架構優雅、程式碼具備高可讀性與 Clean Code 美感
- D. 高性價比與商業價值：在有限預算與時間內交付最大功能與效益
- E. 內部架構強韌：具備高測試覆蓋率、模組鬆耦合且極易維護與擴展

#### [問卷] 第 5 題：你覺得軟體品質出問題，主要來自哪裡？
- A. 軟體太複雜，雖然知道有錯誤，但不知如改起，越改越錯
- B. 開發時時間太趕，來不及做完整測試，迫於壓力只好上線
- C. 團隊成員能力不足，程式碼寫得錯誤一堆
- D. 缺乏有效的測試流程與自動化工具
- E. 觀念不足，覺得測試很浪費時間，開發才是王道
- F. 主管的監督與品質要求的不足


### [Activity: sqa-x01-ai-survey] Chapter X01: AI Coding 與除錯調查：使用習慣、體驗感受與信任度 (6題問卷)

#### [問卷] 第 1 題：在日常程式開發、專案或課堂作業中，你使用生成式 AI（如 ChatGPT, Claude, GitHub Copilot, Cursor 等）輔助撰寫程式碼（AI Coding）的頻率為何？
- A. 重度依賴：幾乎每次寫程式都會使用，從架構發想、程式碼自動補全到功能實作
- B. 經常使用：每週或大部分作業都會用，主要用於特定演算法、樣板程式碼或加速開發
- C. 偶爾使用：遇到卡關、語法不熟悉或特定問題時才會諮詢
- D. 很少使用：僅初步嘗鮮玩過，目前仍以自行撰寫與查閱官方文件為主
- E. 從未使用：完全沒有在程式開發中使用過生成式 AI 工具

#### [問卷] 第 2 題：當程式遇到錯誤（Bug）、編譯失敗或測試未通過時，你通常如何使用 AI 協助除錯（AI Debugging）？
- A. 第一時間求助：直接複製錯誤訊息（Error / Exception）或程式碼給 AI，請它分析原因並直接提供修正版本
- B. 先自行排查：先自己看 Log、設定中斷點或排查，若卡關一段時間找不出原因才交給 AI 輔助分析
- C. 概念釐清輔助：僅用 AI 解釋看不懂的特殊報錯訊息或底層機制，程式碼的修改依舊由自己手動完成
- D. 幾乎不用於除錯：因為 AI 往往不清楚專案完整上下文，給出的除錯解法經常誤導或越改越錯
- E. 不適用：目前從未在寫程式時使用過 AI

#### [問卷] 第 3 題：綜合你的實際經驗，使用 AI 輔助寫程式與除錯帶給你最顯著的「體驗感受」為何？
- A. 效率倍增神器：大幅節省查詢語法與寫重複性代碼的時間，生產力顯著提升
- B. 雙面刃體驗：雖然能快速給出解答，但常夾雜隱晦錯誤（幻覺），後續排查除錯花費的時間反而更多
- C. 思維依賴與焦慮：不知不覺產生依賴，當沒有 AI 輔助時會感到寫程式變慢，甚至擔心自己基礎功退步
- D. 最佳虛擬助教：像是有耐心且隨問隨答的導師，能以多角度解釋複雜演算法與邏輯，學習成效很好
- E. 感受有限或不滿意：生成的代碼常難以融入專案架構，風格不符規範，體驗並不如預期

#### [問卷] 第 4 題：整體而言，你對 AI 生成的程式碼或提供的修復建議，其「正確性與品質」的信任程度為何？
- A. 高度信任：認為 AI 給的通常都很精準，大多可以直接複製採用，很少懷疑其正確性
- B. 謹慎信任：原則上相信其邏輯方向，但會快速肉眼檢視是否有明顯漏洞後再執行
- C. 批判性信任：抱持懷疑態度，必須自己逐行讀懂、確認完全理解每個細節才會採用
- D. 零信任／僅供參考：完全不信任其代碼品質，僅用來激發靈感或看虛擬碼思路，絕不直接採用
- E. 無法評估：目前使用經驗不足，尚無法判斷其可靠度

#### [問卷] 第 5 題：使用 AI 寫程式後，你會回頭看程式碼嗎？
- A. 會回頭看，且會逐行讀懂、確認完全理解每個細節才會採用
- B. 會簡單看過，確認功能正常即可
- C. 不太會回頭看，覺得 AI 生成的通常沒問題
- D. 幾乎不會回頭看，直接上線

#### [問卷] 第 6 題：使用 AI 寫程式後，你會如何進行測試？
- A. AI 產出的程式碼，我會像自己的程式碼一樣，仔細進行測試，確保功能正常
- B. 雖然不看程式碼，但是我會讓他執行多次，看功能是否如預期
- C. 雖然不看程式碼，但是我會準備很多測試資料和情境，直到全部通過
- D. 不會測試，直接上線
