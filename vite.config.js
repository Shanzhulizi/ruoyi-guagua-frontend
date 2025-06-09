// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vite.config.js
export default defineConfig({
  plugins: [vue()],
  server: {
    // port: 3000, // 修改前端端口为3000，避免与后端冲突
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // 添加代理日志，方便调试
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Proxy] 转发请求: ${req.method} ${req.url}`);
          });
        },
      },
    },
  },
});