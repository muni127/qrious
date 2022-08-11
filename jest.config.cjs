module.exports = {
    collectCoverage: true,
    coverageReporters: [
        'html',
        'cobertura',
    ],
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 40,
            lines: 40,
            statements: 40,
        },
    },
    collectCoverageFrom: [
        'src/**/*.tsx',
        '!**/coverage/**',
        '!**/node_modules/**',
        '!**/jest.setup.cjs',
    ],
};
