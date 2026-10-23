"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  createNominee,
  deleteNominee,
  setNomineeStatus,
  updateNominee,
} from "@/lib/dashboard/actions";
import type { NomineeDTO } from "@/lib/dashboard/types";
import { Badge, Card, PageHeader, PrimaryButton, ProgressBar } from "./ui";
import {
  Field,
  FormError,
  inputClass,
  Modal,
  selectClass,
  Spinner,
} from "./modal";

interface FormState {
  name: string;
  description: string;
  photoUrl: string;
  department: string;
  biography: string;
  status: string;
  categoryId: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  photoUrl: "",
  department: "",
  biography: "",
  status: "active",
  categoryId: "",
};

function NomineeAvatar({
  nominee,
  className = "h-10 w-10 text-sm",
}: {
  nominee: Pick<NomineeDTO, "name" | "photoUrl">;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (nominee.photoUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={nominee.photoUrl}
        alt=""
        onError={() => setBroken(true)}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }
  const initials = nominee.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700 ${className}`}
    >
      {initials || "?"}
    </span>
  );
}

export function NomineesManager({
  nominees,
  categories,
}: {
  nominees: NomineeDTO[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<NomineeDTO | null>(null);
  const [deleting, setDeleting] = useState<NomineeDTO | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const nominee of nominees) {
      totals.set(
        nominee.categoryId,
        (totals.get(nominee.categoryId) ?? 0) + nominee.voteCount,
      );
    }
    return totals;
  }, [nominees]);

  const filtered = useMemo(() => {
    const list =
      activeCategory === "All"
        ? nominees
        : nominees.filter((n) => n.categoryName === activeCategory);
    return [...list].sort((a, b) => b.voteCount - a.voteCount);
  }, [activeCategory, nominees]);

  const tabs = ["All", ...categories.map((c) => c.name)];

  function openCreate() {
    setForm({
      ...EMPTY_FORM,
      categoryId: categories[0]?.id ?? "",
    });
    setError(null);
    setCreating(true);
  }

  function openEdit(nominee: NomineeDTO) {
    setForm({
      name: nominee.name,
      description: nominee.description ?? "",
      photoUrl: nominee.photoUrl ?? "",
      department: nominee.department ?? "",
      biography: nominee.biography ?? "",
      status: nominee.status,
      categoryId: nominee.categoryId,
    });
    setError(null);
    setEditing(nominee);
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
      ? await updateNominee(editing.id, form)
      : await createNominee(form);
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
    const result = await deleteNominee(deleting.id);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDeleting(null);
    router.refresh();
  }

  async function handleStatusToggle(nominee: NomineeDTO) {
    const next = nominee.status === "withdrawn" ? "active" : "withdrawn";
    setBusy(true);
    setError(null);
    const result = await setNomineeStatus(nominee.id, next);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nominees"
        subtitle="Browse and track every nominee across the award categories."
        action={<PrimaryButton onClick={openCreate}>+ Add Nominee</PrimaryButton>}
      />

      <div className="animate-fade-in-up -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveCategory(tab)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
              activeCategory === tab
                ? "border-blue-950 bg-blue-950 text-amber-400 shadow-md shadow-blue-950/20"
                : "border-blue-200 bg-white text-blue-900 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((nominee, index) => {
          const total = Math.max(1, categoryTotals.get(nominee.categoryId) ?? 1);
          const share = Math.round((nominee.voteCount / total) * 100);
          return (
            <Card key={nominee.id} delay={index * 60}>
              <div className="flex items-center gap-3">
                <NomineeAvatar nominee={nominee} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-blue-950">
                    {nominee.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {nominee.categoryName}
                    {nominee.department ? ` · ${nominee.department}` : ""}
                  </p>
                </div>
                <Badge tone={nominee.status}>{nominee.status}</Badge>
              </div>

              {nominee.description && (
                <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                  {nominee.description}
                </p>
              )}
              {nominee.biography && (
                <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                  {nominee.biography}
                </p>
              )}

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-2xl font-semibold text-blue-950">
                    {nominee.voteCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-400">votes</p>
                </div>
                <p className="text-sm font-medium text-amber-600">{share}%</p>
              </div>

              <div className="mt-3">
                <ProgressBar value={share} tone={index % 2 === 0 ? "blue" : "gold"} />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(nominee)}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-blue-900 transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleStatusToggle(nominee)}
                  className={`inline-flex h-10 flex-1 items-center justify-center rounded-xl border px-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 ${
                    nominee.status === "withdrawn"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {nominee.status === "withdrawn" ? "Restore" : "Withdraw"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setDeleting(nominee);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-all hover:bg-red-50 active:scale-[0.98]"
                >
                  Delete
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card animate={false} className="py-12 text-center">
          <p className="text-sm text-zinc-500">
            {nominees.length === 0
              ? "No nominees yet. Add your first nominee."
              : "No nominees in this category yet."}
          </p>
        </Card>
      )}

      <Modal
        open={creating || editing !== null}
        onClose={closeAll}
        title={editing ? "Edit nominee" : "Add nominee"}
        description={
          editing
            ? "Update this nominee's details."
            : "Add a nominee to one of the award categories."
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormError message={error} />
          <Field label="Name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              maxLength={80}
              required
              autoFocus
            />
          </Field>
          <Field label="Description" hint="Optional, max 200 characters.">
            <textarea
              className={`${inputClass} h-24 resize-none py-2.5`}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              maxLength={200}
            />
          </Field>
          <Field label="Category">
            <select
              className={selectClass}
              value={form.categoryId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              required
            >
              {categories.length === 0 && (
                <option value="">No categories available</option>
              )}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Photograph"
              hint="Optional image URL (https://… or /path)."
            >
              <input
                className={inputClass}
                value={form.photoUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, photoUrl: e.target.value }))
                }
                maxLength={500}
                placeholder="https://…"
              />
            </Field>
            <Field label="Department / genre" hint="Optional, max 100 characters.">
              <input
                className={inputClass}
                value={form.department}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, department: e.target.value }))
                }
                maxLength={100}
                placeholder="e.g. Afro-pop"
              />
            </Field>
          </div>
          <Field label="Biography" hint="Optional, max 1000 characters.">
            <textarea
              className={`${inputClass} h-24 resize-none py-2.5`}
              value={form.biography}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, biography: e.target.value }))
              }
              maxLength={1000}
            />
          </Field>
          <Field
            label="Status"
            hint="Withdrawn nominees stay in results history but cannot receive votes."
          >
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="active">active</option>
              <option value="withdrawn">withdrawn</option>
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
            <PrimaryButton
              type="submit"
              disabled={busy || categories.length === 0}
            >
              {busy && <Spinner />}
              {editing ? "Save Changes" : "Add Nominee"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={closeAll}
        title="Delete nominee?"
        description={
          deleting
            ? `"${deleting.name}" and their votes will be permanently removed.`
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
              Delete Nominee
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
