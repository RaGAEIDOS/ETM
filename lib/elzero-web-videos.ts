/**
 * ElZero Web track data — HTML, CSS, JavaScript Bootcamp, TypeScript,
 * SASS and Git & GitHub courses by Elzero Web School on YouTube
 * (official channel, official playlists). Tier 3 (PHP) is intentionally absent.
 *
 * Metadata (ids, titles, durations, order) is REAL, fetched via Invidious
 * from the official playlists (see scripts/fetch-elzero-web-playlists.mjs).
 * Every video is embedded through YouTube's official player; nothing is
 * downloaded or re-hosted. Summaries, terms and practice are ORIGINAL
 * Arabic text, conservative and reviewed:false until watched by a human.
 * Credit + non-affiliation line is required on every page of this track.
 */

import { elzeroWebVideosBulk } from "./elzero-web-videos-bulk.ts";

export const ELZERO_WEB_CHANNEL = "https://www.youtube.com/@ElzeroWebSchool";
export const ELZERO_WEB_SITE = "https://elzero.org";
export const ELZERO_CREDIT =
  "Content by Elzero Web School on YouTube. This platform is not affiliated with Elzero Web School.";
export const ELZERO_WEB_CATALOGUE_VERSION = 1;

export interface ElzeroWebKeyTerm {
  en: string;
  ar: string;
  /** Short English example line (markup, CSS or JS snippet). */
  example?: string;
}

/** Practice items for the Web track. Exactly one correct answer each. */
export type ElzeroWebPracticeItem =
  /** Multiple choice. `family` is a display hint only (quiz type stays mcq). */
  | {
      type: "mcq";
      family?: "mcq" | "selector" | "specificity" | "predict" | "bug" | "a11y";
      prompt: string;
      options: string[];
      answer: number;
      explanation: string;
    }
  /** Typed short answer (tag/property/value). `accept` lists normalized acceptable answers; the first is canonical. */
  | { type: "fill"; prompt: string; answer: string; accept?: string[]; explanation: string }
  /** Ordered steps — display order is shuffled; `steps` is the correct order. */
  | { type: "order"; prompt: string; steps: string[]; explanation: string }
  /** Match element/property to purpose. Scores as one item. */
  | { type: "match"; prompt?: string; pairs: { left: string; right: string }[]; explanation: string };

export interface ElzeroWebBulkVideo {
  /** Stable unique id ("html-001".."git-020"). */
  id: string;
  /** Course id (see ELZERO_WEB_COURSES). */
  course: string;
  /** 1-based order inside the course playlist. */
  number: number;
  youtubeId: string;
  /** Title as published on the channel. */
  title: string;
  /** ISO 8601 duration (e.g. "PT11M5S"). */
  duration: string;
  /** Full watch URL incl. &list= for "watch on YouTube" links. */
  youtube: string;
  /** Section id (see ELZERO_WEB_SECTIONS). */
  section: string;
}

export interface ElzeroWebVideo extends ElzeroWebBulkVideo {
  /** 2-4 sentences, Arabic, original. Conservative when reviewed:false. */
  summary: string;
  /** Version note for 2021-2022 era material; omit when the content is timeless. */
  versionNote?: string;
  /** 1-5 key terms. */
  terms: ElzeroWebKeyTerm[];
  /** 3-5 practice items. */
  practice: ElzeroWebPracticeItem[];
  reviewed: boolean;
}

export type ElzeroWebCourseIcon =
  | "code"
  | "palette"
  | "braces"
  | "type"
  | "paintbrush"
  | "git-branch";

export interface ElzeroWebCourse {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  lessons: number;
  totalTime: string;
  playlistId: string;
  playlistUrl: string;
  /** Official course page on elzero.org. */
  courseUrl: string;
  /** Official study plan (ordered weekly path), when it exists. */
  studyPlanUrl?: string;
  /** Official assignments archive, when it exists. Link only — never copied. */
  assignmentsUrl?: string;
  color: string;
  icon: ElzeroWebCourseIcon;
}

