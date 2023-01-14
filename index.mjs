import { login } from "masto";
import fetch from "node-fetch";

import * as dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

async function sendImageToMasto(shibeImageArrayBuffer) {
  try {
    const masto = await login({
      url: "https://mas.to/api/v1",
      accessToken: process.env.ACCESS_TOKEN_KEY,
    });

    // convert ArrayBuffer to Buffer
    const shibeImageBuffer = Buffer.from(shibeImageArrayBuffer);

    const attachment = await masto.v2.mediaAttachments.create({
      file: shibeImageBuffer,
      description: "a random shiba",
    });

    await masto.v1.statuses.create({
      status: "",
      visibility: "public",
      mediaIds: [attachment.id],
    });

    console.log("🐕‍🦺 New shibe successfully posted! 🐕‍🦺");
  } catch (error) {
    console.error(
      "Thats ruff, something went wrong posting to Mastodon...😒",
      error
    );
  }
}

fetch("http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true")
  .then((res) => res.json())
  .then((json) => json[0])
  .catch((error) =>
    console.error("There was an error fetching a shibe...😑", error)
  )
  .then((imageURL) => fetch(imageURL))
  .then((res) => res.arrayBuffer())
  .then((shibeImageArrayBuffer) => sendImageToMasto(shibeImageArrayBuffer));
