"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateEventSettings } from "@/lib/dashboard/actions";
import type { EventSettingsDTO } from "@/lib/dashboard/types";
import type { CategoryLayout, ResultsPolicy } from "@/lib/db/schema";
import { Badge, Card, GhostButton, PageHeader, PrimaryButton } from "./ui";
import {
  Field,
  FormError,
  inputClass,
  selectClass,
  Spinner,
} from "./modal";

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function SettingsForm({ settings }: { settings: EventSettingsDTO }) {
  const router = useRouter();
  const [eventName, setEventName] = useState(settings.eventName);
  const [tagline, setTagline] = useState(settings.tagline ?? "");
  const [description, setDescription] = useState(settings.description ?? "");
  const [contactEmail, setContactEmail] = useState(settings.contactEmail ?? "");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(settings.bannerUrl ?? "");
  const [primaryColor, setPrimaryColor] = useState(
    settings.primaryColor ?? "#1e3a8a",
  );
  const [accentColor, setAccentColor] = useState(
    settings.accentColor ?? "#f59e0b",
  );
  const [categoryLayout, setCategoryLayout] = useState<CategoryLayout>(
    settings.categoryLayout,
  );
  const [resultsPolicy, setResultsPolicy] = useState(settings.resultsPolicy);
  const [opensAt, setOpensAt] = useState(toLocalInputValue(settings.opensAt));
  const [closesAt, setClosesAt] = useState(toLocalInputValue(settings.closesAt));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleReset() {
    setEventName(settings.eventName);
    setTagline(settings.tagline ?? "");
    setDescription(settings.description ?? "");
    setContactEmail(settings.contactEmail ?? "");
    setLogoUrl(settings.logoUrl ?? "");
    setBannerUrl(settings.bannerUrl ?? "");
    setPrimaryColor(settings.primaryColor ?? "#1e3a8a");
    setAccentColor(settings.accentColor ?? "#f59e0b");
    setCategoryLayout(settings.categoryLayout);
    setResultsPolicy(settings.resultsPolicy);
    setOpensAt(toLocalInputValue(settings.opensAt));
    setClosesAt(toLocalInputValue(settings.closesAt));
    setError(null);
    setSaved(false);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await updateEventSettings({
      eventName,
      tagline,
      description,
      contactEmail,
      logoUrl,
      bannerUrl,
      primaryColor,
      accentColor,
      categoryLayout,
      resultsPolicy,
      opensAt,
      closesAt,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Event Settings"
        subtitle="Configure the voting event identity, schedule and results policy."
        action={
          <Badge tone={saved ? "open" : "closed"}>
            {saved ? "Saved ✓" : "Changes persist on save"}
          </Badge>
        }
      />

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <FormError message={error} />

        <Card delay={60}>
          <h2 className="font-display text-base font-semibold text-blue-950">
            Event identity
          </h2>
          <p className="text-xs text-zinc-500">
            Shown to voters on the public voting page.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Event name">
              <input
                className={inputClass}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                maxLength={80}
                required
              />
            </Field>
            <Field label="Tagline">
              <input
                className={inputClass}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                maxLength={120}
              />
            </Field>
            <Field label="Contact email" hint="Voter enquiries land here.">
              <input
                type="email"
                className={inputClass}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </Field>
            <Field label="Results policy">
              <select
                className={selectClass}
                value={resultsPolicy}
                onChange={(e) =>
                  setResultsPolicy(e.target.value as ResultsPolicy)
                }
              >
                <option value="live">Live updates while voting</option>
                <option value="close">Reveal when voting closes</option>
                <option value="manual">Manual reveal by admin</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field
                label="Event description"
                hint="Optional, max 500 characters. Shown to voters on the public page."
              >
                <textarea
                  className={`${inputClass} h-24 resize-none py-2.5`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card delay={110}>
          <h2 className="font-display text-base font-semibold text-blue-950">
            Appearance
          </h2>
          <p className="text-xs text-zinc-500">
            Logo, banner, brand colors and how categories are presented.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Logo URL" hint="https://… or /path under public/.">
              <input
                className={inputClass}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                maxLength={500}
                placeholder="/img/logo.png"
              />
            </Field>
            <Field label="Banner URL" hint="Optional hero banner image.">
              <input
                className={inputClass}
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                maxLength={500}
                placeholder="https://…"
              />
            </Field>
            <Field label="Primary color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  aria-label="Primary color picker"
                  className="h-11 w-14 cursor-pointer rounded-xl border border-blue-200 bg-white p-1"
                />
                <input
                  className={inputClass}
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  maxLength={7}
                  pattern="#[0-9a-fA-F]{6}"
                />
              </div>
            </Field>
            <Field label="Accent color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  aria-label="Accent color picker"
                  className="h-11 w-14 cursor-pointer rounded-xl border border-blue-200 bg-white p-1"
                />
                <input
                  className={inputClass}
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  maxLength={7}
                  pattern="#[0-9a-fA-F]{6}"
                />
              </div>
            </Field>
            <Field
              label="Category presentation"
              hint="How categories are laid out on the public voting page."
            >
              <select
                className={selectClass}
                value={categoryLayout}
                onChange={(e) =>
                  setCategoryLayout(e.target.value as CategoryLayout)
                }
              >
                <option value="grid">Grid of cards</option>
                <option value="list">Vertical list</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card delay={140}>
          <h2 className="font-display text-base font-semibold text-blue-950">
            Voting schedule
          </h2>
          <p className="text-xs text-zinc-500">Controls when ballots are accepted.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Voting opens">
              <input
                type="datetime-local"
                className={inputClass}
                value={opensAt}
                onChange={(e) => setOpensAt(e.target.value)}
              />
            </Field>
            <Field label="Voting closes">
              <input
                type="datetime-local"
                className={inputClass}
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <div
          className="animate-fade-in-up flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
          style={{ animationDelay: "220ms" }}
        >
          <GhostButton onClick={handleReset}>Reset</GhostButton>
          <PrimaryButton type="submit" disabled={busy}>
            {busy && <Spinner />}
            {saved ? "Saved ✓" : "Save Settings"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
