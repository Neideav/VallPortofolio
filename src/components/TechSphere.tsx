"use client";

import React, { useEffect, useRef } from "react";

export interface TechItem {
  name: string;
  icon?: string;
  svg?: React.ReactNode;
}

interface TechSphereProps {
  items: TechItem[];
  maxSize?: number;
}

export function TechSphere({ items, maxSize = 500 }: TechSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetVelocity = useRef({ vx: 0.0012, vy: 0.0035 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const count = items.length;
    // Golden ratio spiral angle for uniform distribution on a sphere
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Precalculate Fibonacci sphere 3D coordinates (unit sphere with r = 1)
    const points: [number, number, number][] = items.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / count;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      return [Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY];
    });

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let sphereRadius = 0.41 * container.clientWidth;
    let rotX = 0.35;
    let rotY = 0.0;
    let currVx = targetVelocity.current.vx;
    let currVy = targetVelocity.current.vy;
    let animId = 0;
    let isVisible = true;

    const updateFrame = () => {
      // Smoothly interpolate velocity toward target
      currVx += (targetVelocity.current.vx - currVx) * 0.05;
      currVy += (targetVelocity.current.vy - currVy) * 0.05;
      rotX += currVx;
      rotY += currVy;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      points.forEach(([px, py, pz], idx) => {
        const el = itemRefs.current[idx];
        if (!el) return;

        // Apply 3D rotation around Y axis then X axis
        const yRotZ = -px * sinY + pz * cosY;
        const yRotX = px * cosY + pz * sinY;

        // Depth value normalized between 0 (far back) and 1 (front)
        const depth = (py * sinX + yRotZ * cosX + 1) / 2;

        const screenX = yRotX * sphereRadius;
        const screenY = (py * cosX - yRotZ * sinX) * sphereRadius;

        // Dynamic scale & opacity according to 3D depth
        const scale = 0.7 + 0.45 * depth;
        const opacity = 0.18 + 0.82 * depth;
        const zIndex = Math.round(100 * depth);

        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(zIndex);
      });
    };

    const loop = () => {
      updateFrame();
      if (isVisible && !prefersReducedMotion) {
        animId = requestAnimationFrame(loop);
      }
    };

    loop();

    // Intersection observer to freeze animation when out of view (saves CPU/battery)
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      if (isVisible && !wasVisible && !prefersReducedMotion) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(loop);
      }
    });
    observer.observe(container);

    // Resize observer to scale sphere radius proportionally
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        sphereRadius = 0.41 * containerRef.current.clientWidth;
        if (prefersReducedMotion) updateFrame();
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [items]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    targetVelocity.current = {
      vx: -(0.035 * relY),
      vy: 0.035 * relX,
    };
  };

  const handlePointerLeave = () => {
    targetVelocity.current = { vx: 0.0012, vy: 0.0035 };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (touch.clientX - rect.left) / rect.width - 0.5;
    const relY = (touch.clientY - rect.top) / rect.height - 0.5;
    targetVelocity.current = {
      vx: -(0.04 * relY),
      vy: 0.04 * relX,
    };
  };

  const handleTouchEnd = () => {
    targetVelocity.current = { vx: 0.0012, vy: 0.0035 };
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative mx-auto aspect-square w-full select-none cursor-grab active:cursor-grabbing"
        style={{ maxWidth: `${maxSize}px` }}
      >
        {/* Orbit Rings (Outer Circle + Ellipses) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[9%] rounded-full border border-[var(--line)] dark:border-white/15 opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[9%] top-1/2 h-[26%] -translate-y-1/2 rounded-[50%] border border-[var(--line)] dark:border-white/15 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-[9%] left-1/2 w-[26%] -translate-x-1/2 rounded-[50%] border border-[var(--line)] dark:border-white/15 opacity-70"
        />

        {/* Orbiting Tech Badges */}
        <ul className="absolute left-1/2 top-1/2 h-0 w-0">
          {items.map((item, index) => (
            <li
              key={item.name}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs sm:text-[13px] font-medium text-[var(--text)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors duration-200 hover:border-emerald-500 hover:text-emerald-500 hover:bg-[var(--surface-2)] dark:bg-[#151921]/90 dark:border-white/15 dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] dark:hover:border-emerald-400 dark:hover:text-emerald-400">
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    draggable={false}
                    className="h-4 w-4 object-contain shrink-0"
                  />
                ) : item.svg ? (
                  <span className="h-4 w-4 flex items-center justify-center shrink-0">
                    {item.svg}
                  </span>
                ) : null}
                <span>{item.name}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Guide text matching rezatech.my.id */}
      <p className="mt-4 text-center text-xs font-mono font-medium uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 select-none">
        Move your cursor to spin
      </p>
    </div>
  );
}
