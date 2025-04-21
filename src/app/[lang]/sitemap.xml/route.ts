import { LOCALES } from "@/app/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: { lang: string } }
) {
  const lang = params.lang;

  if (!LOCALES.includes(lang)) {
    return new Response("Not found", { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}/${lang}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${baseUrl}/${lang}/about</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <!-- Puedes añadir más rutas aquí -->
    </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
