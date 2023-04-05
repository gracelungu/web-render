import fetch from "node-fetch";
import FormData from "form-data";

const uploadToImgBB = async (buffer: Buffer): Promise<string> => {
  const formData = new FormData();
  formData.append("image", buffer.toString("base64"));
  formData.append("key", process.env.IMGBB_TOKEN as string);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
  });

  if (response.status === 200) {
    const data = (await response.json()) as any;
    return data.data.url;
  }

  throw new Error("Failed to upload image to ImgBB");
};

export default uploadToImgBB;
