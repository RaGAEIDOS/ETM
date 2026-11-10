import type { Source } from "./types";

export interface CourseMeta {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  sources: Source[];
}

export interface StageMeta {
  id: string;
  level: number;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  color: string;
  icon: string;
  courses: CourseMeta[];
}

export const OSSU = "https://github.com/ossu/computer-science";

export const stageMetas: StageMeta[] = [
  {
    id: "stage-1",
    level: 1,
    name: "سهل جداً",
    nameEn: "Foundations",
    tagline: "من الصفر والواحد: أول خطوة في عالم البرمجة",
    description:
      "هنا تبدأ الرحلة فعلاً. هتتعلم أساسيات لغة C++ من غير أي خبرة سابقة، وتفهم إزاي الكمبيوتر بيفكر بالصفر والواحد، وتتجهز بأدوات المبرمج الحقيقي.",
    color: "from-emerald-400 to-cyan-500",
    icon: "sprout",
    courses: [
      {
        id: "cpp-basics",
        title: "أساسيات لغة C++",
        titleEn: "C++ Basics",
        description:
          "أول طريق في البرمجة: المتغيرات، الشروط، الحلقات، الدوال، المصفوفات والنصوص — بشرح عربي مبسّط وأمثلة قابلة للتشغيل.",
        sources: [
          { name: "CS50 — Harvard", url: "https://cs50.harvard.edu/x/" },
          { name: "OSSU Intro CS", url: OSSU },
          { name: "Learn C++ — learncpp.com", url: "https://www.learncpp.com/" },
        ],
      },
      {
        id: "thinking-computer",
        title: "كيف يفكر الكمبيوتر (الصفر والواحد)",
        titleEn: "How Computers Think",
        description:
          "فهم النظام الثنائي والبوابات المنطقية والخوارزميات قبل ما تكتب كود معقّد، عشان تبقى مبرمج فاهم مش just كاتبع كود.",
        sources: [
          { name: "Nand2Tetris", url: "https://www.nand2tetris.org/" },
          { name: "Crash Course Computer Science", url: "https://www.youtube.com/playlist?list=PL8dPuLjbpukj8S7c/f4F6nWl5h5u2l5h5" },
        ],
      },
      {
        id: "tools",
        title: "أدوات المبرمج وبيئة العمل",
        titleEn: "Developer Tools",
        description:
          "تثبيت مترجم C++، التعامل مع سطر الأوامر، Git و GitHub، وتصحيح الأخطاء — المهارة اللي بتفرق بين الهاوي والمحترف.",
        sources: [
          { name: "The Missing Semester — MIT", url: "https://missing.csail.mit.edu/" },
          { name: "Git Documentation", url: "https://git-scm.com/doc" },
        ],
      },
      {
        id: "git-github",
        title: "كورس مكثف: Git و GitHub",
        titleEn: "Git & GitHub Crash Course",
        description:
          "كل اللي المبرمج المحترف محتاجه من Git: فكرة إدارة الإصدارات، التثبيت والإعداد، الدورة اليومية (status/add/commit)، الفروع والدمج، GitHub والـ Pull Requests، وأدوات باحترافية زي stash و revert و tags.",
        sources: [
          { name: "Git Official Docs", url: "https://git-scm.com/doc" },
          { name: "Pro Git Book — مجاني", url: "https://git-scm.com/book/en/v2" },
          { name: "GitHub Skills", url: "https://skills.github.com/" },
        ],
      },
      {
        id: "elzero-fundamentals",
        title: "أساسيات البرمجة مع C++ — مسار الزيرو",
        titleEn: "Fundamentals Of Programming With C++ — ElZero Track",
        description:
          "مسار مرافق لقناة الزيرو (فيديوهات #001 لحد #078): المتغيرات، الأنواع، العوامل، If و Switch، المصفوفات، الحلقات، الدوال، Vector والمؤشرات — بأمثلة وتتبع مصطلحات وأمثلة شغالة.",
        sources: [
          {
            name: "ElZero Web School — Fundamentals Of Programming With C++",
            url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS",
          },
          {
            name: "قائمة الفيديوهات والجدول الرسمي",
            url: "https://github.com/ElzeroWebSchool/Fundamentals_Of_Programming",
          },
        ],
      },
    ],
  },
  {
    id: "stage-2",
    level: 2,
    name: "متوسط",
    nameEn: "Intermediate",
    tagline: "برمجة شيئية وهياكل بيانات: من كتب كود إلى بناء أنظمة",
    description:
      "المرحلة اللي بتتحول فيها من مترجم كود لمهندس برمجيات. البرمجة الشيئية، المؤشرات وإدارة الذاكرة، وهياكل البيانات الأساسية.",
    color: "from-cyan-400 to-blue-500",
    icon: "layers",
    courses: [
      {
        id: "oop",
        title: "البرمجة الشيئية OOP بلغة C++",
        titleEn: "Object-Oriented Programming",
        description:
          "الأصناف والكائنات، الوراثة، تعدد الأشكال، والتغليف — النمط اللي بيستخدمه كل محرك ألعاب ونظام تشغيل محترم.",
        sources: [
          { name: "OSSU Object-Oriented Design", url: OSSU },
          { name: "learncpp.com — OOP", url: "https://www.learncpp.com/cpp-tutorial/object-oriented-programming/" },
        ],
      },
      {
        id: "pointers-memory",
        title: "المؤشرات وإدارة الذاكرة",
        titleEn: "Pointers & Memory Management",
        description:
          "سر C++ الحقيقي: المؤشرات، المراجع، الذاكرة الديناميكية، والمؤشرات الذكية. هنا هتفهم ليه الأعطال بتحصل وإزاي تتجنبها.",
        sources: [
          { name: "learncpp.com — Pointers", url: "https://www.learncpp.com/cpp-tutorial/pointers/" },
          { name: "OSSU Core Systems", url: OSSU },
        ],
      },
      {
        id: "data-structures",
        title: "هياكل البيانات الأساسية",
        titleEn: "Data Structures",
        description:
          "القوائم المتصلة، الأكوام، الطوابير، الأشجار، جداول التجزئة، والـ STL — مع معرفة تعقيد الوقت Big-O.",
        sources: [
          { name: "OSSU Data Structures & Algorithms", url: OSSU },
          { name: "MIT 6.006", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
        ],
      },
      {
        id: "recursion",
        title: "العودية والخوارزميات الأساسية",
        titleEn: "Recursion & Basic Algorithms",
        description:
          "العودية، الفرز، البحث، والتعامل مع الملفات — مع مشاريع صغيرة تثبّت المفهوم في دماغك.",
        sources: [
          { name: "OSSU Core Theory", url: OSSU },
          { name: "Algorithms Illuminated", url: "https://www.algorithmsilluminated.org/" },
        ],
      },
    ],
  },
  {
    id: "stage-3",
    level: 3,
    name: "صعب",
    nameEn: "Advanced",
    tagline: "الأنظمة والخوارزميات المتقدمة: بتفهم اللي تحت الهود",
    description:
      "مرحلة الدراسة الجامعية الحقيقية: خوارزميات متقدمة، رياضيات للبرمجة، معمارية الحاسب، أنظمة التشغيل، والشبكات وقواعد البيانات.",
    color: "from-violet-400 to-fuchsia-500",
    icon: "cpu",
    courses: [
      {
        id: "algorithms",
        title: "الخوارزميات المتقدمة",
        titleEn: "Advanced Algorithms",
        description:
          "تقسيمة وغزو، الرسوم البيانية، أقصر مسار، البرمجة الديناميكية، والتتبع الخلفي — كنز المقابلات التقنية.",
        sources: [
          { name: "Stanford Algorithms (Tim Roughgarden)", url: "https://www.algorithmsilluminated.org/" },
          { name: "OSSU Core Theory", url: OSSU },
        ],
      },
      {
        id: "math-cs",
        title: "الرياضيات للبرمجة",
        titleEn: "Math for Computer Science",
        description:
          "المنطق والمجموعات، الاحتمالات، الجبر الخطي، والتفاضل — الرياضيات اللي بتخلي خوارزمياتك قوية.",
        sources: [
          { name: "MIT Mathematics for CS", url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/" },
          { name: "Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
        ],
      },
      {
        id: "architecture",
        title: "معمارية الحاسب: من Nand إلى Tetris",
        titleEn: "Computer Architecture",
        description:
          "من بوابة NAND لحد ما تبني CPU كامل: الدوائر المنطقية، ALU، الذاكرة، ولغة التجميع.",
        sources: [
          { name: "Nand2Tetris", url: "https://www.nand2tetris.org/" },
          { name: "MIT 6.004 Computation Structures", url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" },
        ],
      },
      {
        id: "os",
        title: "أنظمة التشغيل: العمليات والذاكرة",
        titleEn: "Operating Systems",
        description:
          "العمليات والخيوط، الجدولة، إدارة الذاكرة، والتزامن — بمنظور كتاب OSTEP الشهير.",
        sources: [
          { name: "OSTEP — Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
          { name: "OSSU Core Systems", url: OSSU },
        ],
      },
      {
        id: "networking-db",
        title: "الشبكات وقواعد البيانات",
        titleEn: "Networking & Databases",
        description:
          "بروتوكولات الشبكات من TCP/IP لحد HTTP، وتصميم قواعد البيانات وSQL — مع ربط C++ بـ SQLite.",
        sources: [
          { name: "Computer Networking: Top-Down", url: "https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm" },
          { name: "Stanford Databases", url: "https://www.edx.org/learn/databases/stanford-university-databases-modeling-and-theory" },
        ],
      },
    ],
  },
  {
    id: "stage-4",
    level: 4,
    name: "منتهى الصعوبة",
    nameEn: "Expert",
    tagline: "مشاريع تخرج حقيقية: محرك ألعاب ونظام تشغيل كامل",
    description:
      "القمة: بناء مترجم من الصفر، برمجة محرك ألعاب كامل، نظام موزع، أمن سيبراني، ونواة نظام تشغيل بتشتغل في QEMU. هنا بتبقى مهندس حقيقي.",
    color: "from-amber-400 to-rose-500",
    icon: "rocket",
    courses: [
      {
        id: "compilers",
        title: "بناء مترجم Compiler",
        titleEn: "Compiler Construction",
        description:
          "من المحلل اللغوي لحد توليد الكود: هتبني مترجم لغة برمجة صغيرة بنفسك — أعمق مشروع ممكن تعمله.",
        sources: [
          { name: "Stanford Compilers", url: "https://www.edx.org/learn/computer-science/stanford-university-compilers" },
          { name: "Crafting Interpreters", url: "https://craftinginterpreters.com/" },
        ],
      },
      {
        id: "game-engine",
        title: "برمجة محرك ألعاب",
        titleEn: "Game Engine Programming",
        description:
          "حلقة اللعبة، الرسوميات، الفيزياء، المعمارية ECS، والصوت — مشروعك: لعبة Snake كاملة بمحركك الخاص.",
        sources: [
          { name: "Game Engine Architecture — Jason Gregory", url: "https://www.gameenginebook.com/" },
          { name: "OpenGL Learn", url: "https://learnopengl.com/" },
        ],
      },
      {
        id: "os-dev",
        title: "بناء نظام تشغيل من الصفر",
        titleEn: "Operating System Development",
        description:
          "Bootloader، نواة Kernel، المقاطعات، إدارة الذاكرة، ونظام ملفات — مشروعك الأخير: نواة بتشتغل في QEMU.",
        sources: [
          { name: "OSDev Wiki", url: "https://wiki.osdev.org/" },
          { name: "Writing a Simple Operating System — Blundell", url: "https://www.cs.bham.ac.uk/~exr/lectures/opsys/10_11/lectures/os-dev.pdf" },
        ],
      },
      {
        id: "distributed",
        title: "الأنظمة الموزعة والموثوقية",
        titleEn: "Distributed Systems",
        description:
          "نداءات الإجراءات البعيدة، خوارزميات الإجماع، والتعامل مع الفشل — أساس أي نظام كبير زي Google.",
        sources: [
          { name: "Designing Data-Intensive Applications", url: "https://dataintensive.net/" },
          { name: "MIT 6.824 Distributed Systems", url: "https://pdos.csail.mit.edu/6.824/" },
        ],
      },
      {
        id: "security",
        title: "الأمان والحماية",
        titleEn: "Security",
        description:
          "ثغرات Buffer Overflow، التشفير، والدفاع عن الأنظمة — تفكير المهاجم عشان تبني دفاع حقيقي.",
        sources: [
          { name: "OSSU Core Security", url: OSSU },
          { name: "LiveOverflow", url: "https://www.youtube.com/@LiveOverflow" },
        ],
      },
    ],
  },
];
