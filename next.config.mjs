/** @type {import('next').NextConfig} */
const nextConfig = {
  // middleware.js strips trailing slashes together with the old-URL and host
  // redirects, so a visitor gets one hop instead of Next's slash redirect
  // followed by another.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
    ],
  },
};

export default nextConfig;
