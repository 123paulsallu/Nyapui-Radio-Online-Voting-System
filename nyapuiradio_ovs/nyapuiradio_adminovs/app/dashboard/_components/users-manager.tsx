"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/dashboard/user-actions";
import type {
  AccessAction,
  DashboardModule,
  UserRole,
} from "@/lib/db/schema";
import type { PermissionMatrix, UserDTO } from "@/lib/dashboard/types";
import { Badge, Card, GhostButton, PrimaryButton, type BadgeTone } from "./ui";
import {
  Field,
  FormError,
  inputClass,
  Modal,
  selectClass,
  Spinner,
} from "./modal";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "super", label: "Super Admin — full access, including users" },
  { value: "admin", label: "Admin — manage content, voting & settings" },
  { value: "editor", label: "Editor — manage categories, nominees & voters" },
  { value: "viewer", label: "Viewer — read-only access" },
  { value: "custom", label: "Custom — build the permission matrix below" },
];

const ROLE_TONES: Record<UserRole, BadgeTone> = {
  super: "gold",
  admin: "blue",
  editor: "active",
  viewer: "closed",
  custom: "draft",
};

const ROLE_SUMMARY: Record<Exclude<UserRole, "custom">, string> = {
  super: "Everything, including user management.",
  admin:
    "Create, edit, delete categories, nominees and voters; control voting, results, settings and reports.",
  editor:
    "Create, edit, delete categories, nominees and voters; view votes, results and integrity.",
  viewer:
    "Read-only access to overview, categories, nominees, voters, votes, results and integrity.",
};

const MODULE_ROWS: { key: DashboardModule; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "categories", label: "Award Categories" },
  { key: "nominees", label: "Nominees" },
  { key: "voters", label: "Voter Management" },
  { key: "votes", label: "Vote Management" },
  { key: "voting-control", label: "Voting Control" },
  { key: "results", label: "Results & Reports" },
  { key: "integrity", label: "Data Integrity" },
  { key: "settings", label: "Event Settings" },
];

const ACCESS_COLUMNS: { key: AccessAction; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
];

function emptyMatrix(): PermissionMatrix {
  const matrix = {} as PermissionMatrix;
  for (const mod of MODULE_ROWS) {
    matrix[mod.key] = { view: false, create: false, update: false, delete: false };
  }
  matrix.overview.view = true;
  matrix.users = { view: false, create: false, update: false, delete: false };
  return matrix;
}

interface FormState {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  permissions: PermissionMatrix;
}

const EMPTY_FORM: FormState = {
  username: "",
  password: "",
  fullName: "",
  role: "viewer",
  permissions: emptyMatrix(),
};

function visibleModuleCount(permissions: PermissionMatrix): number {
  return MODULE_ROWS.filter((row) => permissions[row.key]?.view).length;
}

