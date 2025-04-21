import { MetadataRoute } from "next";

export default async function sitemap({
  params,
}: {
  params: { lang: string };
}): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.lang}`,
    },
  ];
}
