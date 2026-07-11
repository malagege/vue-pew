# vue-pew

座位分組工具：在 10×10 的座位表上，用顏色把座位分配到不同群組，並可隨機排序組內座位編號（適合抽籤、排順序等情境）。

以 **Vue 3 + Vite + TypeScript** 開發。

## 功能

- 座位表點擊分組：先選群組，點座位加入該組；再點一次取消，點別組的座位會改分到目前群組
- 群組管理：新增（隨機粉彩色）、刪除、變更顏色、雙擊重新命名
- 隨機分組排序：把每個群組內的座位順序洗牌重新編號

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