export const ELZERO_WEB_COURSES: ElzeroWebCourse[] = [
  {
    id: "html",
    title: "تعلم HTML In Arabic 2021",
    titleEn: "Learn HTML In Arabic 2021",
    description:
      "كورس HTML كامل: من أساسيات إنشاء الصفحة وبنية المستند، إلى العناصر والروابط والصور والجداول والنماذج، وحتى عناصر إمكانية الوصول (ARIA) والأداء.",
    lessons: 37,
    totalTime: "4h 12m",
    playlistId: "PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
    courseUrl: "https://elzero.org/category/courses/html-course/",
    studyPlanUrl: "https://elzero.org/study/html-2021-study-plan/",
    assignmentsUrl: "https://elzero.org/category/assignments/html-assignments/",
    color: "from-orange-400 to-rose-500",
    icon: "code",
  },
  {
    id: "css",
    title: "تعلم CSS In Arabic 2021",
    titleEn: "Learn CSS In Arabic 2021",
    description:
      "كورس CSS كامل: الخلفيات وصندوق العناصر والنصوص والخطوط، ثم Flexbox والـ Grid والتحويلات والحركات، وحتى Media Queries وبناء إطار عمل مصغر.",
    lessons: 88,
    totalTime: "11h 28m",
    playlistId: "PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe",
    courseUrl: "https://elzero.org/category/courses/css-course/",
    studyPlanUrl: "https://elzero.org/study/css-2021-study-plan/",
    assignmentsUrl: "https://elzero.org/category/assignments/css-assignments/",
    color: "from-sky-400 to-indigo-500",
    icon: "palette",
  },
  {
    id: "javascript",
    title: "Learn JavaScript In Arabic 2021",
    titleEn: "Learn JavaScript In Arabic 2021",
    description:
      "البوت كامب الكامل: أنواع البيانات والمتغيرات والمعاملات، ثم الدوال والـ Higher Order Functions، والـ DOM والـ BOM والتخزين المحلي، والـ OOP والـ Prototypes، وأخيرًا AJAX والـ Promises والـ async/await.",
    lessons: 188,
    totalTime: "19h 23m",
    playlistId: "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv",
    courseUrl: "https://elzero.org/category/courses/javascript-bootcamp/",
    studyPlanUrl: "https://elzero.org/study/javascript-bootcamp-2021-study-plan/",
    assignmentsUrl: "https://elzero.org/category/assignments/javascript-bootcamp-assignments/",
    color: "from-amber-400 to-yellow-500",
    icon: "braces",
  },
  {
    id: "typescript",
    title: "Learn Typescript In Arabic 2022",
    titleEn: "Learn Typescript In Arabic 2022",
    description:
      "كورس TypeScript: تثبيت وضبط البيئة، أنواع البيانات والـ Annotations والـ Aliases، والواجهات والكلاسات والوراثة، وأخيرًا الـ Generics.",
    lessons: 38,
    totalTime: "3h 21m",
    playlistId: "PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ",
    courseUrl: "https://elzero.org/category/courses/typescript/",
    studyPlanUrl: "https://elzero.org/study/typescript-study-plan/",
    assignmentsUrl: "https://elzero.org/category/assignments/typescript-assignments/",
    color: "from-blue-400 to-cyan-600",
    icon: "type",
  },
  {
    id: "sass",
    title: "تعلم SASS In Arabic 2021",
    titleEn: "Learn SASS In Arabic 2021",
    description:
      "كورس SASS: المتغيرات والتعشيش والـ Placeholders والتحكم بالتدفق، ثم الـ Mixins والـ Functions والحلقات، وبناء نظام Grid كامل.",
    lessons: 19,
    totalTime: "2h 00m",
    playlistId: "PLDoPjvoNmBAzlpyFHOaB3b-eubmF0TAV2",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAzlpyFHOaB3b-eubmF0TAV2",
    courseUrl: "https://elzero.org/category/courses/sass-course/",
    studyPlanUrl: "https://elzero.org/study/sass-2021-study-plan/",
    assignmentsUrl: "https://elzero.org/category/assignments/sass-assignments/",
    color: "from-pink-400 to-fuchsia-500",
    icon: "paintbrush",
  },
  {
    id: "gitgithub",
    title: "Learn Git and Github (Arabic)",
    titleEn: "Learn Git and Github (Arabic)",
    description:
      "كورس Git و GitHub: إنشاء المستودعات والنسخ والرفع والسحب، والإعدادات والمفاتيح العامة وPull Requests والـ Branching والـ Stash والوسوم.",
    lessons: 20,
    totalTime: "2h 30m",
    playlistId: "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF",
    courseUrl: "https://elzero.org/category/courses/git-and-github/",
    color: "from-violet-400 to-purple-600",
    icon: "git-branch",
  },
];

