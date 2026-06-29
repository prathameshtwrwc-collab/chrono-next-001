import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { buildReportHtml, type ReportData } from "./report-template";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const PAGE_CLASS = "page";

function createReportContainer(html: string): HTMLDivElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.zIndex = "-1";
  document.body.appendChild(container);
  return container;
}

function getPageElements(container: HTMLDivElement): HTMLElement[] {
  return Array.from(container.querySelectorAll(`.${PAGE_CLASS}`)) as HTMLElement[];
}

async function capturePage(element: HTMLElement, scale: number): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#fafaf7",
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });
  return canvas;
}

export async function downloadPdf(data: ReportData, filename = "chronotype-report") {
  const html = buildReportHtml(data);
  const container = createReportContainer(html);
  const pages = getPageElements(container);

  if (!pages.length) {
    document.body.removeChild(container);
    throw new Error("No report pages found");
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const scale = 2;

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();

    const canvas = await capturePage(pages[i], scale);
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdfWidth = A4_WIDTH_MM;
    const pdfHeight = (canvas.height / canvas.width) * pdfWidth;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, Math.min(pdfHeight, A4_HEIGHT_MM), undefined, "FAST");
  }

  document.body.removeChild(container);
  pdf.save(`${filename}.pdf`);
}

export async function openPdfForPrint(data: ReportData) {
  const html = buildReportHtml(data);
  const container = createReportContainer(html);
  const pages = getPageElements(container);

  if (!pages.length) {
    document.body.removeChild(container);
    throw new Error("No report pages found");
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const scale = 2;

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();

    const canvas = await capturePage(pages[i], scale);
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdfWidth = A4_WIDTH_MM;
    const pdfHeight = (canvas.height / canvas.width) * pdfWidth;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, Math.min(pdfHeight, A4_HEIGHT_MM), undefined, "FAST");
  }

  document.body.removeChild(container);
  window.open(pdf.output("bloburl"), "_blank");
}
