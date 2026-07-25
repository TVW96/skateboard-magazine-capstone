import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import css from "@eslint/css";
import html from "@html-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default defineConfig([
  // Lint any JavaScript files (none yet, but ready for future use).
  // `prettier` is last so it can disable stylistic rules that would
  // otherwise conflict with Prettier's formatting.
  {
    files: ["**/*.js"],
    plugins: { js },
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
