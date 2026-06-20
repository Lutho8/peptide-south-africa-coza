/**
 * Export a DOM node as a PNG file download.
 * Used for sharing PK charts with branded watermark.
 */
import { toPng } from "html-to-image";

export async function exportNodeToPng(
  node: HTMLElement,
  filename: string = "pk-chart.png"
): Promise<Blob | null> {
  try {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });
    // Trigger download
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();

    // Convert to blob for share sheet (optional)
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch (err) {
    console.error("[exportNodeToPng] failed", err);
    return null;
  }
}

export async function sharePngBlob(
  blob: Blob,
  filename: string = "pk-chart.png",
  title: string = "Peptide South Africa PK Chart"
): Promise<boolean> {
  try {
    const file = new File([blob], filename, { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data: ShareData) => boolean;
      share?: (data: ShareData) => Promise<void>;
    };
    if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], title, text: title });
      return true;
    }
  } catch (err) {
    console.warn("[sharePngBlob] share failed", err);
  }
  return false;
}
