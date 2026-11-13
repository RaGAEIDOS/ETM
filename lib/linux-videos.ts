/**
 * Linux track data — "دورة تعلم نظام اللينكس 2021" by Linuxtopia on YouTube
 * (playlist PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg, 53 videos).
 *
 * Metadata (ids, titles, durations, order) is REAL, fetched via Invidious.
 * Every video is embedded through YouTube's official player; nothing is
 * downloaded or re-hosted. Summaries, terms and practice are ORIGINAL
 * Arabic text, conservative and reviewed:false (48/53 have no captions).
 * Credit + non-affiliation line is required on every page of this track.
 */

import { linuxVideosBulk } from "./linux-videos-bulk.ts";

export const LINUXTOPA_CHANNEL = "https://www.youtube.com/@Linuxtopia";
export const LINUXTOPA_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg";
export const LINUX_COURSE_PAGE = "https://www.youtube.com/playlist?list=PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg";
export const LINUX_CREDIT =
  "Content by Linuxtopia on YouTube. This platform is not affiliated with Linuxtopia.";

/** Bump when re-fetching metadata; drives cache/revalidate semantics. */
export const LINUX_CATALOGUE_VERSION = 1;

export interface LinuxKeyTerm {
  en: string;
  ar: string;
  /** Short English example line (command or phrase). */
  example?: string;
}

/** Practice items, matched to a Linux audience. Exactly one correct answer each. */
export type LinuxPracticeItem =
  /** Multiple choice — pick the correct option. */
  | { type: "mcq"; prompt: string; options: string[]; answer: number; explanation: string }
  /** Typed answer (command or short output). `accept` lists normalized acceptable answers; the first is canonical. */
  | { type: "cmd"; prompt: string; answer: string; accept: string[]; explanation: string }
  /** rwx/numeric chmod drill — auto-graded typed answer. */
  | { type: "chmod"; prompt: string; answer: string; accept: string[]; explanation: string }
  /** Ordered steps — display order is shuffled; `steps` is the correct order. */
  | { type: "order"; prompt: string; steps: string[]; explanation: string }
  /** Match commands/terms to descriptions. Scores as one item. */
  | { type: "match"; prompt?: string; pairs: { left: string; right: string }[]; explanation: string };

export interface LinuxVideo {
  /** ETM sequential id ("lnx-01".."lnx-53") — stable, unique. */
  id: string;
  number: number;
  /** Section id (see LINUX_SECTIONS). */
  section: string;
  youtubeId: string;
  /** Title as published on the channel. */
  title: string;
  /** ISO 8601 duration (e.g. "PT14M33S"), when available. */
  duration?: string;
  /** Full watch URL incl. &list= for "watch on YouTube" links. */
  youtube: string;
  /** 2-4 sentences, Arabic, original. Conservative when reviewed:false. */
  summary: string;
  /** Version note for 2021-era material; omit when the content is timeless. */
  versionNote?: string;
  /** 1-5 key terms/commands. */
  terms: LinuxKeyTerm[];
  /** 3-5 practice items. */
  practice: LinuxPracticeItem[];
  reviewed: boolean;
}

export interface LinuxSection {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  /** Video numbers belonging to this section. */
  videos: number[];
}

