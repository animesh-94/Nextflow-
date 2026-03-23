require("dotenv").config({ path: ".env" });
const { Transloadit } = require("transloadit");

const transloadit = new Transloadit({
  authKey: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY || process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
});

async function run() {
  const url = "https://nextflow-eight.vercel.app/api/execute/node"; // just checking if transloadit allows json import

  console.log("Simulating Extract Node with what might be an assembly_ssl_url...");
  try {
    const extractAssembly = await transloadit.createAssembly({
      params: {
        steps: {
          import: {
            robot: "/http/import",
            url: url, // a json or html page instead of video
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
    console.log("Finished. Assembly ok:", extractAssembly.ok, "Results extract:", extractAssembly.results?.extract);
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
