import React from "react";
import BrandLogo from "@/components/BrandLogo";

// Small, clean footer with the personal brand emblem.
export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex items-center justify-between gap-4">
        <BrandLogo />
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mahmud Rajabov
        </span>
      </div>
    </footer>
  );
}