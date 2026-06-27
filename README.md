# 打飛機紀錄

私密優先的日常紀錄 PWA，使用 Node.js + Vite 構建。

## 架構速覽

| 元件 | 用途 |
|------|------|
| **Vercel** | 網站前端部署（**唯一正式 Hosting**） |
| **Firebase** | Firestore（排行榜）、Authentication（帳號）— **不作網站 Hosting** |
| **localStorage** | 私人紀錄預設保存在使用者本機 |
| **GitHub** | 原始碼倉庫，推送後觸發 Vercel 自動部署 |

完整說明見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## 技術棧

- **Node.js + Vite** — 建置與開發
- **Vanilla JavaScript** — 前端模組
- **Firebase** — Firestore、Authentication（後端服務）
- **PWA** — Service Worker、manifest

## 專案結構

```
.
├── src/                    # 源碼
│   ├── main.js             # 入口
│   ├── firebase.js         # Firebase 初始化
│   ├── auth.js             # 登入 / 註冊
│   ├── records.js          # 本機紀錄
│   ├── stats.js            # 本地統計
│   ├── leaderboard.js      # 排行榜讀取
│   ├── leaderboardSync.js  # 排行榜 opt-in 寫入
│   └── ...
├── public/                 # 靜態資源（manifest、service-worker、icons）
├── docs/
│   └── ARCHITECTURE.md     # 架構與部署說明
├── index.html
├── vercel.json             # Vercel 建置設定
├── firebase.json           # 歷史檔（Hosting 未使用；規則見 FIRESTORE_RULES_*.md）
└── package.json
```

## 開發

```bash
npm install
npm run dev       # 開發伺服器 http://localhost:3000
npm run build     # 輸出 dist/
npm run preview   # 預覽建置結果
```

## 部署

**本專案網站只部署到 Vercel，不使用 Firebase Hosting。**

### 自動部署（推薦）

將 GitHub 倉庫連接 Vercel 後，推送到 `main` 即自動建置部署。詳見 [VERCEL_SETUP.md](VERCEL_SETUP.md)。

### 手動部署

```bash
npm run deploy:vercel
```

需已安裝並登入 [Vercel CLI](https://vercel.com/docs/cli)。

### Firebase 後台（非網站部署）

在 [Firebase Console](https://console.firebase.google.com/) 維護：

- **Firestore 安全規則** — 見 `FIRESTORE_RULES_COMPLETE.txt`
- **Authentication** — Email/密碼登入
- **Composite Index** — `monthlyLeaderboard`：`month` ↑、`count` ↓

請勿執行 `firebase deploy` 部署網站；`package.json` 已停用 `deploy:firebase` script。

## 功能模組

- **本機紀錄** — 時間、備註保存在 `localStorage`
- **本地統計** — 距離上次、本月次數、平均間隔、最近 10 筆
- **排行榜** — opt-in 後同步至 Firestore `monthlyLeaderboard`
- **跨裝置同步** — Firebase Auth（進階，開發中）
- **主題 / 語言** — 淺色深色、繁中 / 英文 / 簡中

## 注意事項

- Firebase 設定在 `src/firebase.js`
- 部署前請確認 `npm run build` 成功
- 架構與資料流詳見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
