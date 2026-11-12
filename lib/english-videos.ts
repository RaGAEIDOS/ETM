/**
 * English-track data (Phase 4): videos from the @ZAmericanEnglish channel,
 * embedded (never re-hosted) and summarized in Arabic.
 *
 * HOW THIS GETS POPULATED
 * -----------------------
 * The video list is NOT written by hand. It is produced from the channel's
 * playlists by `scripts/fetch-playlists.mjs`:
 *
 *   YOUTUBE_API_KEY=AIza... node scripts/fetch-playlists.mjs
 *   # or, without a key: yt-dlp --flat-playlist -J <playlist-url>
 *
 * into `out/english-courses.json`, and then each entry is transcribed into
 * `englishVideos` below with a conservative Arabic summary written from the
 * video's title/description. Anything not verified against captions/
 * transcript MUST be committed with `reviewed: false`.
 *
 * NEVER invent video ids, titles or durations. Until the fetch has run,
 * `englishVideos` stays empty and every English route renders its
 * "content sync pending" state instead of fabricated content.
 */

export interface EnglishKeyTerm {
  en: string;
  ar: string;
  example?: { en: string; ar: string };
}

/** Practice items, matched to the course type. Exactly one correct answer each. */
export type EnglishPracticeItem =
  /** Grammar / vocabulary: choose the correct option. */
  | { type: "mcq"; prompt: string; options: string[]; answer: number; explanation?: string }
  /** Vocabulary / grammar: typed fill-in-the-blank. `accept` lists normalized acceptable answers; the first is canonical. */
  | { type: "fill"; prompt: string; answer: string; accept?: string[]; explanation?: string }
  /** Listening: text is read aloud (speechSynthesis, en-US); learner types what they hear. */
  | { type: "dictation"; say: string; answer: string; accept?: string[]; explanation?: string }
  /** Word order: `words` is the display (shuffled) order; `answer` is the correct sentence. */
  | { type: "order"; prompt: string; words: string[]; answer: string; explanation?: string }
  /** Matching pairs, scored as one item (all pairs must match). */
  | { type: "match"; prompt?: string; pairs: { left: string; right: string }[]; explanation?: string };

export interface EnglishVideo {
  /** ETM sequential id ("001", "002", …), stable across course additions. */
  id: string;
  /** Same as id, numeric. */
  number: number;
  /** Matches an EnglishCourse.id below. */
  courseId: string;
  /** The actual YouTube video id (embedded via youtube-nocookie). */
  youtubeId: string;
  /** Arabic title. */
  title: string;
  /** Original English title from the channel. */
  titleEn: string;
  /** Arabic section label. */
  section: string;
  /** English section label. */
  sectionEn: string;
  /** Full watch URL incl. &list= for "watch on YouTube" links. */
  youtube: string;
  /** ISO 8601 duration (e.g. "PT5M47S"), when fetched. */
  duration?: string;
  /** 2-4 sentences, Arabic, own words. Conservative when reviewed: false. */
  summary: string;
  /** 1-5 key terms. */
  terms: EnglishKeyTerm[];
  /** 3-5 practice items. */
  practice: EnglishPracticeItem[];
  /** False when the summary is inferred from title/description only. */
  reviewed: boolean;
}

export interface EnglishCourse {
  id: string;
  /** Arabic title. */
  title: string;
  /** Original channel title. */
  titleEn: string;
  description: string;
  playlistId: string;
  playlistUrl: string;
  color: string;
  icon: "sprout" | "graduation" | "mic" | "volume" | "messages";
}

/** Playlist ids come from the channel's own descriptions (see MASTER_PROMPT Phase 4). */
export const englishCourses: EnglishCourse[] = [
  {
    id: "en-zero",
    title: "الإنجليزية من الصفر — الدورة الكاملة للمبتدئين",
    titleEn: "English from Zero",
    description:
      "المسار الكامل للمبتدئ المطلق من قناة @ZAmericanEnglish: الأساسيات، التحية، الأرقام، الأبجدية، قواعد أساسية ومفردات يومية — مرتبة حسب ترتيب القناة الرسمي.",
    playlistId: "PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    color: "from-emerald-400 to-cyan-500",
    icon: "sprout",
  },
  {
    id: "en-grammar",
    title: "القواعد — أتقن قواعد اللغة الإنجليزية",
    titleEn: "Grammar",
    description:
      "قائمة القواعد الكاملة: الأزمنة، الأسئلة، الأدوات، الأفعال، الأفعال الناقصة وكل ما يمنح جملك بنية كاملة — درسًا درسًا مع تمارين.",
    playlistId: "PLp22-4PivYmLebd3vD0_WfIteVUlSA44G",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmLebd3vD0_WfIteVUlSA44G",
    color: "from-cyan-400 to-blue-500",
    icon: "graduation",
  },
  {
    id: "en-phonetics",
    title: "الأصوات — النطق والأبجدية الصوتية",
    titleEn: "Phonetics",
    description:
      "قائمة الأصوات: الأبجدية الصوتية الدولية، أصوات العلة والساكنة، النبر، والأزواج المتشابهة — أساسية لكل مهارة تحدث بالإنجليزية.",
    playlistId: "PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc",
    color: "from-violet-400 to-fuchsia-500",
    icon: "mic",
  },
  {
    id: "en-listening",
    title: "الاستماع — تدريب فهم المسموع",
    titleEn: "Listening",
    description:
      "قائمة الاستماع: حوارات مسموعة، مقاطع إخبارية وأغاني — الترياق لحاجز «أفهم القراءة لكن لا أفهم السماع».",
    playlistId: "PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ",
    color: "from-amber-400 to-rose-500",
    icon: "volume",
  },
  {
    id: "en-conversation",
    title: "المحادثة — عبارات يومية وطلاقة",
    titleEn: "Conversation",
    description:
      "قائمة المحادثة: عبارات يومية، حوارات أساسية، وإنجليزية وظيفية للمحال والسفر والعمل والحديث القصير.",
    playlistId: "PLp22-4PivYmKp2aC7PI7K0POsf812xLBN",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmKp2aC7PI7K0POsf812xLBN",
    color: "from-cyan-400 to-violet-500",
    icon: "messages",
  },
];

