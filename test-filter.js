require("dotenv").config({ path: ".env" });
const { Transloadit } = require("transloadit");

const transloadit = new Transloadit({
  authKey: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY || process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
});

async function run() {
  const originalVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // 10s video

  console.log("Simulating FAST FILTER UPLOAD...");
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
            accepts: [["${file.mime}", "regex", "video/.*"]],
          },
        },
      },
      waitForCompletion: true,
    });

    const filterUrl = filterAssembly.results?.filter?.[0]?.ssl_url;
    console.log("Filter URL:", filterUrl);
    
    if (!filterUrl) throw new Error("No filter URL created!");

    console.log("Simulating Extract Frame from filter url...");
    const extractAssembly = await transloadit.createAssembly({
      params: {
        steps: {
          import: {
            robot: "/http/import",
            url: filterUrl,
          },
          extract: {
            use: "import",
            robot: "/video/thumbs",
            count: 1,
            offsets: ["00:00:04"],
          },
        },
      },
      waitForCompletion: true,
    });

    console.log("Extract ok:", extractAssembly.ok, "Results:", extractAssembly.results?.extract?.[0]?.ssl_url);
  } catch (err) {
    console.error("Test Error:", err);
  }
}

run();
