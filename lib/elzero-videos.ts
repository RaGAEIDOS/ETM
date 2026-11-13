import type { QuizQuestion } from "./types";

export interface ElzeroVideo {
  id: string;
  number: number;
  title: string;
  titleEn: string;
  section: string;
  sectionEn: string;
  youtube: string;
  summary: string;
  terms: { en: string; ar: string }[];
  quiz: QuizQuestion[];
  example?: { title: string; code: string };
}

const PLAYLIST_ID = "PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS";

/**
 * Real video ids in official playlist order (verified via the Invidious
 * playlist endpoint on 2026-11-13). The old data used playlist URLs with
 * &index=N for most lessons, which carry no video id and therefore cannot
 * produce a thumbnail.
 */
const VIDEO_IDS = [
  "XDuWyYxksXU", "jOUb09iiO20", "R-Hu5rdn-vc", "RWtT07Id-n4", "FVV4kTy0dJg",
  "1K1sET8dDrI", "NeHu899_uYA", "6UoFcvARKI4", "R2zqj_52WwU", "A6B4tlaPapo",
  "J_vnlD5Ca-U", "HHl6YF6GUhw", "zBhT544Xy0o", "cS0tbixHmdI", "7hM-MBheZ-w",
  "BibCqAo5ZsQ", "MrwqesK64aU", "739Wvc6XqDM", "8efyLVOfd4E", "BIQplCgmB2o",
  "rqXv-mKqw5Y", "ZX2DLrnCR3w", "N68m5IxR_zw", "AQyni1r43T0", "nCO0KZ67b1Q",
  "RWVrMQpvVxU", "xpznDlbgQPM", "41v0w8BjJms", "e0Gz1_ceuMU", "QmUR0ZIrXQA",
  "l67qWVYe-xo", "Ps0xSAXmULA", "Ang11UuVE30", "8ptGpQ_2Np8", "KWRFfCToxiY",
  "OK1uu-axN0E", "w8WnxLZmctg", "NWP1cTeDFVY", "4DkdiXp5rYw", "4v5hDgUDK9Q",
  "2pG43LVr_Sw", "dNCryC9CzQQ", "lylQR-hFV-M", "Ne7RthIdaok", "oyYC2dOekeU",
  "PJeNjjQcrG8", "_eYTdzypBIY", "p0pCO7gPfmQ", "DoY-G3Fwy4g", "ykpDu3swciM",
  "pbu11F6X9Yg", "3ESx17kVUKo", "5rtyV-WOIpA", "q2BVplB0RgI", "Gkg8NmfUCjg",
  "MBvixzJw2sQ", "wOBMuQUlKNY", "qBojueEZxjs", "kApYul6wN3A", "2NPd8KgneBQ",
  "ErBDovJ3eTk", "wyFLcNCCaas", "AU_wSvenbI8", "bpXRvo4IH-0", "I_AzDYyhlMU",
  "djgs6PnNl2w", "55MRxgVOkMo", "OIJsJrNJKUc", "QSmQylbugAg", "JrPhJtFuwqU",
  "_RE-naCqphE", "DgJqgq5Is0Y", "RoKGZi4ArFo", "Qm14ePexV10", "s6sb23dglxs",
  "9ALw6qoCvk8", "9ZE8HAHyp4I", "Mlo7_fUG4N0",
] as const;

function yt(index: number) {
  return `https://www.youtube.com/watch?v=${VIDEO_IDS[index - 1]}&list=${PLAYLIST_ID}`;
}

export const sectionsList = [
  { ar: "المقدمة", en: "Introduction", range: "#001 - #008" },
  { ar: "المتغيرات والثوابت", en: "Variables & Constants", range: "#009 - #015" },
  { ar: "أنواع البيانات", en: "Data Types", range: "#016 - #023" },
  { ar: "العوامل", en: "Operators", range: "#024 - #029" },
  { ar: "If و Switch", en: "If & Switch", range: "#030 - #037" },
  { ar: "المصفوفات والنصوص", en: "Array & String", range: "#038 - #046" },
  { ar: "الحلقات", en: "Loops", range: "#047 - #054" },
  { ar: "الدوال", en: "Functions", range: "#055 - #066" },
  { ar: "Vector", en: "Vector", range: "#067 - #074" },
  { ar: "المؤشرات", en: "Pointers", range: "#075 - #078" },
];

