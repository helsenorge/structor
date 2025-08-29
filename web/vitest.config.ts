import path from "path";

import tsconfigPaths from "vite-tsconfig-paths";
import {
  coverageConfigDefaults,
  defineConfig,
  UserConfigFn,
} from "vitest/config";

export const getConfig: UserConfigFn = async (env) => {
  return {
    plugins: [tsconfigPaths()],
    test: {
      include: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
      ],
      globals: true,
      environment: "jsdom",
      environmentOptions: {
        jsdom: {
          url: "http://tjenester.helsenorge.utvikling",
        },
      },
      setupFiles: ["./setupTests.ts"],
      css: {
        modules: {
          classNameStrategy: "non-scoped",
        },
      },
      coverage: {
        enabled: true,
        reporter: ["cobertura", "lcov", "json"],
        include: ["**/*.test.tsx", "**/*.test.ts"],
        exclude: [
          ...coverageConfigDefaults.exclude,
          "**/__devonly__/**",
          "**/__mocks__/**",
          "**/mocks/**",
        ],
      },
      reporters: ["default", "junit"],
      outputFile: {
        junit: "test-report.xml",
      },
      server: {
        deps: {
          inline: [
            "@helsenorge/designsystem-react",
            "@helsenorge/datepicker",
            "@helsenorge/lightbox",
            "@portabletext/react",
          ],
        },
      },
    },

    resolve: {
      alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
    },
  };
};
export default defineConfig((env) => getConfig(env));
