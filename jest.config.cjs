/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '^@/lib/api(.*)$': '<rootDir>/src/lib/api/__mock__.cjs',
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
            diagnostics: false,
        }],
        '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
    },
    globals: {
        // Mock import.meta for Vite-specific code that uses import.meta.env
        'import.meta': {
            env: {
                VITE_API_URL: 'http://localhost:4000/api',
                VITE_GATEWAY_PUB_KEY: 'test_pub_key',
                VITE_GATEWAY_BASE_URL: process.env.VITE_GATEWAY_BASE_URL,
            }
        }
    },
    transformIgnorePatterns: [
        '/node_modules/(?!lucide-react|axios|@reduxjs|immer|redux)',
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
