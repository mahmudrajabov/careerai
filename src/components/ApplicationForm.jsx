import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { STATUSES } from "@/lib/careerStore";

const empty = { company: "", role: "", location: "", url: "", status: "Saved", appliedDate: "", salary: "", notes: "" };

export default function ApplicationForm({ open, onOpenChange, initial, onSave }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty);
  }, [initial, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onSave({ ...form, company: form.company.trim(), role: form.role.trim() });
    onOpenChange(false);
  }

  const body = (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Company *">
          <Input value={form.company} onChange={set("company")} placeholder="e.g. Vercel" className="bg-surface/60" />
        </Field>
        <Field label="Role *">
          <Input value={form.role} onChange={set("role")} placeholder="e.g. Senior Frontend Engineer" className="bg-surface/60" />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={set("location")} placeholder="Remote" className="bg-surface/60" />
        </Field>
        <Field label="Salary">
          <Input value={form.salary} onChange={set("salary")} placeholder="$180k" className="bg-surface/60" />
        </Field>
        <Field label="Job URL">
          <Input value={form.url} onChange={set("url")} placeholder="https://…" className="bg-surface/60" />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={set("status")}
            className="h-10 w-full rounded-lg border border-input bg-surface/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-vivid"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Applied Date">
        <Input type="date" value={form.appliedDate} onChange={set("appliedDate")} className="bg-surface/60" />
      </Field>
      <Field label="Notes">
        <Textarea value={form.notes} onChange={set("notes")} placeholder="Contacts, prep, follow-ups…" className="bg-surface/60 resize-none" rows={3} />
      </Field>
    </form>
  );

  const footer = (
    <div className="flex gap-3 justify-end pt-2">
      <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
        Cancel
      </Button>
      <Button type="button" onClick={submit} className="bg-gradient-to-r from-primary to-vivid text-white hover:from-primary-hover">
        {initial ? "Save Changes" : "Add Application"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="bg-surface border-border text-foreground flex flex-col max-h-[92vh]">
          <SheetHeader>
            <SheetTitle className="font-display">{initial ? "Edit Application" : "Add Application"}</SheetTitle>
            <SheetDescription className="text-muted-foreground">Track a new role or update an existing one.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-4 py-2 flex-1">{body}</div>
          <SheetFooter className="px-4 pb-6">{footer}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border text-foreground sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-display">{initial ? "Edit Application" : "Add Application"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Track a new role or update an existing one.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-2">{body}</div>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-500 text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}