import { htmlTemplate } from '@/lib/pdf-template';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const html = htmlTemplate(data);
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
