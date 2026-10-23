import { requireDashboard } from "@/lib/auth/guard";
import { runIntegrityChecks } from "@/lib/integrity";
import { IntegrityReportView } from "../_components/integrity-report";

export const instant = false;

export default async function IntegrityPage() {
  await requireDashboard("integrity");
  const report = await runIntegrityChecks();
  return <IntegrityReportView report={report} />;
}
