import type { Lesson } from "../types";

/**
 * مسار متابعة Fundamentals Of Programming With C++ — ElZero Web School
 * Playlist: https://www.youtube.com/playlist?list=PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS
 * هذا الملف محتوى أصلي بالعربي بأسلوب ETM، ويرتبط بأرقام الفيديوهات من الجدول الرسمي
 * على GitHub: https://github.com/ElzeroWebSchool/Fundamentals_Of_Programming
 */
export const lessons: Lesson[] = [
  {
    id: "zero-intro",
    title: "كورس الزيرو: المقدمة وإزاي C++ بتشتغل",
    titleEn: "ElZero Fundamentals — Introduction & How C++ Works",
    duration: "40 دقيقة",
    description:
      "نقطة بداية مسار الزيرو فيديوهات #001 لحد #008: ليه C++، تثبيت الأدوات، ودورة حياة برنامج C++ من الكود لحد التنفيذ.",
    sections: [
      {
        heading: "تغطي الفيديوهات #001 – #008",
        body: "المحور ده بيحطك على الخريطة قبل ما تكتب أي كود: إيه الكورس ده ومناسب لمين، وليه C++ بالذات للي عايز يفهم الكمبيوتر من جوا، واختيار المحرر والمترجم والمصحح (Debugger)، وتثبيت VS Code أو Visual Studio، و**دورة حياة الكود**: Preprocessing → Compiling → Linking → تنفيذ، و**أساسيات صياغة C++** (Syntax)، والتعليقات واستخداماتها.",
      },
      {
        body: "تخيّل إنك بتكتب وصفة طبخ. الورقة اللي كتبتها (الكود) مش الأكلة نفسها — لازم حد يترجمها لخطوات الكمبيوتر يفهمها. المترجم Compiler هو الشيف اللي بيقرا الوصفة بالحرف، والمصحح Debugger هو اللي بيخليك تراقب كل خطوة لو الأكلة طلعت مالحة.\n\nفي C++ لازم تعرف دورة الحياة كاملة:\n\n- **Preprocessing:** المعالج المسبق بيعالج الأسطر اللي بتبدأ بـ `#` (زي `#include`) قبل ما المترجم يشتغل.\n- **Compiling:** المترجم بيحوّل الكود لملف Object Code بلغة الآلة.\n- **Linking:** الربط بيلصق الأجزاء والأجزاء الجاهزة (المكتبات) في برنامج واحد.\n- **Executing:** التنفيذ بيبدأ دايمًا من `main` وينفذ سطر بسطر.",
        heading: "إزاي C++ بتشتغل من جوا؟",
      },
      {
        heading: "اختيار أدواتك",
        body: "مش لازم تدفع فلوس عشان تبدأ:\n\n- **محرر خفيف:** VS Code + إضافة C/C++ — ممتاز للمذاكرة والتمارين.\n- **مترجم:** MinGW-w64 (GCC) — بيجي مع VS Code أو هتركّبه لوحده.\n- **مصحح:** GDB أو Debugger بتاع VS Code — عشان تتبع القيم سطر بسطر.\n- **البديل الأثقل:** Visual Studio IDE — ممتاز للمشاريع الكبيرة.\n\nالقاعدة: اكتب برامج صغيرة وشغّلها في الملعب بتاعنا هنا كل يوم، عشان التثبيت يبقى حاجة جانبية مش حاجز قدامك.",
      },
      {
        heading: "تتبع مصطلحات البداية",
        body: "احفظ المصطلحات دي من الأول عشان هتسمعها كل يوم في الفيديوهات:\nCompiler = المترجم، IDE = بيئة التطوير المتكاملة، Source Code = الكود المصدري، Preprocessor = المعالج المسبق، Debug = تتبع وتصحيح الأخطاء. كل مصطلح في الدرس ده مربوط بفيديوهات #001 لحد #008.",
      },
    ],
    code: [
      {
        title: "برنامج C++ بكل المراحل مذكور في التعليقات",
        language: "cpp",
        code: `// المحرر: VS Code
// المترجم: g++  (g++ -std=c++17 main.cpp -o main)
// التنفيذ: ./main  (يعني البرنامج يبدأ من main)
#include <iostream>
using namespace std;

int main() {
    cout << "Start C++ with ElZero path" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الترتيب الصح لدورة حياة برنامج C++؟",
        options: [
          "Linking ثم Compiling ثم Preprocessing",
          "Preprocessing ثم Compiling ثم Linking ثم Executing",
          "Executing ثم Linking ثم Compiling",
          "Compiling بس",
        ],
        answer: 1,
        explanation: "المعالج المسبق الأول، بعدين المترجم، بعدين الربط، وبعدين التنفيذ.",
      },
      {
        question: "الـ Debugger (المصحح) فايدته إيه؟",
        options: ["يترجم الكود أسرع", "تتبع تنفيذ الكود سطر بسطر وملاحظة القيم", "يكتب كود مكانك", "يطبع النصوص"],
        answer: 1,
      },
      {
        question: "فيديوهات #001 لحد #008 في مسار الزيرو بتغطي إيه؟",
        options: ["المتغيرات والثوابت", "المقدمة واختيار الأدوات وازاي C++ بتشتغل", "المؤشرات", "الـ Vector"],
        answer: 1,
      },
    ],
    exercise: "ثبّت VS Code + MinGW أو استخدم ملعب ETM، اكتب برنامج \"أهلاً بيك في مسار الزيرو\" وترجمه وشغّله. لو حصل خطأ، اقرأ رسالة الـ Compiler رقم السطر واتتبعه في المصحح.",
    terms: [
      { en: "Compiler", ar: "المترجم: برنامج بيحوّل الكود المصدري للغة الآلة." },
      { en: "Preprocessor", ar: "المعالج المسبق: بيعالج الأسطر اللي بتبدأ بـ # قبل الترجمة." },
      { en: "Linker", ar: "الرابط: بيلصق الأجزاء والمكتبات في برنامج تنفيذي واحد." },
      { en: "Debugger", ar: "المصحح: أداة تتبع التنفيذ سطر بسطر لاكتشاف الأخطاء." },
      { en: "Source Code", ar: "الكود المصدري: النص اللي كاتبه الإنسان بلغة C++." },
    ],
  },
  {
    id: "zero-variables",
    title: "المتغيرات والثوابت",
    titleEn: "ElZero Fundamentals — Variables & Constants",
    duration: "45 دقيقة",
    description:
      "فيديوهات #009 لحد #015: تعريف المتغير، قواعد التسمية، النطاق Scope، الثوابت const، وتطبيقات صغيرة زي احسب العمر وحروف الهروب Escape Sequences.",
    sections: [
      {
        heading: "تغطي الفيديوهات #009 – #015",
        body: "بعد ما تستقر على أدواتك، لازم تعيش مع المتغيرات يوميًا. الفيديوهات دي بتغطي: إيه المتغير أصلًا، قواعد التسمية والممارسات الصح، الفرق بين التصريح والتعريف، المتغير المتقدم والنطاق Scope، إعلان متغير ثابت const، تطبيق احسب العمر Calculate Age، وحروف الهروب Escape Sequences.",
      },
      {
        heading: "المتغير = علبة مسماة في الذاكرة",
        body: "الكمبيوتر بيخزن كل حاجة في الذاكرة RAM. المتغير (Variable) هو **اسم بيشاور على عنوان** فيه قيمة، تعرف الكمبيوتر بالنوع والقيمة مرة واحدة:\n\n```text\nint age = 20;\n```\n\nهنا `int` هو النوع (مساحة في الذاكرة تكفي رقمًا صحيحًا)، `age` هو الاسم، و`20` هي القيمة اللي اتخزنت. في C++ النوع ثابت — مش هينفع تخزن كلمة في `int` بعدين.",
      },
      {
        heading: "النطاق Scope والثابت const",
        body: "النطاق Scope يعني المتغير عايش جوه أنهي كتلة `{ }`. متغير جوه حلقة مثالًا بيختفي بعد `}` بتاعتها، ومش هتقدر تستخدمه بره. عشان كده دلوقتي اعمل كل متغير جو دورة بدء صغيرة جوه الحلقة.\n\nأما الثابت `const` فهو متغير مش هيتغير تاني أبدًا — ممتاز للحاجات اللي ماينفعش تتعدل:\n\n```cpp\nconst double PI = 3.14159;\nconst int MAX_STUDENTS = 50;\n```\n\nلو حاولت تغيّره المترجم هيمنعك — وده أمان ليك وللي بيقرأ الكود بعدك.\n\n**حروف الهروب:** الرمز `\\n` سطر جديد، `\\t` تاب، و`\\\\` للشرطة المائلة نفسها.",
      },
      {
        heading: "أمثلة سريعة للحفظ",
        body: "اتبع القواعد دي عشان كودك يبقى مقبول عند أي مبرمج:\n\n- سمِّ المتغير باسم يشرح معناه: `totalPrice` أحسن من `x`.\n- لا تبدأ الرقم: `1st` غلط، استخدم `firstNumber`.\n- اعمل تهيئة من أولها: `int count = 0;` أحسن من متغير فاضي.\n- الثوابت في الأعلى بحروف كبيرة: `MAX_SIZE`.\n\nلو حفظت الأربع قواعد دول من دلوقتي، هتتفادى نص المشاكل قبل ما تبدأ الحلقات والدوال.",
      },
    ],
    code: [
      {
        title: "تطبيق احسب العمر + حروف الهروب",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

int main() {
    const int CURRENT_YEAR = 2026;
    int birthYear = 2005;
    int age = CURRENT_YEAR - birthYear;

    cout << "السنة الحالية: " << CURRENT_YEAR << endl;
    cout << "العمر: " << age << " سنة" << endl;
    cout << "سطر جديد\\tوالمسافة\\تTab" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "الـ Scope هو إيه؟",
        options: ["نوع المتغير", "النطاق اللي المتغير عايش ومتاح فيه", "سرعة الترجمة", "اسم الملف"],
        answer: 1,
        explanation: "المتغير المتعرّف جوه { } مش متاح برا الكتلة بتاعته.",
      },
      {
        question: "ليه بنستخدم const؟",
        options: ["لامتغيرات مش هتتغير أبدًا وحماية من الخطأ", "عشان البرنامج يمشي أسرع", "لأن int وحش", "مريح بس"],
        answer: 0,
      },
      {
        question: "معنى `\\n` في النص؟",
        options: ["تاب", "سطر جديد", "شرطة مائلة", "خلاصة الخطأ"],
        answer: 1,
      },
    ],
    exercise: "اكتب برنامج يسأل عن سنة الميلاد ويحسب العمر ثابتًا على سنة 2026، استخدم const للسنة الحالية واكتب المخرج بسطرين منفصلين بـ \\n.",
    terms: [
      { en: "Variable", ar: "المتغير: علبة مسماة في الذاكرة لتخزين قيمة." },
      { en: "Scope", ar: "النطاق: المنطقة اللي المتغير متاح فيها جوه الكود." },
      { en: "Constant (const)", ar: "الثابت: متغير قيمته مش بتتغير بعد التعريف." },
      { en: "Escape Sequence", ar: "حرف الهروب: زي \\n و \\t لازم يدخل كنصيًا جوه السلسلة." },
    ],
  },
  {
    id: "zero-data-types",
    title: "أنواع البيانات وأحجامها",
    titleEn: "ElZero Fundamentals — Data Types",
    duration: "50 دقيقة",
    description:
      "فيديوهات #016 لحد #023: إيه البيانات؟ الأحجام في الذاكرة، الأعداد الصحيحة، العشرية، الـ Char و ASCII، Boolean و Void، المعدّلات Modifiers، والتحويل الصريح والضمني.",
    sections: [
      {
        heading: "تغطي الفيديوهات #016 – #023",
        body: "كل قيمة في البرنامج تتمثل بشكل معين في الذاكرة. المحور ده بيغطي: إيه البيانات؟ الأحجام في الذاكرة، الأعداد الصحيحة Integer، العشرية Float و Double، الـ Char وقيمة ASCII، Boolean و Void، المعدّلات واسم بديل النوع Type Alias، والتحويل الضمني والصريح بين الأنواع.",
      },
      {
        heading: "إيه البيانات؟ ليه الأحجام مهمة؟",
        body: "الكمبيوتر بيخزن صفر و واحد (Bit) و8 بت = Byte. كل نوع ليه حجم ومدى:\n\n- `int`: رقم صحيح، غالبًا 4 بايت، من حوالي `±2 مليار`.\n- `short`: 2 بايت، مدى صغير.\n- `long long`: 8 بايت، أرقام كبيرة جدًا.\n- `float`: عشري بدقة أقل، 4 بايت.\n- `double`: عشري بدقة أعلى، 8 بايت.\n- `char`: حرف واحد، 1 بايت.\n- `bool`: صح أو غلط، يعتبر 1 بايت في الذاكرة.\n\nنصيحة الزيرو اللي بتتكرر: استخدم `int` محدد المقدار زي `int32_t` و `int64_t` من مكتبة `<cstdint>` لو عايز برنامجك يشتغل زي ما هو على أي جهاز.",
      },
      {
        heading: "الـ Char و ASCII و الـ Modifiers",
        body: "الـ `char` مش حرف بس — هو رقم في جدول ASCII:\n\n```cpp\nchar c = 'A';\ncout << (int)c; // 65\n```\n\nالـ **Modifiers** بتغير مدى النوع: `unsigned` بيشيل الإشارة ويضاعف النطاق للوجب (من `0` لـ `255` بدل `-128` لحد `127` في `unsigned char`). و`type alias` زي `using Price = double;` بيخلي النوع أوضح بكتير في المشاريع الكبيرة.",
      },
      {
        heading: "التحويل التلقائي والصريح",
        body: "C++ هتحوّل تلقائيًا من الصغير للكبير: `int x = 100; double y = x; // هيبقى 100.0`، لكنها **هتخسر البيانات** لو حوّلت كبير وصغير مثلًا من `double` لـ `int` هتشيل الكسر. الصريح `static_cast<int>(3.9)` بيقول للمترجم \"أنت شايف كده وأنا موافق على الخسارة\" — استخدمه بوعي.",
      },
    ],
    code: [
      {
        title: "أنواع البيانات والتحويل",
        language: "cpp",
        code: `#include <iostream>
#include <cstdint>
using namespace std;

int main() {
    int8_t small = 100;            // 1 بايت
    int32_t normal = -2000000000;  // 4 بايت
    int64_t big = 9000000000LL;    // 8 بايت

    float f = 3.14159f;
    double d = 3.14159265358979;

    char c = 'A';
    cout << c << " = " << (int)c << endl; // A = 65
    cout << "size int = " << sizeof(int) << endl;
    cout << "size double = " << sizeof(double) << endl;

    int truncated = static_cast<int>(3.9); // 3 !
    cout << "3.9 بعد التحويل ل int = " << truncated << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "الفرق بين float و double؟",
        options: ["مفيش فرق", "double دقة أكبر وحجم 8 بايت", "float أكبر دقة", "double للصحيح بس"],
        answer: 1,
      },
      {
        question: "`(int)'A'` في ASCII بتساوي إيه؟",
        options: ["0", "65", "97", "256"],
        answer: 1,
      },
      {
        question: "التحويل الصريح static_cast معناه إيه؟",
        options: ["تحويل تلقائي", "طلب صريح من المبرمج لتحويل نوع مع خسارة محتملة", "حذف المتغير", "حلقة"],
        answer: 1,
      },
    ],
    exercise: "اطبع sizeof لكل نوع أساسي (int, float, double, char, bool) وحوّل قيمة عشرية لصحيح وصنّفها — لاحظ خسارة الكسر.",
    terms: [
      { en: "Data Type", ar: "نوع البيانات: حجم ومدى القيمة اللي تتخزن في الذاكرة." },
      { en: "ASCII", ar: "جدول الحروف والأرقام مقابل الأرقام — A مثلًا = 65." },
      { en: "Modifier (unsigned)", ar: "المعدّل: بيغير مدى النوع زي unsigned و signed." },
      { en: "Implicit / Explicit Cast", ar: "التحويل الضمني تلقائي، والصريح بتطلبه static_cast." },
    ],
  },
  {
    id: "zero-operators",
    title: "مؤشرات العوامل (Operators) وأولوياتها",
    titleEn: "ElZero Fundamentals — Operators",
    duration: "45 دقيقة",
    description:
      "فيديوهات #024 لحد #029: الحساب، الإسناد، الزيادة والنقصان، المقارنة، المنطقية، وأولوية العمليات Precedence.",
    sections: [
      {
        heading: "تغطي الفيديوهات #024 – #029",
        body: "أي كود برمجي = معالجة معلومات بمؤثرات Operators. الفيديوهات دي بتغطي: الحساب Arithmetic، الإسناد Assignment، الزيادة والنقصان Increment و Decrement، المقارنة Comparison، المنطقية Logical، وأولوية العوامل Precedence.",
      },
      {
        heading: "الحساب والإسناد والزيادة",
        body: "مثال الحساب الأساسي:\n\n```cpp\nint x = 10 + 3 * 2; // 16 يعني الضرب قبل الجمع\n```\n\n- الإسناد `=` يخزن، `+=` معناه اجمع وخزّن: `x += 5` تساوي `x = x + 5`.\n- باقي القسمة `%` معناها المتبقي: `7 % 3 = 1`.\n- الزيادة `++` والنقصان `--`: `x++` زيادة بعد الاستخدام، و`++x` قبل الاستخدام — الفرق مهم في حل الجمل المعقدة.",
      },
      {
        heading: "المقارنة والمنطقية",
        body: "المقارنة بترجع `true` أو `false`:\n\n`==` مساوي، `!=` مختلف، `>` أكبر، `<` أصغر.\n\nوالمنطقية تربط الشروط:\n\n- `&&` يعني «و» — الشرطان صح.\n- `||` يعني «أو» — شرطان واحد صح.\n- `!` يعني «نفي» — عكس الحالة.\n\nكمثال: `if (age >= 0 && age < 120)` يعني العمر منطقي.",
      },
      {
        heading: "الأولويات Precedence",
        body: "القاعدة الذهبية: استخدم الأقواس دايمًا واعمل نفسك مش فاكر الأولويات لحد ما الحل تعود على عينك:\n\n```cpp\nbool ok = a > 0 && b < 10 || c == 5;\n// معناه: (a > 0 && b < 10) || (c == 5)\n```\n\nالترتيب التقريبي: `* / %` قبل `+ -` قبل المقارنات قبل `&&` قبل `||` قبل الإسناد. لو عندك شك، حط أقواس لا إراديًا.",
      },
    ],
    code: [
      {
        title: "عوامل كاملة في مثال واحد",
        language: "cpp",
        code: `#include <iostream>
using namespace std;
int main() {
    int a = 10;
    a += 5;               // 15
    int b = a++ + ++a;    // 15 + 17 = 32  -- مثال على الفرق post/pre
    cout << "a=" << a << " b=" << b << endl;

    cout << (7 % 3) << endl; // 1
    bool ok = (a > 0 && a < 100) || b == 32;
    cout << ok << endl;      // 1 = true
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "ناتج `10 + 3 * 2` هو إيه؟",
        options: ["26", "16", "20", "13"],
        answer: 1,
      },
      {
        question: "معنى `7 % 3` هو إيه؟",
        options: ["2", "1", "4", "0"],
        answer: 1,
        explanation: "القسمة: 7 = 2*3 + 1، فالباقي 1.",
      },
      {
        question: "x += 5 تساوي إيه؟",
        options: ["x = x + 5", "x = 5", "x = 5 + x - x", "x ++"],
        answer: 0,
      },
    ],
    exercise: "اكتب برنامج حساب فاتورة: حاسب بعدد القطع وسعر القطعة والضريبة، واستخدم += و % و أقواس لأولويات صحيحة. جرّب a++ مقابل ++a وحط النواتج في جدول.",
    terms: [
      { en: "Operator", ar: "المؤثر: رمز بيقول للمترجم نوع العملية زي + و == و &&." },
      { en: "Precedence", ar: "الأولوية: تريتيب تنفيذ العوامل قبل بعضها." },
      { en: "Increment (++)", ar: "الزيادة بواحد: قبل الاستخدام ++x وبعد الاستخدام x++." },
      { en: "Assignment", ar: "الإسناد: = يخزن، += يعني اجمع وخزّن." },
    ],
  },
  {
    id: "zero-if",
    title: "شرط If — واتخاذ القرار",
    titleEn: "ElZero Fundamentals — If Condition",
    duration: "45 دقيقة",
    description:
      "فيديوهات #030 لحد #035: If الأساسي، Else و Else If، الشروط المتداخلة، ternary، الشروط المتداخلة الثلاثية، و4 تطبيقات تدريبية.",
    sections: [
      {
        heading: "تغطي الفيديوهات #030 – #035",
        body: "البرمجة من غير شروط = وصفة طبخ ثابتة. الفيديوهات دي بتغطي: مقدمة If، If Else If Else، الشروط المتداخلة Nested If، عامل الشرط الثلاثي Ternary، الشروط الثلاثية المتداخلة، وتدريبات If في 4 تطبيقات كاملة.",
      },
      {
        heading: "الأساس: If Else و Else If",
        body: "الصيغة الحفظ:\n\n```cpp\nif (score >= 90) {\n  cout << \"ممتاز\";\n} else if (score >= 70) {\n  cout << \"جيد\";\n} else {\n  cout << \"نحسّن\";\n}\n```\n\n- `if` عند أول شرط يطلع صح بيتنفذ ويكمل من بعده.\n- `else if` يعرض بدائل متسلسلة.\n- `else` ملاذ أخير لو مفيش شرط تحقق.\n\nنصيحة عملية: خلي الشروط من الأقوى للأضعف عشان اللوجك ما يضيعش — أكبر من 90 قبل أكبر من 70.",
      },
      {
        heading: "المتداخلة والثلاثية",
        body: "الشرط المتداخل Nested يعني `if` جوه `if`:\n\n```cpp\nif (age >= 18) {\n  if (hasCard) cout << \"يدخل\";\n  else cout << \"دفع الكارت\";\n}\n```\n\nالثلاثية Ternary شكل مضغوط لسطر واحد:\n\n```cpp\nstring result = (score >= 50) ? \"ناجح\" : \"راسب\";\n```\n\nاستخدم الثلاثي بس للاختيارات البسيطة ثنائية الحالة. لو اللوجك طويل أو متداخل، `if` العادية أوضح بكتير.",
      },
      {
        heading: "4 تطبيقات هتفهمها لوحدك",
        body: "بنفسك فكّر في التطبيقات دول وبعدين اكتبهم في الملعب:\n\n1. **درجة نجاح:** اسأل درجة الطالب وحدد النتيجة باللوجك.\n2. **نوع العدد:** زوجي أم فردي؟ تستخدم `% 2`.\n3. **آلة حاسبة مبسطة:** اسأل عن رقمين وعملية واعرض النتيجة.\n4. **أكبر عدد:** خد 3 أرقام واطبع الأكبر بأقل كود ممكن.",
      },
    ],
    code: [
      {
        title: "نتيجة طالب بـ If متداخلة + Ternary",
        language: "cpp",
        code: `#include <iostream>
using namespace std;
int main() {
    int score = 85;
    string grade;
    if (score >= 90) grade = "A+";
    else if (score >= 80) grade = "A";
    else if (score >= 50) grade = "ناجح";
    else grade = "راسب";

    cout << grade << endl;
    string state = (score >= 50) ? "مقبول في الجامعة" : "راجع كمان";
    cout << state << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: " ternary هو شكل مختصر لـ إيه؟",
        options: ["حلقة مختصرة", "If بسطر واحد", "دالة", "مصفوفة"],
        answer: 1,
      },
      {
        question: "لو score = 85 و score >= 90 يتنفذ؟",
        options: ["ايوه", "لا، هيتحقق 80", "هيكمل التلاتة", "هيعسكر"],
        answer: 1,
      },
      {
        question: "الـ Nested If يعني إيه؟",
        options: ["كتابة شرط طويل", "If داخل If", "كتابة else بدون if", "Skip"],
        answer: 1,
      },
    ],
    exercise: "اكتب تطبيق الأربع أفكار من section: ناجح/راسب، زوجي/فردي، آلة حاسبةائرها، أكبر ثلاث أرقام — كل تطبيق في برنامج لوحدك.",
    terms: [
      { en: "Condition", ar: "الشرط: تعبير بيقيم لـ true أو false." },
      { en: "Nested If", ar: "الشرط المتداخل: كتلة If جوه كتلة If تانية." },
      { en: "Ternary Operator (? :)", ar: "المؤثر الثلاثي: اختصار If لسطر واحد." },
    ],
  },
  {
    id: "zero-switch",
    title: "Switch, Case — القرار المتعدد",
    titleEn: "ElZero Fundamentals — Switch & Case",
    duration: "30 دقيقة",
    description:
      "فيديوهات #036 لحد #037: شرح Switch و Case، و3 تطبيقات عملية كاملة على القرار المتعدد.",
    sections: [
      {
        heading: "تغطي الفيديوهات #036 – #037",
        body: "لما القرار يكون مبني على خيارات صريحة ومحدودة (اختيار من قائمة، رقم شهور السنة، عملية حسابية)، `switch` بيبقى أنظف بكتير من 10 شروط ورا بعض. الفيديوهات دي بتشرح `switch` مع `case` وسيناريو 3 تطبيقات.",
      },
      {
        heading: "الصيغة الأساسية",
        body: "الهيكل القياسي:\n\n```cpp\nint x;\ncin >> x;\nswitch (x) {\n  case 1: cout << \"واحد\"; break;\n  case 2: cout << \"اتنين\"; break;\n  default: cout << \"خارج الاختيار\";\n}\n```\n\n- **القاعدة الذهبية:** لا تنسَ `break` — لو نسيته هيكمل لكل الحالة اللي بعدها Fall-Through.\n- `default` هو الـ else بتاعك — لازم يبقى موجود دايمًا.\n\nمقارنة سريعة: `if` بتشتغل مع أي تعبير منطقي (`>`, `<`)، لكن `switch` في C++11 بيشتغل مع القيم الثابتة (أرقام، حروف، تعدادات).",
      },
      {
        heading: "3 تطبيقات: آلة حاسبة، درجة، اختيار",
        body: "طبّق نفسك المشاريع دول:\n\n1. **آلة حاسبة مبسطة:** خلي المستخدم يختار بين `+ - * /` بـ `char` وحوّل لكل اختيار ينفذ عملية مختلفة.\n2. **درجة كبشها لسلسة:** اكتب `switch` بدل `if` لدرجات `A, B, C, F`.\n3. **قائمة اختيار:** اعمل برنامج مطعم بسيط — اختار رقم الوجبة واطبع اسمها وسعرها.",
      },
    ],
    code: [
      {
        title: "آلة حاسبة بـ Switch",
        language: "cpp",
        code: `#include <iostream>
using namespace std;
int main() {
    double a = 10, b = 3;
    char op = '*';
    double result;
    switch (op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = a / b; break;
        default: cout << "عملية غلط" << endl; return 1;
    }
    cout << a << " " << op << " " << b << " = " << result << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "نسيان break في switch بيسبب إيه؟",
        options: ["أكتر سرعة", "Fall-Through يكمل للـ case الجاية", "خطأ مترجم", "يقلل حجم الملف"],
        answer: 1,
      },
      {
        question: "default ده بيمثل إيه؟",
        options: ["أول حالة", "حالة الاختبار البديلة (زي else)", "كلمة ثابتة", "نوع متغير"],
        answer: 1,
      },
      {
        question: "switch أنظف لما يكون الـ شرط مبني على إيه؟",
        options: ["متغير منطقي", "قيم ثابتة محدودة زي رقم أو حرف", "مقارنة > <", "دالة"],
        answer: 1,
      },
    ],
    exercise: "اكتب آلة حاسبة كاملة بـ switch (جمع/طرح/ضرب/قسمة) + منظومة درجات بحروف (A, B, C, F) + قائمة مطعم. نسيان break هيخلط التطبيقات — تأكد.",
    terms: [
      { en: "switch", ar: "اختيار متعدد: يختار بين cases على حسب قيمة ثابتة." },
      { en: "case", ar: "الحالة: قيمة ثابتة واحدة في switch." },
      { en: "break (in switch)", ar: "الوقف: بيمنع Fall-Through للكيس الجاية." },
      { en: "default", ar: "القيمة الافتراضية: البديل لما مفيش case يطابق." },
    ],
  },
  {
    id: "zero-array",
    title: "المصفوفة Array — التخزين المتسلسل",
    titleEn: "ElZero Fundamentals — Array",
    duration: "55 دقيقة",
    description:
      "فيديوهات #038 لحد #044: إيه المصفوفة؟ الوصول للعناصر ومواقع الذاكرة، الإضافة والتعديل، متعددة الأبعاد، كلاس Array، الأساليب، ولعبة Guess The Number.",
    sections: [
      {
        heading: "تغطي الفيديوهات #038 – #044",
        body: "المصفوفة (Array) هي ابسط طريقة تخزن مجموعة قيم تحت نفس الاسم. الفيديوهات دي بتغطي: إيه المصفوفة؟ الوصول للعناصر ومواقع الذاكرة، الإضافة والتعديل، المصفوفة متعددة الأبعاد، كلاس `array` من STL، الأساليب والمناقشة، ولعبة تخمين الرقم Guess The Number.",
      },
      {
        heading: "إيه المصفوفة؟",
        body: "تخيل بيت فيه شقق متسلسلة جنب بعض في نفس رقم الشقة. المقاس هو الحجم، الاسم هو عنوان البيت، والفهرس (Index) هو رقم الشقة — بيبدأ من `0` دايمًا:\n\n```cpp\nint scores[5] = {10, 20, 30, 40, 50};\ncout << scores[0]; // أول عنصر = 10\ncout << scores[4]; // آخر عنصر = 50\n```\n\nالمصفوفة العادية حجمها ثابت — لو عايز حجم متغير، عندك `vector` جاية قدام in #067.",
      },
      {
        heading: "الذاكرة والبعد المتعدد",
        body: "المصفوفة بتتخزن متسلسل في الذاكرة، عشان كده `scores[2]` دايمًا موجود بعد `[0]` و `[1]` بمسافة `sizeof(int)`. البعد المتعدد زي `int grid[2][3]` جدول صفوف وأعمدة:\n\n```cpp\nint matrix[2][3] = {{1,2,3}, {4,5,6}};\ncout << matrix[1][2]; // 6\n```\n\nكل جديدين `i` للصف و `j` للعمود. كل `-1` أو خطر برا الحدود هي `undefined` وغالبًا Crash — احذر دايمًا.",
      },
      {
        heading: "array والأساليب ولعبة الأرقام",
        body: "`std::array` Modern C++ بديل آمن للمصفوفة العادية — حجمها كـ Template وبتيجي معها دوال جاهزة:\n\n```cpp\n#include <array>\nstd::array<int, 3> a = {5, 6, 7};\ncout << a.at(1); // آمن يرمي exception لو بره\n```\n\nالطرق الحديثة: `a.size()`، `a.fill(x)`، Iteration بـ Ranged Loop. أما لعبة Guess The Number فهي حلقة + مولد عشوائي + وداع — طبّقها بنفسك كلاين تاني.",
      },
    ],
    code: [
      {
        title: "مصفوفة + متعددة الأبعاد",
        language: "cpp",
        code: `#include <iostream>
#include <array>
using namespace std;
int main() {
    int scores[5] = {85, 90, 78, 92, 88};
    cout << scores[0] << " " << scores[4] << endl;

    int matrix[2][3] = {{1,2,3}, {4,5,6}};
    for (int i = 0; i < 2; ++i) {
        for (int j = 0; j < 3; ++j) cout << matrix[i][j] << " ";
        cout << endl;
    }

    array<int, 3> modern = {5, 6, 7};
    cout << modern.size() << " " << modern.at(1) << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "فهرس أول عنصر في المصفوفة بيبدأ بكام؟",
        options: ["1", "0", "-1", "عشوائي"],
        answer: 1,
      },
      {
        question: "أحسن ميزة لـ std::array عن المصفوفة العادية؟",
        options: ["أسرع", "أمان + دوال جاهزة زي size و at", "حجم مفتوح", "نوع مختلف"],
        answer: 1,
      },
      {
        question: "مصفوفة بعدين [2][3] معناها إيه؟",
        options: ["3 صفوف 2 أعمدة", "2 صف 3 أعمدة", "6 عناصر فقط", "مستحيل"],
        answer: 1,
      },
    ],
    exercise: "اكتب لعبة تخمين رقم: ولّد رقمًا من 1 لحد 100 واخلي المستخدم يخمنه مع رسائل «أعلى» / «أقل». أضف عداد محاولات واستخدم rand() و srand(time(0)).",
    terms: [
      { en: "Array", ar: "المصفوفة: مجموعة قيم متسلسلة بنفس النوع والاسم." },
      { en: "Index", ar: "الفهرس: رقم العنصر — بيبدأ من صفر (0)." },
      { en: "Multidimensional Array", ar: "المصفوفة متعددة الأبعاد: جدول صفوف × أعمدة." },
      { en: "std::array", ar: "كلاس Array الحديث: آمن ودوال جاهزة." },
    ],
  },
  {
    id: "zero-string",
    title: "النصوص String — التعامل مع الكلام",
    titleEn: "ElZero Fundamentals — String",
    duration: "35 دقيقة",
    description:
      "فيديوهات #045 لحد #046: إيه الـ String؟ الدمج Concatenation، وازاي تبني نصوص معقدة بأمان.",
    sections: [
      {
        heading: "تغطي الفيديوهات #045 – #046",
        body: "النصوص (String) هي المادة الخام للواجهات — أسماء، رسائل، أوامر. الفيديوهات دي بتغطي: إيه الـ String؟ ودمج النصوص Concatenation وبناء نصوص كاملة من أجزاء.",
      },
      {
        heading: "إيه الـ String؟",
        body: "في C++ الـ String مش مجرد صورة، هو سلسلة من الحروف `char` معاها أدوات مساعدة `string`:\n\n```cpp\n#include <string>\nstring name = \"Osama\";\ncout << name << name.size(); // 5\n```\n\nالأهمية: النصوص لا تنتهي باين — استخدم `string` الحديثة، مش `char[]` القديمة، إلا لو بتشتغل على مستوى النظام فعليًا.",
      },
      {
        heading: "الدمج Concatenation",
        body: "إزاي تبني رسالة من أجزاء:\n\n```cpp\nstring first = \"مرحبا \";\nstring name = \"محمد\";\nstring msg = first + name + \"!\"; // مرحبا محمد!\n```\n\nينفع تدمج نص + رقم: `\"مرحبا \" + to_string(25)` — واستخدم `<<` في الطباعة عشان يطلع كله في سطر واحد.\n\nالفكرة الكبيرة: النص بيتكون حروف، كل ما تدمج أكتر بقي أطول، ولو محتاج سطر جديد استخدم `\\n` أو `endl`.",
      },
    ],
    code: [
      {
        title: "دمج النصوص",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;
int main() {
    string firstName = "أهلاً ";
    string lastName = "بزميلنا المبرمج";
    string msg = firstName + lastName + "\\nخمسة زائد سبعة = " + to_string(5+7);
    cout << msg << endl;
    cout << "طول السلسلة: " << msg.size() << endl;
    cout << "أول حرف: " << msg[0] << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه أبسط طريقة تدمج نصّين؟",
        options: ["Concatenation بـ +", "Division", "بجمعهم من غير +", "Call"],
        answer: 0,
      },
      {
        question: "msg.size() معناه إيه؟",
        options: ["قيمة النص", "طول النص بعدد الحروف", "اسم المتغير", "محتوى إضافي"],
        answer: 1,
      },
    ],
    exercise: "اكتب برنامج يسأل الاسم الأول والأخير والعمر، واطبع تحية مدمجة في أسطر مع عدّ الطول.",
    terms: [
      { en: "String", ar: "النص: سلسلة أحرف نتعامل معاها كوحدة واحدة." },
      { en: "Concatenation", ar: "الدمج: لصق نصين أو أكثر بـ +." },
    ],
  },
  {
    id: "zero-loops",
    title: "الحلقات: For, While, Break, Continue",
    titleEn: "ElZero Fundamentals — Loops",
    duration: "60 دقيقة",
    description:
      "فيديوهات #047 لحد #054: For من الأساس للمتقدم، الحلقات المتداخلة، While، Do While، Break و Continue، و3 تطبيقات كاملة.",
    sections: [
      {
        heading: "تغطي الفيديوهات #047 – #054",
        body: "الحلقات هي اللي بتدور لفة المحرك. الفيديوهات دي بتغطي: الحلقة بـ For، الصياغة المتقدمة، التدريبات المتقدمة، الحلقات المتداخلة Nested Loop، الحلقة بـ While، الحلقة Do While، Break و Continue، و3 تطبيقات كاملة.",
      },
      {
        heading: "For — ملعب النجوم",
        body: "كل حلقة For ليها 3 أجزاء في سطر واحد:\n\n```cpp\nfor (int i = 0; i < 5; i++) {\n  cout << i << \" \"; // 0 1 2 3 4\n}\n```\n\n- `int i = 0` البداية.\n- `i < 5` الشرط.\n- `i++` زيادة كل مرة.\n\nنيو ستايل: من C++11 متاح Ranged Loop `for (auto x : arr)` — أنظف للمصفوفات. والمتداخلة `Loop داخل Loop` = جدول × جدول: صفوف × أعمدة.",
      },
      {
        heading: "While و Do While و التحكم بالحلقة",
        body: "الفرق السريع:\n\n- **While:** تفحّص الأول. لو الشرط غلط من الأول، مبتدخلش أبدًا.\n- **Do While:** تدخل مرة واحدة على الأقل، وبتفحص الشرط في آخر اللفة.\n- **Break:** يخرّج من الحلقة فورًا ويكمل اللي بعدها.\n- **Continue:** يتخطى لفة واحدة ويكمل الجاية.\n\nخطأ classic: حلقة مالانهاية While بلا نسيان تعديل الشرط. لو علّق البرنامج، افتكر Break.",
      },
      {
        heading: "3 تطبيقات: جدول ضرب، أكثر رقم، مجموعة كلمات",
        body: "اعمل 3 تطبيقات دي بنفسك:\n\n1. **جدول الضرب:** استخدم Loop متداخلة واطبع جدول كامل لـ 1 لحد 10.\n2. **أكبر مجموع:** خلي المستخدم يدخل 10 أرقام واطبع المجموع والأقرأ.\n3. **حروف متكررة:** اطبع الأحرف من A لحد Z بطريقه For، واجرّب Break بعد أول 5 أحرف.",
      },
    ],
    code: [
      {
        title: "كل أنواع الحلقات في كود واحد",
        language: "cpp",
        code: `#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i <= 3; ++i) cout << i << " "; cout << endl;

    int n = 5, sum = 0;
    while (n > 0) { sum += n; --n; }
    cout << "while sum=" << sum << endl; // 15

    do { cout << "مرة واحدة على الأقل "; } while (false);

    for (int i = 0; i < 10; ++i) {
        if (i == 3) continue;   // يتخطى 3
        if (i == 7) break;      // يطلع قبل 7
        cout << i << " ";
    }
    cout << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "الفرق بين While و Do While؟",
        options: ["نفس الشيء", "Do While بتدخل مرة على الأقل وتحفّص في الآخر", "While أسرع", "Do While أسهل"],
        answer: 1,
      },
      {
        question: "continue بيعمل إيه؟",
        options: ["يخرج من الحلقة", "يتخطى لفة واحدة ويكمل التانية", "يوقف البرنامج", "يُعيد البرنامج"],
        answer: 1,
      },
      {
        question: "حلقة For ليها كم جزء؟",
        options: ["واحد", "اثنين", "ثلاثة (بداية، شرط، زيادة)", "أربعة"],
        answer: 2,
      },
    ],
    exercise: "اعمل جدول ضرب كامل بحلقة متداخلة + برنامج مجموع 10 أرقام بـ While + برنامج يطبع 1 لحد 20 ويتخطى الأرقام 5 و 10 بـ Continue.",
    terms: [
      { en: "Loop", ar: "الحلقة: تنفيذ نفس الكود أكثر من مرة." },
      { en: "Nested Loop", ar: "الحلقة المتداخلة: حلقة داخل حلقة." },
      { en: "Break", ar: "الوقفة: خروج فوري من الحلقة." },
      { en: "Continue", ar: "الكمّال: تخطّي اللفة الحالية فقط." },
    ],
  },
  {
    id: "zero-functions",
    title: "الدوال Functions — كود قابل للإعادة",
    titleEn: "ElZero Fundamentals — Functions",
    duration: "55 دقيقة",
    description:
      "فيديوهات #055 لحد #061: مقدمة الدوال، الباراميترات، القيم الافتراضية، تمرير المصفوفة، الـ Return و Void، والتصريح المسبق Forward Declaration.",
    sections: [
      {
        heading: "تغطي الفيديوهات #055 – #061",
        body: "البرمجة التقليدية جيدة، لكن إيصال كود نظيف يحتاج الدوال. الفيديوهات دي بتغطي: مقدمة الدوال، الباراميترات Parameters، التدريبات على الباراميترات، القيم الافتراضية للباراميترات Default Parameter Value، تمرير المصفوفة كباراميتر، Return و Void، والتصريح المسبق Forward Declaration.",
      },
      {
        heading: "إيه الدالة؟ ليه باراميترات؟",
        body: "الدالة صندوق كلام: بتاخد حروف (باراميترات)، تعمل شغلة، وترجّع نتيجة (Return) أو لا (`void`).\n\n```cpp\nint add(int a, int b) {\n  return a + b;\n}\n```\n\n- `int add(...)` النوع اللي هترجعه.\n- `(int a, int b)` الباراميترات اللي هتاخدها.\n- C++ بدعم القيم الافتراضية: `int add(int a, int b = 5)` يعني لو نسيت الباراميتر الثاني هيبقى 5.\n\n**تمرير المصفوفة:** بتتم تمرير عنوانها الأول `int arr[]` أو `int* arr`، والمهم تعرف حجمها عشان ما تخرجش.",
      },
      {
        heading: "Return و Void و الـ Forward Declaration",
        body: "- `Return` يرجع قيمة واحدة — اخرج على طول.\n- `void` يعني الدالة مش بترجع حاجة — خالية.\n- **التصريح المسبق Forward Declaration:** لازم تعرّف الدالة قبل ما تستخدمها. اعمل في الأول:\n\n```cpp\nint add(int a, int b); // سطر التصريح\n\nint main() {\n  cout << add(3, 4);\n}\n\nint add(int a, int b) { return a + b; } // التعريف\n```\n\nمن غير السطر الأول المترجم هيقول `add was not declared` — مش هنعرف الدالة فين. بسيط؟",
      },
    ],
    code: [
      {
        title: "دوال كاملة: باراميترات + تعريف مسبق",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

int add(int a, int b); // تصريح مسبق
void greet(string name = "مبرمج C++") {
    cout << "أهلًا " << name << endl;
}
void showArray(int arr[], int size) {
    for (int i = 0; i < size; ++i) cout << arr[i] << " ";
    cout << endl;
}

int main() {
    cout << "3 + 4 = " << add(3, 4) << endl;
    greet();            // قيمة افتراضية
    greet("محمد");      // قيمة مخصصة
    int scores[] = {10, 20, 30};
    showArray(scores, 3);
    return 0;
}

int add(int a, int b) { return a + b; }`,
      },
    ],
    quiz: [
      {
        question: "الدالة الـ void بترجع إيه؟",
        options: ["صفر", "لا شيء", "20", "نص"],
        answer: 1,
      },
      {
        question: "الـ Forward Declaration وظيفتها إيه؟",
        options: ["تصغير الكود", "إبلاغ المترجم بالدالة قبل تعريفها", "تصحيح الأخطاء", "توافق الوزراء"],
        answer: 1,
      },
      {
        question: "القيمة الافتراضية للباراميتر معناها إيه؟",
        options: ["قيمة ثابتة", "قيمة تُستخدم لو المستخدم نسي يبعت الباراميتر", "قيمة عشوائية", "قيمة من الذاكرة"],
        answer: 1,
      },
    ],
    exercise: "اكتب 3 دوال: واحدة ترجع أكبر رقم من ثلاثة، واحدة تطبع سلام باسم بقيمة افتراضية، واحدة تحسب مجموع عناصر مصفوفة وتاخدها كباراميتر.",
    terms: [
      { en: "Function", ar: "الدالة: كود متكرر بسمية وباراميترات." },
      { en: "Parameter", ar: "الباراميتر: متغير الدالة اللي بيتستقبل قيمًا." },
      { en: "Default Parameter", ar: "القيمة الافتراضية: قيمة جاهزة لو نسيت تبعت." },
      { en: "Forward Declaration", ar: "التصريح المسبق: تنبيه المترجم بدالة لسه هتتعرف." },
    ],
  },
  {
    id: "zero-builtin",
    title: "الدوال الجاهزة و Overloading و الاستدعاء الذاتي",
    titleEn: "ElZero Fundamentals — Built-in & Advanced Functions",
    duration: "50 دقيقة",
    description:
      "فيديوهات #062 لحد #066: دوال الرياضة الجاهزة، تدريبات 2 و 3 تطبيقات، تعدد التعريفات Overloading، والعودية Recursion.",
    sections: [
      {
        heading: "تغطي الفيديوهات #062 – #066",
        body: "لحد هنا بقيت بتعمل دوالك بنفسك. الفيديوهات دي بتغطي: الدوال الجاهزة ودوال الرياضة، تدريبات لإنشاء تطبيقين، تدريبات لإنشاء 3 تطبيقات، تعدد التعريفات Function Overloading، والعودية Function Recursion.",
      },
      {
        heading: "الدوال الجاهزة الرياضية",
        body: "المكتبة `<cmath>` فيها كل حاجة جاهزة:\n\n- `abs(x)` القيمة المطلقة.\n- `pow(x, y)` القوة.\n- `sqrt(x)` الجذر التربيعي.\n- `max(a, b)` و `min(a, b)` الأكبر والأصغر.\n- `sin`, `cos`, `log`, `exp` إلخ.\n\nلا تعيد كتابة اللي نازل جاهز! مثال: `std::abs(-7)` مباشرة أسرع وأقرأ من أي دالة هتكتبها بنفسك.",
      },
      {
        heading: "Overloading و Recursion",
        body: "- **Overloading:** نفس اسم الدالة، لكن باراميترات مختلفة:\n\n```cpp\nint add(int a, int b);\ndouble add(double a, double b);\n```\n\nالمترجم بيختار اللي يناسب الباراميترات. أما العودية (Recursion) فهي دالة **بتنده نفسها**:ويلها B&F:\n\n```cpp\nint factorial(int n) {\n  if (n <= 1) return 1; // الأساس\n  return n * factorial(n - 1); // النداء الذاتي\n}\n```\n\nإياك تنسى شرط الأساس — لو نسيته هتقع في مالانهاية Recursion.",
      },
    ],
    code: [
      {
        title: "Overloading + Recursion + CMath",
        language: "cpp",
        code: `#include <iostream>
#include <cmath>
using namespace std;

int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    cout << add(3, 4) << endl;          // int overload
    cout << add(3.5, 2.5) << endl;      // double overload
    cout << factorial(5) << endl;        // 120
    cout << sqrt(16) << " " << pow(2, 10) << endl;
    cout << max(15, 22) << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "Overloading معناه إيه؟",
        options: ["أكتر من تعريف لنفس الاسم بباراميترات مختلفة", "تسمية مختلفة", "عزل الدالة", "حلقة"],
        answer: 0,
      },
      {
        question: "Recursion من غير شرط الأساس بيسبب إيه؟",
        options: ["يشتغل أسرع", "مالانهاية و Crash", "نتيجة أدق", "لا حاجة"],
        answer: 1,
      },
      {
        question: "sqrt عايزة مكتبة إيه؟",
        options: ["<string>", "<cmath>", "<vector>", "<iostream>"],
        answer: 1,
      },
    ],
    exercise: "اكتب Overload لدالة add للأعداد الصحيحة والعشرية، واكتب دالة عودية تحسب فيبوناتشي fib(n) من 0 لحد 10 واستخرج نتيجة أعطاها.",
    terms: [
      { en: "Built-in Function", ar: "الدالة الجاهزة: نازلة في المكتبات زي abs و sqrt." },
      { en: "Overloading", ar: "تعدد التعريفات: نفس الاسم بباراميترات مختلفة." },
      { en: "Recursion", ar: "العودية: دالة بتنادي نفسها لحد ما يوصل لأساس." },
    ],
  },
  {
    id: "zero-vector",
    title: "حاويات الحجوم المرنة: Vector",
    titleEn: "ElZero Fundamentals — Vector",
    duration: "55 دقيقة",
    description:
      "فيديوهات #067 لحد #074: إيه الـ Vector؟ الانتقال من Array، الوصول والإضافة والتحديث والحذف، الدوال، الـ Iterator، و count و sort و reverse.",
    sections: [
      {
        heading: "تغطي الفيديوهات #067 – #074",
        body: "الـ Vector هو بطل مودرن C++ — مصفوفة حجمها مش ثابت. الفيديوهات دي بتغطي: إيه الـ Vector؟ الفرق بينه وبين Array، الوصول والإضافة والتحديث والحذف، الدوال، الـ Iterator وليه بنستخدمه، التكرار بـ Iterator، ولوح Count و Sort و Reverse.",
      },
      {
        heading: "إيه الـ Vector؟ الفرق مع Array",
        body: "المصفوفة العادية حجمها ثابت — لو عايز عنصرًا إضافيًا لازم تعيد إنشاء كل حاجة. الـ Vector حجمها مرن في الإضافة والحذف:\n\n```cpp\n#include <vector>\nvector<int> v = {3, 1, 4};\nv.push_back(5); // إضافة في الآخر\nv.pop_back();  // حذف الآخر\ncout << v.size(); // عدد العناصر\n```\n\nالفرق الجوهري:\n\n- **Array:** حجم ثابت، اسم، وندرة أو تنازل بالمؤشرات البسيطة.\n- **Vector:** حجم ديناميكي `size/capacity`، ودواس `push_back`, `insert`, `erase`.\n\nالقاعدة: لو بتعرف عدد العناصر ثابت، ممكن array، وإلا استخدم vector دايمًا.",
      },
      {
        heading: "الوصول والتعديل والدوال",
        body: "العمليات الأساسية:\n\n```cpp\nv[0] = 99;              // تحديث\nv.at(0);                // وصول آمن (يرمي exception لو بره)\nv.insert(v.begin() + 1, 77); // إدخال في المنتصف\nv.erase(v.begin());     // حذف الأول\nv.front(); v.back();    // أول وآخر\nv.clear();              // إفراغ\n```\n\nالأمهم: `push_back` و `pop_back` أرخص بكثير من `insert` و `erase` في المنتصف — حاول تبني تصميمك حولهم.",
      },
      {
        heading: "الـ Iterator والترتيب",
        body: "الـ Iterator (المؤشر التكراري) هو طريقة آمنة تمشي على العناصر من غير حساب الفهارس بنفسك:\n\n```cpp\nfor (auto it = v.begin(); it != v.end(); ++it) {\n  cout << *it << \" \";\n}\n```\n\nمن C++11 يوجد Ranged Loop `for (int x : v)` — أزهل وأسرع قراءة. والدوال الجديدة سليمة:\n\nمن `<algorithm>`: `sort(v.begin(), v.end())` للترتيب، `reverse` للعكس، `count` للعدّ. الخطوة الذهبية قبل أي تصميم: استخدم `begin/end` من الأول.",
      },
    ],
    code: [
      {
        title: "Vector عمليات كاملة",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    vector<int> v = {3, 1, 4, 1, 5};
    v.push_back(9);
    cout << "Size: " << v.size() << "\n";

    for (auto x : v) cout << x << " ";
    cout << "\n";

    sort(v.begin(), v.end());
    for (auto x : v) cout << x << " ";
    cout << "\n";

    v.erase(v.begin() + 1);
    cout << v.front() << " " << v.back() << endl;
    cout << "count 1 = " << count(v.begin(), v.end(), 1) << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "الفرق الأساسي بين Array و Vector؟",
        options: ["الاسم", "حجم Array ثابت و Vector مرن", "القيمة", "نوع آخر"],
        answer: 1,
      },
      {
        question: "push_back بيعمل إيه؟",
        options: ["يضيف في الآخر", "يحذف الأول", "يفرغ كل شيء", "يرتب"],
        answer: 0,
      },
      {
        question: "الـ Iterator فايدته إيه؟",
        options: ["أصغر", "طريقة آمنة للتمتع على العناصر من غير حساب فهرس", "دوال لوحده", "يعدّ"],
        answer: 1,
      },
    ],
    exercise: "اكتب برنامج: خزّن 10 أرقام في Vector، اطبعها، رتّبها، اعكسها، وامسح العنصر الثاني، واحسب المجموع وعدّ الأرقام الزوجية.",
    terms: [
      { en: "Vector", ar: "المتجه: مصفوفة مرنة الحجم من STL." },
      { en: "Iterator", ar: "الـ Iterator: مؤشر تمشي على عناصر الحاوية." },
      { en: "push_back / pop_back", ar: "إضافة وحذف من آخر الحاوية." },
      { en: "Capacity", ar: "السعة: المساحة المحجوزة فعلاً في الذاكرة." },
    ],
  },
  {
    id: "zero-pointers",
    title: "المؤشرات Pointers — قوة C++ الحقيقية",
    titleEn: "ElZero Fundamentals — Pointers",
    duration: "60 دقيقة",
    description:
      "فيديوهات #075 لحد #078: إيه المؤشرات؟ المؤشر لعنصر في المصفوفة، الـ Void والفاتورة Wild والفارغ Null، وحسابات المؤشر مع المصفوفات. واللي بعده جاي — Dynamic Arrays و Double Pointers.",
    sections: [
      {
        heading: "تغطي الفيديوهات #075 – #078",
        body: "المؤشرات هي اللي بتميّز C++ — هنا هتفهم إيه المؤشر أصلًا، والتأشير إلى المصفوفة Pointing To Array، والمؤشر الفارغ Void Pointer والمؤشر الضال Wild Pointer ولماذا Null، وحساب المؤشر مع المصفوفات Pointers Arithmetic. اللي جاي في الفيديوهات بعد 078: مصفوفات المؤشرات، ترتيب، المؤشرات المزدوجة، التمرير والإرجاع، وSmart Pointers.",
      },
      {
        heading: "إيه المؤشر أصلًا؟",
        body: "كل متغير ليه عنوان في الذاكرة RAM. المؤشر (Pointer) متغير بيخزن **عنوان** متغير تاني، وبـ `&` تيجّب العنوان، وبـ `*` تشوف حاجة جوه العنوان:\n\n```cpp\nint x = 42;\nint* p = &x;  // p بيخزن عنوان x\ncout << *p;   // 42 — ده محتويات العنوان\n```\n\nصورة عقلية: `x` هي الخزانة، `&x` هو عنوانها، `p` هو المفتاح، `*p` هو محتوى الخزانة.",
      },
      {
        heading: "المؤشر الضال والفارغ والفارغ Void",
        body: "ثلاثة أعداء:\n\n- **Wild Pointer:** مؤشر ضال مش بيشاور على أي عنوان.\n\n```cpp\nint* p; // ضال — مفيش قيمة\ncout << *p; // Undefined — خطر!\n```\n\n- **Null Pointer:** مؤشر فارغ عارف إنه خالي — آمن. عرّفه بـ `nullptr`.\n\n```cpp\nint* p = nullptr;\n```\n\n- **Void Pointer:** مؤشر عام (`void*`) في الشيء لشيء، لكنه ليس مؤشر بيانات — تُستخدمه في شغلات ذكية زي `malloc` ومرور المؤشرات العامة.\n\nالقاعدة: **المؤشر الذي لا يقدّر يُهيأ بـ nullptr** — أُذنُك هنا.",
      },
      {
        heading: "المؤشر مع المصفوفة (Arithmetic Arrays)",
        body: "المصفوفة تخزن متسلسل في الذاكرة، والمؤشر لاسم المصفوفة هو أول عنصر. فالعبوزة `arr[2]` تقابل `*(arr+2)`:\n\n```cpp\nint arr[] = {10, 20, 30};\nint* p = arr;           // عنوان أول عنصر\ncout << p[0] << p[1] << p[2]; // 10 20 30\ncout << *(p + 2);       // 30\np++;                    // تشير للعنصر التالي\n```\n\nده كله أساس الحلقات اللي جوه `std::sort` والطلبات العامة جوه المكتبات. اللي جاي بعد 078: مصفوفات المؤشرات وترتيبها، المؤشرات المزدوجة `int**`، تمرير المؤشرات للدوال، رجوع المؤشرات من الدوال، Smart Pointers.",
      },
    ],
    code: [
      {
        title: "المؤشرات والمصفوفة",
        language: "cpp",
        code: `#include <iostream>
using namespace std;
int main() {
    int x = 42;
    int* p = &x;
    cout << "x = " << x << endl;
    cout << "*p = " << *p << endl;
    // *p = 99; // يغير x أيضا
    *p = 99;
    cout << "x بعد التعديل = " << x << endl;

    int arr[] = {10, 20, 30};
    int* q = arr; // عنوان أول عنصر
    cout << q[0] << q[1] << q[2] << endl;
    cout << *(q + 2) << endl; // 30
    q++;
    cout << "بعد +1: " << *q << endl; // 20

    int* nullp = nullptr; // آمن
    cout << (nullp == nullptr) << endl; // 1
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "المؤشر بيخزّن إيه؟",
        options: ["قيمة", "عنوان متغير في الذاكرة", "نوع", "حلقة"],
        answer: 1,
      },
      {
        question: "Wild Pointer معناه إيه؟",
        options: ["مؤشر ضال لا يشير لشيء", "مؤشر قوي", "مؤشر فارغ", "Void"],
        answer: 0,
      },
      {
        question: "arr و *(arr+2) الفرق؟",
        options: ["نفس الشيء", "الأول عنوان، الثاني قيمة العنصر الثالث", "لا فرق", "الثاني أصغر"],
        answer: 1,
      },
    ],
    exercise: "اكتب برنامج يمرر مصفوفة لدالة بمؤشر، ويطبع عناصرها باستخدام pointer arithmetic `*(p+i)` بدل الفهرس المباشر، ثم اكتب لاحظ لماذا Wild Pointer خطير.",
    terms: [
      { en: "Pointer", ar: "المؤشر: متغير يخزن عنوانًا في الذاكرة." },
      { en: "Wild Pointer", ar: "المؤشر الضال: مؤشر بلا عنوان معيّن — خطير." },
      { en: "Null Pointer (nullptr)", ar: "المؤشر الفارغ: مؤشر لا يشير لشيء — آمن." },
      { en: "Void Pointer", ar: "المؤشر العام: نوع عام غير محدد." },
      { en: "Pointer Arithmetic", ar: "حساب المؤشر: الجمع مع العناصر المتسلسلة." },
    ],
  },
];
