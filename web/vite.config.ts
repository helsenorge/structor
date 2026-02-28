import dns from "dns";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import url from "node:url";

import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

import type { PluginOption } from "vite";
// https://vitejs.dev/config/

// localhost part
dns.setDefaultResultOrder("verbatim");

export default () => {
  return defineConfig({
    base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === "production" ? "/static_skjemabygger/" : "/"),

    test: {
      coverage: {
        reporter: ["text", "lcov"], // Generates lcov.info and prints text summary
        reportsDirectory: "./web/coverage", // Ensure this matches your SonarQube configuration
        exclude: ["**/__tests__/**", "**/public/**", "**/mocks/**"], // Optional
      },
    },
    plugins: [removeCrossOriginAttr(), react(), svgr(), reactVirtualized()],
    server: {
      port: 3000,
    },
    build: {
      outDir: "dist",
      manifest: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ["node_modules"],
        },
      },
    },
    resolve: {
      alias: [
        {
          // this is required for the SCSS modules
          find: /^~(.*)$/,
          replacement: "$1",
        },
        { find: "src", replacement: path.resolve(__dirname, "src") },
      ],
    },
  });
};

const removeCrossOriginAttr = () => {
  return {
    name: "no-attribute",
    transformIndexHtml(html: string) {
      return html.replace(`type="module" crossorigin`, `type="module"`);
    },
  };
};

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
        import.meta.url,
      );
      const file = reactVirtualizedFilePath.replace(
        path.join("dist", "commonjs", "index.js"),
        path.join("dist", "es", "WindowScroller", "utils", "onScroll.js"),
      );
      const code = await fs.readFile(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      await fs.writeFile(file, modified);
    },
  };
}
