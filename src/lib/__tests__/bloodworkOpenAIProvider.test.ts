import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const helper = readFileSync(
  resolve(process.cwd(), 'supabase/functions/_shared/openai.ts'),
  'utf8',
);
const bloodworkFunction = readFileSync(
  resolve(process.cwd(), 'supabase/functions/analyze-lab-report/index.ts'),
  'utf8',
);

describe('bloodwork OpenAI provider boundary', () => {
  it('uses the Responses API for high-detail PDF vision without provider storage', () => {
    expect(helper).toContain('https://api.openai.com/v1/responses');
    expect(helper).toContain('https://api.openai.com/v1/files');
    expect(helper).toMatch(/type:\s*"input_file"/);
    expect(helper).toMatch(/purpose",\s*"user_data"/);
    expect(helper).toMatch(/file_id:\s*uploadedFileId/);
    expect(helper).toMatch(/method:\s*"DELETE"/);
    expect(helper).toMatch(/detail:\s*"high"/);
    expect(helper).toMatch(/store:\s*false/);
    expect(helper).toMatch(/OPENAI_API_KEY/);
    expect(helper).toMatch(/OPENAI_MODEL_BLOODWORK[\s\S]*gpt-4\.1/);
    expect(helper).not.toMatch(/OPENROUTER/i);
  });

  it('keeps bloodwork on OpenAI and preserves empty personalised outputs', () => {
    expect(bloodworkFunction).toMatch(/createOpenAIResponse/);
    expect(bloodworkFunction).toMatch(/OPENAI_API_KEY/);
    expect(bloodworkFunction).not.toMatch(/OPENROUTER|chatCompletion|PDF_PLUGIN/);
    expect(bloodworkFunction).toMatch(/recommended_stack_peptides:\s*\[\]/);
    expect(bloodworkFunction).toMatch(/const protocol = \{ stack: \[\], supplements: \[\]/);
    expect(bloodworkFunction).toMatch(/qualified healthcare professional/);
    expect(bloodworkFunction).toMatch(/safeUpstreamErrorMetadata/);
    expect(bloodworkFunction).not.toMatch(/error\.message/);
  });
});
