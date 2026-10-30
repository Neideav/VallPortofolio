/**
 * Reusable section scrolling helper with responsive navbar compensation.
 * Handles alias fallbacks (e.g., 'skills' vs 'what-i-can-do', 'journey' vs 'trainings')
 * and guarantees headings are never obscured by the fixed/floating navbar.
 */

export interface ScrollOptions {
  behavior?: ScrollBehavior;
  updateHash?: boolean;
}

export function getNavbarOffset(): number {
  if (typeof window === "undefined") return 80;

  const isMobile = window.innerWidth < 768;
  const navElement = document.querySelector("nav");

  if (navElement) {
    const rect = navElement.getBoundingClientRect();
    const navHeight = rect.height || (isMobile ? 52 : 60);
    // When scrolled, nav has a top offset (pt-5 on container = ~20px)
    const navTop = Math.max(rect.top, 0);
    const breathingRoom = isMobile ? 12 : 16;
    return Math.round(navTop + navHeight + breathingRoom);
  }

  // Safe fallbacks for desktop and mobile floating navbar
  return isMobile ? 68 : 88;
}

export function scrollToSection(
  sectionIdOrHash: string,
  options: ScrollOptions = {}
): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const { behavior = "smooth", updateHash = true } = options;

  // Clean the ID (remove leading slashes, hashes)
  const rawId = sectionIdOrHash.replace(/^[/#]+/, "").trim();
  if (!rawId) return false;

  // Support aliases seamlessly without duplicate hidden scroll targets
  const aliasMap: Record<string, string> = {
    "what-i-can-do": "skills",
    "journey": "trainings",
    "experience": "trainings",
  };

  const targetId = aliasMap[rawId] || rawId;
  let targetEl = document.getElementById(targetId);

  // Fallback if targetId wasn't found directly
  if (!targetEl && targetId === "skills") {
    targetEl = document.getElementById("what-i-can-do");
  } else if (!targetEl && targetId === "trainings") {
    targetEl = document.getElementById("journey");
  }

  if (!targetEl) {
    console.warn(`[scrollToSection] Target section '#${targetId}' not found.`);
    return false;
  }

  // Compute offset
  const offset = getNavbarOffset();
  const elementRect = targetEl.getBoundingClientRect();
  const targetTop = elementRect.top + window.scrollY;
  const finalScrollTop = Math.max(0, Math.round(targetTop - offset));

  window.scrollTo({
    top: finalScrollTop,
    behavior,
  });

  if (updateHash) {
    const canonicalHash = `#${rawId}`;
    if (window.location.hash !== canonicalHash) {
      window.history.pushState(null, "", canonicalHash);
    }
  }

  return true;
}
