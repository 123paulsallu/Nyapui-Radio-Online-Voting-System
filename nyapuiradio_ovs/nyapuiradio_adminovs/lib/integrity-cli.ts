import { runIntegrityChecks } from "./integrity";

const SYMBOLS = { ok: "PASS", warn: "WARN", error: "FAIL" } as const;

async function main() {
  const report = await runIntegrityChecks();
  console.log(`Data integrity check — ${new Date(report.checkedAt).toLocaleString()}\n`);
  for (const check of report.checks) {
    console.log(`[${SYMBOLS[check.status]}] ${check.label}`);
    console.log(`        ${check.detail}`);
    if (check.suggestion && check.status !== "ok") {
      console.log(`        fix: ${check.suggestion}`);
    }
  }
  const { ok, warn, error } = report.counts;
  console.log(`\nSummary: ${ok} passed, ${warn} warning(s), ${error} error(s).`);
  process.exit(error > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Integrity check crashed:", err);
  process.exit(2);
});
