// app/api/books/bestsellers/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const apiKey = process.env.BOOK_API_KEY;
    if (!apiKey) {
      console.error('[bestsellers] BOOK_API_KEY missing');
      return NextResponse.json({ error: 'BOOK_API_KEY not set' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const categoryIdParam = searchParams.get('categoryId');
    const categoryId = categoryIdParam;

    const qs = new URLSearchParams({
      ttbkey: apiKey,
      QueryType: 'Bestseller',
      SearchTarget: 'Book',
      MaxResults: '50',
      start: '1',
      Cover: 'Big',
      Output: 'JS',
      Version: '20131101',
    });
    if (categoryId) qs.set('CategoryId', categoryId);


    const httpsUrl = `https://www.aladin.co.kr/ttb/api/ItemList.aspx?${qs.toString()}`;
    let upstream: Response | null = null;


    try {
      upstream = await fetch(httpsUrl, { cache: 'no-store' });
    } catch (err: unknown) {
         console.error('[bestsellers] fetch error', (err));
    }

    const raw = upstream ? await upstream.text() : '';

    const cleaned = (raw).trim();

    if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
      try {
        const json = JSON.parse(cleaned) as unknown;
        return NextResponse.json(json);
      } catch (e: unknown) {
        console.error('[bestsellers] JSON parse error', (e), {
          sample: cleaned.slice(0, 600),
        });
        return NextResponse.json({ error: 'Invalid JSON from upstream' }, { status: 502 });
      }
    }

    console.error('[bestsellers] Non-JSON response', cleaned.slice(0, 600));
    return NextResponse.json(
      { error: 'Non-JSON response from upstream', detail: cleaned.slice(0, 600) },
      { status: 502 }
    );
  } catch (e: unknown) {
    console.error('[bestsellers] Unhandled error:', (e));
    return NextResponse.json(
      { error: 'Internal error', message: (e) },
      { status: 500 }
    );
  }
}