/**
 * Suggested study path, following the order the channel itself recommends
 * (see the channel's study-order video https://youtu.be/9cDYq1cun8o):
 * the beginner course + reading in parallel, then listening + conversation,
 * one grammar lesson per day, then level 2.
 * `en-reading` and `en-listening-2` playlists exist on the channel but are
 * not collected yet — they show as "coming soon" and carry NO invented ids.
 */
export interface EnglishPathStep {
  courseId: string | null;
  title: string;
  titleEn: string;
  description: string;
  /** "now" = available today, "soon" = announced but not collected yet */
  status: "now" | "soon";
}

export const suggestedPath: EnglishPathStep[] = [
  {
    courseId: "en-zero",
    title: "١. دورة المبتدئين — البداية",
    titleEn: "1. English from Zero",
    description: "ابدأ هنا ولا تقفز: كل درس يبني على السابق بالترتيب.",
    status: "now",
  },
  {
    courseId: null,
    title: "٢. القراءة — بالتوازي مع دورة المبتدئين",
    titleEn: "2. Reading (in parallel)",
    description: "نصوص قصيرة كل يوم بالتوازي مع الدورة، لا بعدها. — قائمة القراءة لم تُضف بعد.",
    status: "soon",
  },
  {
    courseId: "en-grammar",
    title: "٣. القواعد — درس واحد يوميًا",
    titleEn: "3. Grammar - one lesson a day",
    description: "ليس درسًا في اليوم الواحد فقط، لكن لا تُكثر: درس واحد ثابت يوميًا.",
    status: "now",
  },
  {
    courseId: "en-listening",
    title: "٤. الاستماع — بعد أساسيات المبتدئين",
    titleEn: "4. Listening",
    description: "ابدأ الاستماع الفعلي بعد أول أسابيع من الدورة الأساسية.",
    status: "now",
  },
  {
    courseId: "en-conversation",
    title: "٥. المحادثة — بالتوازي مع الاستماع",
    titleEn: "5. Conversation (in parallel)",
    description: "استخدم ما تسمعه فورًا في حوارات يومية قصيرة.",
    status: "now",
  },
  {
    courseId: null,
    title: "٦. المستوى الثاني — استماع 2",
    titleEn: "6. Level 2 - Listening 2",
    description: "بعد إنهاء المستوى الأول من الاستماع والمحادثة. — لم تُضف بعد.",
    status: "soon",
  },
];

/**
 * Batch 1 — the first 20 videos of the "English from Zero" playlist
 * (PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ), fetched from the playlists API on
 * 2026-11-12. Video ids, titles and durations are REAL data from the
 * channel metadata — never invented. Summaries are conservative Arabic
 * paraphrases of the title only, so every entry is `reviewed: false` until
 * someone verifies it against the video itself (CHECKPOINT 1).
 * Terms and practice are learning aids built around each video's titled
 * topic; generic episode titles (14–20) get a cautious "basics review" set.
 */
