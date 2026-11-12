import { test } from "node:test";
import assert from "node:assert/strict";
import { parseInput } from "../../lib/linux/shell/parser.ts";
import { globToRegex, matchGlob } from "../../lib/linux/shell/glob.ts";
import { freshShellState } from "../../lib/linux/shell/vfs.ts";
import { runShellInput, SIM_COMMANDS } from "../../lib/linux/shell/shell.ts";
import { LINUX_CHALLENGES } from "../../lib/linux/shell/challenges.ts";
import { linuxCatalogueProblems } from "../../lib/linux-videos.ts";

// ---------------- parser ----------------

test("parser splits simple words and keeps quoted strings together", () => {
  const r = parseInput(`echo "hello world" 'foo bar' plain`, {});
  assert.ok(r.ok);
  assert.deepEqual(r.stages[0].argv, ["echo", "hello world", "foo bar", "plain"]);
});

test("parser tracks which arguments were quoted (glob skip)", () => {
  const r = parseInput(`ls *.txt "*.txt" '*.txt'`, {});
  assert.ok(r.ok);
  assert.deepEqual(r.stages[0].argQuoted, [false, false, true, true]);
});

test("parser handles pipes into multiple stages", () => {
  const r = parseInput("cat notes.txt | grep نواة | wc -l", {});
  assert.ok(r.ok);
  assert.equal(r.stages.length, 3);
  assert.equal(r.stages[0].argv[0], "cat");
  assert.equal(r.stages[1].argv[0], "grep");
  assert.equal(r.stages[2].argv[0], "wc");
});

test("parser expands $VAR and ${VAR} from the environment", () => {
  const r = parseInput("echo $USER and ${HOME}", { USER: "learner", HOME: "/home/learner" });
  assert.ok(r.ok);
  assert.deepEqual(r.stages[0].argv, ["echo", "learner", "and", "/home/learner"]);
});

test("parser expands to empty string for unknown variables", () => {
  const r = parseInput("echo a$UNKNOWN b", {});
  assert.ok(r.ok);
  assert.deepEqual(r.stages[0].argv, ["echo", "a", "b"]);
});

test("parser treats $? as 0", () => {
  const r = parseInput("echo $?", {});
  assert.ok(r.ok);
  assert.deepEqual(r.stages[0].argv, ["echo", "0"]);
});

test("parser keeps $ literals inside single quotes", () => {
  const r = parseInput("echo '$USER'", { USER: "learner" });
  assert.ok(r.ok);
  assert.deepEqual(r.stages[0].argv, ["echo", "$USER"]);
});

test("parser resolves backslash escapes", () => {
  const r = parseInput("echo a\\ b \\| done", {});
  assert.ok(r.ok);
  assert.deepEqual(r.stages[0].argv, ["echo", "a b", "|", "done"]);
});

test("parser reports unterminated quotes", () => {
  const r = parseInput('echo "never closed', {});
  assert.equal(r.ok, false);
});

test("parser reports redirect without target", () => {
  const r = parseInput("echo hi >", {});
  assert.equal(r.ok, false);
});

test("parser records > and >> redirection targets", () => {
  const a = parseInput("echo hi > out.txt", {});
  const b = parseInput("echo hi >> out.txt", {});
  assert.ok(a.ok && b.ok);
  assert.equal(a.stages[0].redirectTo, "out.txt");
  assert.equal(a.stages[0].redirectMode, ">");
  assert.equal(b.stages[0].redirectTo, "out.txt");
  assert.equal(b.stages[0].redirectMode, ">>");
});

// ---------------- glob ----------------

test("globToRegex: star matches any run, question one char", () => {
  const re = globToRegex("*.txt");
  assert.ok(re.test("a.txt"));
  assert.ok(re.test(".txt"));
  assert.ok(!re.test("a.txtx"));
  assert.ok(globToRegex("a?c").test("abc"));
  assert.ok(!globToRegex("a?c").test("aXc".replace("X", "XY")));
});

test("matchGlob returns sorted matches or null", () => {
  assert.deepEqual(matchGlob("*.txt", ["b.txt", "a.txt", "c.md"]), ["a.txt", "b.txt"]);
  assert.equal(matchGlob("*.xyz", ["b.txt"]), null);
  assert.equal(matchGlob("plain", ["plain"]), null); // no wildcard -> not a glob
});

// ---------------- core commands ----------------

const run = (state: ReturnType<typeof freshShellState>, line: string) => runShellInput(state, line);

test("pwd prints the current directory", () => {
  const s = freshShellState();
  assert.equal(run(s, "pwd").stdout, "/home/learner\n");
});

test("cd ~ and bare cd return home, cd .. climbs", () => {
  const s = freshShellState();
  run(s, "cd docs");
  assert.equal(s.cwd, "/home/learner/docs");
  run(s, "cd ..");
  assert.equal(s.cwd, "/home/learner");
  run(s, "cd docs");
  run(s, "cd");
  assert.equal(s.cwd, "/home/learner");
  run(s, "cd docs");
  run(s, "cd ~");
  assert.equal(s.cwd, "/home/learner");
});

