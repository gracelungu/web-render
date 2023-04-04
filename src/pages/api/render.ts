/* eslint-disable import/no-anonymous-default-export */
// pages/api/render.ts
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const cleanupTempImages = async () => {
  const tempDir = path.join(process.cwd(), "public", "temp");
  const files = await fs.promises.readdir(tempDir);

  const currentTime = Date.now();

  for (const file of files) {
    const filePath = path.join(tempDir, file);
    const stats = await fs.promises.stat(filePath);

    if (currentTime - stats.mtimeMs > ONE_WEEK_MS) {
      await fs.promises.unlink(filePath);
    }
  }
};

const renderImage = async (
  html: string,
  css: string,
  javascript: string,
  viewportWidth: number,
  viewportHeight: number,
  imageFormat: "jpeg" | "png"
): Promise<string> => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: viewportWidth, height: viewportHeight });
  await page.setContent(`
    <style>${css}</style>
    ${html}
    <script>${javascript}</script>
  `);

  const filename = uuidv4() + "." + imageFormat;
  const filepath = `./public/temp/${filename}`;
  const publicUrl = `/temp/${filename}`;

  await page.screenshot({ type: imageFormat, path: filepath });

  await browser.close();
  await cleanupTempImages();
  return publicUrl;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    html,
    css,
    javascript = "",
    viewportWidth = 640,
    viewportHeight = 640,
    imageFormat = "png",
  } = req.body;

  if (!html || !css) {
    return res.status(400).json({ message: "HTML and CSS are required." });
  }

  try {
    const imageUrl = await renderImage(
      html,
      css,
      javascript,
      viewportWidth,
      viewportHeight,
      imageFormat
    );
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error rendering image." });
  }
};