export interface ElzeroWebSection {
  /** Unique within the course. */
  id: string;
  course: string;
  title: string;
  titleEn: string;
  description: string;
  /** Lesson numbers belonging to this section. */
  videos: number[];
}

function range(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

export const ELZERO_WEB_SECTIONS: ElzeroWebSection[] = [
  // HTML — grouped from the published titles/playlist order.
  { id: "intro", course: "html", title: "البدء وبنية الصفحة", titleEn: "Getting started & page structure", description: "مقدمة الدورة، العناصر والمتصفح، أول مشروع وأول صفحة، الرأس والعناصر المتداخلة، التعليقات، و Doctype.", videos: range(1, 6) },
  { id: "content", course: "html", title: "المحتوى والسمات", titleEn: "Text content & attributes", description: "العناوين، بناء الجمل، الفقرات، سمات العناصر، وعناصر التنسيق.", videos: range(7, 11) },
  { id: "links", course: "html", title: "الروابط والصور والقوائم", titleEn: "Links, images & lists", description: "الرابط النصي (Anchor)، الصور والتعامل مع المسارات، والقوائم UL و OL و DL.", videos: range(12, 14) },
  { id: "tables", course: "html", title: "الجداول والتقسيم", titleEn: "Tables & division", description: "الجداول، عناصر Span و Break و Horizontal Rule، و Div وطرق استخدامه، و HTML Entities.", videos: range(15, 18) },
  { id: "semantic", course: "html", title: "العناصر الدلالية والتخطيط", titleEn: "Semantic elements & layout", description: "العناصر الدلالية في HTML5، بناء التخطيط بالـ Div والـ Classes، وبناءه بالعناصر الدلالية.", videos: range(19, 21) },
  { id: "media", course: "html", title: "الوسائط", titleEn: "Media", description: "عنصر Audio وعنصر Video: الصوت والفيديو داخل الصفحة.", videos: range(22, 23) },
  { id: "forms", course: "html", title: "النماذج (الجزء 1 إلى 9)", titleEn: "Forms (Parts 1–9)", description: "أنواع حقول الإدخال و Label، Required و Placeholder، Action و Name و Method، وبقية أجزاء النماذج حتى Data List.", videos: range(24, 32) },
  { id: "extras", course: "html", title: "عناصر إضافية", titleEn: "Extra elements", description: "Q و BlockQuote و Wbr و Bdi و Button، ثم iFrame و Pre و Code.", videos: range(33, 34) },
  { id: "a11y", course: "html", title: "إمكانية الوصول والختام", titleEn: "Accessibility & wrap-up", description: "مقدمة Accessibility و ARIA وقارئات الشاشة، ونهاية الرحلة وماذا تفعل بعدها.", videos: range(35, 37) },

  // CSS
  { id: "basics", course: "css", title: "البدء والأساسيات", titleEn: "Getting started", description: "مقدمة ومتطلبات تعلم CSS، أول مشروع والصيغة (Syntax)، تنسيق العناصر، وقواعد التسمية.", videos: range(1, 4) },
  { id: "backgrounds", course: "css", title: "الخلفيات", titleEn: "Backgrounds", description: "لون الخلفية والصورة والتكرار، ثم Attachment والموضع والحجم.", videos: range(5, 6) },
  { id: "box", course: "css", title: "الصندوق والعرض", titleEn: "Box model & display", description: "Padding و Margin و Border و Outline، ثم Display والرؤية وتجميع المحددات والتعشيش والأبعاد والـ Overflow.", videos: range(7, 16) },
  { id: "text", course: "css", title: "النصوص والخطوط", titleEn: "Text & typography", description: "لون النص والظل والمحاذاة والزخرفة والتباعد، ثم الوراثة والخطوط Font Family و Size و Style والوحدات ومؤشر الفأرة.", videos: range(17, 26) },
  { id: "layout", course: "css", title: "التخطيط: Float والموضع", titleEn: "Layout: float & position", description: "Float و Clear، احتراف حسابات CSS، الشفافية، Position و Z-Index.", videos: range(27, 31) },
  { id: "lists-tables", course: "css", title: "القوائم والجداول", titleEn: "Lists & tables", description: "تنسيق القوائم وتنسيق الجداول.", videos: range(32, 33) },
  { id: "pseudo", course: "css", title: "Pseudo Classes و Elements", titleEn: "Pseudo classes & elements", description: "الفئات الزائفة والعناصر الزائفة: First Letter و Before و After و Content وتدريبات.", videos: range(34, 37) },
  { id: "boxes", course: "css", title: "الحدود والظلال والمتغيرات", titleEn: "Borders, shadows & variables", description: "Vendors Prefixes، Border Radius والظلال، The Box Model و Box Sizing، Transition و !Important و Margin Collapse ومتغيرات CSS.", videos: range(38, 45) },
  { id: "flex", course: "css", title: "Flexbox", titleEn: "Flexbox", description: "اتجاه Flex والالتفاف، Justify Content و Align Items و Align Content، Grow و Shrink و Order و Flex Basis، وإنهاء لعبة Flex Froggy.", videos: range(46, 53) },
  { id: "effects", course: "css", title: "الفلاتر والتدرجات", titleEn: "Filters & gradients", description: "Filters و Gradients و Pointer Events و Caret Color.", videos: range(54, 56) },
  { id: "grid", course: "css", title: "Grid", titleEn: "Grid", description: "Template Columns و Rows والفجوات، Justify و Align Content، Template Areas، Grid Child، ثم Min/Max/Autofill وإنهاء لعبة Grid Garden.", videos: range(57, 64) },
  { id: "transforms", course: "css", title: "التحويلات 2D و 3D", titleEn: "Transforms", description: "Scale و Rotate و Translate و Skew و Matrix و Transform Origin، ثم تحويلات 3D والـ Perspective و Backface Visibility.", videos: range(65, 73) },
  { id: "animation", course: "css", title: "الحركة Animation", titleEn: "Animations", description: "KeyFrames والاسم والمدة، Iteration Count و Timing Function، ثم Direction و Fill Mode و Play State و Delay وتدريبات.", videos: range(74, 77) },
  { id: "selectors", course: "css", title: "مرجع المحددات (1 إلى 5)", titleEn: "Selectors reference (Parts 1–5)", description: "خمسة أجزاء من مرجع المحددات Selectors في CSS.", videos: range(78, 82) },
  { id: "responsive", course: "css", title: "Media Queries والتجاوب", titleEn: "Media queries & responsive", description: "مقدمة Media Queries والمعايير والتدريب، وبناء إطار عمل خاص، و CSS Global Values، ونهاية الرحلة.", videos: range(83, 88) },

  // JavaScript Bootcamp
  { id: "intro", course: "javascript", title: "المقدمة وضبط البيئة", titleEn: "Introduction & setup", description: "مقدمة وما هو JavaScript، طريقة الدراسة، الأدوات و Chrome DevTools، أين نضع الكود، التعليقات، Output و Console.", videos: range(1, 9) },
  { id: "data-types", course: "javascript", title: "أنواع البيانات والمتغيرات", titleEn: "Data types & variables", description: "Data Types و typeof، المتغيرات وقواعد التسمية، Var و Let و Const، Strings والهروب، و Template Literals.", videos: range(10, 17) },
  { id: "operators", course: "javascript", title: "العوامل", titleEn: "Operators", description: "العوامل الحسابية، Unary Plus/Negation، Type Coercion، و Assignment Operators والتحديات.", videos: range(18, 22) },
  { id: "numbers", course: "javascript", title: "الأرقام والرياضيات", titleEn: "Numbers & math", description: "النوع Number وأهم دواله، و Math Object والتدريبات.", videos: range(23, 26) },
  { id: "strings", course: "javascript", title: "السلاسل النصية", titleEn: "Strings", description: "String Methods بثلاثة أجزاء والتدريبات.", videos: range(27, 30) },
  { id: "conditions", course: "javascript", title: "الشروط والـ Switch", titleEn: "Conditions & switch", description: "Comparison و Logical Operators، If و Nested If و Conditional Ternary و Nullish Coalescing، و Switch والتحديات.", videos: range(31, 39) },
  { id: "arrays", course: "javascript", title: "المصفوفات", titleEn: "Arrays", description: "المصفوفات و Length وطرق الإضافة والحذف والبحث والفرز والتقطيع والدمج والتدريبات.", videos: range(40, 47) },
  { id: "loops", course: "javascript", title: "الحلقات", titleEn: "Loops", description: "For ومفهوم الحلقة، التكرار على التسلسلات، التداخل، Break و Continue و Label، While و Do While، وتدريبات.", videos: range(48, 56) },
  { id: "functions", course: "javascript", title: "الدوال والبارامترات", titleEn: "Functions", description: "مقدمة الدوال والاستخدامات المتقدمة، Return و Default و Rest Parameters، وتدريبات.", videos: range(57, 63) },
  { id: "scopes", course: "javascript", title: "الدوال المتقدمة والنطاقات", titleEn: "Functions (cont.) & scope", description: "الدوال المجهولة، إرجاع دالة متداخلة، Arrow Functions، ونطاق Global/Local و Block و Lexical (Static).", videos: range(64, 70) },
  { id: "hof", course: "javascript", title: "Higher Order Functions", titleEn: "Higher order functions", description: "Map و Filter و Reduce و ForEach مع تدريبات وتحدي.", videos: range(71, 78) },
  { id: "objects", course: "javascript", title: "الكائنات و this", titleEn: "Objects & this", description: "Objects و Dot/Bracket Notation و Nested Objects، و Create بـ New و Object.create و Object.assign، و This.", videos: range(79, 85) },
  { id: "dom-1", course: "javascript", title: "DOM — الجزء الأول", titleEn: "DOM, part 1", description: "ما هو DOM واختيار العناصر، Get/Set Content و Attributes، إنشاء وإلحاق العناصر، الأبناء والـ Children، Events و Validate Form.", videos: range(86, 93) },
  { id: "dom-2", course: "javascript", title: "DOM — الجزء الثاني", titleEn: "DOM, part 2", description: "Event Simulation و ClassList و CSS Styling و Before/After/Prepend/Append، و Traversing و Cloning و addEventListener وتحدي DOM.", videos: range(94, 101) },
  { id: "bom", course: "javascript", title: "BOM والتوقيت", titleEn: "BOM & timers", description: "ما هو BOM، Alert/Confirm/Prompt، setTimeout و setInterval، Window Location/Open/History، و Scroll و ScrollTo وممارسة.", videos: range(102, 110) },
  { id: "storage", course: "javascript", title: "التخزين المحلي", titleEn: "Web storage", description: "Local Storage و Session Storage وتطبيق Color App العملي وتحدي BOM.", videos: range(111, 114) },
  { id: "destructure", course: "javascript", title: "Destructuring", titleEn: "Destructuring", description: "تفكيك المصفوفات والكائنات وبارامترات الدوال والمحتوى المختلط وتبادل المتغيرات والتدريبات.", videos: range(115, 122) },
  { id: "map-set", course: "javascript", title: "Map و Set وطرق المصفوفات", titleEn: "Map, set & array methods", description: "Set و WeakSet، Map و WeakMap، Array.from و copyWithin و some و every، و Spread Syntax والتدريبات.", videos: range(123, 133) },
  { id: "regex", course: "javascript", title: "التعبيرات النمطية", titleEn: "Regular expressions", description: "ما هو Regular Expression، الـ Modifiers والـ Ranges والـ Character Classes والـ Quantifiers، وتدريبات ومشروع التحقق من النماذج.", videos: range(134, 146) },
  { id: "oop", course: "javascript", title: "OOP والـ Prototypes", titleEn: "OOP & prototypes", description: "مقدمة OOP، Constructor Function و New Syntax، Class Static و Inheritance و Encapsulation، و Prototype والسلسلة، و Object Meta Data و Descriptor.", videos: range(147, 158) },
  { id: "date-modules", course: "javascript", title: "Date والمولدات والموديولات", titleEn: "Date, generators & modules", description: "التواريخ وتنسيقها وقياس زمن العمليات، Generator Functions و Delegation، و Modules Import/Export Named و Default.", videos: range(159, 168) },
  { id: "ajax-json", course: "javascript", title: "AJAX و JSON", titleEn: "AJAX & JSON", description: "JSON ومقارنته بكائن JS، ما هي الـ API، Parse و Stringify، Asynchronous vs Synchronous، Call Stack و Web API و Event Loop، وطلبات AJAX من API حقيقي.", videos: range(169, 178) },
  { id: "promises", course: "javascript", title: "Promises و async/await", titleEn: "Promises & async/await", description: "Callback Hell، Promise و Then/Catch/Finally، Fetch API، All و AllSettled و Race، Async/Await وتدريبات، وختام الدورة.", videos: range(179, 188) },

  // TypeScript
  { id: "intro", course: "typescript", title: "المقدمة والأدوات", titleEn: "Introduction & tooling", description: "ما هو TypeScript، التثبيت وتحويل الملفات، إنشاء ملف الإعدادات والمراقبة، ومقارنة اللغات Statically و Dynamically Typed.", videos: range(1, 4) },
  { id: "annotations", course: "typescript", title: "Type Annotations", titleEn: "Type annotations", description: "Type Annotations و Any، مع المصفوفات والأبعاد المتعددة والدوال، والبارامترات Optional و Default و Rest، والدوال المجهولة والسهمية.", videos: range(5, 11) },
  { id: "types-advanced", course: "typescript", title: "Aliases و Literal و Tuple و Enums", titleEn: "Advanced types", description: "Type Alias والمتقدم، Literal Types، Tuple، Void و Never، Enums بجزأين، Type Assertions، Union و Intersection، و Type Annotations للكائنات.", videos: range(12, 21) },
  { id: "interfaces", course: "typescript", title: "الواجهات Interfaces", titleEn: "Interfaces", description: "الإعلان عن Interface، الدوال والبارامترات، إعادة الفتح وحالات الاستخدام، Extend، والنقاش الختامي.", videos: range(22, 26) },
  { id: "classes", course: "typescript", title: "الكلاسات", titleEn: "Classes", description: "Class Type Annotations، Access Modifiers و Accessors و Static Members، Class Implement Interface، Abstract Classes، و Polymorphism و Method Override.", videos: range(27, 33) },
  { id: "generics", course: "typescript", title: "الـ Generics والختام", titleEn: "Generics & finish", description: "مقدمة Generics، أنواع متعددة، Classes، Generics مع Interfaces، وختام الدورة.", videos: range(34, 38) },

  // SASS
  { id: "intro", course: "sass", title: "مقدمة وأدوات الترجمة", titleEn: "Introduction & tooling", description: "ما هو SASS، أدوات الترجمة Compilation، و Import و Use وهندسة الملفات المتقدمة.", videos: range(1, 3) },
  { id: "variables", course: "sass", title: "المتغيرات والتعشيش", titleEn: "Variables & nesting", description: "المتغيرات، Nesting والعنصر الأب، و Property Declarations و Placeholder.", videos: range(4, 6) },
  { id: "flow", course: "sass", title: "التحكم بالتدفق والـ Interpolation", titleEn: "Control flow & interpolation", description: "If و Else (ومثلث باستخدامها)، Interpolation، والتعليقات والتوثيق.", videos: range(7, 10) },
  { id: "mixins-loops", course: "sass", title: "Mixins والحلقات والدوال", titleEn: "Mixins, loops & functions", description: "Mixin و Include، Loop For و Each و While، بناء نظام Grid، و Function.", videos: range(11, 16) },
  { id: "practice", course: "sass", title: "تدريبات عملية والختام", titleEn: "Practice & wrap-up", description: "تمرين Mixin مع Content، تمرين Mixin لاستعلامات الوسائط، وختام الدورة.", videos: range(17, 19) },

  // Git & GitHub
  { id: "basics", course: "gitgithub", title: "أساسيات Git و GitHub", titleEn: "Git & GitHub basics", description: "ما هو Git و GitHub ولماذا تتعلمه، إنشاء مستودع واستنساخه، Add و Reset و Commit، وعمليات الرفع والسحب.", videos: range(1, 6) },
  { id: "advanced", course: "gitgithub", title: "الإعدادات والمفاتيح والفروع", titleEn: "Config, keys & branches", description: "كل شيء عن Git Configurations، توليد المفتاح العام للـ GitHub واختباره، إنشاء مستودع من مشروع قائم، Pull Requests، الـ Aliases، و Branching و Merging.", videos: range(7, 12) },
  { id: "finish", course: "gitgithub", title: "الاستعادة ووسوم الإصدارات والختام", titleEn: "Restore, tags & wrap-up", description: "الالتزام Stash بجزأين، Restore و Clean، إعادة ضبط HEAD، تجاهل الملفات، Tagging و Releasing بجزأين، ونهاية الرحلة.", videos: range(13, 20) },
];

export function sectionsForCourse(courseId: string): ElzeroWebSection[] {
  return ELZERO_WEB_SECTIONS.filter((s) => s.course === courseId);
}

export function findElzeroWebCourse(id: string): ElzeroWebCourse | undefined {
  return ELZERO_WEB_COURSES.find((c) => c.id === id);
}

export function sectionFor(courseId: string, sectionId: string): ElzeroWebSection | undefined {
  return ELZERO_WEB_SECTIONS.find((s) => s.course === courseId && s.id === sectionId);
}

export function sectionForNumber(courseId: string, number: number): ElzeroWebSection | undefined {
  return ELZERO_WEB_SECTIONS.find((s) => s.course === courseId && s.videos.includes(number));
}

// ---------------------------------------------------------------------------
// Merge: bulk metadata (real) + curated content (original, reviewed by hand)
// ---------------------------------------------------------------------------

export interface ElzeroWebCuratedLesson {
  id: string;
  summary: string;
  versionNote?: string;
  terms: ElzeroWebKeyTerm[];
  practice: ElzeroWebPracticeItem[];
  reviewed: boolean;
}

import { curatedElzeroWebVideos } from "./elzero-web-curated.ts";

const curatedById = new Map(curatedElzeroWebVideos.map((l) => [l.id, l]));

function placeholderSummary(b: ElzeroWebBulkVideo): string {
  const course = findElzeroWebCourse(b.course);
  return `${b.title} — فيديو رقم ${b.number} من ${course?.titleEn ?? b.course} على قناة Elzero Web School. لم يُراجع هذا التلخيص بعد؛ شاهده على يوتيوب للمحتوى الأصلي.`;
}

/** Full track catalogue: real metadata, curated or placeholder content. */
export const elzeroWebVideos: ElzeroWebVideo[] = elzeroWebVideosBulk.map((b) => {
  const c = curatedById.get(b.id);
  return c
    ? { ...b, ...c }
    : { ...b, summary: placeholderSummary(b), terms: [], practice: [], reviewed: false };
});

/** Videos of one course, in playlist order. */
export function elzeroWebCourseVideos(courseId: string): ElzeroWebVideo[] {
  return elzeroWebVideos.filter((v) => v.course === courseId).sort((a, b) => a.number - b.number);
}

export function findElzeroWebVideo(id: string): ElzeroWebVideo | undefined {
  return elzeroWebVideos.find((v) => v.id === id);
}

export function elzeroVideoIndex(id: string): number {
  return elzeroWebVideos.findIndex((v) => v.id === id);
}

/** Normalizes a typed answer for lenient comparison (fill items). */
export function normalizeElzeroWebAnswer(input: string): string {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[ً-ٟ]/g, "") // Arabic diacritics
    .replace(/ـ/g, "") // tatweel
    .replace(/\s+/g, " ")
    .trim();
}

