import { DiscoverBooks } from "@/components/discover-books";
import { SiteShell } from "@/components/site-shell";
import { getBooks } from "@/lib/books";

export default async function HomePage() {
  const books = await getBooks();

  return (
    <SiteShell>
      <DiscoverBooks books={books} />
    </SiteShell>
  );
}
