"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  createVoter,
  deleteVoter,
  updateVoter,
} from "@/lib/dashboard/actions";
import type { VoterDTO } from "@/lib/dashboard/types";
import { Badge, Card, PageHeader, PrimaryButton, StatCard } from "./ui";
import {
  Field,
  FormError,
  inputClass,
  Modal,
  selectClass,
  Spinner,
} from "./modal";

const STATUS_FILTERS = ["all", "verified", "pending", "blocked"] as const;
const STATUSES = ["verified", "pending", "blocked"] as const;

const CHECK_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.4-4-4 1.6-1.6 2.4 2.4 5.8-5.8 1.6 1.6-7.4 7.4Z" />
  </svg>
);

const CLOCK_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3Z" />
  </svg>
);

const BOX_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7 14H7v-2h5v2Zm5-4H7v-2h10v2Zm0-4H7V7h10v2Z" />
  </svg>
);

interface FormState {
  name: string;
  email: string;
  status: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", status: "pending" };

export function VotersManager({ voters }: { voters: VoterDTO[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<VoterDTO | null>(null);
  const [deleting, setDeleting] = useState<VoterDTO | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return voters.filter((voter) => {
      const matchesQuery =
        q === "" ||
        voter.name.toLowerCase().includes(q) ||
        voter.email.toLowerCase().includes(q);
      const matchesStatus = status === "all" || voter.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, voters]);

  const verified = voters.filter((v) => v.status === "verified").length;
  const voted = voters.filter((v) => v.hasVoted).length;

  function openCreate() {
    setForm(EMPTY_FORM);
    setError(null);
    setCreating(true);
  }

  function openEdit(voter: VoterDTO) {
    setForm({ name: voter.name, email: voter.email, status: voter.status });
    setError(null);
    setEditing(voter);
  }

  function closeAll() {
    if (busy) return;
    setCreating(false);
    setEditing(null);
    setDeleting(null);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = editing
      ? await updateVoter(editing.id, form)
      : await createVoter(form);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCreating(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    setError(null);
    const result = await deleteVoter(deleting.id);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Voter Management"
        subtitle="Review registrations, verification status and participation."
        action={<PrimaryButton onClick={openCreate}>+ Add Voter</PrimaryButton>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Voters" value={String(voters.length)} hint="All registrations" icon={CHECK_ICON} delay={60} />
        <StatCard label="Verified" value={String(verified)} hint="Ready to vote" icon={CLOCK_ICON} delay={120} tone="gold" />
        <StatCard label="Votes Cast" value={String(voted)} hint="Voters who participated" icon={BOX_ICON} delay={180} />
      </div>

      <Card delay={240} animate={false}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
            >
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email..."
              className="h-10 w-full rounded-xl border border-blue-200 bg-white pr-3 pl-9 text-sm text-blue-950 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatus(filter)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-all duration-200 active:scale-95 ${
                  status === filter
                    ? "border-blue-950 bg-blue-950 text-amber-400"
                    : "border-blue-200 bg-white text-blue-900 hover:bg-blue-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-blue-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="py-3 pr-4 font-semibold">Voter</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Voted</th>
                <th className="py-3 pr-4 font-semibold">Joined</th>
                <th className="py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((voter, index) => (
                <tr
                  key={voter.id}
                  className="animate-fade-in-up border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/50"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-950 text-xs font-bold text-amber-400">
                        {voter.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-blue-950">{voter.name}</p>
                        <p className="truncate text-xs text-zinc-400">{voter.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge tone={voter.status}>{voter.status}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    {voter.hasVoted ? (
                      <span className="text-emerald-600" title="Voted">
                        ✓ Yes
                      </span>
                    ) : (
                      <span className="text-zinc-400">— No</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-zinc-500">{voter.joinedAt}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(voter)}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-blue-200 bg-white px-3 text-xs font-medium text-blue-900 transition-all hover:bg-blue-50 active:scale-[0.98]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setDeleting(voter);
                        }}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-xs font-medium text-red-600 transition-all hover:bg-red-50 active:scale-[0.98]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-zinc-500">
              {voters.length === 0
                ? "No voters yet. Add your first voter."
                : "No voters match your search."}
            </p>
          )}
        </div>
      </Card>

      <Modal
        open={creating || editing !== null}
        onClose={closeAll}
        title={editing ? "Edit voter" : "Add voter"}
        description={
          editing
            ? "Update this voter's registration details."
            : "Register a new voter for this event."
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormError message={error} />
          <Field label="Full name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              maxLength={100}
              required
              autoFocus
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              maxLength={120}
              required
            />
          </Field>
          <Field label="Status">
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeAll}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-blue-900 transition-all hover:bg-blue-50 active:scale-[0.98]"
            >
              Cancel
            </button>
            <PrimaryButton type="submit" disabled={busy}>
              {busy && <Spinner />}
              {editing ? "Save Changes" : "Add Voter"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={closeAll}
        title="Delete voter?"
        description={
          deleting
            ? `"${deleting.name}" will be unregistered and their votes removed.`
            : undefined
        }
      >
        <div className="flex flex-col gap-4">
          <FormError message={error} />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeAll}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-blue-900 transition-all hover:bg-blue-50 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Spinner />}
              Delete Voter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
