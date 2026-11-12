import type { Locale } from "./i18n/config";

/**
 * Miku's voice is Egyptian Arabic by design in `ar`.
 * `en` keeps the same personality in English.
 */
export const MIKU = {
  name: "Miku",
  fullName: "Miku Chan",
  avatar: "/miku.png",
  taglines: {
    ar: "رفيقة دراستك في ETM",
    en: "Your study buddy at ETM",
  } as Record<Locale, string>,
};

export interface MikuTip {
  title: string;
  body: string;
}

export const ONBOARDING_STEPS: Record<Locale, MikuTip[]> = {
  ar: [
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
      body: "Dashboard بيوريك وصلت فين وإيه اللي فاضل. وسجّل بحساب GitHub عشان صورتك تبقى صورتك الحقيقية.",
    },
    {
      title: "4. Focus مع Pomodoro",
      body: "زر المؤقّت في الأسفل بيشتغل 25 دقيقة Focus وبعدها 5 دقايق Break. أنا هذكّرك لو سهات عني! 😤",
    },
    {
      title: "يلا نبدأ! 🚀",
      body: "خلاص تعرف كل حاجة. لو احتجتني في أي وقت، اضغط على صورتي في الأسفل وهجاوبك.",
    },
  ],
  en: [
    {
      title: "Hey, champion! 🎵",
      body: "I'm Miku, your ETM guide. This quick tour shows you how to use the platform in one minute.",
    },
    {
      title: "1. Learn with the curriculum",
      body: "Start with the Curriculum. It has 4 levels: Foundations → Intermediate → Advanced → Expert. Every lesson has explanations + examples + a quiz.",
    },
    {
      title: "2. Try the code yourself",
      body: "The Playground compiles and runs C++ right in your browser. Copy any lesson example and tweak it.",
    },
    {
      title: "3. Track your progress",
      body: "The Dashboard shows where you are and what's left. Sign in with GitHub to use your real profile picture.",
    },
    {
      title: "4. Focus with Pomodoro",
      body: "The timer button in the corner runs 25 minutes of Focus, then a 5-minute Break. I'll nudge you if you drift! 😤",
    },
    {
      title: "Let's go! 🚀",
      body: "That's everything. If you need me anytime, press my picture in the corner and I'll help.",
    },
  ],
};

