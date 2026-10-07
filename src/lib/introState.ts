// Shared state for tracking whether user has seen the full intro greeting

let hasSeenIntroInMemory = false;

export function checkHasSeenIntro(): boolean {
  if (hasSeenIntroInMemory) return true;
  if (typeof window !== "undefined") {
    try {
      return sessionStorage.getItem("hasSeenIntro") === "true";
    } catch {
      return false;
    }
  }
  return false;
}

export function markIntroAsSeen(): void {
  hasSeenIntroInMemory = true;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("hasSeenIntro", "true");
    } catch {
      // ignore
    }
  }
}
