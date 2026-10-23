import { eq } from "drizzle-orm";
import { db } from "./db/index";
import {
  adminAuditLog,
  awardCategories,
  eventSettings,
  nominees,
  userPermissions,
  users,
  votes,
  voters,
  type UserRole,
} from "./db/schema";
import { hashPassword } from "./auth/password";
import {
  matrixToRows,
  presetMatrix,
  type RolePreset,
} from "./auth/permissions";
import { hashIp, parseDeviceHint } from "./security/device";

const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "Nyapui001";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Nyapui@26";
const adminRole = process.env.SEED_ADMIN_ROLE ?? "super";

const STARTER_CATEGORIES = [
  { name: "Song of the Year", description: "The standout single released this voting season.", status: "open" as const },
  { name: "Artist of the Year", description: "The act with the most impactful year overall.", status: "open" as const },
  { name: "Best Newcomer", description: "Breakout talent in their first major release cycle.", status: "open" as const },
  { name: "Album of the Year", description: "Best full-length project of the season.", status: "open" as const },
  { name: "Music Video of the Year", description: "Most creative and memorable visual release.", status: "closed" as const },
  { name: "Lifetime Achievement", description: "Honouree selected by the Nyapui Radio panel.", status: "draft" as const },
];

interface NomineeSeed {
  name: string;
  department?: string;
  biography?: string;
  status?: "active" | "withdrawn";
}

const STARTER_NOMINEES: Record<string, NomineeSeed[]> = {
  "Song of the Year": [
    { name: "Awa Bling", department: "Afro-pop", biography: "Chart-topping single with record streaming numbers this season." },
    { name: "Kadi Nani", department: "Highlife", biography: "Fusion track that dominated regional radio playlists." },
    { name: "Exo T Star", department: "Dancehall", biography: "Club anthem with a massive grassroots following." },
    { name: "Lili Queen", department: "R&B", biography: "Soulful ballad praised by critics and fans alike." },
    { name: "Baba Sound", department: "Gospel", biography: "Uplifting release that crossed over to mainstream charts.", status: "withdrawn" },
  ],
  "Artist of the Year": [
    { name: "Ghazi Flame", department: "Hip-Hop", biography: "Prolific year with two mixtapes and a sold-out tour." },
    { name: "Malaika B", department: "Afro-pop", biography: "Consistent hits and major festival headlining slots." },
    { name: "Sibu Deluxe", department: "Dancehall", biography: "International collaborations raised her global profile." },
    { name: "Rokia D", department: "Folk", biography: "Acclaimed live performances and a devoted fanbase." },
  ],
  "Best Newcomer": [
    { name: "Jata Kid", department: "Afrobeat", biography: "Debut EP went viral within weeks of release." },
    { name: "Fanta C", department: "Rap", biography: "Freestyle sessions built a strong online presence." },
    { name: "Nomad G", department: "Electronic", biography: "Genre-bending production caught the scene by surprise." },
  ],
  "Album of the Year": [
    { name: "Zen Lee", department: "Alternative", biography: "A cohesive 12-track project lauded for its storytelling." },
    { name: "Kora Sun", department: "Jazz-Fusion", biography: "Studio debut recorded live with a full band." },
    { name: "Mali Q", department: "Hip-Hop", biography: "Concept album exploring identity and home." },
  ],
  "Music Video of the Year": [
    { name: "Video Kingz", department: "Visuals", biography: "Cinematic short film tied to a breakout single." },
    { name: "Clara Vox", department: "Visuals", biography: "One-take performance video praised for its craft." },
  ],
  "Lifetime Achievement": [
    { name: "Elder Musa", department: "Highlife", biography: "Four decades of recordings and mentorship." },
    { name: "Queenie J", department: "Afro-pop", biography: "Pioneering career spanning generations of fans." },
  ],
};

