import { defineConfig, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    strictPort: true,
    // core-js se reutiliza desde la raíz del monorepositorio.
    fs: { allow: [searchForWorkspaceRoot(process.cwd()), '..'] },
  },
});