export function UsersManager({
  users,
  currentUserId,
}: {
  users: UserDTO[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<UserDTO | null>(null);
  const [deleting, setDeleting] = useState<UserDTO | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(needle) ||
        (user.fullName ?? "").toLowerCase().includes(needle) ||
        user.role.toLowerCase().includes(needle),
    );
  }, [users, query]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setError(null);
    setCreating(true);
  }

  function openEdit(user: UserDTO) {
    setForm({
      username: user.username,
      password: "",
      fullName: user.fullName ?? "",
      role: user.role,
      permissions: { ...emptyMatrix(), ...user.permissions },
    });
    setError(null);
    setEditing(user);
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
    const ok = await run(() =>
      editing
        ? updateUser(editing.id, {
            fullName: form.fullName,
            role: form.role,
            password: form.password || undefined,
            permissions: form.permissions,
          })
        : createUser({
            username: form.username,
            password: form.password,
            fullName: form.fullName,
            role: form.role,
            permissions: form.permissions,
          }),
    );
    if (ok) closeAll();
  }

  async function handleDelete() {
    if (!deleting) return;
    const ok = await run(() => deleteUser(deleting.id));
    if (ok) closeAll();
  }

  function toggleAccess(mod: DashboardModule, action: AccessAction) {
    setForm((prev) => {
      const permissions: PermissionMatrix = {
        ...prev.permissions,
        [mod]: {
          ...prev.permissions[mod],
          [action]: !prev.permissions[mod][action],
        },
      };
      if (action === "view" && !permissions[mod].view) {
        permissions[mod] = {
          view: false,
          create: false,
          update: false,
          delete: false,
        };
      }
      if (action !== "view" && !permissions[mod].view) {
        permissions[mod].view = true;
      }
      permissions.overview.view = true;
      return { ...prev, permissions };
    });
  }

  const isSelf = (user: UserDTO | null) => user?.id === currentUserId;

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in-up flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500 sm:text-base">
            Add dashboard users, assign roles and fine-tune module permissions.
            Only Super Admins can manage users.
          </p>
        </div>
        <PrimaryButton onClick={openCreate}>+ New User</PrimaryButton>
      </div>

      <FormError message={error} />

      <Card animate={false}>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400"
          >
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by username, name or role…"
            className={`${inputClass} pl-10`}
          />
        </div>
      </Card>

      <Card animate={false} className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-blue-100 text-xs uppercase tracking-wider text-zinc-400">
              <th className="px-5 py-3.5 font-medium">User</th>
              <th className="px-5 py-3.5 font-medium">Role</th>
              <th className="px-5 py-3.5 font-medium">Modules</th>
              <th className="px-5 py-3.5 font-medium">Created</th>
              <th className="px-5 py-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b border-blue-50 transition-colors last:border-0 hover:bg-blue-50/40"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-amber-400">
                      {(user.fullName ?? user.username).charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-blue-950">
                        {user.username}
                        {user.id === currentUserId && (
                          <span className="ml-2 text-xs font-normal text-zinc-400">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {user.fullName ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Badge tone={ROLE_TONES[user.role]}>{user.role}</Badge>
                </td>
                <td className="px-5 py-3.5 text-zinc-600">
                  {user.role === "super"
                    ? "All modules"
                    : `${visibleModuleCount(user.permissions)} of ${MODULE_ROWS.length}`}
                </td>
                <td className="px-5 py-3.5 text-zinc-500">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <GhostButton onClick={() => openEdit(user)}>
                      Edit
                    </GhostButton>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setDeleting(user);
                      }}
                      disabled={user.id === currentUserId}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-zinc-400"
                >
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        open={creating || editing !== null}
        onClose={closeAll}
        title={editing ? `Edit ${editing.username}` : "New User"}
        description={
          editing
            ? "Update the profile, role and permissions for this dashboard user."
            : "Create a dashboard account and choose what it can access."
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormError message={error} />

          <Field label="Username">
            <input
              type="text"
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  username: event.target.value.toLowerCase(),
                }))
              }
              disabled={editing !== null}
              required
              minLength={3}
              maxLength={32}
              pattern="[a-z0-9_.\-]{3,32}"
              title="3–32 characters: letters, numbers, dot, dash or underscore"
              className={`${inputClass} disabled:bg-zinc-50 disabled:text-zinc-500`}
            />
          </Field>

          <Field label="Full name">
            <input
              type="text"
              value={form.fullName}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }))
              }
              maxLength={100}
              className={inputClass}
            />
          </Field>

          <Field
            label="Password"
            hint={
              editing
                ? "Leave blank to keep the current password."
                : "At least 8 characters."
            }
          >
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required={!editing}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className={inputClass}
            />
          </Field>

          <Field label="Role">
            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  role: event.target.value as UserRole,
                }))
              }
              disabled={isSelf(editing)}
              className={`${selectClass} disabled:bg-zinc-50 disabled:text-zinc-500`}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          {isSelf(editing) && (
            <p className="text-xs text-zinc-400">
              You cannot change your own role or permissions.
            </p>
          )}

          {form.role !== "custom" && form.role !== "super" && (
            <p className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
              {ROLE_SUMMARY[form.role]}
            </p>
          )}
          {form.role === "super" && (
            <p className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {ROLE_SUMMARY.super}
            </p>
          )}

          {form.role === "custom" && (
            <div className="overflow-x-auto rounded-xl border border-blue-100">
              <table className="w-full min-w-[420px] text-left text-xs">
                <thead>
                  <tr className="border-b border-blue-100 bg-blue-50/60 text-zinc-500">
                    <th className="px-3 py-2 font-medium">Module</th>
                    {ACCESS_COLUMNS.map((column) => (
                      <th
                        key={column.key}
                        className="px-3 py-2 text-center font-medium"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULE_ROWS.map((row) => (
                    <tr
                      key={row.key}
                      className="border-b border-blue-50 last:border-0"
                    >
                      <td className="px-3 py-1.5 font-medium text-blue-950">
                        {row.label}
                      </td>
                      {ACCESS_COLUMNS.map((column) => (
                        <td
                          key={column.key}
                          className="px-3 py-1.5 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={form.permissions[row.key][column.key]}
                            onChange={() =>
                              toggleAccess(row.key, column.key)
                            }
                            disabled={
                              row.key === "overview" && column.key === "view"
                            }
                            className="h-4 w-4 rounded border-blue-300 accent-blue-900 disabled:opacity-50"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-zinc-400">
            The sidebar only shows permitted modules, and every action is
            re-checked on the server. User management itself stays with Super
            Admins.
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <GhostButton onClick={closeAll}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={busy}>
              {busy ? <Spinner /> : editing ? "Save Changes" : "Create User"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={closeAll}
        title="Delete user"
        description={
          deleting
            ? `This permanently removes "${deleting.username}" and their permissions.`
            : undefined
        }
      >
        <div className="flex flex-col gap-4">
          <FormError message={error} />
          <p className="text-sm text-zinc-600">
            Any active sessions for this account will stop working immediately.
          </p>
          <div className="flex justify-end gap-2">
            <GhostButton onClick={closeAll}>Cancel</GhostButton>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Spinner /> : "Delete User"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
