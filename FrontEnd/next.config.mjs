/** @type {import('next').NextConfig} */
const nextConfig = {
    //output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/api/v1/files/**',
            },
            {
                protocol: 'http',
                hostname: '192.168.1.100',
                port: '8080',
                pathname: '/api/v1/files/**',
            },
            {
                protocol: 'http',
                hostname: '192.168.1.1',
                port: '8080',
                pathname: '/api/v1/files/**',
            },
            {
                protocol: 'http',
                hostname: '192.168.1.101',
                port: '8080',
                pathname: '/api/v1/files/**',
            },
        ],
        domains: ['localhost','192.168.1.101','192.168.1.1','192.168.1.100',],
    },
    // Add these configurations
    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
        // Add source map support
        if (!isServer && !dev) {
            config.devtool = 'source-map';
        }
        return config;
    },
};

export default nextConfig;