export const elzeroVideos: ElzeroVideo[] = [
  {
    id: "001",
    number: 1,
    title: "مقدمة مهمة عن الكورس",
    titleEn: "Important Introduction About The Course",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: "https://www.youtube.com/watch?v=XDuWyYxksXU&list=PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS",
    summary:
      "الفيديو الافتتاحي في مسار الزيرو: لماذا هذا الكورس يختلف عن شرح C++ النظري، ومناسب لمين، وما هي الطريقة الصحيحة للمذاكرة (تطبيق وكتابة كود كل يوم)؟ الملخص هنا: لا تحفظ، طبّق، واجعل كل فيديو يتبعه كود يعمل.",
    terms: [
      { en: "Study Path", ar: "خارطة المذاكرة: تسلسل الفيديوهات من الأساسيات للمتقدم." },
      { en: "Hands-on", ar: "تطبيق عملي: كتابة وتشغيل الكود بنفسك وليس المشاهدة فقط." },
    ],
    quiz: [
      {
        question: "أفضل طريقة لمتابعة كورس الزيرو؟",
        options: ["مشاهدة كل الفيديوهات مرة واحدة", "فيديو + كود + تمرين كل يوم", "قراءة عناوين فقط", "تحويل الكلام لنص وحفظه"],
        answer: 1,
        explanation: "الاستمرارية اليومية مع التطبيق هي أهم عامل للنجاح في C++.",
      },
      {
        question: "الكورس مناسب لمين؟",
        options: ["للمحترفين فقط", "للمبتدئ من الصفر", "فقط للطلبة", "فقط للـ AI"],
        answer: 1,
      },
    ],
  },
  {
    id: "002",
    number: 2,
    title: "ليه C++؟",
    titleEn: "Why C++",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: yt(2),
    summary:
      "ليست أقوى لغة في المطلق — C++ هي الأقوى في الأداء والتحكم. إليك ملخص الفكرة: تتعلمها في هندسة الأنظمة ومحركات الألعاب لأنها تجمع بين القرب من الهاردوير وقوة المكتبات، ولو أتقنتها ستصبح أي لغة أخرى أسهل.",
    terms: [
      { en: "Performance", ar: "الأداء: سرعة التنفيذ وكفاءة استهلاك الذاكرة." },
      { en: "Systems Programming", ar: "برمجة الأنظمة: بناء ما يقرب من الهاردوير مباشرة." },
    ],
    quiz: [
      {
        question: "أشهر استخدامات C++؟",
        options: ["مواقع فقط", "أنظمة تشغيل ومحركات ألعاب", "تنسيق مستندات", "جداول بيانات"],
        answer: 1,
      },
      {
        question: "ليه تعلّم C++ مفيد للمبرمج؟",
        options: ["لأنها الأسهل", "لأنها تعلمك كيف يعمل الكمبيوتر من الداخل", "لأنها مجانية فقط", "لأنها لغة رسم"],
        answer: 1,
      },
    ],
  },
  {
    id: "003",
    number: 3,
    title: "اختيار المحرر وتثبيت المترجم والمصحح",
    titleEn: "Choose Editor, Install Compiler And Debugger",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: yt(3),
    summary:
      "هذا الفيديو يفرّق بين المحرر (VS Code) والمترجم (g++) والمصحح (Debugger). الملخص: المحرر للكتابة، المترجم للترجمة، المصحح لتتبع الأخطاء سطرًا بسطر. لو بدأت بـ VS Code + MinGW فأنت في أمان.",
    terms: [
      { en: "Editor", ar: "المحرر: برنامج كتابة الكود وتنسيقه." },
      { en: "Compiler", ar: "المترجم: يحوّل الكود للغة الآلة." },
      { en: "Debugger", ar: "المصحح: يتبع التنفيذ سطرًا بسطر لاكتشاف الأخطاء." },
    ],
    quiz: [
      {
        question: "المصحح Debugger فايدته إيه؟",
        options: ["كتابة الكود", "ملاحظة القيم أثناء التنفيذ", "تشغيل الموسيقى", "فتح الصور"],
        answer: 1,
      },
      {
        question: "إيه الفرق بين المحرر والمترجم؟",
        options: ["المحرر للكتابة، والمترجم يحوّل الكود لملف قابل للتنفيذ", "الاتنين نفس البرنامج", "المترجم بيصحح الأخطاء المنطقية فقط", "المحرر بيحوّل الكود لملف تنفيذي"],
        answer: 0,
        explanation: "المحرر أداة كتابة، والمترجم هو اللي يحوّل الكود للغة الآلة.",
      },
    ],
    example: {
      title: "تشغيل أول مرة",
      code: `// المحرر: VS Code\n// المترجم: g++ -std=c++17 main.cpp -o main\n// التنفيذ: ./main\n#include <iostream>\nint main(){ std::cout << "Ready\\n"; return 0; }`,
    },
  },
  {
    id: "004",
    number: 4,
    title: "تثبيت Visual Studio والإجابة على الأسئلة",
    titleEn: "Install Visual Studio IDE and Answer Questions",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: yt(4),
    summary:
      "بديل أثقل (Visual Studio IDE) لمحبي بيئة كاملة، مع إجابات على أسئلة المبتدئين: ماذا نثبّت بالضبط؟ وأيّ نسخة أقل حجمًا؟ الملخص: لو جهازك قوي وتريد كل شيء في مكان واحد جرّب Visual Studio، ولو تفضل الخفة فـ VS Code أسرع.",
    terms: [
      { en: "IDE", ar: "بيئة التطوير المتكاملة: محرر + مترجم + مصحح في برنامج واحد." },
    ],
    quiz: [
      {
        question: "الفرق بين VS Code و Visual Studio؟",
        options: ["لا يوجد فرق", "VS Code محرر خفيف، وVisual Studio بيئة كاملة", "VS Code أضخم", "Visual Studio للموبايل"],
        answer: 1,
      },
      {
        question: "إمتى تختار VS Code بدل Visual Studio؟",
        options: ["لو عايز بيئة كاملة ثقيلة", "لو بتكتب C# فقط", "لو جهازك أضعف وتفضّل بيئة خفيفة", "لو مش عندك مترجم"],
        answer: 2,
        explanation: "VS Code أخف، وVisual Studio بيئة متكاملة تحتاج موارد أكبر.",
      },
    ],
  },
  {
    id: "005",
    number: 5,
    title: "كيف يعمل C++؟",
    titleEn: "How The C++ Works",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: "https://www.youtube.com/watch?v=FVV4kTy0dJg&list=PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS",
    summary:
      "الصورة الكبيرة: الكمبيوتر لا يفهم C++ — يفهم 0 و1. ما نكتبه يمر بأربع مراحل: المعالجة المسبقة، الترجمة، الربط، ثم التنفيذ. افهم هذه المراحل قبل كتابة أي سطر، فهي تفسر أغلب أخطاء المبتدئين.",
    terms: [
      { en: "Machine Code", ar: "كود الآلة: أوامر 0 و1 التي يفهمها المعالج مباشرة." },
      { en: "Execution", ar: "التنفيذ: تشغيل البرنامج المترجم من main." },
    ],
    quiz: [
      {
        question: "الكمبيوتر يفهم مباشرة إيه؟",
        options: ["C++", "كود الآلة (0 و1)", "الصور", "الملفات النصية"],
        answer: 1,
      },
      {
        question: "أول مرحلة بيمر بيها الكود قبل التنفيذ؟",
        options: ["الربط Linking", "الترجمة Compiling", "التنفيذ", "المعالجة المسبقة Preprocessing"],
        answer: 3,
        explanation: "المعالجة المسبقة أولًا، ثم الترجمة، ثم الربط، ثم التنفيذ.",
      },
    ],
  },
  {
    id: "006",
    number: 6,
    title: "المعالجة المسبقة والترجمة والربط",
    titleEn: "Preprocessing, Compiling and Linking",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: yt(6),
    summary:
      "تفصيل المراحل الأربع: Preprocessor يمسح أسطر `#`، Compiler يحوّل لملف وسيط Object، Linker يلصق المكتبات لمنتج واحد قابل للتنفيذ. إذا رأيت خطأ `undefined reference` فالمشكلة غالبًا في الربط وليس كتابتك.",
    terms: [
      { en: "Preprocessor", ar: "المعالج المسبق: يعالج توجيهات `#` قبل الترجمة." },
      { en: "Object File", ar: "ملف الكائن: مخرج الترجمة قبل الربط." },
      { en: "Linker", ar: "الرابط: يجمع الأجزاء والمكتبات في برنامج واحد." },
    ],
    quiz: [
      {
        question: "خطأ `undefined reference` معناه حصل في أنهي مرحلة؟",
        options: ["الكتابة", "الربط Linking", "التثبيت", "التشغيل فقط"],
        answer: 1,
      },
      {
        question: "إيه وظيفة Linker؟",
        options: ["يمسح أسطر #", "يجمع ملفات Object والمكتبات في ملف تنفيذي واحد", "يحوّل الكود المصدري لملف Object", "يشغّل البرنامج"],
        answer: 1,
        explanation: "الربط هو آخر مرحلة بناء قبل التنفيذ.",
      },
    ],
  },
  {
    id: "007",
    number: 7,
    title: "أساسيات صياغة C++ (Syntax)",
    titleEn: "C++ Syntax",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: yt(7),
    summary:
      "بنية برنامج C++ من الداخل: `#include`، `main`، الأقواس المعقوفة، الفاصلة المنقوطة، والحساسية لحالة الأحرف. احفظ القاعدة: أي سطر تعليمات ينتهي بـ `;`، وكل برنامج يبدأ من `main`. نسيان الفاصلة أشهر خطأ للمبتدئ.",
    terms: [
      { en: "Syntax", ar: "الصياغة: قواعد كتابة اللغة وتركيب الجمل." },
      { en: "main()", ar: "دالة البداية: أول مكان يبدأ منه التنفيذ." },
    ],
    quiz: [
      {
        question: "نهاية كل جملة أمرية في C++؟",
        options: ["نقطة", "فاصلة منقوطة ;", "سطر جديد", "قفزة"],
        answer: 1,
      },
      {
        question: "كل برنامج C++ بيبدأ تنفيذه من فين؟",
        options: ["دالة main", "أول سطر في الملف", "آخر دالة معرّفة", "سطر #include"],
        answer: 0,
        explanation: "main هي نقطة بداية التنفيذ.",
      },
    ],
  },
  {
    id: "008",
    number: 8,
    title: "التعليقات واستخداماتها",
    titleEn: "Comments And Use Cases",
    section: "المقدمة",
    sectionEn: "Introduction",
    youtube: yt(8),
    summary:
      "التعليقات (`//` و `/* */`) ليست زينة — هي توثيق لما ستعود إليه بعد أسبوع. متى تعلّق؟ لشرح «ليه» وليس «إيه» (المترجم يقرأ الكود). ومتى تحذف الكود نفسه بدل تعليقه؟",
    terms: [
      { en: "Comment", ar: "التعليق: سطر لا ينفذ، لتوضيح الفكرة للمطور." },
    ],
    quiz: [
      {
        question: "أفضل تعليق يشرح إيه؟",
        options: ["نسخ الكود", "سبب الحل أو الفكرة (ليه)", "اسم المؤلف", "تاريخ البناء"],
        answer: 1,
      },
      {
        question: "إيه نوع التعليق اللي بيمتد لأكتر من سطر؟",
        options: ["//", "#", "/* ... */", "--"],
        answer: 2,
        explanation: "// لسطر واحد، و/* */ لعدة أسطر.",
      },
    ],
    example: {
      title: "تعليقات جيدة",
      code: `// يجمع فواتير اليوم لعرض التقرير\nint total = price1 + price2; // عمليتين فقط\n/* ملاحظة: لا تستخدم float هنا لأن الدقة مهمة */`,
    },
  },
  {
    id: "009",
    number: 9,
    title: "معرفة أساسية بالمتغيرات",
    titleEn: "Variables Basic Knowledge",
    section: "المتغيرات والثوابت",
    sectionEn: "Variables & Constants",
    youtube: yt(9),
    summary:
      "المتغير صندوق مسمى في الذاكرة له نوع وقيمة. الملخص: أعلن النوع مرة واحدة، أعطِ قيمة أولية (تهيئة)، ثم استخدمه. `int age = 20;` تكفي لتعريف وتخزين وقراءة قيمة.",
    terms: [
      { en: "Variable", ar: "المتغير: اسم يشير لمكان في الذاكرة يحتفظ بقيمة." },
      { en: "Initialization", ar: "التهيئة: إعطاء قيمة أولى عند التعريف." },
    ],
    quiz: [
      {
        question: "الصيغة الكاملة لتعريف متغير؟",
        options: ["age int", "int age = 20;", "age = 20 int", "int = age"],
        answer: 1,
      },
      {
        question: "في `int age = 20;` إيه اسم الجزء `= 20`؟",
        options: ["تعريف فقط", "طباعة", "إسناد بعد التعريف", "تهيئة Initialization"],
        answer: 3,
        explanation: "التعريف يحدد النوع، والتهيئة تعطي القيمة الأولى.",
      },
    ],
    example: {
      title: "متغير أول",
      code: `#include <iostream>\nint main(){\n int age = 20;\n std::cout << age << "\\n";\n}`,
    },
  },
  {
    id: "010",
    number: 10,
    title: "قواعد تسمية المتغيرات وأفضل الممارسات",
    titleEn: "Variables Naming Rules And Best Practices",
    section: "المتغيرات والثوابت",
    sectionEn: "Variables & Constants",
    youtube: yt(10),
    summary:
      "لا تبدأ برقم، لا مسافات، ويفضّل الأسماء الواضحة بالإنجليزية. كودك سيُقرأ بعد شهور، واسم `totalPrice` أصدق من `x`. قاعدة عملية: لو احتجت شرح الاسم فالاسم سيئ.",
    terms: [
      { en: "Naming Convention", ar: "اتفاقية التسمية: أسلوب موحد لأسماء المتغيرات." },
    ],
    quiz: [
      {
        question: "أي اسم ممنوع؟",
        options: ["studentCount", "1stPlace", "book_count", "totalPrice"],
        answer: 1,
        explanation: "اسم المتغير لا يبدأ برقم.",
      },
      {
        question: "أي اسم متغير أفضل لسعر إجمالي؟",
        options: ["x", "totalPrice", "1price", "total price"],
        answer: 1,
        explanation: "الاسم الواضح وبلا مسافات ولا بداية برقم.",
      },
    ],
  },
  {
    id: "011",
    number: 11,
    title: "معلومات متقدمة عن المتغيرات",
    titleEn: "Variables Advanced Knowledge",
    section: "المتغيرات والثوابت",
    sectionEn: "Variables & Constants",
    youtube: yt(11),
    summary:
      "عمق القاعدة: المتغير له عنوان ونوع، ويمكن تغيير قيمته لاحقًا (`age = 25;`)، لكن نوعه ثابت في C++ (لا يتحول تلقائيًا من int إلى نص). هذه الصرامة تحميك من أخطاء كثيرة.",
    terms: [
      { en: "Type Safety", ar: "أمان النوع: عدم الخلط بين الأنواع المختلفة." },
    ],
    quiz: [
      {
        question: "لو `int x = 5;` هل يمكن بعدها `x = \"hi\";`؟",
        options: ["نعم", "لا، النوع ثابت", "في C++ فقط نعم", "فقط بتحويل"],
        answer: 1,
      },
      {
        question: "هل نوع المتغير في C++ بيتغير بعد تعريفه؟",
        options: ["لا، النوع ثابت", "نعم تلقائيًا", "فقط مع cout", "فقط داخل الحلقات"],
        answer: 0,
        explanation: "C++ ثابتة النوع، وتغيير النوع يحتاج تحويلًا صريحًا أو متغيرًا جديدًا.",
      },
    ],
  },
  {
    id: "012",
    number: 12,
    title: "نطاق المتغيرات Scope",
    titleEn: "Variables Scope",
    section: "المتغيرات والثوابت",
    sectionEn: "Variables & Constants",
    youtube: yt(12),
    summary:
      "المتغير يعيش داخل الكتلة التي عُرّف فيها فقط. لو عرّفت متغيرًا داخل `if` أو حلقة، سيموت بعدها. لذا عرّف المتغيرات حيث تحتاجها فقط، أو ارفعها للخارج لو ستستخدم بعد الكتلة.",
    terms: [
      { en: "Scope", ar: "النطاق: المنطقة التي فيها المتغير متاح." },
      { en: "Block Scope", ar: "نطاق الكتلة: المتغير يعيش داخل `{ }` فقط." },
    ],
    quiz: [
      {
        question: "متغير عُرّف داخل `{ if }` هل يظهر خارجه؟",
        options: ["نعم", "لا", "فقط لو كان static", "أحيانًا"],
        answer: 1,
      },
      {
        question: "إمتى المتغير بيموت (يخرج من النطاق)؟",
        options: ["بعد أول استخدام", "بعد إغلاق البرنامج", "عند نهاية الكتلة اللي عُرّف فيها", "مش بيموت أبدًا"],
        answer: 2,
        explanation: "النطاق هو الكتلة التي عُرّف فيها المتغير.",
      },
    ],
  },
  {
    id: "013",
    number: 13,
    title: "المتغير الثابت Variable Constant",
    titleEn: "Variables Constant Variable",
    section: "المتغيرات والثوابت",
    sectionEn: "Variables & Constants",
    youtube: yt(13),
    summary:
      "الثابت `const` قيمة لا تتغير أبدًا — مفيد لقيم لا يفترض أن تُعدل (نسبة الضريبة، الحد الأقصى). لو حاولت تعديله، المترجم يمنعك قبل التنفيذ — أمان إضافي.",
    terms: [
      { en: "const", ar: "ثابت: متغير لا يمكن تغيير قيمته بعد التعريف." },
    ],
    quiz: [
      {
        question: "ميزة `const` الأساسية؟",
        options: ["السرعة", "منع التغيير الخطأ", "اختصار الكتابة", "تسريع التنفيذ"],
        answer: 1,
      },
      {
        question: "لو حاولت تعديل قيمة const، مين بيمنعك؟",
        options: ["نظام التشغيل", "المستخدم", "الذاكرة", "المترجم"],
        answer: 3,
        explanation: "المترجم يرفض التعديل وقت البناء.",
      },
    ],
    example: {
      title: "ثابت",
      code: `const double PI = 3.14159;\nconst int MAX = 100;`,
    },
  },
  {
    id: "014",
    number: 14,
    title: "تطبيق احسب العمر",
    titleEn: "Calculate Age Application",
    section: "المتغيرات والثوابت",
    sectionEn: "Variables & Constants",
    youtube: yt(14),
    summary:
      "أول تطبيق كامل في المسار: إدخال سنة الميلاد وحساب العمر. الملخص: اجمع الإدخال بأسلوب `cin`، واستخدم `const` للسنة الحالية، واطبع النتيجة بسطر واضح. هو نموذج لأي تطبيق إدخال/حساب/إخراج.",
    terms: [
      { en: "Input / Output", ar: "الإدخال والإخراج: التواصل مع المستخدم." },
    ],
    quiz: [
      {
        question: "لإدخال رقم من المستخدم نستخدم إيه؟",
        options: ["cout", "cin", "endl", "return"],
        answer: 1,
      },
      {
        question: "تطبيق حساب العمر بيستخدم إيه لإدخال سنة الميلاد؟",
        options: ["cout", "cin", "cerr", "endl"],
        answer: 1,
        explanation: "cin للإدخال، cout للإخراج.",
      },
    ],
    example: {
      title: "احسب العمر",
      code: `#include <iostream>\nint main(){\n const int CUR = 2026;\n int birth; std::cin >> birth;\n std::cout << CUR - birth << "\\n";\n}`,
    },
  },
  {
    id: "015",
    number: 15,
    title: "تسلسل الحروف الخاصة Escape Sequences",
    titleEn: "Escape Sequences Characters",
    section: "المتغيرات والثوابت",
    sectionEn: "Variables & Constants",
    youtube: yt(15),
    summary:
      "حروف الهروب تجعل الطباعة منسقة: `\\n` سطر جديد، `\\t` تاب، و `\\\\` للشرطة نفسها. لاحظ أن كلها تبدأ بـ `\\` ويتعرّف عليها الكمبيوتر داخل النصوص فقط — لا تضيفها خارج النص.",
    terms: [
      { en: "Escape Sequence", ar: "تسلسل الهروب: حروف خاصة تبدأ بـ \\ ولها معنى (سطر جديد). " },
    ],
    quiz: [
      {
        question: "معنى `\\n`؟",
        options: ["تاب", "سطر جديد", "شرطة", "ثابت"],
        answer: 1,
      },
      {
        question: "أي حرف هروب بيرجع مؤشر الكتابة لأول السطر؟",
        options: ["\\r", "\\n", "\\t", "\\\\"],
        answer: 0,
        explanation: "\\r carriage return، و\\n سطر جديد.",
      },
    ],
  },
  {
    id: "016",
    number: 16,
    title: "أنواع البيانات — ما هي البيانات؟",
    titleEn: "Data Types - What Is Data ?",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(16),
    summary:
      "كل ما يعالجه البرنامج بيانات: أرقام، حروف، نصوص، منطقية. نوع البيانات يقرر حجم المساحة المخصصة في الذاكرة وكيف تُفسَّر البتات. لهذا السبب لا يخزن `int` كلمة، ولا `char` رقمًا كبيرًا.",
    terms: [
      { en: "Data", ar: "البيانات: القيم التي يعالجها البرنامج." },
    ],
    quiz: [
      {
        question: "نوع البيانات يقرر إيه؟",
        options: ["اسم المتغير", "الحجم والتفسير في الذاكرة", "لون الكود", "سرعة القراءة"],
        answer: 1,
      },
      {
        question: "ليه `int` مش مناسب لتخزين كلمة؟",
        options: ["لأنه أبطأ من string", "لأنه بيفقد الذاكرة", "لأنه يخزن أعدادًا صحيحة فقط", "لأنه نوع منطقي"],
        answer: 2,
        explanation: "الكلمة نص، وint للأعداد الصحيحة.",
      },
    ],
  },
  {
    id: "017",
    number: 17,
    title: "أنواع البيانات — الأحجام والذاكرة",
    titleEn: "Data Types - Sizes And Memory",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(17),
    summary:
      "بت = خانة واحدة، بايت = 8 بتات. `int` غالبًا 4 بايت، `char` بايت واحد، `double` ثمانية. من خلال `sizeof` يمكنك معرفة حجم أي نوع على جهازك — هذه مهارة للحكم على استهلاك الذاكرة.",
    terms: [
      { en: "Byte", ar: "البايت: 8 بتات، وحدة قياس الذاكرة." },
      { en: "sizeof", ar: "أداة لقياس حجم النوع بالبايت." },
    ],
    quiz: [
      {
        question: "حجم `int` غالبًا؟",
        options: ["1 بايت", "2 بايت", "4 بايت", "8 بايت"],
        answer: 2,
      },
      {
        question: "البايت يساوي كام بت؟",
        options: ["4", "16", "32", "8"],
        answer: 3,
        explanation: "البايت = 8 بت.",
      },
    ],
  },
  {
    id: "018",
    number: 18,
    title: "أنواع البيانات — الأعداد الصحيحة",
    titleEn: "Data Types - Integer",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(18),
    summary:
      "أنواع الأعداد الصحيحة: `short` (2 بايت)، `int` (4 بايت)، `long long` (8 بايت) على معظم الأنظمة. كلها بلا كسر. الفرق بينها المدى (القيمة القصوى). اختر النوع المناسب لمدى بياناتك — الأكبر يستهلك ذاكرة أكثر.",
    terms: [
      { en: "Integer", ar: "عدد صحيح: بلا كسر عشري." },
      { en: "Range", ar: "المدى: أصغر وأكبر قيمة يمكن تخزينها." },
    ],
    quiz: [
      {
        question: "أي نوع أكبر حجمًا؟",
        options: ["short", "int", "long long", "char"],
        answer: 2,
      },
      {
        question: "إيه الفرق الأساسي بين short و int و long long؟",
        options: ["نوع البيانات (كسر/صحيح)", "المدى والحجم في الذاكرة", "طريقة الطباعة", "سرعة المترجم"],
        answer: 1,
        explanation: "كلها أعداد صحيحة، لكن بأحجام ومدى مختلف.",
      },
    ],
  },
  {
    id: "019",
    number: 19,
    title: "أنواع البيانات — العشرية Float و Double",
    titleEn: "Data Types - Float And Double",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(19),
    summary:
      "الأنواع العشرية تخزن كسورًا: `float` بدقة أقل وحجم 4 بايت، و `double` مزدوجة الدقة وحجم 8 بايت. القاعدة: استخدم `double` دائمًا، و `float` فقط لو تريد توفير ذاكرة.",
    terms: [
      { en: "float", ar: "عشري بدقة منفردة (4 بايت)." },
      { en: "double", ar: "عشري بدقة مزدوجة (8 بايت) — الأفضل غالبًا." },
    ],
    quiz: [
      {
        question: "الأفضل للاستخدام اليومي؟",
        options: ["float", "double", "int", "char"],
        answer: 1,
      },
      {
        question: "ليه نفضّل double على float غالبًا؟",
        options: ["دقة أعلى للكسور", "أصغر حجمًا", "أسرع في الطباعة", "بيخزن نصوص"],
        answer: 0,
        explanation: "double بدقة مضاعفة، وهذا مهم في الحسابات.",
      },
    ],
  },
  {
    id: "020",
    number: 20,
    title: "أنواع البيانات — الحرف Char وقيمة ASCII",
    titleEn: "Data Types - Char And ASCII Value",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(20),
    summary:
      "الحرف الواحد `char` يُخزن كرقم في جدول ASCII: `A` = 65، `a` = 97. هذا يسمح بعمليات حسابية على الحروف (مثل إيجاد الحرف التالي بـ `'A' + 1`).",
    terms: [
      { en: "char", ar: "حرف واحد: تخزين 1 بايت." },
      { en: "ASCII", ar: "جدول الحروف والأرقام المقابلة لأرقام." },
    ],
    quiz: [
      {
        question: "`(int)'A'` تساوي؟",
        options: ["0", "65", "97", "256"],
        answer: 1,
      },
      {
        question: "قيمة ASCII للحرف 'a'؟",
        options: ["65", "90", "97", "122"],
        answer: 2,
        explanation: "A = 65، وa = 97.",
      },
    ],
    example: {
      title: "الحرف كرقم",
      code: `char c = 'A';\nstd::cout << (int)c; // 65`,
    },
  },
  {
    id: "021",
    number: 21,
    title: "أنواع البيانات — Boolean و Void",
    titleEn: "Data Types - Boolean & Void",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(21),
    summary:
      "النوع المنطقي `bool` قيمتان فقط: `true` أو `false` — أساس كل الشروط. أما `void` فليس نوع بيانات قيميًّا، بل نوع للدوال التي لا ترجع شيئًا، ويُستخدم أيضًا في المؤشر العام `void*`.",
    terms: [
      { en: "bool", ar: "منطقي: صح (true) أو خطأ (false)." },
      { en: "void", ar: "فراغ: لا قيمة — للدوال بلا إرجاع." },
    ],
    quiz: [
      {
        question: "`void` يستخدم غالبًا لـ؟",
        options: ["المتغيرات", "الدوال التي لا ترجع قيمة", "الحلقات", "الأرقام"],
        answer: 1,
      },
      {
        question: "قيم bool الممكنة؟",
        options: ["0 و1 فقط", "أي رقم", "نص فقط", "true و false"],
        answer: 3,
        explanation: "bool نوع منطقي قيمتاه true/false.",
      },
    ],
  },
  {
    id: "022",
    number: 22,
    title: "أنواع البيانات — المعدّلات واسم النوع البديل",
    titleEn: "Data Types - Modifiers & Type Alias",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(22),
    summary:
      "المعدّل `unsigned` يخصص كل البتات للقيم الموجبة، فيبدأ النطاق من 0 بدل السالب ويقترب من ضعف المدى الموجب. و `type alias` يعطي النوع اسمًا أوضح: `using Price = double;` — في المشاريع الكبيرة هذا يجعل الكود مفهومًا.",
    terms: [
      { en: "unsigned", ar: "معدل: نوع موجب (من صفر) بمدى أكبر." },
      { en: "Type Alias", ar: "اسم بديل للنوع لتوضيحه." },
    ],
    quiz: [
      {
        question: "`unsigned char` مداه الأصغر والأكبر؟",
        options: ["-128 إلى 127", "0 إلى 255", "0 إلى 65535", "بلا حدود"],
        answer: 1,
      },
      {
        question: "`using Price = double;` بتعمل إيه؟",
        options: ["تنشئ متغيرًا جديدًا", "تدي النوع اسمًا بديلًا", "تحوّل النوع تلقائيًا", "تحذف النوع"],
        answer: 1,
        explanation: "هذا type alias، وليس متغيرًا.",
      },
    ],
  },
  {
    id: "023",
    number: 23,
    title: "أنواع البيانات — التحويل الضمني والصريح",
    titleEn: "Data Types - Type Conversion Implicit & Explicit",
    section: "أنواع البيانات",
    sectionEn: "Data Types",
    youtube: yt(23),
    summary:
      "التحويل التلقائي من الصغير للكبير آمن (`int` إلى `double`)، لكن العكسي يفقد البيانات (`double` إلى `int` تشيل الكسر). التحويل الصريح بـ `static_cast` يعلن موافقتك على الخسارة.",
    terms: [
      { en: "Implicit Conversion", ar: "التحويل الضمني: تلقائي من المترجم." },
      { en: "Explicit Conversion", ar: "التحويل الصريح: تطلبه أنت بـ cast." },
    ],
    quiz: [
      {
        question: "تحويل `3.9` إلى `int` يعطي؟",
        options: ["4", "3", "خطأ", "3.9"],
        answer: 1,
        explanation: "يقطع الكسر لا يقرّب.",
      },
      {
        question: "التحويل من double لـ int بيعمل إيه؟",
        options: ["يقطع الجزء العشري", "يقرّب لأقرب رقم", "يرمي استثناء", "بيحافظ على الكسر"],
        answer: 0,
        explanation: "التحويل لـ int يقطع الكسر ولا يقرّب.",
      },
    ],
  },
  {
    id: "024",
    number: 24,
    title: "العوامل الحسابية",
    titleEn: "Arithmetic Operators",
    section: "العوامل",
    sectionEn: "Operators",
    youtube: yt(24),
    summary:
      "العوامل الحسابية الخمسة: `+ - * / %`. القاعدة: `%` تقبل الأعداد الصحيحة فقط، و `/` بين عددين صحيحين ينتج عددًا صحيحًا (5/2=2). هذه فخاخ الامتحانات الكلاسيكية.",
    terms: [
      { en: "Modulo %", ar: "باقي القسمة: ما يتبقى بعد القسمة المنتظمة." },
    ],
    quiz: [
      {
        question: "نواتج `5 / 2` في `int`؟",
        options: ["2.5", "2", "3", "0"],
        answer: 1,
      },
      {
        question: "ناتج `7 % 3`؟",
        options: ["2", "3", "1", "0"],
        answer: 2,
        explanation: "7 = 3×2 + 1، فالباقي 1.",
      },
    ],
  },
  {
    id: "025",
    number: 25,
    title: "عوامل الإسناد",
    titleEn: "Assignment Operators",
    section: "العوامل",
    sectionEn: "Operators",
    youtube: yt(25),
    summary:
      "الإسناد `=` يخزّن قيمة في متغير. والاختصارات `+= -= *= /= %=`: تعني «اجمع وخزّن» (`x += 5` تساوي `x = x + 5`). أشهر خلط: `=` للإسناد وليس للمقارنة.",
    terms: [
      { en: "Assignment", ar: "الإسناد: تشغيل تخزين في متغير." },
    ],
    quiz: [
      {
        question: "`x += 5` معناها؟",
        options: ["x = 5", "x = x + 5", "x++", "5 = x"],
        answer: 1,
      },
      {
        question: "`x -= 2` معناها؟",
        options: ["x = 2 - x", "x = x * 2", "x = -2", "x = x - 2"],
        answer: 3,
        explanation: "الاختصار يطبّق العملية على القيمة الحالية.",
      },
    ],
  },
  {
    id: "026",
    number: 26,
    title: "عوامل الزيادة والنقصان",
    titleEn: "Increment & Decrements Operators",
    section: "العوامل",
    sectionEn: "Operators",
    youtube: yt(26),
    summary:
      "زيادة بواحد `++` ونقصان `--`: قبل الاستخدام (`++x`) يزيد ثم يستخدم، وبعده (`x++`) يستخدم ثم يزيد. الفرق في ترتيب التقييم، لكنه يغيّر النتيجة تمامًا في الجمل المركبة.",
    terms: [
      { en: "++ (pre/post)", ar: "الزيادة: قبل الاستخدام `++x` وبعده `x++`." },
    ],
    quiz: [
      {
        question: "لو `int x=5; int y=x++;` قيمة y؟",
        options: ["6", "5", "10", "خطأ"],
        answer: 1,
      },
      {
        question: "`++x` معناها؟",
        options: ["استخدم x ثم زيده", "زيد x ثم استخدمه", "انقص x", "اجعل x صفرًا"],
        answer: 1,
        explanation: "البادئة تزيد قبل الاستخدام.",
      },
    ],
  },
  {
    id: "027",
    number: 27,
    title: "عوامل المقارنة",
    titleEn: "Comparison Operators",
    section: "العوامل",
    sectionEn: "Operators",
    youtube: yt(27),
    summary:
      "المقارنة ترجع `true` أو `false`: أكبر من `>`، أصغر من `<`، مساوٍ `==`، غير مساوٍ `!=`. ملاحظة: المقارنة لا تغيّر القيمة، هي سؤال وليس تخزينًا.",
    terms: [
      { en: "Comparison", ar: "المقارنة: سؤال يعيد صح/خطأ." },
    ],
    quiz: [
      {
        question: "`a == b` تعني؟",
        options: ["إسناد قيمة", "أعطِ b لـ a", "هل a تساوي b؟", "جمع"],
        answer: 2,
      },
      {
        question: "`!=` معناها؟",
        options: ["لا يساوي", "يساوي", "أكبر من", "إسناد"],
        answer: 0,
        explanation: "!= نفي المساواة.",
      },
    ],
  },
  {
    id: "028",
    number: 28,
    title: "العوامل المنطقية",
    titleEn: "Logical Operators",
    section: "العوامل",
    sectionEn: "Operators",
    youtube: yt(28),
    summary:
      "ثلاثة أدوات لربط الشروط: `&&` (و — الاثنان صح)، `||` (أو — واحد على الأقل)، `!` (نفي — عكس الحالة). أساسيات `if` المتقدمة.",
    terms: [
      { en: "&& / || / !", ar: "المنطقية: ربط ونفي الشروط." },
    ],
    quiz: [
      {
        question: "`true && false` تساوي؟",
        options: ["true", "false", "خطأ", "قيمة غير معرّفة"],
        answer: 1,
      },
      {
        question: "`true || false` تساوي؟",
        options: ["false", "خطأ ترجمة", "true", "قيمة غير معرّفة"],
        answer: 2,
        explanation: "OR تكفي فيها قيمة واحدة صحيحة.",
      },
    ],
  },
  {
    id: "029",
    number: 29,
    title: "أولويات العوامل Precedence",
    titleEn: "Operators Precedence",
    section: "العوامل",
    sectionEn: "Operators",
    youtube: yt(29),
    summary:
      "الضرب قبل الجمع، والجمع قبل المقارنات، والمقارنات قبل المنطقية. لكن لا تعتمد على الحفظ — ضع أقواسًا دائمًا (`(a + b) * c`) وستقرأ كودًا لا يحتاج شرحًا.",
    terms: [
      { en: "Precedence", ar: "الأولوية: تريتيب تنفيذ العوامل." },
    ],
    quiz: [
      {
        question: "ناتج `10 + 3 * 2`؟",
        options: ["26", "16", "20", "13"],
        answer: 1,
      },
      {
        question: "ناتج `(10 + 3) * 2`؟",
        options: ["16", "23", "20", "26"],
        answer: 3,
        explanation: "الأقواس أولًا: 13 × 2 = 26.",
      },
    ],
  },
  {
    id: "030",
    number: 30,
    title: "مقدمة إلى شرط If",
    titleEn: "If Condition Intro",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(30),
    summary:
      "الشرط يأخذ قرارًا: لو الشرط صح نفّذ، وإلا لا. الصيغة `if (cond) { }` — الشرط المنطقي بين أقواس، والأوامر بين `{ }`. بلا شرط لا قرار.",
    terms: [
      { en: "Condition", ar: "الشرط: تعبير يقيم إلى صح أو خطأ." },
    ],
    quiz: [
      {
        question: "شرط `if` يتنفذ عندما؟",
        options: ["دائمًا", "عندما الشرط true", "عندما false", "عندما يكون الشرط صفرًا"],
        answer: 1,
      },
      {
        question: "إيه اللي بينكتب جوه أقواس if؟",
        options: ["أوامر التنفيذ", "شرط منطقي", "اسم الدالة", "نوع المتغير"],
        answer: 1,
        explanation: "الشرط هو اللي يحدد هل الكتلة تتنفذ.",
      },
    ],
  },
  {
    id: "031",
    number: 31,
    title: "If Else If Else",
    titleEn: "If Else If Else",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(31),
    summary:
      "تدرج اختيارات: أفحص من الأول، أول شرط يطابق يُنفذ ولا يتابع الباقي. ترتيب الشروط من الأقوى للأضعف، و `else` في الآخر لأي حالة لم تطابق.",
    terms: [
      { en: "else if", ar: "بديل متسلسل لشرط سابق لم يتحقق." },
    ],
    quiz: [
      {
        question: "لو أول شرط صح، هل ستُفحص شروط else if؟",
        options: ["نعم", "لا، تُنفذ الأولى وتخرج", "حسب نوع المتغير", "دائمًا"],
        answer: 1,
      },
      {
        question: "لو كل الشروط طلعت false، مين بيتنفذ؟",
        options: ["كتلة else", "أول else if", "آخر if", "مفيش حاجة"],
        answer: 0,
        explanation: "else هي البديل الأخير.",
      },
    ],
  },
  {
    id: "032",
    number: 32,
    title: "الشروط المتداخلة Nested If",
    titleEn: "Nested If Condition",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(32),
    summary:
      "شرط داخل شرط: `if` داخل كتلة `if` أخرى. استخدمها فقط عندما يعتمد قرارك على قرار داخلي. التكرار العميق أكثر من 3 مستويات يضر بالقراءة — فكر في دالة أبسط.",
    terms: [
      { en: "Nested If", ar: "الشرط المتداخل: شرط داخل شرط." },
    ],
    quiz: [
      {
        question: "فائدة التداخل؟",
        options: ["السرعة", "اعتماد قرار على قرار داخلي", "تقليل عدد الأسطر", "الاختصار"],
        answer: 1,
      },
      {
        question: "إمتى نستخدم Nested If؟",
        options: ["دايمًا بدل else", "لما نكتب حلقة", "لما يكون القرار معتمدًا على قرار داخلي", "لما نعرّف مصفوفة"],
        answer: 2,
        explanation: "التداخل مفيد فقط عند اعتماد قرار على آخر.",
      },
    ],
  },
  {
    id: "033",
    number: 33,
    title: "المؤثر الشرطي الثلاثي Ternary",
    titleEn: "Ternary Conditional Operator",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(33),
    summary:
      "اختصار `if` في سطر واحد: `cond ? trueVal : falseVal`. مثال: `score >= 50 ? \"ناجح\" : \"راسب\"`. استخدمه فقط للاختيارات الثنائية البسيطة.",
    terms: [
      { en: "Ternary (? :)", ar: "المؤثر الثلاثي: if في سطر واحد." },
    ],
    quiz: [
      {
        question: "مناسب للثلاثي؟",
        options: ["حلقات", "حالة ثنائية فقط", "دوال", "مصفوفات"],
        answer: 1,
      },
      {
        question: "الصيغة الصحيحة للثلاثي؟",
        options: ["cond : a ? b", "if cond ? a : b", "cond ? a ; b", "cond ? a : b"],
        answer: 3,
        explanation: "الشرط ثم ? ثم قيمة الصدق ثم : ثم قيمة الكذب.",
      },
    ],
    example: {
      title: "ثلاثي",
      code: `int x = 10;\nbool ok = x > 5 ? true : false;`,
    },
  },
  {
    id: "034",
    number: 34,
    title: "الثلاثي المتداخل Nested Ternary",
    titleEn: "Nested Ternary Conditional Operator",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(34),
    summary:
      "ثلاثي داخل ثلاثي — قوي لكنه مدمر للقراءة. إذا احتجت أكثر من مستويين، استخدم `if else if` العادية — أوضح وأسهل في القراءة. هنا فقط لفهم الصياغة، لا للإنتاج.",
    terms: [
      { en: "Nested Ternary", ar: "ثلاثي متداخل: اختصار متعدد في سطر واحد." },
    ],
    quiz: [
      {
        question: "مشكلة الثلاثي المتداخل؟",
        options: ["البطء", "صعوبة القراءة", "الذاكرة", "سرعة التنفيذ"],
        answer: 1,
      },
      {
        question: "بديل أوضح من الثلاثي المتداخل؟",
        options: ["switch فقط", "if else if", "while", "goto"],
        answer: 1,
        explanation: "if else if أوضح للقراءة.",
      },
    ],
  },
  {
    id: "035",
    number: 35,
    title: "تدريبات If — 4 تطبيقات",
    titleEn: "If Condition Trainings - Create 4 Applications",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(35),
    summary:
      "أربعة تطبيقات عملية: درجة نجاح، زوجي/فردي، أكبر عدد، وآلة حاسبة مبسطة. كلها `if` عادية بلا حيل. أنصحك أن تكتبها بيدك مرة واحدة قبل الانتقال لـ `switch`.",
    terms: [
      { en: "Application", ar: "تطبيق صغير: ممارسة التركيز على مشكلة واحدة." },
    ],
    quiz: [
      {
        question: "أي تطبيق من تطبيقات الفيديو بيحدد إذا كانت درجة الطالب ناجحة؟",
        options: ["آلة حاسبة", "درجة نجاح الطالب", "زوجي أو فردي", "أكبر عدد"],
        answer: 1,
      },
      {
        question: "تطبيق الآلة الحاسبة المبسطة بيستخدم إيه؟",
        options: ["شروط if على العملية", "حلقات فقط", "مصفوفات", "ملفات"],
        answer: 0,
        explanation: "كل عملية لها شرط، مع else للحالات غير المعروفة.",
      },
    ],
  },
  {
    id: "036",
    number: 36,
    title: "Switch, Case",
    titleEn: "Switch, Case",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(36),
    summary:
      "للقيم الثابتة المحدودة أنظف من عشرات `if`: `switch(x){ case 1: ... break; }`. القاعدة الذهبية: لا تنسَ `break` (وإلا ستقع في Fall-Through). و `default` اختياري، ويُستخدم كبديل لأي قيمة لم تطابق أي `case`.",
    terms: [
      { en: "switch", ar: "اختيار متعدد على قيمة ثابتة." },
      { en: "Fall-Through", ar: "الوقوع: أكمل للكيس الجاية لعدم وجود break." },
    ],
    quiz: [
      {
        question: "نسيان `break` يسبب إيه؟",
        options: ["أسرع", "إكمال للـ case الجاية", "خطأ", "بطء"],
        answer: 1,
      },
      {
        question: "`default` في switch بيتنفذ إمتى؟",
        options: ["دايمًا", "قبل أول case", "لما مفيش case مطابق", "لما break يشتغل"],
        answer: 2,
        explanation: "default هو البديل عند عدم تطابق أي case.",
      },
    ],
  },
  {
    id: "037",
    number: 37,
    title: "تدريبات Switch — 3 تطبيقات",
    titleEn: "Switch Trainings - Create Three Applications",
    section: "If و Switch",
    sectionEn: "If & Switch",
    youtube: yt(37),
    summary:
      "ثلاث مشاريع `switch`: آلة حاسبة (+-*/ )، قائمة مطعم، ودرجات بحروف. كلها تثبت أن `switch` أنظف عندما يكون القرار من قائمة ثابتة.",
    terms: [
      { en: "default", ar: "الحالة الافتراضية: البديل عند عدم مطابقة." },
    ],
    quiz: [
      {
        question: "أفضل استخدام لـ switch؟",
        options: ["شروط أكبر من", "قيم ثابتة من قائمة", "قرارات منطقية", "لا شيء"],
        answer: 1,
      },
      {
        question: "ليه switch أنسب من if لقائمة ثابتة؟",
        options: ["أسرع دايمًا", "بيشتغل بدون break", "بيتعامل مع النصوص", "أوضح لما تكون القيم محدودة ومعروفة"],
        answer: 3,
        explanation: "الوضوح هو المكسب الأساسي هنا.",
      },
    ],
  },
  {
    id: "038",
    number: 38,
    title: "المصفوفة — ما هي المصفوفة؟",
    titleEn: "Array - What Is Array ?",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(38),
    summary:
      "المصفوفة: مجموعة قيم من نفس النوع تحت اسم واحد، مرقّمة من صفر. `int arr[5]` يعني 5 خانات. استخدمها لما تحتاج عددًا من القيم المرتبة (درجات، أسماء، قراءات).",
    terms: [
      { en: "Array", ar: "المصفوفة: سلسلة قيم مرتبة بنفس النوع." },
      { en: "Index", ar: "الفهرس: رقم العنصر — يبدأ من صفر." },
    ],
    quiz: [
      {
        question: "فهرس أول عنصر؟",
        options: ["1", "0", "-1", "عشوائي"],
        answer: 1,
      },
      {
        question: "إزاي نعرّف مصفوفة 5 أعداد صحيحة؟",
        options: ["array int[5];", "int arr[5];", "int arr = 5;", "arr[5] int;"],
        answer: 1,
        explanation: "النوع ثم الاسم ثم الحجم بين أقواس.",
      },
    ],
    example: {
      title: "مصفوفة أولى",
      code: `int scores[5] = {10,20,30,40,50};\nstd::cout << scores[0];`,
    },
  },
  {
    id: "039",
    number: 39,
    title: "المصفوفة — الوصول ومواقع الذاكرة",
    titleEn: "Array - Access Elements And Memory Location",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(39),
    summary:
      "المصفوفة متسلسلة في الذاكرة: العنصر التالي يلي السابق بمسافة حجم النوع. لذا `arr[i]` هو `*(arr + i)`. هذا يجعل الوصول سريعًا لكنه لا يمنع الخروج عن الحدود — انتبه دائمًا لـ `i < size`.",
    terms: [
      { en: "Memory Location", ar: "موقع الذاكرة: عنوان العنصر في RAM." },
    ],
    quiz: [
      {
        question: "مواقع عناصر المصفوفة؟",
        options: ["عشوائية", "متسلسلة", "متقطعة", "مختلطة"],
        answer: 1,
      },
      {
        question: "`arr[i]` بتساوي إيه في حساب المؤشر؟",
        options: ["*(arr + i)", "&arr + i", "arr + i", "*arr + i"],
        answer: 0,
        explanation: "arr[i] تكافئ *(arr + i).",
      },
    ],
  },
  {
    id: "040",
    number: 40,
    title: "المصفوفة — الإضافة والتعديل",
    titleEn: "Array - Add And Update Elements",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(40),
    summary:
      "التعديل سهل: `arr[2] = 99` يغير العنصر الثالث. لكن «الإضافة» في المصفوفة الثابتة لا تُنشئ خانتها الجديدة — إما تملأ خانة موجودة فارغة، أو تتحول إلى Vector مرنة.",
    terms: [
      { en: "Update", ar: "تحديث: تغيير قيمة موجودة في خانة." },
    ],
    quiz: [
      {
        question: "تعديل `arr[2] = 99` يغير إيه؟",
        options: ["الحجم", "العنصر الثالث", "كل العناصر", "الاسم"],
        answer: 1,
      },
      {
        question: "هل المصفوفة الثابتة بتزيد حجمها لما تضيف عنصر؟",
        options: ["نعم تلقائيًا", "فقط لو int", "لا، الحجم ثابت", "فقط داخل main"],
        answer: 2,
        explanation: "المصفوفة الثابتة حجمها محدد وقت التعريف.",
      },
    ],
  },
  {
    id: "041",
    number: 41,
    title: "المصفوفة متعددة الأبعاد",
    titleEn: "Array - Multidimensional Array",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(41),
    summary:
      "جدول `int m[2][3]`: صفان وثلاثة أعمدة. الفهرس الأول للصف، الثاني للعمود (`m[1][2]`). مفيدة للشبكات والجداول والموديلات.",
    terms: [
      { en: "Multidimensional", ar: "متعددة الأبعاد: صفوف وأعمدة." },
    ],
    quiz: [
      {
        question: "`int m[2][3]` معناه؟",
        options: ["3 صف 2 عمود", "2 صف 3 عمود", "5 عناصر", "2 عمود و3 صف"],
        answer: 1,
      },
      {
        question: "`m[1][2]` بتشير لإيه في `int m[2][3]`؟",
        options: ["الصف الأول والعمود الثاني", "الصف الثالث والعمود الثاني", "العنصر رقم 12", "الصف الثاني والعمود الثالث"],
        answer: 3,
        explanation: "الفهارس تبدأ من 0: الصف 1 هو الثاني، والعمود 2 هو الثالث.",
      },
    ],
  },
  {
    id: "042",
    number: 42,
    title: "كلاس Array",
    titleEn: "Array - Class Array",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(42),
    summary:
      "البديل الحديث `std::array<int, 5>` يعرف حجمه في القالب وله دوال (`size()`, `at()`). و `at()` ترمي استثناءً عند الخروج عن الحدود، بخلاف `[]`. أفضل من مصفوفة C القديمة في العمل الحديث.",
    terms: [
      { en: "std::array", ar: "كلاس Array الحديث: آمن ودوال جاهزة." },
    ],
    quiz: [
      {
        question: "ميزة `std::array` عن C array؟",
        options: ["أسرع", "أمان + size/at", "أكبر", "أصغر"],
        answer: 1,
      },
      {
        question: "إيه اللي بيميز `at()` عن `[]` في std::array؟",
        options: ["أسرع", "بتتحقق من الحدود وترمي استثناء", "بترجع حجم المصفوفة", "بتعدل الحجم"],
        answer: 1,
        explanation: "at() تتحقق من الفهرس قبل الوصول.",
      },
    ],
  },
  {
    id: "043",
    number: 43,
    title: "أساليب المصفوفة والمناقشة",
    titleEn: "Array - Methods And Discussion",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(43),
    summary:
      "المرور على المصفوفة بحلقة، حساب المجموع، وإيجاد العنصر الأكبر — كلها أساليب تقليدية على المصفوفة. القاعدة: استخدم ثابتًا لحجم المصفوفة حتى لا تكرر الرقم في الكود.",
    terms: [
      { en: "Iteration", ar: "التكرار: المرور على كل عنصر مرة." },
    ],
    quiz: [
      {
        question: "إيه أفضل ممارسة لحجم المصفوفة في الكود؟",
        options: ["رقم متكرر في كل مكان", "ثابت باسم واضح", "متغير عشوائي", "بدون حجم"],
        answer: 1,
      },
      {
        question: "ليه نستخدم ثابتًا لحجم المصفوفة؟",
        options: ["لتجنب تكرار الرقم وتسهيل التعديل", "لتحسين الألوان", "لأن المصفوفة بتحتاج const", "لإبطاء البرنامج"],
        answer: 0,
        explanation: "الثابت باسم واضح يمنع الأرقام السحرية.",
      },
    ],
  },
  {
    id: "044",
    number: 44,
    title: "المصفوفة — لعبة تخمين الرقم",
    titleEn: "Array - Guess The Number Game",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(44),
    summary:
      "لعبة كلاسيكية تدمج الحلقات والمصفوفات والعشوائية: ابدأ بـ `srand(time(0))` ثم ولّد الرقم بـ `rand()`، وخلي المستخدم يخمنه مع رسائل «أعلى» و«أقل». هذه وظيفة ممتازة في البورتفوليو.",
    terms: [
      { en: "rand() / srand()", ar: "مولد عشوائي: أرقام عشوائية." },
    ],
    quiz: [
      {
        question: "`srand(time(0))` وظيفتها إيه؟",
        options: ["طباعة النتيجة", "بذر عشوائية كل مرة", "نتائج بطيئة", "لا شيء"],
        answer: 1,
      },
      {
        question: "قبل استخدام rand() في لعبة التخمين، بنعمل إيه؟",
        options: ["بنستخدم cin", "بنعرّف const", "بنكتب srand(time(0))", "بنكتب break"],
        answer: 2,
        explanation: "srand يبذر المولّد العشوائي بوقت مختلف كل تشغيل.",
      },
    ],
  },
  {
    id: "045",
    number: 45,
    title: "النصوص String — ما هي النصوص؟",
    titleEn: "String - What Is String ?",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(45),
    summary:
      "النصوص سلسلة `char` تُدار ككل بـ `string`. النوع `string` من `<string>` يمنحك الطول، الاتصال، والبحث. لا تستخدم `char[]` القديمة إلا للتعامل مع واجهات C القديمة.",
    terms: [
      { en: "string", ar: "النص: سلسلة حروف تُعامل كوحدة." },
    ],
    quiz: [
      {
        question: "المكتبة المطلوبة لـ string؟",
        options: ["<iostream>", "<string>", "<cmath>", "<vector>"],
        answer: 1,
      },
      {
        question: "من أنهي هيدر يجي `std::string`؟",
        options: ["<iostream>", "<cstring>", "<vector>", "<string>"],
        answer: 3,
        explanation: "string في <string>، وcstring لدوال C القديمة.",
      },
    ],
  },
  {
    id: "046",
    number: 46,
    title: "النصوص — الدمج Concatenation",
    titleEn: "String - Concatenation",
    section: "المصفوفات والنصوص",
    sectionEn: "Array & String",
    youtube: yt(46),
    summary:
      "دمج النصوص بـ `+`: `first + last`. لدمج رقم كنص: `to_string(num)`. وتذكر `\\n` للسطر الجديد في `cout`، ولا تخلط `\" و '` — إن أردت `'` استخدم `\"'\"`.",
    terms: [
      { en: "Concatenation", ar: "الدمج: لصق نصين أو أكثر بـ +." },
    ],
    quiz: [
      {
        question: "إزاي تحوّل الرقم 25 إلى نص عشان تدمجه؟",
        options: ["std::string(25)", "to_string(25)", "\"25\"", "char(25)"],
        answer: 1,
      },
      {
        question: "لدمج نصين في C++ نستخدم إيه؟",
        options: ["-", "+", "*", "%"],
        answer: 1,
        explanation: "عامل + يدمج std::string.",
      },
    ],
  },
  {
    id: "047",
    number: 47,
    title: "الحلقة For",
    titleEn: "Loop With For",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(47),
    summary:
      "أشهر الحلقات: تعرف عدد التكرارات مسبقًا — `for(init; cond; inc)`. الثلاثية في سطر واحد تمنحك وضوحًا أكيدًا. هي الحلقة الأساسية للجداول والعد.",
    terms: [
      { en: "for", ar: "حلقة عددية: تعرف التكرارات مسبقًا." },
    ],
    quiz: [
      {
        question: "`for(int i=0;i<5;i++)` تتكرر كم مرة؟",
        options: ["4", "5", "6", "0"],
        answer: 1,
      },
      {
        question: "أجزاء for الثلاثة بالترتيب؟",
        options: ["بداية، شرط، زيادة", "شرط، بداية، زيادة", "زيادة، شرط، بداية", "بداية، زيادة، شرط"],
        answer: 0,
        explanation: "init ثم condition ثم increment.",
      },
    ],
  },
  {
    id: "048",
    number: 48,
    title: "الحلقة For — صياغة متقدمة",
    titleEn: "Loop With For Advanced Syntax",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(48),
    summary:
      "صياغات متقدمة: خطوة `i += 2`، التناقص `i--`، و range-based for `for(auto x : v)`. صياغة range-based for أنظف للمصفوفات — استخدمها كلما أمكن.",
    terms: [
      { en: "Ranged Loop", ar: "الحلقة النطاقية: for (x : container) نظيفة." },
    ],
    quiz: [
      {
        question: "أفضل صياغة لمصفوفة؟",
        options: ["for(idx)", "for(auto x : v)", "while", "goto"],
        answer: 1,
      },
      {
        question: "`for(auto x : v)` بتعمل إيه؟",
        options: ["بتعدل حجم v", "بترتب v", "بتلف على عناصر v واحد واحد", "بتحذف v"],
        answer: 2,
        explanation: "هذه صياغة range-based for.",
      },
    ],
  },
  {
    id: "049",
    number: 49,
    title: "الحلقة For — تدريبات متقدمة",
    titleEn: "Loop With For Advanced Trainings",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(49),
    summary:
      "تدريبات على العد بالمجاميع، الأرقام الزوجية، والمثلثات. الفكرة هنا: متى تستخدم `i += 2` (خطوة 2) ومتى `i--` (عكسي) — كل تمرين يدرّب على قراءة النمط.",
    terms: [
      { en: "Step", ar: "الخطوة: مقدار الزيادة في كل لفة." },
    ],
    quiz: [
      {
        question: "لو عايز تعدّ الأرقام الزوجية من 0 لـ 10، خطوة الحلقة تكون كام؟",
        options: ["1", "2", "3", "10"],
        answer: 1,
      },
      {
        question: "لو عايز تطبع من 10 لـ 1، إيه المناسب؟",
        options: ["i++", "i += 2", "break", "i--"],
        answer: 3,
        explanation: "التناقص يعكس العد.",
      },
    ],
  },
  {
    id: "050",
    number: 50,
    title: "الحلقة For المتداخلة Nested Loop",
    titleEn: "Loop With For Nested Loop",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(50),
    summary:
      "حلقة داخل حلقة: جدول ضرب، مصفوفة صف × عمود، أو حتى مربع حسابي. عدد التكرارات يضرب (3 × 4 = 12 لفة). انتبه: عكس ترتيب الحلقات يغيّر ترتيب الطباعة (الصفوف والأعمدة).",
    terms: [
      { en: "Nested Loop", ar: "الحلقة المتداخلة: حلقة داخل حلقة." },
    ],
    quiz: [
      {
        question: "حلقة 3 داخل حلقة 4 تتكرر الداخلي كم مرة؟",
        options: ["7", "12", "3", "4"],
        answer: 1,
      },
      {
        question: "لو الحلقة الخارجية 3 مرات والداخلية 4، مجموع اللفات؟",
        options: ["7", "12", "3", "4"],
        answer: 1,
        explanation: "3 × 4 = 12.",
      },
    ],
  },
  {
    id: "051",
    number: 51,
    title: "الحلقة While",
    titleEn: "Loop With While",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(51),
    summary:
      "تُستخدم عندما لا تعرف عدد اللفات مسبقًا: كرر طالما الشرط صح. الخطر الأول: حلقة لا نهائية لو نسيت تعديل المتغير الذي يتحقق منه الشرط.",
    terms: [
      { en: "while", ar: "حلقة شرطية: تفحص أولًا." },
    ],
    quiz: [
      {
        question: "سبب الحلقة اللانهائية الأشهر؟",
        options: ["break", "نسيان تعديل الشرط", "استخدام continue", "السرعة"],
        answer: 1,
      },
      {
        question: "إمتى نستخدم while بدل for؟",
        options: ["لما عدد اللفات مش معروف مسبقًا", "لما عدد اللفات ثابت", "لما نكتب مصفوفة", "لما نستخدم switch"],
        answer: 0,
        explanation: "while مناسبة للشروط غير المعروفة مسبقًا.",
      },
    ],
  },
  {
    id: "052",
    number: 52,
    title: "الحلقة Do ... While",
    titleEn: "Loop With Do ... While",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(52),
    summary:
      "تدخل مرة واحدة على الأقل ثم تفحص. مثالية لعرض قائمة قبل طلب الإدخال، أو لأي منطق يجب أن يُنفذ أولاً. `do { } while(false);` تقليد «مرة واحدة» تحتاجه كثيرًا في الألعاب.",
    terms: [
      { en: "do ... while", ar: "حلقة تنفيذ-أولًا ثم فحص." },
    ],
    quiz: [
      {
        question: "الفرق عن while؟",
        options: ["نفس الشيء", "تدخل مرة على الأقل", "أسرع", "تفحص الشرط أولًا"],
        answer: 1,
      },
      {
        question: "`do { ... } while(false);` هتتنفذ كام مرة؟",
        options: ["صفر", "مرتين", "مرة واحدة", "لانهائي"],
        answer: 2,
        explanation: "do تنفذ مرة قبل فحص الشرط.",
      },
    ],
  },
  {
    id: "053",
    number: 53,
    title: "الحلقة — كسر وتخطي Break & Continue",
    titleEn: "Loop - Break, Continue",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(53),
    summary:
      "`break` يخرج من الحلقة كليًا، و `continue` يتخطى اللفة الحالية ويكمل الجاية. مثال: تخطّ الأرقام 5 و10 بـ `continue`، واخرج عند 100 بـ `break`.",
    terms: [
      { en: "break", ar: "الخروج الفوري من الحلقة." },
      { en: "continue", ar: "تخطي اللفة الحالية فقط." },
    ],
    quiz: [
      {
        question: "`continue` يعمل إيه؟",
        options: ["يخرج كليًا", "يتخطى اللفة الحالية", "يوقف البرنامج", "يقلل الذاكرة"],
        answer: 1,
      },
      {
        question: "`break` بتعمل إيه؟",
        options: ["تتخطى اللفة الحالية", "توقف البرنامج نهائيًا", "تعيد اللفة", "تخرج من الحلقة كلها"],
        answer: 3,
        explanation: "break ينهي الحلقة، continue يتخطى لفة.",
      },
    ],
  },
  {
    id: "054",
    number: 54,
    title: "الحلقة — تدريبات: 3 تطبيقات",
    titleEn: "Loop - Trainings - Create 3 Applications",
    section: "الحلقات",
    sectionEn: "Loops",
    youtube: yt(54),
    summary:
      "ثلاثة تطبيقات حلقات: مجموع أرقام، جدول ضرب كامل، وقائمة أرقام ذكية مع تخرج مشروط. اكتبها بيدك وتأكد من الناتج في الملعب.",
    terms: [
      { en: "Practice", ar: "تدريب: تطبيق مهارتين معًا (حلقة + شرط)." },
    ],
    quiz: [
      {
        question: "إيه الأنسب لجدول ضرب بعدد صفوف وأعمدة معروف؟",
        options: ["حلقة for متداخلة", "while واحدة", "do while", "switch"],
        answer: 0,
      },
      {
        question: "تطبيق مجموع الأرقام بيحتاج إيه؟",
        options: ["مصفوفة أسماء", "متغير مجموع يتراكم عليه", "switch", "ملف"],
        answer: 1,
        explanation: "اجمع كل قيمة في متغير واحد.",
      },
    ],
  },
  {
    id: "055",
    number: 55,
    title: "الدوال Functions — مقدمة",
    titleEn: "Function - Introduction",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(55),
    summary:
      "الدالة صندوق مهمة: تأخذ باراميترات، تنفذ، وترجع نتيجة. القاعدة الذهبية: لو كرّرت كودًا فأنت تحتاج دالة. الدالة المفيدة مقصورة على مهمة واحدة باسم واضح.",
    terms: [
      { en: "Function", ar: "الدالة: كود قابل للإعادة باسم وباراميترات." },
    ],
    quiz: [
      {
        question: "أفضل اسم لدالة تجمع؟",
        options: ["x", "add", "a", "fun"],
        answer: 1,
      },
      {
        question: "إيه علامة إنك محتاج دالة؟",
        options: ["تكرار نفس الكود أكتر من مرة", "الكود قصير", "مفيش متغيرات", "بتستخدم cout"],
        answer: 0,
        explanation: "التكرار إشارة قوية لاستخراج دالة.",
      },
    ],
    example: {
      title: "أول دالة",
      code: `int add(int a, int b){ return a + b; }\nint main(){ std::cout << add(3,4); }`,
    },
  },
  {
    id: "056",
    number: 56,
    title: "الدوال — الباراميترات Parameters",
    titleEn: "Function - Parameters",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(56),
    summary:
      "الباراميترات مدخلات الدالة: `add(int a, int b)` تستقبل قيمتين. القيمة تُنسخ للدالة (تمرير بالنسخ) افتراضيًا. لو أردت التعديل على الأصل، هنحتاج المؤشرات أو المراجع (ستأتي لاحقًا).",
    terms: [
      { en: "Parameter", ar: "الباراميتر: متغير داخل الدالة يستقبل قيمة." },
    ],
    quiz: [
      {
        question: "لو استدعيت `f(5)` والدالة `f(int x)`، قيمة `x` جوّاها تكون إيه؟",
        options: ["0", "5", "عشوائية", "null"],
        answer: 1,
      },
      {
        question: "تمرير الباراميتر بالنسخ معناه إيه؟",
        options: ["الدالة بتعدل الأصل", "الدالة بترجع عنوان", "الدالة بتشتغل على نسخة من القيمة", "الدالة مش بتاخد قيمة"],
        answer: 2,
        explanation: "النسخة لا تؤثر على المتغير الأصلي.",
      },
    ],
  },
  {
    id: "057",
    number: 57,
    title: "الدوال — تدريبات على الباراميترات",
    titleEn: "Function - Parameters Training",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(57),
    summary:
      "تدريبات بدوال بسيطة: أكبر عدد، مربع الرقم، زائد 10. كلها باراميتر واحد أو اثنان وواضح أن الدالة تُختبر بقيم مختلفة. ممتاز للتأكد أنك فهمتها.",
    terms: [
      { en: "Testing", ar: "الاختبار: تمرير قيم متنوعة للدالة وملاحظة الناتج." },
    ],
    quiz: [
      {
        question: "أفضل اختبار لدالة `add`؟",
        options: ["قيمة واحدة", "قيم مختلفة (3+4، -1+1...)", "صفر", "نص"],
        answer: 1,
      },
      {
        question: "دالة `square(x)` بترجع إيه؟",
        options: ["x + 2", "x / 2", "x - 2", "x * x"],
        answer: 3,
        explanation: "مربع العدد = العدد × نفسه.",
      },
    ],
  },
  {
    id: "058",
    number: 58,
    title: "الدوال — القيم الافتراضية للباراميتر",
    titleEn: "Function - Default Parameter Value",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(58),
    summary:
      "القيمة الافتراضية: `void greet(string n = \"مبرمج\")` — عند النداء بلا باراميتر يستخدم الافتراضية. مفيدة لتخفي التفاصيل المعتادة عن المستخدم.",
    terms: [
      { en: "Default Parameter", ar: "قيمة افتراضية: تقع إذا لم تُمرر قيمة." },
    ],
    quiz: [
      {
        question: "نداء `greet()` بلا باراميتر ويوجد افتراضية؟",
        options: ["خطأ", "يستخدم الافتراضية", "عشوائي", "لا شيء"],
        answer: 1,
      },
      {
        question: "الباراميتر الافتراضي بيتستخدم إمتى؟",
        options: ["لما تبعت قيمة", "لما تنده الدالة من غير ما تبعت قيمة له", "لما يكون النوع int", "لما تكتب return"],
        answer: 1,
        explanation: "الافتراضي بديل عند غياب الوسيط.",
      },
    ],
  },
  {
    id: "059",
    number: 59,
    title: "الدوال — تمرير المصفوفة كباراميتر",
    titleEn: "Function - Passing Array As Parameter",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(59),
    summary:
      "المصفوفة تُمرر كعنوانها الأول `int a[]` أو `int* a` — لذا الدالة لا ترى حجمها تلقائيًا، وتحتاج باراميتر حجمًا منفصلًا. مرر الطول أيضًا لتفادي تجاوز الحدود.",
    terms: [
      { en: "Pass by Pointer", ar: "التمرر بالمؤشر: للوصول للبيانات الأصلية." },
    ],
    quiz: [
      {
        question: "لتمرير مصفوفة لدالة تحتاج إيه إضافي؟",
        options: ["حجمها", "اسمها فقط", "نوعها", "مؤشرها"],
        answer: 0,
      },
      {
        question: "ليه بنبعت حجم المصفوفة معاها للدالة؟",
        options: ["لأن الدالة بتشوف العنوان فقط ومش عارفة الحجم", "لأن المصفوفة بتنسى قيمها", "لأن C++ بتمنع المصفوفات", "لتسريع الطباعة"],
        answer: 0,
        explanation: "اسم المصفوفة يتحول لمؤشر، فيضيع الحجم.",
      },
    ],
  },
  {
    id: "060",
    number: 60,
    title: "الدوال — الإرجاع و Void",
    titleEn: "Function - Return And Void",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(60),
    summary:
      "`return` تُرجع قيمة واحدة وتنهي التنفيذ. `void` تعني لا شيء: الدالة للطباعة والتأثيرات، لا لحساب ناتج. لا تجعل الكود يفعل كليهما بلا مبرر.",
    terms: [
      { en: "return", ar: "الإرجاع: إرجاع قيمة للنداء." },
      { en: "void", ar: "فراغ: لا إرجاع." },
    ],
    quiz: [
      {
        question: "`void` تعني؟",
        options: ["قيمة فارغة", "لا إرجاع", "نص", "رقم"],
        answer: 1,
      },
      {
        question: "الدالة void بترجع إيه؟",
        options: ["صفر", "nullptr", "لا ترجع قيمة", "نص فارغ"],
        answer: 2,
        explanation: "void تعني بلا قيمة إرجاع.",
      },
    ],
  },
  {
    id: "061",
    number: 61,
    title: "الدوال — التصريح المسبق Forward Declaration",
    titleEn: "Function - Forward Declaration",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(61),
    summary:
      "ترتيبك قد يجعل `main` يستدعي دالة لم تُعرّف بعد. حلّها بتصريح مسبق `int add(int,int);` في الأعلى، والتعريف أسفل `main`. بدونه ستظهر رسالة `add was not declared`.",
    terms: [
      { en: "Forward Declaration", ar: "التصريح المسبق: إخبار المترجم بدالة لاحقة." },
    ],
    quiz: [
      {
        question: "فائدة التصريح المسبق؟",
        options: ["السرعة", "إبلاغ المترجم بدالة قادمة", "تقليل حجم الملف", "الخطأ"],
        answer: 1,
      },
      {
        question: "إيه شكل التصريح المسبق لدالة add؟",
        options: ["add(int, int);", "int add() { }", "declaration add;", "int add(int, int);"],
        answer: 3,
        explanation: "التصريح يحدد نوع الإرجاع والباراميترات بلا جسم.",
      },
    ],
  },
  {
    id: "062",
    number: 62,
    title: "الدوال الجاهزة — دوال الرياضة",
    titleEn: "Built-In Functions Math Functions",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(62),
    summary:
      "مكتبة `<cmath>` فيها دوال الرياضيات: `sqrt`, `pow`, `abs`, `sin`, `log`. أما `max` و `min` ففي `<algorithm>`. لا تعيد اختراع العجلة — استخدام الجاهز أسرع وأدق.",
    terms: [
      { en: "Built-in", ar: "مدمج/جاهز: ضمن المكتبات القياسية." },
    ],
    quiz: [
      {
        question: "مكتبة دوال الرياضة؟",
        options: ["<string>", "<cmath>", "<vector>", "<iostream>"],
        answer: 1,
      },
      {
        question: "`sqrt(16)` بترجع؟",
        options: ["8", "4", "16", "2"],
        answer: 1,
        explanation: "الجذر التربيعي لـ 16 هو 4.",
      },
    ],
    example: {
      title: "رياضيات جاهزة",
      code: `#include <cmath>\nstd::cout << std::sqrt(16) << " " << std::pow(2,3);`,
    },
  },
  {
    id: "063",
    number: 63,
    title: "الدوال الجاهزة — تدريبات: تطبيقان",
    titleEn: "Built-In Functions Training Create 2 Apps",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(63),
    summary:
      "تطبيقان بالدوال الجاهزة: حاسبة رياضيات (جذر وقوة)، وتصنيف درجة (max/min). الفكرة: اقرأ وثائق المكتبة واختر أنسب دالة.",
    terms: [
      { en: "Library", ar: "المكتبة: تجميعة دوال جاهزة." },
    ],
    quiz: [
      {
        question: "أكبر عدد بين 15 و22؟",
        options: ["15", "22", "30", "خطأ"],
        answer: 1,
      },
      {
        question: "الدالة المناسبة لأكبر رقمين؟",
        options: ["max", "sqrt", "abs", "pow"],
        answer: 0,
        explanation: "max ترجع الأكبر بين قيمتين.",
      },
    ],
  },
  {
    id: "064",
    number: 64,
    title: "الدوال الجاهزة — تدريبات: 3 تطبيقات",
    titleEn: "Built-In Functions Training Create 3 Apps",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(64),
    summary:
      "ثلاثة تطبيقات: قوة عدد، أكبر ثلاثة أرقام، والقيمة المطلقة. التطبيقات بتجمع بين `pow` و`max` و`abs`. اكتبها وتأكد من النواتج في الملعب.",
    terms: [
      { en: "Math", ar: "رياضيات: حسابات رقمية قياسية." },
    ],
    quiz: [
      {
        question: "أي من الدوال الجاهزة التالية؟",
        options: ["ownPow", "std::pow", "sqrt2", "calc"],
        answer: 1,
      },
      {
        question: "`abs(-7)` بترجع؟",
        options: ["-7", "0", "7", "14"],
        answer: 2,
        explanation: "abs ترجع القيمة المطلقة.",
      },
    ],
  },
  {
    id: "065",
    number: 65,
    title: "تعدد تعريفات الدالة Overloading",
    titleEn: "Function Overloading",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(65),
    summary:
      "نفس الاسم، باراميترات مختلفة: `add(int,int)` و `add(double,double)`. المترجم يختار الأنسب. لو الباراميترات متطابقة، إعادة التعريف بنفس التوقيع خطأ ترجمة — تجنبها.",
    terms: [
      { en: "Overloading", ar: "تعدد التعريفات: نفس الاسم بقوائم مختلفة." },
    ],
    quiz: [
      {
        question: "مثال Overloading صحيح؟",
        options: ["`add(int)` و `add(double)`", "`add(int)` و `add(int)`", "`f()` و `f()`", "لا شيء"],
        answer: 0,
      },
      {
        question: "شرط صحة Overloading؟",
        options: ["نفس الاسم ونفس الباراميترات", "أسماء مختلفة ونفس الباراميترات", "نفس الاسم ونفس النوع", "نفس الاسم وباراميترات مختلفة"],
        answer: 3,
        explanation: "التوقيع المختلف هو ما يميز النسخ.",
      },
    ],
  },
  {
    id: "066",
    number: 66,
    title: "العودية Function Recursion",
    titleEn: "Function Recursion",
    section: "الدوال",
    sectionEn: "Functions",
    youtube: yt(66),
    summary:
      "دالة تنادي نفسها: أساس (Base Case) يوقفها، وخطوات تقترب من الأساس. مثال المضروب `n! = n * (n-1)!`. بدون الأساس: انهيار لانهائي.",
    terms: [
      { en: "Recursion", ar: "العودية: دالة تنادي نفسها." },
      { en: "Base Case", ar: "الحالة الأساسية: شرط التوقف." },
    ],
    quiz: [
      {
        question: "سبب الكراش في العودية غالبًا؟",
        options: ["بطء", "غياب الأساس", "السرعة", "زيادة عدد الباراميترات"],
        answer: 1,
      },
      {
        question: "إيه اللي بيوقف العودية؟",
        options: ["الحلقة for", "شرط الأساس Base Case", "المتغير const", "المكتبة cmath"],
        answer: 1,
        explanation: "بدون أساس تستمر النداءات بلا نهاية.",
      },
    ],
    example: {
      title: "المضروب",
      code: `int fact(int n){ if(n<=1) return 1; return n*fact(n-1); }`,
    },
  },
  {
    id: "067",
    number: 67,
    title: "الحاويات — الـ Vector ما هو؟",
    titleEn: "Vector - What Is Vector",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(67),
    summary:
      "الـ Vector مصفوفة مرنة الحجم من STL: `push_back` يضيف، و `size` يقيس. بمعنى آخر «المصفوفة التي تعرف التمديد تلقائيًا». كل عمل حديث بـ C++ يوصل إليه.",
    terms: [
      { en: "Vector", ar: "المتجه: مصفوفة مرنة من STL." },
    ],
    quiz: [
      {
        question: "الـ Vector مقابل المصفوفة العادية؟",
        options: ["حجم ثابت", "مرن", "أصغر", "لا فرق"],
        answer: 1,
      },
      {
        question: "إزاي نضيف عنصر في آخر Vector؟",
        options: ["push_back", "pop_back", "at", "size"],
        answer: 0,
        explanation: "push_back يضيف في النهاية.",
      },
    ],
  },
  {
    id: "068",
    number: 68,
    title: "الحاويات — Vector مقابل Array",
    titleEn: "Vector - Versus Array",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(68),
    summary:
      "جدول مقارنة شامل: الثابت مقابل المرن، الوصول، الحذف، الاستهلاك. القاعدة: عرفت عدد العناصر من البداية؟ Array، وإلا فـ Vector هو الافتراضي.",
    terms: [
      { en: "Capacity", ar: "السعة: المساحة المحجوزة فعليًا." },
    ],
    quiz: [
      {
        question: "عدد غير معروف سابقًا؟",
        options: ["Array", "Vector", "char", "double"],
        answer: 1,
      },
      {
        question: "إمتى نختار Array بدل Vector؟",
        options: ["لما العدد غير معروف", "لما نحتاج إضافة مستمرة", "لما عدد العناصر معروف وثابت", "لما نحتاج حذف من المنتصف"],
        answer: 2,
        explanation: "الثبات يفضل Array، والمرونة تفضل Vector.",
      },
    ],
  },
  {
    id: "069",
    number: 69,
    title: "الحاويات — الوصول والإضافة والتحديث والحذف",
    titleEn: "Vector - Access, Add, Update & Delete Elements",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(69),
    summary:
      "أربع عمليات يومية: `v[i]` قراءة، `v[i]=x` تحديث، `push_back` إضافة، `pop_back` حذف من الآخر. `insert/erase` في المنتصف أبطأ — صمم حول `push/pop`.",
    terms: [
      { en: "push_back", ar: "إضافة في الآخر." },
      { en: "pop_back", ar: "حذف الآخر." },
    ],
    quiz: [
      {
        question: "`v.push_back(9)` تعني؟",
        options: ["حذف أول", "إضافة 9 في الآخر", "فراغ", "ترتيب"],
        answer: 1,
      },
      {
        question: "إزاي نحذف آخر عنصر من Vector؟",
        options: ["push_back", "erase(begin)", "clear", "pop_back"],
        answer: 3,
        explanation: "pop_back يحذف الأخير.",
      },
    ],
    example: {
      title: "Vector أساسي",
      code: `#include <vector>\nstd::vector<int> v={1,2}; v.push_back(3);`,
    },
  },
  {
    id: "070",
    number: 70,
    title: "الحاويات — الدوال",
    titleEn: "Vector - Functions",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(70),
    summary:
      "دوال Vector الأساسية: `size()`, `front()` (الأول)، `back()` (الأخير)، `at()` (الآمن)، `clear()` (إفراغ). `at` ترمي استثناء عند الخروج عن الحدود — استخدمها في الكود الآمن.",
    terms: [
      { en: "at()", ar: "الوصول الآمن: ترمي استثناء عند الخطأ." },
    ],
    quiz: [
      {
        question: "أي دالة تتحقق من الحدود وترمي استثناء عند الخروج عنها؟",
        options: ["v[100]", "v.at(100)", "v.back()", "v.size()"],
        answer: 1,
      },
      {
        question: "`v.front()` بترجع إيه؟",
        options: ["آخر عنصر", "أول عنصر", "حجم v", "عنوان v"],
        answer: 1,
        explanation: "front أول عنصر، back آخره.",
      },
    ],
  },
  {
    id: "071",
    number: 71,
    title: "الحاويات — المؤشر التكراري Iterator",
    titleEn: "Vector - Iterator & Why To Use",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(71),
    summary:
      "الـ Iterator كائن يشبه المؤشر للتنقل: `auto it = v.begin()` يشير لأول عنصر، و `*it` قيمته، و `it != v.end()` حدّ الحلقة. بلا حساب فهارس يدويًا.",
    terms: [
      { en: "Iterator", ar: "المؤشر التكراري: مؤشر تنقل آمن." },
    ],
    quiz: [
      {
        question: "`*it` يعني؟",
        options: ["عنوان", "القيمة التي يشير لها", "حجم", "كل العناصر"],
        answer: 1,
      },
      {
        question: "`v.begin()` بتشير لفين؟",
        options: ["أول عنصر", "آخر عنصر", "قبل أول عنصر", "حجم v"],
        answer: 0,
        explanation: "begin مؤشر بداية المجموعة.",
      },
    ],
  },
  {
    id: "072",
    number: 72,
    title: "الحاويات — التكرار بـ Iterator",
    titleEn: "Vector - Traversing With Iterator",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(72),
    summary:
      "نمط الحلقة: `for(auto it=v.begin(); it!=v.end(); ++it)` — تطبع كل عنصر. المكتبة الآن توفر range-based for الأبسط، لكن فهم Iterator ضروري للعمليات المتقدمة (ترتيب، إزالة).",
    terms: [
      { en: "begin() / end()", ar: "بداية ونهاية: حدود Iterator." },
    ],
    quiz: [
      {
        question: "حد النهاية في Iterator؟",
        options: ["begin()", "end()", "size()", "back()"],
        answer: 1,
      },
      {
        question: "شرط استمرار حلقة Iterator؟",
        options: ["it < v.size()", "it == v.begin()", "it != v.end()", "it > 0"],
        answer: 2,
        explanation: "نقارن بالـ end، وليس بالحجم.",
      },
    ],
  },
  {
    id: "073",
    number: 73,
    title: "الحاويات — الحلقة بـ Iterator و Ranged Loop",
    titleEn: "Vector - Loop With Iterator & Ranged Loop",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(73),
    summary:
      "مقارنة سهلة: Ranged Loop `for(int x : v)` للقراءة والتعديل البسيط، وIterator للعمليات المتقدمة. في الشغل الحديث 90% Ranged Loop.",
    terms: [
      { en: "Ranged Loop", ar: "حلقة النطاق: for(x:v) أنظف." },
    ],
    quiz: [
      {
        question: "أبسط تكرار؟",
        options: ["Iterator كامل", "for(auto x : v)", "goto", "while"],
        answer: 1,
      },
      {
        question: "أبسط صياغة لطباعة كل عناصر v؟",
        options: ["for(i=0;i<v;i++)", "while(v)", "goto", "for(auto x : v)"],
        answer: 3,
        explanation: "range-based for هي الأبسط.",
      },
    ],
  },
  {
    id: "074",
    number: 74,
    title: "الحاويات — العدّ والترتيب والعكس",
    titleEn: "Vector - Count, Sort, Reverse",
    section: "Vector",
    sectionEn: "Vector",
    youtube: yt(74),
    summary:
      "من `<algorithm>`: `count(v.begin(),v.end(),x)` عدّ، `sort(v.begin(),v.end())` ترتيب، `reverse` عكس. كلها تُستخدم بـ Iterators — لا تكتبها بنفسك.",
    terms: [
      { en: "Algorithm", ar: "الخوارزميات: مكتبة عمليات على الحاويات." },
      { en: "sort", ar: "الترتيب: من الصغير للكبير افتراضيًا." },
    ],
    quiz: [
      {
        question: "ترتيب Vector بسرعة؟",
        options: ["يدوي", "sort()", "عشوائي", "reverse()"],
        answer: 1,
      },
      {
        question: "`count(v.begin(), v.end(), 5)` بترجع إيه؟",
        options: ["أول عنصر", "عدد مرات ظهور 5", "ترتيب v", "حجم v"],
        answer: 1,
        explanation: "count تعدّ القيم المطابقة.",
      },
    ],
    example: {
      title: "ترتيب + عدّ",
      code: `#include <algorithm>\nstd::sort(v.begin(), v.end());`,
    },
  },
  {
    id: "075",
    number: 75,
    title: "المؤشرات — ما هي المؤشرات؟",
    titleEn: "What Are Pointers ?",
    section: "المؤشرات",
    sectionEn: "Pointers",
    youtube: yt(75),
    summary:
      "المؤشر: متغير يحتفظ بعنوان متغير آخر. `int* p = &x;` يعني p يحتفظ بعنوان x، و `*p` قيمته. تخيل x خزانة، وp مفتاح الخزانة.",
    terms: [
      { en: "Pointer", ar: "المؤشر: متغير يحتفظ بعنوان." },
      { en: "&", ar: "الهاش: عنوان المتغير." },
    ],
    quiz: [
      {
        question: "المؤشر يحتفظ بإيه؟",
        options: ["قيمة", "عنوان", "نوع", "اسم"],
        answer: 1,
      },
      {
        question: "`&x` بتعني إيه؟",
        options: ["عنوان x في الذاكرة", "قيمة x", "نوع x", "حجم x"],
        answer: 0,
        explanation: "& مؤثر العنوان.",
      },
    ],
    example: {
      title: "أول مؤشر",
      code: `int x=42; int* p=&x;\nstd::cout << *p; // 42`,
    },
  },
  {
    id: "076",
    number: 76,
    title: "المؤشرات — الإشارة إلى المصفوفة",
    titleEn: "Pointing To Array",
    section: "المؤشرات",
    sectionEn: "Pointers",
    youtube: yt(76),
    summary:
      "اسم المصفوفة هو عنوان أول عنصر. `int* p = arr;` يعني p يشير لأول عنصر. ومن هنا كل مزايا حساب المؤشرات (Pointers Arithmetic) المذكورة في الفيديو الجاي.",
    terms: [
      { en: "Array Decay", ar: "سقوط المصفوفة: اسم المصفوفة يتحول لمؤشر." },
    ],
    quiz: [
      {
        question: "`int* p = arr;` p يشير لـ؟",
        options: ["كل المصفوفة", "أول عنصر", "الأخير", "الحجم"],
        answer: 1,
      },
      {
        question: "اسم المصفوفة في C++ بيعامل كإيه؟",
        options: ["قيمة أول عنصر", "حجم المصفوفة", "عنوان أول عنصر", "نص"],
        answer: 2,
        explanation: "اسم المصفوفة يتحول لمؤشر لأول عنصر.",
      },
    ],
  },
  {
    id: "077",
    number: 77,
    title: "المؤشرات — Void و الضال Wild و الفارغ Null",
    titleEn: "Void Pointer, Wild Pointer And Null",
    section: "المؤشرات",
    sectionEn: "Pointers",
    youtube: yt(77),
    summary:
      "ثلاثة أخطاء مشهورة: الضال (غير مهيأ — خطر)، والفارغ `nullptr` (آمن ومعلَن)، و `void*` (عام). القاعدة الحياتية: أي مؤشر لا يحتاج قيمة: عرّفه `= nullptr` فورًا.",
    terms: [
      { en: "Wild Pointer", ar: "المؤشر الضال: غير مهيأ — خطير." },
      { en: "nullptr", ar: "المؤشر الفارغ الآمن." },
      { en: "void*", ar: "المؤشر العام: نوع غير محدد." },
    ],
    quiz: [
      {
        question: "تهيئة آمنة لمؤشر فارغ؟",
        options: ["`int* p;`", "`int* p = nullptr;`", "`int* p = 1;`", "`int* p = wild;`"],
        answer: 1,
      },
      {
        question: "إيه أخطر نوع مؤشر؟",
        options: ["nullptr", "void*", "مؤشر لمصفوفة", "المؤشر الضال غير المهيأ"],
        answer: 3,
        explanation: "المؤشر غير المهيأ قد يشير لأي مكان.",
      },
    ],
  },
  {
    id: "078",
    number: 78,
    title: "حساب المؤشر مع المصفوفات Pointers Arithmetic",
    titleEn: "Pointers Arithmetic And Arrays",
    section: "المؤشرات",
    sectionEn: "Pointers",
    youtube: yt(78),
    summary:
      "حساب المؤشر: `p + i` يشير إلى العنصر `i`؛ و `*(p+i)` هي قيمته. لذا `*(p+2)` تساوي `p[2]` وتساوي `arr[2]`. `p++` يشير للعنصر التالي. هذا هو أساس كل المكتبات الحديثة (`sort`, `find`).",
    terms: [
      { en: "Pointer Arithmetic", ar: "حساب المؤشر: الجمع مع العناصر المتسلسلة." },
    ],
    quiz: [
      {
        question: "`*(p+2)` تساوي؟",
        options: ["p", "p[2]", "arr", "2"],
        answer: 1,
      },
      {
        question: "`p++` على مؤشر لمصفوفة بيعمل إيه؟",
        options: ["يزيد القيمة بواحد", "يشير للعنصر التالي", "يحذف العنصر", "يرجع للبداية"],
        answer: 1,
        explanation: "حساب المؤشر يتحرك بحجم النوع.",
      },
    ],
    example: {
      title: "مؤشر + مصفوفة",
      code: `int a[]={10,20,30}; int* p=a;\nstd::cout << *(p+2); // 30`,
    },
  },
];

export function findVideo(id: string) {
  return elzeroVideos.find((v) => v.id === id);
}

export function videoIndex(id: string) {
  return elzeroVideos.findIndex((v) => v.id === id);
}
