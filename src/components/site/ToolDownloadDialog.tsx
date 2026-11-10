import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(200),
  company: z.string().trim().min(1, "Enter your company").max(200),
  email: z.string().trim().email("Enter a valid email").max(255),
});

type Props = { open: boolean; onOpenChange: (o: boolean) => void; toolId: string; toolName: string; downloadUrl: string };

const ToolDownloadDialog = ({ open, onOpenChange, toolId, toolName, downloadUrl }: Props) => {
  const [form, setForm] = useState({ name: "", company: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setBusy(true); setError(null);
    const { name, company, email } = parsed.data as { name: string; company: string; email: string };
    const { error: err } = await supabase.from("tool_customers").insert({ name, company, email, tool_id: toolId });
    setBusy(false);
    if (err) return setError("Something went wrong. Please try again.");
    const a = document.createElement("a");
    a.href = downloadUrl; a.download = ""; document.body.appendChild(a); a.click(); a.remove();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Download {toolName}</DialogTitle>
          <DialogDescription>Free to use. Tell us who you are so we can notify you about updates and new releases.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {(["name", "company", "email"] as const).map(f => (
            <div key={f} className="space-y-2">
              <Label htmlFor={`dl-${f}`} className="capitalize">{f}</Label>
              <Input id={`dl-${f}`} type={f === "email" ? "email" : "text"} required value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Preparing…" : "Download"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDownloadDialog;
