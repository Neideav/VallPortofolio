import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Upstash Redis / Vercel KV environment variables (if configured)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Cloud fallback counter
const CLOUD_NAMESPACE = "nauval-portfolio-v1";
const CLOUD_KEY = "coffee";
const BASE_COUNT = 65;

const filePath = path.join(process.cwd(), "src", "data", "coffee-count.json");
const tmpPath = path.join("/tmp", "coffee-count.json");

let inMemoryCount = BASE_COUNT;

// Fetch persistent hits from cloud counter fallback
async function getCloudHits(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://abacus.jasoncameron.dev/get/${CLOUD_NAMESPACE}/${CLOUD_KEY}`,
      {
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") {
        return data.value;
      }
    } else if (res.status === 404) {
      return 0;
    }
  } catch {
    // Network fallback
  }
  return null;
}

// Increment persistent hits on cloud counter fallback
async function hitCloudCounter(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://abacus.jasoncameron.dev/hit/${CLOUD_NAMESPACE}/${CLOUD_KEY}`,
      {
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") {
        return data.value;
      }
    }
  } catch {
    // Network fallback
  }
  return null;
}

async function getCount(): Promise<number> {
  // 1. Primary Source of Truth: Supabase PostgreSQL
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("coffee_counter")
        .select("count")
        .eq("slug", "global")
        .single();

      if (!error && data && typeof data.count === "number") {
        inMemoryCount = Math.max(inMemoryCount, data.count);
        return inMemoryCount;
      }
    } catch (e) {
      console.error("Supabase coffee_counter query error:", e);
    }
  }

  // 2. Redis / KV if configured in Vercel
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/get/nauval_coffee_count`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result !== null && typeof data.result !== "undefined") {
          const val = parseInt(data.result, 10);
          if (!isNaN(val)) return Math.max(val, BASE_COUNT);
        }
      }
    } catch (e) {
      console.error("Redis fetch error:", e);
    }
  }

  // 3. Cloud Persistent Counter Fallback
  const cloudHits = await getCloudHits();
  if (cloudHits !== null) {
    const total = BASE_COUNT + cloudHits;
    inMemoryCount = Math.max(inMemoryCount, total);
    return inMemoryCount;
  }

  // 4. Local filesystem & memory fallback
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.count === "number") {
        inMemoryCount = Math.max(inMemoryCount, parsed.count);
        return inMemoryCount;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(tmpPath)) {
      const content = fs.readFileSync(tmpPath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.count === "number") {
        inMemoryCount = Math.max(inMemoryCount, parsed.count);
        return inMemoryCount;
      }
    }
  } catch {}

  return inMemoryCount;
}

async function incrementCount(clientHint?: number): Promise<number> {
  // 1. Primary Source of Truth: Supabase PostgreSQL
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      // Call atomic RPC increment function
      const { data: rpcCount, error: rpcError } = await supabase.rpc(
        "increment_coffee_count",
        { counter_slug: "global" }
      );

      if (!rpcError && typeof rpcCount === "number") {
        inMemoryCount = Math.max(inMemoryCount, rpcCount, clientHint || 0);
        return inMemoryCount;
      }

      // Fallback to upsert if RPC is not available
      const { data: currentRecord } = await supabase
        .from("coffee_counter")
        .select("count")
        .eq("slug", "global")
        .single();

      const currentVal = currentRecord?.count || inMemoryCount;
      const nextVal = Math.max(currentVal + 1, clientHint || 0);

      const { data: updatedRecord, error: upsertError } = await supabase
        .from("coffee_counter")
        .upsert({
          slug: "global",
          count: nextVal,
          updated_at: new Date().toISOString(),
        })
        .select("count")
        .single();

      if (!upsertError && updatedRecord && typeof updatedRecord.count === "number") {
        inMemoryCount = Math.max(inMemoryCount, updatedRecord.count);
        return inMemoryCount;
      }
    } catch (e) {
      console.error("Supabase increment error:", e);
    }
  }

  // 2. Redis / KV if configured in Vercel
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/incr/nauval_coffee_count`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.result === "number") {
          return Math.max(data.result, clientHint || 0);
        }
      }
    } catch (e) {
      console.error("Redis incr error:", e);
    }
  }

  // 3. Cloud Persistent Counter Fallback
  const newHits = await hitCloudCounter();
  if (newHits !== null) {
    const total = BASE_COUNT + newHits;
    inMemoryCount = Math.max(inMemoryCount, total, clientHint || 0);
    return inMemoryCount;
  }

  // 4. Local files & memory fallback
  let current = inMemoryCount;
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.count === "number") {
        current = Math.max(current, parsed.count);
      }
    }
  } catch {}

  const next = Math.max(current + 1, clientHint || 0);
  inMemoryCount = next;

  try {
    fs.writeFileSync(filePath, JSON.stringify({ count: next }, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(tmpPath, JSON.stringify({ count: next }, null, 2), "utf-8");
    } catch {}
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

export async function POST(req: Request) {
  let clientHint: number | undefined;
  try {
    const body = await req.json();
    if (typeof body.currentCount === "number" && !isNaN(body.currentCount)) {
      clientHint = body.currentCount;
    }
  } catch {}

  const count = await incrementCount(clientHint);
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
