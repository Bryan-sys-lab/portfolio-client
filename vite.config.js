import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // ✅ ensure this is exactly '/' or './'
  plugins: [react()],
});
