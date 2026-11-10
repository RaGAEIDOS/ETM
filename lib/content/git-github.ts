import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "git-why",
    title: "ليه محتاج Git؟ — فكرة إدارة الإصدارات",
    titleEn: "Why Git? — The Idea of Version Control",
    duration: "20 دقيقة",
    description:
      "قبل ما تكتب أمر واحد، لازم تفهم المشكلة اللي Git بيحلها: إزاي يتحمّل كل تاريخ التعديلات في مشروعك ويحميك من كوارث \"نسخت الملف ورجعت منه\".",
    sections: [
      {
        heading: "المشكلة اللي بيحلها Git",
        body: "تخيل إنك بتشتغل على مشروع، وعايز تجرب تغيير كبير في الكود. هتعمل إيه؟\n\n- هتنسخ المجلد باسم `my-project-final-v2-REAL`؟\n- ولو الجرّب بوص، ازاي ترجع للنسخة القديمة؟\n- ولو شغال مع صاحبك، كل واحد فيكو عنده نسخة مختلفة؟ الكوارث هنا حتمية.\n\n**أنظمة التحكم بالإصدارات (VCS)** اتولدت عشان تحل المشكلة دي بالظبط. وأشهر نظام فيهم على الإطلاق هو **Git**.",
      },
      {
        heading: "إيه هو الـ Commit؟",
        body: "بدل ما تحتفظ بأحسن نسخة عندك، Git بيسجّل كل مجموعة تعديلات كـ **Commit** — وكأنه لقطة (Snapshot) من المشروع كله في لحظة معينة.\n\nكل Commit له:\n\n- **معرّف فريد** (هش بيتكون من حروف وأرقام طويلة).\n- **رسالة** منك توضح التغيير.\n- **تاريخ ومؤلف** — مين عمل التغيير وإمتى.\n- **مؤشر للـ Commit السابق** — عشان يتبني تاريخ كامل متصل.",
      },
      {
        heading: "Git مش Backup بس",
        body: "كتير بيظنوا إن Git مجرد \"نسخ احتياطي\". هو أكتر من كده بكتير:\n\n- **تجربة آمنة:** تقدر تعمل تغييرات جريئة وتجرب، ولو الموضوع بوص تقدر ترجع لأي نقطة.\n- **فهم التاريخ:** تعرف إيه اتغير وليه، وتشوف الفرق (Diff) بين أي نقطتين.\n- **تعاون:** فريق كامل يشتغل على نفس الكود بدون ما يبوظوا شغل بعض.\n- **مراجعة:** تعرف مين كاتب كل سطر ومتى — من غير ما تسأل حد.",
      },
      {
        heading: "الفرق بين Git و GitHub",
        body: "ناس كتير بتخلط بينهم:\n\n- **Git** — الأداة اللي بتشتغل على جهازك وبتدير تاريخ المشروع محليًا.\n- **GitHub** — موقع بيستضيف مستودعات Git على الإنترنت، وبيضيف أدوات تعاون (Pull Requests، Issues، مراجعة الكود).\n\nGit هو المحرك، وGitHub هو المنصة اللي بترجّع بيها Git للعالم. بدايل GitHub: GitLab و Bitbucket — نفس الفكرة بأدوات مختلفة.",
      },
    ],
    code: [
      {
        title: "تحقق إن Git متثبّت على جهازك",
        language: "bash",
        code: `git --version
# مثال للناتج:
# git version 2.43.0

# لو الناتج ظهر — Git متثبّت وجاهز للشغل.`,
      },
    ],
    quiz: [
      {
        question: "إيه المشكلة الأساسية اللي Git بيحلها؟",
        options: [
          "كتابة كود أسرع",
          "حفظ كل تاريخ التعديلات في المشروع والرجوع لأي نقطة وتعاون الفريق",
          "تشغيل البرامج أسرع",
          "ترجمة الكود للغة الآلة",
        ],
        answer: 1,
        explanation:
          "Git بيسجّل كل تغيير كـ Commit، وبيخليك تقدر ترجع لأي لحظة، وتفهم التاريخ، وتشتغل مع فريق بدون تضارب.",
      },
      {
        question: "الـ Commit في Git هو:",
        options: [
          "نسخة من ملف واحد بس",
          "لقطة كاملة من المشروع مع رسالة وتاريخ ومؤشر بالسابق",
          "الأمر اللي بترفع بيه الملفات للإنترنت",
          "اسم البرنامج",
        ],
        answer: 1,
        explanation: "كل commit هو snapshot متصل بتاريخ كامل للمشروع.",
      },
      {
        question: "Git vs GitHub — إيه الفرق؟",
        options: [
          "الاتنين نفس الحاجة",
          "Git أداتك المحلية لإدارة الإصدارات، GitHub منصة استضافة على الإنترنت",
          "GitHub أداة محلية وGit موقع",
          "Git للفرق الكبيرة وGitHub للمبتدئين",
        ],
        answer: 1,
        explanation: "Git الأداة، GitHub المكان اللي بتشارك فيه تاريخ Git على النت.",
      },
    ],
    exercise:
      "اكتب بقلمك 3 مواقف في حياتك (مش بالضرورة كود) كنت محتاج فيها \"ترجع نسخة قديمة\" — لاحظ إن نفس الفكرة بتظهر في أي عمل إبداعي (تصميم، كتابة، بحث).",
    terms: [
      { en: "VCS", ar: "نظام تحكم بالإصدارات: بيسجّل كل تعديل في المشروع ويتيح الرجوع لأي نسخة وتعاون الفريق." },
      { en: "Commit", ar: "التزام: لقطة محفوظة من حالة المشروع كله مع رسالة وصفية وتاريخ ومؤشر بالتزام السابق." },
      { en: "Repository (Repo)", ar: "مستودع: المجلد اللي Git بيتابع فيه تاريخ المشروع كاملًا." },
    ],
  },
  {
    id: "git-setup",
    title: "التثبيت والإعداد — أول مرة مع Git",
    titleEn: "Setup: Install & Configure Git",
    duration: "25 دقيقة",
    description:
      "تثبيت Git، إعداد اسمك وإيميلك، وفهم الفرق بين git init و git clone — وتهيئة مشروع جديد من الصفر.",
    sections: [
      {
        heading: "تثبيت Git",
        body: "- **ويندوز:** حمّل Git for Windows من git-scm.com (بيجي معاه الطرفية git-bash).\n- **لينكس (Ubuntu/Debian):**\n\n```bash\nsudo apt update && sudo apt install git\n```\n\n- **ماك:** `xcode-select --install` أو Homebrew: `brew install git`\n\nتأكد دايمًا بـ `git --version`.",
      },
      {
        heading: "أهم خطوة: اسمك وإيميلك",
        body: "Git مش بيسجّل التغييرات من غير هوية. لازم تعرّفه بيها مرة واحدة:\n\n```bash\ngit config --global user.name \"اسمك\"\ngit config --global user.email \"you@example.com\"\n```\n\nاستخدم الإيميل بتاع GitHub — هيظهر جنب كل Commit هتعمله.\n\n```bash\n# تأكد من الإعدادات\ngit config --list\n```",
      },
      {
        heading: "إزاي يبدأ Git متابعة مشروع؟",
        body: "في طريقتين:\n\n1. **git init** — لو عندك مجلد مشروع جاهز وعايز Git يبدأ يتابع فيه:\n```bash\ncd my-project\ngit init\n```\nهيتعمل مجلد مخفي `.git` — ده المستودع نفسه.\n\n2. **git clone** — لو المشروع موجود على GitHub وعايز تنزّله:\n```bash\ngit clone https://github.com/username/repo.git\ncd repo\n```",
      },
      {
        heading: "الملف اللي محتاج تعرفه: .gitignore",
        body: "مش كل حاجة في المجلد مهمة. ملفات النظام، node_modules، الملفات المؤقتة — كلها مش لازمة تاريخ Git.\n\nاعمل ملف `.gitignore` في جذر المشروع واكتب فيه الأنماط:\n\n```text\nnode_modules/\n.next/\n*.log\n.env\n```\n\nأي ملف مطابق النمط ده Git مش هيشوفه ولا يسجّله.",
      },
    ],
    code: [
      {
        title: "تهيئة مشروع جديد بالكامل",
        language: "bash",
        code: `mkdir my-cpp-app
cd my-cpp-app

git init
echo "node_modules/" > .gitignore
git status              # هتشوف الملفات الجديدة بالأخضر/الأحمر

git add .
git commit -m "chore: initial project setup"`,
      },
    ],
    quiz: [
      {
        question: "ليه لازم تحدد user.name و user.email؟",
        options: [
          "عشان Git يشتغل أسرع",
          "عشان كل commit يسجّل مين اللي عمله، وتظهر هويتك جنب التغييرات",
          "عشان تشفير الكود",
          "ده اختياري مش مهم",
        ],
        answer: 1,
        explanation: "الهوية هي اللي بتربط كل commit بيك، ولازم تكون مطابقة لحساب GitHub لو عايز التغييرات تنسبلك.",
      },
      {
        question: "git init بيعمل إيه؟",
        options: [
          "بيحذف المشروع الحالي",
          "بيبدأ مستودع Git جديد في المجلد الحالي",
          "بينسخ المشروع من الإنترنت",
          "بيرفع المشروع لـ GitHub",
        ],
        answer: 1,
        explanation: "git init بيعمل مجلد .git — المستودع اللي بيخزن كل تاريخ المشروع.",
      },
      {
        question: "وظيفة ملف .gitignore؟",
        options: [
          "يحذف الملفات القديمة",
          "يقول لـ Git إيه الملفات اللي ميتسجّلهاش في التاريخ",
          "يخفي المشروع عن الآخرين",
          "يحمي الكود من القراصنة",
        ],
        answer: 1,
        explanation: "node_modules والملفات المؤقتة وملفات البيئة السرية لازم متتفعلش في تاريخ Git.",
      },
    ],
    exercise:
      "ثبّت Git على جهازك، حدد اسمك وإيميلك بأمر git config، واعمل مجلد جديد فيه ملف hello.cpp وابقاه Git يبدأ يتابع فيه بأمر git init — واعمل أول commit باسم chore: first commit.",
    terms: [
      { en: "git init", ar: "يبدأ مستودع Git جديد داخل المجلد الحالي — بيعمل مجلد .git مخفي." },
      { en: "git clone", ar: "ينزّل نسخة كاملة من مستودع موجود على الإنترنت مع كل تاريخه." },
      { en: ".gitignore", ar: "ملف بيحدد الأنماط والملفات اللي Git لازم يتجاهلها ومسجلهاش في التاريخ." },
    ],
  },
  {
    id: "git-daily",
    title: "الدورة اليومية: status → add → commit → log",
    titleEn: "The Daily Cycle: status, add, commit, log",
    duration: "30 دقيقة",
    description:
      "حلقة الشغل الأساسية اللي هتعملها كل يوم في مسيرتك كمبرمج: فحص التغييرات، تجهيزها، حفظها، ومراجعة التاريخ.",
    sections: [
      {
        heading: "ثلاث مناطق، لازم تفهمها",
        body: "أي ملف في مشروعك بيمر بثلاث مناطق:\n\n1. **Working Directory** — الملفات اللي بتشتغل عليها دلوقتي.\n2. **Staging Area** — منطقة التحضير: بتحدد إيه التغييرات اللي هتدخل الـ commit الجاي.\n3. **Repository** — التاريخ المحفوظ فعلاً (الدورية بعد الـ commit).\n\nالتعديل لازم يمر من الأولى للتانية للتالتة — مفيش قفز مباشر.",
      },
      {
        heading: "git status — عيناك في المشروع",
        body: "أكتر أمر هتستخدمه:\n\n```bash\ngit status\n```\n\nبيقول لك إيه اتغير:\n\n- **Changes to be committed** — محضّرة للـ commit الجاي (خضراء).\n- **Changes not staged for commit** — اتعدّلت ولسه ما جيهاتش للـ staging.\n- **Untracked files** — ملفات جديدة Git لسه ماشافهاش.",
      },
      {
        heading: "git add و git diff",
        body: "**لتجهيز ملف محدد:**\n\n```bash\ngit add main.cpp index.html\n```\n\n**لتجهيز كل الملفات المعدّلة:**\n\n```bash\ngit add .\n```\n\n**لمشاهدة الفرق قبل التحضير:**\n\n```bash\ngit diff          # إيه اتغير فعلًا (غير محضّر)\ngit diff --staged # إيه محضّر جاهز للـ commit\n```",
      },
      {
        heading: "git commit و git log",
        body: "**الحفظ الفعلي:**\n\n```bash\ngit commit -m \"feat: add user login\"\n```\n\nاستخدم أسلوب **Conventional Commits**: `feat:` لميزة جديدة، `fix:` لإصلاح، `docs:` لتوثيق، `refactor:` لتحسين كود من غير تغيير سلوك.\n\n**مراجعة التاريخ:**\n\n```bash\ngit log              # بالترتيب من الأحدث\ngit log --oneline    # سطر واحد لكل commit\ngit log --stat       # مع الملفات المتغيرة في كل commit\n```",
      },
    ],
    code: [
      {
        title: "دورة كاملة من التعديل للحفظ",
        language: "bash",
        code: `# 1. عدّل أي ملف في مشروعك
# 2. شوف إيه اتغير
git status
git diff

# 3. جهّز التغيير للحفظ
git add cpp-basics.cpp
git status          # هتلاقيه تحت "Changes to be committed"

# 4. احفظ
git commit -m "feat: solve lesson 3 exercise"

# 5. راجع التاريخ
git log --oneline`,
      },
    ],
    quiz: [
      {
        question: "المناطق الثلاث في Git هي:",
        options: [
          "Working directory → Staging area → Repository",
          "Local → Cloud → Archive",
          "Editor → Compiler → Runner",
          "لا يوجد مناطق",
        ],
        answer: 0,
        explanation:
          "الملف بيتعدّل في Working Directory، بيتحضّر في Staging Area، ويتطلب commit عشان يدخل Repository.",
      },
      {
        question: "git add . بيعمل إيه؟",
        options: [
          "يحذف الملفات الجديدة",
          "يجهّز كل التغييرات (بما فيها الملفات الجديدة) للـ commit الجاي",
          "يحفظ التغييرات للأبد",
          "يرفع المشروع للإنترنت",
        ],
        answer: 1,
        explanation: "git add . يجهّز التغييرات بس، ولازم git commit عشان تتسجل فعلاً.",
      },
      {
        question: "الفرق بين git diff و git diff --staged؟",
        options: [
          "الأول للملفات الجديدة والثاني للمحذوفة",
          "الأول بيوريك التغييرات غير المحضّرة، والثاني بيوريك اللي محضّر للـ commit",
          "الاتنين نفس الناتج",
          "diff للصور و staged للكود",
        ],
        answer: 1,
        explanation:
          "git diff بيريك التغييرات اللي لسه ما جيهاتش للـ staging، أما --staged بيريك اللي جاهز للحفظ.",
      },
    ],
    exercise:
      "في مشروع C++ بتاعك: عدّل ملفين (واحد بإضافة تعليق والثاني بتغيير قيمة)، شغّل git status و git diff، جهّز ملف واحد فقط بــ git add، احفظه بـ commit، وبعدين حدد إيه اللي لسه غير محضّر.",
    terms: [
      { en: "Staging Area", ar: "منطقة التحضير: المكان اللي بتحدد فيه التغييرات اللي هتدخل الـ commit الجاي." },
      { en: "Working Directory", ar: "مجلد العمل: الملفات الفعلية اللي بتشتغل عليها الآن." },
      { en: "Conventional Commits", ar: "أسلوب كتابة رسائل commit على شكل \"نوع: وصف\" زي feat: و fix: و docs:." },
    ],
  },
  {
    id: "git-branches",
    title: "الفروع Branches — ازاي تشتغل على ميزات من غير ما تكسر الرئيسي",
    titleEn: "Branches & Merging",
    duration: "35 دقيقة",
    description:
      "الفروع هي القوة الحقيقية لـ Git: جرّب أي حاجة في فرع جانبي، ولما يرضيك الكود ادمجه في الرئيسي — ولو ما عجبكش، ارمي الفرع كله.",
    sections: [
      {
        heading: "إيه هو الـ Branch؟",
        body: "الـ Branch هو **خط تطوير مستقل** جوه نفس المستودع. لما تعمل branch جديد، Git مش بينسخ الملفات — هو بس بيعمل مؤشر خفيف على آخر commit.\n\n**ليه الفروع مهمة؟**\n\n- جرّب أفكار جريئة في `experiment` بدون المساس بالكود الشغال.\n- فريق كامل يتفرّع: واحد على `auth-feature`، تاني على `ui-fix` — من غير تضارب.\n- تقدر تقارن النتائج وتاخد اللي عجبك بس.",
      },
      {
        heading: "إنشاء والتنقل بين الفروع",
        body: "```bash\ngit branch                  # يعرض فروع المشروع\ngit branch feature-login    # يعمل فرع جديد\ngit switch feature-login    # ينتقل للفرع الجديد\n# أو في أمر واحد:\ngit switch -c feature-login\n```\n\n(الأمر القديم `git checkout <branch>` لسه شغال، بس `git switch` أوضح.)\n\nالفروع دي كلها محلية — مالهاش علاقة بـ GitHub إلى لما ترفعها.",
      },
      {
        heading: "الدمج Merge",
        body: "لما الميزة تخلص:\n\n```bash\ngit switch main             # انتقل للرئيسي\ngit merge feature-login     # ادمج الفرع فيه\n```\n\nلو مفيش تعديلات متضاربة على نفس السطور، الدمج تلقائي.\n\n**الفرع الأصلي بيفضل موجود** بعد الدمج — تقدر تحذفه لما تستقر على الكود:\n\n```bash\ngit branch -d feature-login\n```",
      },
      {
        heading: "النزاعات Merge Conflicts",
        body: "لما الاتنين (أنت والفرع الرئيسي) عدّلتوا نفس السطر في نفس الملف، Git مش بيعرف ياخد مين. بيحصل **نزاع**:\n\n```text\n<<<<<<< HEAD\nint age = 25;\n=======\nint age = 18;\n>>>>>>> feature-login\n```\n\nالحل يدوي: افتح الملف، احذف العلامات `<<<<<<<` و `=======` و `>>>>>>>`، واخلي النسخة اللي عايزها. بعدين:\n\n```bash\ngit add main.cpp\ngit commit                  # يكمل الدمج\n```\n\nالقاعدة الذهبية: **اتحاد صغير متكرر أفضل من دمج ضخم متباعد** — كلما طالت الفروع من غير ما تندمج، النزاعات تكبر.",
      },
    ],
    code: [
      {
        title: "دورة كاملة: فرع → شغل → دمج",
        language: "bash",
        code: `# أنشئ فرع جديد للميزة
git switch -c add-calculator

# اشتغل: عدّل الملفات ثم احفظ
git add .
git commit -m "feat: add divide function with zero check"

# لما تخلص — ادمج في main
git switch main
git merge add-calculator

# احذف الفرع القديم
git branch -d add-calculator`,
      },
    ],
    quiz: [
      {
        question: "الـ Branch ببساطته هو:",
        options: [
          "نسخة كاملة من المشروع تتخزن منفصلة",
          "مؤشر خفيف على آخر commit — خط تطوير مستقل",
          "أمر لرفع الملفات للإنترنت",
          "نوع من أنواع الذاكرة",
        ],
        answer: 1,
        explanation: "الفروع في Git هي مؤشرات — خفيفة وسريعة، مش نسخ من الملفات.",
      },
      {
        question: "ازاي تتنقل للفرع الرئيسي؟",
        options: [
          "git branch main",
          "git switch -c main",
          "git switch main",
          "git checkout -m main",
        ],
        answer: 2,
        explanation: "git switch main بيبدّل للفرع main — والفرع ده للمفروض يكون موجود.",
      },
      {
        question: "النزاع Merge Conflict بيحصل لما:",
        options: [
          "فرع بيتعمل",
          "الاتنين عدّلتهم نفس السطر في نفس الملف والدمج مش قادر يحسم",
          "الملف محذوف",
          "GitHub ما متاحش",
        ],
        answer: 1,
        explanation: "النزاع بيظهر عندما لا يستطيع الدمج التلقائي حسم نفس السطر المتغير.",
      },
    ],
    exercise:
      "في مشروعك: اعمل فرع `add-colors` باسم git switch -c، عدّل رسالة Hello World في hello.cpp لمعطى ملون، احفظ بـ commit، انتقل لـ main، ادمج الفرع، وشوف التاريخ بـ git log --oneline.",
    terms: [
      { en: "Branch", ar: "خط تطوير مستقل جوه المستودع — مؤشر خفيف على commit معين." },
      { en: "Merge", ar: "دمج تغييرات فرع في فرع آخر — بيرجع كل التعديلات في خط تاريخي واحد." },
      { en: "Merge Conflict", ar: "تعارض وقت الدمج لما نفس السطر يتغير في الفرعين — يلزمه حل يدوي." },
    ],
  },
  {
    id: "github-remote",
    title: "GitHub — المستودعات البعيدة والـ Pull Requests",
    titleEn: "GitHub: Remotes & Pull Requests",
    duration: "35 دقيقة",
    description:
      "من مستودع محلي لمشروع عالمي: إنشاء repo على GitHub، ربطه، رفع الشغل، فتح Pull Request ومراجعة شغل الآخرين.",
    sections: [
      {
        heading: "من المحلي للإنترنت: git remote",
        body: "مستودع Git على جهازك اسمه **local**. عندما تعمل نسخة على GitHub، هي **remote** — عادة باسم `origin`.\n\nالربط يتم مرة واحدة بعد إنشاء repo على الموقع:\n\n```bash\ngit remote add origin https://github.com/username/my-app.git\ngit remote -v\n```\n\nأول رفع للفرع الرئيسي:\n\n```bash\ngit push -u origin main\n```\n\nبعد كده أي دفعة كفاية تكتب `git push` بس.",
      },
      {
        heading: "push و pull و clone — الدورة الكاملة",
        body: "```bash\ngit push          # يرفع commits المحلية للـ remote\ngit pull          # ينزّل التغييرات من الـ remote ويدمجها عندك\ngit clone <url>   # ينزّل مستودع كامل لأول مرة\n```\n\nالقاعدة: **قبل ما تشتغل، pull. بعد ما تخلص، push.** كده عمرك ما هتحقق تعارض كبير.",
      },
      {
        heading: "Pull Request — روح GitHub الحقيقي",
        body: "لو شغال مع فريق، أو حتى لوحدك على مشروع مفتوح، الفكرة واحدة:\n\n1. اعمل فرع جديد للميزة، وخلّص عليه.\n2. ارفع الفرع على GitHub: `git push -u origin my-feature`\n3. افتح **Pull Request** من الموقع — اقتراح دمج الفرع في main.\n4. الفريق يراجع الكود، يقترح تعديلات، وبعدين الـ PR يتدمج.\n\nده مش مجرد \"رفع كود\" — ده ثقافة مراجعة وتعاون. حتى لو مشروع فردي، الـ PRs بتخليك تلخص التغيير وتراجعه بنفسك قبل الدمج.",
      },
      {
        heading: "GitHub كمعرض أعمال",
        body: "صورتك على GitHub بتتكلم عنك قبل سيرتك الذاتية:\n\n- **README** واضح على كل repo: إيه المشروع، ازاي تثبته وتشغّله، صور للناتج.\n- **مساهمات يومية خضراء** على البروفايل — استمر في رفع الشغل حتى لو صغير.\n- **Pin أهم المشاريع** في بروفايلك.\n- شارك في مشاريع مفتوحة المصدر — حتى typo fix بيتكتب في تاريخ المشروع.\n\nلما تتعلم Git صح، GitHub هيكون سيرتك الذاتية التلقائية.",
      },
    ],
    code: [
      {
        title: "رفع مشروع جديد لـ GitHub خطوة بخطوة",
        language: "bash",
        code: `# على جهازك (بعد git init و git commit)
git remote add origin https://github.com/<username>/my-cpp-app.git
git branch -M main
git push -u origin main

# سحب أي تعديلات من الزملاء
git pull

# رفع فرع ميزة جديدة وفتح Pull Request
git switch -c new-feature
git add .
git commit -m "feat: add feature"
git push -u origin new-feature
# ثم افتح الرابط اللي بيطلع في الطرفية على GitHub`,
      },
    ],
    quiz: [
      {
        question: "git remote -v بيعرض إيه؟",
        options: [
          "كل commit في المشروع",
          "عناوين المستودعات البعيدة (remotes) المرتبطة بالمشروع",
          "فروع المشروع",
          "حالة الـ staging",
        ],
        answer: 1,
        explanation: "remote -v بيوريك الـ URL بتاع origin وغيره — مع التأكد إن الربط سليم.",
      },
      {
        question: "إيه وظيفة الـ Pull Request؟",
        options: [
          "تحميل الملفات من الإسطول",
          "طلب دمج فرع في فرع آخر مع مراجعة الكود قبل الدمج",
          "حذف الفرع",
          "بناء المشروع",
        ],
        answer: 1,
        explanation: "PR هو آلية المراجعة والتعاون فوق Git — بيحوّل الدمج لمحادثة موثقة.",
      },
      {
        question: "القاعدة الذهبية قبل الشغل اليومي هي:",
        options: [
          "commit الأول",
          "git pull عشان يكون عندك آخر تعديلات من الـ remote",
          "git push",
          "git clone من جديد",
        ],
        answer: 1,
        explanation: "البدء بسحب آخر التغييرات بيمنع معظم النزاعات والدمج العشوائي.",
      },
    ],
    exercise:
      "أنشئ حساب GitHub (لو معندكش)، اعمل repo عام باسم my-first-repo، اربطه بمشروع C++ عندك، ارفع الكود، واكتب README بسيط فيه اسم المشروع ووصف وتعليمات التشغيل.",
    terms: [
      { en: "Remote", ar: "نسخة من المستودع على سيرفر بعيد (زي GitHub) بيتزامن معاها git push و git pull." },
      { en: "Pull Request", ar: "طلب دمج تغييرات فرع في آخر مع مراجعة من الفريق قبل الدمج." },
      { en: "origin", ar: "الاسم التقليدي للمستودع البعيد الأساسي المرتبط بمشروعك محليًا." },
    ],
  },
  {
    id: "git-pro",
    title: "أدوات باحترافية: stash, undo, tags — النجاة من الأخطاء",
    titleEn: "Pro Git: stash, Undo & Tags",
    duration: "30 دقيقة",
    description:
      "كيف ترجع التغييرات، كيف تحلّ بعيد شغل غير منتهي، وكيف تعمّل نسخ في حياتك البرمجية بـ Tags — الأدوات اللي بتفرق بين المبتدئ والمتمكن.",
    sections: [
      {
        heading: "git stash — إيقاف مؤقت آمن",
        body: "إنت شغال في منتصف ميزة جديدة، وجالك طلب تعديل عاجل على شيء تاني:\n\n```bash\ngit stash           # يخزّن كل التغييرات غير المحفوظة في جيب مؤقت\ngit switch main     # تعمل الشغل العاجل، وبعدين ترجع\ngit switch my-feature\ngit stash pop       # يرجّع تغييراتك من الجيب\n```\n\n`git stash list` بيعرض كل الـ stashes، و`git stash drop` بيحذف واحد.",
      },
      {
        heading: "التراجع — restore و reset و revert",
        body: "ثلاث أدوات للتراجع، كل واحدة لغرض:\n\n- **`git restore <file>`** — يرمي تعديلات ملف لآخر commit (لا رجعة فيه!).\n- **`git restore --staged <file>`** — يخرج ملف من الـ staging من غير ما يرمي تعديلاته.\n- **`git reset --soft HEAD~1`** — يمسح الـ commit الأخير بس يخلي التغييرات محضّرة (مفيد لما تكتب رسالة commit غلط).\n- **`git revert <commit>`** — بيعمل commit جديد يلغي أثر commit قديم — **الآمن للتاريخ المشترك** على GitHub.\n\nالفرق: `reset` بيعيد كتابة التاريخ، `revert` بيضيف commits عكسها — الأخير هو الصحيح بعد ما تكون رفعت الشغل.",
      },
      {
        heading: "Tags — اعتمد على نسخة رسمية",
        body: "لما المشروع يوصل لنسخة تستحق الاحتفال (مثلاً `v1.0.0`)، تعمّل وسم:\n\n```bash\ngit tag v1.0.0                      # وسم بسيط\ngit tag -a v1.0.0 -m \"الإصدار الأول\"  # وسم موثّق\ngit push origin v1.0.0              # رفع الوسم لـ GitHub\ngit tag                             # عرض كل الوسوم\n```\n\nوسم `v1.0.0` أفضل من branch — هو مؤشر ثابت على لحظة محددة في التاريخ. GitHub بيحوله لـ **Release** تقدر تعلق عليها ملفات إفراج.",
      },
      {
        heading: "قواعد إنقاذ الحياة",
        body: "- **التزم مبكرًا وكثيرًا** — خطأ صغير أسهل في الإصلاح من تغيير ضخم.\n- **متعملش force push على الـ main** — إلا في حالة خاصة واضحة للفريق.\n- **اقرأ الرسائل بحذر** — إذا بتراجع كود صاحبك، افهم إيه اللي اتغير قبل ما توافق.\n- **احترم الـ .gitignore** — لو نسيت وقت الـ commit الأول، `git rm --cached <file>` بيشيله من التتبع من غير ما يحذفه من الجهاز.",
      },
    ],
    code: [
      {
        title: "سيناريو واقعي: وقفت وقت الـ commit",
        language: "bash",
        code: `# حالة فجائية: ملف .env اتسجل بالغلط
git restore --staged .env        # أخرجه من التجهيز
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: remove env from tracking"

# لو الخطأ في آخر commit بس
git reset --soft HEAD~1          # يمحوه ويخلي التغييرات محضّرة
git commit -m "feat: رسالة صح دلوقتي"

# لو عازم تلغي commit قديم تم رفعه
git revert 3f2a1b4               # هيعمل commit عكس التأثير`,
      },
    ],
    quiz: [
      {
        question: "git stash بيعمل إيه؟",
        options: [
          "يحذف التغييرات نهائيًا",
          "يخزّن التغييرات غير المكتملة مؤقتًا عشان تقدر تنقل لمهمة تانية وترجع بعدها",
          "يرفع التغييرات للسيرفر",
          "يعرض الفرق بين ملفين",
        ],
        answer: 1,
        explanation: "Stash هو جيوب مؤقتة للتغييرات — مثالي للانتقال بين المهام دون فقدان الشغل.",
      },
      {
        question: "إيه الفرق بين reset و revert؟",
        options: [
          "الاتنين نفس الحاجة",
          "reset يعيد كتابة التاريخ (احذر بعد الـ push)، revert يضيف commit جديد يلغي الأثر",
          "revert يحذف المستودع",
          "reset للملفات و revert للفروع",
        ],
        answer: 1,
        explanation: "بعد الـ push استخدم revert — لأنه لا يعيد كتابة تاريخ مشترك مع الفريق.",
      },
      {
        question: "git tag v1.0.0 بيعمل إيه؟",
        options: [
          "ينشئ فرع جديد",
          "يضع علامة ثابتة على هذه اللحظة في التاريخ — مفيدة للإصدارات",
          "يحذف الـ commits القديمة",
          "يرفع الملف لGitHub Releases تلقائيًا",
        ],
        answer: 1,
        explanation: "الوسوم بتحدد لقطات مهمة في تاريخ المشروع — زي الإصدارات النهائية.",
      },
    ],
    exercise:
      "في مشروعك: اعمل stash لتغيير غير ملتزم به، انتقل لفرع آخر، عدّل، ارجع، و pop الـ stash — بعدين اعمل revert على آخر commit في تاريخك وتأكد إن الناتج عكس اللي كان فيه، واختم بـ git tag v0.1.0.",
    terms: [
      { en: "stash", ar: "تخزين مؤقت للتغييرات غير المحفوظة — عشان تتنقل بين المهام بدون فقدان الشغل." },
      { en: "reset", ar: "تحريك مؤشر الفرع وإعادة كتابة التاريخ — استخدمه بحذر بعد الـ push." },
      { en: "revert", ar: "commit جديد يلغي أثر commit قديم — الطريقة الآمنة بعد ما ترفع الشغل." },
      { en: "tag", ar: "علامة ثابتة على commit محدد — تُستخدم للإصدارات v1.0.0." },
    ],
  },
];
