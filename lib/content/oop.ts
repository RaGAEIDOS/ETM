import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "oop-intro",
    title: "ما هي البرمجة الشيئية؟",
    titleEn: "What is OOP?",
    duration: "35 دقيقة",
    description:
      "قبل ما نكتب كود كبير، لازم نفهم النمط اللي بيبني بيه الأنظمة الحقيقية. هنا هتعرف إيه هو الـ OOP وليه بقت كل اللغات بتتكلم بيه.",
    sections: [
      {
        heading: "المشكلة: الكود الإجرائي بيتعقد",
        body: "تخيل معاك برنامج إدارة بنك: آلاف العملاء، وحسابات، وعمليات. لو كتبت البرنامج بأسلوب **إجرائي (Procedural)** — يعني بيانات مبعثرة هنا ودوال مبعثرة هناك — هتلاقي نفسك قدام غابة من المتغيرات والدوال اللي مفيش رابط واضح بينها.\n\nوكل ما البرنامج يكبر، أي تعديل صغير بيقلب حتة تانية. ده اللي بنسميه **كود سباغيتي (Spaghetti Code)** — زي طبق مكرونة ملخبطة، مبتعرفش توصل لأي حتة.\n\nهنا بقى يجي دور البرمجة الشيئية (Object-Oriented Programming) — نمط تفكير بيجمع البيانات والسلوك في حاجة واحدة اسمها **الكائن (Object)**.",
      },
      {
        heading: "الفكرة: الكائن فيه بيانات + سلوك",
        body: "بدل ما نفكر \"عندي اسم عميل\" و\"عندي دالة بتحول فلوس\"، بنفكر \"عندي **كائن عميل** فيه اسمه ورصيده، وهو نفسه بيعرف يعمل عمليات السحب والإيداع\".\n\n- **الخصائص (Attributes / Fields):** البيانات اللي بتصف الكائن — زي `name` و`balance`.\n- **الدوال (Methods):** العمليات اللي بيعملها الكائن — زي `deposit()` و`withdraw()`.\n\nالكائن بقى **مسؤول عن نفسه** — ده جوهر الفكرة.",
      },
      {
        heading: "الأركان الأربعة للـ OOP",
        body: "- **التغليف (Encapsulation):** إخفاء التفاصيل الدقيقة للكائن وكشف واجهة بسيطة بس للتعامل معه. زي العربية: انت بتدوس بنزين وتلف دركسيون، ومحتاجش تفهم إزاي المحرك بيشتغل جواها.\n- **الوراثة (Inheritance):** صنف جديد بيورث خصائص وصفات صنف قديم ويطوّر عليها. زي ما الابن يرث ملامح أهله ويضيف عليه.\n- **تعدد الأشكال (Polymorphism):** نفس الفعل بيتنفذ بأشكال مختلفة حسب نوع الكائن. كلمة \"اتكلم\" مثلًا: الكلب ينبح والقطة تعوي.\n- **التجريد (Abstraction):** التركيز على الحاجات المهمة وإهمال التفاصيل اللي مش مهمة في السياق الحالي.",
      },
      {
        heading: "ليه تتعلم OOP في C++؟",
        body: "C++ من أوائل اللغات اللي طوّرت البرمجة الشيئية، وهي لسه بتستخدم في **محركات الألعاب** (Unreal Engine) و**أنظمة التشغيل** و**المتصفحات** و**الأنظمة المالية**. تعلمك لـ OOP في C++ هينفعك في أي لغة تانية (Java وC# وPython كلهم بيستخدموا نفس الأفكار).\n\nكمان C++ بتديك تحكم كامل في الذاكرة مع الـ OOP، يعني هتفهم المشهد كامل مش بس نصه.",
      },
    ],
    code: [
      {
        title: "إجرائي ضد شيئي: الفرق في مثال",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

// الأسلوب الإجرائي: البيانات والدوال منفصلين
struct StudentProcedural {
    string name;
    double grade;
};

void printStudent(StudentProcedural s) {
    cout << s.name << " - " << s.grade << endl;
}

// الأسلوب الشيئي: البيانات والسلوك في صنف واحد
class Student {
public:
    string name;
    double grade;

    void print() const {
        cout << name << " - " << grade << endl;
    }
};

int main() {
    StudentProcedural a = {"أحمد", 85.5};
    printStudent(a);

    Student b;
    b.name = "أحمد";
    b.grade = 85.5;
    b.print();

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق الأساسي بين الكود الإجرائي والشيئي؟",
        options: [
          "الإجرائي أسرع دايماً",
          "الشيئي بيجمع البيانات والسلوك في كائن واحد",
          "مفيش فرق",
          "الشيئي بيستخدم متغيرات أقل",
        ],
        answer: 1,
        explanation: "في الـ OOP البيانات والدوال اللي بتشتغل عليها في صنف/كائن واحد.",
      },
      {
        question: "إيه المقصود بالتغليف (Encapsulation)؟",
        options: [
          "حذف الكود القديم",
          "إخفاء التفاصيل الداخلية وكشف واجهة بسيطة",
          "تحويل الكود للغة الآلة",
          "تكرار الكود أكتر من مرة",
        ],
        answer: 1,
        explanation: "التغليف بيحمي بيانات الكائن من التعديل المباشر ويوفر دوال للتعامل معها.",
      },
      {
        question: "أي مثال بيوضح تعدد الأشكال (Polymorphism)؟",
        options: [
          "صنف واحد ليه 3 دوال",
          "صنف Animal ودالة speak() تتنفذ بشكل مختلف في Dog وCat",
          "متغير واحد بقيمتين",
          "حلقتين ورا بعض",
        ],
        answer: 1,
        explanation: "نفس الدالة بسلوك مختلف حسب نوع الكائن — ده جوهر تعدد الأشكال.",
      },
    ],
    exercise:
      "صمّم صنف `Book` فيه خصائص `title` و`author` و`pages`، ودالة `describe()` بتطبع وصف الكتاب. أنشئ 3 كائنات في `main` واطبع وصفهم.",
    terms: [
      { en: "OOP", ar: "البرمجة الشيئية: نمط برمجة بيظم الكود في كائنات فيها بيانات وسلوك." },
      { en: "Class", ar: "صنف: مخطط أو قالب بيوصف حاجة معينة، وبيستخدم لإنشاء الكائنات." },
      { en: "Object", ar: "كائن: نسخة حقيقية متعاشة من الصنف في الذاكرة." },
      { en: "Encapsulation", ar: "تغليف: إخفاء تفاصيل الكائن الداخلية وكشف واجهة بسيطة للتعامل معه." },
    ],
  },
  {
    id: "classes-objects",
    title: "الأصناف والكائنات Classes & Objects",
    titleEn: "Classes & Objects",
    duration: "40 دقيقة",
    description:
      "هنا هنكتب أول صنف حقيقي بإيدنا: نعرّف الخصائص، ننشئ كائنات، ونستدعي الدوال. دي أول خطوة عملية في عالم الـ OOP.",
    sections: [
      {
        heading: "الصنف زي المخطط، والكائن زي العمارة",
        body: "الصنف (Class) هو **مخطط أو قالب** بيوصف الحاجة دي. الكائن (Object) هو **نسخة حقيقية** متعاشة من المخطط ده في الذاكرة.\n\nتشبيه بسيط: الصنف زي **قالب طباعة الكروت**، والكائن زي **الكرت اللي اتطبع منه** — كل كرت ليه نفس الشكل لكن بيانات مختلفة.\n\nفي C++ الصنف بيعرّف مرة واحدة، وبعدين تقدر تنشئ منه أي عدد من الكائنات.",
      },
      {
        heading: "تعريف صنف في C++",
        body: "الصيغة:\n\n```cpp\nclass اسم_الصنف {\npublic:\n    // الخصائص والدوال الظاهرة للبره\nprivate:\n    // الخصائص اللي جوه بس\n};\n```\n\nلازم تكتب فاصلة منقوطة `;` في آخر تعريف الصنف — دي من الأخطاء الشائعة جدًا.\n\n- `class` كلمة مفتاحية.\n- `public:` كل اللي بعدها متاح من بره الصنف.\n- `private:` كل اللي بعدها متاح جوه الصنف بس.",
      },
      {
        heading: "إنشاء كائن والوصول للخصائص",
        body: "بعد تعريف الصنف، تنشئ كائن زي أي متغير:\n\n```cpp\nBankAccount acc;   // كائن من الصنف\n```\n\nوتوصل للخصائص والدوال العامة بنقطة `.`:\n\n```cpp\nacc.owner = \"سارة\";\nacc.deposit(500);\n```\n\nكل كائن ليه **نسخة مستقلة** من الخصائص. لو خلقت 3 حسابات، كل واحد ليه رصيده الخاص.",
      },
      {
        heading: "الدوال الأعضاء Member Functions",
        body: "الدوال اللي جوه الصنف اسمها **دوال أعضاء (Member Functions)**. بتتنادى على الكائن نفسه:\n\n```cpp\nacc.withdraw(200);\n```\n\nالدالة بتتقدر توصل لكل خصائص الكائن اللي اتنادى عليها من غير ما نبعتهم كباراميتر — عشان هي جوه الكائن أصلًا.\n\n`const` بعد اسم الدالة معناها إنها **مش بتغير** بيانات الكائن — زي علامة ضمانة إن الدالة دي للقراءة بس.",
      },
      {
        heading: "struct و class: الفرق الصغير المهم",
        body: "في C++ فيه نوعين متشابهين: `class` و`struct`. الفرق الوحيد الأساسي هو **مستوى الرؤية الافتراضي**:\n\n- في `class`: الافتراضي `private` — كل حاجة من غير تحديد بتكون خاصة.\n- في `struct`: الافتراضي `public` — كل حاجة من غير تحديد بتكون ظاهرة.\n\nباقي الخواص زي الوراثة والدوال متساوية. القاعدة العامة: استخدم `struct` للبيانات البسيطة، و`class` للكائنات اللي ليها سلوك وحماية.",
      },
    ],
    code: [
      {
        title: "صنف حساب بنكي بسيط",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    double balance = 0;

public:
    string owner;

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    double getBalance() const {
        return balance;
    }
};

int main() {
    BankAccount acc;
    acc.owner = "سارة";
    acc.deposit(1000);
    acc.withdraw(200);

    cout << "صاحب الحساب: " << acc.owner << endl;
    cout << "الرصيد الحالي: " << acc.getBalance() << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين الصنف (class) والكائن (object)؟",
        options: [
          "مفيش فرق",
          "الصنف مخطط والكائن نسخة حقيقية من المخطط",
          "الكائن أسرع من الصنف",
          "الصنف بيتخزن في الذاكرة والكائن لأ",
        ],
        answer: 1,
        explanation: "الصنف تعريف/قالب، والكائن نسخة فعلية متخلقة في الذاكرة.",
      },
      {
        question: "في السطر `acc.deposit(1000);` إيه معنى النقطة `.`؟",
        options: [
          "فاصلة بين حجتين",
          "الوصول لخاصية أو دالة تابعة للكائن acc",
          "نهاية الجملة",
          "عملية رياضية",
        ],
        answer: 1,
        explanation: "النقطة بتصل الكائن بالدوال والخصائص العامة بتاعته.",
      },
      {
        question: "ليه مستوى الرؤية الافتراضي في class هو private؟",
        options: [
          "عشان البرنامج يشتغل أسرع",
          "عشان يجبرك تفكر في الحماية والتغليف من الأول",
          "عشان الكود يبقى أقصر",
          "عشان class مش بيورث",
        ],
        answer: 1,
        explanation: "الافتراضي الخاص بيشجع التغليف — تكشف بس اللي عايز تكشفه بإيدك.",
      },
    ],
    exercise:
      "عرّف صنف `Car` فيه `brand` و`model` و`year` (كلها public)، ودالة `showInfo()` بتطبع بيانات العربية. أنشئ عربيتين في `main` واطبع بياناتهم.",
    terms: [
      { en: "Class", ar: "صنف: مخطط بيوصف خصائص وسلوك حاجة معينة." },
      { en: "Object", ar: "كائن: نسخة فعلية من الصنف متخلقة في الذاكرة." },
      { en: "Member Function", ar: "دالة عضو: دالة معرّفة جوه الصنف وبتشتغل على بيانات الكائن." },
      { en: "Access Specifier", ar: "محدد رؤية: كلمة زي public وprivate بتحدد مين يقدر يوصول للخصائص." },
    ],
  },
  {
    id: "constructors-destructors",
    title: "البنّاءات والهادمات Constructors & Destructors",
    titleEn: "Constructors & Destructors",
    duration: "40 دقيقة",
    description:
      "كل كائن ليه لحظة ميلاد ولحظة وفاة. هنا هتتحكم في الاتنين: إزاي تهيّئ الكائن أول ما يتخلق، وإزاي تتنظف بعده لما يموت.",
    sections: [
      {
        heading: "البنّاء Constructor: حفل الميلاد",
        body: "البنّاء (Constructor) دالة خاصة بتتنادى **تلقائيًا** أول ما يتعمل كائن جديد. اسمها زي اسم الصنف بالظبط ومن غير نوع رجوع.\n\n```cpp\nclass Student {\npublic:\n    Student() {\n        cout << \"طالب جديد ات created\" << endl;\n    }\n};\n```\n\nالهدف الأساسي: **تهيئة الخصائص** — عشان متقعدش بمتغيرات فاضية بقيم عشوائية.",
      },
      {
        heading: "بنّاءات ببارامترات و Overloading",
        body: "تقدر تعرف أكتر من بنّاء — وده اسمه **تحميل زائد (Overloading)**. كل بنّاء ليه باراميترز مختلفة:\n\n```cpp\nStudent(string n, int g) : name(n), grade(g) {}\nStudent(string n) : name(n), grade(0) {}\n```\n\nلما تنشئ `Student(\"أحمد\", 85)`، المترجم يختار البنّاء اللي باراميترزه مطابقة.\n\n**تحذير:** لو كتبت أي بنّاء بنفسك، المترجم مش هيعمل بنّاء فارغ تلقائيًا — لازم تكتبه بنفسك لو محتاجه.",
      },
      {
        heading: "قائمة التهيئة Initialization List",
        body: "الطريقة الأفضل لتهيئة الخصائص:\n\n```cpp\nStudent(string n, int g) : name(n), grade(g) {\n    // الجسم فاضي غالبًا\n}\n```\n\nاللي بين القوسين والقوسين المعقوفين `: name(n), grade(g)` اسمه **قائمة التهيئة**. بتكون أسرع من التعيين جوه الجسم، وضرورية لتهيئة `const` والمراجع.",
      },
      {
        heading: "الهادم Destructor: وداعًا يا كائن",
        body: "الهادم (Destructor) دالة اسمها `~` واسم الصنف، وبتتنادى **تلقائيًا** لما الكائن يخرج من النطاق أو يتم حذفه.\n\n```cpp\n~Student() {\n    cout << \"الطالب \" << name << \" اتشال\" << endl;\n}\n```\n\nمهم جدًا في الصنفات اللي بتفتح ملفات أو بتخصّص ذاكرة — بتستخدم الهادم عشان **تنظّف الموارد** وتحولهاش تسريب.\n\n**قاعدة مهمة:** لو صنفك مش بيخصّص موارد خارجية، غالبًا مش محتاج تكتب هادم يدوي — المترجم بيعملك واحد تلقائي.",
      },
      {
        heading: "ترتيب التنفيذ: بنّاء الأول وهادم الأخير",
        body: "الكائن بيتخلق بالترتيب: بنّاء الأصناف الأساسية الأول، وبعدين بنّاء الصنف نفسه. وعند الدمار: هادم الصنف نفسه الأول، وبعدين هادم الأساسية.\n\nتذكّر: **بنّاء الأول، هادم الأخير** — العكس زي الدخول والخروج من الأوضة.",
      },
    ],
    code: [
      {
        title: "بنّاءان وهادم في صنف Rectangle",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

class Rectangle {
private:
    double width;
    double height;

public:
    Rectangle() {
        width = 0;
        height = 0;
        cout << "تم إنشاء مستطيل فارغ" << endl;
    }

    Rectangle(double w, double h) : width(w), height(h) {
        cout << "تم إنشاء مستطيل " << width << " × " << height << endl;
    }

    double area() const {
        return width * height;
    }

    ~Rectangle() {
        cout << "تم تدمير مستطيل " << width << " × " << height << endl;
    }
};

int main() {
    Rectangle a;
    Rectangle b(5, 3);

    cout << "مساحة b: " << b.area() << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين البنّاء والدالة العادية؟",
        options: [
          "البنّاء ليه نوع رجوع",
          "البنّاء بيتنادى تلقائي عند إنشاء الكائن واسمه زي اسم الصنف",
          "مفيش فرق",
          "البنّاء بيتنادى يدوي دايمًا",
        ],
        answer: 1,
        explanation: "البنّاء اسمه زي الصنف، من غير نوع رجوع، وبيتنفذ تلقائيًا عند الإنشاء.",
      },
      {
        question: "ليه بنستخدم قائمة التهيئة `: name(n)` بدل `name = n` جوه الجسم؟",
        options: [
          "عشان الكود يبقى أقصر",
          "لأنها أسرع ومطلوبة لتهيئة const والمراجع",
          "مفيش فرق خالص",
          "عشان المترجم يوافق",
        ],
        answer: 1,
        explanation: "التهيئة المباشرة بتكون أسرع من التعيين وتلزم في حالات const والـ references.",
      },
      {
        question: "امتى بيتنادى الهادم Destructor؟",
        options: [
          "أول ما يتعمل الكائن",
          "لما الكائن يخرج من النطاق أو يتحذف",
          "لما البرنامج يبدأ",
          "لما نستدعي delete على متغير عادي",
        ],
        answer: 1,
        explanation: "الهادم بيتنفذ تلقائيًا عند نهاية عمر الكائن.",
      },
    ],
    exercise:
      "عرّف صنف `Movie` فيه `title` و`year`. اكتب بنّاء بباراميترز وبنّاء فارغ (يخلّي العنوان \"غير معروف\")، وهادم بيطبع \"تم حذف فيلم X\". أنشئ 3 كائنات (واحد بـ new و delete) وراقب ترتيب الطباعة.",
    terms: [
      { en: "Constructor", ar: "بنّاء: دالة خاصة بتتنادى تلقائيًا عند إنشاء الكائن لتهيئة الخصائص." },
      { en: "Destructor", ar: "هادم: دالة خاصة بتتنادى تلقائيًا عند موت الكائن لتنظيف الموارد." },
      { en: "Overloading", ar: "تحميل زائد: تعريف أكتر من دالة أو بنّاء بنفس الاسم بباراميترز مختلفة." },
      { en: "Initialization List", ar: "قائمة التهيئة: طريقة سريعة لتهيئة الخصائص في البنّاء قبل جسم الدالة." },
    ],
  },
  {
    id: "encapsulation",
    title: "التغليف Encapsulation",
    titleEn: "Encapsulation",
    duration: "35 دقيقة",
    description:
      "سر الكود النظيف: البلوك بتاع البيانات، والكشف بتاع الدوال. هنا هتعرف إزاي تحمي الكائن من نفسه ومن غيره.",
    sections: [
      {
        heading: "إيه هو التغليف؟",
        body: "التغليف (Encapsulation) هو إنك **تخفي البيانات الدقيقة** للكائن جوه الصنف، وتكشف بس **واجهة عامة (Public Interface)** من دوال عشان الناس تتعامل معاه.\n\nتشبيه: بوق العربية. انت بتستخدم الدركسيون والفرامل والبنزين — مبتعرفش إزاي الصمامات والمكابس بتشتغل جوا. ولو حد دخل يفك المحرك بإيده، العربية هتبوظ.\n\nفي الكود: الخصائص تبقى `private`، والتعامل بيحصل من خلال دوال `public`.",
      },
      {
        heading: "المستويات الثلاثة: public و private و protected",
        body: "- `public:` — متاح من أي مكان، جوه الصنف وخارجه.\n- `private:` — متاح جوه الصنف بس (الدوال الأعضاء).\n- `protected:` — متاح جوه الصنف وجوه الأصناف اللي بتورث منه (هنشرحها في درس الوراثة).\n\nالقاعدة الذهبية: **خلي الخصائص private دايمًا**، إلا لو عندك سبب قوي جدًا.",
      },
      {
        heading: "الجتر والسيتّر: بوابة البيانات",
        body: "عشان توصل للخصائص الخاصة من بره، بتكتب دوال وسيطة:\n\n```cpp\ndouble getBalance() const { return balance; }\nvoid setBalance(double b) { if (b >= 0) balance = b; }\n```\n\n- **جتر (Getter):** دالة بترجع قيمة خاصية.\n- **سيتّر (Setter):** دالة بتحدد قيمة خاصية — وهنا بتقدر **تفحص القيمة الأول**.\n\nالسيتّر مش مجرد تعيين: هو **نقطة تفتيش** تقدر ترفض القيم الغلط.",
      },
      {
        heading: "ليه التغليف مهم فعلًا؟",
        body: "1. **الحماية:** تمنع أي كود بره يغيّر الخصائص بقيم مجنونة.\n2. **المرونة:** تقدر تغيّر طريقة التخزين جوه الصنف من غير ما تكسر أي كود بره.\n3. **الصيانة:** لو لقيت بگ في خاصية معينة، بتدور في مكان واحد (السيترز) بدل ما تدور في كل البرنامج.\n\nمثال عملي: لو غيّرت رصيد العميل من `int` لـ `double`، الكود اللي بيستخدم الجتر مش هيحس بأي حاجة.",
      },
    ],
    code: [
      {
        title: "التغليف في صنف Temperature",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

class Temperature {
private:
    double celsius;

public:
    void setCelsius(double c) {
        if (c >= -273.15) {
            celsius = c;
        } else {
            cout << "درجة حرارة غير صالحة!" << endl;
        }
    }

    double getCelsius() const {
        return celsius;
    }

    double getFahrenheit() const {
        return celsius * 9.0 / 5.0 + 32.0;
    }
};

int main() {
    Temperature t;
    t.setCelsius(25);
    cout << t.getCelsius() << " مئوية" << endl;
    cout << t.getFahrenheit() << " فهرنهايت" << endl;

    t.setCelsius(-500);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "ليه بنحط الخصائص `private` بدل `public`؟",
        options: [
          "عشان البرنامج يبقى أصغر",
          "عشان نحمي البيانات ونتحكم في الوصول ليها",
          "عشان الكود يبقى أبطأ شوية",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "الخصائص الخاصة تمنع التعديل المباشر وتتيح الفحص في السيترز.",
      },
      {
        question: "إيه وظيفة دالة السيتّر (Setter)؟",
        options: [
          "ترجع قيمة الخاصية",
          "تحدد قيمة الخاصية مع إمكانية الفحص الأول",
          "تحذف الخاصية",
          "تطبع قيمة الخاصية",
        ],
        answer: 1,
        explanation: "السيتر بتعدّل القيمة وبقدر تفحصها قبل الحفظ.",
      },
      {
        question: "إيه الفرق بين `protected` و `private`؟",
        options: [
          "مفيش فرق",
          "protected متاح للأصناف المشتقة (الوراثة) و private لأهل الصنف بس",
          "private أسرع",
          "protected بيورث الخصائص تلقائيًا",
        ],
        answer: 1,
        explanation: "protected بيسمح للأصناف اللي بتورث بالوصول للخصائص.",
      },
    ],
    exercise:
      "عدّل صنف `BankAccount` من التمرين السابق: خلي `balance` خاص، واكتب `deposit` و`withdraw` و`getBalance`. جرّب تسحب مبلغ أكبر من الرصيد وتأكد إن العملية اترفضت.",
    terms: [
      { en: "Encapsulation", ar: "تغليف: إخفاء البيانات الداخلية وكشف واجهة عامة من دوال." },
      { en: "Getter", ar: "جتر: دالة بترجع قيمة خاصية خاصة." },
      { en: "Setter", ar: "سيتر: دالة بتحدد قيمة خاصية مع إمكانية الفحص الأول." },
      { en: "Access Modifier", ar: "محدد رؤية: كلمة زي public وprivate بتحدد مين يقدر يوصول." },
    ],
  },
  {
    id: "inheritance",
    title: "الوراثة Inheritance",
    titleEn: "Inheritance",
    duration: "45 دقيقة",
    description:
      "من غير ما تعيد كتابة الكود، تقدر تبني صنف جديد يرث كل حاجة من صنف قديم ويضيف عليها. دي قوة الوراثة.",
    sections: [
      {
        heading: "فكرة الوراثة: مفيش داعي نبدأ من الصفر",
        body: "تخيل عندك صنف `Animal` فيه اسم وعمر ودالة أكل. عايز تضيف صنف `Dog` — مش هتحتاج تعيد كتابة الاسم والعمر والأكل، لأ، **هترثهم** من `Animal` وتضيف بس الحاجات الجديدة (زي النباح).\n\nالصنف الأساسي (Base / Parent) هو اللي بنورث منه. الصنف المشتق (Derived / Child) هو اللي بيورث.\n\nالصيغة:\n\n```cpp\nclass Dog : public Animal {\n    // الحاجات الجديدة\n};\n```",
      },
      {
        heading: "مستويات الوراثة: public و protected و private",
        body: "بعد `: ` بتحدد مستوى الوراثة:\n\n- `public` — الشائع جدًا: الخصائص `public` بتفضل `public`، و`protected` بتفضل `protected`.\n- `protected` — الخصائص العامة بتبقى `protected` في الصنف الابن.\n- `private` — كل حاجة بتبقى `private` عند الابن.\n\nالقاعدة: **استخدم `public` الا إذا كان عندك سبب قوي**. لو ورثت `private`، فالأصناف المشتقة من الابن مش هتقدر توصل لخصائص الجد.",
      },
      {
        heading: "الوراثة المتعددة: مين أبو مين؟",
        body: "في C++ يقدر الصنف يورث من **أكتر من صنف** في نفس الوقت:\n\n```cpp\nclass Student : public Person, public Scholar {\n    // ...\n};\n```\n\nمفيد في بعض الحالات النادرة، لكنه ممكن يخلق التباس (لو الصنفين ليهم دالة بنفس الاسم). استخدمه بحذر، ونادرًا ما هتحتاجه في البداية.",
      },
      {
        heading: "ترتيب البنّاءات والهادمات في الوراثة",
        body: "لما تنشئ كائن من الصنف الابن:\n\n1. بنّاء الصنف الأساسي يتنادى الأول.\n2. بنّاء الصنف الابن يتنادى بعده.\n3. الهادم الابن الأول عند الخروج.\n4. الهادم الأساسي بعده.\n\nتذكّر: **بناء من فوق لتحت، دمار من تحت لفوق**.",
      },
      {
        heading: "الدوال المظلة: virtual و override (نبذة)",
        body: "لما الابن عايز يغيّر سلوك دالة موجودة عند الأب، بيعمل **إعادة تعريف (Override)**. ولعشان التعدد الشكلي يشتغل صح مع المؤشرات، بنكتب `virtual` عند الأب و`override` عند الابن.\n\nهنشرح ده بتفصيل في درس تعدد الأشكال الجاي.",
      },
    ],
    code: [
      {
        title: "وراثة الحيوانات: Animal ← Dog / Cat",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

class Animal {
protected:
    string name;

public:
    Animal(string n) : name(n) {}

    void eat() const {
        cout << name << " بياكل" << endl;
    }

    virtual void speak() const {
        cout << name << " بيعمل صوت" << endl;
    }
};

class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}

    void speak() const override {
        cout << name << ": هووووف!" << endl;
    }
};

class Cat : public Animal {
public:
    Cat(string n) : Animal(n) {}

    void speak() const override {
        cout << name << ": ميوو!" << endl;
    }
};

int main() {
    Dog d("ريكس");
    Cat c("مشمش");

    d.eat();
    d.speak();
    c.speak();

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المقصود بالصنف الأساسي (Base Class)؟",
        options: [
          "الصنف اللي مابيورثش حاجة",
          "الصنف اللي بنورث منه",
          "الصنف اللي فيه main",
          "أصغر صنف في البرنامج",
        ],
        answer: 1,
        explanation: "Base Class هو الصنف اللي بيتم الوراثة منه.",
      },
      {
        question: "في `class Dog : public Animal`، إيه معنى `public` اللي بعد النقطتين؟",
        options: [
          "مستوى رؤية الخصائص في الصنف الابن",
          "إن الكلب حيوان عام",
          "إن الوراثة اختيارية",
          "نوع القيمة المرجعة",
        ],
        answer: 0,
        explanation: "مستوى الوراثة بيحدد كيف بتتحول مستويات الرؤية في الصنف الابن.",
      },
      {
        question: "لو الصنف الابن عايز يغير سلوك دالة موجودة عند الأب، إيه الكلمة اللي بتحطها عند الأب؟",
        options: ["static", "virtual", "const", "friend"],
        answer: 1,
        explanation: "virtual بتخلي الدالة قابلة لإعادة التعريف في الأصناف المشتقة وتمكّن تعدد الأشكال.",
      },
    ],
    exercise:
      "ابنِ صنف `Employee` فيه `name` و`salary` و`void show()`. وارث منه `Manager` يضيف `department` ويعيد تعريف `show()` لطباعة القسم كمان. أنشئ كائن Manager واحد واطبع بياناته.",
    terms: [
      { en: "Inheritance", ar: "وراثة: صنف جديد بيورث خصائص وسلوك صنف قديم ويضيف عليه." },
      { en: "Base Class", ar: "صنف أساسي: الصنف اللي بنورث منه." },
      { en: "Derived Class", ar: "صنف مشتق: الصنف اللي بيورث من صنف أساسي." },
      { en: "Override", ar: "إعادة تعريف: الابن بيغير تنفيذ دالة موجودة عند الأب." },
    ],
  },
  {
    id: "polymorphism",
    title: "تعدد الأشكال Polymorphism",
    titleEn: "Polymorphism",
    duration: "45 دقيقة",
    description:
      "نفس الدالة، سلوك مختلف حسب الكائن. هنا هنختارق قوة المؤشرات والـ virtual عشان نبني أنظمة مرنة بتتحمل التوسع.",
    sections: [
      {
        heading: "تعدد الأشكال: الفعل الواحد بأشكال كثيرة",
        body: "تعدد الأشكال (Polymorphism) معناه حرفيًا **أشكال كثيرة**. نفس الاسم أو الدالة بيتصرف بشكل مختلف حسب نوع الكائن اللي بينفذها.\n\nمثال من الحياة: زرار \"تشغيل\". في التلفزيون بيشغّل الشاشة، وفي الغسالة بيشغّل الموتور، وفي العربية بيشغّل المحرك. نفس الفعل، نتائج مختلفة.\n\nفي البرمجة: عندك مؤشر من نوع `Animal*` ممكن يشاور على `Dog` أو `Cat`، ولما تنادي `speak()`، كل واحد يعمل صوته.",
      },
      {
        heading: "virtual و override: الاتفاقية",
        body: "عشان تحقق تعدد الأشكال، لازم:\n\n1. الدالة عند الأب تبقى `virtual`.\n2. الدالة عند الابن تعيد تعريفها بـ `override` (اختياري لكن مستحسن جدًا).\n\n```cpp\nvirtual void speak() const { ... }   // عند الأب\nvoid speak() const override { ... }  // عند الابن\n```\n\n`override` بتقول للمترجم: \"أنا متأكد إني باعيد تعريف دالة موجودة عند الأب\". لو غلطت في الاسم أو التوقيع، المترجم هيفضلني — دي حماية مجانية.",
      },
      {
        heading: "الصنف المجرد Abstract Class",
        body: "أحيانًا بنعمل صنف **مجرد (Abstract)** — مش هننشئ منه كائنات، هو بس كنموذج للغير. بتعرف دالة افتراضية بحتة كده:\n\n```cpp\nvirtual double area() const = 0;\n```\n\nالصنف اللي فيه دالة بحتة واحدة على الأقل يبقى **مجرد تلقائيًا**. والأصناف اللي بترث منه **لازم** تنفذ الدوال البحتة دي، وإلا تبقى مجردة كمان.",
      },
      {
        heading: "التطبيق العملي: قايمة أشكال متنوعة",
        body: "القوة الحقيقية بتظهر لما تجمع كائنات من صنوف مختلفة في حاوية واحدة:\n\n```cpp\nvector<Shape*> shapes;\nshapes.push_back(new Circle(3));\nshapes.push_back(new Square(4));\n\nfor (Shape* s : shapes) {\n    cout << s->area() << endl;\n}\n```\n\nكل عنصر ليه نوع مختلف، لكن نفس الكود بيشتغل معاهم كلهم. ده اللي بنسميه **تعدد الأشكال في وقت التشغيل (Runtime Polymorphism)**.",
      },
      {
        heading: "Overloading مقابل Overriding",
        body: "- **Overloading (تحميل زائد):** أكتر من دالة بنفس الاسم في نفس النطاق لكن بباراميترز مختلفة. المترجم يختار حسب الباراميترز. بيحصل في **وقت الترجمة (Compile Time)**.\n- **Overriding (إعادة تعريف):** الابن بيغيّر تنفيذ دالة افتراضية موجودة عند الأب. الاختيار بيحصل في **وقت التشغيل (Runtime)** حسب النوع الحقيقي للكائن.\n\nواحد بيحل مشكلة التنوع في التوقيع، والتاني بيحل مشكلة التنوع في النوع.",
      },
    ],
    code: [
      {
        title: "صنف مجرد Shape وتعدد الأشكال",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;   // دالة افتراضية بحتة
    virtual string name() const = 0;

    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    double area() const override {
        return 3.14159 * radius * radius;
    }

    string name() const override {
        return "دائرة";
    }
};

class Square : public Shape {
private:
    double side;

public:
    Square(double s) : side(s) {}

    double area() const override {
        return side * side;
    }

    string name() const override {
        return "مربع";
    }
};

int main() {
    vector<Shape*> shapes;
    shapes.push_back(new Circle(3));
    shapes.push_back(new Square(4));

    for (Shape* s : shapes) {
        cout << s->name() << " - المساحة: " << s->area() << endl;
    }

    for (Shape* s : shapes) {
        delete s;
    }

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين Overloading و Overriding؟",
        options: [
          "مفيش فرق",
          "Overloading نفس الاسم بتوقيعات مختلفة في وقت الترجمة، Overriding إعادة تعريف دالة افتراضية في وقت التشغيل",
          "Overriding أسرع دايماً",
          "Overloading بيحصل جوه الأصناف بس",
        ],
        answer: 1,
        explanation: "Overloading بتختار وقت الترجمة حسب الباراميترز، Overriding بتقلب سلوك الدالة حسب نوع الكائن وقت التشغيل.",
      },
      {
        question: "إيه المقصود بالصنف المجرد (Abstract Class)؟",
        options: [
          "صنف بدون خصائص",
          "صنف فيه دالة افتراضية بحتة واحدة على الأقل ومش بننشئ منه كائنات",
          "صنف بدون بنّاء",
          "صنف كله public",
        ],
        answer: 1,
        explanation: "وجود دالة `= 0` بيحول الصنف لمجرد ويمنع إنشاء كائنات منه.",
      },
      {
        question: "ليه بنحط `override` بعد تعريف الدالة في الابن؟",
        options: [
          "عشان الكود يبقى أطول",
          "عشان نأكد للمترجم إننا بنعيد تعريف دالة أب ونستفيد من حماية الأخطاء",
          "عشان الدالة تبقى virtual تلقائيًا",
          "اختياري ومفيش فايدة",
        ],
        answer: 1,
        explanation: "override بتمنع أخطاء زي اختلاف الاسم أو التوقيع وتوضح النية.",
      },
    ],
    exercise:
      "ابنِ صنف مجرد `Shape` فيه دالة بحتة `double area()`. وارث منه `Triangle` (قاعدة × ارتفاع ÷ 2) و`Rectangle`. اعمل vector من مؤشرات Shape* فيها 3 كائنات متنوعة واطبع مجموع المساحات.",
    terms: [
      { en: "Polymorphism", ar: "تعدد الأشكال: نفس الدالة بسلوك مختلف حسب نوع الكائن." },
      { en: "Virtual Function", ar: "دالة افتراضية: دالة عند الأب قابلة لإعادة التعريف في الأصناف المشتقة." },
      { en: "Abstract Class", ar: "صنف مجرد: صنف فيه دالة افتراضية بحتة ومش بننشئ منه كائنات." },
      { en: "Override", ar: "إعادة تعريف: الابن بيغير تنفيذ دالة افتراضية موجودة عند الأب." },
    ],
  },
  {
    id: "operator-overloading",
    title: "تحميل زائد للعوامل Operator Overloading",
    titleEn: "Operator Overloading",
    duration: "40 دقيقة",
    description:
      "تخيّل إنك تقدر تجعل `+` بتاع objects أو `cout <<` بتاع objects. هنا هنعلم العمليات تتعامل مع صنوفنا بنفس السلاسة.",
    sections: [
      {
        heading: "إيه هو تحميل العوامل الزائد؟",
        body: "تحميل العوامل الزائد (Operator Overloading) معناه إنك **تعيد تعريف سلوك العمليات زي `+` و `-` و `==` و `<<`** عشان تشتغل مع صنوفك أنتا معرّفها.\n\nيعني بدل ما تكتب:\n\n```cpp\nComplex c = add(a, b);\n```\n\nتكتب:\n\n```cpp\nComplex c = a + b;\n```\n\nالكود بقى طبيعي ومقروء — زي ما لو كانت أرقام عادية.",
      },
      {
        heading: "إعادة تعريف + و -",
        body: "الصيغة العامة:\n\n```cpp\nReturnType operator@(params) const {\n    // المنطق\n}\n```\n\nمثال على الأعداد المركبة:\n\n```cpp\nComplex operator+(const Complex& other) const {\n    return Complex(real + other.real, imag + other.imag);\n}\n```\n\nلاحظ: `const` في الآخر معناها إن العملية **مش بتغير** الكائن الحالي، وبترجع كائن جديد.",
      },
      {
        heading: "إعادة تعريف << عشان نطبع بكور",
        body: "من أشهر الاستخدامات: نجعل `cout << كائنك` يشتغل. لازم تعرف دالة `operator<<` اللي بتاخد `ostream&` والكائن:\n\n```cpp\nfriend ostream& operator<<(ostream& out, const Complex& c) {\n    out << c.real << \" + \" << c.imag << \"i\";\n    return out;\n}\n```\n\n- بنرجع `ostream&` عشان نسمح بالسلسلة: `cout << a << b << endl;`.\n- بنستخدم `friend` عشان الدالة توصل للخصائص الخاصة.",
      },
      {
        heading: "قواعد ومحاذير مهمة",
        body: "- **مبتخلقش عمليات جديدة:** تقدر تعيد تعريف الموجود بس، ومبتقدرش تغير عدد المدخلات بتاعها.\n- **الأسبقية بتبقى زي ما هي:** مبتتغيرش ترتيب تنفيذ العمليات.\n- **لا تحمّل `+` عشان يطرح:** دي حاجة تخلي الكود كتاب غامض — سيب العملية معناها الطبيعي.\n- **قارن بـ `const`:** سيب الكائنات الأصلية زي ما هي وارجع كائن جديد لما يكون منطقي.",
      },
      {
        heading: "إعادة تعريف == ومقارنات",
        body: "المقارنات كمان تقدر تعيد تعريفها:\n\n```cpp\nbool operator==(const Complex& other) const {\n    return real == other.real && imag == other.imag;\n}\n```\n\nلما تعرف `==`، غالبًا محتاج تعرف `!=` كمان.\n\nنصيحة: خلي التعريفات بسيطة ومتوقعة — التحميل الزائد من غير سبب كويس بيبقى عبء.",
      },
    ],
    code: [
      {
        title: "عمليات على الأعداد المركبة",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

class Complex {
private:
    double real;
    double imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    Complex operator-(const Complex& other) const {
        return Complex(real - other.real, imag - other.imag);
    }

    bool operator==(const Complex& other) const {
        return real == other.real && imag == other.imag;
    }

    // صداقة عشان نوصل للحقول الخاصة
    friend ostream& operator<<(ostream& out, const Complex& c) {
        out << c.real;
        if (c.imag >= 0) out << " + ";
        out << c.imag << "i";
        return out;
    }
};

int main() {
    Complex a(2, 3);
    Complex b(1, -4);

    Complex c = a + b;
    Complex d = a - b;

    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
    cout << "a + b = " << c << endl;
    cout << "a - b = " << d << endl;
    cout << "a == b ? " << (a == b) << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الهدف من إعادة تعريف `operator+` في صنف معقد؟",
        options: [
          "عشان البرنامج يشتغل أسرع",
          "عشان نجعل الكود طبيعي وقابل للقراءة: a + b",
          "عشان نمنع جمع الأعداد",
          "عشان نختصر اسم الدالة",
        ],
        answer: 1,
        explanation: "Operator overloading بيجعل استخدام الصنف يبدو زي استخدام الأنواع المدمجة.",
      },
      {
        question: "ليه بنرجع `ostream&` من `operator<<`؟",
        options: [
          "عشان نسمح بسلسلة الطباعة: cout << a << b",
          "عشان نطبع على الشاشة",
          "عشان نحول النص لرقم",
          "عشان الدالة تبقى void",
        ],
        answer: 0,
        explanation: "إرجاع الـ stream بيسمح بربط عمليات الطباعة ورا بعض.",
      },
      {
        question: "إيه المعنى الصحيح لـ `const` في آخر `Complex operator+(...) const`؟",
        options: [
          "الكائن المرجع ثابت",
          "الدالة مش بتغير الكائن الحالي",
          "الدالة بترجع صفر",
          "الدالة مش بترجع حاجة",
        ],
        answer: 1,
        explanation: "const بعد التوقيع بيضمن إن الكائن اللي اتنادى عليه مش بيتغير.",
      },
    ],
    exercise:
      "عرّف صنف `Fraction` (بسط ومقام) وأعد تعريف `+` و `==` و `<<`. اختبر: `Fraction a(1, 2), b(1, 3); cout << a + b;` — لازم يطلع 5/6 (بدون اختزال).",
    terms: [
      { en: "Operator Overloading", ar: "تحميل زائد للعوامل: إعادة تعريف سلوك العمليات زي + و == للصنوف المخصصة." },
      { en: "friend function", ar: "دالة صديقة: دالة مش عضو في الصنف لكن ليها حق الوصول للخصائص الخاصة." },
      { en: "Ostream", ar: "مجرى الإخراج: الكائن cout من نوع ostream اللي بيطبع النصوص." },
      { en: "Const Method", ar: "دالة ثابتة: دالة متعرفش إنها بتغير بيانات الكائن." },
    ],
  },
  {
    id: "oop-project",
    title: "مشروع: نظام إدارة طلاب بالـ OOP",
    titleEn: "Project: Student Management System",
    duration: "70 دقيقة",
    description:
      "وقت المشروع الكبير: هنبني نظام إدارة طلاب كامل بـ OOP — أصناف، وراثة، وتغليف. المشروع ده هيبقى زي تخرج صغير في جيبك.",
    sections: [
      {
        heading: "تخطيط المشروع: قبل ما نكتب سطر",
        body: "أي مشروع كبير بيبدأ ب **التحليل (Analysis)**. هنحدد:\n\n- **الطلبة (Students):** كل واحد ليه اسم ورقم ودرجات.\n- **المدير (Manager):** مسؤول يضيف طلبة، يضيف درجات، ويطبع التقارير.\n- **العلاقات:** المدير عنده قايمة طلبة.\n\nهنبني صنفين: `Student` للطالب، و`StudentManager` للإدارة. ده تطبيق عملي للـ **التغليف (Encapsulation)** — المدير هو اللي يتحكم في البيانات.",
      },
      {
        heading: "الصنف Student: البيانات والسلوك",
        body: "الطالب عنده:\n\n- خصائص خاصة: `name` و`id` و`grades`.\n- دوال عامة: `addGrade` و`average` و`print`.\n\nالمتوسط بيتحسب من الدرجات المخزنة. لو مفيش درجات، المتوسط صفر — ودي حماية من القسمة على صفر.",
      },
      {
        heading: "الصنف StudentManager: الإدارة المركزية",
        body: "المدير عنده `vector<Student>` ودوال:\n\n- `addStudent` — يضيف طالب جديد.\n- `addGrade` — يدوّر على الرقم ويضيف درجة.\n- `printAll` — يطبع كل الطلبة ومتوسطاتهم.\n\nملاحظة: الطالب بيتحط كـ **value** جوه الـ vector، فبنحتاج دوال جتر عشان نوصل للاسم والرقم.",
      },
      {
        heading: "تشغيل النظام واختباره",
        body: "في `main`، هنعمل مدير، نضيف طلبة، نضيف درجات، ونطبع التقرير النهائي. شغّل الكود بنفسك وجرّب:\n\n- إضافة طالب جديد.\n- إضافة درجة لكل طالب.\n- طباعة كل التقارير.\n\nشوف إزاي كل صنف مسؤول عن حاجة واحدة — ده جمال الـ OOP.",
      },
      {
        heading: "تحسينات ممكنة (تحدي)",
        body: "المشروع قابل للتوسع:\n\n- ابحث عن طالب بالاسم أو بالرقم.\n- اطبع الطالب صاحب أعلى متوسط.\n- احفظ البيانات في ملف (هنتعلمه في درس الملفات).\n- استخدم **الوراثة**: `Student` و`GraduateStudent` بخصائص إضافية.\n\nكل تحسين بيفتح باب لتطبيق مبدأ جديد اتعلمناه.",
      },
    ],
    code: [
      {
        title: "نظام إدارة الطلاب كامل",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Student {
private:
    string name;
    int id;
    vector<double> grades;

public:
    Student(int studentId, string studentName) : id(studentId), name(studentName) {}

    void addGrade(double grade) {
        if (grade >= 0 && grade <= 100) {
            grades.push_back(grade);
        }
    }

    double average() const {
        if (grades.empty()) return 0;
        double sum = 0;
        for (double g : grades) {
            sum += g;
        }
        return sum / grades.size();
    }

    int getId() const { return id; }
    string getName() const { return name; }

    void print() const {
        cout << "الاسم: " << name << " | الرقم: " << id
             << " | المتوسط: " << average() << endl;
    }
};

class StudentManager {
private:
    vector<Student> students;

public:
    void addStudent(int id, string name) {
        students.push_back(Student(id, name));
        cout << "تمت إضافة الطالب بنجاح" << endl;
    }

    void addGrade(int id, double grade) {
        for (Student& s : students) {
            if (s.getId() == id) {
                s.addGrade(grade);
                cout << "تمت إضافة الدرجة" << endl;
                return;
            }
        }
        cout << "الطالب غير موجود" << endl;
    }

    void printAll() const {
        if (students.empty()) {
            cout << "مفيش طلاب بعد" << endl;
            return;
        }
        for (const Student& s : students) {
            s.print();
        }
    }
};

int main() {
    StudentManager manager;

    manager.addStudent(1, "أحمد");
    manager.addStudent(2, "سارة");

    manager.addGrade(1, 85);
    manager.addGrade(1, 92);
    manager.addGrade(2, 78);

    manager.printAll();

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفائدة من تقسيم المشروع لصنفين `Student` و`StudentManager`؟",
        options: [
          "عشان الكود يبقى أطول",
          "عشان كل صنف يكون مسؤول عن حاجة واحدة — فصل المسؤوليات",
          "عشان البرنامج يشتغل أسرع",
          "مفيش فائدة",
        ],
        answer: 1,
        explanation: "فصل المسؤوليات بيخلي الكود أنظف وأسهل في الصيانة والاختبار.",
      },
      {
        question: "ليه بنستخدم vector جوه StudentManager بدل مصفوفة عادية؟",
        options: [
          "عشان الحجم ثابت",
          "عشان الـ vector بيتوسع تلقائي ومش محتاج نعرف العدد من الأول",
          "عشان المصفوفة أسرع دايماً",
          "مفيش فرق",
        ],
        answer: 1,
        explanation: "vector بيسمح بإضافة أي عدد من الطلاب من غير تحديد الحجم مسبقًا.",
      },
      {
        question: "إيه اللي بيحصل لو حاولت تحسب متوسط طالب معندوش درجات؟",
        options: [
          "البرنامج يكسر دايمًا",
          "الدالة بترجع 0 بسبب الفحص الأول",
          "القسمة بتعطي قيمة لا نهائية",
          "المترجم يمنع التشغيل",
        ],
        answer: 1,
        explanation: "الفحص الأولي بيمنع القسمة على صفر ويرجع 0 كقيمة افتراضية.",
      },
    ],
    exercise:
      "وسّع النظام: أضف دالة `findById(int id)` في `StudentManager` ترجع مؤشر للطالب أو `nullptr` لو مش موجود، واكتب قائمة خيارات (1. إضافة طالب، 2. إضافة درجة، 3. طباعة الكل).",
    terms: [
      { en: "Separation of Concerns", ar: "فصل المسؤوليات: كل صنف مسؤول عن حاجة واحدة واضحة." },
      { en: "Vector", ar: "مصفوفة ديناميكية: حاوية من مكتبة STL بتتوسع تلقائيًا." },
      { en: "Composition", ar: "تركيب: صنف بيحتوي صنف تاني كجزء من بياناتة." },
      { en: "Getter", ar: "جتر: دالة بترجع قيمة خاصية خاصة." },
    ],
  },
];
