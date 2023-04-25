module.exports = {
    roots: ['<rootDir>/client', '<rootDir>/server'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  };