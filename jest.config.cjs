/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.cjs',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx',
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                allowImportingTsExtensions: false,
                noEmit: false,
                moduleResolution: 'node',
                module: 'commonjs',
                paths: {
                    '@/*': ['./src/*'],
                },
                baseUrl: '.',
            },
        }],
        '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(lucide-react)/)',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/main.tsx',
        '!src/vite-env.d.ts',
        '!src/**/*.spec.{ts,tsx}',
        '!src/setupTests.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
