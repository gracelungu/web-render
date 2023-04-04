/* eslint-disable import/no-anonymous-default-export */
// pages/api/render.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { launchChromium } from "playwright-aws-lambda";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";


const renderImage = async (
  html: string,
  css: string,
  javascript: string,
  viewportWidth: number,
  viewportHeight: number,
  imageFormat: "jpeg" | "png"
): Promise<string> => {
  const browser = await launchChromium();

  const page = await browser.newPage();
  await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
  await page.setContent(`
    <style>${css}</style>
    ${html}
    <script>${javascript}</script>
  `);

  const tempDir = path.join("/tmp", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filename = uuidv4() + "." + imageFormat;
  const filepath = path.join(tempDir, filename);
  const publicUrl = `/temp/${filename}`;

  await page.screenshot({ type: imageFormat, path: filepath });

  await browser.close();
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
