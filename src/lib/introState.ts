// Manages state for whether user is returning from the /work page to the main page

let fromWorkMemory = false;

export function markComingFromWork(): void {
  fromWorkMemory = true;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("from_work_page", "true");
    } catch {
      // ignore
    }
  }
}

export function checkAndClearComingFromWork(): boolean {
  let isFromWork = fromWorkMemory;
  if (typeof window !== "undefined") {
    try {
      if (sessionStorage.getItem("from_work_page") === "true") {
        isFromWork = true;
      }
      if (document.referrer && document.referrer.includes("/work")) {
        isFromWork = true;
      }
      // Immediately clear so any subsequent refresh on Home page plays the full text transition!
      sessionStorage.removeItem("from_work_page");
    } catch {
      // ignore
    }
  }
  fromWorkMemory = false;
  return isFromWork;
}
