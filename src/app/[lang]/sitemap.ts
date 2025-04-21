import { MetadataRoute } from "next";
import { LOCALES } from "../lib/constants";

export default async function sitemap(params: {
  lang: string;
}): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.lang}`,
      alternates: Object.fromEntries(
        LOCALES.map((lang) => [
          lang,
          `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}`,
        ])
      ),
    },
  ];
}
