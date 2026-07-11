# vue-pew

座位分組工具：在 10×10 的座位表上，用顏色把座位分配到不同群組，並可隨機排序組內座位編號（適合抽籤、排順序等情境）。

以 **Vue 3 + Vite + TypeScript** 開發。

🔗 **線上版：<https://malagege.github.io/vue-pew/>**（push 到 `master` 會經由 GitHub Actions 自動建置並發布到 GitHub Pages）

## 功能

- 座位表點擊分組：先選群組，點座位加入該組；再點一次取消，點別組的座位會改分到目前群組
- 群組管理：新增（隨機粉彩色）、刪除、變更顏色、雙擊重新命名
- 隨機分組排序：把每個群組內的座位順序洗牌重新編號
- 自動儲存：分組狀態自動存在瀏覽器（localStorage），重新整理不會消失
- 匯出／匯入：座位表可下載成 JSON 檔備份，也可以從檔案匯入還原
- 清空：一鍵重設所有座位分配
- 自訂座位表大小：列數×欄數可調（1–30），縮小時會自動移除超出範圍的座位
- 深色主題：預設跟隨系統，也可手動切換淺色／深色

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build      # 型別檢查 + 產出 dist/
npm run preview    # 預覽建置結果
```

## 型別檢查

```bash
npm run type-check
```
