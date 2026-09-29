import React, { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, ExternalLink, MapPin, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { STATUSES, STATUS_STYLES } from "@/lib/careerStore";
import ApplicationForm from "@/components/ApplicationForm";
import { cn } from "@/lib/utils";

export default function Tracker({ apps, onAdd, onEdit, onDelete, onStatusChange, query, setQuery, statusFilter, setStatusFilter }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const matchQ = !q || [a.company, a.role, a.location].join(" ").toLowerCase().includes(q);
      const matchS = statusFilter === "All" || a.status === statusFilter;
      return matchQ && matchS;
    });
  }, [apps, query, statusFilter]);

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(a) { setEditing(a); setFormOpen(true); }

  function handleSave(data) {
    if (editing) onEdit(editing.id, data);
    else onAdd(data);
  }

  function confirmDelete() {
    if (deleteId) onDelete(deleteId);
    setDeleteId(null);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, role, location…"
            className="pl-9 bg-surface/60 border-border"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Segmented value={statusFilter} onChange={setStatusFilter} />
          <Button onClick={openAdd} className="bg-gradient-to-r from-primary to-vivid text-white hover:from-primary-hover shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Add Application
          </Button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-arena overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="px-4 py-3 font-500">Company</th>
              <th className="px-4 py-3 font-500">Role</th>
              <th className="px-4 py-3 font-500">Location</th>
              <th className="px-4 py-3 font-500">Date</th>
              <th className="px-4 py-3 font-500">Status</th>
              <th className="px-4 py-3 font-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">No applications match your filters.</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-border/60 hover:bg-white/[0.02] transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary/15 text-vivid text-xs font-700 shrink-0">
                      {initials(a.company)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-500 truncate flex items-center gap-1.5">
                        {a.company}
                        {a.url && (
                          <a href={a.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-vivid">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {a.salary && <div className="text-xs text-muted-foreground">{a.salary}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground/90">{a.role}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.location || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">{a.appliedDate || "—"}</td>
                <td className="px-4 py-3">
                  <StatusSelect value={a.status} onChange={(s) => onStatusChange(a.id, s)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconBtn label="Edit" onClick={() => openEdit(a)}><Pencil className="w-3.5 h-3.5" /></IconBtn>
                    <IconBtn label="Delete" danger onClick={() => setDeleteId(a.id)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-arena p-8 text-center text-muted-foreground text-sm">
            No applications match your filters.
          </div>
        )}
        {filtered.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-arena p-4">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-lg bg-primary/15 text-vivid text-sm font-700 shrink-0">
                {initials(a.company)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-600 truncate">{a.company}</h4>
                  {a.url && (
                    <a href={a.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-vivid shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-foreground/90 truncate">{a.role}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                  {a.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>}
                  {a.appliedDate && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{a.appliedDate}</span>}
                  {a.salary && <span>{a.salary}</span>}
                </div>
              </div>
              <StatusSelect value={a.status} onChange={(s) => onStatusChange(a.id, s)} />
            </div>

            {a.notes && (
              <div className="mt-3">
                <button
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="text-xs text-muted-foreground hover:text-vivid inline-flex items-center gap-1"
                >
                  Notes <ChevronDown className={cn("w-3 h-3 transition-transform", expanded === a.id && "rotate-180")} />
                </button>
                {expanded === a.id && <p className="mt-1.5 text-sm text-foreground/80">{a.notes}</p>}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-border/60">
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => openEdit(a)}>
                <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="ghost" className="text-danger hover:text-danger" onClick={() => setDeleteId(a.id)}>
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ApplicationForm open={formOpen} onOpenChange={setFormOpen} initial={editing} onSave={handleSave} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-surface border-border text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently remove it from your tracker. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-danger text-white hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function Segmented({ value, onChange }) {
  const options = ["All", ...STATUSES];
  return (
    <div className="inline-flex p-1 rounded-lg border border-border bg-surface/60 shrink-0">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-500 whitespace-nowrap transition-colors",
            value === o ? "bg-primary/20 text-vivid" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none rounded-full pl-3 pr-7 py-1 text-xs font-500 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-vivid",
          STATUS_STYLES[value]
        )}
      >
        {STATUSES.map((s) => <option key={s} value={s} className="bg-surface text-foreground">{s}</option>)}
      </select>
      <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
    </div>
  );
}

function IconBtn({ children, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "p-1.5 rounded-md hover:bg-white/10 transition-colors",
        danger ? "text-muted-foreground hover:text-danger" : "text-muted-foreground hover:text-vivid"
      )}
    >
      {children}
    </button>
  );
}

function initials(name) {
  return (name || "?").trim().slice(0, 2).toUpperCase();
}