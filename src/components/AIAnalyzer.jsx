import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const MAX_JD = 4000;

export default function AIAnalyzer({ onAnalyze, analyzing, cvFile, setCvFile, jd, setJd }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files) {
    const f = files?.[0];
    if (!f) return;
    setCvFile({ name: f.name, size: f.size });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        {/* CV upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={cn(
            "rounded-xl border bg-arena p-5 sm:p-6 flex flex-col min-h-[260px] transition-colors",
            dragging ? "border-vivid glow-border" : "border-border"
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <UploadCloud className="w-4 h-4 text-vivid" />
            <h3 className="font-display font-600 text-base">Your CV</h3>
          </div>

          {!cvFile ? (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 grid place-items-center rounded-lg border-2 border-dashed border-border hover:border-vivid/60 hover:bg-primary/5 transition-colors text-center p-6"
            >
              <div>
                <UploadCloud className="w-9 h-9 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-500 text-foreground">Drag &amp; drop your CV here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse — PDF, DOCX (demo)</p>
              </div>
            </button>
          ) : (
            <div className="flex-1 flex items-center">
              <div className="w-full flex items-center gap-3 rounded-lg border border-border bg-surface/60 p-3.5">
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-primary/15 text-vivid shrink-0">
                  <FileText className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-500 truncate">{cvFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(cvFile.size / 1024).toFixed(0)} KB · ready to analyze</p>
                </div>
                <button
                  onClick={() => setCvFile(null)}
                  className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  aria-label="Remove CV"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* JD input */}
        <div className="rounded-xl border border-border bg-arena p-5 sm:p-6 flex flex-col min-h-[260px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-vivid" />
              <h3 className="font-display font-600 text-base">Job Description</h3>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{jd.length}/{MAX_JD}</span>
          </div>
          <Textarea
            value={jd}
            maxLength={MAX_JD}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description here… the AI will extract required skills and match them against your CV."
            className="flex-1 resize-none bg-surface/60 border-border text-sm min-h-[160px] focus-visible:ring-vivid"
          />
        </div>
      </div>

      {/* Analyze CTA */}
      <div className="mt-5">
        <Button
          onClick={onAnalyze}
          disabled={analyzing}
          className="w-full h-12 text-sm font-600 bg-gradient-to-r from-primary to-vivid hover:from-primary-hover to-vivid text-white shadow-lg shadow-primary/30 rounded-xl"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing…
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" /> Analyze AI Match Score
            </>
          )}
        </Button>
      </div>
    </section>
  );
}