"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";

let currentCount = 24;
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
  return currentCount;
}

function getServerSnapshot() {
  return 24;
}

let hasFetched = false;

export function useCoffeeCount() {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // 1. Cross-tab synchronization via storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nauval_coffee_count" && e.newValue) {
        const parsed = parseInt(e.newValue, 10);
        if (!isNaN(parsed)) {
          setGlobalCount(parsed);
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    // 2. Fetch authoritative count from server once
    if (!hasFetched) {
      hasFetched = true;

      // Fast sync from local cache right after hydration
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
          // offline, already loaded from localStorage
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
