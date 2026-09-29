import React from "react";
import { Sparkles, ScanSearch, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopNav({ stats, onNavigate, activeSection }) {
  return (
    <header className="sticky top-0 z-40 h-16 glass border-b border-border">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <button onClick={() => onNavigate("analyzer")} className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-vivid shadow-lg shadow-primary/30">
            <Sparkles className="w-5 h-5 text-white" />
          </span>
          <span className="font-display font-700 text-lg tracking-tight">
            Career<span className="text-vivid">AI</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          <NavBtn label="AI Analyzer" icon={ScanSearch} active={activeSection === "analyzer"} onClick={() => onNavigate("analyzer")} />
          <NavBtn label="Job Tracker" icon={Briefcase} active={activeSection === "tracker"} onClick={() => onNavigate("tracker")} />
        </nav>

        <div className="hidden sm:flex items-center gap-4 text-xs">
          <Stat label="Total Tracked" value={stats.total} />
          <span className="w-px h-8 bg-border" />
          <Stat label="Interview Rate" value={`${stats.interviewRate}%`} accent />
        </div>
      </div>
    </header>
  );
}

function NavBtn({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-500 transition-colors",
        active ? "bg-primary/15 text-vivid" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="text-right leading-tight">
      <div className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("font-display font-600 text-sm", accent ? "text-vivid" : "text-foreground")}>{value}</div>
    </div>
  );
}