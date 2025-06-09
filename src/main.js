import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/global.css';

// ✅ 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(router);
app.mount('#app');
app.use(ElementPlus)  // ← 加这一行


// main.js 或单独的axios配置文件
import axios from 'axios';

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    console.log('[请求拦截器]', config.url, config);
    return config;
  },
  (error) => {
    console.error('[请求错误]', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log('[响应拦截器]', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[响应错误]', error);
    return Promise.reject(error);
  }
);


// // 所有请求自动携带 token
// axios.interceptors.request.use(config => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = 'Bearer ' + token
//   }
//   return config
// })
