# Vercel 部署說明

## 部署步驟

1. 如果還沒有登入 Vercel，請先執行：
   ```bash
   npx vercel login
   ```

2. 登入後，執行部署命令：
   ```bash
   npx vercel --prod
   ```

3. 或者如果已經配置過項目，可以直接：
   ```bash
   npx vercel --prod --yes
   ```

## 注意事項

- 首次部署需要登入 Vercel 帳號
- 部署後 Vercel 會提供一個網址
- 如果需要自訂網域，可以在 Vercel Dashboard 中設定
