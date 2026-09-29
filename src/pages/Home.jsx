import React, { useMemo, useRef, useState } from "react";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import AIAnalyzer from "@/components/AIAnalyzer";
import MatchResults from "@/components/MatchResults";
import Tracker from "@/components/Tracker";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  loadApplications, addApplication, updateApplication, deleteApplication,
  analyzeMatch, loadLastAnalysis, saveLastAnalysis, computeStats
} from "@/lib/careerStore";

export default function Home() {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("analyzer");
  const [apps, setApps] = useState(() => loadApplications());
  const [analysis, setAnalysis] = useState(() => loadLastAnalysis());
  const [analyzing, setAnalyzing] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [jd, setJd] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const analyzerRef = useRef(null);
  const trackerRef = useRef(null);

  const stats = useMemo(() => computeStats(apps), [apps]);

  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => {
      const result = analyzeMatch(jd, cvFile);
      saveLastAnalysis(result);
      setAnalysis(result);
      setAnalyzing(false);
      if (isMobile) setActiveSection("analyzer");
      setTimeout(() => analyzerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }, 1100);
  }

  function handleAdd(data) {
    setApps((a) => [addApplication(data), ...a]);
  }
  function handleEdit(id, data) {
    setApps((a) => a.map((x) => (x.id === id ? updateApplication(id, data) : x)));
  }
  function handleDelete(id) {
    deleteApplication(id);
    setApps((a) => a.filter((x) => x.id !== id));
  }
  function handleStatusChange(id, status) {
    setApps((a) => a.map((x) => (x.id === id ? updateApplication(id, { status }) : x)));
  }

  function navigate(section) {
    setActiveSection(section);
    const ref = section === "analyzer" ? analyzerRef : trackerRef;
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }

  const showAnalyzer = !isMobile || activeSection === "analyzer";
  const showTracker = !isMobile || activeSection === "tracker";

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopNav stats={stats} onNavigate={navigate} activeSection={activeSection} />

      <main>
        <Hero lastScore={analysis?.score} />

        <div ref={analyzerRef} className={showAnalyzer ? "" : "hidden"}>
          <AIAnalyzer
            onAnalyze={handleAnalyze}
            analyzing={analyzing}
            cvFile={cvFile}
            setCvFile={setCvFile}
            jd={jd}
            setJd={setJd}
          />
          <MatchResults analysis={analysis} />
        </div>

        <div ref={trackerRef} className={`${showTracker ? "" : "hidden"} ${isMobile ? "pt-8" : "pt-14"}`}>
          <SectionHeading
            eyebrow="Application Tracker"
            title="Your Pipeline"
            subtitle="Track every role from Saved to Offer."
          />
          <Tracker
            apps={apps}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            query={query}
            setQuery={setQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>
      </main>

      <MobileNav activeSection={activeSection} onChange={setActiveSection} />
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-5">
      <div className="text-xs uppercase tracking-wider text-vivid font-500">{eyebrow}</div>
      <h2 className="font-display font-700 text-xl sm:text-2xl mt-1">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}