export const LINUX_SECTIONS: LinuxSection[] = [
  { id: "start", title: "البداية والتثبيت", titleEn: "Getting started & installation", description: "تثبيت مانجارو، لماذا مانجارو، وتثبيت لينكس بجانب ويندوز وعلى VirtualBox.", videos: [1, 2, 17, 40] },
  { id: "filesystem", title: "نظام الملفات والروابط", titleEn: "Filesystem & links", description: "بنية نظام الملفات في لينكس والفرق بين الرابط الصلب والرابط الرمزي.", videos: [3, 9] },
  { id: "commands", title: "أساسيات الطرفية والأوامر", titleEn: "Terminal basics & essential commands", description: "المحررات في الطرفية وأوامر الاستخدام اليومي والبحث والوايلد كارد.", videos: [4, 5, 6, 7, 8, 20] },
  { id: "permissions", title: "الصلاحيات والملكية", titleEn: "Permissions & ownership", description: "قراءة وتغيير صلاحيات الملفات بأمر chmod وملكية المالك والمجموعة.", videos: [10, 11] },
  { id: "text", title: "أوامر الملفات والنصوص", titleEn: "Files & text processing", description: "عرض وقطع وفرز واستبدال النصوص من الطرفية: cat و cut و awk و sort و sed وغيرها.", videos: [12, 15, 16, 18, 19, 21, 22] },
  { id: "packages", title: "الحزم والصيانة", titleEn: "Packages & system maintenance", description: "مستودع AUR والضغط والتحديثات ونواة النظام و systemd و rsync وفحص صحة القرص.", videos: [13, 14, 25, 46, 47, 49] },
  { id: "users", title: "المستخدمون والعمليات", titleEn: "Users & processes", description: "إنشاء وحذف ومراقبة المستخدمين، وإدارة العمليات وجدولة cron.", videos: [23, 24, 26] },
  { id: "bash", title: "سكربتات الباش", titleEn: "Bash scripting", description: "من أول سكربت حتى الدوال ومشاريع كاملة: المتغيرات والشرطيات والحلقات و case.", videos: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 48] },
  { id: "servers", title: "الخوادم والاستضافة الذاتية", titleEn: "Servers & self-hosting", description: "بناء سيرفرات منزلية: التخزين والنسخ الاحتياطي ومودل و phpMyAdmin و Zabbix و Apache و NGINX.", videos: [42, 43, 44, 45, 50, 51, 52, 53] },
];

export interface LinuxCourse {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  playlistId: string;
  playlistUrl: string;
  courseUrl: string;
  color: string;
  icon: "terminal";
}

export const linuxCourses: LinuxCourse[] = [
  {
    id: "linux-2021",
    title: "دورة تعلم نظام اللينكس 2021",
    titleEn: "The Complete Linux Course (2021)",
    description:
      "دورة عربية شاملة من الصفر على قناة Linuxtopia: تثبيت مانجارو، بنية نظام الملفات، الصلاحيات، أوامر النصوص، سكربتات باش، ثم بناء سيرفرات منزلية.",
    playlistId: "PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg",
    courseUrl: "https://www.youtube.com/playlist?list=PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg",
    color: "from-amber-400 to-orange-500",
    icon: "terminal",
  },
];

const PL = "https://www.youtube.com/watch?v=";
const list = "&list=PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg";

