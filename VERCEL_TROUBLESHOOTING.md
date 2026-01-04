# Vercel 部署問題排除指南

## ❌ 問題：Project "diy-daily-record" already exists

### 原因
Vercel 的專案名稱在**整個帳號內是全域唯一**的，即使你刪除了舊專案：
- 名稱可能被保留一段時間（防止誤刪）
- 或者在其他團隊/組織下有同名專案
- 或者刪除操作尚未完全生效

### ✅ 解決方案

#### 方案 1：使用不同的專案名稱（推薦）

在建立專案時，使用一個**全新的名稱**：

**建議的命名方式：**
- `diy-daily-record-app`
- `daily-record-vercel`
- `diy-daily-record-v2`
- `daily-record-2024`
- `77seven-daily-record`（使用你的 GitHub 用戶名）

**步驟：**
1. 在 Vercel 建立專案時
2. 在 **Project Name** 欄位輸入新名稱
3. 完成部署

#### 方案 2：檢查並徹底刪除舊專案

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 檢查所有專案列表（包括不同團隊下的專案）
3. 找到所有 `diy-daily-record` 相關的專案
4. 進入每個專案的 **Settings** → **General**
5. 滾動到底部，點擊 **Delete Project**
6. 確認刪除
7. 等待 5-10 分鐘後再試

#### 方案 3：檢查團隊/組織

1. 在 Vercel Dashboard 左上角檢查當前團隊
2. 切換到不同的團隊/組織
3. 檢查是否有同名專案
4. 如果有，刪除或使用不同的名稱

### 💡 重要提醒

- **專案名稱不影響功能**：無論專案名稱是什麼，網站功能都一樣
- **網址可以自訂**：部署後可以在 Settings → Domains 設定自訂網域
- **建議使用描述性名稱**：例如 `daily-record-app` 比 `diy-daily-record` 更清楚

### 🔍 如何確認專案名稱是否可用

在 Vercel 建立專案時：
- 如果名稱可用，不會顯示錯誤
- 如果名稱已存在，會立即顯示紅色錯誤訊息
- 建議在輸入名稱時，Vercel 會即時驗證

### 📝 其他常見問題

#### Q: 刪除專案後多久可以重用名稱？
A: 通常需要等待一段時間（可能幾小時到幾天），建議直接使用新名稱。

#### Q: 專案名稱可以修改嗎？
A: 可以，在專案的 Settings → General → Project Name 中可以修改。

#### Q: 專案名稱會影響網址嗎？
A: 會影響預設的 Vercel 網址（例如：`your-project-name.vercel.app`），但可以設定自訂網域。

