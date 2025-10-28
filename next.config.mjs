/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.mypanel.link",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },{
        protocol: "https",
        hostname: "storage.perfectcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
