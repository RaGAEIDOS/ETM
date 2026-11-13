/**
 * Terminal Lab challenges — ORIGINAL content for this platform.
 * Each challenge validates the FINAL STATE (or last command output),
 * never the exact commands the learner typed. Destructive commands
 * are never used against anything but the in-memory sandbox.
 */

import type { ShellState } from "./types.ts";
import { freshShellState } from "./vfs.ts";

export interface ChallengeContext {
  fs: ShellState;
  /** stdout of the most recent command (after glob expansion). */
  lastOutput: string;
}

export interface LinuxChallenge {
  id: string;
  /** Section id from LINUX_SECTIONS. */
  section: string;
  title: string;
  /** Goal shown to the learner (Arabic, may embed LTR commands). */
  goal: string;
  setup: () => ShellState;
  /** Progressive hints, weakest first. */
  hints: string[];
  /** One possible solution (may span lines). Shown after 2 failed checks. */
  solution: string;
  check: (ctx: ChallengeContext) => boolean;
}

const N = (fs: ShellState, p: string) => fs.nodes.get(p);
const has = (fs: ShellState, p: string) => N(fs, p) !== undefined;

const withFile = (state: ShellState, path: string, content: string, mode = 0o644) =>
  state.nodes.set(path, { kind: "file", content, mode, owner: "learner", inode: state.inodeSeq++ });

const withSymlink = (state: ShellState, path: string, target: string) =>
  state.nodes.set(path, { kind: "symlink", target, mode: 0o777, owner: "learner", inode: state.inodeSeq++ });

const fileContent = (fs: ShellState, p: string) => N(fs, p)?.content ?? null;

