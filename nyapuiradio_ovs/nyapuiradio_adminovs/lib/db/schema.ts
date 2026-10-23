import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const CATEGORY_STATUSES = ["draft", "open", "closed"] as const;
export type CategoryStatus = (typeof CATEGORY_STATUSES)[number];

export const NOMINEE_STATUSES = ["active", "withdrawn"] as const;
export type NomineeStatus = (typeof NOMINEE_STATUSES)[number];

export const VOTER_STATUSES = ["pending", "verified", "blocked"] as const;
export type VoterStatus = (typeof VOTER_STATUSES)[number];

export const VOTING_STATES = ["open", "paused", "closed"] as const;
export type VotingState = (typeof VOTING_STATES)[number];

export const RESULTS_POLICIES = ["live", "close", "manual"] as const;
export type ResultsPolicy = (typeof RESULTS_POLICIES)[number];

export const CATEGORY_LAYOUTS = ["grid", "list"] as const;
export type CategoryLayout = (typeof CATEGORY_LAYOUTS)[number];

export const USER_ROLES = ["super", "admin", "editor", "viewer", "custom"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const DASHBOARD_MODULES = [
  "overview",
  "categories",
  "nominees",
  "voters",
  "votes",
  "voting-control",
  "results",
  "integrity",
  "settings",
  "users",
] as const;
export type DashboardModule = (typeof DASHBOARD_MODULES)[number];

export const ACCESS_ACTIONS = ["view", "create", "update", "delete"] as const;
export type AccessAction = (typeof ACCESS_ACTIONS)[number];

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 100 }),
    role: varchar("role", { length: 20 })
      .$type<UserRole>()
      .notNull()
      .default("admin"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "users_role_check",
      sql`${table.role} in ('super', 'admin', 'editor', 'viewer', 'custom')`,
    ),
  ],
);

export const userPermissions = pgTable(
  "user_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    module: varchar("module", { length: 30 })
      .$type<DashboardModule>()
      .notNull(),
    canView: boolean("can_view").notNull().default(false),
    canCreate: boolean("can_create").notNull().default(false),
    canUpdate: boolean("can_update").notNull().default(false),
    canDelete: boolean("can_delete").notNull().default(false),
  },
  (table) => [
    unique("user_permissions_user_module_unique").on(
      table.userId,
      table.module,
    ),
    check(
      "user_permissions_module_check",
      sql`${table.module} in ('overview', 'categories', 'nominees', 'voters', 'votes', 'voting-control', 'results', 'integrity', 'settings', 'users')`,
    ),
  ],
);

export const awardCategories = pgTable(
  "award_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 80 }).notNull().unique(),
    description: varchar("description", { length: 200 }),
    status: varchar("status", { length: 20 })
      .$type<CategoryStatus>()
      .notNull()
      .default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "award_categories_status_check",
      sql`${table.status} in ('draft', 'open', 'closed')`,
    ),
    check("award_categories_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const nominees = pgTable(
  "nominees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => awardCategories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull(),
    description: varchar("description", { length: 200 }),
    photoUrl: varchar("photo_url", { length: 500 }),
    department: varchar("department", { length: 100 }),
    biography: varchar("biography", { length: 1000 }),
    status: varchar("status", { length: 20 })
      .$type<NomineeStatus>()
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "nominees_status_check",
      sql`${table.status} in ('active', 'withdrawn')`,
    ),
  ],
);

export const voters = pgTable(
  "voters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 120 }).notNull().unique(),
    status: varchar("status", { length: 20 })
      .$type<VoterStatus>()
      .notNull()
      .default("pending"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "voters_status_check",
      sql`${table.status} in ('pending', 'verified', 'blocked')`,
    ),
  ],
);

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    voterId: uuid("voter_id")
      .notNull()
      .references(() => voters.id, { onDelete: "cascade" }),
    nomineeId: uuid("nominee_id")
      .notNull()
      .references(() => nominees.id, { onDelete: "cascade" }),
    castAt: timestamp("cast_at").defaultNow().notNull(),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 400 }),
    deviceHint: varchar("device_hint", { length: 120 }),
  },
  (table) => [
    unique("votes_voter_nominee_unique").on(table.voterId, table.nomineeId),
  ],
);

export const eventSettings = pgTable(
  "event_settings",
  {
    id: varchar("id", { length: 32 }).primaryKey(),
    eventName: varchar("event_name", { length: 80 }).notNull(),
    tagline: varchar("tagline", { length: 120 }),
    description: varchar("description", { length: 500 }),
    contactEmail: varchar("contact_email", { length: 120 }),
    logoUrl: varchar("logo_url", { length: 500 }),
    bannerUrl: varchar("banner_url", { length: 500 }),
    primaryColor: varchar("primary_color", { length: 20 }).default("#1e3a8a"),
    accentColor: varchar("accent_color", { length: 20 }).default("#f59e0b"),
    categoryLayout: varchar("category_layout", { length: 20 })
      .$type<CategoryLayout>()
      .notNull()
      .default("grid"),
    resultsPolicy: varchar("results_policy", { length: 20 })
      .$type<ResultsPolicy>()
      .notNull()
      .default("live"),
    resultsReleased: boolean("results_released").notNull().default(false),
    votingState: varchar("voting_state", { length: 20 })
      .$type<VotingState>()
      .notNull()
      .default("closed"),
    opensAt: timestamp("opens_at"),
    closesAt: timestamp("closes_at"),
    anonymous: boolean("anonymous").notNull().default(true),
    oneVotePerCategory: boolean("one_vote_per_category")
      .notNull()
      .default(true),
    resultsLive: boolean("results_live").notNull().default(false),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "event_settings_voting_state_check",
      sql`${table.votingState} in ('open', 'paused', 'closed')`,
    ),
    check(
      "event_settings_results_policy_check",
      sql`${table.resultsPolicy} in ('live', 'close', 'manual')`,
    ),
    check(
      "event_settings_category_layout_check",
      sql`${table.categoryLayout} in ('grid', 'list')`,
    ),
    check(
      "event_settings_primary_color_check",
      sql`${table.primaryColor} is null or ${table.primaryColor} ~ '^#[0-9a-fA-F]{6}$'`,
    ),
    check(
      "event_settings_accent_color_check",
      sql`${table.accentColor} is null or ${table.accentColor} ~ '^#[0-9a-fA-F]{6}$'`,
    ),
    check(
      "event_settings_schedule_check",
      sql`${table.opensAt} is null or ${table.closesAt} is null or ${table.opensAt} < ${table.closesAt}`,
    ),
  ],
);

export const adminAuditLog = pgTable("admin_audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id").references(() => users.id, { onDelete: "set null" }),
  adminName: varchar("admin_name", { length: 100 }),
  action: varchar("action", { length: 50 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: varchar("entity_id", { length: 64 }),
  detail: varchar("detail", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type UserPermission = typeof userPermissions.$inferSelect;
export type AwardCategory = typeof awardCategories.$inferSelect;
export type Nominee = typeof nominees.$inferSelect;
export type Voter = typeof voters.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type EventSettingsRow = typeof eventSettings.$inferSelect;
export type AdminAuditEntry = typeof adminAuditLog.$inferSelect;
