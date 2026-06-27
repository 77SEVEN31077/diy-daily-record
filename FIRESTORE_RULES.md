# Firestore 安全規則（v2 — private-first 重構）

請將 `FIRESTORE_RULES_COMPLETE.txt` 的內容複製到 [Firebase Console → Firestore → Rules](https://console.firebase.google.com/project/diy-daily-record/firestore/rules)。

## 變更摘要

- **`records` collection：完全禁止讀寫**（`allow read, write: if false`），不得使用 `if true`
- **`messages` collection：完全禁止讀寫**
- **`monthlyLeaderboard` collection**（唯一允許的公開寫入）：
  - 公開讀取（排行榜顯示）
  - **僅允許四個欄位**：`displayName`、`month`、`count`、`updatedAt`（`hasOnly` 驗證）
  - 禁止寫入 `time`、`nickname` 等私人紀錄欄位
  - `count` 新建為 1，更新僅允許 +1 或僅改暱稱
  - 禁止刪除
- **其餘路徑預設拒絕**（`match /{document=**}`）

## 前端對應行為

- 私人紀錄（時間、備註）→ 只寫 `localStorage`
- 勾選「加入本月排行榜」→ 才寫入 `monthlyLeaderboard`
- 不向 Firebase 寫入 `records` collection

## 必要 Composite Index

排行榜查詢需要建立索引：

- Collection: `monthlyLeaderboard`
- Fields: `month` Ascending, `count` Descending

若尚未建立，Firebase 會在首次查詢失敗時提供建立連結。

## 部署後請確認

1. Rules 已發布
2. Composite index 已建立
3. 測試勾選「加入本月排行榜」後能否成功寫入
