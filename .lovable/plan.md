## Plan: Fix bloodwork upload reliability

I found the uploaded SYNLAB PDF is readable and contains extractable German lab tables, but the current backend sends the full PDF to a slower multimodal model with a hard 45s timeout. The logs show repeated `TimeoutError: Signal timed out`, so retries keep repeating the same failing path.

### What I will change

1. **Stop timing out on text-based PDFs**
   - Add a server-side PDF text extraction path before the AI call.
   - If the PDF text is readable, send compact extracted lab text/tables to the AI instead of the full PDF file.
   - Keep the multimodal file/image path only as a fallback for scanned PDFs and image uploads.

2. **Use a faster extraction model path**
   - Switch the normal bloodwork JSON extraction to the default fast Lovable AI text model for extracted text.
   - Keep the prompt bilingual-capable for German and English inputs.
   - Reduce prompt size so the response completes within function limits.

3. **Add deterministic fallback for common lab PDFs**
   - Parse rows like biomarker name, result, reference range, and unit from German/English table text.
   - If AI is slow or returns invalid JSON, still return extracted biomarkers and a safe fallback summary instead of failing the scan.
   - This makes the attached SYNLAB PDF produce results even when AI is temporarily slow.

4. **Improve timeout/retry behavior**
   - Increase backend timeout moderately, but avoid relying on timeout alone.
   - Prevent automatic retries from re-running the exact same slow full-PDF path when text extraction is available.
   - Show clearer messages if a file is scanned/encrypted/unreadable.

5. **Validate with the attached PDF**
   - Confirm the uploaded SYNLAB report can be parsed into biomarker rows such as leukocytes, neutrophils, lipase, glucose, cholesterol, LDL/HDL, creatinine, ferritin, CRP, and TSH.
   - Confirm German source detection and EN/DE result display still work.

### Technical notes

- Main file: `supabase/functions/analyze-lab-report/index.ts`
- Client flow stays mostly unchanged; the real failure is backend timeout, not the upload UI.
- No new user-facing backend tables are needed.
- The fallback will be educational/research-only and keep the existing disclaimer behavior.