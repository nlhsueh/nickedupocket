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

## Ch 9: IntelliJ IDEA 介紹與專案設定指南

### [Activity: sqa-u01-game1] IntelliJ IDEA 與 Maven 實戰問答 (Game 1)
#### [Game] **第 1 題：專案目錄與 Git 版本控制規範** 當你在團隊協作中使用 Git 管理 IntelliJ IDEA + Maven 專案時，下列哪一個目錄或檔案**絕對不應該**被 Commit 提交到 Git 儲存庫中？
- `pom.xml`（定義專案相依套件與建置外掛的核心檔案）
- `src/test/java`（存放單元測試與整合測試程式碼的目錄）
- `target/`（Maven 執行編譯與打包所輸出的二進位產物目錄） (Correct)
- `.gitignore`（定義專案排除追蹤清單的設定檔）
#### [Game] **第 2 題：JDK 版本對齊與編譯錯誤排除** 在 IntelliJ IDEA 中載入別人的 Maven 專案時，若編譯器回報 `java: error: release version 21 not supported` 或類別版本不相容的錯誤，最可能的原因與標準排除步驟為何？
- 電腦硬碟空間不足，需刪除作業系統暫存檔後重啟電腦
- `pom.xml` 宣告使用了 Java 21，但 IntelliJ 的 Project SDK 或 Java Compiler Target Bytecode Version 仍設定在較舊版本的 JDK，需至 Project Structure 與 Settings 中對齊版本 (Correct)
- 網路連線中斷導致 Maven 無法連線至中央儲存庫下載依賴
- Java 21 不是 LTS（長期支援）版本，因此 IntelliJ 原生不支援其語法
#### [Game] **第 3 題：安全重構（Refactoring）與最佳實踐** 在 IntelliJ IDEA 中進行程式碼重構時，若要修改一個核心類別（Class）或變數名稱，並確保整個專案所有引用該名稱的地方皆同步安全更新，應該採取哪一種做法？
- 使用全域文字搜尋取代（Replace in Files）直接暴力更換字串
- 在作業系統的檔案總管中手動修改 `.java` 檔名後重新編譯
- 使用 IntelliJ 內建的 `Refactor -> Rename`（快捷鍵 `Shift + F6`），由 IDE 進行語法樹（AST）語意分析並自動同步更新所有引用點 (Correct)
- 直接刪除原類別，重新撰寫一個新類別並手動修改報錯的地方

## Unit 1: IntelliJ IDEA 介紹與專案設定指南

### [Activity: sqa-u01-game1] IntelliJ IDEA 與 Maven 開發實戰搶答
#### [Game] **第 1 題：專案目錄與 Git 版本控制規範** 當你在團隊協作中使用 Git 管理 IntelliJ IDEA + Maven 專案時，下列哪一個目錄或檔案**絕對不應該**被 Commit 提交到 Git 儲存庫中？
- `pom.xml`（定義專案相依套件與建置外掛的核心檔案）
- `src/test/java`（存放單元測試與整合測試程式碼的目錄）
- `target/`（Maven 執行編譯與打包所輸出的二進位產物目錄） (Correct)
- `.gitignore`（定義專案排除追蹤清單的設定檔）

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：`target/` 目錄存放的是 Maven 編譯輸出的 `.class` 檔、打包後的 `.jar` 檔及測試覆蓋率報告，可以透過 `mvn clean` 隨時清除並重新生成。將二進位產物提交至 Git 會導致儲存庫膨脹與嚴重的合併衝突，因此必須在 `.gitignore` 中明確排除。
</details>
#### [Game] **第 2 題：JDK 版本對齊與編譯錯誤排除** 在 IntelliJ IDEA 中載入別人的 Maven 專案時，若編譯器回報 `java: error: release version 21 not supported` 或類別版本不相容的錯誤，最可能的原因與標準排除步驟為何？
- 電腦硬碟空間不足，需刪除作業系統暫存檔後重啟電腦
- `pom.xml` 宣告使用了 Java 21，但 IntelliJ 的 Project SDK 或 Java Compiler Target Bytecode Version 仍設定在較舊版本的 JDK，需至 Project Structure 與 Settings 中對齊版本 (Correct)
- 網路連線中斷導致 Maven 無法連線至中央儲存庫下載依賴
- Java 21 不是 LTS（長期支援）版本，因此 IntelliJ 原生不支援其語法

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：Maven 的 `pom.xml` 宣告與 IntelliJ 的 IDE 設定必須完全對齊。如果 `pom.xml` 指定 Java 21，但 Project SDK 或 Module 的 Target Bytecode Version 停留在舊版（如 11 或 17），編譯器便會拋出版本不支援的錯誤。
</details>
#### [Game] **第 3 題：安全重構（Refactoring）與最佳實踐** 在 IntelliJ IDEA 中進行程式碼重構時，若要修改一個核心類別（Class）或變數名稱，並確保整個專案所有引用該名稱的地方皆同步安全更新，應該採取哪一種做法？
- 使用全域文字搜尋取代（Replace in Files）直接暴力更換字串
- 在作業系統的檔案總管中手動修改 `.java` 檔名後重新編譯
- 使用 IntelliJ 內建的 `Refactor -> Rename`（快捷鍵 `Shift + F6`），由 IDE 進行語法樹（AST）語意分析並自動同步更新所有引用點 (Correct)
- 直接刪除原類別，重新撰寫一個新類別並手動修改報錯的地方

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：IntelliJ 具備強大的 AST 語意分析引擎，使用 `Shift + F6` 重構命名不僅能改檔名，還會自動更新所有 import、方法呼叫與註解引用，避免全域字串取代時誤傷其他同名字串。
</details>
