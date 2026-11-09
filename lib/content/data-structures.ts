import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "ds-intro",
    title: "ما هي هياكل البيانات؟",
    titleEn: "What are Data Structures?",
    duration: "30 دقيقة",
    description:
      "قبل ما نحفظ بيانات، لازم نعرف هنحفظها إزاي. هنا هتعرف إيه هي هياكل البيانات وليه اختيار الهيكل الصح بيفرق في سرعة البرنامج.",
    sections: [
      {
        heading: "إيه هي هياكل البيانات؟",
        body: "هيكل البيانات (Data Structure) هو **طريقة تنظيم وتخزين البيانات** في الذاكرة عشان الوصول ليها وتعديلها يكون كفاءة عالية.\n\nلأي مشكلة في البرمجة، فيه أكتر من طريقة لتنظيم البيانات. اختيار الطريقة الصح بيحدد:\n\n- **السرعة:** قد إيه بتلقى العنصر بسرعة.\n- **المساحة:** قد إيه بتستهلك ذاكرة.\n- **سهولة التعديل:** إضافة وحذف وتحديث.",
      },
      {
        heading: "ليه اختيار الهيكل مهم؟",
        body: "تخيل مكتبة: لو الكتب مرمية في الأرض، تدوّر على كتاب صعب جدًا. لو مرتبة على رفوف، تلاقيه في ثواني. لو مرتبة حسب الموضوع، تلاقي مجموعة كتب بسرعة.\n\nنفس الفكرة في البرمجة:\n\n- مصفوفة مناسبة للوصول السريع بالفهرس.\n- قائمة متصلة مناسبة للإضافة والحذف في الأول والنهاية.\n- شجرة مناسبة للبحث السريع.\n- جدول تجزئة مناسب للبحث بالمفتاح.\n\n**مش هيكل واحد يحل كل المشاكل** — ده فن اختيار الأداة الصح.",
      },
      {
        heading: "العمليات الأساسية",
        body: "أي هيكل بيانات بيحتاج يدعم العمليات دي:\n\n- **الإدراج (Insert):** إضافة عنصر جديد.\n- **الحذف (Delete):** شيل عنصر موجود.\n- **البحث (Search):** لقى عنصر معين.\n- **المرور (Traversal):** زيارة كل العناصر بالترتيب.\n- **التحديث (Update):** تعديل قيمة موجودة.\n\nكل هيكل عنده نقاط قوة وضعف في العمليات دي. هدفنا نفهمها عشان نختار صح.",
      },
      {
        heading: "أنواع هياكل البيانات",
        body: "هنتعلم أهم الأنواع:\n\n- **المصفوفة (Array):** عناصر متتالية في الذاكرة، وصول سريع بالفهرس.\n- **القائمة المتصلة (Linked List):** عقد مترابطة ببعض، مرونة في الإضافة والحذف.\n- **الكومة (Stack):** آخر واحد يدخل أول واحد يطلع (LIFO).\n- **الطابور (Queue):** أول واحد يدخل أول واحد يطلع (FIFO).\n- **الشجرة (Tree):** هيكل هرمي، زي شجرة العيلة.\n- **جدول التجزئة (Hash Table):** بحث فوري بالمفتاح.\n\nكل واحد ليه قصة، وكل واحد ليه استخدام.",
      },
    ],
    code: [
      {
        title: "أول نظرة على هياكل البيانات",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // مصفوفة: وصول سريع بالفهرس
    int arr[5] = {10, 20, 30, 40, 50};
    cout << "arr[2] = " << arr[2] << endl;

    // vector: مصفوفة ديناميكية
    vector<int> v = {10, 20, 30};
    v.push_back(40);
    cout << "الحجم: " << v.size() << endl;

    // نص: تسلسل من الحروف
    string name = "Ahmed";
    cout << "الحرف الأول: " << name[0] << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المعنى الأهم لـ \"هيكل البيانات\"؟",
        options: [
          "طريقة طباعة البيانات",
          "طريقة تنظيم وتخزين البيانات عشان الوصول والتعديل يكون كفاءة",
          "نوع من أنواع المتغيرات",
          "طريقة لتحويل البيانات لنصوص",
        ],
        answer: 1,
        explanation: "هيكل البيانات هو زي ترتيب المكتبة — الطريقة اللي بتنظم بيها البيانات.",
      },
      {
        question: "ليه مش هيكل واحد يناسب كل المشاكل؟",
        options: [
          "عشان كل هيكل له سرعة وتكلفة مختلفة في العمليات المختلفة",
          "عشان الهيكل الواحد مش بيشتغل",
          "عشان الكود يبقى أطول",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "كل هيكل عنده مزايا وعيوب، والمشكلة هي اللي تحدد الأنسب.",
      },
      {
        question: "إيه العملية اللي مش أساسية في أي هيكل بيانات؟",
        options: [
          "الإدراج",
          "الحذف",
          "الطباعة الملونة",
          "البحث",
        ],
        answer: 2,
        explanation: "الطباعة الملونة مش عملية أساسية — دي مسألة عرض مش تنظيم بيانات.",
      },
    ],
    exercise:
      "افكر في 3 مواقف من الحياة اليومية (زي مكتبة، طابور كافيتريا، دفتر تلفونات). وصف كل واحد بهيكل بيانات مناسب واكتب ليه.",
    terms: [
      { en: "Data Structure", ar: "هيكل بيانات: طريقة تنظيم وتخزين البيانات في الذاكرة." },
      { en: "Array", ar: "مصفوفة: عناصر متتالية في الذاكرة، وصول سريع بالفهرس." },
      { en: "Linked List", ar: "قائمة متصلة: عقد مترابطة ببعض، مرونة في الإضافة والحذف." },
      { en: "Hash Table", ar: "جدول تجزئة: هيكل بيانات للبحث الفوري بالمفتاح." },
    ],
  },
  {
    id: "linked-list",
    title: "القوائم المتصلة Linked List",
    titleEn: "Linked List",
    duration: "50 دقيقة",
    description:
      "بدل ما نحجز مصفوفة ثابتة، نبني سلسلة من العقد المتصلة. هنا هنكتب قائمة متصلة كاملة بإيدنا: إضافة، حذف، وطباعة.",
    sections: [
      {
        heading: "الفكرة: عقد متصلة",
        body: "القائمة المتصلة (Linked List) بتتكون من **عقد (Nodes)**، كل عقدة فيها:\n\n- **بيانات (Data):** القيمة اللي بنخزنها.\n- **مؤشر (Next):** بيشاور على العقدة اللي بعدها.\n\n```\n[10 | *] -> [20 | *] -> [30 | NULL]\n```\n\nمش شرط العقد يكونوا متتاليين في الذاكرة — كل واحد ممكن يكون في حتة مختلفة، والمؤشر هو اللي بيربطهم.",
      },
      {
        heading: "هيكل العقدة Node",
        body: "نعرف العقدة بـ `struct` بسيط:\n\n```cpp\nstruct Node {\n    int data;\n    Node* next;\n};\n```\n\n- `data` القيمة المخزنة.\n- `next` مؤشر للعقدة التالية.\n\nفي C++ تقدر تعمل constructor للعقدة عشان تهيئة القيمة:\n\n```cpp\nNode(int value) : data(value), next(nullptr) {}\n```",
      },
      {
        heading: "إضافة عنصر في الآخر",
        body: "عشان نضيف عنصر في نهاية القائمة:\n\n1. ننشئ عقدة جديدة بـ `new`.\n2. لو القائمة فاضية، نجعل `head` يشاور عليها.\n3. لو فيه عناصر، نمشي لحد آخر عقدة ونوجّه `next` بتاعها للعقدة الجديدة.\n\n```cpp\nvoid insertAtEnd(int value) {\n    Node* newNode = new Node(value);\n    if (head == nullptr) {\n        head = newNode;\n        return;\n    }\n    Node* current = head;\n    while (current->next != nullptr) {\n        current = current->next;\n    }\n    current->next = newNode;\n}\n```",
      },
      {
        heading: "الطباعة والمرور",
        body: "نمشي على القائمة من الأول لآخر عقدة:\n\n```cpp\nvoid print() const {\n    Node* current = head;\n    while (current != nullptr) {\n        cout << current->data << \" -> \";\n        current = current->next;\n    }\n    cout << \"nullptr\" << endl;\n}\n```\n\nالمؤشر `current` بيتقدّم خطوة خطوة لحد ما يوصل للنهاية.",
      },
      {
        heading: "المزايا والعيوب",
        body: "**المزايا:**\n\n- إضافة وحذف في الأول أو النهاية **O(1)** — سريع جدًا.\n- الحجم مرن — يتكبر ويصغر براحته.\n- مش محتاج مساحة متتالية في الذاكرة.\n\n**العيوب:**\n\n- الوصول لعنصر معين **O(n)** — لازم تمشي من الأول.\n- استهلاك ذاكرة إضافية للمؤشرات.\n\nاستخدم القائمة المتصلة لما يكون الإضافة والحذف المتكرر أهم من الوصول العشوائي.",
      },
    ],
    code: [
      {
        title: "قائمة متصلة بسيطة",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;

    Node(int value) : data(value), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;

public:
    LinkedList() : head(nullptr) {}

    ~LinkedList() {
        while (head != nullptr) {
            Node* temp = head;
            head = head->next;
            delete temp;
        }
    }

    void insertAtEnd(int value) {
        Node* newNode = new Node(value);
        if (head == nullptr) {
            head = newNode;
            return;
        }
        Node* current = head;
        while (current->next != nullptr) {
            current = current->next;
        }
        current->next = newNode;
    }

    void print() const {
        Node* current = head;
        while (current != nullptr) {
            cout << current->data << " -> ";
            current = current->next;
        }
        cout << "nullptr" << endl;
    }
};

int main() {
    LinkedList list;
    list.insertAtEnd(10);
    list.insertAtEnd(20);
    list.insertAtEnd(30);

    list.print();

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المكونات الأساسية للعقدة في القائمة المتصلة؟",
        options: [
          "قيمة ومؤشر للعقدة التالية",
          "قيمة واسم",
          "مؤشران بس",
          "قيمة وتاريخ",
        ],
        answer: 0,
        explanation: "كل عقدة فيها البيانات ومؤشر next للعقدة التالية.",
      },
      {
        question: "إيه ميزة القائمة المتصلة عن المصفوفة؟",
        options: [
          "الوصول العشوائي أسرع",
          "الإضافة والحذف في الأول سريع والحجم مرن",
          "الذاكرة أقل دايماً",
          "مفيش فرق",
        ],
        answer: 1,
        explanation: "القائمة المتصلة بتتفوق في الإضافة والحذف المتكرر والمرونة في الحجم.",
      },
      {
        question: "ليه الوصول لعنصر في نص القائمة بياخد O(n)؟",
        options: [
          "عشان القائمة بطيئة",
          "عشان لازم تمشي من الأول وتعد العقد لحد ما توصل",
          "عشان الذاكرة مش كافية",
          "عشان المؤشرات غلط",
        ],
        answer: 1,
        explanation: "مفيش وصول مباشر بالفهرس — لازم تعد العقد واحدة واحدة.",
      },
    ],
    exercise:
      "أضف دالة `insertAtBeginning(int value)` للقائمة المتصلة، ودالة `bool search(int value) const` بتدوّر على القيمة وترجع true لو لقتها.",
    terms: [
      { en: "Node", ar: "عقدة: وحدة بناء القائمة المتصلة، فيها بيانات ومؤشر للتالية." },
      { en: "Head", ar: "رأس: مؤشر للعقدة الأولى في القائمة." },
      { en: "Next", ar: "مؤشر التالي: المؤشر اللي بيوصل العقدة باللي بعدها." },
      { en: "Traversal", ar: "مرور: زيارة كل العناصر في هيكل البيانات بالترتيب." },
    ],
  },
  {
    id: "stack-queue",
    title: "الأكوام والطوابير Stack & Queue",
    titleEn: "Stack & Queue",
    duration: "45 دقيقة",
    description:
      "كومة أطباق وطابور كافيتريا: هياكل بسيطة بقواعد صارمة، لكنها بتsolve مشاكل معقدة في كل مكان — من المتصفح لحد أنظمة التشغيل.",
    sections: [
      {
        heading: "الـ Stack: آخر واحد يدخل أول واحد يطلع",
        body: "الكومة (Stack) شغالة بنظام **LIFO (Last In, First Out)** — زي كومة أطباق: آخر طبق بتحطه هو أول طبق بتطلّعه.\n\nالعمليات الأساسية:\n\n- **push:** إضافة عنصر على القمة.\n- **pop:** شيل عنصر من القمة.\n- **top:** شوف عنصر القمة من غير ما تشيله.\n\n```\npush(1)  -> [1]\npush(2)  -> [1, 2]\npush(3)  -> [1, 2, 3]\npop()    -> [1, 2]   (3 اتشال)\n```",
      },
      {
        heading: "تطبيق الـ Stack",
        body: "أسهل طريقة تطبق بيها الـ Stack هي بـ `vector`:\n\n```cpp\nclass Stack {\n    vector<int> data;\npublic:\n    void push(int value) { data.push_back(value); }\n    void pop() { if (!data.empty()) data.pop_back(); }\n    int top() const { return data.back(); }\n    bool empty() const { return data.empty(); }\n};\n```\n\n- `push_back` إضافة في النهاية.\n- `pop_back` حذف من النهاية.\n- `back` رؤية آخر عنصر.\n\nكلهم عمليات **O(1)** — سريعة جدًا.",
      },
      {
        heading: "الـ Queue: أول واحد يدخل أول واحد يطلع",
        body: "الطابور (Queue) شغالة بنظام **FIFO (First In, First Out)** — زي طابور الكافيتريا: أول واحد يفضل أول واحد يتقدم.\n\nالعمليات الأساسية:\n\n- **enqueue:** إضافة عنصر في المؤخرة.\n- **dequeue:** شيل عنصر من المقدمة.\n- **front:** شوف عنصر المقدمة.\n\n```\nenqueue(1) -> [1]\nenqueue(2) -> [1, 2]\nenqueue(3) -> [1, 2, 3]\ndequeue() -> [2, 3]   (1 اتشال)\n```",
      },
      {
        heading: "تطبيق الـ Queue",
        body: "نحتاج مؤشر `frontIndex` عشان نعرف مكان العنصر الأول، ومؤخرة الـ vector للإضافة:\n\n```cpp\nclass Queue {\n    vector<int> data;\n    int frontIndex = 0;\npublic:\n    void enqueue(int value) { data.push_back(value); }\n    void dequeue() {\n        if (frontIndex < data.size()) frontIndex++;\n    }\n    int front() const { return data[frontIndex]; }\n    bool empty() const { return frontIndex >= data.size(); }\n};\n```\n\n**ملاحظة:** في التطبيقات الحقيقية، استخدم `queue` من المكتبة القياسية — أحسن وأضمن.",
      },
      {
        heading: "تطبيقات في الحياة الحقيقية",
        body: "- **Stack:** زرار الرجوع في المتصفح (آخر صفحة زرتها أول صفحة ترجع ليها)، وتقييم العمليات الرياضية، وUndo في البرامج.\n- **Queue:** إدارة المهام في الطابعة، ومعالجة الطلبات في السيرفرات، وBFS في الخوارزميات.\n\nفهم الفرق بينهم أساسي في أي مقابلة تقنية.",
      },
    ],
    code: [
      {
        title: "Stack و Queue في مثال واحد",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

class Stack {
private:
    vector<int> data;

public:
    void push(int value) { data.push_back(value); }
    void pop() {
        if (!data.empty()) data.pop_back();
    }
    int top() const { return data.back(); }
    bool empty() const { return data.empty(); }
    int size() const { return data.size(); }
};

class Queue {
private:
    vector<int> data;
    int frontIndex;

public:
    Queue() : frontIndex(0) {}
    void enqueue(int value) { data.push_back(value); }
    void dequeue() {
        if (frontIndex < data.size()) frontIndex++;
    }
    int front() const { return data[frontIndex]; }
    bool empty() const { return frontIndex >= data.size(); }
};

int main() {
    Stack s;
    s.push(1);
    s.push(2);
    s.push(3);
    cout << "Top: " << s.top() << endl;
    s.pop();
    cout << "Top بعد pop: " << s.top() << endl;

    Queue q;
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    cout << "Front: " << q.front() << endl;
    q.dequeue();
    cout << "Front بعد dequeue: " << q.front() << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه نظام الشغل بتاع الـ Stack؟",
        options: [
          "أول واحد يدخل أول واحد يطلع",
          "آخر واحد يدخل أول واحد يطلع",
          "Random access",
          "ترتيب أبجدي",
        ],
        answer: 1,
        explanation: "LIFO — زي كومة الأطباق.",
      },
      {
        question: "إيه نظام الشغل بتاع الـ Queue؟",
        options: [
          "آخر واحد يدخل أول واحد يطلع",
          "أول واحد يدخل أول واحد يطلع",
          "أول واحد يدخل آخر واحد يطلع",
          "بدون ترتيب",
        ],
        answer: 1,
        explanation: "FIFO — زي طابور الكافيتريا.",
      },
      {
        question: "إيه التطبيق الشهير للـ Stack؟",
        options: [
          "إدارة الطابعة",
          "زرار الرجوع في المتصفح (Undo / Back)",
          "البحث في قاعدة بيانات",
          "عرض الفيديو",
        ],
        answer: 1,
        explanation: "آخر صفحة زرتها هي أول صفحة ترجع ليها — LIFO.",
      },
    ],
    exercise:
      "استخدم Stack لكتابة برنامج يفحص الأقواس في نص: `([])` متوازن، `([)]` مش متوازن. حط القوس المفتوح جوه الـ stack، ولو قابلت قوس مقفول شيله. لو الـ stack فاضي في الآخر، يبقى متوازن.",
    terms: [
      { en: "Stack", ar: "كومة: هيكل بيانات بنظام LIFO — آخر عنصر يدخل أول عنصر يطلع." },
      { en: "Queue", ar: "طابور: هيكل بيانات بنظام FIFO — أول عنصر يدخل أول عنصر يطلع." },
      { en: "LIFO", ar: "آخر داخل أول خارج: نظام الشغل بتاع الـ Stack." },
      { en: "FIFO", ar: "أول داخل أول خارج: نظام الشغل بتاع الـ Queue." },
    ],
  },
  {
    id: "trees",
    title: "الأشجار و Binary Search Tree",
    titleEn: "Trees & BST",
    duration: "55 دقيقة",
    description:
      "من شجرة العيلة لحد فهرسة قواعد البيانات: الأشجار من أقوى هياكل البيانات. هنا هنبني شجرة بحث ثنائية بإيدنا.",
    sections: [
      {
        heading: "الشجرة: مفهوم",
        body: "الشجرة (Tree) هيكل بيانات **هرمي** — مش خطي زي المصفوفات والقوائم. بتتكون من **عقد (Nodes)** مرتبطة ببعضها بعلاقة أب-ابن.\n\nمصطلحات أساسية:\n\n- **الجذر (Root):** العقدة الأولى، من غير أب.\n- **الابن (Child):** عقدة تحت عقدة تانية.\n- **الأب (Parent):** العقدة اللي فوق.\n- **الورقة (Leaf):** عقدة مالهاش أبناء.\n- **العمق (Depth):** عدد الخطوات من الجذر.\n\n```\n      50        <- الجذر\n     /  \\\n   30    70      <- أبناء\n  /  \\\n20    40          <- أوراق\n```",
      },
      {
        heading: "الشجرة الثنائية Binary Tree",
        body: "الشجرة الثنائية (Binary Tree) هي شجرة كل عقدة فيها **أكتر من ابنين بس**: ابن شمال (Left) وابن يمين (Right).\n\n```cpp\nstruct TreeNode {\n    int value;\n    TreeNode* left;\n    TreeNode* right;\n};\n```\n\n- `left` — الابن الشمالي.\n- `right` — الابن اليماني.\n\nالشجرة الثنائية هي الأساس للـ Binary Search Tree.",
      },
      {
        heading: "شجرة البحث الثنائية BST",
        body: "شجرة البحث الثنائية (Binary Search Tree) شجرة ثنائية بقاعدة ذهبية:\n\n**لكل عقدة، كل القيم في الشمال أصغر منها، وكل القيم في اليمين أكبر منها.**\n\n```\n      50\n     /  \\\n   30    70     (30 < 50 و 70 > 50)\n  /  \\\n20    40\n```\n\nالقاعدة دي بتخلي البحث سريع جدًا: في كل خطوة ننص عدد العقد اللي هنفحصها.",
      },
      {
        heading: "البحث في BST",
        body: "خوارزمية البحث:\n\n1. ابدأ من الجذر.\n2. لو القيمة تساوي القيمة اللي بتدور عليها، خلاص.\n3. لو أصغر، روح للشمال.\n4. لو أكبر، روح لليمين.\n5. لو وصلت لنهاية (nullptr)، القيمة مش موجودة.\n\n```cpp\nbool search(TreeNode* node, int value) const {\n    if (node == nullptr) return false;\n    if (value == node->value) return true;\n    if (value < node->value) return search(node->left, value);\n    return search(node->right, value);\n}\n```",
      },
      {
        heading: "المرور على الشجرة Traversal",
        body: "في طرق كتير نمر بيها على الشجرة:\n\n- **Inorder (ترتيب داخلي):** شمال -> أب -> يمين. بيعطي القيم **مرتبة تصاعديًا** في الـ BST.\n- **Preorder (قبل):** أب -> شمال -> يمين. مفيد لنسخ الشجرة.\n- **Postorder (بعد):** شمال -> يمين -> أب. مفيد للحذف.\n\n```cpp\nvoid inorder(TreeNode* node) const {\n    if (node == nullptr) return;\n    inorder(node->left);\n    cout << node->value << \" \";\n    inorder(node->right);\n}\n```",
      },
    ],
    code: [
      {
        title: "شجرة بحث ثنائية كاملة",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

class BST {
private:
    TreeNode* root;

    TreeNode* insertNode(TreeNode* node, int value) {
        if (node == nullptr) return new TreeNode(value);
        if (value < node->value) {
            node->left = insertNode(node->left, value);
        } else if (value > node->value) {
            node->right = insertNode(node->right, value);
        }
        return node;
    }

    bool searchNode(TreeNode* node, int value) const {
        if (node == nullptr) return false;
        if (value == node->value) return true;
        if (value < node->value) return searchNode(node->left, value);
        return searchNode(node->right, value);
    }

    void inorder(TreeNode* node) const {
        if (node == nullptr) return;
        inorder(node->left);
        cout << node->value << " ";
        inorder(node->right);
    }

    void destroy(TreeNode* node) {
        if (node == nullptr) return;
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

public:
    BST() : root(nullptr) {}

    ~BST() {
        destroy(root);
    }

    void insert(int value) {
        root = insertNode(root, value);
    }

    bool search(int value) const {
        return searchNode(root, value);
    }

    void printInorder() const {
        inorder(root);
        cout << endl;
    }
};

int main() {
    BST tree;
    tree.insert(50);
    tree.insert(30);
    tree.insert(70);
    tree.insert(20);
    tree.insert(40);

    cout << "العناصر مرتبة: ";
    tree.printInorder();

    cout << "بحث عن 40: " << tree.search(40) << endl;
    cout << "بحث عن 100: " << tree.search(100) << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه القاعدة الأساسية في شجرة البحث الثنائية (BST)؟",
        options: [
          "كل القيم في الشمال أصغر من العقدة واليمين أكبر منها",
          "كل القيم مرتبة أبجديًا",
          "كل عقدة ليها 3 أبناء",
          "الجذر دايمًا أصغر قيمة",
        ],
        answer: 0,
        explanation: "القاعدة دي بتجعل البحث سريع — في كل خطوة ننص الشجرة.",
      },
      {
        question: "إيه نوع المرور اللي بيعطي القيم مرتبة تصاعديًا في BST؟",
        options: ["Preorder", "Postorder", "Inorder", "Level order"],
        answer: 2,
        explanation: "Inorder (شمال -> أب -> يمين) بيمر على القيم بترتيب تصاعدي.",
      },
      {
        question: "ليه البحث في BST سريع نظريًا؟",
        options: [
          "عشان الشجرة مرتبة",
          "عشان في كل خطوة ننص عدد العقد اللي هنفحصها — O(log n)",
          "عشان الشجرة دايماً متوازنة",
          "عشان كل عقدة ليها ابن واحد",
        ],
        answer: 1,
        explanation: "الشجرة المتوازنة بتقلل الخطوات للوغاريتم — سريع جدًا.",
      },
    ],
    exercise:
      "أضف دالة `int findMin() const` ترجع أصغر قيمة في الشجرة (أقصى شمال)، ودالة `int countNodes() const` ترجع عدد العقد. اختبرهم مع الشجرة في المثال.",
    terms: [
      { en: "Tree", ar: "شجرة: هيكل بيانات هرمي من عقد مرتبطة بعلاقة أب-ابن." },
      { en: "Root", ar: "جذر: العقدة الأولى في الشجرة من غير أب." },
      { en: "Binary Search Tree", ar: "شجرة بحث ثنائية: شجرة كل عقدة فيها أصغر في الشمال وأكبر في اليمين." },
      { en: "Inorder Traversal", ar: "مرور داخلي: زيارة الشجرة شمال-أب-يمين وبتعطي ترتيب تصاعدي." },
    ],
  },
  {
    id: "hash-table",
    title: "جداول التجزئة Hash Table",
    titleEn: "Hash Table",
    duration: "50 دقيقة",
    description:
      "من قاعدة البيانات لحد قوائم التشغيل: جداول التجزئة بتخليك توصل لأي حاجة في ثانية معدودة. هنا هنبني واحد بإيدنا.",
    sections: [
      {
        heading: "الفكرة: من المفتاح للعنوان",
        body: "جدول التجزئة (Hash Table) بيوصل من **المفتاح (Key)** للمكان مباشرة من غير ما يدوّر على كل عنصر. السر هو **دالة التجزئة (Hash Function)**.\n\n```\n\"apple\"  ->  hash()  ->  3  ->  المكان رقم 3\n```\n\n- المفتاح: الكلمة أو الاسم.\n- دالة التجزئة: بتحوّل المفتاح لرقم.\n- الرقم: فهرس في مصفوفة.\n\nالنتيجة: وصول **O(1)** في المتوسط — يعني في ثانية واحدة بالظبط بغض النظر عن الحجم.",
      },
      {
        heading: "دالة التجزئة Hash Function",
        body: "دالة التجزئة بتحوّل أي مفتاح لرقم (فهارس). لازم تكون:\n\n- **سريعة:** بتحسب بسرعة.\n- **موزعة:** بتوزع المفاتيح على كل الأماكن مش تكدسهم في حتة واحدة.\n- **ثابتة:** نفس المفتاح دايمًا بيطلع نفس الرقم.\n\nمثال بسيط لمفتاح نص:\n\n```cpp\nint hashFunction(const string& key) const {\n    int hash = 0;\n    for (char c : key) {\n        hash += c;\n    }\n    return hash % SIZE;\n}\n```\n\nالمجموع بيتحسب من قيم الحروف، و`% SIZE` عشان الرقم يبقى جوه حدود المصفوفة.",
      },
      {
        heading: "التصادمات Collisions",
        body: "أحيانًا مفتاحين مختلفين بيطلعوا **نفس الرقم** — وده اسمه **تصادم (Collision)**. لازم نحله، وإلا هنضيّع بيانات.\n\nأشهر الحلول:\n\n- **Linear Probing:** لو المكان مشغول، جرّب اللي بعده، وبعدين اللي بعده.\n- **Chaining:** كل مكان فيه قايمة مرتبطة بالعناصر اللي اتشالت عليه.\n\n```cpp\nindex = (index + 1) % SIZE;   // Linear Probing\n```\n\n- **إعادة التجزئة (Rehashing):** لو الجدول تملى، نكبره ونعيد توزيع العناصر.",
      },
      {
        heading: "التطبيق: إدراج وبحث",
        body: "الجدول عنده:\n\n- مصفوفة `table` لتخزين الأزواج.\n- مصفوفة `occupied` لمعرفة الأماكن المشغولة.\n\n**الإدراج:** نحسب الهاش، ولو المكان مشغول ندوّر على اللي بعده لحد ما نلاقي مكان فاضي.\n\n**البحث:** نحسب الهاش، ونمشي لحد ما نلاقي المفتاح أو مكان فاضي (يبقى مش موجود).\n\n```cpp\nint search(const string& key) const {\n    int index = hashFunction(key);\n    int start = index;\n    while (occupied[index]) {\n        if (table[index].first == key) return table[index].second;\n        index = (index + 1) % SIZE;\n        if (index == start) break;\n    }\n    return -1;\n}\n```",
      },
      {
        heading: "المزايا والعيوب",
        body: "**المزايا:**\n\n- وصول وإضافة وحذف **O(1)** في المتوسط.\n- مثالي للبحث بالمفتاح (قواعد بيانات، قواميس).\n\n**العيوب:**\n\n- مفيش ترتيب للعناصر.\n- التصادمات ممكن تبطئ الأداء لو الدالة ضعيفة.\n- الحجم لازم يكون مناسب — صغير يخلص بسرعة، وكبير يضيع ذاكرة.",
      },
    ],
    code: [
      {
        title: "جدول تجزئة بـ Linear Probing",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class HashTable {
private:
    static const int SIZE = 10;
    vector<pair<string, int>> table;
    vector<bool> occupied;

    int hashFunction(const string& key) const {
        int hash = 0;
        for (char c : key) {
            hash += c;
        }
        return hash % SIZE;
    }

public:
    HashTable() : table(SIZE), occupied(SIZE, false) {}

    void insert(const string& key, int value) {
        int index = hashFunction(key);
        while (occupied[index]) {
            if (table[index].first == key) {
                table[index].second = value;
                return;
            }
            index = (index + 1) % SIZE;   // Linear Probing
        }
        table[index] = {key, value};
        occupied[index] = true;
    }

    int search(const string& key) const {
        int index = hashFunction(key);
        int start = index;
        while (occupied[index]) {
            if (table[index].first == key) {
                return table[index].second;
            }
            index = (index + 1) % SIZE;
            if (index == start) break;
        }
        return -1;   // مش موجود
    }

    void print() const {
        for (int i = 0; i < SIZE; i++) {
            cout << "[" << i << "] ";
            if (occupied[i]) {
                cout << table[i].first << " = " << table[i].second;
            } else {
                cout << "فاضي";
            }
            cout << endl;
        }
    }
};

int main() {
    HashTable ht;
    ht.insert("apple", 100);
    ht.insert("banana", 200);
    ht.insert("cherry", 300);

    cout << "apple = " << ht.search("apple") << endl;
    cout << "banana = " << ht.search("banana") << endl;
    cout << "grape = " << ht.search("grape") << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه السر في سرعة جدول التجزئة؟",
        options: [
          "دالة التجزئة بتحول المفتاح لفهرس مباشر في المصفوفة",
          "المصفوفة مرتبة",
          "العناصر قليلة دايمًا",
          "بنستخدم حلقات كتير",
        ],
        answer: 0,
        explanation: "دالة التجزئة بتوصل من المفتاح للمكان مباشرة من غير بحث.",
      },
      {
        question: "إيه المقصود بالتصادم (Collision)؟",
        options: [
          "مفتاحين بيطلعوا نفس الفهرس",
          "مفتاح مش موجود",
          "مصفوفة فاضية",
          "دالة تجزئة بطيئة",
        ],
        answer: 0,
        explanation: "التصادم بيحصل لما مفاتيح مختلفة توصل لنفس المكان.",
      },
      {
        question: "إيه الحل بتاع Linear Probing؟",
        options: [
          "شيل العنصر القديم",
          "لو المكان مشغول، جرّب المكان اللي بعده",
          "زود حجم المصفوفة فورًا",
          "استخدم قايمة مرتبطة",
        ],
        answer: 1,
        explanation: "بنمشي خطوة خطوة لحد ما نلاقي مكان فاضي.",
      },
    ],
    exercise:
      "أضف دالة `bool remove(const string& key)` لجدول التجزئة. لما تمسح عنصر، ممنوع تعمله فاضي عادي (عشان البحث هيكسر) — استخدم علامة \"محذوف\" بدلًا من المسح الكامل.",
    terms: [
      { en: "Hash Table", ar: "جدول تجزئة: هيكل بيانات بيوصل من المفتاح للمكان مباشرة." },
      { en: "Hash Function", ar: "دالة تجزئة: بتحوّل المفتاح لرقم فهرس في المصفوفة." },
      { en: "Collision", ar: "تصادم: لما مفتاحين مختلفين يوصلوا لنفس الفهرس." },
      { en: "Linear Probing", ar: "بحث خطي: حل للتصادم بالمحاولة في المكان اللي بعده." },
    ],
  },
  {
    id: "stl",
    title: "المكتبة القياسية STL: vector و map",
    titleEn: "STL: vector & map",
    duration: "50 دقيقة",
    description:
      "مش لازم نبني كل حاجة بإيدنا. المكتبة القياسية فيها هياكل بيانات جاهزة ومختبرة: vector و map و غيرهم. هنا هنعرف نستخدمهم باحتراف.",
    sections: [
      {
        heading: "إيه هو الـ STL؟",
        body: "المكتبة القياسية (Standard Template Library - STL) هي مجموعة **هياكل بيانات وخوارزميات جاهزة** في C++، مختبرة جيدًا ومحسّنة جدًا.\n\nأهم الحاجات اللي فيها:\n\n- **الحاويات (Containers):** vector, map, set, stack, queue.\n- **الخوارزميات (Algorithms):** sort, find, binary_search.\n- **المكررات (Iterators):** طرق المرور على العناصر.\n\nاستخدام الـ STL بيوفر وقتك وبيضمن جودة أعلى — **دايمًا استخدم الجاهز قبل ما تبني بنفسك**.",
      },
      {
        heading: "vector: المصفوفة الديناميكية",
        body: "`vector` هي مصفوفة بتتوسع تلقائيًا لما تملي. بتستهلك ذاكرة متتالية، فالوصول بالفهرس سريع جدًا.\n\n```cpp\nvector<int> v = {1, 2, 3};\nv.push_back(4);        // إضافة في النهاية\nv.pop_back();         // حذف من النهاية\nv.size();             // الحجم\nv[0];                 // الوصول بالفهرس\n```\n\n**متى تستخدمها؟** لما يكون الوصول العشوائي بالفهرس هو الأهم.",
      },
      {
        heading: "map: الأزواج المفتاح/قيمة",
        body: "`map` هيكل بيانات من **أزواج مفتاح/قيمة (Key-Value Pairs)**. المفتاح فريد، والترتيب حسب المفتاح.\n\n```cpp\nmap<string, int> ages;\nages[\"أحمد\"] = 25;    // إضافة أو تحديث\nages[\"سارة\"] = 30;\n\ncout << ages[\"أحمد\"] << endl;   // 25\n```\n\n- البحث بالمفتاح **O(log n)**.\n- الترتيب تلقائي حسب المفتاح.\n- إضافة مفتاح جديد بيتحط في مكانه الصح.\n\n**متى تستخدمها؟** لما يكون البحث بالمفتاح هو الأهم.",
      },
      {
        heading: "string و set: بسرعة",
        body: "- **string:** نص ديناميكي فيه دوال جاهزة:\n\n```cpp\nstring s = \"hello\";\ns.length();          // 5\ns += \" world\";      // دمج\ns.substr(0, 5);      // \"hello\"\n```\n\n- **set:** مجموعة من العناصر الفريدة المرتبة:\n\n```cpp\nset<int> nums = {3, 1, 4, 1, 5};\n// الناتج: 1, 3, 4, 5 (مفيش تكرار)\n```\n\n**متى تستخدم set؟** لما تكون مهم إن العناصر فريدة ومرتبة.",
      },
      {
        heading: "ليه نستخدم الجاهز؟",
        body: "1. **موثوق:** مختبر من ملايين المبرمجين في كل حتة.\n2. **سريع:** محسّن من أفضل المهندسين في العالم.\n3. **واضح:** اسم `vector` و`map` بيوضح النية من غير ما تشرح.\n4. **موفر:** وقتك وجهدك — ركّز في المشكلة مش في البنية التحتية.\n\n**استثناء:** في التعلم أو المقابلات، أحيانًا بنسأل تبني الهيكل بإيدك عشان نتأكد إنك فاهم.",
      },
    ],
    code: [
      {
        title: "vector و map في العمل",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    // vector: مصفوفة ديناميكية
    vector<int> numbers = {3, 1, 4, 1, 5};
    numbers.push_back(9);

    cout << "vector: ";
    for (int n : numbers) {
        cout << n << " ";
    }
    cout << endl;

    sort(numbers.begin(), numbers.end());
    cout << "بعد الترتيب: ";
    for (int n : numbers) {
        cout << n << " ";
    }
    cout << endl;

    // map: أزواج مفتاح/قيمة
    map<string, int> ages;
    ages["أحمد"] = 25;
    ages["سارة"] = 30;

    cout << "عمر أحمد: " << ages["أحمد"] << endl;

    // المرور على الـ map
    for (const auto& pair : ages) {
        cout << pair.first << " - " << pair.second << endl;
    }

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق الأساسي بين vector و map؟",
        options: [
          "vector للبحث بالمفتاح و map للوصول بالفهرس",
          "vector للوصول بالفهرس و map للبحث بالمفتاح",
          "مفيش فرق",
          "vector أسرع دايماً",
        ],
        answer: 1,
        explanation: "vector وصولها بالفهرس، وmap بحثها بالمفتاح وقيمتها مرتبة.",
      },
      {
        question: "إيه نتيجة `set<int> nums = {3, 1, 4, 1, 5};`؟",
        options: [
          "1, 1, 3, 4, 5",
          "1, 3, 4, 5",
          "3, 1, 4, 1, 5",
          "5, 4, 3, 1",
        ],
        answer: 1,
        explanation: "الـ set بتحذف التكرار وبترتب — فالناتج 1, 3, 4, 5.",
      },
      {
        question: "ليه بنستخدم حاويات الـ STL بدل ما نبني بإيدنا؟",
        options: [
          "عشان الكود يبقى أطول",
          "عشانها موثوقة ومحسّنة وموفر للوقت",
          "عشانها أبطأ",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "STL مختبرة ومحسّنة من ملايين المبرمجين — استخدمها ووفر وقتك.",
      },
    ],
    exercise:
      "اكتب برنامج يخزّن درجات الطلاب في `map<string, vector<int>>` — الاسم كمفتاح والدرجات كـ vector. أضف 3 طلاب بدرجاتهم، واحسب متوسط كل طالب.",
    terms: [
      { en: "STL", ar: "المكتبة القياسية: مجموعة هياكل بيانات وخوارزميات جاهزة في C++." },
      { en: "vector", ar: "مصفوفة ديناميكية: بتملي وتنقص تلقائيًا." },
      { en: "map", ar: "خريطة: أزواج مفتاح/قيمة مرتبة حسب المفتاح." },
      { en: "set", ar: "مجموعة: عناصر فريدة مرتبة." },
    ],
  },
  {
    id: "complexity-intro",
    title: "مقدمة في تعقيد الخوارزميات Big-O",
    titleEn: "Intro to Big-O",
    duration: "40 دقيقة",
    description:
      "إزاي نقيس كفاءة الكود؟ هنا هنتعلم لغة الـ Big-O: زي ما بنقول \"البرنامج ده سريع\"، بنقول كمان \"سريعبأ O(log n)\".",
    sections: [
      {
        heading: "إيه هو تعقيد الوقت؟",
        body: "تعقيد الوقت (Time Complexity) بيقيس **إزاي وقت البرنامج بيتزايد مع زيادة حجم المدخلات**. مش بنقيس بالثواني — لأن الأجهزة مختلفة — لكن بنقيس **عدد العمليات**.\n\nمثال: لو برنامج بيعد على 10 عناصر بعرف 10 عمليات، وعلى 100 عنصر بعرف 100 عملية — التعقيد **O(n)**.",
      },
      {
        heading: "رموز Big-O",
        body: "بنستخدم رموز Big-O عشان نوصف النمو:\n\n- **O(1):** زمن ثابت — مش بتغير مع الحجم.\n- **O(log n):** لوغاريتمي — كل خطوة تنص الشغل.\n- **O(n):** خطي — الشغل بيزيد بنفس معدل الحجم.\n- **O(n²):** تربيعي — الشغل بيزيد بمربع الحجم.\n- **O(2ⁿ):** أسي — كارثي، بيتضاعف مع كل عنصر.\n\n```\nO(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)\n```",
      },
      {
        heading: "أمثلة عملية",
        body: "**O(1) — الوصول بالهاش:**\n\n```cpp\nint x = arr[5];   // مباشرة\n```\n\n**O(n) — البحث الخطي:**\n\n```cpp\nfor (int i = 0; i < n; i++) {\n    if (arr[i] == target) return i;   // أسوأ حالة n خطوة\n}\n```\n\n**O(log n) — البحث الثنائي:**\n\n```cpp\n// كل خطوة تنص النطاق\nwhile (left <= right) {\n    int mid = left + (right - left) / 2;\n    ...\n}\n```\n\n**O(n²) — حلقتين متداخلتين:**\n\n```cpp\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        // شغل\n```",
      },
      {
        heading: "إزاي تحسب التعقيد؟",
        body: "1. عدّ عدد العمليات الأساسية.\n2. اهمل الثوابت (O(2n) = O(n)).\n3. اهمل الحدود الأصغر (O(n² + n) = O(n²)).\n4. ركز على أسوأ حالة (Worst Case).\n\n**مثال:**\n\n```cpp\nfor (int i = 0; i < n; i++) {      // n مرة\n    for (int j = 0; j < n; j++) {  // n مرة\n        cout << i * j << endl;     // O(1)\n    }\n}\n```\n\nالإجمالي: n × n × 1 = **O(n²)**.",
      },
      {
        heading: "ليه ده مهم؟",
        body: "- **في المقابلات:** أسئلة Big-O من أكثر الأسئلة شيوعًا.\n- **في الشغل:** اختيار الخوارزمية الصح بيوفر ملايين في السيرفرات.\n- **في التعلم:** بيفهمك ليه هيكل بيانات أحسن من التاني لمشكلة معينة.\n\nنصيحة: دايمًا اسأل نفسك \"إيه أسوأ حالة؟\" و\"إيه أحسن خوارزمية ممكنة؟\".",
      },
    ],
    code: [
      {
        title: "البحث الخطي مقابل الثنائي",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};

    cout << "بحث خطي عن 7: " << linearSearch(arr, 7) << endl;
    cout << "بحث ثنائي عن 7: " << binarySearch(arr, 7) << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه معنى O(1)؟",
        options: [
          "الزمن بيزيد مع الحجم",
          "الزمن ثابت مش بيتغير مع حجم المدخلات",
          "الزمن بيزيد تربيعيًا",
          "الزمن لوغاريتمي",
        ],
        answer: 1,
        explanation: "O(1) زمن ثابت — زي الوصول لفهرس في مصفوفة.",
      },
      {
        question: "إيه تعقيد حلقتين متداخللتين على n عنصر؟",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        answer: 2,
        explanation: "n × n = n² — تعقيد تربيعي.",
      },
      {
        question: "ليه بنركز على أسوأ حالة (Worst Case)؟",
        options: [
          "عشان البرنامج يبقى أبطأ",
          "عشان نضمن إن الأداء مش هيقل عن الحد ده في أي مدخلات",
          "عشان الكود يبقى أطول",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "أسوأ حالة بتعطي ضمان — مش هنبالغ في تقدير الأداء.",
      },
    ],
    exercise:
      "احسب تعقيد الوقت للكود التالي: 3 حلقات for متداخلة على n عنصر. بعدين احسب تعقيد بحث خطي على مصفوفة من n عنصر وبحث ثنائي على نفس المصفوفة.",
    terms: [
      { en: "Big-O", ar: "رمز بيصف نمو وقت الخوارزمية مع حجم المدخلات." },
      { en: "Time Complexity", ar: "تعقيد الوقت: قياس عدد العمليات حسب حجم المدخلات." },
      { en: "O(n)", ar: "تعقيد خطي: الوقت بيزيد بنفس معدل الحجم." },
      { en: "Worst Case", ar: "أسوأ حالة: أقصى وقت ممكن للخوارزمية مع أي مدخلات." },
    ],
  },
  {
    id: "ds-project",
    title: "مشروع: قاموس كلمات باستخدام Hash Table",
    titleEn: "Project: Word Dictionary",
    duration: "70 دقيقة",
    description:
      "هنا هنجمع كل حاجة: جدول تجزئة، نصوص، وقوائم. هنبني قاموس كلمات إنجليزي-عربي يدوّر ويترجم في ثانية معدودة.",
    sections: [
      {
        heading: "تخطيط المشروع",
        body: "المشروع ببساطة: قاموس بيحفظ **كلمة (مفتاح)** و**معناها (قيمة)**، ويقدر يدوّر على الكلمة ويرجع المعنى.\n\n- **الهيكل:** Hash Table بحجم ثابت.\n- **دالة التجزئة:** بتجمع قيم الحروف ونضيف `hash * 31 + c` لتحسين التوزيع.\n- **التصادمات:** Linear Probing — لو المكان مشغول، جرّب اللي بعده.\n\nالقاموس هيشتغل في **O(1)** في المتوسط — أسرع بكتير من الدوران على قايمة.",
      },
      {
        heading: "الصنف Dictionary",
        body: "الخصائص:\n\n- `table` — مصفوفة من الأزواج `pair<string, string>`.\n- `occupied` — علامات الأماكن المشغولة.\n\nالدوال:\n\n- `addWord(word, meaning)` — يضيف أو يحدّث كلمة.\n- `search(word)` — يرجع المعنى أو \"الكلمة غير موجودة\".\n- `printAll()` — يطبع كل الكلمات.",
      },
      {
        heading: "دالة التجزئة المحسّنة",
        body: "بدل ما نجمع قيم الحروف بس، بنستخدم المعادلة الشهيرة:\n\n```cpp\nhash = hash * 31 + c;\n```\n\nالرقم 31 عدد أولي بيوزع القيم بشكل أحسن — ده نفس اللي بيستخدمه Java في `String.hashCode()`. بعد كده `% SIZE` عشان الرقم يبقى جوه الحدود.",
      },
      {
        heading: "الإضافة والبحث",
        body: "**الإضافة:** نحسب الهاش، ونمشي لحد ما نلاقي مكان فاضي أو مفتاح موجود (تحديث).\n\n**البحث:** نحسب الهاش، ونمشي لحد ما نلاقي المفتاح أو مكان فاضي (يبقى مش موجود).\n\n```cpp\nstring search(const string& word) const {\n    int index = hashFunction(word);\n    int start = index;\n    while (occupied[index]) {\n        if (table[index].first == word) return table[index].second;\n        index = (index + 1) % SIZE;\n        if (index == start) break;\n    }\n    return \"الكلمة غير موجودة\";\n}\n```",
      },
      {
        heading: "اختبار القاموس",
        body: "في `main`، هنضيف 5 كلمات، ندوّر على 3 منهم (واحدة مش موجودة)، ونطبع كل القاموس. شغّل الكود بنفسك وجرّب:\n\n- إضافة كلمة جديدة.\n- البحث عن كلمة موجودة.\n- البحث عن كلمة مش موجودة.\n\nلاحظ السرعة: في ثانية واحدة بالظبط.",
      },
      {
        heading: "تحسينات ممكنة",
        body: "- **توسيع تلقائي:** لو نسبة الامتلاء عدّت 70%، نكبر الجدول ونعيد توزيع العناصر.\n- **حذف الكلمات:** بعلامة \"محذوف\" بدل المسح الكامل.\n- **واجهة مستخدم:** قايمة خيارات تفاعلية.\n- **حفظ في ملف:** نحفظ القاموس ونرجع نقراه عند التشغيل (هنتعلمه قريبًا).\n\nكل تحسين بيفتح باب لتطبيق مبدأ جديد.",
      },
    ],
    code: [
      {
        title: "قاموس كلمات كامل",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Dictionary {
private:
    static const int SIZE = 50;
    vector<pair<string, string>> table;
    vector<bool> occupied;

    int hashFunction(const string& word) const {
        int hash = 0;
        for (char c : word) {
            hash = hash * 31 + c;
        }
        return hash % SIZE;
    }

public:
    Dictionary() : table(SIZE), occupied(SIZE, false) {}

    void addWord(const string& word, const string& meaning) {
        int index = hashFunction(word);
        while (occupied[index]) {
            if (table[index].first == word) {
                table[index].second = meaning;
                return;
            }
            index = (index + 1) % SIZE;
        }
        table[index] = {word, meaning};
        occupied[index] = true;
    }

    string search(const string& word) const {
        int index = hashFunction(word);
        int start = index;
        while (occupied[index]) {
            if (table[index].first == word) {
                return table[index].second;
            }
            index = (index + 1) % SIZE;
            if (index == start) break;
        }
        return "الكلمة غير موجودة";
    }

    void printAll() const {
        for (int i = 0; i < SIZE; i++) {
            if (occupied[i]) {
                cout << table[i].first << " : " << table[i].second << endl;
            }
        }
    }
};

int main() {
    Dictionary dict;

    dict.addWord("apple", "تفاحة");
    dict.addWord("book", "كتاب");
    dict.addWord("cat", "قطة");

    cout << "apple = " << dict.search("apple") << endl;
    cout << "book = " << dict.search("book") << endl;
    cout << "dog = " << dict.search("dog") << endl;

    cout << "\nكل الكلمات:\n";
    dict.printAll();

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "ليه بنستخدم `hash = hash * 31 + c` بدل جمع الحروف بس؟",
        options: [
          "عشان الكود يبقى أطول",
          "عشان توزيع القيم يبقى أحسن ويقل التصادم",
          "عشان البرنامج يشتغل أبطأ",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "الرقم 31 بيحسن توزيع الهاش وبيقلل التصادمات.",
      },
      {
        question: "إيه أحسن تعقيد للبحث في جدول التجزئة (في المتوسط)؟",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        answer: 2,
        explanation: "في المتوسط، الوصول المباشر بياخد زمن ثابت.",
      },
      {
        question: "ليه مش بنعمل مكان فاضي عادي لما نحذف عنصر من جدول التجزئة؟",
        options: [
          "عشان البحث هيكسر — ممكن المكان الفاضي يوقف البحث بدري",
          "عشان الذاكرة تفضل محجوزة",
          "عشان الكود يبقى أقصر",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "المسح الكامل بيقطع سلسلة البحث في Linear Probing، فبنستخدم علامة محذوف.",
      },
    ],
    exercise:
      "وسّع القاموس: أضف دالة `bool removeWord(const string& word)` بتعمل علامة \"محذوف\"، وعدّل دالة البحث عشان تكمل لو لقت مكان محذوف. اختبر الإضافة والحذف والبحث.",
    terms: [
      { en: "Dictionary", ar: "قاموس: هيكل بيانات يربط المفاتيح بالقيم." },
      { en: "Key", ar: "مفتاح: القيمة اللي بنستخدمها للبحث عن البيانات." },
      { en: "Value", ar: "قيمة: البيانات المخزنة والمرتبطة بالمفتاح." },
      { en: "Load Factor", ar: "معامل التحميل: نسبة الأماكن المشغولة للحجم الكلي للجدول." },
    ],
  },
];
