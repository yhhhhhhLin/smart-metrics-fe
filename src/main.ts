import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import router from "./router";


const app = createApp(App);
// arco-design组件库
app.use(ArcoVue);
app.use(router)

app.mount('#app');