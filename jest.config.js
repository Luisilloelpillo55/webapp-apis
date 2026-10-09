module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/routes/**/*.js',
    'src/models/**/*.js',
    'src/app.js',
    'src/config/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  }
};
