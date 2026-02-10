export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/vendor/dashboard/',
        },
        sitemap: 'https://planttrade.in/sitemap.xml',
    }
}