const STARTER_VOTERS = [
  { name: "Ibrahim Koroma", email: "ibrahim@example.com", status: "verified" as const },
  { name: "Fatmata Bangura", email: "fatmata@example.com", status: "verified" as const },
  { name: "Alusine Sesay", email: "alusine@example.com", status: "pending" as const },
  { name: "Mariama Kamara", email: "mariama@example.com", status: "verified" as const },
  { name: "Sahr Conteh", email: "sahr@example.com", status: "blocked" as const },
  { name: "Isata Bah", email: "isata@example.com", status: "verified" as const },
  { name: "Mohamed Sowe", email: "mohamed@example.com", status: "pending" as const },
  { name: "Kadiatu Forna", email: "kadiatu@example.com", status: "verified" as const },
  { name: "Paul Kamara", email: "paul@example.com", status: "verified" as const },
  { name: "Adama Jalloh", email: "adama@example.com", status: "verified" as const },
  { name: "Binta Sulaiman", email: "binta@example.com", status: "pending" as const },
  { name: "Yusuf Tarawallie", email: "yusuf@example.com", status: "verified" as const },
];

const DAY_PATTERN = [6, 5, 6, 4, 5, 6, 3, 4, 5, 6, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6];

const SEED_USER_AGENTS = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
];

const SEED_IPS = [
  "41.66.12.10", "41.72.201.5", "197.210.44.88", "154.160.22.7",
  "102.176.43.19", "196.44.12.101", "66.249.66.1", "105.112.30.44",
];

async function seedAdmin() {
  const passwordHash = await hashPassword(adminPassword);
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, adminUsername));
  if (existing.length > 0) {
    console.log(`Admin "${adminUsername}" already exists, skipping.`);
    return;
  }
  await db.insert(users).values({
    username: adminUsername,
    passwordHash,
    fullName: "Super Administrator",
    role: adminRole as UserRole,
  });
  console.log(`Seeded ${adminRole} admin "${adminUsername}".`);
}

const DEMO_USERS: {
  username: string;
  fullName: string;
  role: Exclude<UserRole, "super">;
  preset: RolePreset;
}[] = [
  { username: "editor", fullName: "Content Editor", role: "editor", preset: "editor" },
  { username: "viewer", fullName: "Read-only Viewer", role: "viewer", preset: "viewer" },
];

async function seedDemoUsers() {
  for (const demo of DEMO_USERS) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, demo.username));
    if (existing.length > 0) {
      console.log(`Demo user "${demo.username}" already exists, skipping.`);
      continue;
    }
    const passwordHash = await hashPassword(adminPassword);
    const [created] = await db
      .insert(users)
      .values({
        username: demo.username,
        passwordHash,
        fullName: demo.fullName,
        role: demo.role,
      })
      .returning({ id: users.id });
    const matrix = presetMatrix(demo.preset);
    matrix.overview.view = true;
    await db.insert(userPermissions).values(matrixToRows(created.id, matrix));
    console.log(`Seeded demo user "${demo.username}" (role: ${demo.role}).`);
  }
}

async function seedSettings() {
  const values = {
    id: "main",
    eventName: "Nyapui Radio Awards 2026",
    tagline: "Your voice picks the winners.",
    description:
      "The annual Nyapui Radio Awards celebrate the artists, songs and stories that defined the year — and every winner is chosen by the listeners.",
    contactEmail: "voting@nyapuiradio.com",
    logoUrl: "/logo.svg",
    bannerUrl: null,
    primaryColor: "#1e3a8a",
    accentColor: "#f59e0b",
    categoryLayout: "grid" as const,
    resultsPolicy: "live" as const,
    resultsReleased: false,
    opensAt: new Date("2026-10-16T09:00:00"),
    closesAt: new Date("2026-11-30T23:59:00"),
    votingState: "open" as const,
    anonymous: true,
    oneVotePerCategory: true,
    resultsLive: false,
  };
  await db
    .insert(eventSettings)
    .values(values)
    .onConflictDoUpdate({
      target: eventSettings.id,
      set: { ...values, updatedAt: new Date() },
    });
  console.log("Event settings ready.");
}

