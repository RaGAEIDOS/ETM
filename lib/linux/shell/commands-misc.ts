/** Misc commands and help text for the simulated shell. */

import type { ShellResult, ShellState } from "./types.ts";
import { ok } from "./commands-common.ts";

export function cmdWhoami(state: ShellState): ShellResult {
  return ok(state.user + "\n");
}

export function cmdId(state: ShellState): ShellResult {
  const uid = state.user === "root" ? 0 : 1000;
  return ok(`uid=${uid}(${state.user}) gid=${uid}(${state.user}) groups=${uid}(${state.user})\n`);
}

export function cmdDate(_state: ShellState): ShellResult {
  return ok(new Date().toString() + "\n");
}

export function cmdClear(state: ShellState): ShellResult {
  state.cleared = true;
  return ok();
}

export function cmdHistory(state: ShellState): ShellResult {
  return ok(state.history.map((cmd, i) => `${String(i + 1).padStart(4)}  ${cmd}`).join("\n") + (state.history.length ? "\n" : ""));
}

const HELP: Record<string, string> = {
  pwd: "pwd — اطبع مسار المجلد الحالي",
  cd: "cd [مسار] — غيّر المجلد الحالي (بدون وسيط: المنزل)",
  ls: "ls [-l] [-a] [-h] [مسار] — اعرض المحتويات (l مفصل، a مع المخفية، h أحجام مقروءة)",
  mkdir: "mkdir [-p] اسم... — أنشئ مجلدات (-p ينشئ الأجداد أيضا)",
  touch: "touch اسم... — أنشئ ملفات فارغة أو حدّث وقتها",
  cat: "cat [ملف...] — اطبع محتوى الملفات (بدون وسيط: الإدخال القياسي)",
  echo: "echo نص — اطبع النص في الإخراج القياسي",
  cp: "cp [-r] مصدر وجهة — انسخ ملفا (r للمجلدات والمجلدات)",
  mv: "mv مصدر وجهة — انقل أو أعد تسمية",
  rm: "rm [-r] [-f] اسم... — احذف ملفات (r للمجلدات، f بدون سؤال أو خطأ)",
  ln: "ln [-s] هدف اسم — أنشئ رابطا (-s رمزي، بدونه صلب)",
  head: "head [-n عدد] [ملف] — اطبع أول الأسطر (الافتراضي 10)",
  tail: "tail [-n عدد] [ملف] — اطبع آخر الأسطر (الافتراضي 10)",
  wc: "wc [-l|-w|-c] [ملف] — عد الأسطر والكلمات والبايتات",
  grep: "grep [-i][-n][-r] نمط [ملف...] — ابحث عن نص (i بلا حساسية حالة، n أرقام الأسطر، r عودي)",
  find: "find [مسار] [-name نمط] — ابحث عن ملفات (النجمة داخل النمط)",
  chmod: "chmod نمط ملف... — غيّر الصلاحيات (أرقاما مثل 755 أو رموزا مثل u+x)",
  whoami: "whoami — اطبع اسم المستخدم الحالي",
  id: "id — اطبع أرقام المستخدم والمجموعة",
  date: "date — اطبع التاريخ والوقت الحاليين",
  clear: "clear — امسح الشاشة",
  history: "history — اطبع الأوامر التي نفذتها",
  help: "help [أمر] — اعرض هذه المساعدة أو شرح أمر محدد",
  man: "man أمر — مثل help (صفحات دليل مبسطة)",
};

export function cmdHelp(_state: ShellState, argv: string[]): ShellResult {
  const topic = argv[0];
  if (topic && HELP[topic]) return ok(HELP[topic] + "\n");
  if (topic) return ok(`لا توجد صفحة دليل لـ «${topic}» — اكتب help لعرض كل الأوامر.\n`);
  return ok(
    "أوامر المختبر (كلها تعمل داخل نسخة افتراضية لا تمس جهازك):\n" +
      Object.entries(HELP).map(([, v]) => "  " + v).join("\n") +
      "\n"
  );
}
