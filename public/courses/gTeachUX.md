# User Experience Design & AI (使用者體驗設計與 AI)

## Chapter 1: 使用者體驗設計導論 (Introduction to UX)

### [Activity: ux-ch01-ccq1] Chapter 1: 使用者體驗設計導論 (Introduction to UX) CCQ 1
#### [CCQ] 對於使用者而言，UX 決定了系統是否「好用」，而 UI 則決定了系統是否「好看」。兩者相輔相成，缺一不可，共同構築了最終的使用者體驗。請判斷上述說法是否正確？
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* UI (User Interface) 涵蓋資訊架構排版、視覺階層、元件可操作性 (Affordance) 與狀態反饋，並非單純的美工配色。
  * UX (User Experience) 是使用者在全旅程中的主觀心理認知、情感共鳴、滿意度與價值實現，並非單純的「好用」。此說法容易落入「重外觀、輕架構」的簡化迷思。
</details>

### [Activity: ux-ch01-ccq2] Chapter 1: 使用者體驗設計導論 (Introduction to UX) CCQ 2
#### [CCQ] 登入系統的時間過長，是屬於系統架構和效能的問題，與 UX 無關。請參考 ISO 9241-11 對 UX 的定義，判斷上述說法是否正確？
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* ISO 9241-11 的定義中，可用性包含有效性、效率與滿意度。登入過慢直接破壞操作效率並引發焦慮，效能缺陷會直接劣化使用者的整體感知體驗。
  * 架構效能是底層實作手段，而使用者感受到的等待時間與反饋則是核心的 UX 範疇。
</details>

