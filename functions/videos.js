import fs from 'fs';
import path from 'path';
import process from 'process';

// urls /api/videos?subdir=videos-synapses2026-05&prefix=/

const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm', '.m4v']);

export default async (request) => {
  try {
    const url = new URL(request.url);
    const subdir = url.searchParams.get('subdir');
    const dir = `./public/contents/${subdir}`;
    const url_prefix = process.env.VITE_CONTENTS_URL_PREFIX;

    const files = fs.readdirSync(dir)
      .filter(file => VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const videos = files.map(file => ({
      file,
      path: `${url_prefix}contents/${subdir}/${file}`,
    }));

    return Response.json( videos );
  } catch (error) {
    return new Response(error.stack, { status: 500 });
  }
}