test("cd into a missing directory errors and does not move", () => {
  const s = freshShellState();
  const r = run(s, "cd nowhere");
  assert.notEqual(r.exitCode, 0);
  assert.equal(s.cwd, "/home/learner");
});

test("ls lists non-hidden entries; ls -a adds . and ..", () => {
  const s = freshShellState();
  assert.equal(run(s, "ls").stdout, "docs\nnotes.txt\n");
  const all = run(s, "ls -a").stdout;
  assert.ok(all.startsWith(".\n..\n"));
});

test("ls -l prints mode string and owner", () => {
  const s = freshShellState();
  const out = run(s, "ls -l").stdout;
  assert.match(out, /^-rw-r--r-- learner\s+\d+ notes\.txt$/m);
  assert.match(out, /^drwxr-xr-x learner\s+\d+ docs$/m);
});

test("mkdir -p creates nested paths in one go", () => {
  const s = freshShellState();
  run(s, "mkdir -p a/b/c");
  assert.ok(s.nodes.get("/home/learner/a/b/c")?.kind === "dir");
});

test("mkdir without -p fails when the parent is missing", () => {
  const s = freshShellState();
  const r = run(s, "mkdir deep/path");
  assert.notEqual(r.exitCode, 0);
  assert.ok(!s.nodes.get("/home/learner/deep/path"));
});

test("touch creates empty files and ignores existing ones", () => {
  const s = freshShellState();
  run(s, "touch fresh.txt");
  assert.equal(s.nodes.get("/home/learner/fresh.txt")?.content, "");
  run(s, "touch notes.txt"); // existing — no error
  assert.ok(s.nodes.get("/home/learner/notes.txt"));
});

test("cat prints file content, errors on missing files", () => {
  const s = freshShellState();
  assert.ok(run(s, "cat notes.txt").stdout.includes("لينكس"));
  assert.notEqual(run(s, "cat nope.txt").exitCode, 0);
});

test("echo -n suppresses the trailing newline", () => {
  const s = freshShellState();
  assert.equal(run(s, "echo -n hi").stdout, "hi");
  assert.equal(run(s, "echo hi").stdout, "hi\n");
});

// ---------------- pipes & redirection ----------------

test("pipe feeds stdout of one stage into the next", () => {
  const s = freshShellState();
  const r = run(s, "cat notes.txt | grep نواة");
  assert.equal(r.stdout, "يعتمد على نواة Linux.\n");
});

test("> writes and truncates; >> appends", () => {
  const s = freshShellState();
  run(s, "echo one > f.txt");
  run(s, "echo two >> f.txt");
  assert.equal(s.nodes.get("/home/learner/f.txt")?.content, "one\ntwo\n");
  run(s, "echo three > f.txt");
  assert.equal(s.nodes.get("/home/learner/f.txt")?.content, "three\n");
});

test("> into a directory errors", () => {
  const s = freshShellState();
  const r = run(s, "echo x > docs");
  assert.notEqual(r.exitCode, 0);
});

test("pipeline output can be redirected to a file", () => {
  const s = freshShellState();
  run(s, "cat notes.txt | grep نواة > hit.txt");
  assert.equal(s.nodes.get("/home/learner/hit.txt")?.content, "يعتمد على نواة Linux.\n");
});

test("history records inputs", () => {
  const s = freshShellState();
  run(s, "pwd");
  run(s, "whoami");
  assert.deepEqual(s.history, ["pwd", "whoami"]);
});

// ---------------- text tools ----------------

test("head/tail print the edges of a file", () => {
  const s = freshShellState();
  assert.deepEqual(run(s, "head -n 1 notes.txt").stdout.trimEnd().split("\n").length, 1);
  assert.ok(run(s, "tail -n 1 notes.txt").stdout.includes("مجتمعات"));
});

test("wc counts lines, words and characters", () => {
  const s = freshShellState();
  assert.match(run(s, "wc -l notes.txt").stdout, /^\s*3\s/);
  assert.match(run(s, "wc -w notes.txt").stdout, /^\s*15\s/);
  assert.equal(run(s, "wc notes.txt").exitCode, 0);
});

test("grep -n numbers matching lines; -i ignores case", () => {
  const s = freshShellState();
  assert.equal(run(s, "grep -n نواة notes.txt").stdout, "2:يعتمد على نواة Linux.\n");
  const ci = run(s, "grep -i LINUX notes.txt");
  assert.ok(ci.stdout.includes("Linux") && ci.stdout.includes("نواة"));
});

test("grep -r searches recursively; find -name locates files", () => {
  const s = freshShellState();
  const g = run(s, "grep -r نواة .");
  assert.ok(g.stdout.includes("notes.txt"));
  const f = run(s, "find . -name *.txt");
  assert.ok(f.stdout.includes("/notes.txt"));
});

// ---------------- filesystem ops ----------------

