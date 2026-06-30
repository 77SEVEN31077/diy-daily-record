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

排行榜查詢需要建立索引（Firestore Console → Firestore Database → Indexes → Composite indexes）：

| 項目 | 值 |
|------|-----|
| Collection ID | `monthlyLeaderboard` |
| Field 1 | `month` — Ascending |
| Field 2 | `count` — Descending |
| Query scope | Collection |

**不要**使用 `records`、`leaderboard`、`monthly-leaderboard` 等其他 collection 名稱。

若 Console 出現 `The query requires an index` 或錯誤碼 `failed-precondition`，請點錯誤訊息中的連結建立索引，並等待狀態變為 **Enabled**。

前端 Console 若顯示 `hint: MISSING_FIRESTORE_INDEX`，代表需要完成上述步驟。

## 部署後請手動確認（Firebase Console）

1. Firebase **projectId** 必須是 `diy-daily-record`。
2. Firestore **Rules** 必須已 **Publish**，內容與 `FIRESTORE_RULES_COMPLETE.txt` 一致。
3. **monthlyLeaderboard** composite index（`month` Asc + `count` Desc）必須建立並 **Enabled**。
4. Firestore Database 必須不是停用狀態。
5. 若有 App Check enforcement，須確認 Web app 已正確配置；否則先不要強制 App Check。
