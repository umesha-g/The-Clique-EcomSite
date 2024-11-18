/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/api/v1/files/**',
            },
        ],
        // Alternatively, if you aren't using `remotePatterns`
        domains: ['localhost'],
    },
};

export default nextConfig;
