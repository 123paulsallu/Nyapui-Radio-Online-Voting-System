"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  createCategory,
  deleteCategory,
  moveCategory,
  setCategoryStatus,
  updateCategory,
} from "@/lib/dashboard/actions";
import type { CategoryDTO } from "@/lib/dashboard/types";
import { Badge, Card, GhostButton, PrimaryButton } from "./ui";
import {
  Field,
  FormError,
  inputClass,
  Modal,
  selectClass,
  Spinner,
} from "./modal";

const STATUSES = ["draft", "open", "closed"] as const;
const STATUS_FILTERS = ["all", ...STATUSES] as const;

interface FormState {
  name: string;
  description: string;
  status: string;
}

const EMPTY_FORM: FormState = { name: "", description: "", status: "draft" };

export function CategoriesManager({
  categories,
}: {
  categories: CategoryDTO[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<CategoryDTO | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    (typeof STATUS_FILTERS)[number]
  >("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return categories.filter((category) => {
      if (statusFilter !== "all" && category.status !== statusFilter) {
        return false;
      }
      if (!needle) return true;
      return (
        category.name.toLowerCase().includes(needle) ||
        (category.description ?? "").toLowerCase().includes(needle)
      );
    });
  }, [categories, query, statusFilter]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setError(null);
    setCreating(true);
  }

  function openEdit(category: CategoryDTO) {
    setForm({
      name: category.name,
      description: category.description ?? "",
      status: category.status,
    });
    setError(null);
    setEditing(category);
  }

  function closeAll() {
    if (busy) return;
    setCreating(false);
    setEditing(null);
    setDeleting(null);
    setError(null);
  }

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setBusy(true);
    return action().then((result) => {
      setBusy(false);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return false;
      }
      router.refresh();
      return true;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      status: form.status,
    };
    const ok = await run(() =>
      editing ? updateCategory(editing.id, payload) : createCategory(payload),
    );
    if (ok) closeAll();
  }

  async function handleDelete() {
    if (!deleting) return;
    const ok = await run(() => deleteCategory(deleting.id));
    if (ok) closeAll();
  }

  function toggleStatus(category: CategoryDTO) {
    const next = category.status === "open" ? "closed" : "open";
    void run(() => setCategoryStatus(category.id, next));
  }

  function reorder(category: CategoryDTO, direction: "up" | "down") {
    void run(() => moveCategory(category.id, direction));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in-up flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
            Award Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-500 sm:text-base">
            Search, activate and organize the award categories open for voting.
          </p>
        </div>
        <PrimaryButton onClick={openCreate}>+ New Category</PrimaryButton>
      </div>

      <FormError message={error} />

      <Card animate={false}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            >
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
            <input
              className={`${inputClass} pl-10`}
              placeholder="Search categories by name or description…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search categories"
            />
          </div>
          <div
            className="flex gap-1 rounded-xl border border-blue-100 bg-slate-50 p-1"
            role="group"
            aria-label="Filter by status"
          >
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`h-9 rounded-lg px-3 text-xs font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-blue-950 text-amber-400"
                    : "text-zinc-500 hover:bg-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card animate={false} className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-blue-100 bg-slate-50/70 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Nominees</th>
              <th className="px-4 py-3 font-medium">Votes</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((category) => {
              const originalIndex = categories.findIndex(
                (item) => item.id === category.id,
              );
              return (
                <tr
                  key={category.id}
                  className="border-b border-blue-50 transition-colors last:border-0 hover:bg-blue-50/40"
                >
                  <td className="px-4 py-3 text-zinc-400">{originalIndex + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-blue-950">{category.name}</p>
                    <p className="mt-0.5 max-w-md truncate text-xs text-zinc-400">
                      {category.description ?? "No description"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={category.status}>{category.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {category.nomineeCount}
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-950">
                    {category.voteCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        disabled={busy || originalIndex === 0}
                        onClick={() => reorder(category, "up")}
                        aria-label={`Move ${category.name} up`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 text-zinc-500 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6Z" /></svg>
                      </button>
                      <button
                        type="button"
                        disabled={busy || originalIndex === categories.length - 1}
                        onClick={() => reorder(category, "down")}
                        aria-label={`Move ${category.name} down`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 text-zinc-500 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="m12 16-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10l-6 6Z" /></svg>
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggleStatus(category)}
                        className={`h-8 rounded-lg border px-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          category.status === "open"
                            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {category.status === "open" ? "Deactivate" : "Activate"}
                      </button>
                      <GhostButton
                        onClick={() => openEdit(category)}
                        disabled={busy}
                      >
                        <span className="sr-only sm:not-sr-only">Edit</span>
                      </GhostButton>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setError(null);
                          setDeleting(category);
                        }}
                        className="h-8 rounded-lg border border-red-200 bg-white px-2.5 text-xs font-medium text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            {categories.length === 0
              ? "No categories yet. Create your first award category."
              : "No categories match your search."}
          </p>
        )}
      </Card>

      <Modal
        open={creating || editing !== null}
        onClose={closeAll}
        title={editing ? "Edit category" : "New category"}
        description={
          editing
            ? "Update this award category's details."
            : "Add a new award category to the event."
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
          <Field label="Status">
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <GhostButton onClick={closeAll}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={busy}>
              {busy && <Spinner />}
              {editing ? "Save Changes" : "Create Category"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={closeAll}
        title="Delete category?"
        description={
          deleting
            ? `"${deleting.name}" and its nominees and votes will be permanently removed.`
            : undefined
        }
      >
        <div className="flex flex-col gap-4">
          <FormError message={error} />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <GhostButton onClick={closeAll}>Cancel</GhostButton>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Spinner />}
              Delete Category
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
