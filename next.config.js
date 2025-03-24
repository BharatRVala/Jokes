/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true, // true for 301 redirect
      },
    ];
  },
};

module.exports = nextConfig;
