import js from "@eslint/js";

// eslint.config.js
export default [
  {
    env: {
      browser: true,
      node: true, // Indicates that you're writing Node.js code
    },
    languageOptions: {
      globals: {
        console: true,
        process: true,
        env: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
];
