module.exports = {
  extends: '@helsenorge/eslint-config/stylelint.config.js',
  rules: {
    'selector-class-pattern': null,
    'selector-id-pattern': null,
  },
  ignoreFiles: [
    "src/components/Question/Question.css"
  ]
};
