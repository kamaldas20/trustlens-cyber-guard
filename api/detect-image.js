export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      const file = files.media;

      const formData = new FormData();
      formData.append("media", fs.createReadStream(file.filepath));
      formData.append("models", "genai");

      // 🔐 Use env variables
      formData.append("api_user", process.env.SIGHTENGINE_USER);
      formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

      const response = await fetch(
        "https://api.sightengine.com/1.0/check.json",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      res.json(data);

    } catch (e) {
      res.status(500).json({ error: "Sightengine failed" });
    }
  });
}