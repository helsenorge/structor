import config from "@helsenorge/eslint-config";

export default [
  ...config,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Relax rules that cause too many false positives in this project
      "react-refresh/only-export-components": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },

  {
    ignores: ["**/__tests__/*", "**/tests/**"],
  },
];
