import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { ElDialog } from 'element-plus';
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './firebase' // 确保 Firebase 初始化
import './assets/form.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.component(ElDialog.name || 'ElDialog', ElDialog);

app.mount('#app')