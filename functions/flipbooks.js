import fs from 'fs';
import path from 'path';

// urls /api/flipbooks?subdir=flipbooks-synapses2025&prefix=/

export default async (request) => {
  try {
    const url = new URL(request.url);
    const subdir = url.searchParams.get('subdir');
    const dir = `./public/contents/${subdir}`;
    const prefix = url.searchParams.get('prefix') ?? '/';
    const contents = [];
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        console.log('Directory:', file);
        const contentFiles = fs.readdirSync(filePath);
        const pages = contentFiles.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
        const content = {
          folder: file,
          name: file,
          path: prefix + path.join(filePath.replace('public/', '')),
          pdf: prefix + path.join(filePath, contentFiles.find(f => f.endsWith('.pdf'))).replace('public/', ''),
          pages: pages.map(p => {
            const basename = path.basename(p).split(".")[0];
            const page_number = parseInt(basename.split('_').reverse()[0])
            return {
              name: basename,
              image: prefix + path.join(filePath, p).replace('public/', ''),
              page_number: page_number,
            }
          }).sort((a, b) => a.page_number - b.page_number)
        }
        contents.push({pages_count: content.pages.length, ...content, });
      }
    })
    return Response.json(contents);
  } catch (error) {
    return new Response(error.stack, { status: 500 });
  }
}
