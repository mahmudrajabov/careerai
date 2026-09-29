import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

function ScoreRing({ score }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);

  useEffect(() => {
    const t = setTimeout(() => setOffset(c - (score / 100) * c), 120);
    return () => clearTimeout(t);
  }, [score, c]);

  const color = score >= 75 ? "hsl(var(--success))" : score >= 55 ? "hsl(var(--vivid))" : "hsl(var(--danger))";

  return (
    <div className="relative grid place-items-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--vivid))" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display font-700 text-3xl" style={{ color }}>{score}<span className="text-base">%</span></div>
        <div className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">Match</div>
      </div>
    </div>
  );
}

export default function MatchResults({ analysis }) {
  if (!analysis) return null;

  const verdict =
    analysis.score >= 75 ? "Strong fit — apply with confidence"
    : analysis.score >= 55 ? "Decent fit — polish your CV first"
    : "Gap-heavy — tailor your CV before applying";

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-6 animate-fade-up">
      <div className="grid lg:grid-cols-[35%_1fr] gap-4 lg:gap-6">
        {/* Score card */}
        <div className="rounded-xl border border-border bg-arena p-6 flex flex-col items-center justify-center text-center glow-border">
          <ScoreRing score={analysis.score} />
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-vivid text-xs font-500">
            <TrendingUp className="w-3.5 h-3.5" />
            {analysis.jdSkillsCount} skills detected
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-[220px]">{verdict}</p>
        </div>

        {/* Breakdown */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Panel title="Matched Skills" icon={CheckCircle2} tone="success">
            <ChipList items={analysis.matched} tone="success" empty="No direct matches yet." />
          </Panel>
          <Panel title="Missing Skills" icon={XCircle} tone="danger">
            <ChipList items={analysis.missing} tone="danger" empty="Nothing critical missing." />
          </Panel>
          <div className="sm:col-span-2">
            <Panel title="AI Action Suggestions" icon={Lightbulb} tone="vivid">
              <ul className="space-y-2.5">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-foreground/90">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-vivid shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, icon: Icon, tone, empty, children }) {
  return (
    <div className="rounded-xl border border-border bg-arena p-5">
      <div className="flex items-center gap-2 mb-3.5">
        <Icon className={cn("w-4 h-4", tone === "success" && "text-success", tone === "danger" && "text-danger", tone === "vivid" && "text-vivid")} />
        <h4 className="font-display font-600 text-sm">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function ChipList({ items, tone, empty }) {
  if (!items?.length) return <p className="text-xs text-muted-foreground">{empty}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span
          key={s}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-500 border",
            tone === "success" ? "bg-success/15 text-success border-success/40" : "bg-danger/15 text-danger border-danger/40"
          )}
        >
          {s}
        </span>
      ))}
    </div>
  );
}