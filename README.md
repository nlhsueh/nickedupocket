# 🎓 NickPocket Edu - Interactive Classroom System

[![Deploy to GitHub Pages](https://github.com/nlhsueh/nickedupocket/actions/workflows/deploy.yml/badge.svg)](https://github.com/nlhsueh/nickedupocket/actions/workflows/deploy.yml)

NickPocket Edu 是一套專為大學課堂設計的輕量級互動教學系統，支援 **CCQ（觀念檢核題）**、**即時投票（Poll）**、**限時搶答（Game）**、**文字雲（WordCloud）**、**流程排序（Ordering）** 與 **簡答討論（QA）**。

系統基於純靜態前端架構（React + Vite）與 WebSockets MQTT 即時廣播通訊，免架設專屬後端伺服器，直接託管於 GitHub Pages。

* 🌐 **線上系統入口**：[https://nlhsueh.github.io/nickedupocket/](https://nlhsueh.github.io/nickedupocket/)
* 📱 **學生端加入**：`https://nlhsueh.github.io/nickedupocket/#/student/<roomCode>`
* 👨‍🏫 **老師端大廳/投影控制**：`https://nlhsueh.github.io/nickedupocket/#/teacher/<roomCode>`

---

## 📌 單一事實來源原則 (Single Source of Truth, SSOT)

所有互動題目均以 **`gTeach<Course>/Lecture/source/ch*.md`** 講義來源檔為唯一標準。
透過自動化同步工具 `scripts/sync_ccq.py`，能自動完成：
1. 解析講義中的互動題目並輸出至 `nickedupocket/public/courses/gTeach<Course>.md`。
2. 自動生成學生手機掃碼用的 QR Code 圖片（儲存於 `<Course>/img/chXX/<act_id>.png`）。
3. 自動將專屬 HTML 註解 ID（`<!-- id: ... -->`）、[線上作答] 連結與 QR Code 嵌入回講義與投影片原始檔。

---

## 📐 講義撰寫「互動題規則」手冊 (Authoring Rules)

### 1. 統一前綴 Emoji
為了讓講義 Markdown 結構清晰、易於檢索與管理，**所有互動題標題統一以 `🙋`（舉手互動）開頭**。

---

### 2. 題型標題關鍵字對照表

| 題型名稱 | 推薦標題寫法（任選一種皆可自動辨識） | 互動機制與呈現方式 |
| :--- | :--- | :--- |
| **觀念檢核 (CCQ)** | `### 🙋 CCQ: 題目`<br>`#### 🙋 概念核對問答 (CCQ 1)`<br>`### 🙋 觀念檢核: 題目` | 選擇題（A~E）/ 是非題，含標準答案與詳解。學生作答後顯示即時票數長條圖；停止後高亮正確答案。 |
| **即時投票 (Poll)** | `### 🙋 Poll: 題目`<br>`### 🙋 投票: 題目` | 無標準答案（純意見/經驗調查）。學生即時看到全班百分比分佈圖。 |
| **限時搶答 (Game)** | `### 🙋 Game: 題目`<br>`### 🙋 搶答: 題目` | 支援 15~20 秒倒數計時，依答題速度計算分數（越快越準越高分），產出排行榜。 |
| **文字雲 (WordCloud)** | `### 🙋 WordCloud: 題目`<br>`### 🙋 文字雲: 題目` | 學生輸入 1~3 個短詞彙，前端自動聚合詞頻並動態呈現文字雲。 |
| **流程排序 (Ordering)** | `### 🙋 Ordering: 題目`<br>`### 🙋 排序: 題目` | 學生端可透過拖曳/按鈕排列步驟先後順序，送出後比對標準正確順序。 |
| **問答討論 (QA)** | `### 🙋 QA: 題目`<br>`### 🙋 簡答: 題目` | 學生輸入文字簡答，老師端與學生端以即時卡片留言牆呈現。 |

---

## 💡 各題型 Markdown 撰寫標準範例

### 範例 1：觀念檢核 (CCQ) / 選擇題（含解析）
```markdown
### 🙋 CCQ: 下列何者不是白箱測試技術？
- A. 敘述涵蓋 (Statement Coverage)
- B. 邊界值分析 (Boundary Value Analysis)
- C. 分支涵蓋 (Branch Coverage)
- D. 路徑涵蓋 (Path Coverage)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：邊界值分析屬於黑箱測試技術，其餘皆為基於程式碼結構的白箱測試。
</details>
```

### 範例 2：觀念檢核 (CCQ) / 是非題
```markdown
### 🙋 CCQ: 測試的目的在於證明程式中沒有任何錯誤，請判斷上述說法是否正確？
- 正確 (True)
- 錯誤 (False)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：測試只能證明程式「存在缺陷」，而無法證明「完全沒有缺陷」（Edsger Dijkstra 原則）。
</details>
```

### 範例 3：即時投票 (Poll) —— 無標準答案
```markdown
### 🙋 投票: 大家在期末專題中，最常使用的前端或 UI 設計工具是？
- A. Figma
- B. Adobe XD
- C. Sketch
- D. 直接手刻 HTML/CSS
- E. 其他 / 手繪草圖
```

### 範例 4：文字雲 (WordCloud) —— 純文字輸入
```markdown
### 🙋 文字雲: 請用一到三個詞彙，形容你認為「好 UX」的核心特質？
```

### 範例 5：流程排序 (Ordering) —— 數字有序列表
```markdown
### 🙋 排序: 請將軟體測試生命週期（STLC）依執行先後順序排列：
1. 需求分析 (Requirement Analysis)
2. 測試計畫 (Test Planning)
3. 測試案例設計 (Test Case Design)
4. 測試執行 (Test Execution)
5. 缺陷追蹤與測試報告 (Defect Reporting)
```

### 範例 6：討論簡答 (QA)
```markdown
### 🙋 簡答: 請簡述你對 TDD（測試驅動開發）「紅燈-綠燈-重構」循環的核心理解？
```

---

## 🛠️ 同步工具操作指令 (Sync Guide)

同步工具位於專案根目錄的 `scripts/sync_iActivity.py`，支援自動掃描、QR Code 生成與 Markdown 嵌入。

### 1. 同步單一課程
```bash
# 在專案根目錄 (gTEACH) 下執行：
python3 scripts/sync_iActivity.py --course gTeachSQA
python3 scripts/sync_iActivity.py --course gTeachUX
python3 scripts/sync_iActivity.py --course gTeachPython
python3 scripts/sync_iActivity.py --course gTeachASE
```

### 2. 一鍵同步所有課程
```bash
python3 scripts/sync_iActivity.py --all
```

### 3. 常用參數說明
* `--course <dir>`：指定課程目錄（如 `gTeachSQA`）。
* `--all`：掃描並同步所有 `gTeach*` 課程。
* `--no-qr`：跳過生成 QR Code PNG 圖片。
* `--no-embed`：不自動修改回講義與投影片（僅產出 NickPocket 題庫檔）。

---

## 🗂️ 課程與檔案對應關係 (Course Mapping)

| 課程目錄名稱 | 課程中文/英文全名 | 題庫產出路徑 | 題目代號前綴 (Slug) |
| :--- | :--- | :--- | :---: |
| **`gTeachSQA`** | Software Testing & Quality Assurance (軟體品質與測試) | `nickedupocket/public/courses/gTeachSQA.md` | `sqa` |
| **`gTeachASE`** | Advanced Software Engineering (進階軟體工程) | `nickedupocket/public/courses/gTeachASE.md` | `ase` |
| **`gTeachPython`** | Python Programming (Python 程式設計) | `nickedupocket/public/courses/gTeachPython.md` | `python` |
| **`gTeachUX`** | User Experience Design & AI (使用者體驗設計與 AI) | `nickedupocket/public/courses/gTeachUX.md` | `ux` |

---

## 🚀 部署與本機開發

### 本機啟動開發伺服器
```bash
cd nickedupocket
npm install
npm run dev
```

### 建置生產版本
```bash
npm run build
```
GitHub Actions 會在每次 `push` 到 `main` 分支時，自動執行打包並發布至 GitHub Pages。
