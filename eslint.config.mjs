import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import css from "@eslint/css";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
  // Lint any JavaScript files (none yet, but ready for future use).
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
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
