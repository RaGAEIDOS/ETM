/**
 * CS50x lectures 8-13 (Week 6 — Python through Week 10 — The End).
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

export const CS50X_LECTURES_8_13: Cs50xLecture[] = [
  {
    id: "week-6",
    number: 8,
    youtubeId: "Rl0ludWTLxs",
    title: "CS50x - Lecture 6 - Python",
    durationSeconds: 8972,
    youtube: WATCH("Rl0ludWTLxs"),
    week: "Week 6 · Python",
    weekUrl: WEEK(6),
    notesUrl: NOTES(6),
    psetUrl: PSET(6),
    sectionUrl: SECTION(6),
    summary:
      "نفس المنطق الذي تعرفه من C لكن بلغة عالية المستوى: طواعية الكتابة وكتابتها بسلاسة، المتغيرات والحلقات والدوال، المكتبات، وتقنية البرمجة بكود أقل وأكثر وضوحًا — لماذا تستخدم Python اليوم في كل مكان.",
    terms: [
      { en: "Dynamically Typed", ar: "الأنواع تُحدد عند التنفيذ وليس وقت التصريف." },
      { en: "Library", ar: "وحدات جاهزة تستدعيها (import) بدل إعادة كتابة كل شيء." },
      { en: "Interpreter", ar: "تنفيذ الكود مباشرة سطرًا سطرًا دون ملف تنفيذي." },
    ],
    practice: [
      { type: "mcq", prompt: "كيف يُنفذ كود Python؟", options: ["يُصرّف أولًا لملف EXE", "يُفسر سطرًا سطرًا", "يُحول إلى كتل رسومية", "يُنفذ على الخادم فقط"], answer: 1, explanation: "المفسّر يقرأ السطر وينفذه مباشرة." },
      { type: "mcq", prompt: "الاستدعاء الصحيح لطباعة نص في Python؟", options: ["printf(\"hi\")", "echo(\"hi\")", "print(\"hi\")", "cout << \"hi\""], answer: 2, explanation: "دالة الطباعة المدمجة في Python هي print()." },
      { type: "fill", prompt: "الكلمة المفتاحية لتعريف دالة في Python؟", answer: "def", accept: ["def"], explanation: "الدوال تُعرّف بكلمة def." },
    ],
    reviewed: false,
  },
  {
    id: "week-7",
    number: 9,
    youtubeId: "oqRU2So6Z2Y",
    title: "CS50x - Lecture 7 - SQL",
    durationSeconds: 8133,
    youtube: WATCH("oqRU2So6Z2Y"),
    week: "Week 7 · SQL",
    weekUrl: WEEK(7),
    notesUrl: NOTES(7),
    psetUrl: PSET(7),
    sectionUrl: SECTION(7),
    summary:
      "قاعدة البيانات العلائقية: الجداول والصفوف والأعمدة، الاستعلامات SELECT و WHERE و ORDER BY و GROUP BY و JOIN — كيف يتحول سيل البيانات إلى إجابات دقيقة ومُخبّأة في Google Sheets أو SQLite.",
    terms: [
      { en: "SQL", ar: "لغة الاستعلام البنيوي — تخاطب بها أي قاعدة علائقية." },
      { en: "JOIN", ar: "دمج صفوف من جدولين أو أكثر وفق علاقة مشتركة." },
      { en: "Index", ar: "بنية تسرّع البحث مقابل كتابة أبطأ وتخزين أكبر." },
    ],
    practice: [
      { type: "mcq", prompt: "أي كلمة أساسية تسترجع الصفوف من جدول؟", options: ["GET", "PULL", "SELECT", "SHOW"], answer: 2, explanation: "الأمر الأساسي هو SELECT." },
      { type: "mcq", prompt: "ما وظيفة WHERE؟", options: ["ترتيب النتائج", "تصفية الصفوف بشرط", "حذف الجدول", "نسخ البيانات"], answer: 1, explanation: "WHERE تبقي فقط الصفوف التي تحقق الشرط." },
      { type: "fill", prompt: "الكلمة المفتاحية لدمج جدولين عبر عمود مشترك؟", answer: "JOIN", accept: ["join"], explanation: "JOIN تطابق الصفوف من جدولين وفق مفتاح مشترك." },
    ],
    reviewed: false,
  },
  {
    id: "ai",
    number: 10,
    youtubeId: "-9bo8HlSxwQ",
    title: "CS50x - Artificial Intelligence",
    durationSeconds: 2869,
    youtube: WATCH("-9bo8HlSxwQ"),
    week: "Artificial Intelligence",
    weekUrl: WEEK("ai"),
    notesUrl: "https://cs50.harvard.edu/x/notes/ai/",
    summary:
      "الذكاء الاصطناعي بمنظور علوم الحاسوب: البحث وإيجاد الحلول، التعلم من البيانات، النماذج اللغوية الكبيرة وكيف تعمل تحت الغطاء — وبالأهم: متى تستعين بها ومتى لا.",
    terms: [
      { en: "Search", ar: "استكشاف حالات ممكنة للوصول إلى هدف — أساس حلول الذكاء الاصطناعي." },
      { en: "LLM", ar: "نموذج لغوي كبير متدرّب على نصوص ضخمة ليولّد النصوص ويحللها." },
      { en: "Hallucination", ar: "إجابة مفصَّلة تبدو صحيحة لكنها مختلقة — تحقق دائمًا." },
    ],
    practice: [
      { type: "mcq", prompt: "ما معنى hallucination في سياق الذكاء الاصطناعي؟", options: ["تعطل النموذج", "إنتاج إجابة مقنعة لكن خاطئة", "ذاكرة مفقودة", "بطء الاستجابة"], answer: 1, explanation: "النموذج قد يولّد معلومات غير صحيحة بثقة." },
      { type: "mcq", prompt: "ما الاستخدام السليم للذكاء الاصطناعي في تكليفات الدورة؟", options: ["نسخ الحلول كاملة", "الاستعانة به للتعلم مع فهم ما ينتجه", "تركه يحل كل شيء", "إخفاء استخدامه"], answer: 1, explanation: "الدورة تشجع الفهم لا النقل — الأمانة الأكاديمية أولًا." },
      { type: "fill", prompt: "الاختصار الشائع للنماذج اللغوية الكبيرة؟", answer: "LLM", accept: ["llm"], explanation: "Large Language Model." },
    ],
    reviewed: false,
  },
  {
    id: "week-8",
    number: 11,
    youtubeId: "yYst7puZXjw",
    title: "CS50x - Lecture 8 - HTML, CSS, JavaScript",
    durationSeconds: 8532,
    youtube: WATCH("yYst7puZXjw"),
    week: "Week 8 · HTML, CSS, JavaScript",
    weekUrl: WEEK(8),
    notesUrl: NOTES(8),
    psetUrl: PSET(8),
    sectionUrl: SECTION(8),
    summary:
      "من سطر الأوامر إلى المتصفح: بناء صفحة حقيقية — بنية HTML للمحتوى، تنسيق CSS للشكل، JavaScript للسلوك والتفاعل — وربطها معًا لتصنع أول تطبيق ويب تفاعلي.",
    terms: [
      { en: "DOM", ar: "شجرة عناصر الصفحة التي يتلاعب بها JavaScript." },
      { en: "Selector", ar: "قاعدة CSS تختار العناصر المراد تنسيقها." },
      { en: "Event", ar: "حدث يطلقه المستخدم (نقرة/كتابة) وترد عليه في JavaScript." },
    ],
    practice: [
      { type: "mcq", prompt: "أي طبقة تتولى الشكل والمظهر؟", options: ["HTML", "CSS", "JavaScript", "SQL"], answer: 1, explanation: "CSS مسؤولة عن الألوان والأحجام والمواضع." },
      { type: "mcq", prompt: "ماذا تمثل DOM؟", options: ["اتصال الإنترنت", "شجرة عناصر الصفحة", "قاعدة البيانات", "خريطة الموقع"], answer: 1, explanation: "المتصفح يحول HTML إلى شجرة يسمح JavaScript بالتلاعب بها." },
      { type: "fill", prompt: "وسم HTML الأساسي لفقرة نصية؟", answer: "<p>", accept: ["<p>", "p"], explanation: "العنصر <p> يحيط بالفقرة." },
    ],
    reviewed: false,
  },
  {
    id: "week-9",
    number: 12,
    youtubeId: "am7POvSZ4GE",
    title: "CS50x - Lecture 9 - Flask",
    durationSeconds: 8796,
    youtube: WATCH("am7POvSZ4GE"),
    week: "Week 9 · Flask",
    weekUrl: WEEK(9),
    notesUrl: NOTES(9),
    psetUrl: PSET(9),
    sectionUrl: SECTION(9),
    summary:
      "تطوير التطبيقات الويب: إطار Flask بلغة Python — المسارات والطلبات والاستجابات، القوالب (Jinja)، جلسات العمل والبيانات المحفوظة — ثم تطبيق عملي يجمع كل ما سبق في موقع فعلي.",
    terms: [
      { en: "Flask", ar: "إطار ويب صغير بلغة Python لبناء التطبيقات والمواقع." },
      { en: "Route", ar: "ربط عنوان URL بتنفيذ دالة معينة." },
      { en: "Template", ar: "قالب Jinja تُحقن فيه بيانات من الخادم ليُعرض كصفحة." },
    ],
    practice: [
      { type: "mcq", prompt: "ما لغة Flask؟", options: ["JavaScript", "C", "Python", "SQL"], answer: 2, explanation: "Flask إطار Python صغير لبناء تطبيقات الويب." },
      { type: "mcq", prompt: "ماذا تعني Route؟", options: ["مجلد على القرص", "ربط عنوان URL بدالة معالجة", "نوع قاعدة بيانات", "تحذير أمان"], answer: 1, explanation: "كل مسار @app.route('/') ينفذ الدالة المحددة." },
      { type: "fill", prompt: "تقنية القوالب التي يستخدمها Flask (اسمها)؟", answer: "Jinja", accept: ["jinja", "jinja2"], explanation: "Jinja2 هي محرك القوالب الافتراضي في Flask." },
    ],
    reviewed: false,
  },
  {
    id: "week-10",
    number: 13,
    youtubeId: "ApQTgFkf8TU",
    title: "CS50x - Lecture 10 - The End",
    durationSeconds: 3125,
    youtube: WATCH("ApQTgFkf8TU"),
    week: "Week 10 · The End",
    weekUrl: WEEK(10),
    notesUrl: NOTES(10),
    psetUrl: "https://cs50.harvard.edu/x/psets/",
    summary:
      "الختام: إلى أين تذهب بعد CS50x — التعلم المستمر، مجتمع المصادر، معرض المشاريع النهائية، وكيف تحول ما اكتسبته إلى مشاريع ووظائف حقيقية.",
    terms: [
      { en: "Final Project", ar: "مشروعك الختامي الذي يُحسب للشهادة بعد حله ≥ 70%." },
      { en: "Gallery", ar: "معرض مشاريع الخريجين على موقع الدورة — إلهام لوجهتك القادمة." },
    ],
    practice: [
      { type: "mcq", prompt: "ماذا يتضمن مسار الشهادة الحرة؟", options: ["10 problem sets + مشروع نهائي بسكور ≥ 70%", "اجتياز اختبار واحد فقط", "شراء دورة مدفوعة", "حضور كل المحاضرات دون تسليم"], answer: 0, explanation: "الشروط من صفحة الشهادة الرسمية: ≥ 70% في كل تكليف + المشروع النهائي." },
      { type: "mcq", prompt: "أين تُسلم التكليفات والمشروع النهائي؟", options: ["على Discord", "عبر cs50.dev وحساب edX", "بالبريد", "محليًا على جهازك فقط"], answer: 1, explanation: "التسليم عبر بيئة cs50.dev وربطها بحساب edX." },
      { type: "fill", prompt: "ما الحد الأدنى للدرجة في كل تكليف للشهادة؟", answer: "70%", accept: ["70", "70%"], explanation: "الشهادة الحرة تتطلب ≥ 70% في كل problem set وفي المشروع النهائي." },
    ],
    reviewed: false,
  },
];