### [Activity: ux-ch01-ccq3] Chapter 1: 使用者體驗設計導論 (Introduction to UX) CCQ 3
#### [CCQ] 以下哪個活動**不算**在 UX 的標準流程中？
- 了解使用者的痛點
- 進行畫面的設計與確認
- 進行市場的分析與調查
- 開發一個雛形進行試用
- 對系統進行壓力測試 (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：E
**解析**：* 壓力測試 (Stress Testing) 屬於後端非功能性工程驗證（測試伺服器並行承載極限），而非評估使用者認知與操作易用性的以人為本 UX 活動。
</details>

### [Activity: ux-ch01-qa1] 問答討論 (QA 1)：分享你的糟糕 UX 體驗
#### [Short] > * **討論任務**：請回想並描述一個你在日常生活中遇過 **UX 最糟糕的系統** （如學校系統、政府網站、點餐 App、售票系統等）： >   1. **系統名稱與使用情境** >   2. **操作時遇到的最大障礙或崩潰瞬間** >   3. **這帶給你什麼心理感受？（困惑、生氣、無助）** >   4. **如果你是設計師，你第一步想如何改善它？**

## Chapter 2: 尼爾森 10 大易用性原則 (Nielsen's 10 Usability Heuristics)

### [Activity: ux-ch02-ccq1] Chapter 2: 尼爾森 10 大易用性原則 (Nielsen's 10 Usability Heuristics) CCQ 1
#### [CCQ] 為了徹底落實錯誤預防，系統在使用者執行「任何」可能修改資料的操作（包括編輯個人暱稱、切換深色模式）時，都強制彈出確認視窗要求點擊「確定修改」，這是兼顧安全性與可用性的最佳實踐？
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 無差別的確認彈窗會誘發「警示疲勞 (Alert Fatigue)」，嚴重破壞 NS03 (使用者控制權) 與 NS07 (使用效率)，讓用戶養成不看內容直接按確定的麻木習慣。
  * 最佳實踐為風險分級：低風險操作採用自動儲存 + Undo 復原機制；唯有高風險、不可逆操作才需二次阻斷確認。
</details>

### [Activity: ux-ch02-ccq2] Chapter 2: 尼爾森 10 大易用性原則 (Nielsen's 10 Usability Heuristics) CCQ 2
#### [CCQ] 為了實現極致簡潔的視覺體驗，將資料表格中的操作按鈕（編輯/刪除/下載）全數隱藏，改為僅在使用者將滑鼠 Hover 懸停於該列時才浮現，這在所有裝置與情境下都是最推薦的做法？
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 在觸控螢幕或行動裝置上缺乏滑鼠 Hover 懸停機制，隱藏按鈕將導致功能無法被觸發。
  * 過度隱藏核心操作違反了 NS06 (易於識別而非記憶)，降低了系統的可發現性 (Discoverability)。
</details>

### [Activity: ux-ch02-ccq3] Chapter 2: 尼爾森 10 大易用性原則 (Nielsen's 10 Usability Heuristics) CCQ 3
#### [CCQ] 電商結帳頁在輸入信用卡時，自動依卡號長度在每 4 碼插入空格（`4111 2222 3333 4444`），並在辨識出卡別後即時於右側點亮 Visa 圖示。這項設計最直接體現了哪兩項原則的結合？
- NS05 (錯誤預防) 與 NS06 (易於識別而非記憶) (Correct)
- NS03 (控制權) 與 NS07 (彈性與使用效率)
- NS04 (一致性) 與 NS09 (清楚的錯誤處理)
- NS08 (優雅簡潔的設計) 與 NS10 (適當的說明與文件)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* NS05 錯誤預防：利用格式化分塊 (Chunking) 將 16 位數字拆解為 4 位一組，降低抄寫與輸錯機率。
  * NS06 易於識別而非記憶：系統自動辨識並點亮卡片 Logo，使用者一眼即可確認是否拿對卡片，無需回憶卡種規則。
</details>

### [Activity: ux-ch02-ccq4] Chapter 2: 尼爾森 10 大易用性原則 (Nielsen's 10 Usability Heuristics) CCQ 4
#### [CCQ] 使用者在 Gmail 內文提及「如附件企劃書」，但在未附加檔案時點擊「傳送」，系統即時攔截並提示：「您提及了附件但未附加檔案，是否仍要傳送？」，並提供「取消」與「直接傳送」。這最直接體現了哪兩項原則的結合？
- NS05 (錯誤預防) 與 NS03 (使用者控制與自由) (Correct)
- NS01 (系統狀態能見度) 與 NS08 (優雅簡潔的設計)
- NS02 (與真實世界對應) 與 NS06 (易於識別而非記憶)
- NS04 (一致性與標準) 與 NS10 (適當的說明與文件)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* NS05 錯誤預防：透過內文語意分析在不可逆操作前主動攔截遺漏附件。
  * NS03 使用者控制與自由：提供「取消」與「直接傳送」兩個出口，尊重使用者的最終自主權。
</details>

### [Activity: ux-ch02-game1] 尼爾森 10 大原則闖關大挑戰 (Game)
#### [Game] **第 1 題：【大檔案上傳與即時回饋】** 使用者在雲端硬碟上傳 1GB 的影片檔，系統在右下角以浮動視窗顯示圓形百分比進度、已上傳容量（如 450MB / 1GB）、即時傳輸速度與預估剩餘時間。這項設計最直接落實了哪一項易用性原則？
- NS01 清楚的系統狀態能見度 (Visibility of System Status) (Correct)
- NS03 使用者控制與自由 (User Control and Freedom)
- NS07 彈性與使用效率 (Flexibility and Efficiency of Use)
- NS08 優雅簡潔的設計 (Aesthetic and Minimalist Design)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：系統在合理時間內提供即時、精確的狀態回饋（進度百分比、剩餘時間），消除使用者的等待焦慮與系統是否凍結的疑慮，完全符合 NS01 (系統狀態能見度)。
</details>
#### [Game] **第 2 題：【實體閱讀隱喻與書架設計】** 電子書閱讀 App 在使用者翻頁時提供紙張翻摺陰影與沙沙紙張翻頁聲，並使用「書籤」、「螢光筆劃記」與「書架」來組織收藏，介面詞彙亦使用讀者熟悉的「章節」、「目錄」而非底層工程術語。這項設計最直接體現了哪一項易用性原則？
- NS01 清楚的系統狀態能見度 (Visibility of System Status)
- NS02 與真實世界對應 (Match Between System and Real World) (Correct)
- NS04 一致性與標準 (Consistency and Standards)
- NS06 易於識別而非記憶 (Recognition Rather Than Recall)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：使用真實實體世界的物件（書架、書籤、紙張質感）與日常概念作為隱喻，使用使用者熟悉的領域語言而非系統工程術語，符合 NS02 (與真實世界對應)。
</details>
#### [Game] **第 3 題：【批次操作的緊急出口】** 使用者在照片管理工具中勾選了 50 張照片並點擊「全數封存」，畫面底部立即彈出 SnackBar 提示：「已封存 50 張照片」，並在旁邊提供明顯的「復原 (Undo)」按鈕，且提供 10 秒的反悔猶豫期。這項設計最直接符合哪一項易用性原則？
- NS02 與真實世界對應 (Match Between System and Real World)
- NS03 使用者控制與自由 (User Control and Freedom) (Correct)
- NS05 錯誤預防 (Error Prevention)
- NS08 優雅簡潔的設計 (Aesthetic and Minimalist Design)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：使用者在誤操作時需要一個清楚標記的「緊急出口 (Emergency Exit)」以撤銷操作返回先前狀態，Undo 復原機制賦予使用者充分的操作安全感，符合 NS03 (使用者控制與自由)。
</details>
#### [Game] **第 4 題：【全站按鈕規範與平台標準】** 某跨平台購物系統在 iOS App 遵循蘋果 HIG 規範將導覽標籤放在底部，在 Web 則遵循常見的頂部 Header 導航；全站無論在哪個頁面，「加入購物車」一律是深橘色按鈕、「立即結帳」一律是綠色按鈕，危險操作一律是紅色文字。這項設計最直接符合哪一項易用性原則？
- NS03 使用者控制與自由 (User Control and Freedom)
- NS04 一致性與標準 (Consistency and Standards) (Correct)
- NS06 易於識別而非記憶 (Recognition Rather Than Recall)
- NS07 彈性與使用效率 (Flexibility and Efficiency of Use)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：兼顧了「外部一致性」（適配平台既有慣例）與「內部一致性」（全站統一顏色編碼與按鈕意圖），讓使用者不需猜測不同文字或按鈕代表的含義，符合 NS04 (一致性與標準)。
</details>
#### [Game] **第 5 題：【新手視覺按鈕與專家快捷鍵】** 現代程式碼編輯器（如 VS Code）為新手提供視覺化的功能選單與側邊欄按鈕，同時為資深工程師提供強大的快捷鍵（如 `Cmd + P` 快速開檔、`Cmd + Shift + L` 多游標編輯），並允許自訂程式碼片段 (Snippets) 與巨集。這項設計最直接符合哪一項易用性原則？
- NS03 使用者控制與自由 (User Control and Freedom)
- NS05 錯誤預防 (Error Prevention)
- NS07 彈性與使用效率 (Flexibility and Efficiency of Use) (Correct)
- NS09 清楚的錯誤處理 (Help Users Recognize, Diagnose, and Recover from Errors)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：系統提供加速鍵 (Accelerators) 與客製化捷徑，同時包容無經驗新手與追求極致速度的高頻率資深用戶，提升操作效率，符合 NS07 (彈性與使用效率)。
</details>
#### [Game] **第 6 題：【AI-UX 概念：1-10-100 品質成本法則】** 開發團隊在專案初期運用 AI 生成前端原型時，即在提示詞中明確定義防呆約束與錯誤復原指引，及早發現並修復體驗瑕疵。相較於系統上線後因使用者客訴才動員十倍人力進行重構修復，這種在前端即落實 UX 的做法最直接體現了哪一項核心定律？
- 摩爾定律 (Moore's Law)
- 1-10-100 品質成本法則 (Cost of Quality Rule) (Correct)
- 阿姆達爾定律 (Amdahl's Law)
- 康威定律 (Conway's Law)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：1-10-100 成本法則指出：在概念/設計階段預防問題成本為 1，在開發階段修正為 10，等到上線維護階段修復則高達 100。透過 AI for UX 在生成原型初期即注入易用性約束，能大幅壓低品質缺陷成本。
</details>
#### [Game] **第 7 題：【AI-UX 提示工程：RTCF 框架中的 UX 約束】** 工程師撰寫提示詞：「你是一位 UI 設計師（Role），請設計電商購物車結帳頁（Task）。**【約束：載入時必須顯示骨架屏 (Skeleton Screen) 消除等待焦慮，且 API 斷線時必須以白話說明並提供重試按鈕，嚴禁僅拋出無說明的狀態碼】**（Constraints），請以 React 輸出（Format）。」請問提示詞中針對 Constraints 的具體要求，最主要是為了確保 AI 生成的介面滿足哪兩項尼爾森原則？
- NS02 (與真實世界對應) 與 NS04 (一致性與標準)
- NS01 (系統狀態能見度) 與 NS09 (清楚的錯誤處理) (Correct)
- NS06 (易於識別而非記憶) 與 NS08 (優雅簡潔的設計)
- NS03 (使用者控制權) 與 NS07 (彈性與使用效率)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：骨架屏提供清晰的加載狀態感知，符合 NS01 (系統狀態能見度)；斷線時以通俗語言說明並提供重試按鈕，符合 NS09 (清楚的錯誤處理)。這正是 RTCF 提示框架中將 UX 易用性指標轉化為 AI 生成約束的標準實踐。
</details>

## Chapter 3: AI for UX — 運用 AI 進行體驗設計與原型打造

### [Activity: ux-ch03-ccq1] Chapter 3: AI for UX — 運用 AI 進行體驗設計與原型打造 CCQ 1
#### [CCQ] 在要求 AI 生成前端資料請求組件時，提示詞明確要求「當 API 發生 500 伺服器錯誤時，必須使用 `try...catch` 捕捉並在控制台輸出 `console.error(err)`」，在軟體工程與 UX 層面上已完整滿足了 NS09（協助辨識與復原錯誤）的要求？
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `console.error` 是開發者除錯工具，對終端使用者完全不可見，使用者只會看到按鈕無反應或畫面卡住。
  * NS09 要求介面層級應呈現白話錯誤說明，並提供重試按鈕或指引。
</details>

### [Activity: ux-ch03-ccq2] Chapter 3: AI for UX — 運用 AI 進行體驗設計與原型打造 CCQ 2
#### [CCQ] 在要求 AI 生成「多步驟註冊表單」時，以下哪一段提示詞最能同時滿足 NS01 (狀態)、NS03 (控制權) 與 NS05 (錯誤預防)？
- 「請用 React + Tailwind 寫一個美觀的註冊表單，支援深色模式。」
- 「提供步驟進度條；每步均有『上一步』且保留資料；欄位 blur 時即時驗證並禁用未過關的『下一步』按鈕。」 (Correct)
- 「表單最後提供送出按鈕，送出失敗時彈出 Toast `Submission failed`。」
- 「使用 LocalStorage 快取所有欄位，並提供一鍵重設按鈕。」

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* NS01 系統狀態能見度：頂部步驟進度條清楚標示當前與整體進度。
  * NS03 使用者控制與自由：隨時提供上一步且保留已填資料，支援自由回溯。
  * NS05 錯誤預防：blur 時即時校驗，未填完必填項時主動禁用下一步按鈕，防止無效送出。
</details>

### [Activity: ux-ch03-qa1] 問答討論 (QA 1)：用 AI 設計辦公室 Web 點餐系統
#### [Short] > * **任務與挑戰**：請使用 AI 輔助設計辦公室 Web 點餐系統，並分享你的提示詞與生成觀察： >   1. **初版生成 vs. UX 優化**：比較「無 Prompt 限制」與「加入尼爾森原則約束」後的程式碼與介面差異。 >   2. **滿足哪些易用性原則**：你的 Master Prompt 中加入了哪些 UX 約束（如 NS01 狀態、NS03 控制權、NS05 錯誤預防）？ >   3. **心得與發現**：AI 生成的 UX 細節是否符合預期？有哪些值得注意的盲點？

### [Activity: ux-ch03-game1] 從 Prompting 到 Agent 典範轉移闖關挑戰 (Game)
#### [Game] **第 1 題：【Chat-based Prompting 的上下文孤島】** 工程師在傳統對話框中輸入「請幫我寫一個符合 NS01 的購物車組件」，AI 給出了一段語法正確的 React 程式碼。然而當工程師複製進專案時，卻發現該組件無法辨識專案既有的 Pinia/Redux 狀態機，CSS 變數亦與全域 Design System 衝突，還缺漏了必要的依賴套件。請問這最能說明傳統對話型 Prompting 的哪一項核心局限？
- 大型語言模型的推理速度過慢
- 上下文孤島 (Context Silo) 與缺乏全專案視野 (Correct)
- 模型欠缺基本的程式碼語法檢查能力
- 對話介面無法輸出超過 50 行的文字

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：傳統 Chat-based AI 缺乏對既有專案結構、狀態管理與全域樣式的感知能力，生成的程式碼片段需要工程師手動拼裝與除錯，形成孤島效應。
</details>
#### [Game] **第 2 題：【Agent 的規劃優先原則 (Planning Mode)】** 當我們指派 AI Agent 一個涉及 5 個前端組件、全站深色模式變數以及結帳狀態機的複雜 UX 重構任務時，一個成熟的 Agentic 協同工作流應該採取的第一步動作為何？
- 立即以多執行緒同時盲目改寫 5 個前端程式碼檔案
- 自動覆寫既有檔案並強制執行 `git push --force` 推送至遠端
- 優先進入規劃模式 (Plan)，主動分析相依性並產出結構化實施計畫書，等待人類審查批准 (Correct)
- 自動關閉終端機並拒絕執行跨檔案操作

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：成熟的 Agent 工作流遵循「規劃優先 (Planning Mode)」與「人機協同 (Human-in-the-Loop)」，先分析跨檔案相依性並產出計畫書，經人類審查確認後才調用工具執行修改。
</details>
#### [Game] **第 3 題：【閉環驗證與自主走查 (Feedback Loop)】** AI Agent 在完成購物車刪除防呆 Modal (NS05) 的前端程式碼改動後，自主調用終端機指令編譯專案、開啟瀏覽器走查工具模擬點擊結帳流程，並在瀏覽器控制台檢測有無未捕捉之 JavaScript 錯誤。請問這項特徵體現了 Agent 與傳統 Prompting 的哪項本質差異？
- 單一對話的提示詞長度能無限擴展
- 外部工具調用與自主閉環走查驗證 (Tool Calling & Feedback Loop) (Correct)
- 取代人類產品經理的所有商業決策
- 完全不需要依賴任何底層大型語言模型

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：Agent 能透過 Tools 控制終端機與瀏覽器，具備執行驗證與捕捉反饋的閉環能力，不再只是被動輸出文字。
</details>
#### [Game] **第 4 題：【人機協同 (Human-in-the-Loop) 的角色演進】** 在現代 Agentic UX 開發模式下，AI Agent 能自主負擔繁重的跨檔案重構、樣式微調與自動化測試驗證。請問在此典範轉移下，人類工程師與設計師最關鍵的核心職責轉變為何？
- 專職手動輸入終端機編譯指令
- 意圖定義、架構審核、關鍵決策批准與最終體驗驗收 (Reviewer & Orchestrator) (Correct)
- 完全退出軟體開發流程，由 AI 獨立交付與部署上線
- 僅負責幫 AI 支付 API 費用與伺服器硬體維護

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：人類在 Agent 時代從低層次的程式碼拼裝者，升級為高層次的系統編排者 (Orchestrator)、架構審核者與最終體驗把關者。
</details>
#### [Game] **第 5 題：【斜線指令實踐：經驗固化 (`/learn`)】** 團隊在協同開發時，發現 Agent 預設常常生成未對齊 Design System 的任意色彩，破壞了介面一致性 (NS04)。若使用 Antigravity IDE，團隊最推薦透過哪一項指令將「一律使用 tokens.css 變數」的決策沉澱為全專案的長期記憶？
- `/goal`
- `/schedule`
- `/learn` (Correct)
- `/plan`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：`/learn` 能將人類反饋與專案最佳實踐固化為專案自訂規則 (Rules/Knowledge)，使後續對話與 Agent 任務自動遵守。
</details>

## Chapter 4: UX for AI — 為 AI 系統設計直覺透明的人機互動

### [Activity: ux-ch04-ccq1] Chapter 4: UX for AI — 為 AI 系統設計直覺透明的人機互動 CCQ 1
#### [CCQ] 在 AI 輔助醫療診斷或智慧報稅系統中，為了建立使用者對 AI 的強大信任感，介面應一律以 100% 篤定的語氣呈現 AI 的分析結果，避免顯示「信心度 (Confidence Score: 68%)」或替代方案，以免引發使用者的懷疑與猶豫？
- 正確 (True)
- 錯誤 (False) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 隱瞞不確定性會誘發危險的「過度信任 (Over-reliance)」，導致使用者盲從潛在幻覺或錯誤。
  * 可解釋性 (XAI) 與信任校準：誠實揭露信心水準與備選方案，才能引導專業人員進行精準的人機協同覆核。
</details>

### [Activity: ux-ch04-ccq2] Chapter 4: UX for AI — 為 AI 系統設計直覺透明的人機互動 CCQ 2
#### [CCQ] 當 AI 執行需耗時 15~20 秒的深度研究（如文獻交叉驗證）時，以下哪一種介面反饋設計最符合現代 UX for AI 的「透明度與等待心理學」？
- 顯示全螢幕單一旋轉 Spinner，註明「運算中請勿關閉」
- 採用動態思考進度（CoT），即時滾動顯示「正在搜尋 12 篇文獻 ➔ 萃取論點 ➔ 驗證數據」，並支援折疊 (Correct)
- 立即顯示空白頁，待全部完成後瞬間重新整理
- 將 Timeout 強制縮短為 3 秒，未完成直接中斷報錯

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 動態思考進度 (Chain-of-Thought) 消除長時間靜態 Spinner 的等待焦慮 (NS01)，給予可預期的進度感。
  * 支援折疊展開兼顧了資訊簡潔與好奇探索的需求 (NS08)。
</details>

### [Activity: ux-ch04-qa1] 問答討論 (QA 1)：全面系統 UX 健檢
#### [Short] > * **任務說明**：請挑選一個你常用的系統進行全方位診斷與優化構想： >   1. **問題診斷**：找出系統中違反 **Nielsen 10 大原則** 的 3 個具體問題。 >   2. **AI Prompt 實踐**：寫出一段具備工程師思維的 Prompt，要求 AI 生成符合該 UX 規範的前端組件。 >   3. **AI 產品優化**：若將該系統升級為 AI 智慧助手，你將如何設計防呆反饋與錯誤復原機制？

## Chapter X01: 工作坊破冰與體驗暖身 (Chapter X01: Workshop Warm-Up)

### [Activity: ux-x01-survey] Chapter X01: 教師數位體驗與 UX 觀察問卷 (4題問卷)
#### [問卷] 第 1 題：身為站在教育第一線的老師，在日常行政、教學或生活中使用各類數位系統時，我對這些系統的使用體驗感到
- A. 非常滿意
- B. 還不錯
- C. 普通
- D. 有待加強
- E. 非常需要改進

#### [問卷] 第 2 題：普遍來說，我覺得學生在設計軟體系統時，對於使用者的體驗設計不夠重視
- A. 非常同意
- B. 同意
- C. 普通
- D. 不同意
- E. 非常不同意

#### [問卷] 第 3 題：最近 AI 盛行，感覺它也有幫助軟體系統的介面與使用者體驗設計，最近軟體使用起來比較順
- A. 同意
- B. 不同意

#### [問卷] 第 4 題：因為教育部計劃的關係，我曾在課堂上講授使用體驗設計的內容
- A. 是
- B. 否
