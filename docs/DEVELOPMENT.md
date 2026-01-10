# 開發者指南 (Development Guide)

本文件旨在協助開發者了解專案架構、如何進行本地開發以及部署流程。

## 1. 專案架構 (Architecture)

本專案採用 **React 18** 搭配 **Vite** 進行開發，堅持輕量化與高效能。

### 技術堆疊 (Tech Stack)

- **Runtime**: Node.js (v20+ recommended)
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla CSS (主要於 `App.css` 與 `index.css`)

### 目錄結構說明

```text
dieselchen.win/
├── public/                 # 公開靜態資源
│   ├── 疲憊上班族.gif       # 上班狀態圖片
│   ├── 大家可以回家拉.gif    # 下班狀態圖片
│   └── 吃午餐.gif          # 午休時間圖片
├── src/
│   ├── components/         # React 元件集中地
│   │   ├── BlogLink.jsx    # 技術顧問連結區塊
│   │   ├── DailyMotivation.jsx # 每日躺平激勵小工具
│   │   ├── MainImage.jsx   # 中央狀態圖片顯示 (支援午休時間切換)
│   │   ├── Popup.jsx       # 通用彈出視窗元件 (休息/下班提醒用)
│   │   ├── Quote.jsx       # 中央隨機語錄元件 (午休時隱藏)
│   │   ├── TimerBox.jsx    # 單個倒數計時器元件
│   │   └── MiniGames/      # 小遊戲模組
│   ├── data/
│   │   └── quotes.js       # 全站靜態文字資料 (語錄庫)
│   ├── App.jsx             # 核心商業邏輯 (時間計算、狀態判定、通知功能)
│   ├── App.css             # 應用程式樣式
│   ├── audioUtils.js       # 音效工具函式
│   └── main.jsx            # 程式進入點 (Entry Point)
├── docs/                   # 專案文件
├── vite.config.js          # Vite 設定檔
└── package.json            # 專案依賴定義
```

## 2. 核心邏輯解析

### 時間與狀態管理 (`App.jsx`)

專案的核心在於 `App.jsx` 中的 `useEffect` 定時器：

1. **每秒更新** (`setInterval` 1000ms)：計算當前時間與各班次時間的差異。
2. **狀態判定**：
    - **isWorking**: 只要有任何一個班次處於工作時間內，即判定為上班狀態。
    - **isRestingTime**: 判定是否為 12:00-13:30。
    - **isOffWorkPopupTime**: 判定是否為平日 17:30 後至隔日 07:00。
3. **彈窗控制**：使用 `useState` 控制顯示，並配合 `useRef` 紀錄「本次是否已手動關閉」，避免重複干擾。

### 語錄管理 (`data/quotes.js`)

所有顯示的文字內容均抽離至此檔案，包含：
- `workQuotes`: 上班時的厭世語錄。
- `offworkQuotes`: 下班時的興奮語錄。
- `motivationQuotes`: 右下角的躺平激勵語錄。
**若要新增語錄，直接修改此檔案即可。**

## 3. 本地開發 (Local Development)

### 環境需求

* Node.js (建議 v18 以上)
- npm

### 啟動步驟

1. **Clone 專案**：

    ```bash
    git clone https://github.com/daniel789951/dieselchen.win.git
    cd dieselchen.win
    ```

2. **安裝依賴**：

    ```bash
    npm install
    ```

3. **啟動開發伺服器**：

    ```bash
    npm run dev
    ```

    瀏覽器打開 `http://localhost:5173` 即可看到即時變更。

## 4. 部署流程 (Deployment)

本專案配置為透過 **Cloudflare Pages** 進行自動化部署。

### 部署機制

1. 開發者將程式碼 Push 至 GitHub 的 `main` (或指定) 分支。
2. Cloudflare Pages 透過 GitHub Integration 偵測到 Commit。
3. Cloudflare 執行 Build 指令。

### Cloudflare 設定參數

若需重新設定專案，請確保填寫以下資訊：

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

### 手動 Build (Debug 用)

若需檢查編譯結果：

```bash
npm run build
npm run preview
```

這會產生 `dist` 資料夾並在本地預覽 Production 版本的行為。
