import { handleCors } from '../../lib/cors';

export const runtime = 'edge';

export const GET = (): Response => handleCors(new Response('OK', { status: 200 }));