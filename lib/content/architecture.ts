import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "nand",
    title: "من بوابة NAND إلى دائرة كاملة",
    titleEn: "From NAND to a Full Circuit",
    duration: "50 دقيقة",
    description:
      "هتكتشف إن الكمبيوتر كله مبني من بوابة واحدة اسمها NAND — هنا هنبني البوابات الأساسية ونحاكي جداول الحقيقة.",
    sections: [
      {
        heading: "البوابات المنطقية",
        body: "البوابة المنطقية (Logic Gate) دائرة إلكترونية بتدخل إشارات (0 أو 1) وتطلّع إشارة واحدة. أشهر البوابات: AND وOR وNOT.\n\nكل بوابة ليها **جدول حقيقة** (Truth Table) بيوصف كل تركيبة مدخلات ومخرجاتها.",
      },
      {
        heading: "NAND: البوابة الشاملة",
        body: "بوابة NAND بتعمل NOT بعد AND: مخرجها `0` بس لو المدخلين اتنين `1`.\n\nالحاجة المهمة إن NAND **شاملة** (Universal): يعني نقدر نبني أي بوابة منطقية تانية باستخدام NAND بس. ده معناه إننا نقدر نبني كمبيوتر كامل من بوابة واحدة!",
      },
      {
        heading: "بناء البوابات من NAND",
        body: "- **NOT:** وصّل المدخلين ببعض: `NAND(a, a)`.\n- **AND:** `NOT(NAND(a, b))`.\n- **OR:** `NAND(NOT(a), NOT(b))`.\n- **XOR:** تحتاج تركيبة من الاتنين السابقين.\n\nفي الكود، بنمثل كل بوابة بدالة `bool` بتاخد مدخلين وبترجع مخرج.",
      },
      {
        heading: "من البوابات للدائرة الكاملة",
        body: "البوابات البسيطة بتتجمع لبناء دوائر أعقد:\n\n- الجامع (Adder) بيجمع بتّين.\n- الموجّه (Multiplexer) بيختار مصدر من عدة مصادر.\n- المسجلات (Registers) بتخزن بتّات.\n\nكل دوائر الكمبيوتر في الآخر مبنية من NAND — ومن هنا جاء اسم مقرر Nand2Tetris.",
      },
      {
        heading: "نشاط كودي",
        body: "هنكتب في C++ دوال للبوابات وبنبني NOT وAND وOR وXOR من NAND، وبعدين نطبع جدول الحقيقة كامل زي ما بنعمل في محاكاة الدوائر.",
      },
    ],
    code: [
      {
        title: "محاكاة البوابات المنطقية",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

bool nand(bool a, bool b) {
    return !(a && b);
}

bool notGate(bool a) {
    return nand(a, a);
}

bool andGate(bool a, bool b) {
    return notGate(nand(a, b));
}

bool orGate(bool a, bool b) {
    return nand(notGate(a), notGate(b));
}

bool xorGate(bool a, bool b) {
    return andGate(orGate(a, b), nand(a, b));
}

int main() {
    bool vals[2] = {false, true};
    cout << "a b | NAND | NOT a | AND | OR | XOR" << endl;
    for (bool a : vals) {
        for (bool b : vals) {
            cout << a << " " << b << " |  " << nand(a, b)
                 << "   |   " << notGate(a)
                 << "   |  " << andGate(a, b)
                 << "  |  " << orGate(a, b)
                 << " |  " << xorGate(a, b) << endl;
        }
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه مخرج بوابة NAND لو المدخلين 1 و1؟",
        options: ["1", "0", "يعتمد على البوابة", "غير معرف"],
        answer: 1,
        explanation: "NAND معناها NOT AND، فمخرجها صفر بس لما المدخلين واحد.",
      },
      {
        question: "ليه بوابة NAND مهمة جداً؟",
        options: [
          "لأنها أسرع بوابة",
          "لأنها شاملة وبنقدر نبني بيها أي بوابة تانية",
          "لأنها أرخص",
          "لأنها بتستهلك طاقة أقل",
        ],
        answer: 1,
        explanation: "أي دائرة منطقية ممكن تُبنى من NAND بس، وده اللي بيخليها أساس بناء الكمبيوتر.",
      },
      {
        question: "إزاي نبني بوابة NOT من NAND؟",
        options: ["NAND(a, 1)", "NAND(a, a)", "NAND(a, 0)", "NAND(a, b)"],
        answer: 1,
        explanation: "توصيل المدخلين ببعض بيجعل المخرج نفي المدخل.",
      },
    ],
    exercise:
      "اكتب دالة `xorGate` باستخدام NAND بس، وتحقق من جدول الحقيقة بتاعها.",
    terms: [
      { en: "Logic Gate", ar: "بوابة منطقية: دائرة بتدخل إشارات ثنائية وتطلّع إشارة واحدة." },
      { en: "NAND", ar: "بوابة النفي والوصل: مخرجها صفر بس لو المدخلين واحد." },
      { en: "Truth Table", ar: "جدول الحقيقة: جدول بيوصف مخرج البوابة لكل مدخلات ممكنة." },
      { en: "Universal Gate", ar: "بوابة شاملة: بوابة نقدر نبني بيها أي دائرة منطقية." },
    ],
  },
  {
    id: "alu",
    title: "وحدة الحساب والمنطق ALU",
    titleEn: "Arithmetic Logic Unit",
    duration: "50 دقيقة",
    description:
      "هتبني وحدة الحساب والمنطق ALU في C++: العمليات الحسابية والمنطقية على مستوى البتات مع الأعلام.",
    sections: [
      {
        heading: "إيه هي ALU؟",
        body: "وحدة الحساب والمنطق (Arithmetic Logic Unit) القلب الرياضي للمعالج. هي اللي بتنفذ عمليات الجمع والطرح والمقارنة والعمليات المنطقية على مستوى البتات.\n\nALU بتاخد رقمين ورمز عملية، وبتطلّع النتيجة ومجموعة **أعلام** (Flags) زي علامة الصفر وعلامة السالب.",
      },
      {
        heading: "المدخلات والمخرجات",
        body: "المدخلات:\n\n- العدد الأول والثاني (عادة 32 أو 64 بت).\n- **رموز التحكم** (Control Signals) اللي بتحدد نوع العملية.\n\nالمخرجات:\n\n- النتيجة.\n- الأعلام: صفر، سالب، تجاوز (Overflow)، وcarry.",
      },
      {
        heading: "العمليات الحسابية والمنطقية",
        body: "الحسابية: جمع، طرح، زيادة، ونقص.\n\nالمنطقية على مستوى البتات:\n\n- `AND` و`OR` و`XOR` و`NOT`.\n- الإزاحات (Shifts) لليسار واليمين.\n\nفي C++ بنعمل نفس العمليات على الأعداد الصحيحة، فبنقدر نحاكي ALU بسهولة.",
      },
      {
        heading: "رموز التحكم",
        body: "المعالج بيوصل إشارات تحكم للـ ALU عشان تعرف تعمل إيه. مثلاً:\n\n- `000` للجمع.\n- `001` للطرح.\n- `010` لـ AND.\n- `011` لـ OR.\n\nALU بتترجم الرمز ده لدوائر مناسبة بتنفذ العملية.",
      },
      {
        heading: "ليه الأعلام مهمة؟",
        body: "علامة الصفر بتسمح للمعالج يقرر: هل النتيجة صفر؟ ده أساسي في القفزات الشرطية (Jump if Zero).\n\nعلامة التجاوز بتحذر من نتائج أكبر من سعة المسجل، وعلامة السالب بتحدد إشارة النتيجة.",
      },
    ],
    code: [
      {
        title: "محاكاة ALU في C++",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

class ALU {
public:
    enum Op { ADD = 0, SUB = 1, AND = 2, OR = 3, XOR = 4, NOT = 5 };

    int compute(int a, int b, int op, bool& zeroFlag) {
        int result = 0;
        switch (op) {
            case ADD: result = a + b; break;
            case SUB: result = a - b; break;
            case AND: result = a & b; break;
            case OR:  result = a | b; break;
            case XOR: result = a ^ b; break;
            case NOT: result = ~a; break;
            default:  result = 0;
        }
        zeroFlag = (result == 0);
        return result;
    }
};

int main() {
    ALU alu;
    bool zeroFlag = false;

    int a = 12, b = 10; // 1100 و 1010 بالنظام الثنائي
    cout << "a = " << a << " | b = " << b << endl;
    cout << "ADD: " << alu.compute(a, b, ALU::ADD, zeroFlag) << " | Zero=" << zeroFlag << endl;
    cout << "SUB: " << alu.compute(a, b, ALU::SUB, zeroFlag) << " | Zero=" << zeroFlag << endl;
    cout << "AND: " << alu.compute(a, b, ALU::AND, zeroFlag) << " | Zero=" << zeroFlag << endl;
    cout << "OR:  " << alu.compute(a, b, ALU::OR, zeroFlag) << " | Zero=" << zeroFlag << endl;
    cout << "XOR: " << alu.compute(a, b, ALU::XOR, zeroFlag) << " | Zero=" << zeroFlag << endl;

    int c = 5, d = 5;
    cout << "SUB (5-5): " << alu.compute(c, d, ALU::SUB, zeroFlag)
         << " | Zero=" << zeroFlag << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الوظيفة الأساسية للـ ALU؟",
        options: [
          "تخزين البيانات",
          "تنفيذ العمليات الحسابية والمنطقية",
          "إدارة الذاكرة",
          "عرض الرسوم",
        ],
        answer: 1,
        explanation: "ALU مسؤولة عن الحساب والمنطق، بينما التخزين والإدخال والإخراج مسؤوليات وحدات تانية.",
      },
      {
        question: "إيه الغرض من علامة الصفر (Zero Flag)؟",
        options: [
          "معرفة إن النتيجة موجبة",
          "معرفة إن النتيجة صفر للقفزات الشرطية",
          "قياس سرعة المعالج",
          "تحديد نوع العملية",
        ],
        answer: 1,
        explanation: "علامة الصفر بتسمح للمعالج يعمل قفز شرطي لو النتيجة صفر.",
      },
      {
        question: "العمليات المنطقية على مستوى البتات بتتضمن...",
        options: [
          "AND وOR وXOR وNOT",
          "الجمع والطرح فقط",
          "الضرب والقسمة فقط",
          "المقارنة بين النصوص",
        ],
        answer: 0,
        explanation: "العمليات المنطقية بتشتغل على كل بت على حدة: و، أو، XOR، ونفي.",
      },
    ],
    exercise:
      "أضف للـ ALU عملية القسمة الصحيحة مع علامة تجاوز للقسمة على صفر، واطبع رسالة مناسبة.",
    terms: [
      { en: "ALU", ar: "وحدة الحساب والمنطق: الدائرة اللي بتنفذ العمليات الحسابية والمنطقية في المعالج." },
      { en: "Control Signal", ar: "إشارة تحكم: رمز بيحدد نوع العملية اللي الـ ALU هتنفذها." },
      { en: "Flag", ar: "علامة: بت بيوضح خاصية معينة في نتيجة عملية، زي الصفر أو السالب." },
      { en: "Bitwise Operation", ar: "عملية على مستوى البتات: عملية بتشتغل على البتات الفردية للأعداد." },
    ],
  },
  {
    id: "memory-cpu",
    title: "الذاكرة ووحدة المعالجة المركزية CPU",
    titleEn: "Memory & CPU",
    duration: "50 دقيقة",
    description:
      "هتفهم معمارية فون نيومان وهرمية الذاكرة ودورة الجلب وفك التشفير والتنفيذ — وهنحاكي معالج بسيط في C++.",
    sections: [
      {
        heading: "معمارية فون نيومان",
        body: "معمارية فون نيومان (Von Neumann Architecture) هي التصميم الأساسي لكل الكمبيوترات الحديثة. مكوناتها:\n\n- وحدة المعالجة المركزية CPU.\n- الذاكرة (RAM) اللي بتخزن البرامج والبيانات.\n- أجهزة الإدخال والإخراج.\n- خطوط النقل (Buses) اللي بتربط كل ده ببعض.",
      },
      {
        heading: "هرمية الذاكرة",
        body: "الذاكرة مش نوع واحد. في هرمية (Memory Hierarchy):\n\n- **المسجلات** جوه المعالج: سريعة جداً وغالية.\n- **الكاش** (Cache): سريع وقريب من المعالج.\n- **RAM**: الذاكرة الرئيسية.\n- **القرص الصلب**: تخزين دائم وبطيء.\n\nكل ما نزلنا في الهرم، الذاكرة بقت أرخص وأبطأ وأكبر سعة.",
      },
      {
        heading: "العنونة والبتات",
        body: "كل بايت في الذاكرة ليه **عنوان** (Address) فريد. المعالج بيقرا ويكتب عن طريق العنوان.\n\nالبت (Bit) أصغر وحدة، والبايت = 8 بتات. الأعداد بتتخزن بالنظام الثنائي، والنصوص بترميز زي UTF-8.",
      },
      {
        heading: "دورة الجلب وفك التشفير والتنفيذ",
        body: "المعالج بينفذ البرامج بدورة من 3 خطوات بتتكرر ملايين المرات في الثانية:\n\n1. **الجلب (Fetch):** جيب التعليمة من الذاكرة بعنوان الـ PC.\n2. **فك التشفير (Decode):** افهم نوع العملية.\n3. **التنفيذ (Execute):** نفذ العملية واحفظ النتيجة.\n\nبعد كده الـ PC بيتقدم للتعليمة الجاية.",
      },
      {
        heading: "المسجلات",
        body: "المسجلات (Registers) خانات صغيرة جداً وسريعة جوه المعالج. أشهرها:\n\n- **PC** (Program Counter): عنوان التعليمة الجاية.\n- **ACC** (Accumulator): يخزن نتيجة آخر عملية.\n- **IR** (Instruction Register): يخزن التعليمة الحالية.",
      },
    ],
    code: [
      {
        title: "محاكاة ذاكرة ومعالج بسيط",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

class Memory {
    vector<int> data;
public:
    Memory(int size) : data(size, 0) {}
    int read(int address) const { return data[address]; }
    void write(int address, int value) { data[address] = value; }
};

int main() {
    Memory ram(8);
    ram.write(0, 7);
    ram.write(1, 5);

    // التعليمات: {opcode, address, unused}
    // opcode 1 = LOAD, 2 = ADD, 3 = STORE, 4 = HALT
    vector<vector<int>> program = {
        {1, 0, 0},  // LOAD  accumulator <- M[0]
        {2, 1, 0},  // ADD   accumulator <- accumulator + M[1]
        {3, 2, 0},  // STORE M[2] <- accumulator
        {4, 0, 0}   // HALT
    };

    int programCounter = 0;
    int accumulator = 0;

    cout << "بدء تنفيذ البرنامج:" << endl;
    while (true) {
        int opcode = program[programCounter][0];
        int address = program[programCounter][1];
        cout << "PC=" << programCounter << " opcode=" << opcode
             << " addr=" << address << " -> ";

        if (opcode == 1) {
            accumulator = ram.read(address);
            cout << "LOAD: accumulator = " << accumulator << endl;
            programCounter++;
        } else if (opcode == 2) {
            accumulator += ram.read(address);
            cout << "ADD: accumulator = " << accumulator << endl;
            programCounter++;
        } else if (opcode == 3) {
            ram.write(address, accumulator);
            cout << "STORE: M[" << address << "] = " << accumulator << endl;
            programCounter++;
        } else {
            cout << "HALT" << endl;
            break;
        }
    }

    cout << "القيمة المخزنة في M[2]: " << ram.read(2) << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المكون الأساسي في معمارية فون نيومان؟",
        options: [
          "الطابعة",
          "وحدة المعالجة المركزية والذاكرة",
          "الشاشة",
          "اللوحة الأم",
        ],
        answer: 1,
        explanation: "المعمارية بتعتمد على وحدة معالجة مركزية وذاكرة مشتركة للبرنامج والبيانات.",
      },
      {
        question: "ليه المسجلات أسرع من RAM؟",
        options: [
          "لأنها أكبر حجماً",
          "لأنها جوه المعالج وقريبة منه",
          "لأنها بتخزن بيانات أكثر",
          "لأنها أرخص",
        ],
        answer: 1,
        explanation: "المسجلات جوه شريحة المعالج، فزمن الوصول ليها شبه معدوم.",
      },
      {
        question: "إيه ترتيب دورة تنفيذ التعليمة؟",
        options: [
          "تنفيذ، جلب، فك تشفير",
          "جلب، فك تشفير، تنفيذ",
          "فك تشفير، جلب، تنفيذ",
          "جلب، تنفيذ، فك تشفير",
        ],
        answer: 1,
        explanation: "بنجيب التعليمة الأول، نفك تشفيرها، وبعدين ننفذها.",
      },
    ],
    exercise:
      "وسّع محاكاة المعالج: أضف أمر ضرب (opcode 5) يضرب الـ accumulator في قيمة في الذاكرة، واختبره ببرنامج يحسب 5 × 6.",
    terms: [
      { en: "Von Neumann Architecture", ar: "معمارية فون نيومان: تصميم الكمبيوتر اللي بيعتمد على تخزين البرنامج والبيانات في نفس الذاكرة." },
      { en: "Memory Hierarchy", ar: "هرمية الذاكرة: ترتيب أنواع الذاكرة حسب السرعة والتكلفة والسعة." },
      { en: "Register", ar: "مسجل: خانة تخزين صغيرة وسريعة جوه المعالج." },
      { en: "Fetch-Decode-Execute", ar: "دورة الجلب وفك التشفير والتنفيذ: دورة المعالج الأساسية لتنفيذ التعليمات." },
      { en: "CPU", ar: "معالج: وحدة المعالجة المركزية، عقل الكمبيوتر اللي بينفذ التعليمات." },
    ],
  },
  {
    id: "assembly",
    title: "لغة التجميع Assembly",
    titleEn: "Assembly Language",
    duration: "55 دقيقة",
    description:
      "أقرب لغة للهاردوير: هتتعلم المسجلات والتعليمات والمكدس في x86-64، وتكتب أول برنامج تجميع ليك.",
    sections: [
      {
        heading: "ليه بنتعلم Assembly؟",
        body: "لغة التجميع (Assembly) أقرب لغة للهاردوير. كل سطر فيها بيوافق تقريباً تعليمة واحدة في المعالج.\n\nتعلّمها بيخليك تفهم إزاي البرنامج بيشتغل فعلاً من جوا: إزاي المعالج بيقرا الذاكرة، وإزاي الدوال بتتنادى، وإزاي المكدس بيشتغل.",
      },
      {
        heading: "المسجلات والتعليمات الأساسية",
        body: "في معمارية x86-64، المسجلات الرئيسية: `rax` و`rbx` و`rcx` و`rdx` و`rsi` و`rdi`.\n\nالتعليمات الأساسية:\n\n- `mov` للنقل.\n- `add` و`sub` للجمع والطرح.\n- `jmp` للقفز غير الشرطي.\n- `cmp` للمقارنة.",
      },
      {
        heading: "التنقل والشروط",
        body: "بنقارن بقيمتين بـ `cmp`، وبعدين بنستخدم قفز شرطي:\n\n- `je` (Jump if Equal).\n- `jne` (Jump if Not Equal).\n- `jg` و`jl` للأكبر والأصغر.\n\nده بيسمح لنا نبني حلقات وشروط زي ما بنعمل في C++.",
      },
      {
        heading: "الذاكرة والمكدس",
        body: "المكدس (Stack) منطقة ذاكرة بتستخدم في استدعاء الدوال وتخزين المتغيرات المحلية. أعلى المكدس بيتحدد بالمسجل `rsp`.\n\nلما تنادي دالة، بتُدفع عنوان العودة على المكدس، ولما تخلص بيرجع للعنوان ده.",
      },
      {
        heading: "نداءات النظام",
        body: "في Linux، نداء النظام (Syscall) بيتنفذ بـ `syscall`. كل نداء ليه رقم في `rax` ومعاملات في المسجلات التانية.\n\nمثلاً نداء الخروج `exit` رقمه 60، ونداء الكتابة `write` رقمه 1.",
      },
    ],
    code: [
      {
        title: "أول برنامج تجميع (NASM x86-64)",
        language: "nasm",
        code: `section .data
    msg db "Hello from Assembly", 10
    len equ $ - msg

section .text
    global _start

_start:
    ; طباعة الرسالة
    mov rax, 1          ; syscall write
    mov rdi, 1          ; stdout
    mov rsi, msg
    mov rdx, len
    syscall

    ; الخروج من البرنامج
    mov rax, 60         ; syscall exit
    mov rdi, 0
    syscall`,
      },
      {
        title: "حلقة جمع في التجميع والمعادل لها في C++",
        language: "nasm",
        code: `section .text
    global _start

_start:
    mov rcx, 5          ; العداد
    mov rax, 0          ; المجموع

loop_start:
    add rax, rcx
    dec rcx
    jnz loop_start
    ; rax الان = 5 + 4 + 3 + 2 + 1 = 15

    mov rdi, rax        ; قيمة الخروج
    mov rax, 60
    syscall

-- المعادل في C++:
-- int sum = 0;
-- for (int i = 5; i >= 1; i--) {
--     sum += i;
-- }`,
      },
    ],
    quiz: [
      {
        question: "ليه بنتعلم Assembly؟",
        options: [
          "عشان نكتب كود أسرع",
          "عشان نفهم إزاي المعالج بيشتغل من جوا",
          "عشان نبني مواقع",
          "عشان البرامج تبقى أقصر",
        ],
        answer: 1,
        explanation: "Assembly بيوريك إزاي الهاردوير بينفذ التعليمات بالظبط.",
      },
      {
        question: "إيه وظيفة المسجل rax غالباً؟",
        options: [
          "تخزين عنوان المكدس",
          "تخزين النتائج ورقم نداء النظام",
          "تخزين المدخلات بس",
          "إدارة الذاكرة",
        ],
        answer: 1,
        explanation: "rax بيستخدم لتخزين نتائج العمليات ورقم نداء النظام قبل التنفيذ.",
      },
      {
        question: "إيه الطريقة العامة لتنفيذ نداء نظام في Linux بـ Assembly؟",
        options: [
          "call syscall",
          "syscall بعد وضع رقم النداء في rax",
          "int 80h فقط",
          "jump syscall",
        ],
        answer: 1,
        explanation: "نحط رقم النداء في rax والمعاملات في المسجلات، وبعدين ننفذ syscall.",
      },
    ],
    exercise:
      "اكتب برنامج Assembly (NASM) يطبع الأرقام من 1 إلى 5 باستخدام حلقة، واختبره على Linux.",
    terms: [
      { en: "Assembly", ar: "لغة التجميع: لغة برمجة منخفضة المستوى قريبة من تعليمات المعالج." },
      { en: "Register", ar: "مسجل: خانة تخزين صغيرة وسريعة جوه المعالج." },
      { en: "Stack", ar: "مكدس: منطقة ذاكرة بتستخدم في استدعاء الدوال وتخزين المتغيرات المحلية." },
      { en: "Syscall", ar: "نداء نظام: طلب من البرنامج لنظام التشغيل ينفذ عملية معينة." },
    ],
  },
  {
    id: "vm",
    title: "الآلات الافتراضية Virtual Machines",
    titleEn: "Virtual Machines",
    duration: "45 دقيقة",
    description:
      "هتبني آلة افتراضية معمارية المكدس في C++: تنفذ بايتكود وتطبع النتائج — نفس الفكرة اللي JVM وCPython بيشتغلوا بيها.",
    sections: [
      {
        heading: "فكرة المحاكاة",
        body: "الآلة الافتراضية (Virtual Machine) برنامج بيحاكي كمبيوتر كامل: معالج وذاكرة وتعليمات. لما نشغّل برنامج على VM، بنشغّل في الأساس برنامج بيفسر تعليمات الجهاز الافتراضي.\n\nالمحاكاة بتسمح لنا نشغّل برامج مكتوبة لتعليمات وهمية على أي هاردوير حقيقي.",
      },
      {
        heading: "الآلة الافتراضية والمكدس",
        body: "كثير من الـ VMs بتستخدم **معمارية المكدس** (Stack Machine): العمليات بتاخد معاملاتها من أعلى المكدس وتطلّع النتيجة على المكدس.\n\nمثال: تعليمة `ADD` بتطلّع آخر رقمين من المكدس، بتجمعهم، وبترجّع النتيجة على المكدس. ده أسهل في التنفيذ من معمارية المسجلات.",
      },
      {
        heading: "التعليمات والبايتكود",
        body: "الـ VM بتتنفذ **بايتكود** (Bytecode): ملف تعليمات وسيط مش تعليمات المعالج الحقيقي. الـ VM بتترجم أو بتفسر البايتكود ده.\n\nأمثلة: Java Virtual Machine (JVM) للغة Java، وCPython للغة Python. كلهم بيشتغلوا بنفس الفكرة.",
      },
      {
        heading: "بناء VM بسيط",
        body: "هنبني VM بـ C++ بيدعم:\n\n- `PUSH` رقم على المكدس.\n- `ADD` و`MUL`.\n- `PRINT` لطباعة قمة المكدس.\n- `HALT` للإنهاء.\n\nالبرنامج هيقرا قائمة أرقام (بايتكود) وينفذ كل تعليمة بالترتيب.",
      },
      {
        heading: "مستويات المحاكاة",
        body: "- **المفسر (Interpreter):** ينفذ البايتكود سطر بسطر — بطيء لكن بسيط.\n- **JIT Compiler:** يترجم الأجزاء الساخنة لتعليمات المعالج الحقيقي أثناء التشغيل — أسرع.\n- **المترجم (Compiler):** يترجم البرنامج كاملاً قبل التشغيل.",
      },
    ],
    code: [
      {
        title: "آلة افتراضية معمارية المكدس",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

class VM {
    vector<int> stack;
    int pc = 0;
    vector<int> bytecode;

public:
    VM(const vector<int>& code) : bytecode(code) {}

    void push(int value) {
        stack.push_back(value);
    }

    int pop() {
        if (stack.empty()) {
            throw runtime_error("المكدس فاضي!");
        }
        int value = stack.back();
        stack.pop_back();
        return value;
    }

    void run() {
        pc = 0;
        while (pc < (int)bytecode.size()) {
            int instruction = bytecode[pc++];
            if (instruction == 1) {          // PUSH
                push(bytecode[pc++]);
            } else if (instruction == 2) {   // ADD
                int b = pop();
                int a = pop();
                push(a + b);
            } else if (instruction == 3) {   // MUL
                int b = pop();
                int a = pop();
                push(a * b);
            } else if (instruction == 4) {   // PRINT
                cout << pop() << endl;
            } else if (instruction == 5) {   // HALT
                break;
            }
        }
    }
};

int main() {
    // حساب (3 + 4) * 5
    vector<int> program = {
        1, 3,    // PUSH 3
        1, 4,    // PUSH 4
        2,       // ADD
        1, 5,    // PUSH 5
        3,       // MUL
        4,       // PRINT
        5        // HALT
    };
    VM vm(program);
    vm.run();
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المعنى الدقيق للآلة الافتراضية؟",
        options: [
          "كمبيوتر وهمي بيحاكي الأجهزة",
          "برنامج مكافحة فيروسات",
          "نظام تشغيل فقط",
          "لغة برمجة",
        ],
        answer: 0,
        explanation: "الآلة الافتراضية بتحاكي معالج وذاكرة وتعليمات، وبتشغّل برامج مكتوبة ليها.",
      },
      {
        question: "في معمارية المكدس، إيه اللي بتعمله تعليمة ADD؟",
        options: [
          "بتجمع أول رقمين في الذاكرة",
          "بتشيل آخر رقمين من المكدس وتجمعهم وترجّع الناتج",
          "بتضيف رقمين في مسجلين",
          "بتطبع ناتج الجمع",
        ],
        answer: 1,
        explanation: "معمارية المكدس بتاخد معاملاتها من قمة المكدس وترجّع النتيجة عليه.",
      },
      {
        question: "إيه الفرق بين المفسر والـ JIT؟",
        options: [
          "المفسر أسرع دائماً",
          "JIT يترجم الأجزاء الساخنة لتعليمات المعالج الحقيقي أثناء التشغيل",
          "المفسر بيشتغل على Windows بس",
          "مفيش فرق",
        ],
        answer: 1,
        explanation: "JIT بيجمع بين مرونة التفسير وسرعة الكود الحقيقي عن طريق الترجمة الفورية.",
      },
    ],
    exercise:
      "أضف للـ VM تعليمة `SUB` (طرح آخر رقمين من المكدس) وتعليمة `DUP` (نسخ قمة المكدس). اختبرهم بحساب (5 - 3) × 2.",
    terms: [
      { en: "Virtual Machine", ar: "آلة افتراضية: برنامج بيحاكي كمبيوتر كامل بمعالج وذاكرة وتعليمات." },
      { en: "Bytecode", ar: "بايتكود: تعليمات وسيطة بين الكود المصدري وتعليمات المعالج الحقيقي." },
      { en: "Stack Machine", ar: "آلة المكدس: معمارية بتاخد معاملاتها من مكدس وترّجع النتائج عليه." },
      { en: "JIT", ar: "ترجمة فورية: تحويل البايتكود لتعليمات المعالج الحقيقي أثناء التشغيل لتحسين الأداء." },
    ],
  },
  {
    id: "arch-project",
    title: "مشروع: بناء ALU في C++",
    titleEn: "Project: Build an ALU in C++",
    duration: "80 دقيقة",
    description:
      "مشروع التخرج: تبني ALU كامل في C++ تبدأ من بوابة NAND لحد الجامع الرباعي والعمليات الحسابية والمنطقية.",
    sections: [
      {
        heading: "تصميم المشروع",
        body: "هتبني ALU من الصفر في C++: تبدأ من بوابة NAND، تبني منها كل البوابات، وبعدين تبني جامع بيتّي، وبعدين ALU كامل بيدعم الجمع والطرح والعمليات المنطقية.\n\nالمشروع ده بيطبق كل اللي اتعلمته في المقرر.",
      },
      {
        heading: "البوابات الأساسية",
        body: "كل حاجة تبدأ من `nand`. نبني `not` و`and` و`or` منها.\n\nمهم جداً نختبر كل بوابة بجدول الحقيقة قبل ما نكمل — اختبار الوحدة (Unit Testing) بيوفر علينا كتير من التصحيح.",
      },
      {
        heading: "الجامع البيتّي",
        body: "الجامع النصفي (Half Adder) بيجمع بتّين وينتج مجموع وcarry.\n\nالجامع الكامل (Full Adder) بياخد بتّين وcarry من المرحلة السابقة، وينتج مجموع وcarry جديد.\n\nنربط 4 جامعين كاملين مع بعض عشان نبني جامع 4 بتّات.",
      },
      {
        heading: "بناء ALU",
        body: "ALU بتاخد رمز العملية ورقمين من 4 بتّات، وبتخرج النتيجة والأعلام.\n\nالعمليات المدعومة: جمع، طرح (عن طريق المكمل الثنائي)، AND، OR، XOR، وNOT.",
      },
      {
        heading: "اختبار وتوسعات",
        body: "اكتب قائمة اختبارات: لكل عملية، جرّب قيم مختلفة وتأكد إن النتيجة صح.\n\nتوسعات ممكنة: جامع 8 بتات، مسجلات (Registers)، أو حتى وحدة تحكم بسيطة.",
      },
    ],
    code: [
      {
        title: "ALU كامل مبني من NAND",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

bool nand(bool a, bool b) { return !(a && b); }
bool notGate(bool a) { return nand(a, a); }
bool andGate(bool a, bool b) { return notGate(nand(a, b)); }
bool orGate(bool a, bool b) { return nand(notGate(a), notGate(b)); }

// جامع نصفي
void halfAdder(bool a, bool b, bool& sum, bool& carry) {
    sum = orGate(andGate(a, notGate(b)), andGate(notGate(a), b));
    carry = andGate(a, b);
}

// جامع كامل
void fullAdder(bool a, bool b, bool cin, bool& sum, bool& carry) {
    bool s1, c1, c2;
    halfAdder(a, b, s1, c1);
    halfAdder(s1, cin, sum, c2);
    carry = orGate(c1, c2);
}

// جامع 4 بتات
int add4(int a, int b) {
    int result = 0;
    bool carry = false;
    for (int i = 0; i < 4; i++) {
        bool bitA = (a >> i) & 1;
        bool bitB = (b >> i) & 1;
        bool sum;
        fullAdder(bitA, bitB, carry, sum, carry);
        if (sum) {
            result |= (1 << i);
        }
    }
    return result;
}

// طرح 4 بتات عن طريق المكمل الثنائي
int subtract4(int a, int b) {
    int twosComplement = add4((~b) & 0xF, 1);
    return add4(a, twosComplement);
}

enum AluOp { ADD = 0, SUB = 1, AND = 2, OR = 3, XOR = 4 };

struct AluResult {
    int value;
    bool zero;
    bool negative;
};

AluResult alu(int a, int b, int op) {
    AluResult result;
    int value = 0;
    switch (op) {
        case ADD: value = add4(a, b); break;
        case SUB: value = subtract4(a, b); break;
        case AND: value = a & b; break;
        case OR:  value = a | b; break;
        case XOR: value = a ^ b; break;
        default:  value = 0;
    }
    result.value = value & 0xF;
    result.zero = (result.value == 0);
    result.negative = (result.value & 0x8) != 0;
    return result;
}

int main() {
    vector<pair<int, int>> tests = {
        {0, 0}, {1, 2}, {5, 3}, {7, 8}, {15, 1}
    };
    cout << "اختبار الجامع الرباعي البت:" << endl;
    for (auto t : tests) {
        cout << t.first << " + " << t.second
             << " = " << add4(t.first, t.second) << endl;
    }

    cout << endl << "اختبار ALU:" << endl;
    cout << "7 + 5 = " << alu(7, 5, ADD).value << endl;
    cout << "7 - 5 = " << alu(7, 5, SUB).value << endl;
    cout << "12 AND 10 = " << alu(12, 10, AND).value << endl;
    cout << "12 OR 10 = " << alu(12, 10, OR).value << endl;
    cout << "12 XOR 10 = " << alu(12, 10, XOR).value << endl;

    AluResult z = alu(5, 5, SUB);
    cout << "5 - 5 = " << z.value << " | علامة الصفر = " << z.zero << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "في المشروع، إيه أول حاجة بنبنيها؟",
        options: ["المعالج", "بوابة NAND", "الذاكرة", "وحدة التحكم"],
        answer: 1,
        explanation: "كل البوابات والدوائر بتبدأ من بوابة NAND الشاملة.",
      },
      {
        question: "إيه الفرق بين الجامع النصفي والكامل؟",
        options: [
          "النصفي أسرع",
          "الكامل بيعتبر carry من المرحلة السابقة",
          "النصفي بيجمع 3 بتات",
          "مفيش فرق",
        ],
        answer: 1,
        explanation: "الجامع الكامل عنده مدخل carry إضافي من المرحلة السابقة، فبيقدر يتسلسل.",
      },
      {
        question: "بنعمل الطرح في الـ ALU إزاي؟",
        options: [
          "بنستخدم دائرة طرح منفصلة",
          "بنجمع المكمل الثنائي للعدد الثاني",
          "بنعكس بتات العدد الأول",
          "بنستخدم عملية AND",
        ],
        answer: 1,
        explanation: "الطرح في الأنظمة الرقمية بيتنفذ كجمع المكمل الثنائي.",
      },
    ],
    exercise:
      "أضف للـ ALU عملية المقارنة: لو كان a أكبر من b رجّع 1، لو أقل رجّع -1 (بالصيغة الثنائية)، ولو متساويين رجّع 0. اختبرها بعدة قيم.",
    terms: [
      { en: "Half Adder", ar: "جامع نصفي: دائرة بتجمع بتّين وتنتج مجموع وcarry." },
      { en: "Full Adder", ar: "جامع كامل: دائرة بتجمع بتّين وcarry من المرحلة السابقة." },
      { en: "Two's Complement", ar: "المكمل الثنائي: طريقة لتمثيل الأعداد السالبة في النظام الثنائي." },
      { en: "Unit Test", ar: "اختبار وحدة: اختبار صغير بيتأكد من صحة جزء واحد من الكود." },
    ],
  },
];
