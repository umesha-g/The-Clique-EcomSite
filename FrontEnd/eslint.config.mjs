import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Add any additional globals if needed
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.recommended,
  pluginReactHooks.configs.recommended, // Recommended rules for React Hooks
  {
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Disable prop-types since you're using TypeScript
      "@typescript-eslint/no-explicit-any": "warn", // Warn against using 'any'
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ], // Ignore unused vars starting with _
      // Add any other custom rules here
    },
  },
];
