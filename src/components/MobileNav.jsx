import React from "react";
import { ScanSearch, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav({ activeSection, onChange }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-2 h-16">
        <Tab
          label="AI Analyzer"
          icon={ScanSearch}
          active={activeSection === "analyzer"}
          onClick={() => onChange("analyzer")}
        />
        <Tab
          label="Job Tracker"
          icon={Briefcase}
          active={activeSection === "tracker"}
          onClick={() => onChange("tracker")}
        />
      </div>
    </nav>
  );
}

function Tab({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-[0.7rem] font-500 transition-colors relative",
        active ? "text-vivid" : "text-muted-foreground"
      )}
    >
      {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-vivid" />}
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}