import type { MetadataRoute } from "next";

import { getBooks } from "@/lib/books";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getBooks();

  return [
    {
      url: siteConfig.url,
      lastModified: new Date()
    },
    ...books.map((book) => ({
      url: `${siteConfig.url}/book/${book.id}`,
      lastModified: book.created_at
    }))
  ];
}
