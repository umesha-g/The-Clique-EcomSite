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
        ],
        domains: ['localhost'],
    },

    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
        if (!isServer && !dev) {
            config.devtool = 'source-map';
        }
        return config;
    },
};

export default nextConfig;