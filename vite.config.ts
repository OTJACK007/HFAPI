@@ .. @@
 export default defineConfig({
+  base: '/',
   define: {
     global: 'window',
   },
   plugins: [react()],
   build: {
+    outDir: 'dist',
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom', 'react-router-dom'],
         },
       },
     },
   },
   optimizeDeps: {
     exclude: ['lucide-react'],
   },
+  server: {
+    port: 3000,
+    proxy: {
+      '/api': {
+        target: 'https://api.humanface.xyz',
+        changeOrigin: true,
+        secure: true
+      }
+    }
+  }