async function seedVotingData() {
  const existingCategories = await db.select().from(awardCategories);
  if (existingCategories.length > 0) {
    console.log("Categories already exist, skipping voting data seed.");
    return;
  }

  const categoryIds = new Map<string, string>();
  for (const [index, category] of STARTER_CATEGORIES.entries()) {
    const [row] = await db
      .insert(awardCategories)
      .values({ ...category, sortOrder: index + 1 })
      .returning({ id: awardCategories.id, name: awardCategories.name });
    categoryIds.set(row.name, row.id);
  }

  const nomineeIdsByCategory = new Map<string, string[]>();
  for (const [categoryName, seeds] of Object.entries(STARTER_NOMINEES)) {
    const categoryId = categoryIds.get(categoryName);
    if (!categoryId) continue;
    const ids: string[] = [];
    for (const seed of seeds) {
      const [row] = await db
        .insert(nominees)
        .values({
          categoryId,
          name: seed.name,
          department: seed.department ?? null,
          biography: seed.biography ?? null,
          status: seed.status ?? "active",
        })
        .returning({ id: nominees.id });
      ids.push(row.id);
    }
    nomineeIdsByCategory.set(categoryName, ids);
  }

  const voterIds: string[] = [];
  for (const voter of STARTER_VOTERS) {
    const [row] = await db.insert(voters).values(voter).returning({ id: voters.id });
    voterIds.push(row.id);
  }

  const categoryList = Object.keys(STARTER_NOMINEES);
  const draftCategories = new Set(
    STARTER_CATEGORIES.filter((category) => category.status === "draft").map(
      (category) => category.name,
    ),
  );
  const votableCategories = categoryList.filter(
    (name) => !draftCategories.has(name),
  );
  const castVotes: {
    voterId: string;
    nomineeId: string;
    castAt: Date;
    ipHash: string;
    userAgent: string;
    deviceHint: string;
  }[] = [];
  const now = Date.now();

  voterIds.forEach((voterId, voterIndex) => {
    if (STARTER_VOTERS[voterIndex]?.status !== "verified") return;
    votableCategories.forEach((categoryName, categoryIndex) => {
      const ids = nomineeIdsByCategory.get(categoryName) ?? [];
      const activeIds = ids.filter((id) => {
        const seed = STARTER_NOMINEES[categoryName]?.[ids.indexOf(id)];
        return seed?.status !== "withdrawn";
      });
      if (activeIds.length === 0) return;
      const pickIndex = (voterIndex + categoryIndex) % activeIds.length;
      const patternIndex = (voterIndex * 3 + categoryIndex) % DAY_PATTERN.length;
      const dayOffset = DAY_PATTERN[patternIndex];
      const castAt = new Date(
        now - dayOffset * 24 * 60 * 60 * 1000 - (voterIndex % 12) * 3600_000,
      );
      const ua =
        SEED_USER_AGENTS[(voterIndex + categoryIndex) % SEED_USER_AGENTS.length];
      const ip = SEED_IPS[(voterIndex + categoryIndex * 2) % SEED_IPS.length];
      castVotes.push({
        voterId,
        nomineeId: activeIds[pickIndex],
        castAt,
        ipHash: hashIp(ip),
        userAgent: ua,
        deviceHint: parseDeviceHint(ua),
      });
    });
  });

  const uniqueVotes = castVotes;

  if (uniqueVotes.length > 0) {
    await db.insert(votes).values(uniqueVotes);
  }

  console.log(
    `Seeded ${STARTER_CATEGORIES.length} categories, ${[...nomineeIdsByCategory.values()].flat().length} nominees, ${voterIds.length} voters, ${uniqueVotes.length} votes.`,
  );
}

async function seedAuditLog() {
  const existing = await db.select({ id: adminAuditLog.id }).from(adminAuditLog).limit(1);
  if (existing.length > 0) {
    console.log("Audit log already has entries, skipping.");
    return;
  }
  const [admin] = await db
    .select()
    .from(users)
    .where(eq(users.username, adminUsername))
    .limit(1);
  if (!admin) return;
  const adminName = admin.fullName ?? admin.username;
  const day = 24 * 60 * 60 * 1000;
  await db.insert(adminAuditLog).values([
    {
      adminId: admin.id,
      adminName,
      action: "settings.update",
      entityType: "event",
      entityId: "main",
      detail: "Event settings configured for the 2026 awards season",
      createdAt: new Date(Date.now() - 6 * day),
    },
    {
      adminId: admin.id,
      adminName,
      action: "category.status",
      entityType: "category",
      entityId: null,
      detail: "Four categories set to open for voting",
      createdAt: new Date(Date.now() - 5 * day),
    },
    {
      adminId: admin.id,
      adminName,
      action: "voting.open",
      entityType: "event",
      entityId: "main",
      detail: "Voting opened — visitors can cast votes",
      createdAt: new Date(Date.now() - 4 * day),
    },
  ]);
  console.log("Seeded audit log entries.");
}

async function main() {
  await seedAdmin();
  await seedDemoUsers();
  await seedSettings();
  await seedVotingData();
  await seedAuditLog();
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
