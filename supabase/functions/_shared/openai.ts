export const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
export const OPENAI_FILES_URL = "https://api.openai.com/v1/files";

export const OPENAI_BLOODWORK_MODEL =
  Deno.env.get("OPENAI_MODEL_BLOODWORK") ?? "gpt-4.1";

export class OpenAIConfigError extends Error {}

export function requireOpenAIKey(): string {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) throw new OpenAIConfigError("OPENAI_API_KEY is not configured");
  return key;
}

type OpenAIFileInput = {
  base64: string;
  filename: string;
  mimeType: string;
};

type OpenAIResponseOptions = {
  instructions: string;
  inputText: string;
  file?: OpenAIFileInput;
  model?: string;
  timeoutMs?: number;
};

export async function createOpenAIResponse(opts: OpenAIResponseOptions): Promise<Response> {
  const apiKey = requireOpenAIKey();
  const content: Record<string, unknown>[] = [
    { type: "input_text", text: opts.inputText },
  ];
  let uploadedFileId: string | null = null;

  if (opts.file?.mimeType === "application/pdf") {
    const form = new FormData();
    form.append("purpose", "user_data");
    form.append("file", new Blob([Uint8Array.from(atob(opts.file.base64), (char) => char.charCodeAt(0))], {
      type: "application/pdf",
    }), opts.file.filename);
    const upload = await fetch(OPENAI_FILES_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: opts.timeoutMs ? AbortSignal.timeout(opts.timeoutMs) : undefined,
    });
    if (!upload.ok) throw new Error(`OpenAI file upload failed (${upload.status})`);
    const uploaded = await upload.json() as { id?: unknown };
    if (typeof uploaded.id !== "string") throw new Error("OpenAI file upload returned no id");
    uploadedFileId = uploaded.id;
    content.push({
      type: "input_file",
      file_id: uploadedFileId,
      detail: "high",
    });
  } else if (opts.file) {
    content.push({
      type: "input_image",
      image_url: `data:${opts.file.mimeType};base64,${opts.file.base64}`,
      detail: "high",
    });
  }

  let response: Response | null = null;
  let requestError: unknown = null;
  try {
    response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opts.model ?? OPENAI_BLOODWORK_MODEL,
        instructions: opts.instructions,
        input: [{ role: "user", content }],
        text: { format: { type: "json_object" } },
        max_output_tokens: 8_000,
        store: false,
      }),
      signal: opts.timeoutMs ? AbortSignal.timeout(opts.timeoutMs) : undefined,
    });
  } catch (error) {
    requestError = error;
  }

  if (uploadedFileId) {
    const removed = await fetch(`${OPENAI_FILES_URL}/${uploadedFileId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!removed.ok) throw new Error(`OpenAI file cleanup failed (${removed.status})`);
  }
  if (requestError) throw requestError;
  if (!response) throw new Error("OpenAI response was unavailable");
  return response;
}

export function extractOpenAIOutputText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const response = payload as { output_text?: unknown; output?: unknown };
  if (typeof response.output_text === "string") return response.output_text;
  if (!Array.isArray(response.output)) return "";

  for (const item of response.output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const typed = part as { type?: unknown; text?: unknown };
      if (typed.type === "output_text" && typeof typed.text === "string") {
        return typed.text;
      }
    }
  }
  return "";
}
