import config from "@helsenorge/eslint-config";

export default [
  ...config,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Relax rules that cause too many false positives in this project
      "react-refresh/only-export-components": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "src/**/tests/**"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/display-name": "off",
    },
  },
  {
    ignores: ["*config.*", "**/node_modules/**", "src/libs/markdown-editor/**"],
  },
];
