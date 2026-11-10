export const MIKU = {
  name: "Miku",
  fullName: "Miku Chan",
  tagline: "Your study buddy at ETM",
  avatar: "/miku.png",
};

export interface MikuTip {
  title: string;
  body: string;
}

export const ONBOARDING_STEPS: MikuTip[] = [
  {
    title: "أهلًا بيك يا بطل! 🎵",
    body: "أنا Miku، مساعدتك في ETM. هاخدك في جولة سريعة تتعلم فيها تستخدم المنصة في دقيقة.",
  },
  {
    title: "1. اتعلم بالمنهج",
    body: "ابدأ من Curriculum. فيه 4 مستويات: Foundations → Intermediate → Advanced → Expert. كل درس فيه شرح + أمثلة + Quiz.",
  },
  {
    title: "2. جرّب الكود بنفسك",
    body: "Playground بيترجم ويشغّل C++ من المتصفح مباشرة. انسخ أي مثال من الدرس وجرّب عدّل فيه.",
  },
  {
    title: "3. تابع تقدمك",
    body: "Dashboard بيوريك وصلت فين وإيه اللي فاضل. وسجّل بحساب GitHub عشان صورة بروفايلك تبقى صورتك الحقيقية.",
  },
  {
    title: "4. Focus مع Pomodoro",
    body: "زر المؤقّت في الأسفل بيشتغل 25 دقيقة Focus وبعدها 5 دقايق Break. أنا هذكّرك لو سهات عني! 😤",
  },
  {
    title: "يلا نبدأ! 🚀",
    body: "خلاص تعرف كل حاجة. لو احتجتني في أي وقت، اضغط على صورتي في الأسفل وهجاوبك.",
  },
];

export const PAGE_TIPS: Record<string, MikuTip> = {
  "/landing": {
    title: "Welcome to ETM! 🎉",
    body: "This is the main landing of the platform — the big idea: learn C++ from zero to building an operating system and a game engine, with Miku as your study buddy.",
  },
  "/": {
    title: "أهلاً بيك في ETM 👋",
    body: "دي الصفحة الرئيسية. لو عايز تبدأ بسرعة اضغط Start، أو روح الـ Dashboard تشوف وصلت فين.",
  },
  "/curriculum": {
    title: "المنهج الكامل 📚",
    body: "هنا كل اللي هتتعلمه. 4 مستويات — ابدأ من Foundations لو معندكش أي خبرة، وهتطلع منها تعرف تبني نظام تشغيل.",
  },
  "/learn": {
    title: "إنت جوه درس 🎯",
    body: "اقرأ الشرح، شغّل الأمثلة في الـ Playground، وبعدين حل الـ Quiz. ولو خلصته اضغط Completedعشان أتابعك.",
  },
  "/playground": {
    title: "الملعب 💻",
    body: "اكتب أي كود C++ واضغط Run. الترجمة بتحصل على سيرفرات خارجية، فالنتيجة بتظهر في ثواني.",
  },
  "/elzero": {
    title: "فيديوهات الزيرو 🎬",
    body: "78 فيديو من مسار Fundamentals with C++ للزيرو. لكل فيديو ملخص + Quiz + أهم المصطلحات.",
  },
  "/dashboard": {
    title: "الداش بورد 📊",
    body: "هنا بتتابع تقدمك: الدروس المكتملة، الفاضل، وقت الـ Focus، والـ Streak بتاعك.",
  },
  "/progress": {
    title: "تفاصيل تقدمك 📈",
    body: "هنا نسبة إكمال كل مرحلة وكورس. لو عايز تراجع حاجة، من هنا بتعرف أنهي درس اقل كمان.",
  },
  "/projects": {
    title: "المشاريع 🛠️",
    body: "مشاريع حقيقية تبنيها بنفسك — من آلة حاسبة لحد نواة نظام تشغيل. أحسن طريقة تتأكد إنك فاهم.",
  },
  "/glossary": {
    title: "قاموس المصطلحات 📖",
    body: "كل كلمة إنجليزي متشرحة بالعربي. لو قابلك مصطلح في الدرس مش فاهمه، ابحث عنه هنا.",
  },
  "/guide": {
    title: "شرح Miku 🎓",
    body: "هنا بشرح لك كل حاجة في المنصة خطوة بخطوة. لو ضايع، ابدأ من هنا.",
  },
  "/profile": {
    title: "بروفايلك 👤",
    body: "صورتك من GitHub وبياناتك. هنا بتتابع عدد الدروس اللي خلصتها والفيديوهات اللي اتفرجت عليها.",
  },
  "/login": {
    title: "تسجيل الدخول 🔑",
    body: "سجّل بحساب GitHub عشان صورتك واسمك يبوا حقيقيين. لو معندكش حساب، تقدر تكمل كـ Guest.",
  },
};

export const POMODORO_MESSAGES = {
  focusStart: "يلا نبدأ! 25 دقيقة Focus — أنا معاك 🎵",
  focusDone: "أحسنت! 🎉 خلصت جلسة Focus. خد 5 دقايق Break، تستاهلهم.",
  breakStart: "وقت الراحة! 5 دقايق — ابعد عن الشاشة شوية وخد نفس.",
  breakDone: "يلا نرجع! جلسة Focus جديدة — مستقبلك مستني 💪",
  welcomeBack: "كنت مستنيك! متأخرش على المذاكرة 😤",
  longBreakOvertime: "لسه مرتاح؟ راحتك كفاية — رجعتملّي نذاكر علشان مستقبلك 🔥",
  focusOvertime: "لسه مذاكر؟ أنا فخورة بيك! بس خد Break شوية عشان دماغك تريح ⏸️",
};

export const ENCOURAGEMENTS = [
  "أنت بتعمل حاجة عظيمة! 🌟",
  "كل سطر كود قرّبك من هدفك.",
  "استمر، أنت أقوى مما تتخيل 💪",
  "المبرمج العظيم بيتعلم كل يوم.",
  "أنا فخورة بيك! 🎉",
  "الصعب بيقوى لما تتعلمه خطوة بخطوة.",
];

export function tipForPath(pathname: string): MikuTip {
  if (pathname.startsWith("/landing")) return PAGE_TIPS["/landing"];
  if (pathname.startsWith("/learn")) return PAGE_TIPS["/learn"];
  if (pathname.startsWith("/playground")) return PAGE_TIPS["/playground"];
  if (pathname.startsWith("/elzero")) return PAGE_TIPS["/elzero"];
  if (pathname.startsWith("/dashboard")) return PAGE_TIPS["/dashboard"];
  if (pathname.startsWith("/progress")) return PAGE_TIPS["/progress"];
  if (pathname.startsWith("/projects")) return PAGE_TIPS["/projects"];
  if (pathname.startsWith("/glossary")) return PAGE_TIPS["/glossary"];
  if (pathname.startsWith("/guide")) return PAGE_TIPS["/guide"];
  if (pathname.startsWith("/profile")) return PAGE_TIPS["/profile"];
  if (pathname.startsWith("/login")) return PAGE_TIPS["/login"];
  if (pathname.startsWith("/curriculum")) return PAGE_TIPS["/curriculum"];
  return PAGE_TIPS["/"];
}
