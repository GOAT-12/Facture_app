module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://votresite.com',
    generateRobotsTxt: true,
    generateIndexSitemap: true,
    outDir: 'public',
    exclude: ['/server-sitemap.xml'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        additionalSitemaps: [
            `${process.env.NEXT_PUBLIC_SITE_URL || 'https://votresite.com'}/server-sitemap.xml`,
        ],
    },
};
