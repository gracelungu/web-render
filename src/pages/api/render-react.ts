/* eslint-disable import/no-anonymous-default-export */
// pages/api/render-react.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { launchChromium } from "playwright-aws-lambda";
import fetch from "node-fetch";
import uploadToImgBB from "@/helpers/uploadToImgBB";

// types.ts
type SandboxFile = {
  content: string | { [key: string]: any };
  isBinary?: boolean;
};

type SandboxDirectories = {
  [directory: string]: SandboxFile;
};

type SandboxFiles = {
  [filename: string]: SandboxFile;
};

const createSandbox = async (files: SandboxFiles): Promise<string> => {
  const response = await fetch(
    "https://codesandbox.io/api/v1/sandboxes/define?json=1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files }),
    }
  );

  const data = (await response.json()) as any;
  return data.sandbox_id;
};

const renderReactImage = async (
  files: any,
  viewportWidth: number,
  viewportHeight: number,
  imageFormat: "jpeg" | "png"
): Promise<string> => {
  const sandboxId = await createSandbox(files);

  const sandboxUrl = `https://codesandbox.io/embed/${sandboxId}?autoresize=1&fontsize=14&hidenavigation=1`;

  const browser = await launchChromium();
  const page = await browser.newPage();
  await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
  await page.goto(sandboxUrl);
  await page.waitForLoadState("networkidle");

  const screenshotBuffer = await page.screenshot({ type: imageFormat });

  const imageUrl = await uploadToImgBB(screenshotBuffer);
  await browser.close();

  return imageUrl;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    files,
    viewportWidth = 640,
    viewportHeight = 640,
    imageFormat = "png",
  } = req.body;

  if (!files) {
    return res.status(400).json({ message: "Files object is required." });
  }

  try {
    const imageUrl = await renderReactImage(
      files,
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
