import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const sitemaps = [
    {
      loc: `${baseUrl}/pages-sitemap.xml`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${baseUrl}/images-sitemap.xml`,
      lastmod: new Date().toISOString(),
    },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map(
        (s) => `
      <sitemap>
        <loc>${s.loc}</loc>
        <lastmod>${s.lastmod}</lastmod>
      </sitemap>`,
      )
      .join('\n')}
  </sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
