import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
    transpilePackages: ['next-mdx-remote'],
    images: {
        remotePatterns: [
            { hostname: 'www.google.com' },
            { hostname: 'img.clerk.com' },
            { hostname: 'zyqdiwxgffuy8ymd.public.blob.vercel-storage.com' },
        ],
    },

    experimental: {
        externalDir: true,
    },
    webpack: (config, options) => {
        if (!options.isServer) {
            config.resolve.fallback = { fs: false, module: false, path: false };
        }

        // Redirect @clerk/nextjs to no-op shims (removes authentication)
        config.resolve.alias = {
            ...config.resolve.alias,
            '@clerk/nextjs/server': path.resolve(__dirname, '../../packages/common/lib/clerk-server-shim.ts'),
            '@clerk/nextjs/errors': path.resolve(__dirname, '../../packages/common/lib/clerk-errors-shim.ts'),
            '@clerk/nextjs': path.resolve(__dirname, '../../packages/common/lib/clerk-shim.tsx'),
        };

        // Experimental features
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
            layers: true,
        };

        return config;
    },
    async redirects() {
        return [{ source: '/', destination: '/chat', permanent: true }];
    },
};

export default nextConfig;
