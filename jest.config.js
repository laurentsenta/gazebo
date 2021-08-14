// jest.config.js

// const tsPaths = require('./tsconfig.json')['compilerOptions']['paths']
// const myModules = new Set()
// Object.keys(tsPaths).forEach(p => {
//   myModules.add(p.split('/')[0])
// })

const myModules = ["gazebo", "store", "styles"];
const moduleNameMapper = {};

myModules.forEach((x) => {
  moduleNameMapper[`^@${x}$`] = `<rootDir>/src/${x}/index.ts`;
  moduleNameMapper[`^@${x}/(.*)$`] = `<rootDir>/src/${x}/$1`;
});

moduleNameMapper["^@c$"] = `<rootDir>/src/components/index.ts`;
moduleNameMapper["^@c/(.*)$"] = `<rootDir>/src/components/$1`;

module.exports = {
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  moduleNameMapper: {
    /* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  testEnvironment: "node",
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    ...moduleNameMapper,
    "^lodash-es/.*$": "lodash",
  },
};
