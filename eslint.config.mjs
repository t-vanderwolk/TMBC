import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextConfig from 'eslint-config-next';

// Polyfill structuredClone for Node versions < 18 so ESLint flat config internals run.
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}

// Provide throwIfAborted so ESLint's retry helpers work on Node versions missing the method.
if (
  typeof globalThis.AbortSignal !== 'undefined' &&
  typeof globalThis.AbortSignal.prototype.throwIfAborted !== 'function'
) {
  globalThis.AbortSignal.prototype.throwIfAborted = function throwIfAborted() {
    if (this.aborted) {
      const error = new Error('The operation was aborted.');
      error.name = 'AbortError';
      throw error;
    }
  };
}

const nextEntries = Array.isArray(nextConfig) ? nextConfig : [nextConfig];

export default [
  {
    ignores: [
      'node_modules/**',

      // 🔥 Ignore all Next.js build artifacts
      '.next/**',
      '**/.next/**',
      'frontend/.next/**',
      'frontend/.next/types/**',

      // Other build outputs
      'dist/**',
      'build/**',
      'backend/dist/**',
      'lib/**',

      // Type-only outputs
      '**/*.d.ts',
    ],
  },

  // Apply ESLint's JS defaults for standard syntax, globals, and formatting expectations.
  js.configs.recommended,

  // Ensure TypeScript files (including TSX) are parsed via the TypeScript parser with JSX enabled.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },

  // Layer on the recommended TypeScript rules for safer typings and constructs.
  ...tseslint.configs.recommended,

  // Finish with Next.js-specific linting (includes Next's parser, React hooks, and accessibility rules).
  ...nextEntries,

  // Adjust project-wide rules for actionable feedback without over-enforcing legacy warnings.
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
