module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
        '@typescript-eslint/unbound-method': ['error', {'ignoreStatic': true}],
        'no-console': ['error', {'allow': ['warn', 'info']}],
        '@typescript-eslint/typedef': ['error', {arrayDestructuring: false, arrowParameter: false}],
        '@typescript-eslint/type-annotation-spacing': ['error'],
        '@typescript-eslint/explicit-member-accessibility': ['error',{
            overrides: {constructors: 'off', accessors : 'off'}
        }],
        // not fixed
        '@typescript-eslint/no-misused-promises': 'warn',
        'no-prototype-builtins': 'warn',
        'max-len': ['warn', {'code': 120}],
        'no-magic-numbers': ['warn', {'ignore': [1, -1, 0], 'ignoreArrayIndexes': true}],
        'quotes': ['warn', 'single'],
        'no-negated-condition': 'warn',
        'capitalized-comments': 'warn',
        'line-comment-position': 'warn',
        'class-methods-use-this': 'warn',
        'no-plusplus': 'warn',
        'indent': ['warn', 4, {'SwitchCase': 1}],
        'no-param-reassign': 'warn',
        'prefer-template': 'warn',
        'no-inline-comments': 'warn',
        'max-lines-per-function': 'warn',
        'multiline-comment-style': 'warn',
        'no-implicit-coercion': 'warn',
        'no-new': 'warn',
        'max-depth': 'warn',
        'no-eval': 'warn',
        'no-new-func': 'warn',
        'max-statements': 'warn',
        'consistent-return': 'warn',
        'prefer-object-spread': 'warn',
        'prefer-regex-literals': 'warn',
        'prefer-named-capture-group': 'warn',
        'require-unicode-regexp': 'warn',
        'default-param-last': 'warn',
        'no-nested-ternary': 'warn',
        'callback-return': 'warn',
        'no-eq-null': 'warn',
        'eqeqeq': 'warn',
        '@typescript-eslint/prefer-includes': 'warn',
        '@typescript-eslint/prefer-regexp-exec': 'warn',
        'consistent-this': 'warn',
        'max-classes-per-file': 'warn',
        'no-extend-native': 'warn',
        'global-require': 'warn',
        'func-names': 'warn',
        'operator-linebreak': ['warn', 'before'],
        'spaced-comment': 'warn',
        'guard-for-in': 'warn',
        'no-mixed-operators': 'warn',
        'array-callback-return': 'warn',
        'arrow-body-style': 'warn',
        // Code style
        'linebreak-style': ['warn'],
        'dot-location': ['warn', 'property'],
        'max-statements-per-line': ['warn', {'max': 2}],
        'quote-props': ['warn', 'as-needed'],
        'space-before-function-paren': ['warn', 'never'],
        'comma-dangle': ['warn', 'always-multiline'],
        'padded-blocks': ['warn', {'blocks': 'never'}, {'class': 'always'}],
        'block-spacing': 'warn',
        'brace-style': ['warn', '1tbs', {'allowSingleLine': true}],
        'object-property-newline': ['warn', {'allowAllPropertiesOnSameLine': true}],
        'array-bracket-newline': ['warn'],
        'array-bracket-spacing': ['warn'],
        // Disabled rules:
        'array-element-newline': ['off', {'multiline': true}],
        'lines-around-comment': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        'object-curly-spacing': ['off', 'always'],
        'function-call-argument-newline': 'off',
        'multiline-ternary': 'off',
        'sort-keys': 'off',
        'function-paren-newline': 'off',
        'sort-imports': 'off',
        'lines-between-class-members': 'off',
        'no-useless-constructor': 'off',
        'no-else-return': 'off',
        'max-params': 'off',
        'no-extra-parens': 'off',
        'new-cap': 'off',
        'id-length': 'off',
        'no-return-assign': 'off',
        'func-style': 'off',
        'max-lines': 'off',
        'no-loop-func': 'off',
        'one-var': 'off',
        'no-alert': 'off',
        'no-undefined': 'off',
        'no-ternary': 'off',
        'no-multi-assign': 'off',
        'no-underscore-dangle': 'off',
        'no-warning-comments': 'off',
        'prefer-destructuring': 'off',
        'init-declarations': 'off',
        'no-confusing-arrow': 'off',
        'newline-per-chained-call': 'off',
        'no-invalid-this': 'off',
        'no-lonely-if': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-use-before-define': 'off'
    }
};
