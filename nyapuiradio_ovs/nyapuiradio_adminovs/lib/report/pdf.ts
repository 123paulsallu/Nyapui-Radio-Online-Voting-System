import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type {
  ResultsBrand,
  ResultsSummary,
  StandingsRow,
} from "@/lib/dashboard/types";

const MARGIN = 36;
const PAGE_W = 595.28;
const PAGE_H = 841.89;

function hexToRgb(hex: string | null | undefined): [number, number, number] {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex ?? "");
  if (!match) return [2, 6, 23];
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "nyapui-radio"
  );
}

export interface ResultsPdfInput {
  brand: ResultsBrand;
  summary: ResultsSummary;
  rows: StandingsRow[];
  scope: string;
  logoDataUrl?: string | null;
}

function statBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
) {
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(x, y, width, 40, 4, 4, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(label.toUpperCase(), x + 8, y + 15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(value, x + 8, y + 32);
}

export function buildResultsPdf(input: ResultsPdfInput): jsPDF {
  const { brand, summary, rows, scope } = input;
  const primary = hexToRgb(brand.primaryColor);
  const accent = hexToRgb(brand.accentColor ?? "#f59e0b");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const footer = () => {
    const page = doc.getNumberOfPages();
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(MARGIN, PAGE_H - 34, PAGE_W - MARGIN, PAGE_H - 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `${brand.eventName} · Nyapui Radio Online Voting System`,
      MARGIN,
      PAGE_H - 20,
    );
    doc.text(`Page ${page}`, PAGE_W - MARGIN, PAGE_H - 20, {
      align: "right",
    });
  };

  doc.setPage(1);

  doc.setFillColor(...primary);
  doc.rect(0, 0, PAGE_W, 96, "F");
  doc.setFillColor(...accent);
  doc.rect(0, 96, PAGE_W, 4, "F");

  let titleX = MARGIN;
  if (input.logoDataUrl) {
    try {
      doc.addImage(input.logoDataUrl, "PNG", MARGIN, 24, 48, 48);
      titleX = MARGIN + 60;
    } catch {
      titleX = MARGIN;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(brand.eventName, titleX, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text(brand.tagline ?? "Official results report", titleX, 64);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...accent);
  doc.text("RESULTS REPORT", PAGE_W - MARGIN, 46, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(
    new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    PAGE_W - MARGIN,
    64,
    { align: "right" },
  );

  let y = 126;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text("Summary", MARGIN, y);
  y += 10;

  const gap = 8;
  const boxW = (PAGE_W - MARGIN * 2 - gap * 3) / 4;
  statBox(doc, MARGIN, y, boxW, "Total votes", summary.totalVotes.toLocaleString());
  statBox(doc, MARGIN + (boxW + gap), y, boxW, "Nominees", String(rows.length));
  statBox(
    doc,
    MARGIN + (boxW + gap) * 2,
    y,
    boxW,
    "Categories",
    `${new Set(rows.map((row) => row.categoryId)).size} / ${summary.totalCategories}`,
  );
  statBox(
    doc,
    MARGIN + (boxW + gap) * 3,
    y,
    boxW,
    "Turnout",
    `${summary.turnout}%`,
  );
  y += 54;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const scopeLines = doc.splitTextToSize(`Scope: ${scope}`, PAGE_W - MARGIN * 2);
  doc.text(scopeLines, MARGIN, y);
  y += scopeLines.length * 11 + 2;
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Public visibility: ${summary.visibility}. Figures are live at export time. Device and network signals are indicators only — never proof.`,
    MARGIN,
    y,
    { maxWidth: PAGE_W - MARGIN * 2 },
  );
  y += 16;

  const totalVotes = summary.totalVotes;
  const body = rows.map((row, index) => [
    String(index + 1),
    row.name,
    row.department ?? "—",
    row.categoryName,
    row.status,
    row.votes.toLocaleString(),
    totalVotes > 0 ? `${((row.votes / totalVotes) * 100).toFixed(1)}%` : "0.0%",
  ]);

  autoTable(doc, {
    startY: y,
    head: [
      ["#", "Nominee", "Department", "Category", "Status", "Votes", "Share"],
    ],
    body: body.length > 0 ? body : [["—", "No rows match the current filters.", "", "", "", "", ""]],
    margin: { left: MARGIN, right: MARGIN },
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 26 },
      5: { halign: "right" },
      6: { halign: "right" },
    },
    didDrawPage: footer,
  });

  return doc;
}

export function resultsPdfFilename(eventName: string, date = new Date()): string {
  const day = date.toISOString().slice(0, 10);
  return `${slugify(eventName)}-results-report-${day}.pdf`;
}

export function downloadResultsPdf(input: ResultsPdfInput): void {
  const doc = buildResultsPdf(input);
  doc.save(resultsPdfFilename(input.brand.eventName));
}
