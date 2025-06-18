import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 개발 서버 설정
  server: {
    port: 5173,
    host: true, // Docker 컨테이너에서 외부 접근 허용
    strictPort: true,
  },
  
  // 빌드 설정
  build: {
    outDir: 'dist',
    sourcemap: false, // 프로덕션에서 소스맵 비활성화
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // 청크 분할로 로딩 성능 최적화
        manualChunks: {
          // vendor 라이브러리들을 별도 청크로 분리
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react', 'react-icons'],
          utils: ['axios', 'lodash', 'uuid']
        }
      }
    },
    // 청크 크기 경고 제한 상향 조정
    chunkSizeWarningLimit: 1000,
  },
  
  // 환경변수 타입 정의
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // 경로 별칭 설정
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@api': '/src/api',
      '@utils': '/src/utils',
      '@store': '/src/store',
      '@types': '/src/types',
    }
  },
  
  // CSS 설정
  css: {
    devSourcemap: false, // CSS 소스맵 비활성화
  },
  
  // 최적화 설정
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@reduxjs/toolkit',
      'react-redux'
    ]
  }
});
