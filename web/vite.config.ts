
import { defineConfig, mergeConfig, UserConfigFn } from 'vitest/config';
import path from 'path';

// https://vitejs.dev/config/

import config from '@helsenorge/core-build/vite.config';
import dns from 'dns';
// localhost part
dns.setDefaultResultOrder('verbatim');
const viteConfig = config as UserConfigFn;
export default  defineConfig(async configEnv => mergeConfig(await viteConfig(configEnv), {
      base: process.env.NODE_ENV === 'production' ? '/static_skjemabygger/' : '/',
      server: {
        port: 3000,
      },

      resolve: {
        alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
      },
    }));