export const PAGE_TIPS: Record<string, Record<Locale, MikuTip>> = {
  landing: {
    ar: {
      title: "أهلاً بـ ETM! 🎉",
      body: "دي الصفحة الرئيسية للمنصة — الفكرة الكبيرة: تعلّم C++ من الصفر حتى بناء نظام تشغيل ومحرك ألعاب، ومعك Miku رفيقتك في الدراسة.",
    },
    en: {
      title: "Welcome to ETM! 🎉",
      body: "This is the landing page — the big idea: learn C++ from zero to building an operating system and a game engine, with Miku your study buddy.",
    },
  },
  home: {
    ar: {
      title: "أهلاً بيك في ETM 👋",
      body: "دي الصفحة الرئيسية. لو عايز تبدأ بسرعة اضغط Start، أو روح الـ Dashboard تشوف وصلت فين.",
    },
    en: {
      title: "Welcome to ETM 👋",
      body: "This is the home page. Press Start to begin, or open the Dashboard to see where you are.",
    },
  },
  curriculum: {
    ar: {
      title: "المنهج الكامل 📚",
      body: "هنا كل اللي هتتعلمه. 4 مستويات — ابدأ من Foundations لو معندكش أي خبرة، وهتطلع منها تعرف تبني نظام تشغيل.",
    },
    en: {
      title: "The curriculum 📚",
      body: "Everything you'll learn. 4 levels — start with Foundations if you're new, and you'll come out able to build an operating system.",
    },
  },
  learn: {
    ar: {
      title: "إنت جوه درس 🎯",
      body: "اقرأ الشرح، شغّل الأمثلة في الـ Playground، وبعدين حل الـ Quiz. ولو خلصته اضغط Completed عشان أتابعك.",
    },
    en: {
      title: "You're inside a lesson 🎯",
      body: "Read the explanation, run the examples in the Playground, then solve the quiz. When you're done, hit Completed so I can track you.",
    },
  },
  playground: {
    ar: {
      title: "الملعب 💻",
      body: "اكتب أي كود C++ واضغط Run. الترجمة بتحصل على سيرفرات خارجية، فالنتيجة بتظهر في ثواني.",
    },
    en: {
      title: "The playground 💻",
      body: "Write any C++ code and hit Run. Compilation happens on external servers — results appear in seconds.",
    },
  },
  elzero: {
    ar: {
      title: "فيديوهات الزيرو 🎬",
      body: "78 فيديو من مسار Fundamentals with C++ للزيرو. لكل فيديو ملخص + Quiz + أهم المصطلحات.",
    },
    en: {
      title: "ElZero videos 🎬",
      body: "78 videos from the ElZero Fundamentals with C++ playlist. Each has a summary + quiz + key terminology.",
    },
  },
  english: {
    ar: {
      title: "قسم الإنجليزية 🎧",
      body: "دورات مجانية من قناة @ZAmericanEnglish: ملخص عربي، فلاش كارد للمصطلحات، تمارين ومحرك نطق — والموضع بيتحفظ تلقائيًا.",
    },
    en: {
      title: "English section 🎧",
      body: "Free courses from @ZAmericanEnglish: Arabic summaries, key-term flashcards, drills and a pronunciation tab — and your position is saved automatically.",
    },
  },
  linux: {
    ar: {
      title: "قسم لينكس 🐧",
      body: "دورة Linuxtopia العربية «تعلم نظام اللينكس 2021»: ملخص عربي وأسئلة لكل فيديو، فلاش كارد، ومعمل طرفية محاكاة — تجرّب كل حاجة بأمان من غير ما تبوظ جهازك.",
    },
    en: {
      title: "Linux section 🐧",
      body: "Linuxtopia's Arabic Linux course (2021): Arabic summaries, flashcards, quizzes and a fully simulated browser terminal — nothing real ever runs, you learn by understanding.",
    },
  },
  dashboard: {
    ar: {
      title: "الداش بورد 📊",
      body: "هنا بتتابع تقدمك: الدروس المكتملة، الفاضل، وقت الـ Focus، والـ Streak بتاعك.",
    },
    en: {
      title: "The dashboard 📊",
      body: "Track your progress: completed lessons, what's left, focus time, and your streak.",
    },
  },
  progress: {
    ar: {
      title: "تفاصيل تقدمك 📈",
      body: "هنا نسبة إكمال كل مرحلة وكورس. لو عايز تراجع حاجة، من هنا بتعرف أنهي درس لسه ناقص.",
    },
    en: {
      title: "Your progress 📈",
      body: "Completion percentage per stage and course. See exactly which lesson you haven't done yet.",
    },
  },
  projects: {
    ar: {
      title: "المشاريع 🛠️",
      body: "مشاريع حقيقية تبنيها بنفسك — من آلة حاسبة لحد نواة نظام تشغيل. أحسن طريقة تتأكد إنك فاهم.",
    },
    en: {
      title: "Projects 🛠️",
      body: "Real projects you build yourself — from a calculator to an OS kernel. The best way to prove you understand.",
    },
  },
  glossary: {
    ar: {
      title: "قاموس المصطلحات 📖",
      body: "كل كلمة إنجليزي متشرحة بالعربي. لو قابلك مصطلح في الدرس مش فاهمه، ابحث عنه هنا.",
    },
    en: {
      title: "Glossary 📖",
      body: "Every English term explained in Arabic. Met a word you don't know? Search it here.",
    },
  },
  guide: {
    ar: {
      title: "شرح Miku 🎓",
      body: "هنا بشرح لك كل حاجة في المنصة خطوة بخطوة. لو ضايع، ابدأ من هنا.",
    },
    en: {
      title: "Miku's guide 🎓",
      body: "I explain everything in the platform step by step. Lost? Start here.",
    },
  },
  profile: {
    ar: {
      title: "بروفايلك 👤",
      body: "صورتك من GitHub وبياناتك. هنا بتتابع عدد الدروس اللي خلصتها والفيديوهات اللي اتفرجت عليها.",
    },
    en: {
      title: "Your profile 👤",
      body: "Your GitHub picture and details. Track completed lessons and watched videos here.",
    },
  },
  login: {
    ar: {
      title: "تسجيل الدخول 🔑",
      body: "سجّل بحساب GitHub عشان صورتك واسمك يبوا حقيقيين. لو معندكش حساب، تقدر تكمل كـ Guest.",
    },
    en: {
      title: "Sign in 🔑",
      body: "Sign in with GitHub so your name and picture are real. No account? Continue as a guest.",
    },
  },
};

