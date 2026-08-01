/**
 * TripLedger 寫入 Google 試算表用
 *
 * 部署方式：
 *   1. 開啟試算表 → 擴充功能 → Apps Script
 *   2. 刪除預設 Code.gs 內容，貼上此檔內容後儲存
 *   3. 右上角「部署」→「新增部署」→ 選「網頁應用程式」
 *      - 執行身分：我
 *      - 誰能存取：任何具備 Google 帳戶的使用者（或「任何人」）
 *   4. 部署後複製「網頁應用程式」網址，填入專案 .env.local 的 SHEET_APPEND_URL
 *
 * 工作表「A」欄位：A=日期 B=時間 C=品項 D=類型 E=金額 F=地點 G=圖片
 * 新紀錄依序往下新增一行。
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('A');
  if (!sheet) {
    return error_('找不到工作表 A，請確認試算表中有名為「A」的工作表');
  }

  var data = JSON.parse(e.postData.contents);

  var row = [
    data.date, // A 日期  例: 2026/07/30
    data.time, // B 時間  例: 18:09:31
    data.item, // C 品項
    data.type, // D 類型
    data.amount, // E 金額  例: NT$787
    data.location, // F 地點（線下為 GPS、線上為平台）
    data.image // G 圖片  例: ./IMG/xxx.png
  ];

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, name: 'TripLedger' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function error_(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
