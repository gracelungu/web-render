/* eslint-disable import/no-anonymous-default-export */
// pages/api/render.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { launchChromium } from "playwright-aws-lambda";
import uploadToImgBB from "@/helpers/uploadToImgBB";

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

  const screenshotBuffer = await page.screenshot({ type: imageFormat });

  const imageUrl = await uploadToImgBB(screenshotBuffer);
  await browser.close();

  return imageUrl;
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

  if (!html) {
    return res.status(400).json({ message: "HTML is required." });
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
