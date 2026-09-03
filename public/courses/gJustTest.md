# JustTest 互動題型完整測試課程 (Interactive Test Suite)

## Chapter 1: 基礎互動題型 (CCQ, Pair, Poll, Game)

### [Activity: test-ch01-ccq] Chapter 1: 概念檢核 CCQ 題型測試
#### [CCQ] 依據軟體工程標準定義，軟體測試最核心的目標為何？
- 證明程式碼已經 100% 完美且毫無任何缺陷
- 儘早發現缺陷、評估品質風險並提供品質決策依據 (Correct)
- 提高程式碼編譯與封裝打包的執行速度
- 完全取代人工程式碼審查（Code Review）工作

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：Edsger Dijkstra 指出：「測試只能證明缺陷的存在，無法證明完全沒有缺陷。」因此測試的核心在於暴露風險與評估品質。
</details>

### [Activity: test-ch01-pair] Chapter 1: 雙人討論 Pair Discussion 題型測試
#### [Pair] 雙人討論：微服務架構與單體架構的測試挑戰
請與鄰近夥伴組成雙人小組，討論並簡述：
1. 微服務架構相比於傳統單體架構，在進行「整合測試（Integration Testing）」與「端對端測試（E2E Testing）」時面臨哪些最棘手的痛點？
2. 你們會建議團隊導入哪些測試策略或工具（例如：契約測試 Contract Testing、Service Virtualization 等）來降低測試成本？

### [Activity: test-ch01-poll] Chapter 1: 即時投票 Poll 題型測試
#### [Poll] 在你目前的日常開發或專案中，最常使用的主要程式語言是？
- A. Python (包含數據分析、AI、後端)
- B. Java / Kotlin (Spring Boot、Android)
- C. JavaScript / TypeScript (Node.js、React、Vue)
- D. Go (微服務、雲原生系統)
- E. C / C++ / Rust (底層系統、高效能運算)

### [Activity: test-ch01-game] Chapter 1: 限時搶答 Game 錦標賽 (多題連續競速)
#### [Game] 第 1 題：下列何者「不是」白箱測試（White-box Testing）技術？
- 敘述涵蓋 (Statement Coverage)
- 邊界值分析 (Boundary Value Analysis) (Correct)
- 分支涵蓋 (Branch Coverage)
- 條件路徑涵蓋 (Path Coverage)

<details>
<summary>答案</summary>
**正確答案**：B
</details>

#### [Game] 第 2 題：測試發現了 10 個缺陷並全數修復，代表軟體中已不存在任何潛在缺陷？
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>答案</summary>
**正確答案**：B
</details>

#### [Game] 第 3 題：將品質保證活動儘早移至軟體生命週期前端執行的實踐稱作什麼？
- Shift-Right Testing
- Shift-Left Testing (Correct)
- Big-Bang Testing
- Monkey Testing

<details>
<summary>答案</summary>
**正確答案**：B
</details>

---

## Chapter 2: 文字與流程題型 (WordCloud, Ordering, Short)

### [Activity: test-ch02-wordcloud] Chapter 2: 文字雲 WordCloud 題型測試
#### [WordCloud] 請輸入 1~3 個詞彙，形容你心目中「卓越軟體工程師」最重要的特質？

### [Activity: test-ch02-ordering] Chapter 2: 流程排序 Ordering 題型測試
#### [Ordering] 請將軟體測試生命週期（STLC）依標準執行先後順序排列：
1. 需求分析 (Requirement Analysis)
2. 測試計畫擬定 (Test Planning)
3. 測試案例設計 (Test Case Design)
4. 測試環境建置 (Test Environment Setup)
5. 測試執行與缺陷報告 (Test Execution & Reporting)
6. 測試結案與總結評估 (Test Cycle Closure)

### [Activity: test-ch02-short] Chapter 2: 簡答問答 Short QA 題型測試
#### [Short] 請簡述你對測試驅動開發（TDD）「紅燈-綠燈-重構」循環的核心理解與價值？

### [Activity: test-ch02-survey] Chapter 2: 課程回饋問卷調查 (3題連續問卷)
#### [問卷] 第 1 題：你覺得目前課程內容的難易度與教學步調如何？
- A. 太難，觀念較深需要更多範例拆解
- B. 稍微偏難，但課後複習尚可吸收
- C. 剛好適中，符合學習預期
- D. 稍微簡單，希望能補充更深入主題

#### [問卷] 第 2 題：你認為課堂中最有助於釐清觀念的互動形式為何？
- A. 觀念檢核 CCQ 與即時統計解析
- B. 雙人討論 Pair Discussion 與全班成果牆
- C. 限時搶答 Game 錦標賽
- D. 上機實驗操作與程式碼走查

#### [問卷] 第 3 題：整體而言，你對這門課的學習收穫滿意度為？
- A. 非常滿意 (5 顆星)
- B. 滿意 (4 顆星)
- C. 普通 (3 顆星)
- D. 尚有進步空間 (2 顆星以下)

## Chapter X01: 課堂隨堂評量 (Chapter X01: In-Class Assessment)

### [Activity: test-x01-ccq] Chapter X01: 核心觀念檢核 CCQ
#### [CCQ] 在物件導向設計中，SOLID 原則中的「S」代表下列何者？
- Single Responsibility Principle (單一職責原則) (Correct)
- System Scalability Principle (系統擴展性原則)
- Software Security Principle (軟體安全原則)
- Service Separation Principle (服務分離原則)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：S 代表 Single Responsibility Principle，主張一個模組或類別應僅有一個引起其變更的原因。
</details>

### [Activity: test-x01-pair] Chapter X01: 技術選型雙人討論
#### [Pair] 雙人討論：關聯式資料庫（RDBMS）與 NoSQL 資料庫的架構抉擇
請與鄰近同學組成雙人組，針對以下情境討論並提交結論：
在電商系統中，「使用者訂單與交易紀錄」與「商品瀏覽歷史與購物車暫存」，應分別採用何種資料庫儲存策略？請說明理由。

### [Activity: test-x01-poll] Chapter X01: 開發工具習慣投票
#### [Poll] 進行團隊開發時，你們目前最偏好或使用的分支管理策略（Git Branching Strategy）為何？
- A. Git Flow (包含 develop, feature, release, hotfix 等分支)
- B. GitHub Flow (以 main 為核心，透過 short-lived feature branch 與 PR 合併)
- C. Trunk-Based Development (主幹開發，搭配 Feature Flags 頻繁合併)
- D. GitLab Flow (結合環境分支如 pre-production、production)

## Chapter X02: 實務研討與期末回饋 (Chapter X02: Workshop & Feedback)

### [Activity: test-x02-wordcloud] Chapter X02: 敏捷心態文字雲
#### [WordCloud] 請輸入 1~3 個關鍵詞，代表你認為「敏捷團隊最核心的文化特質」？

### [Activity: test-x02-survey] Chapter X02: 模組化學習成效問卷 (2題連續問卷)
#### [問卷] 第 1 題：你對本章節實作練習的掌握程度評估為何？
- A. 完全掌握，能夠獨立設計並排除異常
- B. 大致掌握，參照講義範例可順利完成
- C. 部分理解，需要更多實例說明
- D. 尚未掌握，希望能安排課後輔導

#### [問卷] 第 2 題：後續章節你最期待深入探討的主題是？
- A. 微服務與分散式系統測試架構
- B. AI 輔助自動化生成測試案例與 Mocking
- C. 容器化 CI/CD Pipeline 測試整合
- D. 高並發效能壓測與瓶頸定位 (JMeter / k6)
