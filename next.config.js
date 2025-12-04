/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    // ❌ appDir or any unrecognized keys are NOT allowed
  },

  images: {
    domains: ['images.unsplash.com', 'satvik'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'satvik',
        pathname: '/**',
      },
    ],
  },

  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "", 
    // ✅ fallback empty string so it always satisfies "string expected" requirement

    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",

    // India specific defaults (safe)
    NEXT_PUBLIC_BASE_CURRENCY: "INR",
    NEXT_PUBLIC_CURRENCY_SYMBOL: "₹",
    NEXT_PUBLIC_DEFAULT_COUNTRY: "India",
  },
};

module.exports = nextConfig;
