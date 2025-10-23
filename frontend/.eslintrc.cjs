module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react"],
  rules: {
    "react/prop-types": "off",
  },
  overrides: [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      rules: {
        "react/prop-types": "off",
      },
    },
  ],
  settings: {
    react: { version: "detect" },
  },
};
