import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Personal brand logo — the uploaded "m cat" emblem (used exactly as-is, never recolored).
// Rendered at 32px on desktop and 28px on mobile.
export default function BrandLogo({ name = "Mahmud Rajabov", className, nameClassName }) {
  return (
    <Link
      to="/"
      aria-label="Mahmud Rajabov — home"
      className={cn("flex items-center gap-2.5 shrink-0 group", className)}
    >
      <img
        src="/m-cat-emblem.svg"
        alt="Mahmud Rajabov emblem"
        className="h-7 w-7 md:h-8 md:w-8 object-contain"
      />
      {name && (
        <span
          className={cn(
            "font-display font-700 text-lg tracking-tight",
            nameClassName
          )}
        >
          {name}
        </span>
      )}
    </Link>
  );
}