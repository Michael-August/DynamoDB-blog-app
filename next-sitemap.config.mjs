/** @type {import('next-sitemap').IConfig} */
const fetchDynamicRoutes = async () => {
	// Fetch data from your API, database, or CMS
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const response = await fetch(`${baseUrl}/apis/public`);
	const posts = await response.json();

	// Return the dynamic paths (e.g., blog slugs)
	return posts.map((post) => `/blog/${post.slug}`);
};

const config = {
	siteUrl: process.env.SITE_URL || "https://ewere.tech", // Replace with your domain
	generateRobotsTxt: true, // Automatically generate a robots.txt file
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*", // Apply this rule to all crawlers
				allow: "/", // Allow crawling of all pages
			},
		],
	},
	additionalPaths: async (config) => {
		const dynamicRoutes = await fetchDynamicRoutes();

		// Map the dynamic paths to a format `next-sitemap` can understand
		return dynamicRoutes.map((route) => config.transform(config, route));
	},
	changefreq: "weekly", // Frequency of content updates
	priority: 0.7, // Priority for the pages in the sitemap
	sitemapSize: 5000, // Max entries per sitemap (useful for large sites)
};

module.exports = config;
