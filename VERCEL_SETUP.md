# 🚀 Vercel 自動部署設置指南

> **架構說明：** 網站只部署在 Vercel；Firebase 僅提供 Firestore / Auth。見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## ✅ 已完成

1. ✅ 代碼已推送到 GitHub：`https://github.com/77SEVEN31077/diy-daily-record.git`
2. ✅ `vercel.json` 已配置構建設置

## 📋 Vercel 部署方式

### 方式一：通過 Vercel 網站連接（推薦）

1. **訪問 Vercel 網站**
   - 前往：https://vercel.com
   - 使用 GitHub 帳號登入

2. **導入項目**
   - 點擊 "Add New..." → "Project"
   - 選擇 GitHub 倉庫：`77SEVEN31077/diy-daily-record`
   - 或直接訪問：https://vercel.com/new

3. **配置構建設置**（Vercel 會自動檢測，但請確認）
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
   - **Root Directory:** `./` (留空)

4. **環境變數**（如果需要）
   - 目前不需要額外的環境變數

5. **部署**
   - 點擊 "Deploy"
   - Vercel 會自動構建並部署

6. **自動部署**
   - 之後每次推送到 `main` 分支，Vercel 會自動重新部署

### 方式二：使用 Vercel CLI

如果已經有 Vercel 項目，可以通過 CLI 連接：

```bash
# 1. 登入 Vercel
npx vercel login

# 2. 連接項目（如果還沒有）
npx vercel link

# 3. 部署
npx vercel --prod
```

## 🔍 檢查部署狀態

### 在 Vercel 網站上
1. 訪問：https://vercel.com/dashboard
2. 找到您的項目：`diy-daily-record`
3. 查看部署歷史和狀態

### 通過 CLI
```bash
npx vercel ls
```

## ⚙️ 項目設置確認

在 Vercel 項目設置中，確認以下配置：

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node.js Version:** 18.x 或更高（自動檢測）

## 🎯 部署 URL

部署成功後，您會獲得：
- **生產環境：** `https://diy-daily-record.vercel.app`（或您的自定義域名）
- **預覽環境：** 每次推送會生成新的預覽 URL

## 📝 注意事項

1. **首次部署可能需要幾分鐘**
   - Vercel 需要安裝依賴和構建項目

2. **如果構建失敗**
   - 檢查構建日誌
   - 確認 `package.json` 中的腳本正確
   - 確認 `vercel.json` 配置正確

3. **自動部署**
   - 推送到 `main` 分支會觸發生產部署
   - 推送到其他分支會創建預覽部署

## 🆘 常見問題

### Q: 構建失敗？
A: 
1. 檢查 Vercel 構建日誌
2. 確認 Node.js 版本（建議 18+）
3. 確認所有依賴都在 `package.json` 中

### Q: 找不到 dist 目錄？
A: 
1. 確認 Build Command 是 `npm run build`
2. 確認 Output Directory 是 `dist`
3. 檢查構建日誌是否有錯誤

### Q: 如何更新部署？
A: 
- 只需推送到 GitHub，Vercel 會自動部署
- 或手動觸發：在 Vercel 項目中點擊 "Redeploy"
