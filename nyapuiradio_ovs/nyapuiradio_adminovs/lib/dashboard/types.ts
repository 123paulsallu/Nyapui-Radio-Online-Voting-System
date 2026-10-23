import type {
  AccessAction,
  CategoryLayout,
  CategoryStatus,
  DashboardModule,
  NomineeStatus,
  ResultsPolicy,
  UserRole,
  VoterStatus,
  VotingState,
} from "@/lib/db/schema";

export type PermissionMatrix = Record<
  DashboardModule,
  Record<AccessAction, boolean>
>;

export interface UserDTO {
  id: string;
  username: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string;
  permissions: PermissionMatrix;
}

export interface StandingsRow {
  id: string;
  name: string;
  department: string | null;
  categoryId: string;
  categoryName: string;
  categoryStatus: CategoryStatus;
  status: NomineeStatus;
  votes: number;
}

export interface ResultsBrand {
  eventName: string;
  tagline: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  logoUrl: string | null;
}

export interface ResultsSummary {
  totalVotes: number;
  totalCategories: number;
  turnout: number;
  visibility: string;
}

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export interface CategoryDTO {
  id: string;
  name: string;
  description: string | null;
  status: CategoryStatus;
  sortOrder: number;
  nomineeCount: number;
  voteCount: number;
}

export interface NomineeDTO {
  id: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  department: string | null;
  biography: string | null;
  status: NomineeStatus;
  categoryId: string;
  categoryName: string;
  voteCount: number;
}

export interface VoterDTO {
  id: string;
  name: string;
  email: string;
  status: VoterStatus;
  joinedAt: string;
  hasVoted: boolean;
}

export interface EventSettingsDTO {
  eventName: string;
  tagline: string | null;
  description: string | null;
  contactEmail: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  categoryLayout: CategoryLayout;
  resultsPolicy: ResultsPolicy;
  resultsReleased: boolean;
  opensAt: string | null;
  closesAt: string | null;
  votingState: VotingState;
  anonymous: boolean;
  oneVotePerCategory: boolean;
  resultsLive: boolean;
}

export interface VotingControlDTO {
  votingState: VotingState;
  anonymous: boolean;
  oneVotePerCategory: boolean;
  resultsLive: boolean;
  opensAt: string | null;
  closesAt: string | null;
}

export interface ControlCategoryDTO {
  id: string;
  name: string;
  status: CategoryStatus;
  voteCount: number;
}

export interface VoteDTO {
  id: string;
  castAt: string;
  nomineeName: string;
  categoryName: string;
  voterName: string;
  deviceHint: string;
  ipHash: string;
  indicators: string[];
}

export interface CategoryTotalDTO {
  id: string;
  name: string;
  status: CategoryStatus;
  votes: number;
}

export interface AuditDTO {
  id: string;
  adminName: string | null;
  action: string;
  entityType: string;
  detail: string | null;
  createdAt: string;
}

export type IntegrityStatus = "ok" | "warn" | "error";

export interface IntegrityCheck {
  id: string;
  label: string;
  status: IntegrityStatus;
  detail: string;
  suggestion?: string;
}

export interface IntegrityReport {
  checkedAt: string;
  checks: IntegrityCheck[];
  counts: {
    ok: number;
    warn: number;
    error: number;
  };
}
