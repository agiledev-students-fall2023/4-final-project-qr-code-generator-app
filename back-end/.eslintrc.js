module.exports = {
    env: {
      browser: true,
      es2021: true
    },
    extends: [
      'standard',
      'plugin:react/recommended'
      commonjs: true,
      es2021: true,
      mocha: true
    },
    extends: [
      'standard'
    ],
    overrides: [
      {
        env: {
          node: true
        },
        files: [
          '.eslintrc.{js,cjs}'
        ],
        parserOptions: {
          sourceType: 'script'
        }
      }
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: [
      'react',
      'chai-friendly'
    ],
    rules: {
      'no-unused-expressions': 'off',
      'chai-friendly/no-unused-expressions': 'error'
      ecmaVersion: 'latest'
    },
    plugins: [
      'mocha'
    ],
    rules: {
    }
  }