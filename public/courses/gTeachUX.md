# User Experience Design & AI (使用者體驗設計與 AI)

## Chapter 1: 使用者體驗設計導論 (Introduction to UX)

### [Activity: ux-ch01-ccq1] Chapter 1 CCQ 1
#### [CCQ] 對於使用者而言，UX 決定了系統是否「好用」，而 UI 則決定了系統是否「好看」。兩者相輔相成，缺一不可，共同構築了最終的使用者體驗。請判斷上述說法是否正確？
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: ux-ch01-ccq2] Chapter 1 CCQ 2
#### [CCQ] 登入系統的時間過長，是屬於系統架構和效能的問題，與 UX 無關。請參考 ISO 9241-11 對 UX 的定義，判斷上述說法是否正確？
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: ux-ch01-ccq3] Chapter 1 CCQ 3
#### [CCQ] 以下哪個活動**不算**在 UX 的標準流程中？
- 了解使用者的痛點
- 進行畫面的設計與確認
- 進行市場的分析與調查
- 開發一個雛形進行試用
- 對系統進行壓力測試 (Correct)

## Chapter 2: 尼爾森 10 大易用性原則 (Nielsen's 10 Usability Heuristics)

### [Activity: ux-ch02-ccq1] Chapter 2 CCQ 1
#### [CCQ] 為了徹底落實錯誤預防，系統在使用者執行「任何」可能修改資料的操作（包括編輯個人暱稱、切換深色模式）時，都強制彈出確認視窗要求點擊「確定修改」，這是兼顧安全性與可用性的最佳實踐？
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: ux-ch02-ccq2] Chapter 2 CCQ 2
#### [CCQ] 為了實現極致簡潔的視覺體驗，將資料表格中的操作按鈕（編輯/刪除/下載）全數隱藏，改為僅在使用者將滑鼠 Hover 懸停於該列時才浮現，這在所有裝置與情境下都是最推薦的做法？
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: ux-ch02-ccq3] Chapter 2 CCQ 3
#### [CCQ] 電商結帳頁在輸入信用卡時，自動依卡號長度在每 4 碼插入空格（`4111 2222 3333 4444`），並在辨識出卡別後即時於右側點亮 Visa 圖示。這項設計最直接體現了哪兩項原則的結合？
- NS05 (錯誤預防) 與 NS06 (易於識別而非記憶) (Correct)
- NS03 (控制權) 與 NS07 (彈性與使用效率)
- NS04 (一致性) 與 NS09 (清楚的錯誤處理)
- NS08 (優雅簡潔的設計) 與 NS10 (適當的說明與文件)

### [Activity: ux-ch02-ccq4] Chapter 2 CCQ 4
#### [CCQ] 使用者在 Gmail 內文提及「如附件企劃書」，但在未附加檔案時點擊「傳送」，系統即時攔截並提示：「您提及了附件但未附加檔案，是否仍要傳送？」，並提供「取消」與「直接傳送」。這最直接體現了哪兩項原則的結合？
- NS05 (錯誤預防) 與 NS03 (使用者控制與自由) (Correct)
- NS01 (系統狀態能見度) 與 NS08 (優雅簡潔的設計)
- NS02 (與真實世界對應) 與 NS06 (易於識別而非記憶)
- NS04 (一致性與標準) 與 NS10 (適當的說明與文件)

## Chapter 3: AI for UX — 運用 AI 進行體驗設計與原型打造

### [Activity: ux-ch03-ccq1] Chapter 3 CCQ 1
#### [CCQ] 在要求 AI 生成前端資料請求組件時，提示詞明確要求「當 API 發生 500 伺服器錯誤時，必須使用 `try...catch` 捕捉並在控制台輸出 `console.error(err)`」，在軟體工程與 UX 層面上已完整滿足了 NS09（協助辨識與復原錯誤）的要求？
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: ux-ch03-ccq2] Chapter 3 CCQ 2
#### [CCQ] 在要求 AI 生成「多步驟註冊表單」時，以下哪一段提示詞最能同時滿足 NS01 (狀態)、NS03 (控制權) 與 NS05 (錯誤預防)？
- 「請用 React + Tailwind 寫一個美觀的註冊表單，支援深色模式。」
- 「提供步驟進度條；每步均有『上一步』且保留資料；欄位 blur 時即時驗證並禁用未過關的『下一步』按鈕。」 (Correct)
- 「表單最後提供送出按鈕，送出失敗時彈出 Toast `Submission failed`。」
- 「使用 LocalStorage 快取所有欄位，並提供一鍵重設按鈕。」

## Chapter 4: UX for AI — 為 AI 系統設計直覺透明的人機互動

### [Activity: ux-ch04-ccq1] Chapter 4 CCQ 1
#### [CCQ] 在 AI 輔助醫療診斷或智慧報稅系統中，為了建立使用者對 AI 的強大信任感，介面應一律以 100% 篤定的語氣呈現 AI 的分析結果，避免顯示「信心度 (Confidence Score: 68%)」或替代方案，以免引發使用者的懷疑與猶豫？
- 正確 (True)
- 錯誤 (False) (Correct)

### [Activity: ux-ch04-ccq2] Chapter 4 CCQ 2
#### [CCQ] 當 AI 執行需耗時 15~20 秒的深度研究（如文獻交叉驗證）時，以下哪一種介面反饋設計最符合現代 UX for AI 的「透明度與等待心理學」？
- 顯示全螢幕單一旋轉 Spinner，註明「運算中請勿關閉」
- 採用動態思考進度（CoT），即時滾動顯示「正在搜尋 12 篇文獻 ➔ 萃取論點 ➔ 驗證數據」，並支援折疊 (Correct)
- 立即顯示空白頁，待全部完成後瞬間重新整理
- 將 Timeout 強制縮短為 3 秒，未完成直接中斷報錯
