export const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

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

  if (opts.file?.mimeType === "application/pdf") {
    content.push({
      type: "input_file",
      filename: opts.file.filename,
      file_data: `data:application/pdf;base64,${opts.file.base64}`,
      detail: "high",
    });
  } else if (opts.file) {
    content.push({
      type: "input_image",
      image_url: `data:${opts.file.mimeType};base64,${opts.file.base64}`,
      detail: "high",
    });
  }

  return fetch(OPENAI_RESPONSES_URL, {
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
