// pages/api/contentFiles.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { section = 'research', lang = 'en' } = req.query;
  const baseDirectory = path.join(process.cwd(), 'pages');
  const directoryPath = path.resolve(baseDirectory, section);
  // Prevent directory traversal: ensure resolved path is within the base directory
  if (!directoryPath.startsWith(baseDirectory + path.sep)) {
    res.status(400).json({ error: 'Invalid section' });
    return;
  }
  const metaFilePath = path.join(directoryPath, `_meta.${lang}.json`);

  let titles = {};
  let fileNames = [];

  if (fs.existsSync(metaFilePath)) {
    const metaFileContents = fs.readFileSync(metaFilePath, 'utf8');
    titles = JSON.parse(metaFileContents);

    // Iterate over the keys in the titles object to maintain order
    fileNames = Object.keys(titles).map(slug => {
      return {
        slug,
        title: titles[slug]
      };
    });
  }

  res.status(200).json({ fileNames });
}
