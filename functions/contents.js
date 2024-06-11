const fs = require('fs');
const path = require('path');
const dir = './public/contents';

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const contents = [];
    // read all subdirectoris in the contents directory
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
          path: filePath, 
          pdf: path.join(filePath, contentFiles.find(f => f.endsWith('.pdf'))),
          pages: pages.map(p => {
            const basename = path.basename(p).split(".")[0];
            const page_number = parseInt(basename.split('_').reverse()[0])
            return {
              name: basename,
              image: path.join(filePath,p),
              page_number: page_number,
            }
          }).sort((a, b) => a.page_number - b.page_number)
        }
        contents.push({pages_count: content.pages.length, ...content, });
      }
    })
    return {
      statusCode: 200,
      body: JSON.stringify(contents),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
