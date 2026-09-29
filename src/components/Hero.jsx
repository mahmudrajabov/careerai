import React from "react";
import { Gauge } from "lucide-react";

export default function Hero({ lastScore }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-16 pb-8 text-center">
        {lastScore != null && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-vivid text-xs font-500 mb-5 animate-fade-up">
            <Gauge className="w-3.5 h-3.5" />
            Last match score: <span className="font-700">{lastScore}%</span>
          </div>
        )}
        <h1
          className="font-display font-700 tracking-tight text-gradient animate-fade-up"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.05 }}
        >
          Career Command Center
        </h1>
        <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto animate-fade-up">
          AI-Powered CV Optimization &amp; Application Engine
        </p>
      </div>
    </section>
  );
}