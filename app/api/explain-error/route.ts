import { NextRequest, NextResponse } from "next/server";

// Server-side guard around the Miku "Explain this error" helper (A5).
// NEVER exposes API keys to the browser: the browser only POSTs code+error+lesson.
// Key lives ONLY in MIKU_AI_API_KEY (server env). If unset → 503 with an Arabic note.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = [
  "You are Miku, a friendly Arabic-speaking programming tutor for ETM.",
  "Explain the compiler or runtime error BELOW in at most 3 short sentences, in clear simple Arabic.",
  "Then give ONE short hint the learner can try next.",
  "Rules:",
  "- Never give the full corrected program or write the fixed code.",
  "- Never write the complete solution.",
  "- English technical terms may stay in English.",
  "- Stay under 120 words.",
].join("\n");

const CODE_LIMIT = 20_000;
const ERROR_LIMIT = 8_000;
const maxTokens = () => Number(process.env.MIKU_AI_MAX_TOKENS || 220) || 220;

// Very small in-memory per-IP rate limiter (10 req / 10 min).
// NOTE: per-instance memory — resets on cold start; good enough for casual abuse.
const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_COUNT = 10;
const hits = new Map<string, { first: number; count: number }>();

function rateLimitKey(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  const ip = xf ? xf.split(",")[0].trim() : "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    hits.set(key, { first: now, count: 1 });
    return true;
  }
  if (entry.count >= WINDOW_COUNT) return false;
  entry.count += 1;
  return true;
}

function clip(s: unknown, limit: number): string {
  return String(s ?? "").slice(0, limit);
}

export async function POST(req: NextRequest) {
  const key = process.env.MIKU_AI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { hint: null, error: "MIKU_AI_API_KEY is not configured on the server" },
      { status: 503 }
    );
  }
  if (!checkRateLimit(rateLimitKey(req))) {
    return NextResponse.json(
      { hint: null, error: "Rate limit exceeded (10 requests / 10 minutes)" },
      { status: 429 }
    );
  }

  let body: { code?: unknown; error?: unknown; lessonTitle?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ hint: null, error: "Invalid JSON body" }, { status: 400 });
  }

  const code = clip(body?.code, CODE_LIMIT);
  const stderr = clip(body?.error, ERROR_LIMIT);
  const lessonTitle = clip(body?.lessonTitle, 200) || "C++ lesson";
  if (!code.trim() || !stderr.trim()) {
    return NextResponse.json({ hint: null, error: "Missing code or error text" }, { status: 400 });
  }

  const model = process.env.MIKU_AI_MODEL;
  if (!model) {
    return NextResponse.json(
      { hint: null, error: "MIKU_AI_MODEL is not configured on the server" },
      { status: 503 }
    );
  }
  const baseUrl =
    process.env.MIKU_AI_BASE_URL || "https://api.openai.com/v1/chat/completions";

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    const aiRes = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: maxTokens(),
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `The learner is on this lesson: "${lessonTitle}"\n\nC++ code:\n\`\`\`cpp\n${code}\n\`\`\`\n\nError output:\n\`\`\`\n${stderr}\n\`\`\``,
          },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!aiRes.ok) {
      return NextResponse.json(
        { hint: null, error: `AI provider returned HTTP ${aiRes.status}` },
        { status: 502 }
      );
    }
    const data = await aiRes.json();
    const raw = data?.choices?.[0]?.message?.content;
    const hint = typeof raw === "string" ? raw.trim().slice(0, 1200) : "";
    if (!hint) {
      return NextResponse.json({ hint: null, error: "Empty reply from AI provider" }, { status: 502 });
    }
    return NextResponse.json({ hint });
  } catch (err: unknown) {
    const e = err as { name?: string } | null;
    const msg = e?.name === "AbortError" ? "AI provider timeout" : "AI provider unreachable";
    return NextResponse.json({ hint: null, error: msg }, { status: 502 });
  }
}