/** Catalogue integrity problems (empty array = OK). Checked by unit tests + validator. */
export function elzeroWebCatalogueProblems(): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const ID_RE = /^(html|css|js|ts|sass|git)-\d{3}$/;
  const DUR_RE = /^PT(?=\d)(\d+H)?(\d+M)?(\d+S)?$/;
  const expectedCounts: Record<string, number> = { html: 37, css: 88, javascript: 188, typescript: 38, sass: 19, gitgithub: 20 };
  const counts: Record<string, number> = {};

  for (const v of elzeroWebVideosBulk) {
    if (!ID_RE.test(v.id)) problems.push(`bad id ${v.id}`);
    if (ids.has(v.id)) problems.push(`duplicate id ${v.id}`);
    ids.add(v.id);
    counts[v.course] = (counts[v.course] ?? 0) + 1;
    if (!DUR_RE.test(v.duration)) problems.push(`bad duration ${v.id}: ${v.duration}`);
    if (!v.youtube.includes(`v=${v.youtubeId}`) || !v.youtube.includes("list=")) problems.push(`bad watch url ${v.id}`);
    const sec = sectionFor(v.course, v.section);
    if (!sec || !sec.videos.includes(v.number)) problems.push(`section mismatch ${v.id} (${v.course}/${v.section}/#${v.number})`);
    if (!findElzeroWebCourse(v.course)) problems.push(`unknown course ${v.id}`);
  }
  for (const [course, expected] of Object.entries(expectedCounts)) {
    if ((counts[course] ?? 0) !== expected) problems.push(`course ${course}: expected ${expected}, got ${counts[course] ?? 0}`);
  }
  for (const s of ELZERO_WEB_SECTIONS) {
    for (const n of s.videos) {
      const hit = elzeroWebVideosBulk.some((v) => v.course === s.course && v.number === n);
      if (!hit) problems.push(`section ${s.course}/${s.id} references missing #${n}`);
    }
  }
  for (const s of ELZERO_WEB_SECTIONS) {
    for (const n of s.videos) {
      if (n < 1) problems.push(`section ${s.course}/${s.id} has invalid number ${n}`);
    }
  }
  for (const v of elzeroWebVideos) {
    if ((v.terms.length > 0) !== (v.practice.length > 0)) {
      problems.push(`${v.id}: terms/practice present but not both`);
    }
    for (const item of v.practice) {
      if (item.type === "mcq") {
        if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) problems.push(`${v.id}: mcq answer out of range`);
        if (item.options.length < 2) problems.push(`${v.id}: mcq needs >= 2 options`);
      } else if (item.type === "fill") {
        if (!item.answer.trim()) problems.push(`${v.id}: fill answer empty`);
      } else if (item.type === "order") {
        if (item.steps.length < 2) problems.push(`${v.id}: order needs >= 2 steps`);
      } else if (item.type === "match") {
        if (item.pairs.length < 2) problems.push(`${v.id}: match needs >= 2 pairs`);
      }
    }
  }
  const totalCurated = curatedElzeroWebVideos.length;
  for (const l of curatedElzeroWebVideos) {
    if (!elzeroWebVideosBulk.some((b) => b.id === l.id)) problems.push(`curated lesson ${l.id} has no bulk counterpart`);
  }
  if (totalCurated === 0) problems.push("no curated lessons at all");
  return problems;
}
