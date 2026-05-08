/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build as a fully static site so it can deploy to any host:
  // Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, etc. All free.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
