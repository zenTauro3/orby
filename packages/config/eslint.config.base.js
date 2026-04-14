// Base ESLint flat config — extend in each app/package
// Apps must install: eslint, @eslint/js, typescript-eslint

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
