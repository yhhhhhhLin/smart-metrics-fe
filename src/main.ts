import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue, {Message} from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import router from "./router";
import {createPinia} from "pinia";
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';

import hljs from 'highlight.js';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

VMdPreview.use(createCopyCodePlugin());
VMdPreview.use(createEmojiPlugin());
VMdPreview.use(createLineNumbertPlugin());

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

app.use(VMdPreview);

app.mount('#app');