"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";

const INITIAL_COUNT = 24;
let currentCount = INITIAL_COUNT;
let isHydrated = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore
    }
  });
}

function setGlobalCount(val: number) {
  if (typeof val === "number" && !isNaN(val) && currentCount !== val) {
    currentCount = val;
    notify();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  // During hydration, snapshot MUST strictly match server snapshot (INITIAL_COUNT).
  // Once hydrated on client, return the actual live count.
  return isHydrated ? currentCount : INITIAL_COUNT;
}

function getServerSnapshot() {
  return INITIAL_COUNT;
}

let hasFetched = false;

export function useCoffeeCount() {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // 1. Mark client as hydrated and notify store to reveal live count
    if (!isHydrated) {
      isHydrated = true;
      notify();
    }

    // 2. Cross-tab synchronization via storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nauval_coffee_count" && e.newValue) {
        const parsed = parseInt(e.newValue, 10);
        if (!isNaN(parsed)) {
          setGlobalCount(parsed);
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Fetch authoritative count from server once
    if (!hasFetched) {
      hasFetched = true;

      // Quick read from localStorage cache
      try {
        const saved = localStorage.getItem("nauval_coffee_count");
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed)) {
            setGlobalCount(parsed);
          }
        }
      } catch {
        // ignore
      }

      // Authoritative sync from backend API
      fetch("/api/coffee-count")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === "number" && !isNaN(data.count)) {
            setGlobalCount(data.count);
            try {
              localStorage.setItem("nauval_coffee_count", data.count.toString());
            } catch {
              // ignore
            }
          }
        })
        .catch(() => {
          // offline, fallback already in place
        });
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const increment = useCallback(async () => {
    const next = currentCount + 1;
    setGlobalCount(next);
    try {
      localStorage.setItem("nauval_coffee_count", next.toString());
    } catch {
      // ignore
    }

    try {
      const res = await fetch("/api/coffee-count", { method: "POST" });
      const data = await res.json();
      if (typeof data.count === "number" && !isNaN(data.count)) {
        setGlobalCount(data.count);
        try {
          localStorage.setItem("nauval_coffee_count", data.count.toString());
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.error("Failed to increment coffee count on server:", e);
    }
  }, []);

  return { count, increment };
}
