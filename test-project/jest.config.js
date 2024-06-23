
module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^redux/(.*)$': '<rootDir>/src/redux/$1',
    '^screens/(.*)$': '<rootDir>/src/screens/$1',
  },
  testEnvironment: 'jsdom',
};
