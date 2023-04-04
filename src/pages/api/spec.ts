import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const specPath = path.join(process.cwd(), 'spec.yaml');

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  if (fs.existsSync(specPath)) {
    fs.readFile(specPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).end();
      } else {
        res.setHeader('Content-Type', 'application/x-yaml');
        res.status(200).send(data);
      }
    });
  } else {
    res.status(404).end();
  }
}
