import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "compiler-intro",
    title: "ما هو المترجم؟ مراحل الترجمة",
    titleEn: "What is a Compiler?",
    duration: "45 دقيقة",
    description:
      "هتفهم إزاي الكود اللي بتكتبه بيتحول لأوامر يفهمها المعالج، وتتعرف على مراحل الترجمة الأربع الأساسية.",
    sections: [
      {
        heading: "المترجم: حلقة الوصل بينك وبين الآلة",
        body: "المترجم (Compiler) هو برنامج بيقرأ الكود اللي بتكتبه أنت — بلغتك البشرية مهما كانت C++ أو Rust أو Swift — ويحوّله لأوامر يفهمها المعالج مباشرة. تخيل إنك بتتكلم مع ترجمان بيترجم كلامك للغة العجمي في نفس اللحظة؛ المترجم بيعمل كده بالظبط، لكن بسرعة ملايين الكلمات في الثانية.\n\nمن غير المترجم، مكنتش هتقدر تكتب أي برنامج حديث. المعالج بيفهم لغة واحدة بس: لغة الآلة (Machine Code)، وهي سلسلة من الأصفار والواحدات. المترجم هو اللي بيوفر عليك عناء كتابة الأصفار والواحدات دي.",
      },
      {
        heading: "ليه مش بنكتب كود الآلة مباشرة؟",
        body: "في بدايات الكمبيوتر (الأربعينات والخمسينات)، المبرمجين كانوا فعلاً بيكتبوا كود الآلة بإيدهم. كانوا بيكتبوا أرقام السجلات وعناوين الذاكرة يدويًا. الموضوع كان بطيء جدًا ومليان أخطاء.\n\nبعد كده ظهرت **لغة التجميع (Assembly)** — لغة رموز بتقابل كل أمر آلة، أسهل في القراءة. لكن البرامج بقى ليها أحجام كبيرة، واللي بيشتغل على معالج إنتل مش بيشتغل على معالج ARM من غير إعادة كتابة.\n\nالحل كان **اللغات عالية المستوى (High-Level Languages)** زي C وC++ وPython، اللي بتسمح لك تكتب كود قريب من التفكير البشري، والمترجم يتولى التحويل للآلة.",
      },
      {
        heading: "مراحل الترجمة الأربع",
        body: "أي مترجم محترم بيمر بمراحل أساسية، كل مرحلة بتنتج مخرجات المرحلة اللي بعدها:\n\n1. **التحليل اللغوي (Lexical Analysis):** تحويل الحروف لـ **Tokens** — وحدات صغيرة زي الأرقام والكلمات المفتاحية والرموز. هذه المرحلة هي الـ Lexer.\n2. **التحليل النحوي (Syntax Analysis):** التأكد إن تسلسل الـ Tokens ماشي على القواعد النحوية (Grammar) للغة، وبناء **شجرة بناء الجملة المجردة (AST)**. هذه المرحلة هي الـ Parser.\n3. **توليد الكود (Code Generation):** تحويل الـ AST لكود آلة أو شيفرة وسيطة.\n4. **تحسين الكود (Optimization):** تحسين الكود الناتج عشان يكون أسرع وأصغر من غير ما يغير معناه.\n\nالمراحل دي بتشتغل مع بعض في الـ Pipeline، وكل مرحلة بتركز على حاجة واحدة.",
      },
      {
        heading: "أنواع المترجمات",
        body: "- **المترجم الأصلي (Native Compiler):** بيحوّل الكود المصدري مباشرة لكود آلة للمعالج اللي بتشتغل عليه، زي g++ و clang++.\n- **مترجم الشيفرة الوسيطة (Bytecode Compiler):** بيحوّل الكود لشيفرة وسيطة بيتفسرها جهاز افتراضي — زي Java اللي بتترجم لـ Bytecode ويتشغل على JVM.\n- **المترجم الفوري (JIT):** بيترجم الشيفرة الوسيطة لكود آلة في وقت التشغيل، زي اللي بيحصل في Java وC# وJavaScript الحديث.\n\nكل نوع ليه تنازلات: الأصلي أسرع في التشغيل لكن محتاج إعادة تجميع لكل منصة، والشيفرة الوسيطة بتمنح استقلالية المنصات لكن مع تكلفة أداء.",
      },
      {
        heading: "رحلة الملف من المصدر للتنفيذ",
        body: "قبل ما المترجم بيبدأ، في مرحلة اسمها **المعالجة المسبقة (Preprocessing)** — فيها السطور اللي بتبدأ بـ `#` زي `#include` بتتنفذ: بنسخ محتوى الملفات اللي بنستدعيها جوه الملف بتاعك.\n\nبعد المترجم، في مرحلة **الربط (Linking)**: لما يكون عندك أكتر من ملف، المترجم بيحوّل كل ملف لكود آلة، والـ Linker بيربطهم في ملف تنفيذي واحد.\n\nالخلاصة: الكود اللي بتكتبه بيمر بسلسلة تحويلات منطقية، وكل مترجم في العالم بيعمل نفس الخطوات الأساسية تقريبًا.",
      },
    ],
    code: [
      {
        title: "برنامج بسيط — لاحظ كل مرحلة في التعليقات",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

int main() {
    int a = 5;          // Lexer: 3 Tokens (int, a, 5)
    int b = 3;          // Parser: جملة تعريف سليمة
    int sum = a + b;    // CodeGen: أمر جمع في الآلة
    cout << "5 + 3 = " << sum << endl;
    return 0;           // Optimization: النتيجة 8 تعرف وقت الترجمة
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الوظيفة الأساسية للمترجم؟",
        options: [
          "تحويل الكود عالي المستوى لكود آلة",
          "تشغيل البرنامج مباشرة",
          "تصميم واجهة المستخدم",
          "إرسال البيانات عبر الشبكة",
        ],
        answer: 0,
        explanation: "المترجم بيترجم الكود اللي بتكتبه للغة الآلة اللي المعالج بيفهمها.",
      },
      {
        question: "إيه الترتيب الصحيح لمراحل الترجمة؟",
        options: [
          "Lexing → Parsing → CodeGen → Optimization",
          "Parsing → Lexing → Optimization → CodeGen",
          "Optimization → CodeGen → Parsing → Lexing",
          "CodeGen → Parsing → Lexing → Optimization",
        ],
        answer: 0,
        explanation: "بنحلل حرفياً الأول، وبعدين نحلل نحوياً، وبعدين نولد الكود، وبعدين نحسنه.",
      },
      {
        question: "إيه الفرق بين المترجم الأصلي ومترجم الشيفرة الوسيطة؟",
        options: [
          "الأصلي بيترجم لكود آلة مباشرة، والوسيط بيترجم لشيفرة يتفسرها جهاز افتراضي",
          "مفيش فرق بينهم",
          "الوسيط أسرع دائماً",
          "الأصلي بيشتغل على كل منصة من غير تعديل",
        ],
        answer: 0,
        explanation: "المترجم الأصلي بيطلع كود آلة خاص بمعالج معين، بينما الوسيط بيطلع Bytecode عام.",
      },
    ],
    exercise:
      "اكتب برنامج C++ فيه 3 متغيرات وعملية حسابية، وجرب ترجمه بمستوىين مختلفين: `g++ -O0` و `g++ -O2`، وقارن حجم الملفين التنفيذيين.",
    terms: [
      { en: "Compiler", ar: "مترجم: برنامج بيحوّل الكود اللي بتكتبه للغة الآلة اللي الكمبيوتر بيفهمها." },
      { en: "Token", ar: "وحدة لغوية: أصغر جزء ليه معنى في اللغة، زي رقم أو كلمة مفتاحية أو عامل." },
      { en: "AST", ar: "شجرة بناء الجملة المجردة: تمثيل شجري للبرنامج بيتبني في مرحلة التحليل النحوي." },
      { en: "Native Code", ar: "كود أصلي: كود آلة مخصص لمعالج معين، بيتنفذ مباشرة من غير وسيط." },
    ],
  },
  {
    id: "lexer",
    title: "المحلل اللغوي Lexer",
    titleEn: "Lexer",
    duration: "55 دقيقة",
    description:
      "أول مرحلة في أي مترجم: تحويل سلسلة الحروف لسلسلة من الوحدات الصغيرة (Tokens) اللي بتمثل أصغر جزء ليه معنى.",
    sections: [
      {
        heading: "دور المحلل اللغوي",
        body: "المحلل اللغوي (Lexer) هو أول مرحلة في المترجم. مهمته بسيطة: ياخد الملف النصي (سلسلة حروف) ويحوّلها لسلسلة من الوحدات الصغيرة المسماة **Tokens**. الـ Token هو أصغر وحدة ليها معنى في اللغة — رقم، اسم متغير، علامة عملية، أو قوس.\n\nمثال: السطر `int sum = a + b;` بيتخصص لـ Tokens زي: `int` (كلمة مفتاحية)، `sum` (مُعرّف)، `=` (عامل إسناد)، `a` (مُعرّف)، `+` (عامل جمع)، `b` (مُعرّف)، `;` (نهاية جملة).\n\nالـ Lexer مش بيفهم المعنى أو القواعد النحوية — هو بس بيصنّف الوحدات. القواعد النحوية بتيجي في المرحلة اللي بعدها (الـ Parser).",
      },
      {
        heading: "إيه الـ Token؟",
        body: "تخيل إنك بتقطّع جملة لكلمات وعلامات ترقيم. كل قطعة اسمها Token، وليها نوع (Type) وقيمة (Value).\n\nأنواع الـ Tokens الشائعة:\n\n- **الكلمات المفتاحية (Keywords):** زي `if` و `for` و `int` — كلمات محجوزة من اللغة.\n- **المُعرّفات (Identifiers):** أسماء المتغيرات والدوال زي `count` و `calculate`.\n- **الأرقام الحرفية (Literals):** زي `42` و `3.14`.\n- **العوامل (Operators):** زي `+` و `-` و `*` و `==`.\n- **علامات الترقيم (Punctuation):** زي `;` و `(` و `)`.\n- **التعليقات والمسافات:** بيتتجاهلوا في العادة (مفيش منهم Tokens).",
      },
      {
        heading: "إزاي بيشتغل الـ Lexer؟",
        body: "الخوارزمية الأساسية بتلف على الحروف حرف حرف:\n\n1. ابدأ من أول حرف.\n2. لو حرف مسافة أو سطر جديد، اتجاهله.\n3. لو رقم، قرا الأرقام اللي ورا بعضها لحد ما تلاقي حرف أو رمز — ده Token رقم.\n4. لو حرف، قرا الحروف والأرقام والشرطات السفلية ورا بعضها — ده إما كلمة مفتاحية أو مُعرّف.\n5. لو رمز زي `+` أو `(`، حوّله لـ Token من نوعه.\n6. لو لقيت حرف مش معروف، طلّع خطأ (Lexical Error).\n\nمبدأ **Maximum Munch** (أقصى مضغة) بيحكم في الاختيار: لو عندك سلسلة رموز، بياخد أطول Token ممكن. مثال: `>=` بيتعامل معاه كـ Token واحد (أكبر من أو يساوي) مش `>` و `=`.",
      },
      {
        heading: "الأخطاء اللي بتقابلها الـ Lexer",
        body: "- **حرف غير قانوني:** زي استخدام `@` في مكان مش مسموح.\n- **رقم غير مكتمل:** زي `123abc` — هل هو رقم ولا مُعرّف؟ المترجم بيقرر حسب قواعده.\n- **تعليق مفتوح:** لو بدأت `/*` ومقفلتهاش بـ `*/`.\n- **نص مش متقفل:** لو نسيت علامة التنصيص في نص.\n\nفي الغالب الأخطاء دي بتكون واضحة وسهلة الإصلاح، ورسالة المترجم بتقول لك رقم السطر.",
      },
      {
        heading: "مثال: بناء Lexer بلغة C++",
        body: "هنكتب Lexer بسيط لتحليل تعبيرات حسابية. الكود بيوضح كل المفاهيم اللي اتكلمنا عنها: تعداد الحروف الرقمية متعددة الخانات، تجاهل المسافات، وطباعة نوع كل Token.",
      },
    ],
    code: [
      {
        title: "Lexer كامل لتحليل تعبير حسابي",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
#include <cctype>
using namespace std;

enum class TokenType {
    Number, Plus, Minus, Star, Slash, LParen, RParen, End
};

struct Token {
    TokenType type;
    string text;
};

string typeName(TokenType t) {
    switch (t) {
        case TokenType::Number: return "Number";
        case TokenType::Plus: return "Plus";
        case TokenType::Minus: return "Minus";
        case TokenType::Star: return "Star";
        case TokenType::Slash: return "Slash";
        case TokenType::LParen: return "LParen";
        case TokenType::RParen: return "RParen";
        default: return "End";
    }
}

class Lexer {
    string src;
    size_t pos = 0;

public:
    Lexer(const string& s) : src(s) {}

    vector<Token> tokenize() {
        vector<Token> tokens;
        while (pos < src.size()) {
            char c = src[pos];

            if (isspace((unsigned char)c)) { pos++; continue; }

            if (isdigit((unsigned char)c)) {
                string num;
                while (pos < src.size() && isdigit((unsigned char)src[pos])) {
                    num += src[pos];
                    pos++;
                }
                tokens.push_back({TokenType::Number, num});
                continue;
            }

            TokenType type;
            if (c == '+') type = TokenType::Plus;
            else if (c == '-') type = TokenType::Minus;
            else if (c == '*') type = TokenType::Star;
            else if (c == '/') type = TokenType::Slash;
            else if (c == '(') type = TokenType::LParen;
            else if (c == ')') type = TokenType::RParen;
            else {
                cerr << "حرف غير معروف: " << c << endl;
                pos++;
                continue;
            }
            tokens.push_back({type, string(1, c)});
            pos++;
        }
        tokens.push_back({TokenType::End, ""});
        return tokens;
    }
};

int main() {
    Lexer lexer("12 + 3 * (4 - 2)");
    vector<Token> tokens = lexer.tokenize();
    for (const Token& t : tokens) {
        cout << typeName(t.type) << " -> " << t.text << endl;
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الناتج المباشر لمرحلة التحليل اللغوي؟",
        options: [
          "شجرة بناء الجملة AST",
          "سلسلة من الـ Tokens",
          "كود آلة",
          "ملف تنفيذي",
        ],
        answer: 1,
        explanation: "الـ Lexer بيطلع سلسلة Tokens، والـ Parser هو اللي بيحولها لـ AST.",
      },
      {
        question: "أي حاجة من دي تعتبر Token؟",
        options: [
          "مسافة بيضاء",
          "اسم متغير",
          "سطر فارغ",
          "علامة ترقيم مش مفهومة",
        ],
        answer: 1,
        explanation: "المُعرّف (اسم المتغير) Token أساسي، أما المسافات والسطور الفارغة فبتتجاهل.",
      },
      {
        question: "مبدأ Maximum Munch معناه إيه؟",
        options: [
          "إن المترجم ياخد أطول Token ممكن من الحروف",
          "إن المترجم بيقرا الحروف بسرعة كبيرة",
          "إن المترجم بيفضل يدور على الكلمات المفتاحية بس",
          "إن المترجم بيمسح المسافات في الآخر",
        ],
        answer: 0,
        explanation: "بيختار أطول وحدة لغوية ممكنة، عشان `>=` يتعامل معاه كـ Token واحد.",
      },
    ],
    exercise:
      "عدّل الـ Lexer عشان يدعم الأرقام العشرية (مثلاً `3.14`) والعلامة `==`. جرّب تحلل التعبير `10.5 == 3.14 + 7.36`.",
    terms: [
      { en: "Lexer", ar: "محلل لغوي: أول مرحلة في المترجم، بتحول الحروف لسلسلة من الـ Tokens." },
      { en: "Token", ar: "وحدة لغوية: أصغر جزء ليه معنى في اللغة، زي رقم أو كلمة مفتاحية أو عامل." },
      { en: "Keyword", ar: "كلمة مفتاحية: كلمة محجوزة من اللغة ليها معنى خاص زي if و while و int." },
      { en: "Whitespace", ar: "مسافات بيضاء: المسافات والـ tabs والأسطر الجديدة اللي بتفصل بين الكلمات وبتتجاهل." },
    ],
  },
  {
    id: "parser",
    title: "المحلل النحوي Parser و AST",
    titleEn: "Parser & AST",
    duration: "60 دقيقة",
    description:
      "من سلسلة الـ Tokens لشجرة بناء الجملة: هنكتب Parser يدوي باستخدام تقنية Recursive Descent.",
    sections: [
      {
        heading: "ليه نحتاج Parser؟",
        body: "الـ Lexer بيطلع سلسلة Tokens، لكن سلسلة Tokens لوحدها مش معناها حاجة. لازم نتأكد إن التسلسل ماشي على القواعد النحوية للغة.\n\nمثال: التعبير `1 + 2 * 3` سليم، لكن `1 + * 2` مش سليم — علامة `*` لازم يكون بعدها رقم. الـ Parser هو اللي بيقرر ده.\n\nمش بس كده: الـ Parser كمان بيبني تمثيل بيانات اسمه **شجرة بناء الجملة المجردة (AST)** — وهي اللي بتوصّل المعنى الحقيقي للبرنامج لمراحل توليد الكود.",
      },
      {
        heading: "القواعد النحوية",
        body: "القواعد النحوية (Grammar) هي مجموعة قواعد بتصف إزاي تتكون الجمل السليمة في اللغة. مثال مبسط لقواعد التعبيرات الحسابية:\n\n```text\nexpr   := term (('+' | '-') term)*\nterm   := factor (('*' | '/') factor)*\nfactor := NUMBER | '(' expr ')'\n```\n\nالقواعد دي بتقول: التعبير عبارة عن حدود (terms) متقطّعة بجمع أو طرح، وكل حد عبارة عن عوامل (factors) متراكبة بضرب أو قسمة، والعامل إما رقم أو تعبير جوه قوسين.\n\nالترتيب ده هو اللي بيحدد أسبقية العمليات: الأقواس أقوى، وبعدين الضرب والقسمة، وبعدين الجمع والطرح.",
      },
      {
        heading: "شجرة بناء الجملة المجردة AST",
        body: "الـ AST هي شجرة بتمثل البرنامج. كل عقدة (Node) بتمثل عملية أو قيمة:\n\n- العقدة اللي فيها `+` ليها فرعين: الطرف الأيسر والطرف الأيمن.\n- العقدة اللي فيها رقم ما لهاش فروع — دي **ورقة (Leaf)**.\n\nمثال: التعبير `1 + 2 * 3` بيتوثق كشجرة:\n\n```text\n    +\n   / \\\n  1   *\n     / \\\n    2   3\n```\n\nلاحظ إن `*` تحت `+` في الشجرة — ده معناه إن الضرب هيتنفذ الأول، بالظبط زي أسبقية العمليات في الرياضة.",
      },
      {
        heading: "تحليل نزول العودة (Recursive Descent)",
        body: "**التحليل نزول العودة (Recursive Descent)** هو أشهر طريقة لكتابة Parser يدوي. الفكرة بسيطة: لكل قاعدة نحوية، بنكتب دالة بترجمها.\n\n- دالة `parseExpr` بتنادي `parseTerm` مرتين، واحدة لكل طرف من علامات الجمع.\n- دالة `parseTerm` بتنادي `parseFactor` مرتين، واحدة لكل طرف من علامات الضرب.\n- دالة `parseFactor` بتنادي `parseExpr` تاني لو لقيت قوس — وده اللي بيخلق العودية (Recursion).\n\nكل دالة بتستهلك Tokens من القائمة وبتبني عقدة من الشجرة. لما الدالة تخلص، بتكون استهلكت جزء من المدخلات وبنت شجرة فرعية.",
      },
      {
        heading: "مثال: Parser كامل بلغة C++",
        body: "الكود التالي بينفذ التحليل نزول العودة ويطبع الشجرة. لاحظ إن كل دالة بترجع عقدة من الشجرة، و`parseFactor` بتتعامل مع الأقواس عن طريق نداء عودي.",
      },
    ],
    code: [
      {
        title: "Parser بتقنية Recursive Descent",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>
using namespace std;

struct Node {
    string value;
    shared_ptr<Node> left, right;
    Node(string v) : value(v), left(nullptr), right(nullptr) {}
};

class Parser {
    vector<string> tokens;
    size_t pos = 0;

public:
    Parser(const vector<string>& t) : tokens(t) {}

    string peek() {
        if (pos < tokens.size()) return tokens[pos];
        return "";
    }
    string consume() { return tokens[pos++]; }

    // expr := term (('+' | '-') term)*
    shared_ptr<Node> parseExpr() {
        auto node = parseTerm();
        while (peek() == "+" || peek() == "-") {
            string op = consume();
            auto right = parseTerm();
            auto parent = make_shared<Node>(op);
            parent->left = node;
            parent->right = right;
            node = parent;
        }
        return node;
    }

    // term := factor (('*' | '/') factor)*
    shared_ptr<Node> parseTerm() {
        auto node = parseFactor();
        while (peek() == "*" || peek() == "/") {
            string op = consume();
            auto right = parseFactor();
            auto parent = make_shared<Node>(op);
            parent->left = node;
            parent->right = right;
            node = parent;
        }
        return node;
    }

    // factor := NUMBER | '(' expr ')'
    shared_ptr<Node> parseFactor() {
        if (peek() == "(") {
            consume(); // استهلاك القوس المفتوح
            auto node = parseExpr();
            consume(); // استهلاك القوس المقفول
            return node;
        }
        return make_shared<Node>(consume());
    }
};

void printTree(const shared_ptr<Node>& node, int indent = 0) {
    if (!node) return;
    printTree(node->right, indent + 1);
    for (int i = 0; i < indent; i++) cout << "    ";
    cout << node->value << endl;
    printTree(node->left, indent + 1);
}

int main() {
    // التعبير: 1 + 2 * 3
    vector<string> tokens = {"1", "+", "2", "*", "3"};
    Parser parser(tokens);
    auto tree = parser.parseExpr();

    cout << "شجرة التعبير 1 + 2 * 3:" << endl;
    printTree(tree);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "ليه الـ Lexer وحده مش كافٍ؟",
        options: [
          "لأن الـ Lexer بطيء جداً",
          "لأن لازم نتأكد إن تسلسل الـ Tokens ماشي على القواعد النحوية ونبني AST",
          "لأن الـ Lexer بيعمل كود آلة",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "الـ Lexer بيصنّف الوحدات بس، لكن القواعد النحوية والمعنى بيتم في الـ Parser.",
      },
      {
        question: "إيه المقصود بأسبقية العمليات في القواعد النحوية؟",
        options: [
          "ترتيب تنفيذ العمليات حسب قوتها: الأقواس ثم الضرب ثم الجمع",
          "ترتيب كتابة الكود",
          "عدد العمليات في السطر",
          "سرعة المترجم",
        ],
        answer: 0,
        explanation: "القواعد النحوية بترتب العمليات حسب قوتها، فالأقواس الأقوى وبعدين الضرب وبعدين الجمع.",
      },
      {
        question: "في Recursive Descent، إزاي بنتعامل مع الأقواس؟",
        options: [
          "بنتجاهل الأقواس",
          "بنعمل نداء عودي لـ parseExpr جوه parseFactor",
          "بنحول الأقواس لأرقام",
          "بنوقف التحليل",
        ],
        answer: 1,
        explanation: "لما نلاقي قوس مفتوح، بننادي parseExpr عشان يحلل التعبير الجوه، وبعدين نستهلك القوس المقفول.",
      },
    ],
    exercise:
      "أضف دعم علامة `%` (باقي القسمة) للـ Parser. عدّل القواعد النحوية والدوال عشان تدعمها، وجرب التعبير `10 % 3 + 2`.",
    terms: [
      { en: "Parser", ar: "محلل نحوي: المرحلة اللي بتتأكد إن تسلسل الـ Tokens ماشي على القواعد وبتبني الشجرة." },
      { en: "Grammar", ar: "قواعد نحوية: مجموعة قواعد بتصف إزاي تتكون الجمل السليمة في اللغة." },
      { en: "AST", ar: "شجرة بناء الجملة المجردة: تمثيل شجري للبرنامج سهل المعالجة في المراحل الجاية." },
      { en: "Recursive Descent", ar: "تحليل نزول العودة: طريقة لكتابة Parser يدوي فيها كل قاعدة ليها دالة بتنادي بعضها." },
    ],
  },
  {
    id: "codegen",
    title: "توليد الكود Code Generation",
    titleEn: "Code Generation",
    duration: "55 دقيقة",
    description:
      "من الشجرة للآلة: هنولّد شيفرة وسيطة لآلة مكدس افتراضية، ونفهم تخصيص السجلات والـ IR.",
    sections: [
      {
        heading: "من الشجرة لكود الآلة",
        body: "بعد ما الـ Parser يبني الـ AST، يبقى عندنا تمثيل مجرد للبرنامج. مرحلة توليد الكود (Code Generation) بتاخد الشجرة دي وتنتج كود قابل للتنفيذ.\n\nفي المشاريع الحقيقية، المترجم بيحوّل الـ AST ل**شيفرة وسيطة (Intermediate Representation - IR)** الأول، وبعدين الـ IR بيتوزع على كود الآلة لكل معالج. ليه؟ عشان نفصل بين واجهة الأمام (الـ Frontend) اللي بتفهم اللغة، وواجهة الخلف (الـ Backend) اللي بتولد الكود.",
      },
      {
        heading: "الشيفرة الوسيطة",
        body: "الشيفرة الوسيطة هي لغة مجردة بين المصدر وكود الآلة. أشهر مثال عليها LLVM IR. مزاياها:\n\n- **استقلالية اللغة:** ممكن تترجم أي لغة للـ IR، وبعدين الـ IR يتحول لكود آلة.\n- **استقلالية المعالج:** الـ IR واحد، و backend مختلف لكل معمارية.\n- **سهولة التحسين:** التحسينات بتتعمل على الـ IR قبل توليد الكود.\n\nأبسط أنواع الشيفرات الوسيطة هي **شيفرة آلة المكدس (Stack Machine)** — بتستخدم مكدس (Stack) بدل السجلات.",
      },
      {
        heading: "شيفرة آلة المكدس",
        body: "في آلة المكدس، كل عملية بتشتغل على آخر قيم في المكدس:\n\n- `PUSH 2` بتحط الرقم 2 فوق المكدس.\n- `ADD` بتشيل آخر قيمتين، بتجمعهم، وبتحط الناتج.\n- `MUL` بتشيل آخر قيمتين، بيضربهم، وبتحط الناتج.\n\nمثال: التعبير `(2 + 3) * 4` بيتحول للشيفرة التالية:\n\n```text\nPUSH 2\nPUSH 3\nADD\nPUSH 4\nMUL\n```\n\nالشجرة بتتحط بترتيب **Post-order** (الفرع الأيسر، الفرع الأيمن، الجذر) عشان القيم تكون جاهزة وقت تنفيذ العملية.",
      },
      {
        heading: "تخصيص السجلات (Register Allocation)",
        body: "بدل ما نستخدم مكدس، المترجمات الحديثة بتستخدم **السجلات (Registers)** اللي جوه المعالج — وهي أسرع بكتير. مشكلة **تخصيص السجلات (Register Allocation)** هي إنه عندنا عدد محدود من السجلات، وكتير من المتغيرات.\n\nالمترجم لازم يقرر أنهي متغير يبقى في سجل وأنهي يتنقل للذاكرة (Spill). دي من أصعب المشاكل في علم المترجمات، وبتستخدم خوارزميات زي Graph Coloring.\n\nفي درس المشروع هنبني آلة مكدس بسيطة عشان نتفادى الموضوع ده.",
      },
      {
        heading: "مثال: توليد شيفرة من شجرة",
        body: "هنكتب دالة بتمشي على الشجرة بـ Post-order وتطلع شيفرة آلة مكدس. الدالة بتدور على الفرعين الأول، وبعدين تضيف الأمر المناسب للعقدة الحالية.",
      },
    ],
    code: [
      {
        title: "توليد شيفرة آلة مكدس من شجرة التعبير",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>
using namespace std;

struct Node {
    string value;
    shared_ptr<Node> left, right;
    Node(string v) : value(v), left(nullptr), right(nullptr) {}
};

void genCode(const shared_ptr<Node>& node, vector<string>& out) {
    if (!node) return;

    // نولد كود الفرعين الأول (Post-order)
    genCode(node->left, out);
    genCode(node->right, out);

    if (!node->left && !node->right) {
        out.push_back("PUSH " + node->value);
    } else if (node->value == "+") {
        out.push_back("ADD");
    } else if (node->value == "-") {
        out.push_back("SUB");
    } else if (node->value == "*") {
        out.push_back("MUL");
    } else if (node->value == "/") {
        out.push_back("DIV");
    }
}

int main() {
    // التعبير: (2 + 3) * 4
    auto root = make_shared<Node>("*");
    auto plus = make_shared<Node>("+");
    plus->left = make_shared<Node>("2");
    plus->right = make_shared<Node>("3");
    root->left = plus;
    root->right = make_shared<Node>("4");

    vector<string> code;
    genCode(root, code);

    cout << "الشيفرة المولدة لـ (2 + 3) * 4:" << endl;
    for (const string& line : code) {
        cout << "  " << line << endl;
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "ليه بنستخدم شيفرة وسيطة بدل ما نعمل كود آلة مباشرة؟",
        options: [
          "عشان نفصل واجهة الأمام عن واجهة الخلف ونحسّن بسهولة",
          "عشان الكود يبقى أبطأ",
          "عشان نتفادى الكتابة",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "الشيفرة الوسيطة بتسمح لنا نفصل اللغة عن المعالج ونطبق التحسينات في مكان واحد.",
      },
      {
        question: "في شيفرة آلة المكدس، بعد `PUSH 2` و`PUSH 3` و`ADD`، إيه اللي في المكدس؟",
        options: ["2 و3", "5", "6", "3 و5"],
        answer: 1,
        explanation: "ADD بتشيل آخر قيمتين (2 و3) وبتحط الناتج 5.",
      },
      {
        question: "إيه ترتيب المرور على الشجرة اللي بنستخدمه في توليد شيفرة المكدس؟",
        options: ["Pre-order", "In-order", "Post-order", "Level-order"],
        answer: 2,
        explanation: "بنزور الفرع الأيسر ثم الأيمن ثم الجذر، عشان القيم تكون في المكدس قبل العملية.",
      },
    ],
    exercise:
      "أضف دعم عملية الطرح في الأمثلة، واكتب دالة بتنفذ الشيفرة المولدة على مكدس حقيقي (vector) وتطبع النتيجة النهائية.",
    terms: [
      { en: "Code Generation", ar: "توليد الكود: مرحلة تحويل الـ AST لكود آلة أو شيفرة وسيطة قابلة للتنفيذ." },
      { en: "IR", ar: "شيفرة وسيطة: تمثيل مجرد للبرنامج بين المصدر وكود الآلة، زي LLVM IR." },
      { en: "Stack Machine", ar: "آلة مكدس: آلة افتراضية بتشتغل على مكدس بدل السجلات، العمليات بتاخد مدخلاتها من فوقه." },
      { en: "Register Allocation", ar: "تخصيص السجلات: عملية تحديد أنهي متغير يبقى في سجل المعالج السريع." },
    ],
  },
  {
    id: "optimization",
    title: "تحسين الكود Optimization",
    titleEn: "Optimization",
    duration: "50 دقيقة",
    description:
      "التحسين مش سحر: فهمنا أهم أنواعه (Constant Folding و Dead Code) وإزاي نقيس الأداء قبل وبعد.",
    sections: [
      {
        heading: "ليه بنحسّن الكود؟",
        body: "الكود اللي المترجم بيولده مش دايماً الأمثل. ممكن يكون فيه عمليات زيادة، أو حسابات مكررة، أو كود مش بيتنفذ خلاص. التحسين (Optimization) هو عملية تحويل الكود لكود تاني **له نفس المعنى** لكن أسرع أو أصغر.\n\nالتحسين مش تغيير سلوك البرنامج — لو البرنامج باقي 5 هيفضل 5. لو التحسين غير النتيجة، يبقى ده خطأ في المترجم (Bug) مش تحسين.",
      },
      {
        heading: "أنواع التحسينات",
        body: "- **طي الثوابت (Constant Folding):** بدل ما نحسب `2 + 3` كل مرة البرنامج يشتغل، نحسبها وقت الترجمة ونحط النتيجة `5`.\n- **حذف الكود الميت (Dead Code Elimination):** لو فيه كود مش بيتنفذ خلاص (مثلاً بعد `return`)، نشيله.\n- **حذف التعبيرات المشتركة (Common Subexpression Elimination):** لو حسبت `a * b` مرتين، نحسبها مرة ونخزن النتيجة.\n- **تحسين الحلقات (Loop Optimizations):** زي إخراج الحسابات الثابتة من داخل الحلقة (Loop Invariant Code Motion) ودمج الحلقات (Loop Unrolling).\n- **تحسين الدوال (Inlining):** بدل ما ننادي دالة صغيرة، ننسخ جسمها مكان النداء عشان نوفر تكلفة النداء.",
      },
      {
        heading: "طي الثوابت عملياً",
        body: "هنكتب دالة بتاخد شجرة التعبير وتطبق طي الثوابت. الفكرة: لو كانت العقدة ليها فرعين والفرعين كمان أرقام، نحسب النتيجة ونرجع عقدة رقمية واحدة.\n\nمثال: `(2 + 3) * x` → العقدة `+` ليها فرعين `2` و`3`، فبنحسب `5` ونرجع عقدة `5`، فيبقى التعبير `5 * x`. كأنك عملت الحساب عن المترجم.",
      },
      {
        heading: "مستويات التحسين",
        body: "المترجمات الحديثة بتوفر مستويات تحسين مختلفة:\n\n- `-O0`: بدون تحسين — أسرع ترجمة، أبطأ تشغيل، مناسب للتصحيح.\n- `-O1`: تحسينات أساسية سريعة.\n- `-O2`: تحسينات قوية من غير زيادة كبيرة في وقت الترجمة — الأكثر استخداماً.\n- `-O3`: أقصى تحسين، ممكن يزيد حجم الكود ووقت الترجمة.\n- `-Os`: تحسين للحجم (Size) مش السرعة.\n\nتذكر: التحسين مش سحر. الكود المكتوب بشكل سيء مش هيتحول لعسلة بفضل `-O3`.",
      },
      {
        heading: "قياس الأداء",
        body: "قبل ما تحسّن، لازم تقيس. **Benchmarking** هو قياس زمن تنفيذ الكود في ظروف محكمة. استخدم مكتبات زي `<chrono>` في C++ عشان تقيس بالميكروثانية. قيس قبل التحسين وبعده، واتأكد إن التحسين فعلاً حسّن — ممكن يفشل بسبب تعقيد أو سلوك الذاكرة المؤقتة.",
      },
    ],
    code: [
      {
        title: "Constant Folding على شجرة التعبير",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <memory>
#include <cctype>
using namespace std;

struct Node {
    string value;
    shared_ptr<Node> left, right;
    bool isNumber;
    Node(string v, bool num = false)
        : value(v), left(nullptr), right(nullptr), isNumber(num) {}
};

bool isNumberString(const string& s) {
    if (s.empty()) return false;
    for (char c : s) {
        if (!isdigit((unsigned char)c)) return false;
    }
    return true;
}

int toInt(const string& s) { return stoi(s); }

shared_ptr<Node> fold(shared_ptr<Node> node) {
    if (!node) return nullptr;

    node->left = fold(node->left);
    node->right = fold(node->right);

    if (node->left && node->right &&
        node->left->isNumber && node->right->isNumber) {
        int a = toInt(node->left->value);
        int b = toInt(node->right->value);
        int result = 0;

        if (node->value == "+") result = a + b;
        else if (node->value == "-") result = a - b;
        else if (node->value == "*") result = a * b;
        else if (node->value == "/" && b != 0) result = a / b;
        else return node;

        return make_shared<Node>(to_string(result), true);
    }
    return node;
}

void printInfix(const shared_ptr<Node>& node) {
    if (!node) return;
    if (node->left) cout << "(";
    printInfix(node->left);
    cout << node->value;
    printInfix(node->right);
    if (node->right) cout << ")";
}

int main() {
    // التعبير: (2 + 3) * x  ->  بعد الطي: 5 * x
    auto root = make_shared<Node>("*");
    auto plus = make_shared<Node>("+");
    plus->left = make_shared<Node>("2", true);
    plus->right = make_shared<Node>("3", true);
    root->left = plus;
    root->right = make_shared<Node>("x");

    cout << "قبل التحسين: ";
    printInfix(root);
    cout << endl;

    root = fold(root);

    cout << "بعد التحسين: ";
    printInfix(root);
    cout << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المقصود بطي الثوابت؟",
        options: [
          "حساب التعبيرات الثابتة وقت الترجمة بدل وقت التشغيل",
          "حذف الأرقام من الكود",
          "تحويل الأرقام العشرية لأعداد صحيحة",
          "ترتيب الكود بشكل أجمل",
        ],
        answer: 0,
        explanation: "بنحسب النتيجة وقت الترجمة، فالمترجم يشتغل أقل وقت التشغيل.",
      },
      {
        question: "ليه بنعمل تحسين على الشيفرة الوسيطة مش كود الآلة؟",
        options: [
          "عشان التحسينات تبقى عامة ومستقلة عن المعالج",
          "عشان كود الآلة صعب القراءة بس",
          "عشان كود الآلة أسرع",
          "مفيش فرق",
        ],
        answer: 0,
        explanation: "الشيفرة الوسيطة مستقلة عن المعالج، فالتحسينات بتشتغل لكل المنصات.",
      },
      {
        question: "إيه مستوى التحسين اللي بيستخدمه أغلب المطورين؟",
        options: ["-O0", "-O1", "-O2", "-O3"],
        answer: 2,
        explanation: "-O2 هو التوازن الجيد بين الأداء ووقت الترجمة وحجم الكود.",
      },
    ],
    exercise:
      "أضف خاصية Dead Code Elimination: اكتب دالة بتحذف أي عقدة ليها فرع واحد بس (عبعنة) وتبسيط شجرة ثنائية. جرّب تحذف العقد اللي ليها فرع واحد من شجرة التعبير.",
    terms: [
      { en: "Optimization", ar: "تحسين: تحويل الكود لكود له نفس المعنى لكن أسرع أو أصغر." },
      { en: "Constant Folding", ar: "طي الثوابت: حساب التعبيرات الثابتة وقت الترجمة بدل وقت التشغيل." },
      { en: "Dead Code Elimination", ar: "حذف الكود الميت: إزالة الكود اللي مش بيتنفذ خلاص من البرنامج." },
      { en: "Benchmarking", ar: "قياس الأداء: قياس زمن تنفيذ الكود قبل وبعد التحسين للتأكد من فاعليته." },
    ],
  },
  {
    id: "compiler-project",
    title: "مشروع: مترجم لغة حسابية بسيطة",
    titleEn: "Project: Simple Math Compiler",
    duration: "90 دقيقة",
    description:
      "هنا بنجمع كل حاجة: Lexer و Parser و CodeGen و VM في مشروع واحد بيترجم ويشغل تعبيرات حسابية كاملة.",
    sections: [
      {
        heading: "نظرة على المشروع",
        body: "في المشروع ده هنبني مترجم كامل لغة صغيرة من 4 مراحل: محلل لغوي، محلل نحوي، مولّد كود، وآلة افتراضية. المدخل هو تعبير حسابي زي `(10 + 20) * 3 - 8 / 2`، والمخرج هو النتيجة النهائية.\n\nهنشتغل على نفس الدوال اللي بنيناها في الدروس السابقة، لكن هنربطها مع بعض في برنامج واحد. دي بالظبط بنية أي مترجم حقيقي مصغّر.",
      },
      {
        heading: "المراحل الأربع في المشروع",
        body: "1. **Lexer:** بيحوّل التعبير لسلسلة Tokens من أرقام وعمليات وأقواس.\n2. **Parser:** بيحوّل الـ Tokens لشجرة AST باستخدام Recursive Descent.\n3. **CodeGen:** بيمشي على الشجرة بـ Post-order ويطلع شيفرة آلة مكدس.\n4. **VM:** بينفذ الشيفرة على مكدس من `vector<double>` ويطلع النتيجة.\n\nكل مرحلة مستقلة تماماً عن اللي بعدها، وده اللي بيخلي الكود سهل التعديل والاختبار.",
      },
      {
        heading: "تجربة المشاريع الحقيقية",
        body: "المترجمات الحقيقية زي GCC وClang بتستخدم نفس البنية دي، لكن في حجم أكبر بكتير:\n\n- **GCC** بيستخدم شيفرة وسيطة اسمها GIMPLE وRTL.\n- **LLVM** بيستخدم LLVM IR، واللي بنيت عليه لغات زي Rust وSwift.\n- **Clang** هو واجهة الأمام لـ LLVM لـ C/C++.\n\nالمشروع اللي هتبنيه هو نسخة مصغرة بنفس الأفكار، وهيديك فهم عميق لإزاي المترجمات بتشتغل من جوا.",
      },
      {
        heading: "الخطوات التنفيذية",
        body: "هنكتب المشروع على 4 مراحل:\n\n1. اكتب الـ Lexer واختبره على تعبيرات مختلفة.\n2. اكتب الـ Parser وتأكد إنه بيطلع شجرة صح.\n3. اكتب مولّد الكود وتأكد من تسلسل الأوامر.\n4. اكتب الـ VM ونفذ الشيفرة ونقارن النتيجة بالحساب اليدوي.\n\nفي الآخر هيبقى عندك مترجم شغال — وهذي لحظة فخر حقيقية.",
      },
    ],
    code: [
      {
        title: "المترجم الكامل من 4 مراحل",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <cctype>
#include <stdexcept>
using namespace std;

// ---------- 1) Lexer ----------
enum class Tok { Number, Plus, Minus, Star, Slash, LParen, RParen, End };

struct Token { Tok type; string text; };

class Lexer {
    string src;
    size_t pos = 0;
public:
    Lexer(const string& s) : src(s) {}

    vector<Token> run() {
        vector<Token> out;
        while (pos < src.size()) {
            char c = src[pos];
            if (isspace((unsigned char)c)) { pos++; continue; }

            if (isdigit((unsigned char)c)) {
                string n;
                while (pos < src.size() && isdigit((unsigned char)src[pos])) {
                    n += src[pos++];
                }
                out.push_back({Tok::Number, n});
                continue;
            }

            Tok t = Tok::End;
            if (c == '+') t = Tok::Plus;
            else if (c == '-') t = Tok::Minus;
            else if (c == '*') t = Tok::Star;
            else if (c == '/') t = Tok::Slash;
            else if (c == '(') t = Tok::LParen;
            else if (c == ')') t = Tok::RParen;
            else throw runtime_error("حرف غير مدعوم");

            out.push_back({t, string(1, c)});
            pos++;
        }
        out.push_back({Tok::End, ""});
        return out;
    }
};

// ---------- 2) AST ----------
struct Node {
    string value;
    shared_ptr<Node> left, right;
    Node(string v) : value(v), left(nullptr), right(nullptr) {}
};

class Parser {
    vector<Token> toks;
    size_t pos = 0;
public:
    Parser(const vector<Token>& t) : toks(t) {}

    Tok peek() { return toks[pos].type; }
    Token consume() { return toks[pos++]; }

    shared_ptr<Node> parseExpr() {
        auto node = parseTerm();
        while (peek() == Tok::Plus || peek() == Tok::Minus) {
            Token op = consume();
            auto r = parseTerm();
            auto p = make_shared<Node>(op.text);
            p->left = node; p->right = r; node = p;
        }
        return node;
    }

    shared_ptr<Node> parseTerm() {
        auto node = parseFactor();
        while (peek() == Tok::Star || peek() == Tok::Slash) {
            Token op = consume();
            auto r = parseFactor();
            auto p = make_shared<Node>(op.text);
            p->left = node; p->right = r; node = p;
        }
        return node;
    }

    shared_ptr<Node> parseFactor() {
        if (peek() == Tok::LParen) {
            consume();
            auto node = parseExpr();
            if (peek() != Tok::RParen) throw runtime_error("قوس مقفول ناقص");
            consume();
            return node;
        }
        if (peek() == Tok::Number) return make_shared<Node>(consume().text);
        throw runtime_error("تعبير غير صالح");
    }
};

// ---------- 3) Code Generation ----------
vector<string> generate(const shared_ptr<Node>& node) {
    vector<string> code;
    if (!node) return code;

    auto l = generate(node->left);
    auto r = generate(node->right);
    code.insert(code.end(), l.begin(), l.end());
    code.insert(code.end(), r.begin(), r.end());

    if (!node->left && !node->right) {
        code.push_back("PUSH " + node->value);
    } else if (node->value == "+") {
        code.push_back("ADD");
    } else if (node->value == "-") {
        code.push_back("SUB");
    } else if (node->value == "*") {
        code.push_back("MUL");
    } else if (node->value == "/") {
        code.push_back("DIV");
    }
    return code;
}

// ---------- 4) Virtual Machine ----------
double execute(const vector<string>& code) {
    vector<double> stack;
    for (const string& line : code) {
        if (line.rfind("PUSH ", 0) == 0) {
            stack.push_back(stod(line.substr(5)));
        } else if (line == "ADD") {
            double b = stack.back(); stack.pop_back();
            double a = stack.back(); stack.pop_back();
            stack.push_back(a + b);
        } else if (line == "SUB") {
            double b = stack.back(); stack.pop_back();
            double a = stack.back(); stack.pop_back();
            stack.push_back(a - b);
        } else if (line == "MUL") {
            double b = stack.back(); stack.pop_back();
            double a = stack.back(); stack.pop_back();
            stack.push_back(a * b);
        } else if (line == "DIV") {
            double b = stack.back(); stack.pop_back();
            double a = stack.back(); stack.pop_back();
            stack.push_back(a / b);
        }
    }
    return stack.back();
}

int main() {
    string expr = "(10 + 20) * 3 - 8 / 2";
    cout << "التعبير: " << expr << endl;

    Lexer lexer(expr);
    auto tokens = lexer.run();

    Parser parser(tokens);
    auto ast = parser.parseExpr();

    auto code = generate(ast);
    cout << "الشيفرة:" << endl;
    for (const string& line : code) cout << "  " << line << endl;

    double result = execute(code);
    cout << "النتيجة: " << result << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الترتيب الصحيح لمراحل المترجم في المشروع؟",
        options: [
          "Lexer → Parser → CodeGen → VM",
          "Parser → Lexer → VM → CodeGen",
          "CodeGen → Lexer → Parser → VM",
          "VM → CodeGen → Parser → Lexer",
        ],
        answer: 0,
        explanation: "بنحلل حرفياً، وبعدين نحلل نحوياً، وبعدين نولد الكود، وبعدين ننفذه.",
      },
      {
        question: "ليه استخدمنا شيفرة وسيطة (Stack Machine) بدل تنفيذ الـ AST مباشرة؟",
        options: [
          "عشان نفصل توليد الكود عن تنفيذه، وده أقرب للمترجمات الحقيقية",
          "عشان الكود يبقى أطول",
          "عشان نتفادى كتابة الحلقات",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "الفصل بين توليد الكود والتنفيذ بيخلي كل مرحلة مستقلة وقابلة للاختبار.",
      },
      {
        question: "إيه اللي بيحصل لو التعبير فيه قوس مقفول ناقص؟",
        options: [
          "المترجم يتجاهل القوس",
          "البرنامج بيرمي خطأ في الـ Parser",
          "المترجم يحذف التعبير",
          "النتيجة تبقى صفر",
        ],
        answer: 1,
        explanation: "الـ Parser بيرمي استثناء (runtime_error) لإنه بيتوقع قوس مقفول ومش بيلاقيه.",
      },
    ],
    exercise:
      "وسّع المترجم عشان يدعم المتغيرات: أضف تعريف `let x = 5`، واعمل Symbol Table بسيطة، واجعل الـ Parser يدعم استخدام `x` في التعبيرات زي `x + 3`.",
    terms: [
      { en: "Pipeline", ar: "خط أنابيب: سلسلة مراحل المترجم اللي بتعالج الكود واحدة ورا التانية." },
      { en: "Stack Machine", ar: "آلة مكدس: آلة افتراضية بتنفذ الشيفرة الوسيطة باستخدام مكدس." },
      { en: "Virtual Machine", ar: "آلة افتراضية: برنامج بيحاكي جهاز كمبيوتر وينفذ شيفرة وسيطة." },
      { en: "Frontend / Backend", ar: "واجهة أمامية خلفية: الأمام بيفهم اللغة، والخلف بيولد الكود للمعالج المستهدف." },
    ],
  },
];
