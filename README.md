# 打飛機紀錄 / DIY Daily Record

A privacy-first daily record PWA for tracking something private, awkward, and oddly measurable.

這是一個私密優先的日常紀錄 PWA。
它把一件通常不會被記錄的事，做成一個可以記錄、統計、加入排行榜、生成戰績圖的小工具。

這不是成人內容網站，也不是健康建議。
它是一個 Just For Fun 的 vibe coding 作品：低門檻、黑色簡潔、隱私優先、荒謬但乾淨。

## Live Demo

https://diy-daily-record.vercel.app/

## Project Positioning

This project is a small independent web tool built around three ideas:

* local-first private records
* optional public monthly leaderboard
* shareable personal battle card

The core design principle is simple:

> Private records stay on the user's device.
> Only when the user opts into the leaderboard will a public display name and monthly count be sent to Firebase.

## Features

* 18+ age gate
* Local private records
* Optional notes
* Local statistics

  * this month
  * time since last record
  * average gap
  * longest gap
  * recent records
* Optional monthly leaderboard
* Shareable battle card image
* Light / dark mode
* Traditional Chinese / English / Simplified Chinese
* PWA support
* External support link via Ko-fi

## Architecture

| Component               | Role                                       |
| ----------------------- | ------------------------------------------ |
| Vercel                  | Frontend hosting and production deployment |
| Firebase Firestore      | Optional leaderboard aggregation           |
| Firebase Authentication | Account / future cross-device sync         |
| localStorage            | Private local records                      |
| GitHub                  | Source code and deployment trigger         |

## Data Flow

### Private Records

Private records are saved in the browser using `localStorage`.

They may include:

* time
* optional note

They are not sent to Firebase by default.

### Monthly Leaderboard

The leaderboard is opt-in.

When the user chooses to join the leaderboard, the app writes aggregated public data to Firestore:

* `displayName`
* `month`
* `count`
* `updatedAt`

The leaderboard does not store:

* specific record time
* private note
* full local history

## Tech Stack

* Node.js
* Vite
* Vanilla JavaScript
* Firebase Firestore
* Firebase Authentication
* PWA / Service Worker
* Vercel

## Project Structure

```text
.
├── src/
│   ├── main.js
│   ├── firebase.js
│   ├── records.js
│   ├── stats.js
│   ├── leaderboard.js
│   ├── leaderboardSync.js
│   ├── auth.js
│   └── ...
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
├── docs/
│   └── ARCHITECTURE.md
├── index.html
├── about.html
├── terms.html
├── privacy.html
├── vercel.json
├── firebase.json
└── package.json
```

## Local Development

```bash
npm install
npm run dev
```

Preview build:

```bash
npm run build
npm run preview
```

## Deployment

This project uses Vercel as the only official frontend hosting platform.

Recommended deployment flow:

```text
Push to GitHub main branch
↓
Vercel automatically builds and deploys
↓
Production site updates
```

Manual deployment:

```bash
npm run deploy:vercel
```

Firebase Hosting is not used for this project.

## Firebase Notes

Firebase is used only for backend services:

* Firestore leaderboard collection: `monthlyLeaderboard`
* Firebase Authentication
* Firestore security rules

The old `records` and `messages` collections are not used by the current app flow.

Required Firestore composite index:

```text
Collection: monthlyLeaderboard
Fields:
- month ascending
- count descending
```

Firestore rules are maintained separately in:

```text
FIRESTORE_RULES_COMPLETE.txt
```

## Privacy Principle

This project follows a local-first privacy model.

The user can use the core record function without logging in and without sending private records to a server.

Only leaderboard participation sends limited public aggregate data.

## Status

Final optimized version.
Project closed as a completed vibe coding work.
