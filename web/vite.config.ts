import { PluginOption } from "vite";

import { defineConfig } from 'vitest/config';

import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import legacy from '@vitejs/plugin-legacy';
// https://vitejs.dev/config/

import dns from 'dns';
// localhost part
dns.setDefaultResultOrder('verbatim');

export default () => {

    return defineConfig({
      base: process.env.NODE_ENV === 'production' ? '/static_skjemabygger/' : '/',
    
      plugins: [removeCrossOriginAttr(), react(  {include: '**/*.{jsx,tsx}'}), svgr(), reactVirtualized(), legacy({
        targets: ['defaults', 'not IE 11'],
      }), ],
      server: {
        port: 3000,
      },
      build: {
        outDir: 'dist',
        manifest: true,
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
      test: {
        coverage: {
          reporter: ['cobertura', 'text'],
        },
        reporters: ['json', 'verbose', 'vitest-sonar-reporter'],
        outputFile: {
          json: './report/my-json-report.json',
          'vitest-sonar-reporter': './sonar-report.xml',
        },
      
      },
      
      css: {
        preprocessorOptions: {
          scss: {
            includePaths: ['node_modules']
          }
        }
      },
      resolve: {
        alias: [
            {
                // this is required for the SCSS modules
                find: /^~(.*)$/,
                replacement: '$1',
            },
        ],
      },
      optimizeDeps:{
        esbuildOptions:{
          plugins:[
            esbuildCommonjs(['react-router-dom', 'react-s3'],)
          ]
        }
      }
    });
}



const removeCrossOriginAttr = () => {
  return {
    name: "no-attribute",
    transformIndexHtml(html) {
      return html.replace(`type="module" crossorigin`, `type="module"`);
    }
}
}



import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

function reactVirtualized(): PluginOption {
  return {
    name: "flat:react-virtualized",
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved: async () => {
      const require = createRequire(import.meta.url);
      const reactVirtualizedPath = require.resolve("react-virtualized");
      const { pathname: reactVirtualizedFilePath } = new url.URL(
        reactVirtualizedPath,
        import.meta.url
      );
      const file = reactVirtualizedFilePath.replace(
        path.join("dist", "commonjs", "index.js"),
        path.join("dist", "es", "WindowScroller", "utils", "onScroll.js")
      );
      const code = await fs.readFile(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      await fs.writeFile(file, modified);
    },
  };
}
