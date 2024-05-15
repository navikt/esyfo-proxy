import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptParser from "@typescript-eslint/parser";
import eslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      typescriptEslint: eslintPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
