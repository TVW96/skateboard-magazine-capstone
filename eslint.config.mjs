import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import css from "@eslint/css";
import html from "@html-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfig([
  // Lint browser-facing scripts (e.g. theme-toggle.js).
  // `prettier` is last so it can disable stylistic rules that would
  // otherwise conflict with Prettier's formatting.
  {
    files: ["**/*.js"],
    ignores: ["tests/**", "playwright.config.js"],
    plugins: { js },
    languageOptions: { globals: globals.browser },
    extends: ["js/recommended", prettier],
  },

  // Lint Node.js config/script files (CommonJS: require/module/process).
  {
    files: ["playwright.config.js", "**/*.cjs"],
    plugins: { js },
    languageOptions: { globals: globals.node },
    extends: ["js/recommended", prettier],
  },

  // Playwright test files run in Node but also contain browser-context
  // callbacks (e.g. `page.evaluate`), so both global sets are needed.
  {
    files: ["tests/**/*.js"],
    plugins: { js },
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    extends: ["js/recommended", prettier],
  },

  // Lint CSS files.
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },

  // Lint HTML files.
  {
    files: ["**/*.html"],
    plugins: { html },
    language: "html/html",
    extends: ["html/recommended"],
  },
]);