export const POMODORO_MESSAGES: Record<Locale, Record<string, string>> = {
  ar: {
    focusStart: "يلا نبدأ! 25 دقيقة Focus — أنا معاك 🎵",
    focusDone: "أحسنت! 🎉 خلصت جلسة Focus. خد 5 دقايق Break، تستاهلهم.",
    breakStart: "وقت الراحة! 5 دقايق — ابعد عن الشاشة شوية وخد نفس.",
    breakDone: "يلا نرجع! جلسة Focus جديدة — مستقبلك مستني 💪",
    welcomeBack: "كنت مستنيك! متأخرش على المذاكرة 😤",
    longBreakOvertime: "لسه مرتاح؟ راحتك كفاية — رجعتملّي نذاكر علشان مستقبلك 🔥",
    focusOvertime: "لسه مذاكر؟ أنا فخورة بيك! بس خد Break شوية عشان دماغك تريح ⏸️",
  },
  en: {
    focusStart: "Let's go! 25 minutes of focus — I'm with you 🎵",
    focusDone: "Great job! 🎉 Focus session done. Take a 5-minute break, you earned it.",
    breakStart: "Break time! 5 minutes — step away from the screen and breathe.",
    breakDone: "Back to it! Fresh focus session — your future is waiting 💪",
    welcomeBack: "I was waiting for you! Don't slack on studying 😤",
    longBreakOvertime: "Still resting? That's long enough — back to studying for your future 🔥",
    focusOvertime: "Still studying? I'm proud of you! But take a short break so your brain can rest ⏸️",
  },
};

export const ENCOURAGEMENTS: Record<Locale, string[]> = {
  ar: [
    "أنت بتعمل حاجة عظيمة! 🌟",
    "كل سطر كود قرّبك من هدفك.",
    "استمر، أنت أقوى مما تتخيل 💪",
    "المبرمج العظيم بيتعلم كل يوم.",
    "أنا فخورة بيك! 🎉",
    "الصعب بيقوى لما تتعلمه خطوة بخطوة.",
  ],
  en: [
    "You're doing something great! 🌟",
    "Every line of code brings you closer to your goal.",
    "Keep going — you are stronger than you think 💪",
    "Great programmers learn something every day.",
    "I'm proud of you! 🎉",
    "Hard things get easier when you take them one step at a time.",
  ],
};

export function tipForPath(pathname: string, locale: Locale): MikuTip {
  const n = pathname === "" ? "/" : pathname;
  if (n.startsWith("/landing")) return PAGE_TIPS.landing[locale];
  if (n.startsWith("/learn")) return PAGE_TIPS.learn[locale];
  if (n.startsWith("/playground")) return PAGE_TIPS.playground[locale];
  if (n.startsWith("/elzero")) return PAGE_TIPS.elzero[locale];
  if (n.startsWith("/english")) return PAGE_TIPS.english[locale];
  if (n.startsWith("/linux")) return PAGE_TIPS.linux[locale];
  if (n.startsWith("/dashboard")) return PAGE_TIPS.dashboard[locale];
  if (n.startsWith("/progress")) return PAGE_TIPS.progress[locale];
  if (n.startsWith("/projects")) return PAGE_TIPS.projects[locale];
  if (n.startsWith("/glossary")) return PAGE_TIPS.glossary[locale];
  if (n.startsWith("/guide")) return PAGE_TIPS.guide[locale];
  if (n.startsWith("/profile")) return PAGE_TIPS.profile[locale];
  if (n.startsWith("/login")) return PAGE_TIPS.login[locale];
  if (n.startsWith("/curriculum")) return PAGE_TIPS.curriculum[locale];
  if (n === "/" || n === "") return PAGE_TIPS.home[locale];
  return PAGE_TIPS.home[locale];
}
