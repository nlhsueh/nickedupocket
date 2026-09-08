/**
 * gasMailer.js
 * 整合 Google Apps Script (GAS) Web App 進行自動/點擊寄送成果報表
 */

export const DEFAULT_RECIPIENT = 'nlhsueh@gmail.com';
export const GAS_SECRET_TOKEN = 'nick_pocket_secret_2026';
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwSgbE0FhvB_nvsbHDZrZQ7pBH4IncKCr8uUtFEaiY3ge_VjK5GvQ7fII9LpYY-3H7hPA/exec';

/**
 * 發送報表至 Google Apps Script Webhook
 */
export async function sendReportViaGAS({ gasUrl, payload }) {
  if (!gasUrl) {
    throw new Error('請先設定 Google Apps Script Webhook 網址');
  }

  // 包裝完整的 Payload，包含 Secret Token 與收件人
  const bodyData = {
    token: GAS_SECRET_TOKEN,
    recipient: DEFAULT_RECIPIENT,
    ...payload,
    timestamp: new Date().toISOString()
  };

  // Google Apps Script 的 Web App 跨網域 POST
  // 透過 text/plain 送出可避開某些瀏覽器的 Preflight 阻擋，GAS 的 e.postData.contents 均可正常解析
  const response = await fetch(gasUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(bodyData)
  });

  if (!response.ok) {
    throw new Error(`伺服器回應錯誤 (HTTP ${response.status})`);
  }

  const result = await response.json().catch(() => ({ status: 'ok' }));
  if (result.error) {
    throw new Error(result.error);
  }

  return result;
}

/**
 * 提供老師直接貼到 Google Apps Script 的完整後端腳本程式碼
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * NickPocketEdu 專屬成果報表發信 Webhook
 * 部署指引：
 * 1. 在 Google Drive 新增「Google Apps Script」
 * 2. 清空原本內容，貼上本段程式碼
 * 3. 點擊右上角「部署」->「新增部署作業」
 * 4. 類型選擇「Web 應用程式」
 * 5. 設定：
 *    - 說明：NickPocketEdu Mailer
 *    - 執行身分：我 (您的帳號)
 *    - 誰可以存取：所有人 (Anyone)
 * 6. 點擊「部署」，授權存取後複製「Web 應用程式網址」
 */

const SECRET_TOKEN = "nick_pocket_secret_2026";
const TARGET_EMAIL = "nlhsueh@gmail.com";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ error: "No post data received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);

    // 1. 安全檢查：驗證 Secret Token
    if (data.token !== SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Invalid Secret Token" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. 準備信件內容
    const activityTitle = data.title || "課堂活動";
    const roomCode = data.roomCode || "";
    const dateStr = data.date || new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
    const responsesCount = data.responsesCount || 0;
    const onlineCount = data.onlineCount || 0;
    const summaryHtml = data.summaryHtml || "";
    const csvContent = data.csvContent || "";
    const csvFilename = data.csvFilename || (activityTitle + "_成果統計.csv");

    const subject = "[NickPocketEdu] 課堂活動成果報告：" + activityTitle + " (" + dateStr + ")";

    let bodyHtml = '<div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">';
    bodyHtml += '<div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 18px 24px; border-radius: 8px; color: white; margin-bottom: 20px;">';
    bodyHtml += '<h2 style="margin: 0; font-size: 20px;">' + activityTitle + '</h2>';
    bodyHtml += '<p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 13px;">NickPocketEdu 課堂互動成果報告</p>';
    bodyHtml += '</div>';

    bodyHtml += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">';
    bodyHtml += '<tr><td style="padding: 8px; color: #64748b;"><strong>活動代碼：</strong></td><td style="padding: 8px; font-weight: bold; color: #4f46e5;">' + roomCode + '</td></tr>';
    bodyHtml += '<tr><td style="padding: 8px; color: #64748b;"><strong>統計時間：</strong></td><td style="padding: 8px;">' + dateStr + '</td></tr>';
    bodyHtml += '<tr><td style="padding: 8px; color: #64748b;"><strong>回收份數：</strong></td><td style="padding: 8px; font-weight: bold; color: #10b981;">' + responsesCount + ' 份</td></tr>';
    bodyHtml += '<tr><td style="padding: 8px; color: #64748b;"><strong>在線人數：</strong></td><td style="padding: 8px;">' + onlineCount + ' 人</td></tr>';
    bodyHtml += '</table>';

    if (summaryHtml) {
      bodyHtml += '<div style="margin-top: 15px; border-top: 1px solid #cbd5e1; padding-top: 15px;">';
      bodyHtml += summaryHtml;
      bodyHtml += '</div>';
    }

    bodyHtml += '<div style="margin-top: 25px; padding: 12px; background-color: #f1f5f9; border-radius: 6px; font-size: 12px; color: #64748b; text-align: center;">';
    bodyHtml += '📎 附件已隨信附上完整的 CSV 試算表（包含每位學生填答明細與選項統計），可直接使用 Excel 開啟。';
    bodyHtml += '</div>';
    bodyHtml += '</div>';

    // 3. 準備附件 CSV
    const attachments = [];
    if (csvContent) {
      const csvBlob = Utilities.newBlob(csvContent, "text/csv;charset=utf-8", csvFilename);
      attachments.push(csvBlob);
    }

    // 4. 發送郵件（鎖定發送給 TARGET_EMAIL）
    MailApp.sendEmail({
      to: TARGET_EMAIL,
      subject: subject,
      htmlBody: bodyHtml,
      attachments: attachments
    });

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Email sent to " + TARGET_EMAIL 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      error: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
