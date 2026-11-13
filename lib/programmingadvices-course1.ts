/**
 * Programming Advices — Course 1 pilot content (videos #1–#10).
 *
 * All summaries, key terms, hints, explanations and drills are original ETM
 * material written in our own words. The only author-owned data here is the
 * public metadata (video id, published Arabic title, duration, playlist id).
 * No captions exist for these videos, so every lesson ships `reviewed: false`
 * and a visible "not verified against the video" notice in the UI.
 */

import type { PAVideo } from "./programmingadvices-videos.ts";

const PLAYLIST_ID = "PL3X--QIIK-OHgMV2yBz3GLfM5d_5BxOSj";
const watch = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${youtubeId}&list=${PLAYLIST_ID}`;

export const PA_COURSE1_VIDEOS: PAVideo[] = [
  // -------------------------------------------------------------------------
  // 1 — Series intro
  // -------------------------------------------------------------------------
  {
    id: "pa1-01",
    number: 1,
    courseId: "pa-foundations",
    youtubeId: "LWCBg5tb64I",
    title: "البداية: سلسلة اساسيات مهمة لكل مبرمج - المستوى الاول",
    titleEn: "Start here: essential foundations for every programmer — Level 1",
    section: "مقدمة المسار",
    sectionEn: "Track intro",
    youtube: watch("LWCBg5tb64I"),
    duration: "PT4M55S",
    summary:
      "حلقة افتتاحية تمهّد لسلسلة الأساسيات وتشرح لماذا يُبنى تعلّم البرمجة على فهم صحيح للحاسوب قبل كتابة الكود. تعرّفك على أسلوب السلسلة وترتيب دروسها، وتوضح أن الهدف هو تكوين قاعدة قوية تخدم أي لغة برمجة لاحقًا. ابدأ بها ثم تابع الدروس بالترتيب.",
    summaryEn:
      "An opening episode that introduces the foundations series and explains why learning programming should start with a correct understanding of computing before writing code. It presents the series' approach and lesson order, and frames the goal as a strong base that serves any programming language later. Start here, then follow the lessons in order.",
    terms: [
      {
        en: "Programmer",
        ar: "مبرمج",
        example: {
          en: "A programmer turns an idea into instructions a computer can execute.",
          ar: "المبرمج يحوّل الفكرة إلى تعليمات ينفّذها الحاسوب.",
        },
      },
      {
        en: "Foundation",
        ar: "أساس",
        example: {
          en: "A strong foundation makes the next step easier.",
          ar: "الأساس القوي يسهّل الخطوة التالية.",
        },
      },
      {
        en: "Level",
        ar: "مستوى",
        example: {
          en: "This series starts at level one.",
          ar: "تبدأ هذه السلسلة من المستوى الأول.",
        },
      },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "ما الهدف الأساسي من هذه السلسلة؟",
        promptEn: "What is the main goal of this series?",
        options: [
          "بناء أساس قوي قبل تعلم البرمجة",
          "حفظ أوامر لغة واحدة فقط",
          "تعلم التصميم الجرافيكي",
          "إدارة قواعد البيانات",
        ],
        optionsEn: [
          "Build a strong foundation before learning programming",
          "Memorise one language's commands only",
          "Learn graphic design",
          "Manage databases",
        ],
        answer: 0,
        explanation:
          "السلسلة تمهيدية وتضع الأساس الذي يجعل تعلّم أي لغة برمجة أسهل لاحقًا.",
        explanationEn:
          "The series is preparatory and builds the base that makes learning any programming language easier later.",
        hint: "الفكرة تدور حول كلمة «أساس» وليس حول لغة بعينها.",
        hintEn: "The key idea is 'foundation', not one specific language.",
      },
      {
        type: "order",
        prompt: "رتّب خطوات البداية كما تقترح الحلقة:",
        promptEn: "Order the starting steps suggested by the episode:",
        steps: [
          "شاهد المقدمة",
          "افهم الأساسيات",
          "تابع الدروس بالترتيب",
          "طبّق ما تعلمته",
        ],
        stepsEn: [
          "Watch the intro",
          "Understand the basics",
          "Follow the lessons in order",
          "Apply what you learned",
        ],
        explanation:
          "الترتيب المقترح: مشاهدة المقدمة أولًا، ثم فهم الأساس، ثم الالتزام بترتيب الدروس، وأخيرًا التطبيق.",
        explanationEn:
          "The suggested order is: watch the intro, understand the basics, keep the lesson order, then apply what you learned.",
        hint: "ابدأ بالمشاهدة وانتهِ بالتطبيق.",
        hintEn: "Start with watching and finish with practice.",
      },
      {
        type: "fill",
        prompt: "هذه السلسلة موجّهة لكل ______ مهما كانت خبرته.",
        promptEn: "This series is aimed at every ______, whatever their experience.",
        answer: "مبرمج",
        accept: ["programmer"],
        explanation:
          "السلسلة تخاطب المبرمج مهما كان مستواه، لأن الأساس القوي يفيد الجميع.",
        explanationEn:
          "The series addresses programmers at any level because a strong foundation benefits everyone.",
        hint: "الاسم العربي لمن يكتب البرامج.",
        hintEn: "The Arabic word for someone who writes programs.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 2 — Official platform update (public announcement)
  // -------------------------------------------------------------------------
  {
    id: "pa1-02",
    number: 2,
    courseId: "pa-foundations",
    youtubeId: "xzhEzJg5Uao",
    title: "تحديث كورس رقم 1 في المنصة - تابعه من هناك مجاناً",
    titleEn: "Course 1 update on the official platform — follow it there for free",
    section: "تحديث رسمي",
    sectionEn: "Official update",
    youtube: watch("xzhEzJg5Uao"),
    duration: "PT2M41S",
    summary:
      "فيديو قصير يعلن تحديث الكورس الأول على منصة Programming Advices الرسمية ويدعو لمتابعة النسخة المنظّمة هناك مجانًا. لا يقدّم درسًا تقنيًا جديدًا، بل يوضح أن المتابعة انتقلت إلى المنصة الرسمية. في ETM نعرض الفيديوهات العامة عبر يوتيوب ونربط الصفحة الرسمية فقط، دون الوصول إلى أي محتوى يتطلب تسجيل دخول.",
    summaryEn:
      "A short announcement that Course 1 has been updated on the official Programming Advices platform and invites learners to follow the organised version there for free. It does not teach a new technical topic; it simply explains that follow-up has moved to the official platform. ETM only embeds the public YouTube videos and links the official page — it never touches login-only content.",
    terms: [
      {
        en: "Official platform",
        ar: "المنصة الرسمية",
        example: {
          en: "The updated course lives on the official platform.",
          ar: "النسخة المحدّثة من الكورس موجودة على المنصة الرسمية.",
        },
      },
      {
        en: "Course update",
        ar: "تحديث الكورس",
        example: {
          en: "The update points learners to the new course page.",
          ar: "التحديث يوجّه المتعلمين إلى صفحة الكورس الجديدة.",
        },
      },
      {
        en: "Free access",
        ar: "متابعة مجانية",
        example: {
          en: "The announcement says the course can be followed for free.",
          ar: "الإعلان يذكر أن الكورس يمكن متابعته مجانًا.",
        },
      },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "ما موضوع هذا الفيديو؟",
        promptEn: "What is this video about?",
        options: [
          "إعلان تحديث الكورس على المنصة الرسمية",
          "شرح النظام الثنائي",
          "مراجعة الشبكات",
          "حل تمارين الخوارزميات",
        ],
        optionsEn: [
          "Announcing the course update on the official platform",
          "Explaining the binary system",
          "Reviewing computer networks",
          "Solving algorithm exercises",
        ],
        answer: 0,
        explanation:
          "العنوان والوصف يخصّان تحديث الكورس على المنصة، وليس درسًا تقنيًا جديدًا.",
        explanationEn:
          "The title and description are about the course update on the platform, not a new technical lesson.",
        hint: "اقرأ كلمة «تحديث» في العنوان.",
        hintEn: "Look at the word 'update' in the title.",
      },
      {
        type: "mcq",
        prompt: "وفق الفيديو، أين تتابع النسخة المحدّثة من الكورس؟",
        promptEn: "According to the video, where do you follow the updated course?",
        options: [
          "المنصة الرسمية لـ Programming Advices",
          "قناة غير رسمية",
          "ملفات معاد رفعها",
          "منتدى عشوائي",
        ],
        optionsEn: [
          "The official Programming Advices platform",
          "An unofficial channel",
          "Re-uploaded files",
          "A random forum",
        ],
        answer: 0,
        explanation:
          "الفيديو يوجّه إلى المنصة الرسمية؛ وهذا هو المصدر الذي نربطه من ETM.",
        explanationEn:
          "The video points to the official platform, which is the only source ETM links to.",
        hint: "نحن نربط المصدر الرسمي فقط.",
        hintEn: "We link only the official source.",
      },
      {
        type: "match",
        prompt: "طابق كل عنصر بوصفه الصحيح",
        promptEn: "Match each item with the correct description",
        pairs: [
          {
            left: "المنصة الرسمية",
            right: "المصدر الرسمي للكورس",
            rightEn: "The official course source",
          },
          {
            left: "YouTube",
            right: "مكان مشاهدة الفيديوهات العامة",
            rightEn: "Where the public videos are watched",
          },
          {
            left: "ETM",
            right: "منصة مستقلة غير تابعة",
            rightEn: "An independent, non-affiliated platform",
          },
        ],
        explanation:
          "ETM تعرض الفيديوهات العامة وتشير إلى المصدر الرسمي، لكنها لا تمثل القناة ولا تدّعي التبعية لها.",
        explanationEn:
          "ETM embeds the public videos and points to the official source, but it does not represent the channel or claim affiliation.",
        hint: "المصدر الرسمي شيء، والمنصة التي تعرض الفيديو شيء آخر.",
        hintEn: "The official source is one thing; the platform showing the video is another.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 3 — Data / Information / Knowledge / Wisdom
  // -------------------------------------------------------------------------
  {
    id: "pa1-03",
    number: 3,
    courseId: "pa-foundations",
    youtubeId: "qTVRs1wTwho",
    title: "الدرس الاول: الفرق بين البيانات، المعلومات، المعرفة، والحكمة",
    titleEn: "Lesson 1: the difference between data, information, knowledge and wisdom",
    section: "الأساسيات",
    sectionEn: "Foundations",
    youtube: watch("qTVRs1wTwho"),
    duration: "PT8M27S",
    summary:
      "الدرس الأول يفرّق بين أربعة مستويات: البيانات الخام، والمعلومات المنظّمة، والمعرفة الناتجة عن فهم المعلومات، والحكمة التي تعني استخدام المعرفة في القرار الصحيح. يوضح أن القيمة تزداد كلما انتقلنا من مجرد تسجيل الأرقام إلى تفسيرها ثم تطبيقها. أمثلة الدرس تساعدك على تصنيف ما تقابله في الدراسة والعمل.",
    summaryEn:
      "The first lesson distinguishes four levels: raw data, organised information, knowledge built from understanding that information, and wisdom — using knowledge to make a sound decision. It shows that value rises as we move from merely recording numbers to interpreting them and then applying them. The examples help you classify what you meet in study and work.",
    terms: [
      {
        en: "Data",
        ar: "بيانات",
        example: {
          en: "37 is just data until we know what it measures.",
          ar: "الرقم 37 بيانات خام حتى نعرف ما الذي يقيسه.",
        },
      },
      {
        en: "Information",
        ar: "معلومات",
        example: {
          en: "37°C is information: we added context.",
          ar: "37 درجة مئوية معلومات، لأننا أضفنا السياق.",
        },
      },
      {
        en: "Knowledge",
        ar: "معرفة",
        example: {
          en: "Knowledge tells us that this temperature is above normal.",
          ar: "المعرفة تخبرنا أن هذه الحرارة أعلى من الطبيعي.",
        },
      },
      {
        en: "Wisdom",
        ar: "حكمة",
        example: {
          en: "Wisdom decides when to seek medical help.",
          ar: "الحكمة تقرر متى نطلب المساعدة الطبية.",
        },
      },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل مستوى بتعريفه",
        promptEn: "Match each level with its definition",
        pairs: [
          {
            left: "Data",
            right: "أرقام أو رموز خام بلا سياق",
            rightEn: "Raw numbers or symbols without context",
          },
          {
            left: "Information",
            right: "بيانات نُظّمت وأصبح لها معنى",
            rightEn: "Data organised so that it has meaning",
          },
          {
            left: "Knowledge",
            right: "فهم يربط المعلومات بالخبرة",
            rightEn: "Understanding that links information with experience",
          },
          {
            left: "Wisdom",
            right: "استخدام المعرفة لاتخاذ قرار حكيم",
            rightEn: "Using knowledge to make a wise decision",
          },
        ],
        explanation:
          "السلم يبدأ من البيانات الخام وينتهي بالحكمة، وكل مستوى يضيف فهمًا أو قرارًا.",
        explanationEn:
          "The ladder starts from raw data and ends with wisdom; each level adds understanding or decision-making.",
        hint: "المعلومات = بيانات + سياق.",
        hintEn: "Information = data + context.",
      },
      {
        type: "order",
        prompt: "رتّب المستويات من الأدنى إلى الأعلى في سلّم DIKW:",
        promptEn: "Order the levels from lowest to highest in the DIKW ladder:",
        steps: ["Data", "Information", "Knowledge", "Wisdom"],
        explanation:
          "الاختصار DIKW يعني Data ثم Information ثم Knowledge ثم Wisdom.",
        explanationEn:
          "The acronym DIKW stands for Data, then Information, then Knowledge, then Wisdom.",
        hint: "الحرف الأول من كل كلمة هو نفسه الحرف الأول في الترتيب.",
        hintEn: "The first letter of each word is also its position in the order.",
      },
      {
        type: "mcq",
        prompt: "درجة حرارة 37 مكتوبة وحدها دون سياق تُعد مثالًا على:",
        promptEn: "A temperature of 37 written alone without context is an example of:",
        options: ["Data", "Information", "Knowledge", "Wisdom"],
        answer: 0,
        explanation:
          "بلا سياق يبقى الرقم بيانات خام؛ إضافة الوحدة أو المعنى تحوّله إلى معلومات.",
        explanationEn:
          "Without context the number remains raw data; adding a unit or meaning turns it into information.",
        hint: "لا نعرف بعد هل هي درجة حرارة أم رقم مقعد.",
        hintEn: "We do not yet know whether it is a temperature or a seat number.",
      },
      {
        type: "fill",
        prompt: "تحويل البيانات إلى ______ يبدأ بتنظيمها وإعطائها سياقًا.",
        promptEn: "Turning data into ______ starts by organising it and giving it context.",
        answer: "معلومات",
        accept: ["information"],
        explanation:
          "بعد التنظيم يصبح للبيانات معنى، فتتحول إلى معلومات.",
        explanationEn:
          "After organisation the data gains meaning and becomes information.",
        hint: "المستوى الثاني في السلم.",
        hintEn: "The second level of the ladder.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 4 — What is a computer?
  // -------------------------------------------------------------------------
  {
    id: "pa1-04",
    number: 4,
    courseId: "pa-foundations",
    youtubeId: "E6cSCFZGiVg",
    title: "الدرس الثاني: ما هو الكمبيوتر وما هي وظائفة ومكوناته؟",
    titleEn: "Lesson 2: what is a computer, what does it do, and what are its components?",
    section: "مكونات الحاسوب",
    sectionEn: "Computer components",
    youtube: watch("E6cSCFZGiVg"),
    duration: "PT26M49S",
    summary:
      "الدرس الثاني يشرح ما هو الحاسوب وما وظائفه، ثم ينتقل إلى مكوناته المادية والبرمجية. يعرّف وحدات الإدخال والإخراج والذاكرة الأساسية (RAM وROM) والتخزين الثانوي والمعالج المركزي، ويقارن بين السجلات والكاش والذاكرة والقرص من حيث السرعة. يختم بالمعالج الرسومي ودوره في معالجة الصور والرسومات.",
    summaryEn:
      "The second lesson explains what a computer is and what it does, then moves to its hardware and software components. It introduces input/output units, primary memory (RAM and ROM), secondary storage and the CPU, and compares registers, cache, RAM and disk in terms of speed. It closes with the GPU and its role in processing images and graphics.",
    terms: [
      {
        en: "Hardware",
        ar: "عتاد",
        example: {
          en: "The CPU and RAM are hardware you can touch.",
          ar: "المعالج والذاكرة عتاد يمكنك لمسه.",
        },
      },
      {
        en: "Software",
        ar: "برمجيات",
        example: {
          en: "The operating system is software.",
          ar: "نظام التشغيل برمجيات.",
        },
      },
      {
        en: "CPU",
        ar: "وحدة المعالجة المركزية",
        example: {
          en: "The CPU executes instructions.",
          ar: "المعالج المركزي ينفّذ التعليمات.",
        },
      },
      {
        en: "RAM",
        ar: "ذاكرة الوصول العشوائي",
        example: {
          en: "RAM is fast temporary memory.",
          ar: "الذاكرة العشوائية سريعة ومؤقتة.",
        },
      },
      {
        en: "GPU",
        ar: "وحدة معالجة الرسومات",
        example: {
          en: "The GPU handles graphics workloads.",
          ar: "معالج الرسومات يتولى أحمال الرسومات.",
        },
      },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل مكوّن بوظيفته",
        promptEn: "Match each component with its function",
        pairs: [
          {
            left: "CPU",
            right: "ينفّذ التعليمات",
            rightEn: "Executes instructions",
          },
          {
            left: "RAM",
            right: "ذاكرة مؤقتة سريعة",
            rightEn: "Fast temporary memory",
          },
          {
            left: "ROM",
            right: "ذاكرة للقراءة فقط",
            rightEn: "Read-only memory",
          },
          {
            left: "GPU",
            right: "يعالج الرسومات",
            rightEn: "Processes graphics",
          },
        ],
        explanation:
          "كل مكوّن له دور مختلف: المعالج للتنفيذ، والذاكرة للعمل المؤقت، وROM للقراءة، وGPU للرسومات.",
        explanationEn:
          "Each component has a distinct role: CPU for execution, RAM for temporary work, ROM for reading, and GPU for graphics.",
        hint: "ابدأ بالمعالج فهو قلب التنفيذ.",
        hintEn: "Start with the CPU — the execution heart.",
      },
      {
        type: "order",
        prompt: "رتّب المراحل العامة لعمل الحاسوب:",
        promptEn: "Order the general stages of how a computer works:",
        steps: ["إدخال", "معالجة", "تخزين", "إخراج"],
        stepsEn: ["Input", "Processing", "Storage", "Output"],
        explanation:
          "تدخل البيانات، ثم تُعالج، ثم تُخزّن أو تُحفظ، وأخيرًا تظهر نتيجة للمستخدم.",
        explanationEn:
          "Data goes in, is processed, is stored or saved, and finally a result is presented to the user.",
        hint: "أول ما يحدث هو استقبال البيانات.",
        hintEn: "The first thing that happens is receiving data.",
      },
      {
        type: "mcq",
        prompt: "أي مما يلي يُعد مكوّنًا برمجيًا؟",
        promptEn: "Which of the following is a software component?",
        options: ["نظام التشغيل", "المعالج", "الذاكرة", "الشاشة"],
        optionsEn: ["Operating system", "CPU", "RAM", "Monitor"],
        answer: 0,
        explanation:
          "نظام التشغيل برنامج يدير العتاد، أما المعالج والذاكرة والشاشة فمكوّنات مادية.",
        explanationEn:
          "The operating system is software that manages hardware; the CPU, RAM and monitor are physical components.",
        hint: "ابحث عن الشيء الذي لا يمكنك لمسه.",
        hintEn: "Look for the thing you cannot touch.",
      },
      {
        type: "fill",
        prompt: "الوحدة التي تنفّذ التعليمات وتنسّق عمل الحاسوب هي ______.",
        promptEn: "The unit that executes instructions and coordinates the computer is the ______.",
        answer: "CPU",
        accept: ["المعالج", "processor", "central processing unit"],
        explanation:
          "وحدة المعالجة المركزية هي المسؤولة عن تنفيذ التعليمات وتنسيق بقية الوحدات.",
        explanationEn:
          "The central processing unit executes instructions and coordinates the other units.",
        hint: "اختصار من ثلاثة أحرف يبدأ بحرف C.",
        hintEn: "A three-letter abbreviation starting with C.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 5 — Binary system
  // -------------------------------------------------------------------------
  {
    id: "pa1-05",
    number: 5,
    courseId: "pa-foundations",
    youtubeId: "CrA3v6AHTTo",
    title: "الدرس الثالث: النظام الثنائي وتمثيل البيانات في الكمبيوتر",
    titleEn: "Lesson 3: the binary system and how computers represent data",
    section: "أنظمة العد",
    sectionEn: "Number systems",
    youtube: watch("CrA3v6AHTTo"),
    duration: "PT38M28S",
    summary:
      "الدرس الثالث يشرح كيف يمثّل الحاسوب البيانات باستخدام النظام الثنائي. يبدأ من المقارنة بين النظام العشري والثنائي، ثم يعرّف البت والبايت ويوضح التحويل في الاتجاهين وحساب أكبر قيمة في بايت أو بايتين. ينتقل بعد ذلك إلى تمثيل الحروف عبر ASCII وعلاقته بيونيكود، وينتهي بأسئلة وتدريب على تمثيل الأعداد.",
    summaryEn:
      "The third lesson explains how a computer represents data using the binary system. It compares decimal and binary, defines a bit and a byte, shows conversion in both directions, and computes the largest value in one or two bytes. It then moves to representing letters with ASCII and its relationship to Unicode, ending with questions and representation practice.",
    terms: [
      {
        en: "Binary",
        ar: "ثنائي",
        example: {
          en: "Binary uses only 0 and 1.",
          ar: "النظام الثنائي يستخدم 0 و1 فقط.",
        },
      },
      {
        en: "Bit",
        ar: "بت",
        example: {
          en: "One bit stores a single 0 or 1.",
          ar: "البت الواحد يخزّن 0 أو 1 فقط.",
        },
      },
      {
        en: "Byte",
        ar: "بايت",
        example: {
          en: "One byte is eight bits.",
          ar: "البايت الواحد يساوي ثمانية بتات.",
        },
      },
      {
        en: "ASCII",
        ar: "أسكي",
        example: {
          en: "ASCII maps basic Latin letters to numbers.",
          ar: "أسكي يربط الحروف اللاتينية الأساسية بأرقام.",
        },
      },
      {
        en: "Unicode",
        ar: "يونيكود",
        example: {
          en: "Unicode covers Arabic and many other scripts.",
          ar: "يونيكود يغطي العربية وكتابات أخرى كثيرة.",
        },
      },
    ],
    practice: [
      {
        type: "fill",
        prompt: "حوّل العدد العشري 13 إلى النظام الثنائي.",
        promptEn: "Convert the decimal number 13 to binary.",
        answer: "1101",
        accept: ["0b1101"],
        explanation:
          "13 = 8 + 4 + 1، لذلك البتات المضبوطة هي 8 و4 و1، والناتج 1101.",
        explanationEn:
          "13 = 8 + 4 + 1, so the set bits are 8, 4 and 1, giving 1101.",
        hint: "اقسم على 2 واجمع البواقي من الأسفل إلى الأعلى.",
        hintEn: "Divide by 2 repeatedly and read the remainders bottom-up.",
      },
      {
        type: "fill",
        prompt: "حوّل العدد الثنائي 1011₂ إلى النظام العشري.",
        promptEn: "Convert the binary number 1011₂ to decimal.",
        answer: "11",
        explanation:
          "1011 = 8 + 0 + 2 + 1 = 11.",
        explanationEn:
          "1011 = 8 + 0 + 2 + 1 = 11.",
        hint: "اجمع قوى 2 عند البتات التي قيمتها 1.",
        hintEn: "Add the powers of 2 where the bit is 1.",
      },
      {
        type: "mcq",
        prompt: "كم بتًا في البايت الواحد؟",
        promptEn: "How many bits are in one byte?",
        options: ["8", "4", "16", "2"],
        answer: 0,
        explanation:
          "البايت الواحد يتكوّن من ثمانية بتات، وهو وحدة شائعة لتمثيل البيانات.",
        explanationEn:
          "One byte consists of eight bits and is a common unit for representing data.",
        hint: "الرقم أكبر من أربعة وأصغر من ستة عشر.",
        hintEn: "The number is greater than four and less than sixteen.",
      },
      {
        type: "mcq",
        prompt: "أي ترميز صُمم أصلًا للحروف اللاتينية الأساسية ويستخدم بايتًا واحدًا في نسخته الأساسية؟",
        promptEn: "Which encoding was designed for basic Latin letters and uses one byte in its basic form?",
        options: ["ASCII", "Unicode", "UTF-16", "UTF-32"],
        answer: 0,
        explanation:
          "ASCII يغطي الحروف اللاتينية الأساسية والأرقام، بينما Unicode أوسع ويشمل العربية وغيرها.",
        explanationEn:
          "ASCII covers basic Latin letters and digits, while Unicode is broader and includes Arabic and other scripts.",
        hint: "اسم مكوّن من خمسة أحرف إنجليزية.",
        hintEn: "A five-letter English acronym.",
      },
      {
        type: "fill",
        prompt: "أكبر قيمة يمكن تمثيلها بـ 8 بتات غير موقّعة هي ______.",
        promptEn: "The largest value representable with 8 unsigned bits is ______.",
        answer: "255",
        explanation:
          "أكبر قيمة = 2^8 − 1 = 255، لأن البتات الثمانية كلها تساوي 1.",
        explanationEn:
          "The largest value is 2^8 − 1 = 255 because all eight bits are 1.",
        hint: "استخدم الصيغة 2^8 − 1.",
        hintEn: "Use the formula 2^8 − 1.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 6 — Speeds and measurement units
  // -------------------------------------------------------------------------
  {
    id: "pa1-06",
    number: 6,
    courseId: "pa-foundations",
    youtubeId: "FCNr5cj8O2E",
    title: "الدرس الرابع: السرعات ووحدات القياس في الكمبيوتر",
    titleEn: "Lesson 4: speeds and measurement units in computing",
    section: "وحدات القياس",
    sectionEn: "Measurement units",
    youtube: watch("FCNr5cj8O2E"),
    duration: "PT24M5S",
    summary:
      "الدرس الرابع يتناول وحدات قياس الذاكرة والسرعة في الحاسوب. يشرح العلاقات بين البت والبايت والكيلوبايت والميجابايت والجيجابايت، ثم ينتقل إلى سرعة المعالج ووحدات التردد مثل هرتز وكيلوهرتز وميجاهرتز وجيجاهرتز. يقارن أيضًا بين السجلات والكاش والذاكرة والقرص من حيث سرعة الوصول، ويوضح الفرق بين معمارية 32 بت و64 بت.",
    summaryEn:
      "The fourth lesson covers memory and speed units in computing. It explains the relationships between bit, byte, kilobyte, megabyte and gigabyte, then moves to CPU speed and frequency units such as hertz, kilohertz, megahertz and gigahertz. It also compares registers, cache, RAM and disk access speeds and explains the difference between 32-bit and 64-bit architectures.",
    terms: [
      {
        en: "Hertz",
        ar: "هرتز",
        example: {
          en: "Hertz measures cycles per second.",
          ar: "الهرتز يقيس عدد الدورات في الثانية.",
        },
      },
      {
        en: "Clock speed",
        ar: "سرعة الساعة",
        example: {
          en: "A higher clock speed means more cycles per second.",
          ar: "سرعة ساعة أعلى تعني دورات أكثر في الثانية.",
        },
      },
      {
        en: "Kilobyte",
        ar: "كيلوبايت",
        example: {
          en: "One kilobyte is 1024 bytes in the binary convention.",
          ar: "الكيلوبايت يساوي 1024 بايت في العُرف الثنائي.",
        },
      },
      {
        en: "Megabyte",
        ar: "ميجابايت",
        example: {
          en: "One megabyte is 1024 kilobytes.",
          ar: "الميجابايت يساوي 1024 كيلوبايت.",
        },
      },
      {
        en: "Gigabyte",
        ar: "جيجابايت",
        example: {
          en: "One gigabyte is 1024 megabytes.",
          ar: "الجيجابايت يساوي 1024 ميجابايت.",
        },
      },
    ],
    practice: [
      {
        type: "fill",
        prompt: "1 KB = ______ بايت (وفق العُرف الثنائي الشائع).",
        promptEn: "1 KB = ______ bytes (in the common binary convention).",
        answer: "1024",
        explanation:
          "في العُرف الثنائي 1 KB = 2^10 = 1024 بايت.",
        explanationEn:
          "In the binary convention, 1 KB = 2^10 = 1024 bytes.",
        hint: "إنها قوة للعدد 2.",
        hintEn: "It is a power of 2.",
      },
      {
        type: "fill",
        prompt: "1 GHz = ______ MHz.",
        promptEn: "1 GHz = ______ MHz.",
        answer: "1000",
        explanation:
          "كل جيجاهرتز يساوي 1000 ميجاهرتز، لأن البادئة giga تعني ألف مليون دورة.",
        explanationEn:
          "One gigahertz equals 1000 megahertz because the giga prefix means one billion cycles.",
        hint: "الفرق بين البادئتين هو 1000.",
        hintEn: "The difference between the two prefixes is 1000.",
      },
      {
        type: "mcq",
        prompt: "ما وحدة قياس تردد المعالج؟",
        promptEn: "What is the unit for CPU frequency?",
        options: ["Hertz", "Byte", "Bit", "Pixel"],
        answer: 0,
        explanation:
          "التردد يُقاس بالهرتز ومضاعفاته، والباقي وحدات بيانات أو صور.",
        explanationEn:
          "Frequency is measured in hertz and its multiples; the others are data or image units.",
        hint: "ابحث عن وحدة «الدورات في الثانية».",
        hintEn: "Look for the 'cycles per second' unit.",
      },
      {
        type: "order",
        prompt: "رتّب وحدات التخزين من الأصغر إلى الأكبر:",
        promptEn: "Order the storage units from smallest to largest:",
        steps: ["Bit", "Byte", "KB", "MB", "GB"],
        explanation:
          "البت أصغر وحدة، ثم البايت، ثم الكيلو والميجا والجيجا، وكل خطوة تساوي 1024 في العُرف الثنائي.",
        explanationEn:
          "A bit is the smallest unit, then a byte, then kilo, mega and giga; each step is 1024 in the binary convention.",
        hint: "ابدأ بالبت وانتهِ بالجيجابايت.",
        hintEn: "Start with bit and end with gigabyte.",
      },
      {
        type: "mcq",
        prompt: "أي أنواع الذاكرة التالية أسرع عادة في الوصول إلى المعالج؟",
        promptEn: "Which of these memory types is usually fastest for the CPU to access?",
        options: ["Registers", "RAM", "HDD", "SSD"],
        answer: 0,
        explanation:
          "السجلات داخل المعالج نفسه، لذلك هي الأسرع، ثم الكاش، ثم RAM، ثم التخزين.",
        explanationEn:
          "Registers live inside the CPU itself, so they are fastest, followed by cache, RAM, then storage.",
        hint: "أقرب ذاكرة إلى المعالج.",
        hintEn: "The memory closest to the CPU.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 7 — Hexadecimal (part 1)
  // -------------------------------------------------------------------------
  {
    id: "pa1-07",
    number: 7,
    courseId: "pa-foundations",
    youtubeId: "lGA_3kDhdZM",
    title: "الدرس الخامس: النظام السادس عشر في الكومبيوتر",
    titleEn: "Lesson 5: the hexadecimal system in computing",
    section: "أنظمة العد",
    sectionEn: "Number systems",
    youtube: watch("lGA_3kDhdZM"),
    duration: "PT29M28S",
    summary:
      "الدرس الخامس يقدّم النظام السادس عشر (Hexadecimal) كأحد أنظمة العد المستخدمة بكثرة في الحاسوب. يشرح الرموز من 0 إلى 9 ثم A إلى F، ويوضح العلاقة بين الرقم السادس عشر وأربع بتات، لأن كل رقم ست عشري يقابل نبلًا واحدًا. التطبيق على التحويل المباشر بين النظامين يأتي في الدرس السابع.",
    summaryEn:
      "The fifth lesson introduces hexadecimal, one of the number systems used heavily in computing. It explains the digits 0 to 9 and A to F and the relationship between one hexadecimal digit and four bits, since each hex digit maps to a single nibble. Direct conversion between hex and binary is practised in Lesson 7.",
    terms: [
      {
        en: "Hexadecimal",
        ar: "ست عشري",
        example: {
          en: "Hexadecimal uses sixteen symbols.",
          ar: "النظام الست عشري يستخدم ستة عشر رمزًا.",
        },
      },
      {
        en: "Base-16",
        ar: "الأساس 16",
        example: {
          en: "Base-16 means each position is a power of sixteen.",
          ar: "الأساس 16 يعني أن كل منزلة قوة للعدد ستة عشر.",
        },
      },
      {
        en: "Hex digit",
        ar: "رقم ست عشري",
        example: {
          en: "A, B and F are hex digits.",
          ar: "A وB وF أرقام ست عشرية.",
        },
      },
      {
        en: "Nibble",
        ar: "نبل",
        example: {
          en: "One nibble is four bits.",
          ar: "النبل الواحد يساوي أربع بتات.",
        },
      },
    ],
    practice: [
      {
        type: "fill",
        prompt: "حوّل العدد العشري 26 إلى النظام الست عشري.",
        promptEn: "Convert the decimal number 26 to hexadecimal.",
        answer: "1A",
        accept: ["0x1A", "1a", "0x1a"],
        explanation:
          "26 = 16 + 10، والرقم 10 يُكتب A، لذلك الناتج 1A.",
        explanationEn:
          "26 = 16 + 10, and 10 is written A, so the result is 1A.",
        hint: "اقسم على 16: لديك منزلة واحدة متبقية ثم الباقي.",
        hintEn: "Divide by 16: one sixteen and a remainder.",
      },
      {
        type: "fill",
        prompt: "حوّل العدد الست عشري 0xFF إلى النظام العشري.",
        promptEn: "Convert the hexadecimal number 0xFF to decimal.",
        answer: "255",
        explanation:
          "F = 15، لذلك 0xFF = 15×16 + 15 = 255.",
        explanationEn:
          "F = 15, so 0xFF = 15×16 + 15 = 255.",
        hint: "كل F تساوي 15.",
        hintEn: "Each F equals 15.",
      },
      {
        type: "mcq",
        prompt: "ما قيمة الرمز F في النظام الست عشري؟",
        promptEn: "What is the value of the hex digit F?",
        options: ["15", "16", "10", "5"],
        answer: 0,
        explanation:
          "الرموز بعد 9 هي A=10 وB=11 وC=12 وD=13 وE=14 وF=15.",
        explanationEn:
          "After 9 come A=10, B=11, C=12, D=13, E=14 and F=15.",
        hint: "الرمز الأخير قبل العودة إلى منزلة جديدة.",
        hintEn: "The last symbol before a new place value starts.",
      },
      {
        type: "match",
        prompt: "طابق كل رمز ست عشري بقيمته العشرية",
        promptEn: "Match each hex digit with its decimal value",
        pairs: [
          { left: "A", right: "10" },
          { left: "B", right: "11" },
          { left: "C", right: "12" },
          { left: "F", right: "15" },
        ],
        explanation:
          "بعد الرقم 9 ننتقل إلى الحروف: A=10 حتى F=15.",
        explanationEn:
          "After 9 we move to letters: A=10 through F=15.",
        hint: "A هي الأولى بعد 9.",
        hintEn: "A is the first symbol after 9.",
      },
      {
        type: "mcq",
        prompt: "كم بتًا يقابل الرقم الست عشري الواحد؟",
        promptEn: "How many bits does one hexadecimal digit represent?",
        options: ["4", "8", "2", "16"],
        answer: 0,
        explanation:
          "كل رقم ست عشري يمثل نبلًا واحدًا، والنبل يساوي أربع بتات.",
        explanationEn:
          "Each hex digit represents one nibble, and a nibble is four bits.",
        hint: "الرقم الست عشري يغطي 16 احتمالًا، و2^4 = 16.",
        hintEn: "A hex digit covers 16 possibilities, and 2^4 = 16.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 8 — Byte anatomy
  // -------------------------------------------------------------------------
  {
    id: "pa1-08",
    number: 8,
    courseId: "pa-foundations",
    youtubeId: "bBbPobqouys",
    title: "الدرس السادس: اجزاء البايت ومصطلحاتها",
    titleEn: "Lesson 6: the parts of a byte and their terms",
    section: "أجزاء البايت",
    sectionEn: "Byte anatomy",
    youtube: watch("bBbPobqouys"),
    duration: "PT5M46S",
    summary:
      "درس قصير يركّز على مصطلحات أجزاء البايت: البت، والكرمب (بتان)، والنبل (أربع بتات)، والبايت (ثماني بتات). يوضح كم جزءًا من كل نوع يدخل في البايت، ثم يشرح النبل الأعلى والنبل الأدنى، وأخيرًا البت الأقل أهمية (LSB) والبت الأكثر أهمية (MSB) وقيمتهما.",
    summaryEn:
      "A short lesson focused on byte terminology: the bit, the crumb (two bits), the nibble (four bits) and the byte (eight bits). It shows how many of each fit into a byte, explains the upper and lower nibbles, and finishes with the least significant bit (LSB) and most significant bit (MSB) and their values.",
    terms: [
      {
        en: "Bit",
        ar: "بت",
        example: {
          en: "A bit is a single binary digit.",
          ar: "البت هو رقم ثنائي واحد.",
        },
      },
      {
        en: "Crumb",
        ar: "كرمب",
        example: {
          en: "A crumb is two bits.",
          ar: "الكرمب يساوي بتين.",
        },
      },
      {
        en: "Nibble",
        ar: "نبل",
        example: {
          en: "A nibble is four bits.",
          ar: "النبل يساوي أربع بتات.",
        },
      },
      {
        en: "LSB",
        ar: "البت الأقل أهمية",
        example: {
          en: "The LSB carries the smallest place value.",
          ar: "البت الأقل أهمية يحمل أصغر قيمة منزلة.",
        },
      },
      {
        en: "MSB",
        ar: "البت الأكثر أهمية",
        example: {
          en: "The MSB carries the largest place value.",
          ar: "البت الأكثر أهمية يحمل أكبر قيمة منزلة.",
        },
      },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "كم بتًا في النبل (Nibble)؟",
        promptEn: "How many bits are in a nibble?",
        options: ["4", "2", "8", "16"],
        answer: 0,
        explanation:
          "النبل أربع بتات، والكرمب بتان، والبايت ثماني بتات.",
        explanationEn:
          "A nibble is four bits, a crumb is two bits, and a byte is eight bits.",
        hint: "النبل نصف بايت.",
        hintEn: "A nibble is half a byte.",
      },
      {
        type: "fill",
        prompt: "البايت الواحد يساوي ______ بت.",
        promptEn: "One byte equals ______ bits.",
        answer: "8",
        explanation:
          "البايت ثماني بتات، وهو أساس تمثيل البيانات في الحاسوب.",
        explanationEn:
          "A byte is eight bits and is a basic unit of data representation.",
        hint: "عدد أجزاء البايت من النبل يساوي اثنين.",
        hintEn: "A byte contains two nibbles.",
      },
      {
        type: "match",
        prompt: "طابق كل وحدة بعدد بتاتها",
        promptEn: "Match each unit with its number of bits",
        pairs: [
          { left: "Crumb", right: "2" },
          { left: "Nibble", right: "4" },
          { left: "Byte", right: "8" },
        ],
        explanation:
          "الكرمب بتان، والنبل أربع، والبايت ثماني، وكل مستوى يضاعف ما قبله.",
        explanationEn:
          "A crumb is 2 bits, a nibble is 4, and a byte is 8; each level doubles the previous one.",
        hint: "كل وحدة تساوي ضعف الوحدة الأصغر منها.",
        hintEn: "Each unit doubles the smaller one.",
      },
      {
        type: "mcq",
        prompt: "أي بت يحمل أقل قيمة في العدد؟",
        promptEn: "Which bit carries the smallest value in a number?",
        options: ["LSB", "MSB", "Nibble", "Crumb"],
        answer: 0,
        explanation:
          "LSB هو البت الأقل أهمية ويحمل قيمة 1، بينما MSB يحمل أكبر قيمة منزلة.",
        explanationEn:
          "The LSB is the least significant bit and carries value 1, while the MSB carries the largest place value.",
        hint: "اختصار Least Significant Bit.",
        hintEn: "It stands for Least Significant Bit.",
      },
      {
        type: "order",
        prompt: "رتّب الوحدات من الأصغر إلى الأكبر:",
        promptEn: "Order the units from smallest to largest:",
        steps: ["Bit", "Crumb", "Nibble", "Byte"],
        explanation:
          "البت ثم الكرمب (2) ثم النبل (4) ثم البايت (8).",
        explanationEn:
          "Bit, then crumb (2), then nibble (4), then byte (8).",
        hint: "ابدأ بالوحدة التي قيمتها 0 أو 1.",
        hintEn: "Start with the unit that stores a single 0 or 1.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 9 — Hexadecimal (part 2)
  // -------------------------------------------------------------------------
  {
    id: "pa1-09",
    number: 9,
    courseId: "pa-foundations",
    youtubeId: "el2mi4khoJg",
    title: "الدرس السابع: النظام السادس عشر الجزء الثاني",
    titleEn: "Lesson 7: the hexadecimal system — part 2",
    section: "أنظمة العد",
    sectionEn: "Number systems",
    youtube: watch("el2mi4khoJg"),
    duration: "PT8M44S",
    summary:
      "الجزء الثاني من درس النظام السادس عشر ينتقل إلى التحويل المباشر بين الثنائي والست عشري. يوضح أن كل رقم ست عشري يقابل أربع بتات، لذلك يمكن التحويل بتجميع البتات في مجموعات رباعية أو بتفكيك كل رقم ست عشري إلى أربع بتات. ينتهي بتمارين قصيرة وحل لها.",
    summaryEn:
      "Part two of the hexadecimal lesson moves to direct conversion between binary and hex. It shows that each hex digit maps to four bits, so conversion can be done by grouping bits in fours or by expanding each hex digit into four bits. It ends with short exercises and their solutions.",
    terms: [
      {
        en: "Direct conversion",
        ar: "تحويل مباشر",
        example: {
          en: "We can convert hex to binary directly, digit by digit.",
          ar: "يمكننا التحويل من الست عشري إلى الثنائي مباشرة، رقمًا برقم.",
        },
      },
      {
        en: "Grouping",
        ar: "تجميع",
        example: {
          en: "Group the bits in fours before writing the hex digits.",
          ar: "جمّع البتات في مجموعات رباعية قبل كتابة الأرقام الست عشرية.",
        },
      },
      {
        en: "Hex prefix",
        ar: "بادئة ست عشرية",
        example: {
          en: "The 0x prefix marks a hexadecimal literal in many languages.",
          ar: "البادئة 0x تدل على قيمة ست عشرية في كثير من اللغات.",
        },
      },
      {
        en: "Nibble",
        ar: "نبل",
        example: {
          en: "Each nibble becomes one hex digit.",
          ar: "كل نبل يتحول إلى رقم ست عشري واحد.",
        },
      },
    ],
    practice: [
      {
        type: "fill",
        prompt: "حوّل العدد 0x2F إلى النظام الثنائي (ثماني بتات).",
        promptEn: "Convert 0x2F to binary (eight bits).",
        answer: "00101111",
        accept: ["0b00101111"],
        explanation:
          "2 = 0010 وF = 1111، وبجمعهما نحصل على 00101111.",
        explanationEn:
          "2 = 0010 and F = 1111; joining them gives 00101111.",
        hint: "حوّل كل رقم ست عشري إلى أربع بتات.",
        hintEn: "Turn each hex digit into four bits.",
      },
      {
        type: "fill",
        prompt: "حوّل الثنائي 1101 0110 إلى النظام الست عشري.",
        promptEn: "Convert the binary 1101 0110 to hexadecimal.",
        answer: "D6",
        accept: ["0xD6", "d6", "0xd6"],
        explanation:
          "1101 = D و0110 = 6، لذلك الناتج D6.",
        explanationEn:
          "1101 = D and 0110 = 6, so the result is D6.",
        hint: "كل مجموعة من أربع بتات تصبح رقمًا ست عشريًا واحدًا.",
        hintEn: "Each four-bit group becomes one hex digit.",
      },
      {
        type: "mcq",
        prompt: "عند التحويل من الثنائي إلى الست عشري، نجمع البتات في مجموعات من:",
        promptEn: "When converting binary to hex, we group the bits in sets of:",
        options: ["4", "8", "2", "16"],
        answer: 0,
        explanation:
          "كل أربع بتات تقابل رقمًا ست عشريًا واحدًا لأن 2^4 = 16.",
        explanationEn:
          "Every four bits correspond to one hex digit because 2^4 = 16.",
        hint: "عدد البتات في النبل.",
        hintEn: "The number of bits in a nibble.",
      },
      {
        type: "order",
        prompt: "رتّب خطوات التحويل من الست عشري إلى الثنائي:",
        promptEn: "Order the steps for converting hex to binary:",
        steps: [
          "خذ كل رقم ست عشري على حدة",
          "حوّل الرقم إلى أربع بتات",
          "حافظ على ترتيب الأرقام",
          "اجمع المجموعات الأربعة",
        ],
        stepsEn: [
          "Take each hex digit separately",
          "Convert the digit to four bits",
          "Keep the digits in order",
          "Join the four-bit groups",
        ],
        explanation:
          "نفكك الرقم إلى أرقام ست عشرية، ثم نحول كل رقم إلى أربع بتات مع الحفاظ على الترتيب، وأخيرًا نجمع.",
        explanationEn:
          "We split the number into hex digits, convert each to four bits while preserving order, then join them.",
        hint: "ابدأ بالتفكيك وانتهِ بالجمع.",
        hintEn: "Start by splitting and finish by joining.",
      },
    ],
    reviewed: false,
  },

  // -------------------------------------------------------------------------
  // 10 — Octal
  // -------------------------------------------------------------------------
  {
    id: "pa1-10",
    number: 10,
    courseId: "pa-foundations",
    youtubeId: "iRiS9Luixrc",
    title: "الدرس الثامن: النظام الثماني في الكمبيوتر",
    titleEn: "Lesson 8: the octal system in computing",
    section: "أنظمة العد",
    sectionEn: "Number systems",
    youtube: watch("iRiS9Luixrc"),
    duration: "PT15M42S",
    summary:
      "الدرس الثامن يقدّم النظام الثماني (Octal) ضمن أنظمة العد في الحاسوب. يشرح لماذا يُستخدم، وبادئته، ثم يوضح التحويل بين الثماني والعشري والثنائي. يعتمد التحويل من الثماني إلى الثنائي على تحويل كل رقم ثماني إلى ثلاث بتات، ثم تجميعها بالترتيب.",
    summaryEn:
      "The eighth lesson introduces the octal system among computing number systems. It explains why it is used, its prefix, and conversion between octal, decimal and binary. Octal-to-binary conversion works by turning each octal digit into three bits and joining them in order.",
    terms: [
      {
        en: "Octal",
        ar: "ثماني",
        example: {
          en: "Octal uses the digits 0 through 7.",
          ar: "النظام الثماني يستخدم الأرقام من 0 إلى 7.",
        },
      },
      {
        en: "Base-8",
        ar: "الأساس 8",
        example: {
          en: "Base-8 means each place is a power of eight.",
          ar: "الأساس 8 يعني أن كل منزلة قوة للعدد ثمانية.",
        },
      },
      {
        en: "Octal prefix",
        ar: "بادئة ثمانية",
        example: {
          en: "The 0o prefix marks an octal literal in many languages.",
          ar: "البادئة 0o تدل على قيمة ثمانية في كثير من اللغات.",
        },
      },
      {
        en: "Grouping",
        ar: "تجميع",
        example: {
          en: "Group bits in threes when converting octal to binary.",
          ar: "جمّع البتات في مجموعات ثلاثية عند التحويل من الثماني إلى الثنائي.",
        },
      },
    ],
    practice: [
      {
        type: "fill",
        prompt: "حوّل العدد الثماني 17₈ إلى النظام العشري.",
        promptEn: "Convert the octal number 17₈ to decimal.",
        answer: "15",
        explanation:
          "1×8 + 7 = 15.",
        explanationEn:
          "1×8 + 7 = 15.",
        hint: "المنزلة الأولى قيمتها 8 والثانية 1.",
        hintEn: "The first place is worth 8 and the second is worth 1.",
      },
      {
        type: "fill",
        prompt: "حوّل العدد العشري 64 إلى النظام الثماني.",
        promptEn: "Convert the decimal number 64 to octal.",
        answer: "100",
        accept: ["0o100"],
        explanation:
          "64 = 1×64 + 0×8 + 0، لذلك الناتج 100.",
        explanationEn:
          "64 = 1×64 + 0×8 + 0, so the result is 100.",
        hint: "64 هي 8^2، لذلك تحتاج منزلة ثالثة.",
        hintEn: "64 is 8^2, so you need a third place.",
      },
      {
        type: "mcq",
        prompt: "ما الأساس الذي يستخدمه النظام الثماني؟",
        promptEn: "What base does the octal system use?",
        options: ["8", "2", "10", "16"],
        answer: 0,
        explanation:
          "النظام الثماني أساسه 8 ويستخدم الأرقام من 0 إلى 7 فقط.",
        explanationEn:
          "Octal has base 8 and uses only the digits 0 through 7.",
        hint: "الاسم نفسه يدل على الأساس.",
        hintEn: "The name itself points to the base.",
      },
      {
        type: "match",
        prompt: "طابق كل عدد ثماني بقيمته العشرية",
        promptEn: "Match each octal number with its decimal value",
        pairs: [
          { left: "0o10", right: "8" },
          { left: "0o17", right: "15" },
          { left: "0o100", right: "64" },
        ],
        explanation:
          "0o10 = 8، و0o17 = 15، و0o100 = 64.",
        explanationEn:
          "0o10 = 8, 0o17 = 15, and 0o100 = 64.",
        hint: "استخدم قوى 8: 1 و8 و64.",
        hintEn: "Use powers of 8: 1, 8 and 64.",
      },
      {
        type: "order",
        prompt: "رتّب خطوات التحويل من الثماني إلى الثنائي:",
        promptEn: "Order the steps for converting octal to binary:",
        steps: [
          "حوّل كل رقم ثماني إلى ثلاث بتات",
          "حافظ على ترتيب الأرقام",
          "اجمع المجموعات الثلاثية",
          "تحقق من الناتج",
        ],
        stepsEn: [
          "Convert each octal digit to three bits",
          "Keep the digits in order",
          "Join the three-bit groups",
          "Check the result",
        ],
        explanation:
          "كل رقم ثماني يقابل ثلاث بتات، ثم نجمع المجموعات بالترتيب ونتحقق من الناتج.",
        explanationEn:
          "Each octal digit maps to three bits; join the groups in order and verify the result.",
        hint: "الرقم الثماني يغطي 8 احتمالات، و2^3 = 8.",
        hintEn: "An octal digit covers 8 possibilities, and 2^3 = 8.",
      },
    ],
    reviewed: false,
  },
];
