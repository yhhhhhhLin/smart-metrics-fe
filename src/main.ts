import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue, {Message} from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import router from "./router";
import {createPinia} from "pinia";
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'




// 挂载到全局
const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);
// arco-design组件库
app.use(ArcoVue);
app.config.globalProperties.$message = Message;
app.use(router)
app.use(pinia)
app.use(ArcoVueIcon)
app.mount('#app');