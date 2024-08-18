/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    transpilePackages: ['@mui/material', '@emotion/react', '@emotion/styled'],
    rewrites: async () => {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ]
    },
    webpack: (config, { isServer }) => {
      // Add this to handle PDF parsing on the server-side
      if (isServer) {
        config.externals.push('canvas');
      }
      return config;
    },
  }
  
  export default nextConfig;