export const LINUX_CHALLENGES: LinuxChallenge[] = [
  // ---------- start ----------
  {
    id: "ch-start-01",
    section: "start",
    title: "هيكل مشروع جديد",
    goal: "أنشئ المجلد learn/level1 ثم المجلد learn/level2 داخل منزلك بأمر واحد يستخدم mkdir مع -p",
    setup: freshShellState,
    hints: ["الخيار -p ينشئ المجلد وأجداده الناقصين", "المسار learn/level1 نسبي من المجلد الحالي"],
    solution: "mkdir -p learn/level1 learn/level2",
    check: ({ fs }) => has(fs, "/home/learner/learn/level1") && has(fs, "/home/learner/learn/level2"),
  },
  {
    id: "ch-start-02",
    section: "start",
    title: "بطاقة تعريف",
    goal: "أنشئ ملف about.txt يحتوي السطر: ETM Linux Lab",
    setup: freshShellState,
    hints: ["الأمر echo يطبع النص في المخرجات", "استخدم > لتحويل المخرجات إلى ملف"],
    solution: "echo ETM Linux Lab > about.txt",
    check: ({ fs }) => (fileContent(fs, "/home/learner/about.txt") ?? "").trim() === "ETM Linux Lab",
  },
  {
    id: "ch-start-03",
    section: "start",
    title: "العودة إلى القاعدة",
    goal: "انتقل إلى مجلد المنزل الخاص بك (أنت الآن في /home/learner/docs مثلا) بأمر واحد",
    setup: () => {
      const s = freshShellState();
      s.cwd = "/home/learner/docs";
      return s;
    },
    hints: ["cd بدون وسيط يعود دائما إلى مجلد المنزل", "يمكن أيضا استخدام ~ كاختصار للمنزل"],
    solution: "cd",
    check: ({ fs }) => fs.cwd === "/home/learner",
  },
  // ---------- filesystem ----------
  {
    id: "ch-fs-01",
    section: "filesystem",
    title: "أرشفة الملاحظات",
    goal: "انقل الملف notes.txt إلى مجلد docs باسم archive.txt (بدون نسخ)",
    setup: freshShellState,
    hints: ["الأمر mv ينقل أو يعيد تسمية", "اذكر الوجهة بالاسم الجديد كاملا"],
    solution: "mv notes.txt docs/archive.txt",
    check: ({ fs }) => !has(fs, "/home/learner/notes.txt") && has(fs, "/home/learner/docs/archive.txt"),
  },
  {
    id: "ch-fs-02",
    section: "filesystem",
    title: "رابط رمزي لملاحظاتك",
    goal: "أنشئ رابطا رمزيا باسم notes-link يشير إلى ملف notes.txt",
    setup: freshShellState,
    hints: ["الأمر ln -s ينشئ رابطا رمزيا", "الترتيب: ln -s الهدف اسم_الرابط"],
    solution: "ln -s notes.txt notes-link",
    check: ({ fs }) => {
      const n = N(fs, "/home/learner/notes-link");
      return !!n && n.kind === "symlink" && n.target === "notes.txt";
    },
  },
  {
    id: "ch-fs-03",
    section: "filesystem",
    title: "الرابط المعطل",
    goal: "في منزلك رابط رمزي باسم broken يشير إلى ملف غير موجود — احذف الرابط فقط واترك باقي الملفات",
    setup: () => {
      const s = freshShellState();
      withSymlink(s, "/home/learner/broken", "file-that-does-not-exist.txt");
      return s;
    },
    hints: ["حذف الرابط لا يمس الهدف إطلاقا", "الأمر rm يحذف اسم الملف نفسه"],
    solution: "rm broken",
    check: ({ fs }) => !has(fs, "/home/learner/broken") && has(fs, "/home/learner/notes.txt"),
  },
  {
    id: "ch-fs-04",
    section: "filesystem",
    title: "نسخة احتياطية سريعة",
    goal: "انسخ الملف docs/todo.md إلى docs/todo.bak واحتفظ بالأصل",
    setup: freshShellState,
    hints: ["الأمر cp ينسخ الملفات", "الأصل يبقى كما هو بعد النسخ"],
    solution: "cp docs/todo.md docs/todo.bak",
    check: ({ fs }) =>
      fileContent(fs, "/home/learner/docs/todo.bak") === fileContent(fs, "/home/learner/docs/todo.md") &&
      fileContent(fs, "/home/learner/docs/todo.md") !== null,
  },
  {
    id: "ch-fs-05",
    section: "filesystem",
    title: "نسخ مجلد كامل",
    goal: "انسخ مجلد docs بالكامل إلى مجلد جديد باسم backup بحيث ينتج backup/todo.md",
    setup: freshShellState,
    hints: ["نسخ المجلدات يحتاج الخيار -r", "الوجهة backup سيُنشأ إن لم يكن موجودا"],
    solution: "cp -r docs backup",
    check: ({ fs }) =>
      fileContent(fs, "/home/learner/backup/todo.md") === fileContent(fs, "/home/learner/docs/todo.md"),
  },
  // ---------- commands ----------
  {
    id: "ch-cmd-01",
    section: "commands",
    title: "عد الكلمات",
    goal: "احسب عدد كلمات ملف words.txt واطبع النتيجة",
    setup: () => {
      const s = freshShellState();
      withFile(s, "/home/learner/words.txt", "one two three four five\n");
      return s;
    },
    hints: ["الأمر wc يقبل خيار -w لعد الكلمات", "اطبع النتيجة حتى تظهر في آخر مخرجات"],
    solution: "wc -w words.txt",
    check: ({ lastOutput }) => /(^|\s)5(\s|$)/.test(lastOutput.trim()),
  },
  {
    id: "ch-cmd-02",
    section: "commands",
    title: "من أنا؟",
    goal: "اكتب اسم المستخدم الحالي في ملف me.txt",
    setup: freshShellState,
    hints: ["whoami تطبع اسم المستخدم", "يمكن توجيه أي مخرجات إلى ملف بـ >"],
    solution: "whoami > me.txt",
    check: ({ fs }) => (fileContent(fs, "/home/learner/me.txt") ?? "").trim() === fs.user,
  },
  {
    id: "ch-cmd-03",
    section: "commands",
    title: "أول سطرين فقط",
    goal: "اطبع أول سطرين من ملف notes.txt",
    setup: freshShellState,
    hints: ["head يطبع بداية الملف", "الخيار -n يحدد عدد الأسطر"],
    solution: "head -n 2 notes.txt",
    check: ({ lastOutput }) => {
      const lines = lastOutput.trimEnd().split("\n");
      return lines.length === 2 && lines[0].includes("لينكس") && lines[1].includes("نواة");
    },
  },
  {
    id: "ch-cmd-04",
    section: "commands",
    title: "ابحث عن كلمة نواة",
    goal: "ابحث عن كلمة «نواة» داخل notes.txt واطبع رقم السطر الذي وردت فيه",
    setup: freshShellState,
    hints: ["grep يبحث عن نمط نصي", "الخيار -n يضيف أرقام الأسطر"],
    solution: "grep -n نواة notes.txt",
    check: ({ lastOutput }) => /^2:/.test(lastOutput.trim()) && lastOutput.includes("نواة"),
  },
  {
    id: "ch-cmd-05",
    section: "commands",
    title: "أسماء ملفات فقط",
    goal: "أنشئ الملفات a.txt و b.txt و c.txt ثم اطبع أسماء كل ملفات txt في المجلد",
    setup: freshShellState,
    hints: ["لمسة واحدة تنشئ عدة ملفات", "النجمة * في ls تطابق أي اسم ينتهي بـ txt"],
    solution: "touch a.txt b.txt c.txt\nls *.txt",
    check: ({ lastOutput }) => {
      const names = lastOutput.trim().split(/\s+/);
      return ["a.txt", "b.txt", "c.txt"].every((n) => names.includes(n));
    },
  },
  // ---------- permissions ----------
  {
    id: "ch-perm-01",
    section: "permissions",
    title: "اجعله قابلا للتنفيذ",
    goal: "اجعل ملف notes.txt قابلا للتنفيذ لمالكه فقط بصيغة رقمية",
    setup: freshShellState,
    hints: ["الصيغة الرقمية: rwx=7 و r-x=5 و r--=4", "ابحث عن رقم يجعل المالك rwx والباقي r--"],
    solution: "chmod 744 notes.txt",
    check: ({ fs }) => N(fs, "/home/learner/notes.txt")?.mode === 0o744,
  },
  {
    id: "ch-perm-02",
    section: "permissions",
    title: "قراءة فقط للجميع",
    goal: "اجعل ملف docs/todo.md للقراءة فقط (بدون كتابة أو تنفيذ) للجميع بالصيغة الرقمية",
    setup: freshShellState,
    hints: ["r-- تساوي 4 في كل خانة", "chmod يأخذ النمط ثم اسم الملف"],
    solution: "chmod 444 docs/todo.md",
    check: ({ fs }) => N(fs, "/home/learner/docs/todo.md")?.mode === 0o444,
  },
  {
    id: "ch-perm-03",
    section: "permissions",
    title: "تنفيذ للمجموعة فقط",
    goal: "أضف صلاحية التنفيذ للمجموعة على notes.txt بالصيغة الرمزية دون تغيير الباقي",
    setup: freshShellState,
    hints: ["الصيغة الرمزية: فئة ثم + أو - ثم الصلاحية", "فئة المجموعة هي g والصلاحية x"],
    solution: "chmod g+x notes.txt",
    check: ({ fs }) => N(fs, "/home/learner/notes.txt")?.mode === 0o654,
  },
  {
    id: "ch-perm-04",
    section: "permissions",
    title: "لا شيء للآخرين",
    goal: "امنع الآخرين (others) تماما من ملف notes.txt بالصيغة الرمزية o=",
    setup: freshShellState,
    hints: ["الصيغة الرمزية o= تعني: فئة o بلا أي صلاحية", "النتيجة المنتظرة: 640"],
    solution: "chmod o= notes.txt",
    check: ({ fs }) => N(fs, "/home/learner/notes.txt")?.mode === 0o640,
  },
];

export function challengesForSection(section: string): LinuxChallenge[] {
  return LINUX_CHALLENGES.filter((c) => c.section === section);
}
