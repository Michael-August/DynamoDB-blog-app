/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true, // Enables React's Strict Mode for better error handling
	images: {
		domains: ["res.cloudinary.com", "m.media-amazon.com", "files.selar.co"],
	},
	trailingSlash: true,
};

export default nextConfig;
