// Thin, versioned wrapper around the remote Wandbox C++ compile API used by the
// /playground editor and by every <LessonPlayground> block. Kept framework-free
// (pure TS, browser fetch or injected node fetch) so it is unit-testable.
//
// Rules (A6 safety):
//   - code capped at MAX_CODE_CHARS (client also guards; server can too);
//   - stdin capped at MAX_STDIN_CHARS;
//   - timeout = TIMEOUT_MS via AbortController;
//   - stdout/stderr displayed up to MAX_OUTPUT_CHARS (truncation helper exported).

export const WandboxOptions = {
  compiler: "gcc-head",
  options: "warning,gnu++2a",
} as const;

export interface CompileResult {
  ok: boolean;
  status: string; // "0" = successful run
  stdout: string;
  stderr: string; // program error text (if any) when run succeeded but printed to stderr
  exitCode: string; // Wandbox `status` (string)
  compileOutput: string;
  programError: string;
  compilerError: string;
  compilerOut: string;
  timeMs?: number;
  error: string | null; // null on success; present whenever ok === false
}

const CODE_LIMIT = 20_000;
const STDIN_LIMIT = 100_000;
const OUTPUT_LIMIT = 50_000;
const TIMEOUT_MS = 20_000;

export const MAX_CODE_CHARS = CODE_LIMIT;
export const MAX_STDIN_CHARS = STDIN_LIMIT;
export const MAX_OUTPUT_CHARS = OUTPUT_LIMIT;

function byteLen(s: string): number {
  return new TextEncoder().encode(s ?? "").length;
}

export function truncate(text: string, max: number): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) : text;
}

export async function compileCpp(
  code: string,
  stdin: string,
  opts: {
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
    codeSizeLimit?: number;
    inputSizeLimit?: number;
    outputSizeLimit?: number;
  } = {}
): Promise<CompileResult> {
  const codeLimit = opts.codeSizeLimit ?? CODE_LIMIT;
  const inputLimit = opts.inputSizeLimit ?? STDIN_LIMIT;
  const outputLimit = opts.outputSizeLimit ?? OUTPUT_LIMIT;

  if (byteLen(code) > codeLimit) {
    return fail("CO", `Code is too long (limit ${codeLimit} chars).`);
  }
  if (byteLen(stdin ?? "") > inputLimit) {
    return fail("SI", `Input is too long (limit ${inputLimit} chars).`);
  }
  const timeLimit = opts.timeoutMs ?? TIMEOUT_MS;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeLimit);

  try {
    const body = JSON.stringify({
      code,
      compiler: WandboxOptions.compiler,
      options: WandboxOptions.options,
      "compiler-option-raw": "-std=c++2a",
      stdin: stdin ?? "",
      save: false,
    });

    const res = await (opts.fetchImpl ?? fetch)(
      "https://wandbox.org/api/compile.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      return fail(
        String(res.status),
        `Could not reach the compilation service (HTTP ${res.status}).`
      );
    }

    const data = await res.json();
    const programOut = truncate(String(data.program_output || data.output || ""), outputLimit);
    const programErr = truncate(String(data.program_error || ""), outputLimit);
    const compilerErr = truncate(String(data.compiler_error || ""), outputLimit);
    const compilerOut = truncate(String(data.compiler_output || ""), outputLimit);
    const status = String(data.status ?? "");

    const combinedOut = [programOut, compilerOut]
      .filter(Boolean)
      .join("\n")
      .trim();

    if (status !== "0" && !programOut) {
      return {
        ok: false,
        status,
        exitCode: status,
        stdout: programOut,
        stderr: programErr,
        compileOutput: compilerOut,
        programError: programErr,
        compilerError: compilerErr,
        compilerOut: compilerOut,
        timeMs: typeof data.time_ms === "number" ? data.time_ms : undefined,
        error: compilerErr || programErr || "Compilation or execution failed.",
      };
    }

    return {
      ok: true,
      status,
      exitCode: status,
      stdout: combinedOut,
      stderr: programErr,
      compileOutput: compilerOut,
      programError: programErr,
      compilerError: compilerErr,
      compilerOut: compilerOut,
      timeMs: typeof data.time_ms === "number" ? data.time_ms : undefined,
      error: null,
    };
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string } | null;
    if (e && e.name === "AbortError") {
      return fail(
        "ABORTED",
        "مهلة الوقت: البرنامج طال كثيرًا ولم ينتهِ. أعِد المحاولة."
      );
    }
    return fail(
      "",
      `Could not reach the compilation service. Check your internet connection. (${e?.message ?? "network error"})`
    );
  } finally {
    clearTimeout(timer);
  }
}

function fail(exitCode: string, message: string): CompileResult {
  return {
    ok: false,
    status: exitCode,
    exitCode,
    stdout: "",
    stderr: "",
    compileOutput: "",
    programError: "",
    compilerError: "",
    compilerOut: "",
    error: message,
  };
}

// Expected-output matching: trim trailing whitespace per line and trailing
// blank lines — lenient on trailing newline differences so pass/fail is fair.
export function outputsMatch(actual: string, expected: string): boolean {
  const norm = (t: string) =>
    t
      .split("\n")
      .map((l) => l.replace(/\s+$/, ""))
      .join("\n")
      .replace(/\n+$/, "")
      .trim();
  return norm(actual) === norm(expected);
}
