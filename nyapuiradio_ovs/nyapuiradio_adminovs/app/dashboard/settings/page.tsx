import { requireDashboard } from "@/lib/auth/guard";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventSettings } from "@/lib/db/schema";
import type { EventSettingsDTO } from "@/lib/dashboard/types";
import { SettingsForm } from "../_components/settings-form";

export const instant = false;

const DEFAULT_SETTINGS: EventSettingsDTO = {
  eventName: "Nyapui Radio Awards 2026",
  tagline: null,
  description: null,
  contactEmail: null,
  logoUrl: null,
  bannerUrl: null,
  primaryColor: "#1e3a8a",
  accentColor: "#f59e0b",
  categoryLayout: "grid",
  resultsPolicy: "live",
  resultsReleased: false,
  opensAt: null,
  closesAt: null,
  votingState: "closed",
  anonymous: true,
  oneVotePerCategory: true,
  resultsLive: false,
};

export default async function SettingsPage() {
  await requireDashboard("settings");
  const row = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.id, "main"))
    .limit(1);

  const settings: EventSettingsDTO = row[0]
    ? {
        eventName: row[0].eventName,
        tagline: row[0].tagline,
        description: row[0].description,
        contactEmail: row[0].contactEmail,
        logoUrl: row[0].logoUrl,
        bannerUrl: row[0].bannerUrl,
        primaryColor: row[0].primaryColor,
        accentColor: row[0].accentColor,
        categoryLayout: row[0].categoryLayout,
        resultsPolicy: row[0].resultsPolicy,
        resultsReleased: row[0].resultsReleased,
        opensAt: row[0].opensAt ? new Date(row[0].opensAt).toISOString() : null,
        closesAt: row[0].closesAt
          ? new Date(row[0].closesAt).toISOString()
          : null,
        votingState: row[0].votingState,
        anonymous: row[0].anonymous,
        oneVotePerCategory: row[0].oneVotePerCategory,
        resultsLive: row[0].resultsLive,
      }
    : DEFAULT_SETTINGS;

  return <SettingsForm settings={settings} />;
}
