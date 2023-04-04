import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const manifestPath = path.join(process.cwd(), 'api-plugin.json');

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  if (fs.existsSync(manifestPath)) {
    fs.readFile(manifestPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).end();
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);
      }
    });
  } else {
    res.status(404).end();
  }
}