/** Hand-written pilot lessons 1-10. Originals; reviewed:false until watched. */
const curatedVideos: Omit<LinuxVideo, "section">[] = [
  {
    id: "lnx-01",
    number: 1,
    youtubeId: "vPevc8XaImk",
    title: "The Complete Linux Course: How to install Manjaro ( English Subtitle )",
    duration: "PT14M33S",
    youtube: `${PL}vPevc8XaImk${list}`,
    summary:
      "الفيديو يشرح تثبيت نظام مانجارو خطوة خطوة: تجهيز ملف ISO وإنشاء وسيط إقلاع، ثم التقسيم والتثبيت داخل مثبت مانجارو الرسومي. ينصح بتطبيق الخطوات أولا داخل آلة افتراضية أو على جهاز تجريبي قبل تثبيتها على جهازك الأساسي.",
    versionNote:
      "المحتوى من 2021: خطوات المثبت وأشكال الشاشات وأقسام القرص قد تختلف اليوم — المفاهيم (وسيط إقلاع، تقسيم، تثبيت) ثابتة.",
    terms: [
      { en: "ISO", ar: "صورة مطابقة من قرص النظام تُحمّل وتُستخدم للتثبيت أو الإقلاع.", example: "manjaro-x86_64.iso" },
      { en: "Bootable USB", ar: "ذاكرة USB مجهزة للإقلاع وتثبيت نظام التشغيل.", example: "dd or balenaEtcher" },
      { en: "Partition", ar: "جزء منطقي من القرص يحجز لمساحة أو نظام معين.", example: "/dev/sda1" },
      { en: "GRUB", ar: "محمّل الإقلاع: أول برنامج يعمل ويختار النظام الذي سيقلع." },
    ],
    practice: [
      { type: "mcq", prompt: "ما وظيفة وسيط الإقلاع Bootable USB؟", options: ["تشغيل المتصفح فقط", "الإقلاع وتثبيت نظام التشغيل", "تخزين الصور والفيديو", "شحن البطارية"], answer: 1, explanation: "وسيط الإقلاع يحمل صورة النظام ونواة الإقلاع ليبدأ المثبت." },
      { type: "mcq", prompt: "على ماذا تُبنى توزيعة مانجارو؟", options: ["Debian", "Arch Linux", "Ubuntu", "Fedora"], answer: 1, explanation: "مانجارو توزيعة سهلة الاستخدام مبنية على Arch Linux." },
      { type: "cmd", prompt: "ما الامتداد الشائع لملف صورة النظام؟", answer: "iso", accept: ["iso", ".iso"], explanation: "ملفات ISO هي صور أنظمة جاهزة للحرق أو النسخ." },
      { type: "order", prompt: "رتب خطوات تثبيت مانجارو من ISO بالترتيب الصحيح", steps: ["تحميل ملف ISO", "إنشاء وسيط إقلاع", "الإقلاع من الوسيط", "اختيار التقسيم واللغة", "إتمام التثبيت وإعادة التشغيل"], explanation: "التثبيت يبدأ من الوسيط وينتهي بإعادة التشغيل على النظام الجديد." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-02",
    number: 2,
    youtubeId: "pezjZ_cv1_0",
    title: "The Complete Linux Course: Why I like Manjaro (Arabic)",
    duration: "PT9M1S",
    youtube: `${PL}pezjZ_cv1_0${list}`,
    summary:
      "حلقة رأي شخصي: لماذا يفضل المؤلف مانجارو بين توزيعات لينكس بناء على تجربته. قيمتها الحقيقية أنها تدربك على معايير اختيار التوزيعة (سهولة التثبيت، حداثة الحزم، الاستقرار) بدل التوصية المطلقة للجميع.",
    versionNote:
      "الانطباعات من 2021: مزايا أي توزيعة تتبدل مع الوقت — جرّبها بنفسك داخل آلة افتراضية قبل اعتمادها.",
    terms: [
      { en: "Distribution (Distro)", ar: "توزيعة لينكس: نواة + أدوات + مستودعات + واجهة جاهزة للاستخدام." },
      { en: "Rolling Release", ar: "نموذج تحديث متواصل دون قفزات إصدارات كبرى." },
      { en: "Desktop Environment", ar: "الواجهة الرسومية فوق النواة مثل KDE أو XFCE." },
    ],
    practice: [
      { type: "mcq", prompt: "ما المقصود بتوزيعة لينكس؟", options: ["برنامج حماية من الفيروسات", "نسخة جاهزة من نظام لينكس بنواة وأدوات ومستودعات", "متصفح ويب", "مدير حزم فقط"], answer: 1, explanation: "التوزيعة تجميع متكامل: نواة + أدوات + مستودعات + واجهة." },
      { type: "mcq", prompt: "ما معنى Rolling Release؟", options: ["إصدار كبير كل سنة", "تحديث متواصل دون قفزات كبرى", "لا توجد تحديثات", "نظام ثابت لا يتغير"], answer: 1, explanation: "التدحرج يعني أنك محدث دائما دون ترقية إصدار رئيسي." },
      { type: "match", prompt: "صل المصطلح بمعناه", pairs: [
        { left: "Rolling Release", right: "تحديث متواصل" },
        { left: "LTS", right: "إصدار دعم طويل" },
        { left: "Desktop Environment", right: "واجهة رسومية فوق النواة" },
      ], explanation: "هذه أهم مفردات اختيار التوزيعة." },
      { type: "cmd", prompt: "ما اسم التوزيعة المبنية على Arch والمشروحة في الدورة؟", answer: "manjaro", accept: ["manjaro"], explanation: "الدورة كاملة تشرح مانجارو." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-03",
    number: 3,
    youtubeId: "YiBAYvwKU4Q",
    title: "The Complete Linux Course: Linux File System (Arabic)",
    duration: "PT7M29S",
    youtube: `${PL}YiBAYvwKU4Q${list}`,
    summary:
      "يعرض الدرس بنية نظام الملفات في لينكس: الشجرة من الجذر / حتى /home للمستخدمين و /etc للإعدادات و /var للبيانات المتغيرة و /usr للبرامج. فهم هذه الشجرة يجعل التنقل بالطرفية وفهم المسارات أسهل بكثير.",
    terms: [
      { en: "/", ar: "الجذر: نقطة البداية لكل مسارات النظام.", example: "ls /" },
      { en: "/home", ar: "المجلد الخاص بحسابات المستخدمين وملفاتهم." },
      { en: "/etc", ar: "ملفات إعدادات النظام والخدمات.", example: "ls /etc" },
      { en: "/var", ar: "بيانات متغيرة مع الوقت: السجلات والطوابير." },
      { en: "Path", ar: "عنوان ملف أو مجلد داخل الشجرة: مطلق من الجذر أو نسبي من الحالي." },
    ],
    practice: [
      { type: "mcq", prompt: "أي دليل يحتوي ملفات إعدادات النظام؟", options: ["/home", "/etc", "/var", "/bin"], answer: 1, explanation: "etc اختصار تاريخي لكلمة configuration." },
      { type: "mcq", prompt: "أين تعيش ملفات المستخدم الشخصية عادة؟", options: ["/usr", "/opt", "/home", "/etc"], answer: 2, explanation: "كل مستخدم له مجلد فرعي داخل /home." },
      { type: "cmd", prompt: "اكتب المسار المطلق الذي يبدأ عنده كل شيء في لينكس", answer: "/", accept: ["/"], explanation: "المسارات المطلقة تبدأ من الجذر /." },
      { type: "order", prompt: "رتب مكونات المسار /etc/ssh/sshd_config من الجذر إلى الملف", steps: ["/", "etc", "ssh", "sshd_config"], explanation: "المسار سلسلة أجزاء يفصل بينها الرمز /." },
      { type: "match", prompt: "صل الدليل بوظيفته", pairs: [
        { left: "/home", right: "ملفات المستخدمين" },
        { left: "/etc", right: "إعدادات النظام" },
        { left: "/var", right: "بيانات متغيرة كالسجلات" },
        { left: "/usr", right: "البرامج والمكتبات المثبتة" },
      ], explanation: "خريطة سريعة لأهم الدلائل القياسية." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-04",
    number: 4,
    youtubeId: "Fljem-cZxB8",
    title: "The Complete Linux Course: Why is vim better than nano (Arabic)",
    duration: "PT8M47S",
    youtube: `${PL}Fljem-cZxB8${list}`,
    summary:
      "مقارنة عملية بين محرري الطرفية vim و nano من منظور المؤلف: متى تكفيك بساطة nano للتعديل السريع، ومتى تدفعك قوة vim (الأوضاع والحركة والكفاءة) للتعلم الأعمق. المحرك هو التدريب لا المعتقد.",
    terms: [
      { en: "Terminal editor", ar: "محرر نصوص يعمل داخل الطرفية دون واجهة رسومية." },
      { en: "nano", ar: "محرر بسيط وسهل التعلم للمبتدئين.", example: "nano notes.txt" },
      { en: "vim", ar: "محرر قوي بأوضاع (عادي / إدخال / أوامر) وكفاءة عالية مع التدريب.", example: "vim notes.txt" },
    ],
    practice: [
      { type: "mcq", prompt: "ما الفرق الأساسي بين أوضاع vim؟", options: ["الوضع الداكن والمضيء", "وضع الأوامر ووضع الإدخال", "وضع الملف والشبكة", "لا توجد أوضاع في vim"], answer: 1, explanation: "في vim تكتب في وضع الإدخال وتنفذ الأوامر في الوضع العادي." },
      { type: "mcq", prompt: "أي محرر أنسب للبدايات السريعة دون تعلم أوضاع؟", options: ["vim", "nano", "emacs", "ed"], answer: 1, explanation: "nano يعرض اختصاراته أسفل الشاشة مباشرة." },
      { type: "mcq", prompt: "في vim كيف تخرج من وضع الإدخال إلى الوضع العادي؟", options: ["Ctrl+C", "Esc", "Ctrl+D", "q"], answer: 1, explanation: "Esc يعيدك دائما إلى الوضع العادي." },
      { type: "match", prompt: "صل الوصف بالمحرر", pairs: [
        { left: "nano", right: "بساطة وبداية فورية" },
        { left: "vim", right: "قوة وكفاءة مع التعلم" },
        { left: "Terminal editor", right: "يعمل داخل الطرفية" },
      ], explanation: "اختيار المحرر مسألة تدريب لا عقيدة." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-05",
    number: 5,
    youtubeId: "Ycz3UzySuqI",
    title: "The Complete Linux Course: Important and Funny Commands (Arabic)",
    duration: "PT6M8S",
    youtube: `${PL}Ycz3UzySuqI${list}`,
    summary:
      "دفعة أولى من أوامر لينكس المهمة التي يكررها كل مستخدم يوميا، مع أوامر مسلية تخفف جدية الطرفية. الدرس يوسع مفرداتك: ماذا يطبع كل أمر ولماذا تحتاجه.",
    terms: [
      { en: "pwd", ar: "اطبع مسار المجلد الحالي الذي تقف فيه.", example: "pwd" },
      { en: "ls", ar: "اعرض محتويات المجلد الحالي.", example: "ls -l" },
      { en: "whoami", ar: "اطبع اسم المستخدم الحالي.", example: "whoami" },
      { en: "uptime", ar: "مدة تشغيل النظام ومتوسط حمله.", example: "uptime" },
    ],
    practice: [
      { type: "cmd", prompt: "اطبع مسار المجلد الحالي", answer: "pwd", accept: ["pwd"], explanation: "pwd = print working directory." },
      { type: "cmd", prompt: "اعرض اسم المستخدم الحالي", answer: "whoami", accept: ["whoami"], explanation: "whoami مفيدة داخل السكربتات والجلسات المشتركة." },
      { type: "cmd", prompt: "اعرض مدة تشغيل النظام وحمله", answer: "uptime", accept: ["uptime"], explanation: "uptime يطبع منذ متى يعمل النظام ومتوسط الحمل." },
      { type: "mcq", prompt: "ماذا تفعل الصيغة ls -l؟", options: ["تعرض محتويات بلا تفاصيل", "تعرض قائمة مفصلة بالصلاحيات والملكية والحجم", "تحذف الملفات", "تعرض التواريخ فقط"], answer: 1, explanation: "حرف l يعني long listing format." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-06",
    number: 6,
    youtubeId: "kbRvCJUkuUo",
    title: "The Complete Linux Course: Find and Locate commands (Arabic)",
    duration: "PT8M22S",
    youtube: `${PL}kbRvCJUkuUo${list}`,
    summary:
      "الفرق بين find التي تبحث مباشرة في نظام الملفات بمعايير واسعة، و locate التي تبحث في قاعدة بيانات معدة مسبقا — أسرع لكنها تحتاج تحديثا دوريا عبر updatedb. مع أمثلة البحث عن الملفات والمجلدات.",
    terms: [
      { en: "find", ar: "بحث حي في نظام الملفات بمعايير (الاسم، النوع، الحجم).", example: "find . -name notes.txt" },
      { en: "locate", ar: "بحث سريع في قاعدة بيانات أسماء الملفات.", example: "locate notes.txt" },
      { en: "updatedb", ar: "أمر يعيد بناء قاعدة بيانات locate.", example: "sudo updatedb" },
    ],
    practice: [
      { type: "cmd", prompt: "ابحث عن ملف اسمه report.txt في المجلد الحالي وكل أبنائه", answer: "find . -name report.txt", accept: ["find . -name report.txt", "find . -name 'report.txt'", "find . -name \"report.txt\""], explanation: "النقطة تعني المجلد الحالي." },
      { type: "cmd", prompt: "ابحث في قاعدة بيانات locate عن report.txt", answer: "locate report.txt", accept: ["locate report.txt"], explanation: "locate تبحث في فهرس محفوظ وليس في القرص." },
      { type: "mcq", prompt: "ما الفرق الأساسي بين find و locate؟", options: ["لا يوجد فرق", "find تبحث مباشرة و locate في قاعدة بيانات قد تتأخر", "locate لا تحتاج صلاحيات أبدا", "find للشبكات فقط"], answer: 1, explanation: "locate أسرع لأنها تقرأ فهرسا جاهزا." },
      { type: "mcq", prompt: "أي أمر يعيد بناء قاعدة بيانات locate؟", options: ["updatedb", "locate -r", "find --sync", "refresh-db"], answer: 0, explanation: "updatedb يعيد مسح الشجرة وبناء الفهرس." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-07",
    number: 7,
    youtubeId: "Okg7H3wpd70",
    title: "The Complete Linux Course: Important commands part #2 (Arabic)",
    duration: "PT7M1S",
    youtube: `${PL}Okg7H3wpd70${list}`,
    summary:
      "دفعة ثانية من أوامر لينكس المفيدة في العمل اليومي، مع التركيز على المساعدة الداخلية: كيف تطلب شرح أي أمر عبر man أو الخيار --help، ومفهوم sudo لتنفيذ أمر بصلاحيات الجذر.",
    terms: [
      { en: "man", ar: "صفحات الدليل: المرجع الأساسي لأي أمر مثبت.", example: "man ls" },
      { en: "--help", ar: "مساعدة موجزة يطبعها الأمر نفسه.", example: "ls --help" },
      { en: "sudo", ar: "تنفيذ أمر بصلاحيات الجذر بإذن مؤقت.", example: "sudo pacman -Syu" },
    ],
    practice: [
      { type: "cmd", prompt: "اعرض صفحة الدليل الخاصة بالأمر ls", answer: "man ls", accept: ["man ls"], explanation: "man اسم_الأمر تفتح صفحة الدليل." },
      { type: "cmd", prompt: "اطلب من الأمر ls مساعدة موجزة", answer: "ls --help", accept: ["ls --help", "ls -help"], explanation: "--help يطبع ملخص الخيارات دون فتح man." },
      { type: "cmd", prompt: "حدّث قوائم الحزم ونظام مانجارو بصلاحيات الجذر", answer: "sudo pacman -Syu", accept: ["sudo pacman -Syu", "sudo pacman -Syyu"], explanation: "مانجارو مبنية على Arch وحزمها تدار بـ pacman." },
      { type: "mcq", prompt: "ما الفرق بين man ls و ls --help؟", options: ["لا فرق", "man صفحة دليل مفصلة و --help ملخص يطبعه الأمر نفسه", "--help يحتاج صلاحيات الجذر", "man لا يوجد على لينكس"], answer: 1, explanation: "man أوسع عادة و --help أسرع." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-08",
    number: 8,
    youtubeId: "z7ZAL0n64KU",
    title: "The Complete Linux Course: Wildcards simply explained (Arabic)",
    duration: "PT5M7S",
    youtube: `${PL}z7ZAL0n64KU${list}`,
    summary:
      "شرح مبسط للوايلد كارد (Wildcards): الرموز * و ? و الأقواس [ ] التي يوسعها الشيل إلى أسماء ملفات مطابقة، لتنفيذ أمر واحد على مجموعة ملفات دفعة واحدة.",
    terms: [
      { en: "Wildcard", ar: "رموز يوسعها الشيل إلى أسماء ملفات مطابقة." },
      { en: "*", ar: "تطابق أي عدد من الأحرف (بما فيها لا شيء).", example: "ls *.txt" },
      { en: "?", ar: "تطابق حرفا واحدا بالضبط.", example: "ls file?.txt" },
      { en: "[ ]", ar: "تطابق أي حرف من المجموعة المذكورة.", example: "ls [ab]*" },
    ],
    practice: [
      { type: "cmd", prompt: "اعرض كل الملفات التي تنتهي بـ txt في المجلد الحالي", answer: "ls *.txt", accept: ["ls *.txt"], explanation: "النجمة تطابق أي اسم قبل اللاحقة." },
      { type: "cmd", prompt: "اعرض الملفات من الشكل file1.txt حتى file9.txt بأمر نمطي واحد", answer: "ls file?.txt", accept: ["ls file?.txt"], explanation: "علامة الاستفهام تطابق خانة حرف واحدة." },
      { type: "cmd", prompt: "اعرض الملفات التي تبدأ بحرف a أو b", answer: "ls [ab]*", accept: ["ls [ab]*"], explanation: "[ab] تطابق حرفا واحدا من المجموعة." },
      { type: "mcq", prompt: "أي اسم تطابقه النمط file[0-9].txt؟", options: ["fileX.txt", "file5.txt", "file.txt", "file١٢.txt"], answer: 1, explanation: "[0-9] خانة واحدة من الأرقام." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-09",
    number: 9,
    youtubeId: "FKcZaLMX51A",
    title: "The Complete Linux Course: Hardlink vs Softlink (Arabic)",
    duration: "PT4M45S",
    youtube: `${PL}FKcZaLMX51A${list}`,
    summary:
      "الفرق بين الرابط الصلب Hard Link (اسم إضافي لنفس الملف ونفس inode) والرابط الرمزي Soft Link (مؤشر صغير إلى مسار آخر). متى تستخدم كل نوع، وماذا يحدث عند حذف الملف الأصلي.",
    terms: [
      { en: "Hard link", ar: "مدخل اسم إضافي لنفس الملف (نفس inode).", example: "ln original.txt copy" },
      { en: "Symbolic link", ar: "مؤشر إلى مسار آخر؛ يصبح معطلا إن حُذف الأصل.", example: "ln -s original.txt link" },
      { en: "inode", ar: "بنية بيانات تمثل الملف نفسه: الصلاحيات والحجم ومواقع البيانات.", example: "ls -i" },
    ],
    practice: [
      { type: "cmd", prompt: "أنشئ رابطا رمزيا باسم latest يشير إلى current.log", answer: "ln -s current.log latest", accept: ["ln -s current.log latest"], explanation: "-s تعني symbolic." },
      { type: "cmd", prompt: "أنشئ رابطا صلبا باسم copy يشير إلى original.txt", answer: "ln original.txt copy", accept: ["ln original.txt copy"], explanation: "بدون -s ينشئ ln رابطا صلبا." },
      { type: "mcq", prompt: "ماذا يحدث للرابط الرمزي إذا حُذف الملف الأصلي؟", options: ["يبقى يعمل بشكل طبيعي", "يصبح رابطا معطلا dangling", "يتحول تلقائيا إلى رابط صلب", "يتلف المجلد المحيط"], answer: 1, explanation: "الرمزي يخزن المسار فقط؛ غياب الأصل يكسره." },
      { type: "mcq", prompt: "ما الذي يتشاركه الرابط الصلب مع ملفه الأصلي؟", options: ["الاسم فقط", "نفس inode وبيانات الملف", "المسار فقط", "الامتداد فقط"], answer: 1, explanation: "الرابط الصلب اسم آخر لنفس inode." },
    ],
    reviewed: false,
  },
  {
    id: "lnx-10",
    number: 10,
    youtubeId: "dYDO18vHPno",
    title: "The Complete Linux Course: File permissions chmod command (Arabic)",
    duration: "PT3M23S",
    youtube: `${PL}dYDO18vHPno${list}`,
    summary:
      "فهم صلاحيات لينكس: القراءة r والكتابة w والتنفيذ x ثلاث فئات (المالك، المجموعة، الآخرون)، والصيغة الرقمية مثل 755 والرمزية مثل u+x، وأمر chmod لتعديلها — مع تنبيه تحذيري من جعل ملفات النظام قابلة للكتابة للجميع.",
    terms: [
      { en: "Permission", ar: "ثلاثة بتات لكل فئة: قراءة r وكتابة w وتنفيذ x." },
      { en: "chmod", ar: "الأمر الذي يغيّر صلاحيات ملف أو مجلد.", example: "chmod 755 script.sh" },
      { en: "r / w / x", ar: "قراءة=4، كتابة=2، تنفيذ=1 وتجمع لكل فئة.", example: "rwxr-xr-x" },
    ],
    practice: [
      { type: "chmod", prompt: "حوّل الصلاحيات rwxr-xr-x إلى صيغتها الرقمية", answer: "755", accept: ["755"], explanation: "rwx=7 للمالك، r-x=5 للمجموعة والآخرين." },
      { type: "chmod", prompt: "حوّل الرقم 644 إلى رموز صلاحيات", answer: "rw-r--r--", accept: ["rw-r--r--"], explanation: "6=rw- و 4=r-- ثلاث مرات." },
      { type: "chmod", prompt: "حوّل الرقم 750 إلى رموز صلاحيات", answer: "rwxr-x---", accept: ["rwxr-x---"], explanation: "7=rwx و 5=r-x و 0=---." },
      { type: "cmd", prompt: "اجعل script.sh قابلا للتنفيذ لمالكه فقط بصيغة رقمية", answer: "chmod 744 script.sh", accept: ["chmod 744 script.sh", "chmod u+x script.sh"], explanation: "744 = rwx للمالك و r-- للباقين." },
      { type: "mcq", prompt: "أي رقم يمثل rw-rw-r--؟", options: ["664", "644", "666", "624"], answer: 0, explanation: "6=rw- مرتين ثم 4=r--." },
    ],
    reviewed: false,
  },
];


// ---------- merge curated + bulk, assign sections ----------
const sectionOf = new Map<number, string>();
for (const s of LINUX_SECTIONS) for (const n of s.videos) sectionOf.set(n, s.id);

export const linuxVideos: LinuxVideo[] = [
  ...curatedVideos.map((v) => ({ ...v, section: sectionOf.get(v.number) ?? "commands" })),
  ...linuxVideosBulk.map((v) => ({ ...v, section: sectionOf.get(v.number) ?? "commands" })),
].sort((a, b) => a.number - b.number);

/** Integrity guard (runs at import in dev/build): ids unique, sections cover 1..53. */
export function linuxCatalogueProblems(): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const v of linuxVideos) {
    if (ids.has(v.id)) problems.push(`duplicate id ${v.id}`);
    ids.add(v.id);
    if (!sectionOf.has(v.number)) problems.push(`lesson #${v.number} not mapped to a section`);
    if (v.terms.length === 0 && v.practice.length > 0) problems.push(`lesson ${v.id}: practice without terms`);
  }
  if (linuxVideos.length !== 53) problems.push(`expected 53 lessons, got ${linuxVideos.length}`);
  return problems;
}

export function findLinuxCourse(id: string): LinuxCourse | undefined {
  return linuxCourses.find((c) => c.id === id);
}

export function findLinuxVideo(id: string): LinuxVideo | undefined {
  return linuxVideos.find((v) => v.id === id);
}

export function linuxVideosBySection(sectionId: string): LinuxVideo[] {
  return linuxVideos.filter((v) => v.section === sectionId).sort((a, b) => a.number - b.number);
}

export function linuxVideoIndex(id: string): number {
  return linuxVideos.findIndex((v) => v.id === id);
}

/** Normalize typed answers: trim, collapse spaces, lowercase, strip quotes. */
export function normalizeLinuxAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^['"]+|['"]+$/g, "");
}