test("cp copies files; -r is required for directories", () => {
  const s = freshShellState();
  run(s, "cp notes.txt copy.txt");
  assert.equal(s.nodes.get("/home/learner/copy.txt")?.content, s.nodes.get("/home/learner/notes.txt")?.content);
  const bad = run(s, "cp docs backup");
  assert.notEqual(bad.exitCode, 0);
  run(s, "cp -r docs backup");
  assert.ok(s.nodes.get("/home/learner/backup/todo.md"));
});

test("mv moves files and renames directories", () => {
  const s = freshShellState();
  run(s, "mv notes.txt renamed.txt");
  assert.ok(!s.nodes.get("/home/learner/notes.txt"));
  assert.ok(s.nodes.get("/home/learner/renamed.txt"));
});

test("rm removes files; directories need -r; -f silences missing files", () => {
  const s = freshShellState();
  run(s, "rm notes.txt");
  assert.ok(!s.nodes.get("/home/learner/notes.txt"));
  const dirFail = run(s, "rm docs");
  assert.notEqual(dirFail.exitCode, 0);
  run(s, "rm -r docs");
  assert.ok(!s.nodes.get("/home/learner/docs"));
  assert.equal(run(s, "rm -f missing.txt").exitCode, 0);
});

test("rm -r on a non-empty directory removes the whole tree", () => {
  const s = freshShellState();
  run(s, "rm -r docs");
  assert.ok(!s.nodes.get("/home/learner/docs/todo.md"));
});

// ---------------- permissions ----------------

test("chmod numeric sets exact bits; invalid digits are rejected", () => {
  const s = freshShellState();
  run(s, "chmod 744 notes.txt");
  assert.equal(s.nodes.get("/home/learner/notes.txt")?.mode, 0o744);
  assert.notEqual(run(s, "chmod 888 notes.txt").exitCode, 0);
  assert.notEqual(run(s, "chmod abc notes.txt").exitCode, 0);
});

test("chmod symbolic +,-,= adjusts the selected classes", () => {
  const s = freshShellState();
  run(s, "chmod g+x notes.txt"); // 644 -> 654
  assert.equal(s.nodes.get("/home/learner/notes.txt")?.mode, 0o654);
  run(s, "chmod o= notes.txt"); // strip others: 654 -> 650
  assert.equal(s.nodes.get("/home/learner/notes.txt")?.mode, 0o650);
  run(s, "chmod u-w notes.txt"); // 650 -> 450
  assert.equal(s.nodes.get("/home/learner/notes.txt")?.mode, 0o450);
});

test("unreadable file produces a permission error, not a crash", () => {
  const s = freshShellState();
  run(s, "chmod 000 notes.txt");
  const r = run(s, "cat notes.txt");
  assert.notEqual(r.exitCode, 0);
  assert.match(r.stderr, /Permission denied/i);
});

test("read-only directory blocks file creation inside it", () => {
  const s = freshShellState();
  run(s, "chmod 555 docs");
  const r = run(s, "touch docs/nope.txt");
  assert.notEqual(r.exitCode, 0);
});

test("ls -l shows effective rwx triplets", () => {
  const s = freshShellState();
  run(s, "chmod 751 notes.txt");
  const out = run(s, "ls -l notes.txt").stdout;
  assert.ok(out.startsWith("-rwxr-x--x"));
});

// ---------------- misc commands ----------------

test("whoami / id / date / clear / history / help behave", () => {
  const s = freshShellState();
  assert.equal(run(s, "whoami").stdout.trim(), "learner");
  assert.ok(run(s, "id").stdout.includes("learner"));
  assert.ok(run(s, "date").stdout.trim().length > 0);
  run(s, "clear");
  assert.equal(s.cleared, true);
  const h = run(s, "history");
  assert.ok(h.stdout.includes("clear"));
  assert.ok(run(s, "help").stdout.length > 0);
  assert.ok(run(s, "man ls").stdout.length > 0);
});

test("unknown command prints a helpful error and 127", () => {
  const s = freshShellState();
  const r = run(s, "definitely-not-a-command");
  assert.equal(r.exitCode, 127);
  assert.match(r.stderr, /definitely-not-a-command/);
});

test("every SIM_COMMANDS entry is a function", () => {
  for (const [name, fn] of Object.entries(SIM_COMMANDS)) {
    assert.equal(typeof fn, "function", name);
  }
});

// ---------------- challenges: known-good solutions ----------------

for (const ch of LINUX_CHALLENGES) {
  test(`challenge ${ch.id}: fails on fresh fixture, passes after solution`, () => {
    const fresh = ch.setup();
    assert.equal(
      ch.check({ fs: fresh, lastOutput: fresh.lastOutput }),
      false,
      `${ch.id} check passes on an untouched fixture`
    );
    const s = ch.setup();
    for (const line of ch.solution.split("\n")) run(s, line);
    assert.equal(
      ch.check({ fs: s, lastOutput: s.lastOutput }),
      true,
      `${ch.id} known-good solution does not satisfy the checker`
    );
  });
}

// ---------------- content catalogue integrity ----------------

test("linux catalogue integrity check reports no problems", () => {
  assert.deepEqual(linuxCatalogueProblems(), []);
});
