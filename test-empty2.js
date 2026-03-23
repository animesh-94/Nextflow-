require("dotenv").config({ path: ".env" });
const { Transloadit } = require("transloadit");

const transloadit = new Transloadit({
  authKey: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY || process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
});

async function run() {
  const url = "https://www.w3schools.com/html/mov_bbb.mp4"; // 10s video

  console.log("Simulating Extract Node with out of bounds offset...");
  try {
    const extractAssembly = await transloadit.createAssembly({
      params: {
        steps: {
          import: {
            robot: "/http/import",
            url: url,
          },
          extract: {
            use: "import",
            robot: "/video/thumbs",
            count: 1,
            offsets: ["1000"], // Out of bounds!
          },
        },
      },
      waitForCompletion: true,
    });
    console.log("Finished. Assembly ok:", extractAssembly.ok, "Results extract:", extractAssembly.results?.extract);
    console.log("Full Results Object:", JSON.stringify(extractAssembly.results));
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
