/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    // Bump test timeout since parsing large icon metadata files can take a bit.
    testTimeout: 20000,
};
