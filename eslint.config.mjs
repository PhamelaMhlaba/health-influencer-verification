import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add CSS-specific rules to handle Tailwind directives
  {
    files: ["**/*.css"],
    languageOptions: {
      parser: false,
    },
    rules: {
      // This will prevent ESLint from trying to lint CSS files
      // which should resolve the unknown at-rule errors
    }
  }
];

export default eslintConfig;
