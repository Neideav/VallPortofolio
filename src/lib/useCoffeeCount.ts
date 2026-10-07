"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";

const INITIAL_COUNT = 65;
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
  return isHydrated ? currentCount : INITIAL_COUNT;
}

function getServerSnapshot() {
  return INITIAL_COUNT;
}

let hasFetched = false;

export function useCoffeeCount() {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // 1. Mark client as hydrated and notify store
    if (!isHydrated) {
      isHydrated = true;
      notify();
    }

    // 2. Cross-tab synchronization via storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nauval_coffee_count" && e.newValue) {
        const parsed = parseInt(e.newValue, 10);
        if (!isNaN(parsed) && parsed > currentCount) {
          setGlobalCount(parsed);
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Fast restore from localStorage cache
    try {
      const saved = localStorage.getItem("nauval_coffee_count");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > currentCount) {
          setGlobalCount(parsed);
        }
      }
    } catch {
      // ignore
    }

    // 4. Authoritative sync from backend API (runs once)
    if (!hasFetched) {
      hasFetched = true;

      fetch("/api/coffee-count")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === "number" && !isNaN(data.count)) {
            // Guarantee monotonic increase (never drop below local count)
            const updated = Math.max(data.count, currentCount);
            setGlobalCount(updated);
            try {
              localStorage.setItem("nauval_coffee_count", updated.toString());
            } catch {
              // ignore
            }
          }
        })
        .catch(() => {
          // offline fallback already in place
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
      const res = await fetch("/api/coffee-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentCount: next }),
      });
      const data = await res.json();
      if (typeof data.count === "number" && !isNaN(data.count)) {
        const best = Math.max(data.count, next);
        setGlobalCount(best);
        try {
          localStorage.setItem("nauval_coffee_count", best.toString());
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
