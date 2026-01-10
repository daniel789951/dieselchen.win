# 專案規格書 (Specifications)

## 專案概述

**專案名稱**: DieselChen.win
**用途**: 個人形象網站 / 趣味互動展示
**風格**: Premium, Weird, High-Energy (Diesel Style)

## 技術架構

### 前端核心

- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla CSS (CSS Modules / Global Styles) with CSS Variables for theming.

### 部署架構 (Deployment)

- **Platform**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **Configuration**: `wrangler.toml` (Cloudflare), `.github/workflows/deploy.yml` (CI)

### 主要功能模組

1. **Main Visual**: 根據時間狀態展示不同 GIF 圖片。
    - 上班時間：疲憊上班族.gif
    - 午休時間 (11:50-13:30)：吃午餐.gif
    - 下班時間：大家可以回家拉.gif
2. **Timer System**: 多班次倒數計時。
    - 正常班 (8:50-17:30)
    - 金控班 (9:00-18:00)
3. **Quote System**: 根據狀態顯示語錄。
    - 上班語錄（午休時間隱藏）
    - 下班語錄
4. **Daily Motivation**: 每日一句幹話/激勵語錄（右下角）。
5. **Time-Based Events**:
    - **Lunch Time Display** (11:50-13:30): 午休時間顯示吃午餐 GIF，語錄隱藏。
    - **Resting Popup** (12:00-13:30): 午休提醒彈窗。
    - **Off Work Popup** (17:30-次日07:00): 下班時間的慶祝彈窗（含音效與動畫）。
    - **Clock Out Notification** (17:30): 桌面推播提醒打卡下班。
6. **Mini Games Widget**: 左下角懸浮小遊戲中心。
    - 輪盤遊戲
    - 老虎機
    - 飛鏢遊戲
7. **Blog Links**: 技術顧問連結（右上角）。
    - 安顧問：https://blog.giveanornot.com/
    - 達顧問：https://www.starnight.one/

## 資料結構

- `src/data/quotes.js`: 語錄資料庫。
- `src/assets/`: 圖片與音效資源。

## 瀏覽器相容性

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- RWD 支援 Mobile / Tablet / Desktop

---

## 部署說明 (Deployment Guide)

本專案使用 Cloudflare Pages 進行靜態網站託管。

## 自動化部署 (CI/CD)

每當代碼 push 到 `main` 分支時，GitHub Actions 會自動觸發構建與部署流程。

1. **Checkout Code**
2. **Setup Node.js**
3. **Install Dependencies** (`npm ci`)
4. **Build** (`npm run build`)
5. **Deploy to Cloudflare Pages**

## 手動部署 (Local)

若需手動部署，請確保已安裝 wrangler CLI。

```bash
npm run build
npx wrangler pages deploy dist
```
