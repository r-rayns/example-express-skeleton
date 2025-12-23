import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Give vite the ability to resolve paths using the path mapping in tsconfig
  ],
  root: './src',
  test: {
    environment: 'node',
    coverage: {
      reportsDirectory: '../coverage',
    },
  },
});
