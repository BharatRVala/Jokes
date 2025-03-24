/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: "./google-credentials.json",
  },
};

module.exports = nextConfig;
