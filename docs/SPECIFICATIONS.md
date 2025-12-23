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

1. **Main Visual**: 隨機展示 Diesel 圖片與名言。
2. **Daily Motivation**: 每日一句幹話/激勵語錄。
3. **Time-Based Events**:
    - **Resting Popup**: 特定時間跳出的休息提醒。
    - **Off Work Popup**: 下班時間的慶祝彈窗（含音效）。
4. **Mini Games Widget** (New): 左下角懸浮小遊戲中心。

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
