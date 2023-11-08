import { createApp } from 'vue' // 用以創建一個應用實體
import App from './App.vue' // 創建一個根元件
import router from './router'
import Set from './components/Set.vue'
import Item from './components/Item.vue'
import List from './components/List.vue'

const app = createApp(App) // 放入根元件，創造出一個應用實體
app.component('Set', Set)
app.component('Item', Item)
app.component('List', List)

app.use(router)

app.mount('#app')
