require("dotenv").config({ path: ".env" });
const { Transloadit } = require("transloadit");

const transloadit = new Transloadit({
  authKey: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY || process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
});

async function run() {
  try {
    const originalVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // 10s video

    console.log("Starting FAST UPLOAD simulation...");
    const fastUploadAssembly = await transloadit.createAssembly({
      params: {
        steps: {
          import: {
            robot: "/http/import",
            url: originalVideoUrl
          },
          encode: {
            use: "import",
            robot: "/video/encode",
            preset: "empty", 
            ffmpeg_stack: "v6.0",
            ffmpeg: {
              vcodec: "copy",
              acodec: "copy"
            }
          }
        }
      },
      waitForCompletion: true
    });

    const fastVideoUrl = fastUploadAssembly.results?.encode?.[0]?.ssl_url;
    console.log("Fast video uploaded. URL:", fastVideoUrl);
    
    if (!fastVideoUrl) throw new Error("No fast video url generated");

    console.log("Starting EXTRACT simulate...");
    const extractAssembly = await transloadit.createAssembly({
      params: {
        steps: {
          import: {
            robot: "/http/import",
            url: fastVideoUrl,
          },
          extract: {
            use: "import",
            robot: "/video/thumbs",
            count: 1,
            offsets: ["00:00:01"],
          },
        },
      },
      waitForCompletion: true,
    });
    console.log("Extraction Success! Thumb URL:", extractAssembly.results?.extract?.[0]?.ssl_url);
    
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
