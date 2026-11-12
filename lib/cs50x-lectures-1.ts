/**
 * CS50x lectures 1-7 (Introduction through Week 5 — Data Structures).
 * Content is ORIGINAL Arabic text (our own words); metadata is from the
 * official CS50x Lectures playlist (Invidious, 2026-11-12). reviewed:false.
 */
import type { Cs50xLecture } from "./cs50x.ts";

const WATCH = (id: string) =>
  `https://www.youtube.com/watch?v=${id}&list=PLhQjrBD2T380hlTqAU8HfvVepCcjCqTg6`;

const WEEK = (n: string | number) => `https://cs50.harvard.edu/x/weeks/${n}/`;
const NOTES = (n: string | number) => `https://cs50.harvard.edu/x/notes/${n}/`;
const PSET = (n: string | number) => `https://cs50.harvard.edu/x/psets/${n}/`;
const SECTION = (n: string | number) => `https://cs50.harvard.edu/x/sections/${n}/`;

export const CS50X_LECTURES_1_7: Cs50xLecture[] = [
  {
    id: "intro",
    number: 1,
    youtubeId: "HJP0a6vKvlo",
    title: "CS50x - Introduction",
    durationSeconds: 104,
    youtube: WATCH("HJP0a6vKvlo"),
    week: "Introduction",
    weekUrl: "https://cs50.harvard.edu/x/",
    summary:
      "تعريف بالدورة: ماذا ستتعلم خلال رحلتك في CS50x — التفكير الحسابي، اللغة C ثم Python و SQL والويب — ولماذا لا تحتاج أي خبرة برمجية سابقة لإكمالها.",
    terms: [
      { en: "Computational Thinking", ar: "أسلوب حل المشكلات عبر الخطوات المنطقية — ما تركّز عليه الدورة أكثر من أي لغة." },
      { en: "Problem Set", ar: "التكليف البرمجي لكل أسبوع؛ يُسلم عبر منصة الدورة ويُقيّم آليًا وأسلوبيًا." },
    ],
    practice: [
      { type: "mcq", prompt: "ما المهارة الأهم التي تبنيها CS50x؟", options: ["حفظ أوامر لغة واحدة", "التفكير الحسابي وحل المشكلات", "تصميم الرسومات", "إدارة الخوادم"], answer: 1, explanation: "الدورة تعلّم التفكير الحسابي أولًا، وتستخدم C و Python كأدوات." },
      { type: "mcq", prompt: "هل تحتاج خبرة برمجية سابقة؟", options: ["نعم، سنة على الأقل", "لا — مصممة للمبتدئين بالكامل", "نعم، بلغة C", "نعم، برياضيات متقدمة"], answer: 1, explanation: "ثلثا الطلاب يبدأون بلا أي خبرة برمجية." },
      { type: "fill", prompt: "ما اسم أول لغة برمجة في الدورة؟", answer: "C", accept: ["c"], explanation: "تبدأ الدورة بلغة C لفهم أساس الحواسيب ثم تنتقل إلى Python." },
    ],
    reviewed: false,
  },
  {
    id: "week-0",
    number: 2,
    youtubeId: "UuIEbpQms8o",
    title: "CS50x - Lecture 0 - Scratch",
    durationSeconds: 7253,
    youtube: WATCH("UuIEbpQms8o"),
    week: "Week 0 · Scratch",
    weekUrl: WEEK(0),
    notesUrl: NOTES(0),
    psetUrl: PSET(0),
    sectionUrl: SECTION(0),
    summary:
      "المحاضرة التأسيسية: البرمجة بأسلوب الكتل (Blocks) — والمنطق نفسه الذي ستستعمله في كل اللغات بعدها: التسلسل، والشروط، والحلقات، والمتغيرات، والأحداث، مع لعبة Scratch.",
    terms: [
      { en: "Algorithm", ar: "خطوات مرتبة لحل مشكلة — جوهر كل برنامج." },
      { en: "Pseudocode", ar: "وصف الحل بلغة شبه طبيعية قبل كتابة الكود." },
      { en: "Binary", ar: "تمثيل البيانات بالأرقام 0 و 1 — لغة الحاسوب الداخلية." },
    ],
    practice: [
      { type: "mcq", prompt: "ما معنى Algorithm؟", options: ["نوع من الأخطاء", "خطوات محددة ومرتبة لحل مشكلة", "لغة برمجة", "نظام ألوان"], answer: 1, explanation: "الخوارزمية مجموعة خطوات دقيقة تحل مسألة محددة." },
      { type: "mcq", prompt: "نظام العد المستخدم داخل الحاسوب هو:", options: ["العشري", "السداسي العشري", "الثنائي (0 و 1)", "الروماني"], answer: 2, explanation: "الحواسيب تمثّل كل شيء منطقيًا بثنائيات." },
      { type: "fill", prompt: "اسم بيئة البرمجة بالكتل التي تبدأ بها الدورة؟", answer: "Scratch", accept: ["scratch"], explanation: "Scratch بيئة من MIT تبني البرامج بتجميع كتل مرئية." },
    ],
    reviewed: false,
  },
  {
    id: "week-1",
    number: 3,
    youtubeId: "SlqjA04_dpk",
    title: "CS50x - Lecture 1 - C",
    durationSeconds: 9018,
    youtube: WATCH("SlqjA04_dpk"),
    week: "Week 1 · C",
    weekUrl: WEEK(1),
    notesUrl: NOTES(1),
    psetUrl: PSET(1),
    sectionUrl: SECTION(1),
    summary:
      "أول لغة احترافية: تثبيت VS Code وزر التشغيل الأول، دالة main وقواعد كتابة C، أنواع البيانات (int, float, char, string)، المتغيرات والمدخلات والمخرجات، الحلقات والشروط وكيف يتصرف البرنامج خطوة خطوة.",
    terms: [
      { en: "Compilation", ar: "تحويل الكود المصدري إلى كود آلي يفهمه المعالج." },
      { en: "Source Code", ar: "النص الذي تكتبه أنت — ثم يُترجم عبر المترجم." },
      { en: "IDE", ar: "بيئة التطوير المتكاملة (VS Code على cs50.dev / cloud)." },
    ],
    practice: [
      { type: "mcq", prompt: "ما وظيفة المترجم (Compiler)؟", options: ["رسم الواجهات", "تحويل كود C إلى برنامج آلي", "رفع الكود إلى GitHub", "ضغط الملفات"], answer: 1, explanation: "gcc يحوّل كود C المقروء إلى ملف تنفيذي." },
      { type: "mcq", prompt: "أين تبدأ دالة البرنامج الرئيسية في C؟", options: ["int start()", "void go()", "int main()", "int program()"], answer: 2, explanation: "التنفيذ يبدأ من int main()." },
      { type: "fill", prompt: "أمر الطباعة الأساسي في C؟ (بدون أقواس)", answer: "printf", accept: ["printf"], explanation: "printf من مكتبة stdio.h تُخرج النصوص إلى الشاشة." },
    ],
    reviewed: false,
  },
  {
    id: "week-2",
    number: 4,
    youtubeId: "h5Gc1n8ZuU8",
    title: "CS50x - Lecture 2 - Arrays",
    durationSeconds: 8735,
    youtube: WATCH("h5Gc1n8ZuU8"),
    week: "Week 2 · Arrays",
    weekUrl: WEEK(2),
    notesUrl: NOTES(2),
    psetUrl: PSET(2),
    sectionUrl: SECTION(2),
    summary:
      "المصفوفات: متغيرات تحمل أكثر من قيمة متجاورة من النوع نفسه، وربط النصوص كسلال أحرف منتهية بصفر، وقيمة وسيطات سطر الأوامر وفهرسة كل عنصر بدءًا من الصفر.",
    terms: [
      { en: "Array", ar: "متغير واحد يخزن عدة قيم من النوع نفسه تحت مكان واحد بالذاكرة." },
      { en: "String", ar: "مصفوفة أحرف منتهية بصفر (\\0) تمثل نصًا." },
      { en: "argc / argv", ar: "وسيطات سطر الأوامر: عددها ومحتواها." },
    ],
    practice: [
      { type: "mcq", prompt: "ما فهرس أول عنصر في مصفوفة C؟", options: ["1", "0", "-1", "الأول عشوائي"], answer: 1, explanation: "الفهرسة تبدأ من 0 في C." },
      { type: "mcq", prompt: "أين ينتهي النص (string) في الذاكرة؟", options: ["بصفر \\0", "بسطر جديد", "بفراغ", "بفاصلة"], answer: 0, explanation: "السلسلة في C تنهي بصفر (null terminator)." },
      { type: "fill", prompt: "ما وظيفة argc؟", answer: "argument count", accept: ["عدد الوسيطات", "argument count", "count"], explanation: "argc هو عدد الوسيطات التي وصلت عبر سطر الأوامر." },
    ],
    reviewed: false,
  },
  {
    id: "week-3",
    number: 5,
    youtubeId: "6Svu_ae5ebk",
    title: "CS50x - Lecture 3 - Algorithms",
    durationSeconds: 7176,
    youtube: WATCH("6Svu_ae5ebk"),
    week: "Week 3 · Algorithms",
    weekUrl: WEEK(3),
    notesUrl: NOTES(3),
    psetUrl: PSET(3),
    sectionUrl: SECTION(3),
    summary:
      "تحليل الخوارزميات ونظرية التعقيد: Big O — البحث الخطي مقابل الثنائي، فرز الفقاعة والاختيار والإدراج، والخوارزمية الجيدة هي ما يقلل عدد الخطوات لا ما تنجح فقط.",
    terms: [
      { en: "Big O", ar: "ترميز يصف نمو زمن الخوارزمية مع حجم المدخل — مثال O(n) و O(log n)." },
      { en: "Binary Search", ar: "بحث في بيانات مرتبة يقسم المجال نصفين كل مرة — O(log n)." },
      { en: "Sort", ar: "ترتيب العناصر — bubble / selection / insertion كأمثلة تأسيسية." },
    ],
    practice: [
      { type: "mcq", prompt: "ما تعقيد البحث الثنائي O؟", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 1, explanation: "كل خطوة تكسر المجال للنصف." },
      { type: "mcq", prompt: "متى يصلح البحث الثنائي؟", options: ["البيانات مرتبة", "البيانات عشوائية دائمًا", "المصفوفات فارغة فقط", "لا علاقة للترتيب"], answer: 0, explanation: "النصف المتكرر لا يعمل إلا على بيانات مرتبة." },
      { type: "fill", prompt: "الإجراء الذي يرتّب المصفوفة بفروقات متكررة is …? اكتب اسم خوارزمية الفرز المذكور.", answer: "bubble", accept: ["bubble sort", "الفقاعة"], explanation: "Bubble Sort يقارب العناصر المتجاورة فيمرارات متكررة." },
    ],
    reviewed: false,
  },
  {
    id: "week-4",
    number: 6,
    youtubeId: "db0H0U13YsA",
    title: "CS50x - Lecture 4 - Memory",
    durationSeconds: 8395,
    youtube: WATCH("db0H0U13YsA"),
    week: "Week 4 · Memory",
    weekUrl: WEEK(4),
    notesUrl: NOTES(4),
    psetUrl: PSET(4),
    sectionUrl: SECTION(4),
    summary:
      "الذاكرة: المؤشرات (pointers)، العنوان مقابل القيمة، heap vs stack، malloc/free، ونسخ السلاسل بشكل صحيح — أخطاء الذاكرة وسموم valgrind والملفات بترميز بايت.",
    terms: [
      { en: "Pointer", ar: "متغير يحمل عنوان موقع ذاكرة آخر." },
      { en: "malloc", ar: "حجز ذاكرة على الـ Heap تحتاج لتحريرها بـ free." },
      { en: "Buffer Overflow", ar: "الكتابة خلف نهاية مصفوفة — ثغرة شائعة وخطيرة." },
    ],
    practice: [
      { type: "mcq", prompt: "ماذا يخزن المؤشر؟", options: ["القيمة نفسها", "عنوان الذاكرة", "اسم المتغير", "طول المصفوفة"], answer: 1, explanation: "المؤشر يحمل عنوان البايتات التي تقابل القيمة." },
      { type: "mcq", prompt: "ما ثمرة malloc دون free؟", options: ["تسرب الذاكرة", "برنامج أسرع", "لا شيء", "ضغط تلقائي"], answer: 0, explanation: "الذاكرة المحجوزة بلا تحرير تتراكم حتى النفاذ." },
      { type: "fill", prompt: "عامل استخراج العنوان (&) يعني …", answer: "address of", accept: ["عنوان"], explanation: "& يرجع عنوان المتغير، و * تتبع المؤشر للوصول للقيمة." },
    ],
    reviewed: false,
  },
  {
    id: "week-5",
    number: 7,
    youtubeId: "PmAI76OGE_E",
    title: "CS50x - Lecture 5 - Data Structures",
    durationSeconds: 7430,
    youtube: WATCH("PmAI76OGE_E"),
    week: "Week 5 · Data Structures",
    weekUrl: WEEK(5),
    notesUrl: NOTES(5),
    psetUrl: PSET(5),
    sectionUrl: SECTION(5),
    summary:
      "البنى المترابطة: القوائم المتصلة وكيف تتفوق على المصفوفات في الإدراج، الأشجار، جداول التجزئة والرسوم البيانية — هياكل بيانات تتسع دون إعادة بناء دائم.",
    terms: [
      { en: "Linked List", ar: "عُقد تربطها مؤشرات؛ تتوسع بلا حدود وثمنها عبور العناصر." },
      { en: "Hash Table", ar: "تحويل المفتاح index عبر دالة تجزئة للوصول شبه الفوري." },
      { en: "Tree", ar: "بنية هرمية تبحث كل مستوى في log n مقارنات." },
    ],
    practice: [
      { type: "mcq", prompt: "ما ميزة القائمة المتصلة على المصفوفة؟", options: ["الوصول العشوائي O(1)", "الإدراج والحذف بسهولة", "ترتيب تلقائي", "حجم ثابت"], answer: 1, explanation: "تعديل الروابط أرخص من نقل كتل ذاكرة." },
      { type: "mcq", prompt: "ما عمل دالة التجزئة؟", options: ["تشفير كلمة المرور", "تحويل المفتاح إلى فهرس", "ضغط البيانات", "فرز المصفوفة"], answer: 1, explanation: "الدالة توزّع المفاتيح على الجيوب (buckets)." },
      { type: "fill", prompt: "الهيكل الهرمي المستخدم في البحث المستمر هو؟", answer: "tree", accept: ["شجرة", "binary search tree"], explanation: "Binary Search Tree تمنع عنصر يمين أكبر ويسار أصغر." },
    ],
    reviewed: false,
  },
];
