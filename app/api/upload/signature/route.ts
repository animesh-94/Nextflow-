import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authKey = process.env.NEXT_PUBLIC_TRANSLOADIT_KEY!;
  const authSecret = process.env.TRANSLOADIT_SECRET!;

  if (!authKey || !authSecret) {
    console.error("Transloadit credentials missing in environment");
    return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
  }

  // Define when this signature expires (1 hour from now)
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    .replace(/-/g, '/').replace(/T/, ' ').replace(/\.\d+Z$/, '+00:00');

  // Define the Assembly instructions directly
  const params = JSON.stringify({
    auth: { key: authKey, expires },
    template_id: undefined,
    wait: true, // Tell Transloadit to wait until the upload is finished before responding
    steps: {
      filter: {
        robot: "/file/filter",
        accepts: [["${file.size}", ">", "0"]]
      },
    },
  });

  // Generate HMAC SHA384 signature
  const signature = crypto
    .createHmac("sha384", authSecret)
    .update(Buffer.from(params, "utf-8"))
    .digest("hex");

  return NextResponse.json({ 
    params, 
    signature: `sha384:${signature}` 
  });
}
