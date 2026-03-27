// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    jquery: true,
    es2020: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 'off',
    'no-unused-vars': 'warn'
  },
  // Override for static files that use ES6+ modules
  overrides: [
    {
      files: ['static/**/*.js', 'src/utils/**/*.js'],
      parserOptions: {
        sourceType: 'module'
      }
    }
  ],
  // Ignore specific files
  ignorePatterns: ['static/', 'dist_electron/', 'node_modules/']
}