export const englishVideos: EnglishVideo[] = [
  {
    id: "001",
    number: 1,
    courseId: "en-zero",
    youtubeId: "77IK9T45kiU",
    title: "تعلم اللغة الإنجليزية من الصفر للمبتدئين بأفضل طريقة من أكبر قناة في العالم",
    titleEn: "Learn English from zero for beginners — the best method from the world's biggest channel",
    section: "مقدمة الكورس",
    sectionEn: "Course intro",
    youtube: "https://youtu.be/77IK9T45kiU?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT8M36S",
    summary:
      "الحلقة الافتتاحية من كورس الإنجليزية للمبتدئين من الصفر. يشرح أسلوب الكورس وكيف تبدأ التعلم الصحيح من أول يوم، ويمهد لدروس المفردات والنطق التي تليه. ابدأ بها قبل بقية الحلقات.",
    terms: [
      { en: "hello", ar: "مرحبًا", example: { en: "Hello! How are you?", ar: "مرحبًا! كيف حالك؟" } },
      { en: "goodbye", ar: "وداعًا", example: { en: "Goodbye, see you tomorrow.", ar: "وداعًا، أراك غدًا." } },
      { en: "please", ar: "من فضلك", example: { en: "Please help me.", ar: "ساعدني من فضلك." } },
      { en: "thank you", ar: "شكرًا لك", example: { en: "Thank you very much.", ar: "شكرًا جزيلًا." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "ما الترجمة الصحيحة لكلمة «مرحبًا»؟",
        options: ["Hello", "Goodbye", "Please", "Sorry"],
        answer: 0,
        explanation: "Hello تُستخدم للتحية عند اللقاء.",
      },
      {
        type: "fill",
        prompt: "______! How are you? (أهلًا! كيف حالك؟)",
        answer: "Hello",
        accept: ["Hi"],
        explanation: "Hello أو Hi كلتاهما صيحة تحية.",
      },
      {
        type: "order",
        prompt: "رتب الكلمات لتكوين الجملة: «تشرفنا بلقائك»",
        words: ["to", "meet", "you", "Nice"],
        answer: "Nice to meet you",
        explanation: "عبارة التعارف الأساسية عند أول لقاء.",
      },
    ],
    reviewed: false,
  },
  {
    id: "002",
    number: 2,
    courseId: "en-zero",
    youtubeId: "AZZCsweJaiw",
    title: "كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين : تعلم الوظائف باللغة الإنجليزية : الحلقة 2",
    titleEn: "Complete English course from zero: Jobs vocabulary — Episode 2",
    section: "مفردات — الوظائف",
    sectionEn: "Vocabulary — Jobs",
    youtube: "https://youtu.be/AZZCsweJaiw?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT7M57S",
    summary:
      "الحلقة الثانية من كورس المبتدئين ومحورها مفردات الوظائف بالإنجليزية. تقدم أسماء المهن الشائعة مع المعنى بالعربية والنطق، لتكوين أول حصيلة كلمات عن العمل. راجع الكلمات قبل الانتقال للحلقة التالية.",
    terms: [
      { en: "teacher", ar: "معلم", example: { en: "My teacher is very kind.", ar: "معلمي لطيف جدًا." } },
      { en: "doctor", ar: "طبيب", example: { en: "The doctor helps sick people.", ar: "الطبيب يساعد المرضى." } },
      { en: "engineer", ar: "مهندس", example: { en: "She is a software engineer.", ar: "هي مهندسة برمجيات." } },
      { en: "driver", ar: "سائق", example: { en: "The driver works at night.", ar: "السائق يعمل ليلًا." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "What is «معلم» in English?",
        options: ["Teacher", "Doctor", "Engineer", "Driver"],
        answer: 0,
        explanation: "Teacher = معلم.",
      },
      {
        type: "match",
        prompt: "طابق كل وظيفة بمعناها العربي",
        pairs: [
          { left: "teacher", right: "معلم" },
          { left: "doctor", right: "طبيب" },
          { left: "engineer", right: "مهندس" },
        ],
      },
      {
        type: "fill",
        prompt: "My father works in a hospital. He is a ______ . (طبيب)",
        answer: "doctor",
        explanation: "Doctor يعمل في المستشفى ويعالج المرضى.",
      },
    ],
    reviewed: false,
  },
  {
    id: "003",
    number: 3,
    courseId: "en-zero",
    youtubeId: "S_deJPyvtfo",
    title: "كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين كلمات عن العائلة : الحلقة 3",
    titleEn: "Complete English course from zero: Family vocabulary — Episode 3",
    section: "مفردات — العائلة",
    sectionEn: "Vocabulary — Family",
    youtube: "https://youtu.be/S_deJPyvtfo?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT12M18S",
    summary:
      "الحلقة الثالثة ومحورها مفردات العائلة بالإنجليزية. تقدم أفراد العائلة الأساسيين مثل الأم والأب والأخ والأخت مع النطق والمعنى. مفيدة للتعريف بنفسك وعائلتك في المحادثات البسيطة.",
    terms: [
      { en: "family", ar: "عائلة", example: { en: "I love my family.", ar: "أحب عائلتي." } },
      { en: "mother", ar: "أم", example: { en: "My mother cooks dinner.", ar: "أمي تطبخ العشاء." } },
      { en: "father", ar: "أب", example: { en: "My father reads every day.", ar: "أبي يقرأ كل يوم." } },
      { en: "brother", ar: "أخ", example: { en: "This is my brother.", ar: "هذا أخي." } },
      { en: "sister", ar: "أخت", example: { en: "My sister is a student.", ar: "أختي طالبة." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق أفراد العائلة بمعانيها",
        pairs: [
          { left: "family", right: "عائلة" },
          { left: "mother", right: "أم" },
          { left: "father", right: "أب" },
          { left: "brother", right: "أخ" },
        ],
      },
      {
        type: "mcq",
        prompt: "She is my ______ . (أختي)",
        options: ["sister", "brother", "mother", "father"],
        answer: 0,
        explanation: "Sister = أخت.",
      },
      {
        type: "fill",
        prompt: "My ______ and father are my parents. (أمي)",
        answer: "mother",
        explanation: "Mother = أم، وfather = أب، وهما الوالدان.",
      },
    ],
    reviewed: false,
  },
  {
    id: "004",
    number: 4,
    courseId: "en-zero",
    youtubeId: "m8VUaW1b_z8",
    title: "كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين: كلمات المنزل والفصل : الحلقة 4",
    titleEn: "Complete English course from zero: House and classroom vocabulary — Episode 4",
    section: "مفردات — المنزل والفصل",
    sectionEn: "Vocabulary — House & classroom",
    youtube: "https://youtu.be/m8VUaW1b_z8?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT10M57S",
    summary:
      "الحلقة الرابعة وتتناول مفردات المنزل والفصل الدراسي بالإنجليزية. تشمل أسماء الغرف والأشياء اليومية المحيطة بك في البيت والدراسة. اربط كل كلمة بما تراه حولك لتثبيتها.",
    terms: [
      { en: "house", ar: "منزل", example: { en: "My house is near the school.", ar: "منزلي قريب من المدرسة." } },
      { en: "room", ar: "غرفة", example: { en: "This room is clean.", ar: "هذه الغرفة نظيفة." } },
      { en: "kitchen", ar: "مطبخ", example: { en: "We cook in the kitchen.", ar: "نطبخ في المطبخ." } },
      { en: "bedroom", ar: "غرفة نوم", example: { en: "I sleep in my bedroom.", ar: "أنام في غرفة نومي." } },
      { en: "classroom", ar: "فصل دراسي", example: { en: "The classroom is full.", ar: "الفصل ممتلئ." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل كلمة بمعناها",
        pairs: [
          { left: "kitchen", right: "مطبخ" },
          { left: "bedroom", right: "غرفة نوم" },
          { left: "classroom", right: "فصل دراسي" },
        ],
      },
      {
        type: "mcq",
        prompt: "«House» تعني:",
        options: ["منزل", "مدرسة", "مطبخ", "حديقة"],
        answer: 0,
        explanation: "House = منزل.",
      },
      {
        type: "fill",
        prompt: "We cook in the ______ . (المطبخ)",
        answer: "kitchen",
        explanation: "Kitchen = مطبخ.",
      },
    ],
    reviewed: false,
  },
  {
    id: "005",
    number: 5,
    courseId: "en-zero",
    youtubeId: "gBhK2m_CdQc",
    title: "كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين : تكملة كلمات الوظائف : الحلقة 5",
    titleEn: "Complete English course from zero: Jobs vocabulary (continued) — Episode 5",
    section: "مفردات — الوظائف (تكملة)",
    sectionEn: "Vocabulary — Jobs (continued)",
    youtube: "https://youtu.be/gBhK2m_CdQc?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT12M13S",
    summary:
      "الحلقة الخامسة وتكمل مفردات الوظائف التي بدأت في الحلقة الثانية. تضيف مهنًا جديدة وتعيد استخدام الكلمات السابقة في أمثلة قصيرة. راجع الحلقة الثانية قبلها إن نسيت بعض الكلمات.",
    terms: [
      { en: "nurse", ar: "ممرض/ممرضة", example: { en: "The nurse helps the doctor.", ar: "الممرض يساعد الطبيب." } },
      { en: "farmer", ar: "مزارع", example: { en: "The farmer grows vegetables.", ar: "المزارع يزرع الخضروات." } },
      { en: "pilot", ar: "طيار", example: { en: "The pilot flies planes.", ar: "الطيار يقود الطائرات." } },
      { en: "police officer", ar: "ضابط شرطة", example: { en: "The police officer keeps us safe.", ar: "ضابط الشرطة يحمينا." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "Who flies a plane?",
        options: ["A pilot", "A nurse", "A farmer", "A teacher"],
        answer: 0,
        explanation: "Pilot = طيار، وهو من يقود الطائرة.",
      },
      {
        type: "match",
        prompt: "طابق كل وظيفة بمعناها",
        pairs: [
          { left: "nurse", right: "ممرض/ممرضة" },
          { left: "farmer", right: "مزارع" },
          { left: "pilot", right: "طيار" },
        ],
      },
      {
        type: "fill",
        prompt: "A ______ works in a hospital and helps doctors. (ممرضة)",
        answer: "nurse",
        explanation: "Nurse يساعد الأطباء في المستشفى.",
      },
    ],
    reviewed: false,
  },
  {
    id: "006",
    number: 6,
    courseId: "en-zero",
    youtubeId: "Th9S81mblxo",
    title: "تعلم اللغة الإنجليزية للمبتدئين : الدرس السادس : مفردات عن الحيوانات",
    titleEn: "Learn English for beginners — Lesson 6: Animals vocabulary",
    section: "مفردات — الحيوانات",
    sectionEn: "Vocabulary — Animals",
    youtube: "https://youtu.be/Th9S81mblxo?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT8M22S",
    summary:
      "الحلقة السادسة ومحورها مفردات الحيوانات بالإنجليزية. تقدم أسماء حيوانات شائعة مع النطق والمعنى بالعربية. مناسبة لبناء مفردات يومية سهلة التذكر.",
    terms: [
      { en: "cat", ar: "قطة", example: { en: "The cat is sleeping.", ar: "القطة نائمة." } },
      { en: "dog", ar: "كلب", example: { en: "My dog is friendly.", ar: "كلبي ودود." } },
      { en: "horse", ar: "حصان", example: { en: "The horse runs fast.", ar: "الحصان يجري بسرعة." } },
      { en: "bird", ar: "طائر", example: { en: "A bird can fly.", ar: "الطائر يستطيع الطيران." } },
      { en: "fish", ar: "سمكة", example: { en: "The fish lives in water.", ar: "السمكة تعيش في الماء." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل حيوان بمعناه",
        pairs: [
          { left: "cat", right: "قطة" },
          { left: "dog", right: "كلب" },
          { left: "horse", right: "حصان" },
          { left: "bird", right: "طائر" },
        ],
      },
      {
        type: "mcq",
        prompt: "«Fish» تعني:",
        options: ["سمكة", "قطة", "حصان", "كلب"],
        answer: 0,
        explanation: "Fish = سمكة.",
      },
      {
        type: "fill",
        prompt: "A ______ can fly. (طائر)",
        answer: "bird",
        explanation: "Bird = طائر.",
      },
    ],
    reviewed: false,
  },
  {
    id: "007",
    number: 7,
    courseId: "en-zero",
    youtubeId: "gZBAXCRrl_U",
    title: "تعلم الصفات المضادة في اللغة الإنجليزية : كورس تعلم اللغة الانجليزية للمبتدئين من الصفر : ٧",
    titleEn: "Opposite adjectives in English — beginner course from zero: Episode 7",
    section: "مفردات — الصفات المضادة",
    sectionEn: "Vocabulary — Opposite adjectives",
    youtube: "https://youtu.be/gZBAXCRrl_U?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT16M31S",
    summary:
      "الحلقة السابعة وتتناول الصفات المضادة في الإنجليزية. تعلمك أزواجًا مثل كبير/صغير وحار/بارد لتوصف الأشياء بدقة أكبر. استخدمها في جمل قصيرة عن حياتك اليومية.",
    terms: [
      { en: "big", ar: "كبير", example: { en: "This box is big.", ar: "هذا الصندوق كبير." } },
      { en: "small", ar: "صغير", example: { en: "The cat is small.", ar: "القطة صغيرة." } },
      { en: "hot", ar: "حار", example: { en: "The tea is hot.", ar: "الشاي ساخن." } },
      { en: "cold", ar: "بارد", example: { en: "The water is cold.", ar: "الماء بارد." } },
      { en: "new", ar: "جديد", example: { en: "I have a new phone.", ar: "لدي هاتف جديد." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل صفة بعكسها",
        pairs: [
          { left: "big", right: "small" },
          { left: "hot", right: "cold" },
          { left: "new", right: "old" },
          { left: "happy", right: "sad" },
        ],
      },
      {
        type: "mcq",
        prompt: "What is the opposite of «big»?",
        options: ["Small", "Tall", "Long", "Fast"],
        answer: 0,
        explanation: "Big = كبير، وعكسها Small = صغير.",
      },
      {
        type: "fill",
        prompt: "The opposite of «hot» is ______ . (بارد)",
        answer: "cold",
        explanation: "Hot = حار، Cold = بارد.",
      },
    ],
    reviewed: false,
  },
  {
    id: "008",
    number: 8,
    courseId: "en-zero",
    youtubeId: "63Riw1SEDPk",
    title: "تعلم كلمات إنجليزية عن الخضروات : كورس شامل لتعلم الانجليزي من الصفر : ٨",
    titleEn: "English vegetable vocabulary — complete course from zero: Episode 8",
    section: "مفردات — الخضروات",
    sectionEn: "Vocabulary — Vegetables",
    youtube: "https://youtu.be/63Riw1SEDPk?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT11M",
    summary:
      "الحلقة الثامنة ومحورها أسماء الخضروات بالإنجليزية. تقدم كلمات مثل الجزر والطماطم والبطاطس مع النطق والمعنى. يمكنك تطبيقها مباشرة عند التسوق أو الحديث عن الطعام.",
    terms: [
      { en: "carrot", ar: "جزر", example: { en: "I eat a carrot every day.", ar: "آكل جزرًا كل يوم." } },
      { en: "tomato", ar: "طماطم", example: { en: "The tomato is red.", ar: "الطماطم حمراء." } },
      { en: "potato", ar: "بطاطس", example: { en: "We cook potatoes for dinner.", ar: "نطبخ بطاطس للعشاء." } },
      { en: "onion", ar: "بصل", example: { en: "Cut the onion, please.", ar: "قطع البصل من فضلك." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل خضار بمعناه",
        pairs: [
          { left: "carrot", right: "جزر" },
          { left: "tomato", right: "طماطم" },
          { left: "potato", right: "بطاطس" },
        ],
      },
      {
        type: "mcq",
        prompt: "«Onion» تعني:",
        options: ["بصل", "جزر", "طماطم", "بطاطس"],
        answer: 0,
        explanation: "Onion = بصل.",
      },
      {
        type: "fill",
        prompt: "A ______ is long and orange. (جزر)",
        answer: "carrot",
        explanation: "Carrot = جزر، وهو طويل وبرتقالي اللون.",
      },
    ],
    reviewed: false,
  },
  {
    id: "009",
    number: 9,
    courseId: "en-zero",
    youtubeId: "pI3CrFMsduY",
    title: "تعلم الأرقام الإنجليزية : كورس تعليم اللغة الإنجليزية للمبتدئين من الصفر : ٩",
    titleEn: "English numbers — English course for beginners from zero: Episode 9",
    section: "مفردات — الأرقام",
    sectionEn: "Vocabulary — Numbers",
    youtube: "https://youtu.be/pI3CrFMsduY?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT14M3S",
    summary:
      "الحلقة التاسعة وتتناول الأرقام الإنجليزية. تساعدك على العد واستخدام الأرقام في الأسعار والأعمار والوقت. تدرب على العد بصوت عالٍ.",
    terms: [
      { en: "one", ar: "واحد", example: { en: "I have one brother.", ar: "لدي أخ واحد." } },
      { en: "two", ar: "اثنان", example: { en: "She has two cats.", ar: "لديها قطتان." } },
      { en: "three", ar: "ثلاثة", example: { en: "There are three books.", ar: "هناك ثلاثة كتب." } },
      { en: "ten", ar: "عشرة", example: { en: "Count to ten.", ar: "عد إلى عشرة." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "What is 7 in English?",
        options: ["Seven", "Six", "Eight", "Nine"],
        answer: 0,
        explanation: "Seven = سبعة.",
      },
      {
        type: "fill",
        prompt: "Three + four = ______ .",
        answer: "seven",
        explanation: "3 + 4 = 7، أي Seven.",
      },
      {
        type: "order",
        prompt: "رتب الكلمات لتكوين الجملة: «لدي أخوان»",
        words: ["brothers", "have", "I", "two"],
        answer: "I have two brothers",
        explanation: "I have two brothers = لدي أخوان.",
      },
    ],
    reviewed: false,
  },
  {
    id: "010",
    number: 10,
    courseId: "en-zero",
    youtubeId: "q_bAo_n0pDU",
    title: "مفردات إنجليزية عن الوقت — الحلقة 10",
    titleEn: "English Vocabulary for Time: English Learning Course from Scratch: 10",
    section: "مفردات — الوقت",
    sectionEn: "Vocabulary — Time",
    youtube: "https://youtu.be/q_bAo_n0pDU?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT13M49S",
    summary:
      "الحلقة العاشرة ومحورها مفردات الوقت بالإنجليزية. تعلمك كلمات مثل يوم وأسبوع وشهر وسنة وكيف تستخدمها في جمل بسيطة. هذه المفردات أساسية لوصف روتينك اليومي.",
    terms: [
      { en: "day", ar: "يوم", example: { en: "Have a nice day!", ar: "أتمنى لك يومًا سعيدًا!" } },
      { en: "week", ar: "أسبوع", example: { en: "I study every week.", ar: "أدرس كل أسبوع." } },
      { en: "month", ar: "شهر", example: { en: "This month is busy.", ar: "هذا الشهر مزدحم." } },
      { en: "year", ar: "سنة", example: { en: "Happy new year!", ar: "سنة جديدة سعيدة!" } },
      { en: "hour", ar: "ساعة", example: { en: "I read for one hour.", ar: "أقرأ لمدة ساعة." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل كلمة عن الوقت بمعناها",
        pairs: [
          { left: "day", right: "يوم" },
          { left: "week", right: "أسبوع" },
          { left: "month", right: "شهر" },
          { left: "year", right: "سنة" },
        ],
      },
      {
        type: "mcq",
        prompt: "How many months are in a year?",
        options: ["12", "10", "24", "7"],
        answer: 0,
        explanation: "السنة بها 12 شهرًا.",
      },
      {
        type: "fill",
        prompt: "There are seven days in a ______ . (أسبوع)",
        answer: "week",
        explanation: "Week = أسبوع، وفيه سبعة أيام.",
      },
    ],
    reviewed: false,
  },
  {
    id: "011",
    number: 11,
    courseId: "en-zero",
    youtubeId: "HIz-rb0lMAY",
    title: "تعلم كلمات انجليزية عن التاريخ : كورس تعليم اللغة الانجليزية للمبتدئين من الصفر : ١١",
    titleEn: "English vocabulary for dates — English course for beginners from zero: Episode 11",
    section: "مفردات — التاريخ والتواريخ",
    sectionEn: "Vocabulary — Dates",
    youtube: "https://youtu.be/HIz-rb0lMAY?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT13M29S",
    summary:
      "الحلقة الحادية عشرة وتتناول مفردات التاريخ والتواريخ بالإنجليزية. تقدم كلمات مثل تاريخ وتقويم واليوم وأمس وغدًا ضمن سياق يومي. راجع أسماء الأيام إن لم تكن تحفظها.",
    terms: [
      { en: "date", ar: "تاريخ", example: { en: "What is today's date?", ar: "ما تاريخ اليوم؟" } },
      { en: "today", ar: "اليوم", example: { en: "Today is Monday.", ar: "اليوم هو الاثنين." } },
      { en: "yesterday", ar: "أمس", example: { en: "Yesterday was Sunday.", ar: "أمس كان الأحد." } },
      { en: "tomorrow", ar: "غدًا", example: { en: "See you tomorrow.", ar: "أراك غدًا." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "«Tomorrow» تعني:",
        options: ["غدًا", "أمس", "اليوم", "الأسبوع"],
        answer: 0,
        explanation: "Tomorrow = غدًا.",
      },
      {
        type: "match",
        prompt: "طابق كل كلمة بمعناها",
        pairs: [
          { left: "today", right: "اليوم" },
          { left: "yesterday", right: "أمس" },
          { left: "tomorrow", right: "غدًا" },
        ],
      },
      {
        type: "fill",
        prompt: "Today is Monday. ______ was Sunday. (أمس)",
        answer: "Yesterday",
        explanation: "Yesterday = أمس.",
      },
    ],
    reviewed: false,
  },
  {
    id: "012",
    number: 12,
    courseId: "en-zero",
    youtubeId: "QQ66VKPsAag",
    title: "تعلم كلمات انجليزية عن الرياضة : كورس تعلم اللغة الإنجليزية للمبتدئين كامل مجانا : ١٢",
    titleEn: "English sports vocabulary — complete English course for beginners: Episode 12",
    section: "مفردات — الرياضة",
    sectionEn: "Vocabulary — Sports",
    youtube: "https://youtu.be/QQ66VKPsAag?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT11M46S",
    summary:
      "الحلقة الثانية عشرة ومحورها مفردات الرياضة بالإنجليزية. تقدم أسماء رياضات شائعة وكلمات مرتبطة بها مع النطق والمعنى. مناسبة للحديث عن هواياتك ورياضتك المفضلة.",
    terms: [
      { en: "sport", ar: "رياضة", example: { en: "Football is my favourite sport.", ar: "كرة القدم هي رياضتي المفضلة." } },
      { en: "football", ar: "كرة القدم", example: { en: "We play football on Friday.", ar: "نلعب كرة القدم يوم الجمعة." } },
      { en: "basketball", ar: "كرة السلة", example: { en: "He plays basketball well.", ar: "يلعب كرة السلة جيدًا." } },
      { en: "swimming", ar: "السباحة", example: { en: "Swimming is good exercise.", ar: "السباحة تمرين جيد." } },
      { en: "running", ar: "الجري", example: { en: "Running every day is healthy.", ar: "الجري كل يوم صحي." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل رياضة بمعناها",
        pairs: [
          { left: "football", right: "كرة القدم" },
          { left: "basketball", right: "كرة السلة" },
          { left: "swimming", right: "السباحة" },
        ],
      },
      {
        type: "mcq",
        prompt: "«Running» تعني:",
        options: ["الجري", "السباحة", "كرة القدم", "التنس"],
        answer: 0,
        explanation: "Running = الجري.",
      },
      {
        type: "fill",
        prompt: "I play ______ with my friends in the club. (كرة القدم)",
        answer: "football",
        accept: ["soccer"],
        explanation: "Football (أو Soccer) = كرة القدم.",
      },
    ],
    reviewed: false,
  },
  {
    id: "013",
    number: 13,
    courseId: "en-zero",
    youtubeId: "LBdAxKWOz1c",
    title: "كلمات عن أجزاء الجسم باللغة الإنجليزية : كورس تعليم اللغة الإنجليزية للمبتدئين مجانا : ١٣",
    titleEn: "Body parts in English — free English course for beginners: Episode 13",
    section: "مفردات — أجزاء الجسم",
    sectionEn: "Vocabulary — Body parts",
    youtube: "https://youtu.be/LBdAxKWOz1c?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT14M42S",
    summary:
      "الحلقة الثالثة عشرة وتتناول أجزاء الجسم بالإنجليزية. تقدم كلمات مثل الرأس واليد والعين والقدم مع النطق والمعنى بالعربية. اربط كل كلمة بجسمك لتثبيتها فورًا.",
    terms: [
      { en: "head", ar: "رأس", example: { en: "My head hurts.", ar: "رأسي يؤلمني." } },
      { en: "hand", ar: "يد", example: { en: "Wash your hands.", ar: "اغسل يديك." } },
      { en: "eye", ar: "عين", example: { en: "She has green eyes.", ar: "لديها عيون خضراء." } },
      { en: "leg", ar: "ساق", example: { en: "My leg is strong.", ar: "ساقي قوية." } },
      { en: "foot", ar: "قدم", example: { en: "My foot hurts.", ar: "قدمي تؤلمني." } },
    ],
    practice: [
      {
        type: "match",
        prompt: "طابق كل عضو بمعناه",
        pairs: [
          { left: "head", right: "رأس" },
          { left: "hand", right: "يد" },
          { left: "eye", right: "عين" },
          { left: "foot", right: "قدم" },
        ],
      },
      {
        type: "mcq",
        prompt: "«Leg» تعني:",
        options: ["ساق", "ذراع", "رأس", "يد"],
        answer: 0,
        explanation: "Leg = ساق.",
      },
      {
        type: "fill",
        prompt: "We see with our ______ . (عيون)",
        answer: "eyes",
        accept: ["eye"],
        explanation: "Eyes = عيون، وEye = عين.",
      },
    ],
    reviewed: false,
  },
  {
    id: "014",
    number: 14,
    courseId: "en-zero",
    youtubeId: "pqGg9MiP2ic",
    title: "كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين كورس كامل من البداية الى الاحتراف : الحلقة 14",
    titleEn: "Complete English course from zero to mastery — Episode 14",
    section: "مراجعة أساسيات",
    sectionEn: "Basics review",
    youtube: "https://youtu.be/pqGg9MiP2ic?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT12M17S",
    summary:
      "الحلقة الرابعة عشرة من كورس المبتدئين وتأتي بعد سلسلة دروس المفردات. عنوان الفيديو الأصلي عام ولا يحدد موضوعًا بعينه، لذلك لا نضيف تفاصيل غير مؤكدة، والدرس يبني على ما سبقه. نضع هنا مراجعة أساسيات مساعدة.",
    terms: [
      { en: "hello", ar: "مرحبًا", example: { en: "Hello! Good morning.", ar: "مرحبًا! صباح الخير." } },
      { en: "goodbye", ar: "وداعًا", example: { en: "Goodbye, my friend.", ar: "وداعًا يا صديقي." } },
      { en: "please", ar: "من فضلك", example: { en: "Please sit down.", ar: "اجلس من فضلك." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "ما معنى «Hello»؟",
        options: ["مرحبًا", "وداعًا", "شكرًا", "آسف"],
        answer: 0,
        explanation: "Hello = مرحبًا.",
      },
      {
        type: "fill",
        prompt: "______ you for your help! (شكرًا)",
        answer: "Thank",
        explanation: "Thank you = شكرًا لك.",
      },
      {
        type: "order",
        prompt: "رتب الكلمات: «صباح الخير يا جماعة»",
        words: ["morning", "Good", "everyone"],
        answer: "Good morning everyone",
        explanation: "Good morning everyone = صباح الخير يا جماعة.",
      },
    ],
    reviewed: false,
  },
  {
    id: "015",
    number: 15,
    courseId: "en-zero",
    youtubeId: "vLUn6_FMw3w",
    title: "كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين كورس كامل من البداية الى الاحتراف : الحلقة 15",
    titleEn: "Complete English course from zero to mastery — Episode 15",
    section: "مراجعة أساسيات",
    sectionEn: "Basics review",
    youtube: "https://youtu.be/vLUn6_FMw3w?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT11M48S",
    summary:
      "الحلقة الخامسة عشرة من كورس المبتدئين. العنوان الأصلي عام لا يحدد موضوعًا بعينه، لذا نلتزم بعدم إضافة تفاصيل غير مؤكدة، والدرس استكمال لما سبقه من مفردات وأساسيات. نضع هنا مراجعة أساسيات مساعدة.",
    terms: [
      { en: "please", ar: "من فضلك", example: { en: "Please open the door.", ar: "افتح الباب من فضلك." } },
      { en: "sorry", ar: "آسف", example: { en: "Sorry, I am late.", ar: "آسف، أنا متأخر." } },
      { en: "excuse me", ar: "عن إذنك / المعذرة", example: { en: "Excuse me, can you help me?", ar: "المعذرة، هل يمكنك مساعدتي؟" } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "«Sorry» تعني:",
        options: ["آسف", "شكرًا", "مرحبًا", "وداعًا"],
        answer: 0,
        explanation: "Sorry = آسف.",
      },
      {
        type: "fill",
        prompt: "______ , can you help me? (من فضلك)",
        answer: "Please",
        explanation: "Please = من فضلك.",
      },
      {
        type: "order",
        prompt: "رتب الكلمات: «المعذرة من فضلك»",
        words: ["me", "Excuse", "please"],
        answer: "Excuse me please",
        explanation: "Excuse me please = المعذرة من فضلك.",
      },
    ],
    reviewed: false,
  },
  {
    id: "016",
    number: 16,
    courseId: "en-zero",
    youtubeId: "NDuK8lpN-mI",
    title: "كورس شامل لتعلم اللغة الانجليزية من الصفر للمبتدئين كورس كامل من البداية الى الاحتراف : الحلقة 16",
    titleEn: "Complete English course from zero to mastery — Episode 16",
    section: "مراجعة أساسيات",
    sectionEn: "Basics review",
    youtube: "https://youtu.be/NDuK8lpN-mI?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT13M26S",
    summary:
      "الحلقة السادسة عشرة من كورس المبتدئين. العنوان الأصلي عام لا يحدد موضوعًا بعينه، ولا نضيف تفاصيل غير مؤكدة؛ الدرس يبني على الحلقات السابقة. نضع هنا مراجعة أساسيات مساعدة.",
    terms: [
      { en: "yes", ar: "نعم", example: { en: "Yes, I understand.", ar: "نعم، أفهم." } },
      { en: "no", ar: "لا", example: { en: "No, thank you.", ar: "لا، شكرًا." } },
      { en: "maybe", ar: "ربما", example: { en: "Maybe tomorrow.", ar: "ربما غدًا." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "«Yes» تعني:",
        options: ["نعم", "لا", "ربما", "أبدًا"],
        answer: 0,
        explanation: "Yes = نعم.",
      },
      {
        type: "fill",
        prompt: "______ , thank you. (لا، شكرًا)",
        answer: "No",
        explanation: "No = لا.",
      },
      {
        type: "order",
        prompt: "رتب الكلمات: «ربما غدًا»",
        words: ["tomorrow", "Maybe"],
        answer: "Maybe tomorrow",
        explanation: "Maybe tomorrow = ربما غدًا.",
      },
    ],
    reviewed: false,
  },
  {
    id: "017",
    number: 17,
    courseId: "en-zero",
    youtubeId: "qQAgJxSSnbw",
    title: "كورس إنجليزي شامل للمبتدئين — من الصفر إلى الطلاقة — الحلقة 17",
    titleEn: "Comprehensive English Learning Course for Beginners: From Scratch to Fluency - Episode 17",
    section: "مراجعة أساسيات",
    sectionEn: "Basics review",
    youtube: "https://youtu.be/qQAgJxSSnbw?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT15M9S",
    summary:
      "الحلقة السابعة عشرة من الكورس الشامل للمبتدئين. العنوان الأصلي عام لا يحدد موضوعًا بعينه، لذا نلتزم بعدم إضافة تفاصيل غير مؤكدة، والدرس استكمال لما سبقه من مفردات وحوارات أساسية.",
    terms: [
      { en: "one", ar: "واحد", example: { en: "I have one book.", ar: "لدي كتاب واحد." } },
      { en: "two", ar: "اثنان", example: { en: "Two cups, please.", ar: "كوبان من فضلك." } },
      { en: "five", ar: "خمسة", example: { en: "Five minutes, please.", ar: "خمس دقائق من فضلك." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "What is 5 in English?",
        options: ["Five", "Four", "Six", "Nine"],
        answer: 0,
        explanation: "Five = خمسة.",
      },
      {
        type: "fill",
        prompt: "Two + three = ______ .",
        answer: "five",
        explanation: "2 + 3 = 5، أي Five.",
      },
      {
        type: "order",
        prompt: "رتب الكلمات: «أنا بخير»",
        words: ["fine", "am", "I"],
        answer: "I am fine",
        explanation: "I am fine = أنا بخير.",
      },
    ],
    reviewed: false,
  },
  {
    id: "018",
    number: 18,
    courseId: "en-zero",
    youtubeId: "l51hYjeR-K8",
    title: "كورس إنجليزي شامل للمبتدئين — من الصفر إلى الإتقان — الحلقة 18",
    titleEn: "Comprehensive English Learning Course for Beginners: From Scratch to Mastery - Episode 18",
    section: "مراجعة أساسيات",
    sectionEn: "Basics review",
    youtube: "https://youtu.be/l51hYjeR-K8?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT13M31S",
    summary:
      "الحلقة الثامنة عشرة من الكورس الشامل للمبتدئين. العنوان الأصلي عام لا يحدد موضوعًا بعينه، ولا نضيف تفاصيل غير مؤكدة؛ الدرس استكمال لما سبقه. نضع هنا مراجعة أساسيات مساعدة.",
    terms: [
      { en: "red", ar: "أحمر", example: { en: "The apple is red.", ar: "التفاحة حمراء." } },
      { en: "blue", ar: "أزرق", example: { en: "The sky is blue.", ar: "السماء زرقاء." } },
      { en: "green", ar: "أخضر", example: { en: "The grass is green.", ar: "العشب أخضر." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "«Blue» تعني:",
        options: ["أزرق", "أحمر", "أخضر", "أصفر"],
        answer: 0,
        explanation: "Blue = أزرق.",
      },
      {
        type: "match",
        prompt: "طابق كل لون بمعناه",
        pairs: [
          { left: "red", right: "أحمر" },
          { left: "green", right: "أخضر" },
          { left: "yellow", right: "أصفر" },
        ],
      },
      {
        type: "fill",
        prompt: "The sky is ______ . (أزرق)",
        answer: "blue",
        explanation: "Blue = أزرق.",
      },
    ],
    reviewed: false,
  },
  {
    id: "019",
    number: 19,
    courseId: "en-zero",
    youtubeId: "80tPPnffuMM",
    title: "كورس إنجليزي شامل للمبتدئين من الصفر — الحلقة 19",
    titleEn: "Comprehensive English Learning Course for Beginners from Scratch: Full Course from Start to Maste...",
    section: "مراجعة أساسيات",
    sectionEn: "Basics review",
    youtube: "https://youtu.be/80tPPnffuMM?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT14M7S",
    summary:
      "الحلقة التاسعة عشرة من الكورس الشامل للمبتدئين. العنوان الأصلي عام (ومقطوع في بيانات القناة) ولا يحدد موضوعًا بعينه، لذا لا نضيف تفاصيل غير مؤكدة. نضع هنا مراجعة أساسيات مساعدة.",
    terms: [
      { en: "Monday", ar: "الاثنين", example: { en: "We study on Monday.", ar: "ندرس يوم الاثنين." } },
      { en: "Friday", ar: "الجمعة", example: { en: "Friday is my favourite day.", ar: "الجمعة يومي المفضل." } },
      { en: "Sunday", ar: "الأحد", example: { en: "Sunday is a holiday.", ar: "الأحد يوم عطلة." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "«Monday» تعني:",
        options: ["الاثنين", "الجمعة", "الأحد", "الثلاثاء"],
        answer: 0,
        explanation: "Monday = الاثنين.",
      },
      {
        type: "match",
        prompt: "طابق كل يوم بمعناه",
        pairs: [
          { left: "Monday", right: "الاثنين" },
          { left: "Friday", right: "الجمعة" },
          { left: "Sunday", right: "الأحد" },
        ],
      },
      {
        type: "fill",
        prompt: "______ is the first day of the week. (الاثنين)",
        answer: "Monday",
        explanation: "Monday = الاثنين، أول أيام الأسبوع.",
      },
    ],
    reviewed: false,
  },
  {
    id: "020",
    number: 20,
    courseId: "en-zero",
    youtubeId: "86GViC7Hi44",
    title: "كورس إنجليزي شامل للمبتدئين — من الصفر إلى الطلاقة — الحلقة 20",
    titleEn: "Comprehensive English Learning Course for Beginners: From Zero to Fluency - Episode 20",
    section: "مراجعة أساسيات",
    sectionEn: "Basics review",
    youtube: "https://youtu.be/86GViC7Hi44?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    duration: "PT14M23S",
    summary:
      "الحلقة العشرون من الكورس الشامل للمبتدئين. العنوان الأصلي عام لا يحدد موضوعًا بعينه، ولا نضيف تفاصيل غير مؤكدة؛ الدرس استكمال لما سبقه من مفردات وحوارات. نضع هنا مراجعة أساسيات مساعدة.",
    terms: [
      { en: "water", ar: "ماء", example: { en: "I drink water every day.", ar: "أشرب الماء كل يوم." } },
      { en: "bread", ar: "خبز", example: { en: "We buy bread in the morning.", ar: "نشتري الخبز في الصباح." } },
      { en: "milk", ar: "لبن/حليب", example: { en: "She drinks milk.", ar: "هي تشرب الحليب." } },
    ],
    practice: [
      {
        type: "mcq",
        prompt: "«Water» تعني:",
        options: ["ماء", "خبز", "حليب", "عصير"],
        answer: 0,
        explanation: "Water = ماء.",
      },
      {
        type: "match",
        prompt: "طابق كل كلمة بمعناها",
        pairs: [
          { left: "water", right: "ماء" },
          { left: "bread", right: "خبز" },
          { left: "milk", right: "حليب" },
        ],
      },
      {
        type: "fill",
        prompt: "I drink ______ every morning. (حليب)",
        answer: "milk",
        explanation: "Milk = حليب.",
      },
    ],
    reviewed: false,
  },
];

export function findEnglishCourse(id: string) {
  return englishCourses.find((c) => c.id === id);
}

export function englishVideosOfCourse(courseId: string) {
  return englishVideos.filter((v) => v.courseId === courseId);
}

export function findEnglishVideo(id: string) {
  return englishVideos.find((v) => v.id === id);
}

export function englishVideoIndex(id: string) {
  return englishVideos.findIndex((v) => v.id === id);
}

export function normalizePracticeAnswer(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const ETM_ENGLISH_CREDIT =
  "Content by zAmericanEnglish on YouTube. This platform is not affiliated with the channel.";

export const ETM_ENGLISH_CHANNEL = "https://www.youtube.com/@ZAmericanEnglish";
