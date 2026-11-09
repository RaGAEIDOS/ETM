import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "os-intro",
    title: "ما هو نظام التشغيل؟",
    titleEn: "What is an Operating System?",
    duration: "35 دقيقة",
    description:
      "نظام التشغيل هو الوسيط بينك وبين الهاردوير: هتفهم وظائفه الأساسية وإزاي بيشتغل.",
    sections: [
      {
        heading: "إيه هو نظام التشغيل؟",
        body: "نظام التشغيل (Operating System) برنامج كبير بيشتغل من أول ما الكمبيوتر بيفتح، وبيفضل شغال لحد ما نقفل. هو الوسيط بين البرامج والهاردوير: بدل ما كل برنامج يتعامل مباشرة مع المعالج والذاكرة والقرص، كلهم يطلبوا من نظام التشغيل.\n\nأشهر أنظمة التشغيل: Windows وLinux وmacOS.",
      },
      {
        heading: "الوظائف الأساسية",
        body: "نظام التشغيل بيعمل 5 حاجات رئيسية:\n\n1. **إدارة العمليات:** يشغّل ويوقف البرامج.\n2. **إدارة الذاكرة:** يوزع الذاكرة على البرامج.\n3. **نظام الملفات:** ينظم الملفات على القرص.\n4. **إدارة الأجهزة:** يتحكم في الطابعة والشبكة وغيرهم.\n5. **الواجهة:** إما واجهة رسومية (GUI) أو سطر أوامر (CLI).",
      },
      {
        heading: "النواة Kernel",
        body: "النواة (Kernel) قلب نظام التشغيل. هي الجزء اللي بيشتغل في **وضع النواة** (Kernel Mode) اللي عنده صلاحيات كاملة على الهاردوير.\n\nالبرامج العادية بتشتغل في **وضع المستخدم** (User Mode) بصلاحيات محدودة. لما البرنامج يحتاج حاجة من الهاردوير، بيعمل نداء نظام (System Call) للنواة.",
      },
      {
        heading: "أنواع أنظمة التشغيل",
        body: "- **أنظمة مكتبية:** Windows وLinux وmacOS.\n- **أنظمة خوادم:** Linux وWindows Server.\n- **أنظمة الهواتف:** Android وiOS.\n- **أنظمة مدمجة:** أنظمة صغيرة جوه الأجهزة زي الغسالة والسيارة.\n- **أنظمة الوقت الحقيقي:** أنظمة لازم ترد في وقت محدد بدقة، زي أنظمة الطيران.",
      },
      {
        heading: "نظرة سريعة على التاريخ",
        body: "- الستينات: أنظمة بسيطة بتشغّل برنامج واحد.\n- السبعينات: UNIX ظهر وأسس أفكار كتيرة لسه مستخدمة.\n- التمانينات: Windows وMac مع انتشار الكمبيوتر الشخصي.\n- الألفينات: Linux وAndroid وبيئة المصادر المفتوحة.",
      },
    ],
    code: [
      {
        title: "خدمات نظام التشغيل من C++",
        language: "cpp",
        code: `#include <iostream>
#include <filesystem>
#include <fstream>
#include <thread>
using namespace std;

int main() {
    cout << "مسار العمل الحالي: " << filesystem::current_path() << endl;
    cout << "عدد أنوية المعالج المتاحة: "
         << thread::hardware_concurrency() << endl;

    filesystem::path testFile = "test_os.txt";
    // نظام التشغيل هو اللي بيديك الإذن بالوصول للملف
    ofstream out(testFile);
    out << "نظام التشغيل يدير الملفات" << endl;
    out.close();

    cout << "تم إنشاء الملف: " << testFile << endl;
    cout << "حجم الملف بالبايت: " << filesystem::file_size(testFile) << endl;

    filesystem::remove(testFile);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الوظيفة الأساسية لنظام التشغيل؟",
        options: [
          "تشغيل الألعاب فقط",
          "إدارة موارد الكمبيوتر وتوفير واجهة للبرامج",
          "تصميم المواقع",
          "تخزين البيانات فقط",
        ],
        answer: 1,
        explanation: "نظام التشغيل بيدير المعالج والذاكرة والأجهزة وبيوفر واجهة للبرامج والمستخدم.",
      },
      {
        question: "إيه الفرق بين وضع المستخدم ووضع النواة؟",
        options: [
          "مفيش فرق",
          "وضع النواة عنده صلاحيات كاملة على الهاردوير",
          "وضع المستخدم أسرع",
          "وضع النواة للبرامج الرسومية بس",
        ],
        answer: 1,
        explanation: "وضع النواة بيسمح بالوصول الكامل للهاردوير، بينما وضع المستخدم محدود لحماية النظام.",
      },
      {
        question: "إيه دور النواة Kernel؟",
        options: [
          "عرض الصور",
          "إدارة العمليات والذاكرة والأجهزة",
          "كتابة المستندات",
          "تصفح الإنترنت",
        ],
        answer: 1,
        explanation: "النواة هي قلب نظام التشغيل ومسؤولة عن إدارة الموارد.",
      },
    ],
    exercise:
      "اكتب برنامج C++ يستخدم `std::filesystem` لعرض كل الملفات في مجلد معين مع حجم كل ملف.",
    terms: [
      { en: "Operating System", ar: "نظام تشغيل: برنامج بيشتغل كوسيط بين البرامج والهاردوير." },
      { en: "Kernel", ar: "نواة: قلب نظام التشغيل اللي بيشتغل بصلاحيات كاملة." },
      { en: "System Call", ar: "نداء نظام: طلب من برنامج المستخدم للنواة ينفذ عملية معينة." },
      { en: "Driver", ar: "مشغل جهاز: برنامج متخصص بيتعامل مع جهاز معين." },
    ],
  },
  {
    id: "processes-threads",
    title: "العمليات والخيوط Processes & Threads",
    titleEn: "Processes & Threads",
    duration: "50 دقيقة",
    description:
      "الفرق بين العملية والخيط، دورة حياة العملية، وإنشاء الخيوط في C++ باستخدام std::thread.",
    sections: [
      {
        heading: "العملية مقابل الخيط",
        body: "العملية (Process) نسخة من برنامج قيد التشغيل، ليها ذاكرة خاصة ومستقلة عن العمليات التانية.\n\nالخيط (Thread) مسار تنفيذ جوه العملية. العملية ممكن فيها أكتر من خيط، وكلهم يتشاركوا نفس الذاكرة.\n\nتخيل العملية كمكتب والخيوط كالموظفين اللي شغالين جواه — الموظفين يتشاركوا في نفس الأوراق والأدراج.",
      },
      {
        heading: "دورة حياة العملية",
        body: "العملية بتنشأ في حالة **جديد** (New)، وبعدين بتتحول لـ**جاهز** (Ready) مستنية دورها على المعالج.\n\nالمعالج بيختار عملية ويبدأ تنفيذها في حالة **قيد التشغيل** (Running). لو احتاجت تنتظر إدخال من المستخدم، بتدخل حالة **انتظار** (Waiting). ولما تخلص بترجع تاني.\n\nفي النهاية العملية بتوصل لـ**المنتهية** (Terminated).",
      },
      {
        heading: "الخيوط في C++",
        body: "من C++11، مكتبة `<thread>` بتوفر `std::thread` عشان نشغّل دوال في خيوط منفصلة.\n\nكل خيط لازم يتساب مع البرنامج الرئيسي عن طريق `join()`، وإلا البرنامج ممكن يقفل قبل ما الخيط يخلص شغله.",
      },
      {
        heading: "التواصل بين العمليات",
        body: "العمليات مش بتتشارك ذاكرة، فبيتواصلوا عن طريق:\n\n- **الأنابيب** (Pipes).\n- **الملفات المشتركة**.\n- **السوكتات** (Sockets).\n- **الذاكرة المشتركة** (Shared Memory).\n\nالخيوط أسهل في التواصل لأنهم يتشاركوا الذاكرة، لكن ده بيجيب مشاكل التزامن اللي هنستعرضها في درس الـConcurrency.",
      },
      {
        heading: "متى تستخدم خيط جديد؟",
        body: "- عملية طويلة ومستقلة زي تحميل ملف.\n- تحديث واجهة المستخدم مع عمليات في الخلفية.\n- معالجة بيانات بالتوازي.\n\nلكن زيادة عدد الخيوط مش دايمًا بتسرّع البرنامج: فيه حد لعدد الأنوية، وبعده الخيوط بتبدأ تتنافس على المعالج.",
      },
    ],
    code: [
      {
        title: "إنشاء خيوط مع std::thread",
        language: "cpp",
        code: `#include <iostream>
#include <thread>
#include <vector>
using namespace std;

void worker(int id) {
    for (int i = 0; i < 3; i++) {
        cout << "خيط " << id << " يدور - الخطوة " << i << endl;
    }
}

int main() {
    cout << "البرنامج الرئيسي يبدأ" << endl;
    vector<thread> threads;
    for (int i = 0; i < 4; i++) {
        threads.emplace_back(worker, i);
    }
    for (auto& t : threads) {
        t.join();
    }
    cout << "انتهت كل الخيوط" << endl;
    return 0;
}`,
      },
      {
        title: "المهام غير المتزامنة مع std::async",
        language: "cpp",
        code: `#include <iostream>
#include <future>
#include <vector>
using namespace std;

int square(int x) {
    return x * x;
}

int main() {
    vector<future<int>> futures;
    for (int i = 1; i <= 5; i++) {
        futures.push_back(async(launch::async, square, i));
    }
    for (auto& f : futures) {
        cout << "النتيجة: " << f.get() << endl;
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق الأساسي بين العملية والخيط؟",
        options: [
          "مفيش فرق",
          "العملية ليها ذاكرة مستقلة والخيط جوه العملية يتشارك الذاكرة",
          "الخيط أكبر من العملية",
          "العملية أسرع دايماً",
        ],
        answer: 1,
        explanation: "كل عملية ليها ذاكرة خاصة بيها، بينما الخيوط جوه العملية يتشاركوا نفس الذاكرة.",
      },
      {
        question: "ليه لازم نندعي `join()` على الخيط؟",
        options: [
          "عشان نسرع البرنامج",
          "عشان نتأكد إن البرنامج الرئيسي مستني الخيط يخلص",
          "عشان نوفر الذاكرة",
          "عشان نوقف الخيط",
        ],
        answer: 1,
        explanation: "join بتوقف البرنامج الرئيسي لحد ما الخيط يخلص، وإلا ممكن البرنامج يقفل بدري.",
      },
      {
        question: "الخيوط جوه نفس العملية بتتشارك في...",
        options: ["الذاكرة", "القرص الصلب", "الطابعة", "الشبكة"],
        answer: 0,
        explanation: "الخيوط تتشارك في ذاكرة العملية، فالتواصل بينهم سريع لكن محتاج حماية.",
      },
    ],
    exercise:
      "اكتب برنامج ينشئ 4 خيوط، كل واحد يطبع أرقام من 1 إلى 1000 ويجمعها. اطبع مجموع كل خيط في النهاية.",
    terms: [
      { en: "Process", ar: "عملية: نسخة من برنامج قيد التشغيل ليها ذاكرة مستقلة." },
      { en: "Thread", ar: "خيط: مسار تنفيذ جوه العملية يتشارك الذاكرة مع الخيوط التانية." },
      { en: "Context Switch", ar: "تبديل سياق: عملية المعالج في حفظ حالة عملية وتشغيل عملية تانية." },
      { en: "PCB", ar: "كتلة التحكم بالعملية: بنية بيانات بتخزن حالة العملية ومعلوماتها." },
    ],
  },
  {
    id: "scheduling",
    title: "جدولة العمليات CPU Scheduling",
    titleEn: "CPU Scheduling",
    duration: "45 دقيقة",
    description:
      "إزاي المعالج بيختار أنهي عملية ينفذها الأول؟ هتدرس FCFS وSJF وRound Robin وتحاكيهم.",
    sections: [
      {
        heading: "لماذا الجدولة؟",
        body: "المعالج عنده أنوية محدودة، لكن عندنا عشرات البرامج شغالة. لازم يكون فيه **مجدول** (Scheduler) يقرر أنهي عملية تاخد المعالج في كل لحظة.\n\nهدف الجدولة: استغلال المعالج لأقصى حد، تقليل وقت الانتظار، وتحقيق العدالة بين البرامج.",
      },
      {
        heading: "FCFS وSJF",
        body: "First-Come, First-Served (FCFS): العمليات بتنفذ بترتيب وصولها — بسيط لكن ممكن يخلّي عملية قصيرة تنتظر طويلة.\n\nShortest Job First (SJF): المعالج يختار العملية الأقصر أولاً — بيقلل متوسط الانتظار، لكن بيحتاج يعرف مدة كل عملية مقدماً.",
      },
      {
        heading: "Round Robin",
        body: "Round Robin (RR): كل عملية تاخد **كمية زمنية** (Time Quantum) صغيرة، وبعدين ترجع لآخر الطابور.\n\nده بيحقق العدالة: كل العمليات تحصل على نصيبها من المعالج. لو الكمية كبيرة، RR بيصبح زي FCFS؛ ولو صغيرة جداً، تبديل السياق بيبقى مكلف.",
      },
      {
        heading: "حساب الأوقات",
        body: "- **وقت الانتظار:** إجمالي الوقت اللي قضته العملية مستنية في طابور الجاهزين.\n- **وقت الاستجابة:** من بداية التنفيذ لحد نهاية التنفيذ.\n- **وقت التسليم:** من وصول العملية لحد ما تخلص.\n\nبنحسبهم عشان نقارن بين الخوارزميات.",
      },
      {
        heading: "الجدولة الحقيقية",
        body: "أنظمة التشغيل الحقيقية بتستخدم خوارزميات معقدة تجمع بين الأفكار: **طوابير متعددة المستويات** (Multilevel Feedback Queues) بتخلّي العمليات القصيرة تخلص بسرعة، والعمليات الطويلة تتنفذ في الخلفية.",
      },
    ],
    code: [
      {
        title: "محاكاة FCFS وSJF وRound Robin",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

struct Process {
    int id;
    int arrival;
    int burst;
};

void fcfs(vector<Process> processes) {
    int time = 0;
    cout << "FCFS:" << endl;
    for (auto& p : processes) {
        if (time < p.arrival) {
            time = p.arrival;
        }
        int waiting = time - p.arrival;
        time += p.burst;
        int turnaround = time - p.arrival;
        cout << "P" << p.id << ": انتظار=" << waiting
             << " استجابة=" << turnaround << endl;
    }
}

void sjf(vector<Process> processes) {
    int time = 0;
    vector<bool> done(processes.size(), false);
    cout << "SJF (غير قاطع):" << endl;
    int completed = 0;
    while (completed < (int)processes.size()) {
        int idx = -1;
        int shortest = 1000000;
        for (int i = 0; i < (int)processes.size(); i++) {
            if (!done[i] && processes[i].arrival <= time
                && processes[i].burst < shortest) {
                shortest = processes[i].burst;
                idx = i;
            }
        }
        if (idx == -1) {
            time++;
            continue;
        }
        int waiting = time - processes[idx].arrival;
        time += processes[idx].burst;
        int turnaround = time - processes[idx].arrival;
        done[idx] = true;
        completed++;
        cout << "P" << processes[idx].id << ": انتظار=" << waiting
             << " استجابة=" << turnaround << endl;
    }
}

void roundRobin(vector<Process> processes, int quantum) {
    int time = 0;
    int n = processes.size();
    vector<int> remaining(n);
    for (int i = 0; i < n; i++) {
        remaining[i] = processes[i].burst;
    }
    queue<int> q;
    for (int i = 0; i < n; i++) {
        q.push(i);
    }
    vector<int> finish(n, -1);

    cout << "Round Robin (quantum=" << quantum << "):" << endl;
    while (!q.empty()) {
        int i = q.front();
        q.pop();
        int exec = min(quantum, remaining[i]);
        time += exec;
        remaining[i] -= exec;
        if (remaining[i] > 0) {
            q.push(i);
        } else {
            finish[i] = time;
        }
    }
    for (int i = 0; i < n; i++) {
        int turnaround = finish[i];
        int waiting = turnaround - processes[i].burst;
        cout << "P" << processes[i].id << ": انتظار=" << waiting
             << " استجابة=" << turnaround << endl;
    }
}

int main() {
    vector<Process> processes = {
        {1, 0, 8},
        {2, 1, 4},
        {3, 2, 9},
        {4, 3, 5}
    };
    fcfs(processes);
    cout << endl;
    sjf(processes);
    cout << endl;
    roundRobin(processes, 2);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الهدف الأساسي من جدولة العمليات؟",
        options: [
          "تشغيل كل البرامج في نفس الوقت",
          "استغلال المعالج بأقصى حد وتحقيق العدالة",
          "تقليل الذاكرة",
          "إيقاف البرامج القديمة",
        ],
        answer: 1,
        explanation: "الجدولة بتوازن بين استغلال المعالج والعدالة بين العمليات.",
      },
      {
        question: "في Round Robin، إيه معنى Time Quantum؟",
        options: [
          "عمر العملية",
          "المدة الزمنية اللي تاخدها كل عملية قبل ما تتنقل",
          "عدد العمليات",
          "سعة الذاكرة",
        ],
        answer: 1,
        explanation: "الكمية الزمنية هي أقصى مدة تشغيل لعملية قبل الانتقال للتالية.",
      },
      {
        question: "SJF بيتفوق على FCFS في...",
        options: ["البساطة", "متوسط وقت الانتظار", "العدالة", "سرعة التنفيذ"],
        answer: 1,
        explanation: "بتنفيذ الأقصر أولاً، العمليات الصغيرة تخلص بسرعة ومتوسط الانتظار بيقل.",
      },
    ],
    exercise:
      "أضف خوارزمية Priority Scheduling للمحاكاة: كل عملية ليها أولوية، والمعالج ينفذ الأعلى أولوية أولاً.",
    terms: [
      { en: "FCFS", ar: "أول الواصل أول الخدم: خوارزمية جدولة بتنفذ العمليات بترتيب وصولها." },
      { en: "Round Robin", ar: "تدوير دائري: خوارزمية جدولة بتعطي كل عملية كمية زمنية ثابتة." },
      { en: "Waiting Time", ar: "وقت الانتظار: الوقت اللي بتقضيه العملية مستنية في طابور الجاهزين." },
      { en: "Time Quantum", ar: "كمية زمنية: المدة القصيرة اللي تاخدها كل عملية في Round Robin." },
    ],
  },
  {
    id: "memory-management",
    title: "إدارة الذاكرة والصفحات Paging",
    titleEn: "Memory Management & Paging",
    duration: "55 دقيقة",
    description:
      "إدارة الذاكرة والصفحات: الذاكرة الافتراضية، جدول الصفحات، وأخطاء الصفحات، واستبدال الصفحات بـLRU.",
    sections: [
      {
        heading: "الذاكرة الافتراضية",
        body: "كل عملية بتشتغل على ذاكرة افتراضية (Virtual Memory) خاصة بيها. العملية بتتعامل مع عناوين افتراضية، ونظام التشغيل بيحولها لعناوين فيزيائية.\n\nده بيوفر 3 حاجات: عزل العمليات عن بعض، إمكانية تشغيل برامج أكبر من الذاكرة الفعلية، وسهولة تخصيص الذاكرة.",
      },
      {
        heading: "التجزئة Paging",
        body: "الذاكرة الافتراضية والفيزيائية بتتقسم **صفحات** (Pages) بحجم ثابت (عادة 4 كيلوبايت).\n\n**جدول الصفحات** (Page Table) بيربط كل صفحة افتراضية بإطار فيزيائي (Frame). لما البرنامج يوصل عنوان افتراضي، نظام التشغيل يفصل العنوان لرقم صفحة وإزاحة (Offset).",
      },
      {
        heading: "أخطاء الصفحات",
        body: "لو الصفحة المطلوبة مش موجودة في الذاكرة الفيزيائية، بيحصل **خطأ صفحة** (Page Fault). نظام التشغيل يجيب الصفحة من القرص ويحمّلها في الذاكرة.\n\nلو الذاكرة مليانة، لازم يختار صفحة **يطردها** (Evict) ويرجّعها للقرص. اختيار الصفحة المناسبة اسمه **استبدال الصفحات** (Page Replacement).",
      },
      {
        heading: "خوارزميات الاستبدال",
        body: "- **FIFO:** أول صفحة اتحملت هي أول صفحة بتُطرد.\n- **LRU:** نطرد الصفحة اللي من زمان ما اتستخدمتش.\n- **LFU:** نطرد الصفحة الأقل استخداماً.\n\nLRU من أحسن الخوارزميات العملية، وبنحتاج يتتبّع ترتيب استخدام الصفحات.",
      },
      {
        heading: "في C++",
        body: "في C++ مش بتتعامل مع الصفحات مباشرة — دي مسؤولية نظام التشغيل. لكن بنقدر نحاكيها لفهم الفكرة، وده اللي هنعمله في المثال الجاي.",
      },
    ],
    code: [
      {
        title: "محاكاة استبدال الصفحات LRU",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <list>
using namespace std;

int main() {
    vector<int> references = {1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5};
    int frameCount = 3;
    vector<int> frames;
    unordered_map<int, list<int>::iterator> position;
    list<int> lruList;
    int pageFaults = 0;

    for (int page : references) {
        cout << "إشارة للصفحة " << page << ": ";
        if (position.find(page) != position.end()) {
            // الصفحة موجودة: حدّث ترتيب الاستخدام
            lruList.erase(position[page]);
            lruList.push_front(page);
            position[page] = lruList.begin();
            cout << "موجودة | ";
        } else {
            pageFaults++;
            if ((int)frames.size() < frameCount) {
                frames.push_back(page);
            } else {
                int victim = lruList.back();
                lruList.pop_back();
                position.erase(victim);
                for (int& f : frames) {
                    if (f == victim) {
                        f = page;
                    }
                }
            }
            lruList.push_front(page);
            position[page] = lruList.begin();
            cout << "خطأ صفحة | ";
        }
        cout << "الإطارات: ";
        for (int f : frames) {
            cout << f << " ";
        }
        cout << endl;
    }
    cout << "عدد أخطاء الصفحات: " << pageFaults << endl;
    return 0;
}`,
      },
      {
        title: "ترجمة عنوان افتراضي لفعلي",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // جدول صفحات بسيط: الصفحة -> الإطار
    vector<int> pageTable = {-1, 5, 2, 7, 1}; // -1 تعني الصفحة مش موجودة
    const int pageSize = 1024; // حجم الصفحة بالبايت

    vector<int> virtualAddresses = {0, 1500, 2048, 3072, 4096, 5000};
    cout << "العناوين الافتراضية -> العناوين الفعلية:" << endl;
    for (int va : virtualAddresses) {
        int page = va / pageSize;
        int offset = va % pageSize;
        cout << "VA=" << va << " -> صفحة=" << page
             << " إزاحة=" << offset;
        if (page < (int)pageTable.size() && pageTable[page] != -1) {
            int physical = pageTable[page] * pageSize + offset;
            cout << " -> PA=" << physical << endl;
        } else {
            cout << " -> خطأ صفحة (Page Fault)" << endl;
        }
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفائدة الأساسية من الذاكرة الافتراضية؟",
        options: [
          "تقليل حجم البرامج",
          "عزل العمليات وتشغيل برامج أكبر من الذاكرة",
          "زيادة سرعة المعالج",
          "حذف الملفات",
        ],
        answer: 1,
        explanation: "الذاكرة الافتراضية بتعزل العمليات وتسمح بتشغيل برامج أكبر من RAM عن طريق المبادلة مع القرص.",
      },
      {
        question: "إيه معنى Page Fault؟",
        options: [
          "الصفحة تالفة",
          "الصفحة المطلوبة مش موجودة في الذاكرة الفيزيائية",
          "خطأ في البرنامج",
          "الذاكرة مليانة",
        ],
        answer: 1,
        explanation: "خطأ الصفحة بيحصل لما نطلب صفحة مش محملة في RAM، فالنواة تحمّلها من القرص.",
      },
      {
        question: "في خوارزمية LRU، أنهي صفحة بنطردها؟",
        options: [
          "أول صفحة اتحملت",
          "الصفحة اللي من زمان ما اتستخدمتش",
          "أكبر صفحة",
          "صفحة عشوائية",
        ],
        answer: 1,
        explanation: "LRU بتعتبر آخر استخدام، فالصفحة الأقدم استخداماً هي الأقل احتمالاً للاستخدام القريب.",
      },
    ],
    exercise:
      "وسّع محاكاة LRU: أضف خوارزمية FIFO وقارن عدد أخطاء الصفحات بينها وبين LRU لنفس تسلسل الإشارات.",
    terms: [
      { en: "Virtual Memory", ar: "ذاكرة افتراضية: ذاكرة وهمية بيوفرها نظام التشغيل لكل عملية." },
      { en: "Page", ar: "صفحة: وحدة ثابتة الحجم من الذاكرة الافتراضية." },
      { en: "Page Table", ar: "جدول الصفحات: بنية بتربط الصفحات الافتراضية بالإطارات الفيزيائية." },
      { en: "Page Fault", ar: "خطأ صفحة: حدث لما الصفحة المطلوبة مش موجودة في الذاكرة الفيزيائية." },
    ],
  },
  {
    id: "concurrency",
    title: "التزامن: Deadlock و Race Condition",
    titleEn: "Concurrency: Deadlock & Race Condition",
    duration: "55 دقيقة",
    description:
      "التزامن: Race Condition وDeadlock والشروط الأربعة للجمود — وهتتعلم تحمي الكود بـMutex.",
    sections: [
      {
        heading: "Race Condition",
        body: "لما أكتر من خيط يكتبوا على نفس البيانات في نفس الوقت، النتيجة بتعتمد على ترتيب التنفيذ — ده **Race Condition**.\n\nمثال كلاسيكي: خيطين بيعملوا `counter++` في نفس الوقت. العملية مش ذرية (Atomic): فهي قراءة ثم زيادة ثم كتابة. لو الاتنين قرأوا نفس القيمة، واحد بس بيتزايد.",
      },
      {
        heading: "Critical Section",
        body: "المنطقة اللي أكتر من خيط بيوصل فيها لبيانات مشتركة اسمها **المنطقة الحرجة** (Critical Section).\n\nلازم نضمن إن خيط واحد بس يدخل المنطقة الحرجة في أي وقت. ده اسمه **الاستبعاد المتبادل** (Mutual Exclusion).",
      },
      {
        heading: "Mutex",
        body: "Mutex أداة تزامن بتضمن Mutual Exclusion. الخيط بيقفل الـ Mutex قبل ما يدخل المنطقة الحرجة، وبيفك القفل بعد ما يخرج.\n\nفي C++ بنستخدم `std::mutex` مع `std::lock_guard` اللي بيقفل أوتوماتيك وبيفك القفل لما يخرج من النطاق.",
      },
      {
        heading: "Deadlock",
        body: "الجمود (Deadlock) يحصل لما خيطين يستنوا بعض: الخيط الأول ماسك Mutex الأول ومستني الثاني، والثاني ماسك الثاني ومستني الأول.\n\n**الشروط الأربعة للجمود:**\n\n1. استبعاد متبادل.\n2. المسك والانتظار.\n3. مفيش سرقة للموارد.\n4. انتظار دائري.",
      },
      {
        heading: "تجنب الجمود",
        body: "أسهل طريقة: **رتب الموارد**. كل الخيوط تقفل الـ Mutexات بنفس الترتيب، فتمنع الانتظار الدائري.\n\nتاني حاجة: استخدم `std::lock` عشان تقفل أكتر من Mutex في نفس الوقت بدون جمود. وأخيراً: قلل وقت المسك قدر الإمكان.",
      },
    ],
    code: [
      {
        title: "Race Condition مع وبدون Mutex",
        language: "cpp",
        code: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
using namespace std;

int counter = 0;
mutex mtx;

void incrementUnsafe(int iterations) {
    for (int i = 0; i < iterations; i++) {
        counter++; // عملية مش ذرية: قراءة ثم زيادة ثم كتابة
    }
}

void incrementSafe(int iterations) {
    for (int i = 0; i < iterations; i++) {
        lock_guard<mutex> lock(mtx);
        counter++;
    }
}

int main() {
    const int iterations = 100000;

    counter = 0;
    vector<thread> threads;
    for (int i = 0; i < 4; i++) {
        threads.emplace_back(incrementUnsafe, iterations);
    }
    for (auto& t : threads) {
        t.join();
    }
    cout << "بدون حماية: counter = " << counter
         << " (المتوقع " << 4 * iterations << ")" << endl;

    counter = 0;
    threads.clear();
    for (int i = 0; i < 4; i++) {
        threads.emplace_back(incrementSafe, iterations);
    }
    for (auto& t : threads) {
        t.join();
    }
    cout << "مع Mutex: counter = " << counter << endl;
    return 0;
}`,
      },
      {
        title: "تجنب Deadlock بترتيب القفل",
        language: "cpp",
        code: `#include <iostream>
#include <thread>
#include <mutex>
#include <chrono>
using namespace std;

mutex m1, m2;

int main() {
    // ترتيب قفل متسق: الخيطين بيقفلوا m1 الأول وبعدين m2
    auto worker = [](const string& name) {
        lock_guard<mutex> first(m1);
        cout << name << " قفل m1" << endl;
        this_thread::sleep_for(chrono::milliseconds(50));
        lock_guard<mutex> second(m2);
        cout << name << " قفل m2" << endl;
    };

    thread t1(worker, "خيط 1");
    thread t2(worker, "خيط 2");
    t1.join();
    t2.join();

    cout << "انتهى البرنامج بدون جمود" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المعنى الدقيق لـ Race Condition؟",
        options: [
          "سباق بين البرامج",
          "نتيجة تعتمد على ترتيب تنفيذ الخيوط على بيانات مشتركة",
          "خطأ في الذاكرة",
          "خيط سريع جداً",
        ],
        answer: 1,
        explanation: "الخيوط بتتنافس على نفس البيانات، والنتيجة بتختلف حسب ترتيب التنفيذ.",
      },
      {
        question: "إيه دور الـ Mutex؟",
        options: [
          "تسريع الخيوط",
          "ضمان دخول خيط واحد بس للمنطقة الحرجة",
          "توزيع الذاكرة",
          "إيقاف الخيوط",
        ],
        answer: 1,
        explanation: "Mutex بيضمن الاستبعاد المتبادل، فخيط واحد بس يلمس البيانات المشتركة.",
      },
      {
        question: "إيه الحل الأبسط لتجنب Deadlock؟",
        options: [
          "زيادة عدد الخيوط",
          "ترتيب قفل الموارد بشكل متسق",
          "إيقاف البرنامج",
          "تقليل الذاكرة",
        ],
        answer: 1,
        explanation: "ترتيب الموارد يمنع الانتظار الدائري، وهو أحد شروط الجمود الأربعة.",
      },
    ],
    exercise:
      "اكتب برنامجين بسيطين: واحد بيسبب Race Condition على متغير مشترك، والتاني بيحمي نفس المتغير بـMutex. قارن النتائج.",
    terms: [
      { en: "Race Condition", ar: "حالة تسابق: نتيجة البرنامج بتعتمد على ترتيب تنفيذ الخيوط على بيانات مشتركة." },
      { en: "Critical Section", ar: "منطقة حرجة: جزء من الكود بيوصل لبيانات مشتركة ولازم يتحمي." },
      { en: "Mutex", ar: "قفل استبعاد متبادل: أداة تزامن بتضمن دخول خيط واحد بس لمنطقة معينة." },
      { en: "Deadlock", ar: "جمود: حالة يستنى فيها خيطان بعض بشكل دائري من غير تقدم." },
    ],
  },
  {
    id: "syscalls",
    title: "نداءات النظام System Calls",
    titleEn: "System Calls",
    duration: "45 دقيقة",
    description:
      "نداءات النظام: إزاي البرنامج بيطلب من النواة يفتح ملف أو ينشئ عملية — مع أمثلة من C++.",
    sections: [
      {
        heading: "ما هو نداء النظام؟",
        body: "نداء النظام (System Call) آلية بتسمح لبرامج وضع المستخدم تطلب خدمات من النواة. البرامج العادية مش بتقدر تلمس الهاردوير مباشرة، فبتعمل نداء نظام.\n\nأمثلة: فتح ملف، قراءة من القرص، إنشاء عملية، وطلب ذاكرة.",
      },
      {
        heading: "وضع المستخدم ووضع النواة",
        body: "المعالج عنده وضعين:\n\n- **وضع المستخدم:** صلاحيات محدودة، والبرامج العادية بتشتغل فيه.\n- **وضع النواة:** صلاحيات كاملة، والنواة بتشتغل فيه.\n\nالنداء بيعمل انتقال من وضع المستخدم لوضع النواة، والنواة بتنفذ الخدمة وترجع النتيجة.",
      },
      {
        heading: "كيف يعمل نداء النظام؟",
        body: "الخطوات:\n\n1. البرنامج يحط رقم النداء والمعاملات في المسجلات.\n2. ينفذ تعليمة خاصة (زي `syscall` في x86-64).\n3. المعالج ينتقل لوضع النواة.\n4. النواة تنفذ الخدمة وترجع النتيجة.\n\nده بيحصل في أجزاء من الثانية، والبرنامج مش حساس بيه.",
      },
      {
        heading: "نداءات شائعة",
        body: "- `read` و`write`: قراءة وكتابة الملفات.\n- `open` و`close`: فتح وغلق الملفات.\n- `fork`: إنشاء عملية جديدة.\n- `exec`: تشغيل برنامج جديد.\n- `mmap`: تخصيص ذاكرة.\n- `wait`: انتظار عملية ابن.",
      },
      {
        heading: "من C++ للنظام",
        body: "في C++ المكتبة القياسية بتلف على نداءات النظام. مثلاً `std::ofstream` بيعمل `open` و`write` و`close` تحت الغطاء.\n\nأحياناً بنحتاج ننده نداء نظام مباشرة، زي `fork` و`exec`، وفي الحالة دي بنستخدم POSIX API.",
      },
    ],
    code: [
      {
        title: "fork وexec من C++ (Linux/macOS)",
        language: "cpp",
        code: `#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
using namespace std;

int main() {
    cout << "قبل النداء: PID الأب = " << getpid() << endl;
    pid_t pid = fork(); // نداء نظام لإنشاء عملية جديدة
    if (pid == 0) {
        cout << "العملية الابن: PID = " << getpid() << endl;
        execlp("echo", "echo", "مرحباً من العملية الابن", nullptr);
        return 0;
    } else if (pid > 0) {
        cout << "العملية الأب: PID الابن = " << pid << endl;
        wait(nullptr); // انتظار الابن
        cout << "الأب انتهى" << endl;
    } else {
        cout << "فشل fork" << endl;
    }
    return 0;
}`,
      },
      {
        title: "نداءات النظام عبر المكتبة القياسية",
        language: "cpp",
        code: `#include <iostream>
#include <fstream>
#include <cstdlib>
using namespace std;

int main() {
    // الكتابة في ملف (تحت الغطاء: نداء write)
    ofstream out("syscall_demo.txt");
    out << "بيانات من نداء write" << endl;
    out.close();

    // القراءة من ملف (تحت الغطاء: نداء read)
    ifstream in("syscall_demo.txt");
    string line;
    while (getline(in, line)) {
        cout << "قرأنا: " << line << endl;
    }
    in.close();

    // نداء نظام لعرض الملفات
    cout << "قائمة الملفات:" << endl;
#ifdef _WIN32
    int result = system("dir");
#else
    int result = system("ls");
#endif
    (void)result;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المعنى الدقيق لنداء النظام؟",
        options: [
          "نداء لدالة في C++",
          "طلب من برنامج المستخدم للنواة ينفذ خدمة",
          "رسالة بين البرامج",
          "خطأ في البرنامج",
        ],
        answer: 1,
        explanation: "نداء النظام هو الجسر بين برنامج المستخدم والنواة لتنفيذ خدمات الهاردوير.",
      },
      {
        question: "ليه البرامج مش بتتعامل مع الهاردوير مباشرة؟",
        options: [
          "عشان البرنامج يبقى أبطأ",
          "لحماية النظام واستقراره",
          "عشان مفيش سبب",
          "عشان الهاردوير غالي",
        ],
        answer: 1,
        explanation: "التعامل المباشر مع الهاردوير ممكن يسبب أعطال، فالنواة هي الوسيط الآمن.",
      },
      {
        question: "أي نداء نظام بيستخدم لإنشاء عملية جديدة؟",
        options: ["open", "fork", "read", "write"],
        answer: 1,
        explanation: "fork بتنسخ العملية الحالية وتنشئ عملية جديدة.",
      },
    ],
    exercise:
      "اكتب برنامج C++ يستخدم POSIX `fork` و`exec` لتشغيل أمر `ls` من العملية الابن، والأب يستنى الابن ويطبع \"انتهى\".",
    terms: [
      { en: "System Call", ar: "نداء نظام: آلية بتسمح لبرنامج المستخدم يطلب خدمة من النواة." },
      { en: "Kernel Mode", ar: "وضع النواة: وضع المعالج اللي بيسمح بصلاحيات كاملة على الهاردوير." },
      { en: "User Mode", ar: "وضع المستخدم: وضع المعالج العادي بصلاحيات محدودة." },
      { en: "POSIX", ar: "واجهة برمجية قياسية لأنظمة Unix بتوفر نداءات نظام زي fork وexec." },
    ],
  },
  {
    id: "os-project",
    title: "مشروع: شل بسيط (Mini Shell) بـ C++",
    titleEn: "Project: Mini Shell",
    duration: "80 دقيقة",
    description:
      "مشروع: تبني شل بسيط (Mini Shell) في C++ يقرأ الأوامر وينفذها ويدعم أوامر مدمجة زي cd وexit.",
    sections: [
      {
        heading: "تصميم الشل",
        body: "الشل (Shell) برنامج بيقرا أوامر المستخدم وينفذها. مكونات الشل البسيط:\n\n- عرض المطالبة (Prompt) زي `myshell>`.\n- قراءة سطر الأمر من المستخدم.\n- تقسيم السطر لكلمات (Tokens).\n- تنفيذ الأمر.",
      },
      {
        heading: "الأوامر المدمجة",
        body: "الشل الحقيقي عنده أوامر مدمجة (Built-ins) لازم ينفذها هو بنفسه:\n\n- `exit`: إنهاء الشل.\n- `cd`: تغيير المجلد الحالي.\n- `help`: عرض المساعدة.\n\nالأوامر التانية بتتنفذ عن طريق نظام التشغيل.",
      },
      {
        heading: "تنفيذ أوامر النظام",
        body: "لتنفيذ أمر نظام، بنركب السطر كامل وبنمره على `system()` اللي بتنادي شل النظام.\n\n`system()` بتعمل fork وexec تحت الغطاء، وبترجع حالة الإنهاء. دي طريقة سهلة لمن لا نريد تعقيد POSIX.",
      },
      {
        heading: "الخطوات التشغيلية",
        body: "الشل بيعمل في حلقة لا نهائية:\n\n1. اطبع المطالبة.\n2. اقرا السطر.\n3. قسم لكلمات.\n4. افحص الأوامر المدمجة.\n5. نفذ أمر النظام لو مفيش أمر مدمج.\n6. كرر.\n\nالحلقة بتتقفل لما المستخدم يكتب `exit`.",
      },
      {
        heading: "توسعات ممكنة",
        body: "- دعم علامات الاقتباس في الأوامر.\n- إعادة التوجيه (Redirect) زي `>` و`<`.\n- الأنابيب (Pipes) زي `|`.\n- متغيرات البيئة.\n- سجل الأوامر (History).",
      },
    ],
    code: [
      {
        title: "Mini Shell كامل",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <cstdlib>
#ifdef _WIN32
#include <direct.h>
#else
#include <unistd.h>
#endif
using namespace std;

vector<string> split(const string& line) {
    vector<string> tokens;
    stringstream ss(line);
    string token;
    while (ss >> token) {
        tokens.push_back(token);
    }
    return tokens;
}

int main() {
    string line;
    cout << "Mini Shell - اكتب 'exit' للخروج" << endl;

    while (true) {
        cout << "myshell> ";
        if (!getline(cin, line)) {
            break;
        }
        vector<string> args = split(line);
        if (args.empty()) {
            continue;
        }

        if (args[0] == "exit") {
            cout << "إلى اللقاء!" << endl;
            break;
        } else if (args[0] == "cd") {
            if (args.size() < 2) {
                cout << "الاستخدام: cd <مجلد>" << endl;
            } else {
#ifdef _WIN32
                if (_chdir(args[1].c_str()) != 0)
#else
                if (chdir(args[1].c_str()) != 0)
#endif
                {
                    cout << "مجلد غير موجود" << endl;
                }
            }
        } else if (args[0] == "help") {
            cout << "الأوامر: cd, exit, help, وأي أمر نظام" << endl;
        } else {
            // تنفيذ أمر نظام عبر شل النظام
            int result = system(line.c_str());
            (void)result;
        }
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه أول خطوة في حلقة الشل؟",
        options: ["تنفيذ الأمر", "طباعة المطالبة", "قراءة السطر", "تقسيم الكلمات"],
        answer: 1,
        explanation: "الشل بيطبع المطالبة الأول عشان يدل على إنه مستني أمرك.",
      },
      {
        question: "ليه الشل بينفذ `cd` بنفسه بدل ما ينادي شل النظام؟",
        options: [
          "عشان cd أسرع",
          "لأن cd ليه تأثير على العملية الحالية نفسها",
          "عشان cd غير موجود",
          "عشان cd أمر خطر",
        ],
        answer: 1,
        explanation: "تغيير المجلد خاص بالعملية نفسها، فلو اتنفذ في شل فرعي مش هيتأثر شلنا.",
      },
      {
        question: "إيه الوظيفة الأساسية لـ `system()`؟",
        options: [
          "عرض الملفات",
          "تنفيذ أمر في شل النظام",
          "قراءة الأوامر",
          "تقسيم النصوص",
        ],
        answer: 1,
        explanation: "system بتنادي شل النظام وتمررله الأمر، فبتنفذ زي ما لو كتبته في الطرفية.",
      },
    ],
    exercise:
      "أضف للشل أمر `history` يخزّن آخر 20 أمر ويطبعهم، وأمر `clear` يمسح الشاشة.",
    terms: [
      { en: "Shell", ar: "شل: برنامج بيقرا أوامر المستخدم وينفذها." },
      { en: "Built-in Command", ar: "أمر مدمج: أمر بينفذه الشل بنفسه بدل ما يدعو برنامج خارجي." },
      { en: "Prompt", ar: "المطالبة: النص اللي الشل بيطبعه عشان يدل على إنه مستني أمرك." },
      { en: "Pipe", ar: "أنبوب: آلية توصيل مخرج أمر كمدخل لأمر تاني." },
    ],
  },
];
