/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["res.cloudinary.com", "m.media-amazon.com", "files.selar.co"],
	},
	trailingSlash: true,
};

export default nextConfig;
