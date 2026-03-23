require("dotenv").config({ path: ".env" });
const { Transloadit } = require("transloadit");

const transloadit = new Transloadit({
  authKey: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY || process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
});

async function run() {
  const originalVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  console.log("Simulating FAST FILTER UPLOAD with size>0...");
  try {
    const filterAssembly = await transloadit.createAssembly({
      params: {
        steps: {
          import: {
            robot: "/http/import",
            url: originalVideoUrl,
          },
          filter: {
            use: "import",
            robot: "/file/filter",
            accepts: [["${file.size}", ">", 0]], // Accept everything > 0 bytes
          },
        },
      },
      waitForCompletion: true,
    });

    const filterUrl = filterAssembly.results?.filter?.[0]?.ssl_url;
    console.log("Filter URL:", filterUrl);
    
    if (!filterUrl) {
      console.log("Filter failed. Full results:", JSON.stringify(filterAssembly.results));
    }
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
