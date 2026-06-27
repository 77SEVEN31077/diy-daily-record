# 🚀 部署指南 - Node.js 架構更新

> **2025 更新：** 本專案網站**只部署至 Vercel**。Firebase 僅作 Firestore / Auth，不作 Hosting。請以 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 與 [README.md](README.md) 為準。

## 📋 需要上傳/提交的文件

### 如果是使用 Git（推薦）

**新增的文件（需要提交）：**
```
✅ package.json          # 項目配置
✅ package-lock.json     # 依賴鎖定文件
✅ vite.config.js        # Vite 配置
✅ .gitignore           # Git 忽略規則
✅ src/                  # 整個 src 目錄（所有源代碼）
✅ public/               # 整個 public 目錄（靜態資源）
✅ NODEJS_SETUP.md       # 設置文檔（可選）
✅ DEPLOYMENT_GUIDE.md   # 本文件（可選）
```

**修改的文件：**
```
✅ index.html            # 已簡化，移除內聯代碼
✅ firebase.json         # 已更新指向 dist/ 目錄
✅ README.md             # 已更新（可選）
```

**不需要提交的文件：**
```
❌ node_modules/         # 依賴包（會自動安裝）
❌ dist/                 # 構建輸出（會自動生成）
```

### Git 提交命令

```bash
# 1. 查看變更
git status

# 2. 添加所有新文件
git add package.json package-lock.json vite.config.js .gitignore
git add src/
git add public/
git add index.html firebase.json

# 3. 提交
git commit -m "feat: 轉換為 Node.js + Vite 架構，代碼模組化"

# 4. 推送到遠程倉庫
git push
```

## 🔧 部署前準備

### 1. 安裝依賴（如果在新環境）

```bash
npm install
```

### 2. 構建生產版本

```bash
npm run build
```

這會生成 `dist/` 目錄，包含所有構建後的文件。

## 🌐 部署步驟

> **注意：** 以下「Firebase 部署」章節已停用。正式環境請只使用 Vercel。

### ~~方式一：Firebase 部署~~（已停用）

本專案不使用 Firebase Hosting。請勿執行 `firebase deploy`。

### 方式一：Vercel 部署（正式環境）

```bash
# 方法 1：使用 npm 腳本（推薦）
npm run deploy:vercel

# 方法 2：手動部署
npm run build
vercel --prod
```

### 方式二：Vercel 自動部署（如果已連接 Git）

如果您的 Vercel 項目已連接到 Git 倉庫，推送代碼後會自動部署。

**重要：** 需要在 Vercel 項目設置中配置構建命令：
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## ⚠️ 注意事項

1. **首次部署前必須構建**
   - 運行 `npm run build` 生成 `dist/` 目錄
   - Firebase 和 Vercel 會從 `dist/` 目錄讀取文件

2. **環境要求**
   - Node.js 版本：建議 16.x 或更高
   - npm 版本：建議 8.x 或更高

3. **如果部署失敗**
   - 檢查 `dist/` 目錄是否存在
   - 確認 `firebase.json` 中的 `public` 字段指向 `dist`
   - 檢查構建是否有錯誤：`npm run build`

## 📝 快速檢查清單

部署前確認：

- [ ] 已運行 `npm install` 安裝依賴
- [ ] 已運行 `npm run build` 構建成功
- [ ] `dist/` 目錄已生成且包含文件
- [ ] `firebase.json` 中的 `public` 指向 `dist`
- [ ] 所有新文件已提交到 Git（如果使用）
- [ ] 已運行部署命令

## 🆘 常見問題

### Q: 部署後網站沒有更新？
A: 
1. 清除瀏覽器緩存
2. 檢查 `dist/` 目錄是否是最新構建
3. 確認部署命令執行成功

### Q: 構建失敗？
A: 
1. 確認已安裝所有依賴：`npm install`
2. 檢查 Node.js 版本：`node -v`（建議 16+）
3. 查看錯誤訊息並修復

### Q: Firebase 部署找不到文件？
A: 
1. 確認 `firebase.json` 中 `public: "dist"`
2. 確認已運行 `npm run build`
3. 檢查 `dist/` 目錄是否存在

## ✅ 完成後驗證

部署完成後，訪問您的網站確認：
- [ ] 網站正常顯示
- [ ] 主題切換功能正常
- [ ] 語言切換功能正常
- [ ] 登入/註冊功能正常
- [ ] 記錄功能正常
- [ ] 排行榜正常顯示
