import path from 'path';

import { defineConfig } from 'vitest/config';

import { getConfig } from '@helsenorge/core-build/vitest.config';

export default defineConfig(async env => {
  const config = await getConfig(env);
  console.log('config', config);
  const testFiles = config?.test?.setupFiles || [];
  return {
    ...config,
    resolve: {
      alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
    },
    test: {
      ...config.test,
      setupFiles: [...testFiles, './setupTests.ts'],
      globals: true,
      include: ['**/*.test.tsx', '**/*.test.ts'],
      coverage: {
        reporter: ['cobertura', 'json'],
      },
    },
  };
});
