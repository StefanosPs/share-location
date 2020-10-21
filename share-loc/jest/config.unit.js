module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__', '/dist/'],
  coverageReporters: ['text', 'html'],
  coverageDirectory: '<rootDir>/reports/unit/coverage',
  moduleFileExtensions: ['js', 'json'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  reporters: [
    'default',
    [
      '../node_modules/jest-html-reporter',
      {
        pageTitle: 'Unit tests report',
        outputPath: './reports/unit/index.html'
      }
    ]
  ],
  silent: true,
  rootDir: '../',
  setupFiles: ['<rootDir>/jest/setup.js'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.unit.js?(x)']
};
