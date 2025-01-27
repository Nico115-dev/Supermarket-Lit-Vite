import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [],
    build: {
      outDir: './wwwroot/app/',
      sourcemap: true,
    },
    server: {
      host: env.VITE_HOST,
      port: env.VITE_PORT,
    },
    css: {
      preprocessorOptions: {
        css: {
        },
      },
    },
  };
});
