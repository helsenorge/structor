import config from '@helsenorge/eslint-config';

export default [
    ...config,    
    {
        rules: {
          '@typescript-eslint/no-unused-expressions': 0,
          '@typescript-eslint/no-unused-vars': 0,
        },
      },
      {
        ignores: [
          '**/__tests__/*',
        ],
      },
  ];
