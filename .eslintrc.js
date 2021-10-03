module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
  },
  "plugins": ["@typescript-eslint"],
  rules: {
    //'linebreak-style': ['error', 'windows'],
    'max-len': ['warn', 120],
    //'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //"@typescript-eslint/no-inferrable-types": 'off',
    //'class-methods-use-this':'off',
    //'import/prefer-default-export': 'off',
  },
};