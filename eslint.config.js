import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      react: pluginReact,
    },
    extends: [
      "eslint:recommended", // Reglas generales recomendadas
      "plugin:react/recommended", // Reglas recomendadas para React
    ],
    settings: {
      react: {
        version: "detect", // 🔍 Detecta la versión de React automáticamente
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // 🔴 No es necesario importar React en JSX (React 17+)
      "react/prop-types": "off", // 🔵 Opcional, si no usas PropTypes
      "react/jsx-uses-react": "off", // 🔵 Evita advertencias innecesarias
      "react/jsx-uses-vars": "warn", // ⚠️ Detecta variables no usadas en JSX
      "no-unused-vars": "warn", // ⚠️ Marca variables no utilizadas
      "semi": ["error", "always"], // 🔴 Exige punto y coma al final de las líneas
      "quotes": ["error", "double"], // 🔴 Obliga a usar comillas dobles
      "indent": ["error", 2], // 🔴 Exige indentación de 2 espacios
    },
  },
]);
