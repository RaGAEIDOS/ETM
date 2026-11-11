import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "boot",
    title: "الإقلاع: Bootloader و BIOS",
    titleEn: "Booting: Bootloader & BIOS",
    duration: "55 دقيقة",
    description:
      "رحلة الكهرباء: من ضغط زر البداية لحد ما النواة بتاخد القيادة — BIOS وBootloader وMBR.",
    sections: [
      {
        heading: "رحلة الكهرباء",
        body: "لما تدوس زر البداية في الكمبيوتر، أول حاجة بتحصل إن المعالج بيستعيد حالته وبيبدأ ينفذ من **عنوان ثابت في الذاكرة**. هذا العنوان بيودى لـ **firmware** اسمه **BIOS** أو **UEFI**.\n\nالمعالج لسه مش فاهم حاجة — مفيش نظام تشغيل، مفيش ملفات، مفيش حتى كيبورد شغال. كل اللي بيحصل إن المعالج بيبدأ بتشغيل كود مثبّت على اللوحة الأم.",
      },
      {
        heading: "إيه الـ BIOS وUEFI؟",
        body: "- **BIOS (Basic Input/Output System):** نظام قديم بيشتغل في وضع 16-bit، وبيعمل فحص الذات (POST) للعتاد، وبعدين بيدوّر على جهاز إقلاع.\n- **UEFI (Unified Extensible Firmware Interface):** البديل الحديث، بيشتغل في 32-bit أو 64-bit، وبيدعم أقراص كبيرة وواجهة رسومية وأمان أحسن (Secure Boot).\n\nالاتنين بيعملوا نفس الوظيفة: فحص العتاد وتجهيزه، وتحميل الـ Bootloader.",
      },
      {
        heading: "إيه الـ Bootloader؟",
        body: "الـ **Bootloader** هو برنامج صغير بيشتغل بعد الـ BIOS. وظيفته تحميل النواة (Kernel) من القرص للذاكرة وتسليمه القيادة.\n\nأشهر Bootloaders: **GRUB** على لينكس، و**Windows Boot Manager** على ويندوز. في الأنظمة البسيطة، الـ Bootloader ممكن يكون 512 بايت بس.\n\nلاحظ إن الـ Bootloader نفسه مش نظام تشغيل — هو مجرد حلقة وصل بين الـ firmware والنواة.",
      },
      {
        heading: "الـ Boot Sector وMBR",
        body: "أول 512 بايت من أي قرص اسمها **الـ Master Boot Record (MBR)**. فيها:\n\n- **كود الإقلاع (Boot Code):** 446 بايت للكود اللي هيتنفذ.\n- **جدول التقسيم (Partition Table):** 64 بايت لوصف أقسام القرص.\n- **التوقيع (Signature):** آخر 2 بايت لازم يكونوا `0x55` و`0xAA` — ده اللي بيأكد للـ BIOS إن القرص ده قابل للإقلاع.\n\nالـ BIOS بيقرا الـ MBR، ويتأكد من التوقيع، وبعدين بينفذ كود الإقلاع.",
      },
      {
        heading: "مثال: محاكاة عملية الإقلاع",
        body: "هنكتب برنامج بيحاكي مراحل الإقلاع بالترتيب، عشان نفهم التسلسل المنطقي. في الأنظمة الحقيقية، كل مرحلة بتتولى القيادة من المرحلة اللي قبلها عن طريق نداء أو قفزة.",
      },
    ],
    code: [
      {
        title: "محاكاة مراحل الإقلاع",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include <chrono>
using namespace std;

struct Stage {
    string name;
    string description;
};

int main() {
    vector<Stage> stages = {
        {"Power On", "الكهربا بتصل للمعالج وبيبدأ ينفذ من عنوان ثابت"},
        {"BIOS/UEFI", "فحص الذات POST وتجهيز العتاد"},
        {"Boot Device", "البحث عن جهاز إقلاع صالح (MBR/GPT)"},
        {"Bootloader", "تحميل محمل الإقلاع من القطاع الأول"},
        {"Kernel", "تسليم القيادة للنواة"}
    };

    for (const Stage& s : stages) {
        cout << "[" << s.name << "] " << s.description << endl;
        this_thread::sleep_for(chrono::milliseconds(300));
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه أول حاجة بتحصل لما تدوس زر البداية؟",
        options: [
          "المعالج بينفذ كود الـ BIOS/UEFI من عنوان ثابت",
          "النواة بتشتغل مباشرة",
          "الشاشة بتتضاءل",
          "الهارد بيمسح نفسه",
        ],
        answer: 0,
        explanation: "المعالج بيبدأ من عنوان ثابت بيودى لكود الـ firmware.",
      },
      {
        question: "إيه الفرق بين BIOS و UEFI؟",
        options: [
          "UEFI أحدث وأسرع ويدعم أقراص كبيرة وأمان أحسن",
          "BIOS أحدث من UEFI",
          "مفيش فرق",
          "UEFI للماك بس",
        ],
        answer: 0,
        explanation: "UEFI هو بديل BIOS الحديث، بيدعم 32/64-bit وأقراص GPT.",
      },
      {
        question: "إيه وظيفة الـ Bootloader؟",
        options: [
          "تحميل النواة من القرص للذاكرة وتسليمها القيادة",
          "إدارة الذاكرة",
          "رسم الصور",
          "تشغيل الصوت",
        ],
        answer: 0,
        explanation: "الـ Bootloader هو حلقة الوصل بين الـ firmware والنواة.",
      },
    ],
    exercise:
      "ابحث عن تسلسل الإقلاع على جهازك: افتح إعدادات الـ UEFI (عادة بتدوس F2 أو Del وقت التشغيل) وشوف ترتيب أجهزة الإقلاع.",
    terms: [
      { en: "BIOS", ar: "نظام الإدخال والإخراج الأساسي: firmware قديم بيفحص العتاد ويحمّل الـ Bootloader." },
      { en: "UEFI", ar: "واجهة الـ firmware الموحدة القابلة للتمدد: بديل BIOS الحديث والأقدر." },
      { en: "Bootloader", ar: "محمل الإقلاع: برنامج صغير بيحمّل النواة من القرص للذاكرة." },
      { en: "MBR", ar: "سجل الإقلاع الرئيسي: أول 512 بايت من القرص، فيه كود الإقلاع وجدول التقسيم." },
    ],
  },
  {
    id: "kernel",
    title: "بناء نواة Kernel",
    titleEn: "Building a Kernel",
    duration: "65 دقيقة",
    description:
      "إيه النواة وأنواعها، وإزاي بتشتغل في وضع الحماية وتفصل بين النواة والمستخدم.",
    sections: [
      {
        heading: "إيه النواة؟",
        body: "**النواة (Kernel)** هي قلب نظام التشغيل. هي اللي بتدير المعالج والذاكرة والعتاد، وبتوفر للبرامج  services زي قراءة الملفات وفتح الشبكة.\n\nكل برنامج عادي بيشتغل في **مساحة المستخدم (User Space)** — معندوش وصول مباشر للعتاد. عشان يعمل حاجة زي قراءة ملف، بيعمل **نداء نظام (System Call)** للنواة، والنواة بتنفذ العملية وخلف الستار.",
      },
      {
        heading: "أنواع النوى",
        body: "- **النواة المتجانسة (Monolithic Kernel):** كل الخدمات بتشتغل في مساحة النواة — زي لينكس. سريعة جداً لكن أي خطأ في driver ممكن يوقف النظام كله.\n- **النواة الصغرى (Microkernel):** أقل حاجة ممكنة في النواة، والخدمات التانية بتتشغل كبرامج في مساحة المستخدم — زي MINIX. أكثر استقرارًا لكن أبطأ شوية.\n- **النواة الهجينة (Hybrid Kernel):** حل وسط — زي ويندوز NT.",
      },
      {
        heading: "وضع الحماية والـ Ring Levels",
        body: "المعالجات الحديثة عندها **مستويات امتياز (Privilege Rings)**:\n\n- **Ring 0:** النواة بتشتغل هنا — عندها وصول كامل لكل حاجة.\n- **Ring 3:** البرامج العادية بتشتغل هنا — ممنوع عليها تلمس العتاد مباشرة.\n\nلما برنامج في Ring 3 يحاول يعمل حاجة ممنوعة، المعالج بيعمل **استثناء (Exception)** والنواة بتتعامل معاه. ده اللي بيمنع البرامج من تخريب النظام.",
      },
      {
        heading: "الـ Kernel Space مقابل الـ User Space",
        body: "الذاكرة مقسومة لقسمين:\n\n- **Kernel Space:** مساحة ذاكرة مخصصة للنواة والـ drivers. مفيش برنامج يقدر يلمسه.\n- **User Space:** الذاكرة اللي بتشتغل فيها البرامج العادية.\n\nالفصل ده هو اللي بيضمن الاستقرار: لو برنامج اتعطل، بيتعطل لوحده من غير ما يأثر على النظام.\n\nمثال: في لينكس، أول 4 جيجا من الذاكرة الافتراضية (في 32-bit) بيكونوا للنواة، والباقي للمستخدم.",
      },
      {
        heading: "مثال: نواة مبسطة لإدارة العمليات والذاكرة",
        body: "هنكتب محاكاة مبسطة لنواة: بتخصص صفحات ذاكرة للعمليات، وبتدير قايمة العمليات. الكود بيوضح مفهوم الـ Kernel Space وإدارة الموارد.",
      },
    ],
    code: [
      {
        title: "نواة مبسطة: إدارة الذاكرة والعمليات",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

// نواة مبسطة: بتدير الذاكرة والعمليات
class Kernel {
    vector<bool> memory; // خريطة ذاكرة افتراضية (true = مشغول)
    struct Process { int pid; string name; };
    vector<Process> processes;
    int nextPid = 1;

public:
    Kernel(int totalPages) : memory(totalPages, false) {}

    int allocatePages(int count) {
        for (int i = 0; i + count <= (int)memory.size(); i++) {
            bool free = true;
            for (int j = 0; j < count; j++) {
                if (memory[i + j]) free = false;
            }
            if (free) {
                for (int j = 0; j < count; j++) memory[i + j] = true;
                return i;
            }
        }
        return -1; // مفيش ذاكرة كافية
    }

    void freePages(int start, int count) {
        for (int j = 0; j < count; j++) memory[start + j] = false;
    }

    int createProcess(const string& name) {
        processes.push_back({nextPid, name});
        return nextPid++;
    }

    void listProcesses() const {
        cout << "العمليات:" << endl;
        for (const Process& p : processes) {
            cout << "  PID " << p.pid << ": " << p.name << endl;
        }
    }
};

int main() {
    Kernel kernel(16);

    int a = kernel.createProcess("init");
    int b = kernel.createProcess("shell");

    int page = kernel.allocatePages(4);
    cout << "تم تخصيص 4 صفحات بدءاً من الصفحة " << page << endl;

    kernel.listProcesses();

    kernel.freePages(page, 4);
    cout << "تم تحرير الصفحات" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين Monolithic و Microkernel؟",
        options: [
          "Monolithic كل الخدمات في النواة، Microkernel أقل حاجة ممكنة في النواة",
          "Monolithic أبطأ دائماً",
          "Microkernel للألعاب بس",
          "مفيش فرق",
        ],
        answer: 0,
        explanation: "Monolithic أسرع لكن أقل استقرارًا، Microkernel أكثر استقرارًا لكن أبطأ.",
      },
      {
        question: "إيه وظيفة الـ Kernel Space؟",
        options: [
          "مساحة ذاكرة مخصصة للنواة والـ drivers من غير تدخل البرامج العادية",
          "مساحة للألعاب",
          "مساحة لتخزين الملفات",
          "مساحة للإنترنت",
        ],
        answer: 0,
        explanation: "النواة بتشتغل في Kernel Space معزولة عن البرامج العادية.",
      },
      {
        question: "ليه النواة بتشتغل في Ring 0؟",
        options: [
          "عشان يبقى عندها وصول كامل للعتاد والإدارة الكاملة",
          "عشان تكون أبطأ",
          "عشان تستهلك بطارية أكتر",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "Ring 0 بيعطي النواة صلاحيات كاملة لإدارة المعالج والذاكرة.",
      },
    ],
    exercise:
      "اكتب محاكاة لـ System Call: برنامج يطلب من النواة قراءة ملف، والنواة بترجع محتواه (تخيلي). وضّح الفرق بين المسار العادي ونداء النظام.",
    terms: [
      { en: "Kernel", ar: "نواة: قلب نظام التشغيل، بتدير المعالج والذاكرة والعتاد وتوفر الخدمات." },
      { en: "Monolithic Kernel", ar: "نواة متجانسة: كل الخدمات بتشتغل في مساحة النواة، زي لينكس." },
      { en: "Microkernel", ar: "نواة صغرى: أقل حاجة ممكنة في النواة والباقي خدمات في مساحة المستخدم." },
      { en: "Ring 0", ar: "حلقة صفر: أعلى مستوى امتياز في المعالج، النواة بتشتغل فيه." },
    ],
  },
  {
    id: "interrupts",
    title: "المقاطعات والاستثناءات Interrupts",
    titleEn: "Interrupts & Exceptions",
    duration: "55 دقيقة",
    description:
      "إزاي المعالج بيعرف إن حاجة حصلت ويوقف اللي بيعمله: المقاطعات والـ ISR والـ IDT.",
    sections: [
      {
        heading: "إيه المقاطعة (Interrupt)؟",
        body: "**المقاطعة (Interrupt)** هي إشارة للمعالج إن حاجة حصلت محتاجة اهتمام فوري. بدل ما المعالج يدور على كل جهاز كل ثانية، الأجهزة بتقول للمعالج \"عندي حاجة\".\n\nمثال: لما تدوس على زرار الكيبورد، الكيبورد بيبعت مقاطعة. المعالج بيوقف اللي بيعمله، ينفذ **معالج المقاطعة (ISR)**، وبعدين يرجع يكمل.\n\nمن غير المقاطعات، المعالج كان لازم يعمل **Polling** — يدور على كل جهاز ويسأله \"فيه حاجة؟\" — وده بطيء جداً ومهدر للطاقة.",
      },
      {
        heading: "أنواع المقاطعات",
        body: "- **Hardware Interrupts:** من عتاد خارجي — كيبورد، ماوس، مؤقت، قرص صلب.\n- **Software Interrupts:** من برنامج — زي System Calls، لما البرنامج يطلب من النواة حاجة.\n- **Exceptions:** أخطاء من المعالج نفسه — زي القسمة على صفر، أو الوصول لذاكرة غير مسموح بيها.\n\nكل نوع ليه رقم خاص في **جدول المقاطعات (IDT)**.",
      },
      {
        heading: "جدول المقاطعات IDT",
        body: "**الـ Interrupt Descriptor Table (IDT)** هو جدول في الذاكرة بيقول للمعالج: \"لما تيجي مقاطعة رقم X، نفّذ الدالة اللي في العنوان Y\".\n\nكل مدخل في الجدول اسمه **Gate Descriptor**، وبيحتوي:\n\n- عنوان دالة المعالجة (ISR)\n- مستوى الامتياز المطلوب\n- نوع المقاطعة (Interrupt Gate أو Trap Gate)\n\nالنواة هي اللي بتجهّز الـ IDT في بداية الإقلاع.",
      },
      {
        heading: "معالج المقاطعة ISR",
        body: "**الـ Interrupt Service Routine (ISR)** هي الدالة اللي بتنفذ لما تحصل مقاطعة. لازم تكون:\n\n- **سريعة:** المعالج وقف كل حاجة عشانها.\n- **آمنة:** مش بتغير حالة المعالج من غير حفظها الأول.\n- **دقيقة:** بتعمل حاجة واحدة بس وبعدين ترجع.\n\nالمعتاد إن الـ ISR بتحفظ حالة المعالج، بتعمل أقل حاجة ممكنة (زي قراءة البايت من الكيبورد)، وبعدين بترجع التحكم.",
      },
      {
        heading: "مثال: محاكاة نظام مقاطعات",
        body: "هنكتب محاكاة بسيطة لمعالج مقاطعات: جدول ISR لكل نوع مقاطعة، ودالة بتتنفيذ المعالج المناسب. الكود بيوضح الفكرة من غير تعقيدات الـ hardware.",
      },
    ],
    code: [
      {
        title: "محاكاة متحكم مقاطعات بسيط",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
#include <functional>
using namespace std;

enum class InterruptType { Timer, Keyboard, Disk, DivideByZero };

struct Interrupt {
    InterruptType type;
    int data;
};

class InterruptHandler {
    // جدول المقاطعات: كل نوع ليه دالة معالجة
    vector<function<void(int)>> handlers;

public:
    InterruptHandler() : handlers(4, nullptr) {
        handlers[0] = [](int) { cout << "[Timer] نبضة مؤقت" << endl; };
        handlers[1] = [](int d) { cout << "[Keyboard] حرف: " << (char)d << endl; };
        handlers[2] = [](int) { cout << "[Disk] انتهى قراءة القرص" << endl; };
        handlers[3] = [](int) { cout << "[Exception] قسمة على صفر!" << endl; };
    }

    void handle(const Interrupt& intr) {
        int idx = (int)intr.type;
        cout << "مقاطعة رقم " << idx << "!" << endl;
        if (handlers[idx]) handlers[idx](intr.data);
    }
};

int main() {
    InterruptHandler cpu;

    cpu.handle({InterruptType::Timer, 0});
    cpu.handle({InterruptType::Keyboard, 65});
    cpu.handle({InterruptType::DivideByZero, 0});
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين الـ Interrupt والـ Exception؟",
        options: [
          "Interrupt من عتاد خارجي، Exception من المعالج نفسه زي خطأ في البرنامج",
          "الاتنين نفس الحاجة",
          "Exception أسرع",
          "Interrupt للألعاب بس",
        ],
        answer: 0,
        explanation: "المقاطعات الخارجية من العتاد، والاستثناءات من المعالج بسبب خطأ في التنفيذ.",
      },
      {
        question: "إيه وظيفة الـ IDT؟",
        options: [
          "جدول بيقول للمعالج أنهي دالة تنفذ لكل نوع مقاطعة",
          "إدارة الذاكرة",
          "تخزين الملفات",
          "رسم الصور",
        ],
        answer: 0,
        explanation: "الـ IDT هو جدول التوجيه اللي بيربط كل رقم مقاطعة بمعالجها.",
      },
      {
        question: "ليه الـ ISR لازم يكون سريع؟",
        options: [
          "لأن المعالج وقف كل حاجة عشانها، والتأخير بيأثر على كل النظام",
          "عشان يوفر البطارية",
          "عشان يكون أصغر حجماً",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "المعالج بيوقف كل حاجة وقت الـ ISR، فأي تأخير بيأثر على الأداء كله.",
      },
    ],
    exercise:
      "أضف نوع مقاطعة جديد اسمه `Network`، واكتب الـ ISR اللي بيطبع رسالة \"وصل حزمة من الشبكة\" مع بيانات الحزمة.",
    terms: [
      { en: "Interrupt", ar: "مقاطعة: إشارة للمعالج إن حاجة حصلت محتاجة اهتمام فوري." },
      { en: "ISR", ar: "روتين معالجة المقاطعة: الدالة اللي بتنفذ لما تحصل مقاطعة." },
      { en: "IDT", ar: "جدول المقاطعات: جدول بيربط كل نوع مقاطعة بعنوان المعالج بتاعه." },
      { en: "Exception", ar: "استثناء: حدث من المعالج بسبب خطأ في التنفيذ، زي القسمة على صفر." },
    ],
  },
  {
    id: "memory-kernel",
    title: "إدارة الذاكرة في النواة",
    titleEn: "Kernel Memory Management",
    duration: "60 دقيقة",
    description:
      "الذاكرة الافتراضية والـ Paging و Page Table: إزاي كل برنامج يبقى عنده عالمه الخاص.",
    sections: [
      {
        heading: "الذاكرة الفيزيائية والافتراضية",
        body: "الذاكرة الفيزيائية هي الرامات الحقيقية اللي في الجهاز. لكن كل برنامج عايز يبقى عنده ذاكرة مستقلة وآمنة.\n\n**الذاكرة الافتراضية (Virtual Memory)** بتوفر ده: كل برنامج بيشتغل في عنواين افتراضية من 0 لحد آخر، والمعالج بيحولها لعناوين فيزيائية حقيقية.\n\nالفايدة: البرامج مش بتشوف الذاكرة الحقيقية، فبرنامج ممكن يكتب في الذاكرة من غير ما يأثر على التاني.",
      },
      {
        heading: "الترقيم (Paging)",
        body: "**الترقيم (Paging)** هو النظام اللي بيحول العناوين الافتراضية للفيزيائية. الذاكرة بتتقسّم لقطع متساوية اسمها **صفحات (Pages)** — حجمها عادة 4KB.\n\nكل برنامج عنده **جدول صفحات (Page Table)** — قاموس بيربط كل صفحة افتراضية برقم إطار (Frame) في الذاكرة الفيزيائية.\n\nمثال: الصفحة الافتراضية رقم 3 ممكن تتحول للإطار الفيزيائي رقم 7.",
      },
      {
        heading: "الـ Page Table و TLB",
        body: "**جدول الصفحات (Page Table)** بيتقال لالمعالج في كل مرة يحتاج يحول عنوان. لكن القراءة من جدول الصفحات بطيئة — فالمعالج عنده **TLB (Translation Lookaside Buffer)**: ذاكرة مؤقتة صغيرة بتحفظ آخر التحويلات.\n\nلما يطلب عنوان، المعالج يدور في الـ TLB الأول. لو لقاه، يبقى **TLB Hit** — سريع جداً. لو مش لقاه، **TLB Miss** — بيروح لجدول الصفحات.\n\nالنواة بتمسح الـ TLB لما تبدل جدول الصفحات (زي لما تنقل عملية).",
      },
      {
        heading: "الـ Page Fault",
        body: "**الـ Page Fault** بيحصل لما البرنامج يطلب صفحة مش موجودة في الذاكرة الفيزيائية. ده مش خطأ — هو آلية شغل عادية!\n\nالنواة بتتعامل مع الـ Page Fault: بترجع الصفحة من القرص (لو هي منقولة هناك)، أو بتخصص صفحة جديدة (لو هي أول مرة يُستخدمها)، أو بتعمل الجيم لو الوصول غير قانوني.\n\nلاحظ إن البرامج مش بتشوف الـ Page Fault — هي بتحصل وخلف الستار.",
      },
      {
        heading: "مثال: محاكاة مبسطة للـ Paging",
        body: "هنكتب كود بيحاكي تحويل عنوان افتراضي لعنوان فيزيائي عن طريق جدول صفحات، وبيوضح إمتى بيحصل Page Fault.",
      },
    ],
    code: [
      {
        title: "تحويل العناوين باستخدام جدول الصفحات",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <cstdint>
using namespace std;

struct PageTableEntry {
    uint32_t frame;
    bool valid;
};

class MemoryManager {
    vector<PageTableEntry> pageTable;
    uint32_t pageSize;
public:
    MemoryManager(int pages, uint32_t ps) : pageTable(pages), pageSize(ps) {}

    void map(uint32_t page, uint32_t frame) {
        pageTable[page] = {frame, true};
    }

    bool translate(uint32_t virtualAddr, uint32_t& physicalAddr) const {
        uint32_t page = virtualAddr / pageSize;
        uint32_t offset = virtualAddr % pageSize;

        if (page >= pageTable.size() || !pageTable[page].valid) {
            return false; // Page Fault
        }
        physicalAddr = pageTable[page].frame * pageSize + offset;
        return true;
    }
};

int main() {
    MemoryManager mm(8, 4096); // 8 صفحات، حجم الصفحة 4KB
    mm.map(0, 3);
    mm.map(1, 7);

    uint32_t addresses[] = {0, 4096, 8192, 20};
    for (uint32_t va : addresses) {
        uint32_t pa;
        if (mm.translate(va, pa)) {
            cout << "العنوان الافتراضي " << va << " -> الفعلي " << pa << endl;
        } else {
            cout << "العنوان الافتراضي " << va << " -> غير مخصص (Page Fault)" << endl;
        }
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين العنوان الافتراضي والفعلي؟",
        options: [
          "الافتراضي اللي البرنامج بيشوفه، والفعلي عنوان الذاكرة الحقيقية",
          "الاتنين نفس الحاجة",
          "الفعلي أسرع",
          "الافتراضي للألعاب بس",
        ],
        answer: 0,
        explanation: "البرنامج بيتعامل مع عناوين افتراضية، والمعالج بيحولها للعناوين الفيزيائية.",
      },
      {
        question: "إيه فائدة الـ Paging؟",
        options: [
          "كل برنامج يبقى عنده ذاكرة مستقلة وآمنة من غير ما يشوف البرامج التانية",
          "يجعل الجهاز أبطأ",
          "يقلل الذاكرة",
          "مفيش فايدة",
        ],
        answer: 0,
        explanation: "Paging بيوفر عزل الذاكرة بين البرامج ويسمح باستخدام ذاكرة أكبر من الفيزيائية.",
      },
      {
        question: "إيه الـ Page Fault؟",
        options: [
          "طلب صفحة مش موجودة في الذاكرة الفيزيائية، والنواة بتجيبها",
          "خطأ قاتل في النظام",
          "انتهاء الذاكرة",
          "تلف في الرامات",
        ],
        answer: 0,
        explanation: "الـ Page Fault آلية عادية، والنواة بتجيب الصفحة من القرص أو تخصص واحدة جديدة.",
      },
    ],
    exercise:
      "وسّع المحاكاة عشان تدعم خاصية \"الصفحات المنقولة للقرص\": ضيف حقل `onDisk` في الـ PageTableEntry، ولو الصفحة على القرص اطبع \"استدعاء من القرص\".",
    terms: [
      { en: "Virtual Memory", ar: "ذاكرة افتراضية: ذاكرة منطقية بيشوفها البرنامج، والمعالج بيحولها للذاكرة الحقيقية." },
      { en: "Paging", ar: "ترقيم: تقسيم الذاكرة لقطع متساوية (صفحات) وتحويل عناوينها عبر جدول الصفحات." },
      { en: "Page Table", ar: "جدول الصفحات: قاموس بيربط كل صفحة افتراضية بإطار في الذاكرة الفيزيائية." },
      { en: "Page Fault", ar: "خطأ صفحة: طلب صفحة مش موجودة في الذاكرة الفيزيائية، والنواة بتجيبها." },
    ],
  },
  {
    id: "filesystem",
    title: "نظام ملفات بسيط",
    titleEn: "Simple Filesystem",
    duration: "60 دقيقة",
    description:
      "من الدليل للملف: إيه الـ inode والـ directory والـ block، وهنصمم نظام ملفات في الذاكرة.",
    sections: [
      {
        heading: "إيه نظام الملفات؟",
        body: "**نظام الملفات (Filesystem)** هو الطريقة اللي البيانات بتتخزن وتنظّم على القرص. بدونه، القرص مجرد مساحة خالية من غير أي تنظيم.\n\nنظام الملفات بيوفر:\n\n- **الملفات (Files):** وحدات بيانات ليها أسماء.\n- **الأدلة (Directories):** تنظيم الملفات في مجموعات.\n- **البيانات الوصفية (Metadata):** الحجم، الصلاحيات، تاريخ التعديل.\n\nأشهر أنظمة الملفات: **ext4** و**XFS** على لينكس، و**NTFS** على ويندوز، و**APFS** على ماك.",
      },
      {
        heading: "مكونات نظام الملفات",
        body: "- **الـ inode:** هيكل بيانات بيوصف الملف — حجمه، مكانه على القرص، صلاحياته — لكن **من غير اسمه**. الاسم بيتخزن في الدليل.\n- **الـ directory:** جدول بيربط الأسماء بأرقام الـ inode.\n- **الـ block:** وحدة التخزين الأساسية على القرص، عادة 4KB. الملفات بتتقسّم لكتليات.\n\nمثال: لما تفتح `docs/report.txt`، النظام يقرا دليل `docs` ويلاقي اسم `report.txt` مربوط بـ inode رقم 123، وبعدين يقرا الـ inode عشان يعرف الكتل اللي فيها البيانات.",
      },
      {
        heading: "التصميم والبناء",
        body: "لتصميم نظام ملفات جديد، محتاج تقرر:\n\n1. **كيف تنظم البيانات الوصفية:** في كتل خاصة أول القرص؟ في جداول؟\n2. **كيف تخصّص المساحة:** تتبع الكتل الحرة بـ bitmap؟ ولا بـ linked list؟\n3. **كيف تدير الملفات الكبيرة:** مؤشرات مباشرة؟ ولا غير مباشرة؟\n4. **كيف تتعامل مع الفساد:** journaling ولا checksums؟\n\nأنظمة زي **FAT** بسيطة جداً (linked list)، وأنظمة زي **ext4** معقدة (HTree و extents و journaling).",
      },
      {
        heading: "مثال: نظام ملفات في الذاكرة",
        body: "هنكتب نظام ملفات مبسط بيشتغل في الذاكرة: أدلة وملفات، إنشاء، كتابة، قراءة، وسرد المحتويات. الهيكل بيوضح الفكرة الأساسية من غير تعقيدات الـ disk I/O.",
      },
    ],
    code: [
      {
        title: "نظام ملفات مبسط في الذاكرة",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct FileNode {
    string name;
    bool isDirectory;
    string content;
    vector<int> children;
};

class FileSystem {
    vector<FileNode> nodes;
public:
    FileSystem() {
        nodes.push_back({"/", true, "", {}});
    }

    int create(int dirId, const string& name, bool isDir) {
        nodes.push_back({name, isDir, "", {}});
        int id = (int)nodes.size() - 1;
        nodes[dirId].children.push_back(id);
        return id;
    }

    void write(int fileId, const string& data) {
        nodes[fileId].content = data;
    }

    string read(int fileId) const {
        return nodes[fileId].content;
    }

    void list(int dirId) const {
        cout << "محتويات " << nodes[dirId].name << ":" << endl;
        for (int child : nodes[dirId].children) {
            cout << "  " << nodes[child].name << endl;
        }
    }
};

int main() {
    FileSystem fs;

    int docs = fs.create(0, "docs", true);
    int file = fs.create(docs, "note.txt", false);
    fs.write(file, "مرحباً من نظام الملفات!");

    fs.list(0);
    fs.list(docs);
    cout << "المحتوى: " << fs.read(file) << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين الملف والمجلد في نظام الملفات؟",
        options: [
          "الملف بيانات، والمجلد تنظيم لأسماء الملفات",
          "الاتنين نفس الحاجة",
          "المجلد أسرع",
          "الملف للألعاب بس",
        ],
        answer: 0,
        explanation: "الملفات بتخزن البيانات، والأدلة بتربط الأسماء بالملفات.",
      },
      {
        question: "إيه وظيفة الـ inode؟",
        options: [
          "وصف الملف — حجمه ومكانه وصلاحياته — من غير اسمه",
          "تخزين اسم الملف فقط",
          "رسم الصور",
          "إدارة الشبكة",
        ],
        answer: 0,
        explanation: "الـ inode هو الهيكل اللي بيوصف الملف وبيقول مكان بياناته على القرص.",
      },
      {
        question: "ليه نظام الملفات مهم في نظام التشغيل؟",
        options: [
          "بدونه مفيش طريقة منظمة لتخزين البيانات واسترجاعها على القرص",
          "لأنه يجعل الجهاز أجمل",
          "لأنه يشغل الصوت",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "نظام الملفات هو اللي بيحول مساحة القرص الخالية لبيانات منظمة قابلة للاستخدام.",
      },
    ],
    exercise:
      "أضف خاصية حذف الملفات: اكتب دالة `remove(int id)` بتشيل الملف من قايمة الأطفال وبتعمل علامة عليه كمحذوف.",
    terms: [
      { en: "Inode", ar: "هيكل وصف الملف: بيانات وصفية عن الملف (حجمه ومكانه وصلاحياته) من غير اسمه." },
      { en: "Directory", ar: "دليل: تنظيم لأسماء الملفات، بيربط كل اسم برقم inode." },
      { en: "Block", ar: "كتلة: وحدة التخزين الأساسية على القرص، وعادة حجمها 4KB." },
      { en: "Filesystem", ar: "نظام ملفات: الطريقة اللي البيانات بتتخزن وتنظّم على القرص." },
    ],
  },
  {
    id: "os-dev-project",
    title: "مشروع: نواة تعمل في QEMU",
    titleEn: "Project: Kernel Running in QEMU",
    duration: "100 دقيقة",
    description:
      "المشروع الختامي لمادة نظم التشغيل: نواة بتقلع في QEMU وتتجهّز للنظام البيئي الحقيقي.",
    sections: [
      {
        heading: "تجهيز بيئة التطوير",
        body: "عشان تبني نواة، محتاج:\n\n- **Cross-Compiler:** مترجم بيطلع كود لمعمارية مختلفة — مثلاً `x86_64-elf-gcc`. مش هتستخدم g++ العادي لأنه بيفترض وجود نظام تشغيل.\n- **QEMU:** محاكي بيقلد جهاز كامل، بيسمح لك تشغل النواة من غير ما تمسح نظامك.\n- **NASM:** مترجم لغة التجميع، للـ Bootloader.\n\nالخطوات: ثبّت QEMU، وبعدين ثبّت cross-compiler (ممكن تبنيه من المصدر أو تستخدم واحد جاهز).",
      },
      {
        heading: "كتابة الـ Bootloader",
        body: "الـ Bootloader أول كود بيتنفذ. في الأنظمة البسيطة، ممكن يكون أقل من 512 بايت. وظائفه:\n\n1. تعطيل الـ Interrupts.\n2. إعداد الـ Segment Registers.\n3. تحميل النواة من القرص للذاكرة.\n4. القفز لكود النواة.\n\nفي الأنظمة الحقيقية، في Bootloader أكتر من مرحلة (MBR → Stage 1 → Stage 2)، لكن في مشروعنا هنبسّط.",
      },
      {
        heading: "كتابة النواة والانتقال للحماية",
        body: "الكود ده بيتكتب بلغة C++ لكن من غير مكتبة قياسية — **freestanding**. مفيش `cout` ولا `malloc`، لأن مفيش نظام تشغيل تحتنا.\n\nخطوات النواة:\n\n1. إعداد الـ Stack.\n2. إعداد الـ GDT (Global Descriptor Table).\n3. التحول من Real Mode لـ Protected Mode.\n4. إعداد المقاطعات والـ IDT.\n5. كتابة على الشاشة (عن طريق VGA Memory).\n\nده تحدي حقيقي — أي خطأ صغير ممكن يخلي الجهاز يعيد التشغيل.",
      },
      {
        heading: "البناء والتشغيل",
        body: "هنستخدم **Makefile** عشان نربط كل الأجزاء:\n\n```make\nall: boot.bin kernel.bin\n\tcat boot.bin kernel.bin > os-image.bin\n\nrun: os-image.bin\n\tqemu-system-x86_64 -fda os-image.bin\n```\n\n`boot.bin` بيتعمل بـ NASM، و`kernel.bin` بيتعمل بالـ cross-compiler، والاتنين بيتلموا في ملف واحد وهو الـ floppy disk image.\n\nأمر التشغيل: `make run` — وهيفتح نافذة QEMU فيها نواة شغالة!",
      },
      {
        heading: "مثال: محاكاة خط أنابيب الإقلاع",
        body: "عشان نفهم تسلسل الإقلاع والكيرنل من غير تعقيدات الـ hardware، هنكتب محاكاة بتربط كل المفاهيم — الـ Bootloader بيحمّل النواة، والنواة بتجهّز الذاكرة، وبعدين بتعمل System Call.",
      },
    ],
    code: [
      {
        title: "محاكاة إقلاع نواة مع إدارة الذاكرة و System Calls",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
#include <cstdint>
using namespace std;

// 1) Bootloader: بيحمّل النواة من القرص للذاكرة
vector<uint8_t> bootloaderLoadKernel() {
    cout << "[Bootloader] تحميل النواة من القرص..." << endl;
    return vector<uint8_t>(4096, 0); // 4KB kernel image
}

// 2) النواة: إعداد جدول الصفحات
struct PageEntry { uint32_t frame; bool valid; };
vector<PageEntry> pageTable;

void kernelSetupPaging() {
    cout << "[Kernel] إعداد جدول الصفحات..." << endl;
    pageTable.resize(8, {0, false});
    pageTable[0] = {0, true};
    pageTable[1] = {1, true};
}

// 3) نظام استدعاءات بسيط
enum class Syscall { Print, Exit };

void kernelHandleSyscall(Syscall sc, const string& msg) {
    if (sc == Syscall::Print) {
        cout << "[Kernel] syscall print: " << msg << endl;
    } else if (sc == Syscall::Exit) {
        cout << "[Kernel] syscall exit" << endl;
    }
}

int main() {
    cout << "=== محاكاة إقلاع نواة في QEMU ===" << endl;

    vector<uint8_t> kernel = bootloaderLoadKernel();
    cout << "[Bootloader] تم تحميل " << kernel.size() << " بايت" << endl;

    kernelSetupPaging();

    cout << "[Kernel] مرحباً من النواة!" << endl;
    kernelHandleSyscall(Syscall::Print, "أول رسالة من البرنامج");
    kernelHandleSyscall(Syscall::Exit, "");

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه ترتيب خطوات بناء نواة QEMU؟",
        options: [
          "Bootloader → Kernel → Linking → QEMU",
          "Kernel → Bootloader → QEMU → Linking",
          "QEMU → Bootloader → Kernel → Linking",
          "Linking → QEMU → Bootloader → Kernel",
        ],
        answer: 0,
        explanation: "بنكتب الـ Bootloader والنواة، وبعدين نربطهم، وبعدين نشغّل الصورة في QEMU.",
      },
      {
        question: "ليه بنستخدم cross-compiler؟",
        options: [
          "عشان المترجم العادي بيفترض وجود نظام تشغيل، والنواة مش عندها واحد",
          "عشان يكون أسرع",
          "عشان يدعم الرسوميات",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "النواة بتشتغل من غير مكتبة قياسية، فمحتاج مترجم يفهم ده.",
      },
      {
        question: "إيه وظيفة الـ linker script؟",
        options: [
          "تحديد مكان كل جزء من الكود في الذاكرة — مثلاً النواة تبدأ من العنوان 0x1000",
          "إدارة الملفات",
          "تشغيل الصوت",
          "رسم الصور",
        ],
        answer: 0,
        explanation: "الـ linker script بيحدد تخطيط الذاكرة — حاجة أساسية في بناء النظم.",
      },
    ],
    exercise:
      "ابحث عن مصدر Bootloader جاهز (زي Limine أو GRUB) وشوف إزاي بيعمل نفس الخطوات — قارن بين كودهم والمحاكاة اللي كتبناها.",
    terms: [
      { en: "QEMU", ar: "محاكي: برنامج بيقلد جهاز كمبيوتر كامل، بيسمح بتشغيل النوى بأمان." },
      { en: "Cross-Compiler", ar: "مترجم متقاطع: مترجم بيطلع كود لمعمارية مختلفة عن المعمارية اللي بيترجم عليها." },
      { en: "Linker Script", ar: "سكربت الربط: ملف بيحدد مكان كل جزء من الكود في الذاكرة وقت الربط." },
      { en: "Freestanding", ar: "مستقل: كود بيشتغل من غير مكتبة قياسية ولا نظام تشغيل، زي النوى." },
    ],
  },
];
