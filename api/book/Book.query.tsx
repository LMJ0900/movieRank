export class BookQuery {
  static async getBestsellerList(categoryId?: string) {
    const qs = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : "";
    const res = await fetch(`/api/books/bestsellers${qs}`, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`bestsellers fetch failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data?.item ?? [];
  }
}
