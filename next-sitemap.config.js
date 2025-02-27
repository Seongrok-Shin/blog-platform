module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_API_URL || "localhost:3000",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
  exclude: ["/server-sitemap.xml"],
};
