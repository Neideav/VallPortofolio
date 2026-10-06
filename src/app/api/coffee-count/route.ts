import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Support both Upstash Redis / Vercel KV environment variables AND local filesystem
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const filePath = path.join(process.cwd(), "src", "data", "coffee-count.json");
const tmpPath = path.join("/tmp", "coffee-count.json");

let inMemoryCount = 24;

async function getCount(): Promise<number> {
  // 1. Try Redis / KV if configured (for production multi-device cloud persistence)
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/get/nauval_coffee_count`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result !== null && typeof data.result !== "undefined") {
          return parseInt(data.result, 10) || 24;
        }
      }
    } catch (e) {
      console.error("Redis fetch error:", e);
    }
  }

  // 2. Try project file
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.count === "number") {
        inMemoryCount = parsed.count;
        return parsed.count;
      }
    }
  } catch {
    // If read fails (e.g. serverless read restrictions), try tmp path
  }

  // 3. Try /tmp file (for serverless environments)
  try {
    if (fs.existsSync(tmpPath)) {
      const content = fs.readFileSync(tmpPath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.count === "number") {
        inMemoryCount = parsed.count;
        return parsed.count;
      }
    }
  } catch {
    // fallback to inMemoryCount
  }

  return inMemoryCount;
}

async function incrementCount(): Promise<number> {
  // 1. Try Redis / KV if configured (for production multi-device cloud persistence)
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/incr/nauval_coffee_count`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.result === "number") {
          return data.result;
        }
      }
    } catch (e) {
      console.error("Redis incr error:", e);
    }
  }

  // 2. Fallback to local files & memory
  let current = inMemoryCount;
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.count === "number") {
        current = parsed.count;
      }
    }
  } catch {
    // ignore
  }

  const next = current + 1;
  inMemoryCount = next;

  // Try writing to project file
  try {
    fs.writeFileSync(filePath, JSON.stringify({ count: next }, null, 2), "utf-8");
  } catch {
    // If read-only filesystem (Vercel serverless), write to /tmp
    try {
      fs.writeFileSync(tmpPath, JSON.stringify({ count: next }, null, 2), "utf-8");
    } catch {
      // Memory fallback
    }
  }

  return next;
}

export async function GET() {
  const count = await getCount();
  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST() {
  const count = await incrementCount();
  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
