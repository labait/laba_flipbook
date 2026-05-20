// Proxy JSON (or other static assets) from an allowed host to avoid browser CORS.
// Example: /api/contents-proxy?url=https://synapses.laba.edu/laba-flipbook/contents/videos-synapses2026-05/data.json

const ALLOWED_HOSTS = new Set(['synapses.laba.edu']);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const requestUrl = new URL(request.url);
    const targetUrl = requestUrl.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing url query parameter', { status: 400, headers: corsHeaders });
    }

    const target = new URL(targetUrl);
    if (!ALLOWED_HOSTS.has(target.hostname)) {
      return new Response('Host not allowed', { status: 403, headers: corsHeaders });
    }

    const upstream = await fetch(targetUrl, {
      headers: { Accept: 'application/json, text/plain, */*' },
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    return new Response(error.stack, { status: 500, headers: corsHeaders });
  }
};
