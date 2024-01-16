# Training Keeper - 動滋小管家
![](https://i.imgur.com/h7lUc6T.png)
## 簡介
是一款使用 Vue.js 開發的網頁應用程式，是 WeHelp Bootcamp 的個人獨立專案。透過其巧妙設計的使用者介面和使用者體驗，它能夠協助記錄運動歷程。以下是一些功能和技術細節，包括：

- 使用 Vue.js ver3 的 composition API 進行開發。
- 使用 Vue Router 建立單頁應用程式（SPA），並導入了 PWA 技術，可直接安裝於裝置桌面上，實現媲美原生移動應用程式的優雅使用者體驗，
- 採用 Vue.js 的內建元件轉場效果，以實現更順暢的使用者體驗。
- 當取得了 MySQL 中的所有數據後，透過 Vue.js 的 ```props``` 或 ```provide/inject``` API 傳遞給元件。此外，這些數據一旦在本地端有異動之後，會由最上層的元件統一地進行 ```POST``` 或 ```PATCH``` 操作。
- 運用 Chart.js 實現圖表功能，以視覺方式呈現運動進展。同時，所有圖表都被包裝成 Vue.js 元件，以實現更優雅的開發體驗。

## 技術堆疊
### 前端  
- Sass
- Vue.js (ver.3 composition API)  
- Vue router
- Vite
- Chart.js
- RWD
- PWA
### 後端 & 資料庫
- Express.js
- MySQL
- AWS EC2
- Nginx

## 特色功能展示
✨ 新增運動項目時的建議提示  
  
  ![](https://i.imgur.com/wi4rdHF.gif)

✨ 自動代入上一組紀錄 
   
  ![](https://i.imgur.com/BIndUoK.gif)

✨ 可直觀地調整數值  
  
  ![](https://i.imgur.com/C6FHCMD.gif)
 
✨ 留言給合作教練  
  
  ![](https://i.imgur.com/5BqXTf7.gif)

✨ 乾淨俐落的 Dashboard（含搜尋與 sorting 功能）  
  
  ![](https://i.imgur.com/AAW3jD6.gif)

✨ 一鍵生成運動數據統計圖  
  
  ![](https://i.imgur.com/efddDil.gif)