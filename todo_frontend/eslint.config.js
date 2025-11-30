// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default [
  // JS/TS の基本推奨
  js.configs.recommended,
  ...tseslint.configs.recommended, // 型情報なしでも動く推奨

  // 型情報ありのルールも有効化したい場合は ↓ に切り替え
  // ...tseslint.configs.recommendedTypeChecked,
  // { languageOptions: { parserOptions: { project: ["./tsconfig.json"] } } },

  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      // stylistic を "フォーマッタ" 的に使う
      "@stylistic": stylistic,
      // (任意) import 並べ替え
      ...(true && { "simple-import-sort": await import("eslint-plugin-simple-import-sort").then(m => m.default || m) }),
    },
    rules: {
      "@stylistic/indent": ["error", 4],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/max-len": ["warn", { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];
