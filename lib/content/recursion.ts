import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "recursion-intro",
    title: "ما هي العودية Recursion؟",
    titleEn: "What is Recursion?",
    duration: "35 دقيقة",
    description:
      "الدالة بتنادي نفسها! ده مبدأ العودية (Recursion) — واحد من أجمل وأقوى المفاهيم في البرمجة. هنا هتعرف إزاي تفكر بشكل عودي.",
    sections: [
      {
        heading: "الفكرة: الدالة بتنادي نفسها",
        body: "العودية (Recursion) معناها إن **الدالة بتنادي نفسها** من جوا جسمها. الخوارزمية العودية بتوصف بأنها بتحل مشكلة كبيرة بحل نسخة أصغر من نفس المشكلة، لحد ما توصل لحالة سهلة تحلها مباشرة.\n\nمثال من الحياة: واقف في طابور عايز تعرف رقم دورك. بتسأل اللي قدامك: \"أنت رقم كم؟\". هو يسأل اللي قدامه... لحد ما يوصلوا لأول واحد، وبعدين كل واحد بيرجع لللي وراه ويقوله \"رقمي هو رقمك + 1\". ده بالظبط العودية.",
      },
      {
        heading: "الشرط الأساسي Base Case",
        body: "أي دالة عودية لازم يكون فيها **شرط أساسي (Base Case)** — حالة بسيطة تحل مباشرة من غير ما تنادي نفسها.\n\n```cpp\nvoid countdown(int n) {\n    if (n <= 0) {          // الشرط الأساسي\n        cout << \"انطلق!\" << endl;\n        return;            // وقف العودية\n    }\n    cout << n << endl;\n    countdown(n - 1);      // الدالة بتنادي نفسها\n}\n```\n\nمن غير الشرط الأساسي، الدالة هتنادي نفسها للأبد — والبرنامج هيقع بـ **Stack Overflow**.",
      },
      {
        heading: "خطوات العودية: تفكيك وتركيب",
        body: "الدالة العودية بتشتغل على 3 مراحل:\n\n1. **التفكيك:** كل نداء بيوصل للمشكلة لحجم أصغر.\n2. **الوصول للقاع:** الشرط الأساسي بيتحقق ويرجع نتيجة.\n3. **التركيب:** كل نداء بيرجع لللي ناداه بنتيجته.\n\nمثال مع `countdown(3)`:\n\n```\ncountdown(3) -> 3 -> countdown(2)\ncountdown(2) -> 2 -> countdown(1)\ncountdown(1) -> 1 -> countdown(0)\ncountdown(0) -> \"انطلق!\"  (الشرط الأساسي)\n```\n\nالقيم بتُطبع في الطريق النازل، وبعدين بيرجع لفوق.",
      },
      {
        heading: "إزاي تفكر بشكل عودي؟",
        body: "1. **حدد الشرط الأساسي الأول:** إيه أبسط حالة؟\n2. **افترض إن الدالة بتحل المشكلة:** استخدمها وخلاص.\n3. **قسّم المشكلة:** كل نداء يبقى على نسخة أصغر.\n\nمثال: جمع أرقام من 1 لـ n:\n\n```cpp\nint sum(int n) {\n    if (n == 0) return 0;      // الشرط الأساسي\n    return n + sum(n - 1);      // الأصغر\n}\n```\n\n`sum(5) = 5 + sum(4) = 5 + 4 + sum(3) = ... = 5 + 4 + 3 + 2 + 1 + 0 = 15`.",
      },
      {
        heading: "Stack Overflow: الخطر الصامت",
        body: "كل نداء عودي بياخد مكان في الـ **Call Stack** (مكدس النداءات). لو العودية عميقة جدًا (زي ملايين النداءات) أو مفيهاش شرط أساسي، الـ Stack هيتملي والبرنامج هيقع.\n\n```\nfatal error: stack overflow\n```\n\n**الوقاية:** دايماً تأكد من:\n\n- وجود شرط أساسي بيتحقق.\n- كل نداء بيقرب من الشرط الأساسي.\n- عمق العودية معقول.",
      },
    ],
    code: [
      {
        title: "عد تنازلي عودي",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

void countdown(int n) {
    if (n <= 0) {          // الشرط الأساسي
        cout << "انطلق!" << endl;
        return;
    }
    cout << n << endl;
    countdown(n - 1);      // الدالة بتنادي نفسها
}

int main() {
    countdown(5);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المبدأ الأساسي للعودية (Recursion)؟",
        options: [
          "الدالة بتنادي دالة تانية",
          "الدالة بتنادي نفسها بحجم أصغر لحد الشرط الأساسي",
          "الدالة بتعمل حلقة لا نهائية",
          "الدالة بترجع قيمة ثابتة",
        ],
        answer: 1,
        explanation: "العودية بتحل المشكلة بحل نسخة أصغر منها لحد ما توصل للقاع.",
      },
      {
        question: "إيه الشرط الأساسي (Base Case)؟",
        options: [
          "شرط بدء الحلقة",
          "حالة بسيطة تُحل مباشرة من غير نداء عودي",
          "شرط إنهاء البرنامج",
          "نوع من أنواع البيانات",
        ],
        answer: 1,
        explanation: "الشرط الأساسي بيوقف العودية ويمنع اللوب اللانهائي.",
      },
      {
        question: "إيه الخطر لو نسيت الشرط الأساسي؟",
        options: [
          "مفيش خطر",
          "Stack Overflow — البرنامج هيقع",
          "الكود هيشتغل أسرع",
          "النتيجة هتبقى غلط بس مش هتقع",
        ],
        answer: 1,
        explanation: "العودية بدون شرط أساسي بتنادي نفسها للأبد وتملّي الـ Call Stack.",
      },
    ],
    exercise:
      "اكتب دالة عودية `int sum(int n)` بتحسب مجموع الأرقام من 1 لـ n. استخدمها في main مع 5 و10. بعدين اكتب دالة `int power(int base, int exp)` بتحسب القوى بشكل عودي.",
    terms: [
      { en: "Recursion", ar: "العودية: دالة بتنادي نفسها لحل مشكلة بحجم أصغر." },
      { en: "Base Case", ar: "الشرط الأساسي: الحالة البسيطة اللي بتوقف العودية." },
      { en: "Recursive Call", ar: "النداء العودي: نداء الدالة لنفسها من جوا جسمها." },
      { en: "Stack Overflow", ar: "تجاوز سعة المكدس: خطأ بيحصل لما العودية توادي بلا حدود." },
    ],
  },
  {
    id: "recursion-patterns",
    title: "أنماط العودية: Factorial و Fibonacci",
    titleEn: "Recursion Patterns",
    duration: "45 دقيقة",
    description:
      "أشهر مثالين في العودية: المضروب (Factorial) وفيبوناتشي (Fibonacci). هنا هنفهمهم ونلاحظ إزاي العودية ممكن تكون حلوة ومضروبة في نفس الوقت.",
    sections: [
      {
        heading: "Factorial: المضروب",
        body: "مضروب الرقم n هو حاصل ضرب كل الأرقام من 1 لـ n:\n\n```\n5! = 5 × 4 × 3 × 2 × 1 = 120\n```\n\nالصيغة العودية بسيطة:\n\n```\nn! = n × (n-1)!\n```\n\n- الشرط الأساسي: `0! = 1` و`1! = 1`.\n- النداء العودي: `n × factorial(n-1)`.\n\n```cpp\nlong long factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n```",
      },
      {
        heading: "تنفيذ Factorial",
        body: "شغّل الدالة لترى النتيجة:\n\n```cpp\ncout << factorial(5) << endl;   // 120\ncout << factorial(10) << endl;  // 3628800\n```\n\n**ملاحظة:** استخدم `long long` بدل `int` عشان المضروب بيكبر بسرعة — `20!` بيعدّي سعة `int` بكتير.\n\n**تحذير:** المضروب العودي حلو، لكن الحلقة العادية أسرع وأأمن. استخدم العودية لما يكون الكود أوضح أو المشكلة طبيعية العودية.",
      },
      {
        heading: "Fibonacci: متتالية فيبوناتشي",
        body: "متتالية فيبوناتشي كل رقم فيها هو مجموع الرقمين اللي قبله:\n\n```\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...\n```\n\nالصيغة العودية:\n\n```\nF(0) = 0\nF(1) = 1\nF(n) = F(n-1) + F(n-2)\n```\n\n```cpp\nlong long fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n```",
      },
      {
        heading: "مشكلة الأداء في Fibonacci",
        body: "الدالة العودية لـ Fibonacci بتعمل **حسابات متكررة كتير**. مثلاً `fibonacci(5)` بتحسب `fibonacci(3)` مرتين، و`fibonacci(2)` تلات مرات!\n\n| n | عدد النداءات تقريباً |\n| --- | --- |\n| 5 | 15 |\n| 10 | 177 |\n| 20 | 21,891 |\n| 30 | 2.7 مليون |\n| 40 | 331 مليون |\n\nده **O(2ⁿ)** — كارثي! الحل:\n\n- **Memoization:** نحفظ النتائج المحسوبة في مصفوفة.\n- **الحل التكراري:** نحسب من تحت لفوق بحلقة.\n\n```cpp\nlong long fib[100] = {0};\nlong long fibonacci(int n) {\n    if (n <= 1) return n;\n    if (fib[n] != 0) return fib[n];   // كانت محسوبة\n    fib[n] = fibonacci(n - 1) + fibonacci(n - 2);\n    return fib[n];\n}\n```",
      },
      {
        heading: "العودية مقابل الحلقة",
        body: "| المعيار | العودية | الحلقة |\n| --- | --- | --- |\n| وضوح الكود | عالي في المشاكل الطبيعية | متوسط |\n| الأداء | أبطأ (تكلفة النداء) | أسرع |\n| خطر الانهيار | موجود (Stack Overflow) | آمن |\n| استهلاك الذاكرة | أعلى (Call Stack) | أقل |\n\n**قاعدة عامة:** استخدم العودية لما تكون المشكلة طبيعية العودية (زي الأشجار والمتاهات)، واستخدم الحلقة للأداء.",
      },
    ],
    code: [
      {
        title: "Factorial و Fibonacci",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

long long fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "5! = " << factorial(5) << endl;
    cout << "Fibonacci(10) = " << fibonacci(10) << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الناتج الصحيح لـ 5!؟",
        options: ["25", "120", "60", "720"],
        answer: 1,
        explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
      },
      {
        question: "ليه الـ Fibonacci العودي بطيء؟",
        options: [
          "عشان الكود طويل",
          "عشان بيعيد حساب نفس القيم كتير — O(2ⁿ)",
          "عشان الأرقام كبيرة",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "بدون حفظ النتائج، كل نداء بيعيد حساب فروع كاملة.",
      },
      {
        question: "إيه الحل الأمثل لتسريع الـ Fibonacci العودي؟",
        options: [
          "استخدام حلقة بدل العودية",
          "Memoization — حفظ النتائج المحسوبة",
          "تجاهل الشرط الأساسي",
          "تقليل حجم المدخلات",
        ],
        answer: 1,
        explanation: "حفظ النتائج بيمنع الحساب المتكرر ويحوّل التعقيد لـ O(n).",
      },
    ],
    exercise:
      "اكتب دالة عودية `int power(int base, int exp)` بتحسب base أس exp (مثلاً 2^3 = 8). استخدم شرط أساسي لـ exp = 0. بعدين حسّن الدالة بحيث لو exp زوجي، تحسب (base^(exp/2))² — ده أسرع بكتير.",
    terms: [
      { en: "Factorial", ar: "المضروب: حاصل ضرب الأرقام من 1 لـ n، ويرمز له بـ n!." },
      { en: "Fibonacci", ar: "متتالية فيبوناتشي: كل رقم فيها هو مجموع الرقمين السابقين لها." },
      { en: "Memoization", ar: "تخزين النتائج: حفظ نتائج الدوال المحسوبة لتجنب تكرار الحساب." },
      { en: "Recursive vs Iterative", ar: "عودي مقابل تكراري: مقارنة بين استخدام العودية والحلقات." },
    ],
  },
  {
    id: "sorting",
    title: "خوارزميات الفرز: Bubble و Merge",
    titleEn: "Sorting Algorithms",
    duration: "50 دقيقة",
    description:
      "من الفقاعات البسيطة لحد الدمج السريع: هنا هنكتب أهم خوارزميتين للفرز بإيدنا، ونقارن بينهم في السرعة والتعقيد.",
    sections: [
      {
        heading: "إيه هو الفرز؟",
        body: "الفرز (Sorting) هو ترتيب مجموعة من العناصر تصاعديًا أو تنازليًا. من أساسيات البرمجة — قواعد البيانات، البحث، التقارير، كلها محتاجة فرز.\n\nهندرس خوارزميتين:\n\n- **Bubble Sort:** بسيطة وبطيئة.\n- **Merge Sort:** معقدة شوية وسريعة جدًا.\n\nالفرق بينهم بيّن على أهمية اختيار الخوارزمية الصح.",
      },
      {
        heading: "Bubble Sort: الفقاعات",
        body: "الفكرة: نمر على المصفوفة أكتر من مرة. في كل مرة، نقارن كل عنصر بجاره. لو أكبر، نبدل. العناصر الكبيرة بتطفي للنهاية زي الفقاعات.\n\n```cpp\nvoid bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n            }\n        }\n    }\n}\n```\n\n- التعقيد: **O(n²)** — بطيء للمصفوفات الكبيرة.\n- بسيط وسهل الفهم — مناسب للتعلم بس.",
      },
      {
        heading: "Merge Sort: الدمج",
        body: "الفكرة: **Divide and Conquer** (قسّم وحكم):\n\n1. قسّم المصفوفة لنصين.\n2. فرز كل نصف لوحده (عوديًا).\n3. ادمج النصين المفروزين في مصفوفة واحدة.\n\n```cpp\nvoid mergeSort(vector<int>& arr, int left, int right) {\n    if (left >= right) return;   // الشرط الأساسي\n    int mid = left + (right - left) / 2;\n    mergeSort(arr, left, mid);\n    mergeSort(arr, mid + 1, right);\n    merge(arr, left, mid, right);\n}\n```\n\n- التعقيد: **O(n log n)** — سريع جدًا.\n- ده نفس الخوارزمية اللي بتستخدم في فرز قواعد البيانات الكبيرة.",
      },
      {
        heading: "دالة الدمج merge",
        body: "الدمج بياخد نصين مفروزين ويرجع مصفوفة واحدة مفروزة:\n\n```cpp\nvoid merge(vector<int>& arr, int left, int mid, int right) {\n    vector<int> temp;\n    int i = left, j = mid + 1;\n\n    while (i <= mid && j <= right) {\n        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);\n        else temp.push_back(arr[j++]);\n    }\n\n    while (i <= mid) temp.push_back(arr[i++]);\n    while (j <= right) temp.push_back(arr[j++]);\n\n    for (int k = 0; k < temp.size(); k++) {\n        arr[left + k] = temp[k];\n    }\n}\n```\n\nكل خطوة بتقارن عنصر من كل نصف وتاخد الأصغر.",
      },
      {
        heading: "مقارنة Bubble و Merge",
        body: "| الخوارزمية | التعقيد | السرعة | تعقيد الكود |\n| --- | --- | --- | --- |\n| Bubble Sort | O(n²) | بطيء | سهل جدًا |\n| Merge Sort | O(n log n) | سريع | متوسط |\n\n**مثال عملي:** لو عندك مليون عنصر:\n\n- Bubble Sort: حوالي 1 تريليون عملية.\n- Merge Sort: حوالي 20 مليون عملية.\n\n**خلاصة:** استخدم `sort()` من المكتبة القياسية في الشغل، وافهم Merge Sort عشان المقابلات.",
      },
    ],
    code: [
      {
        title: "Bubble Sort و Merge Sort",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp.push_back(arr[i++]);
        } else {
            temp.push_back(arr[j++]);
        }
    }

    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);

    for (int k = 0; k < temp.size(); k++) {
        arr[left + k] = temp[k];
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;

    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

void printArray(const vector<int>& arr) {
    for (int x : arr) {
        cout << x << " ";
    }
    cout << endl;
}

int main() {
    vector<int> arr1 = {64, 34, 25, 12, 22, 11, 90};
    vector<int> arr2 = {64, 34, 25, 12, 22, 11, 90};

    cout << "قبل الفرز: ";
    printArray(arr1);

    bubbleSort(arr1);
    cout << "Bubble Sort: ";
    printArray(arr1);

    mergeSort(arr2, 0, arr2.size() - 1);
    cout << "Merge Sort: ";
    printArray(arr2);

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه تعقيد الوقت بتاع Bubble Sort؟",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        answer: 2,
        explanation: "حلقتين متداخلتين يعني n × n = n².",
      },
      {
        question: "إيه الفكرة الأساسية في Merge Sort؟",
        options: [
          "مقارنة العناصر المتجاورة وتبديلها",
          "قسّم المصفوفة وفرز كل جزء لوحده وبعدين ادمجهم",
          "اختيار عنصر محوري",
          "خلط عشوائي",
        ],
        answer: 1,
        explanation: "Divide and Conquer — قسّم وفرّز وادمج.",
      },
      {
        question: "ليه Merge Sort أسرع من Bubble Sort؟",
        options: [
          "عشان الكود أطول",
          "عشان O(n log n) أصغر من O(n²) في الحجم الكبير",
          "عشان بيستخدم ذاكرة أقل",
          "مفيش فرق",
        ],
        answer: 1,
        explanation: "فرق التعقيد بيبان في الحجم الكبير — 20 مليون مقابل تريليون عملية.",
      },
    ],
    exercise:
      "اكتب دالة `bool isSorted(const vector<int>& arr) const` بتفحص لو المصفوفة مفروزة. استخدمها في main بعد كل فرزة عشان تتأكد إن الخوارزميات شغالة صح.",
    terms: [
      { en: "Sorting", ar: "فرز: ترتيب مجموعة من العناصر تصاعديًا أو تنازليًا." },
      { en: "Bubble Sort", ar: "فرز الفقاعات: خوارزمية بسيطة بتقارن العناصر المتجاورة وتبدل." },
      { en: "Merge Sort", ar: "فرز الدمج: خوارزمية قسّم وحكم بتعقيد O(n log n)." },
      { en: "Divide and Conquer", ar: "قسّم وحكم: استراتيجية حل المشاكل بتقسيمها لمشاكل أصغر." },
    ],
  },
  {
    id: "searching",
    title: "خوارزميات البحث: Linear و Binary",
    titleEn: "Searching Algorithms",
    duration: "40 دقيقة",
    description:
      "إزاي تدوّر على عنصر في مصفوفة؟ هنا هنتعلم البحث الخطي البسيط والبحث الثنائي السريع، وإزاي تختار بينهم.",
    sections: [
      {
        heading: "البحث الخطي: العد واحدة واحدة",
        body: "البحث الخطي (Linear Search) أبسط طريقة: ابدأ من الأول وقف على كل عنصر لحد ما تلاقي اللي بتدور عليه.\n\n```cpp\nint linearSearch(const vector<int>& arr, int target) {\n    for (int i = 0; i < arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}\n```\n\n- التعقيد: **O(n)** — في أسوأ حالة تمشي على كل العناصر.\n- يشتغل على أي مصفوفة، مرتبة أو لأ.\n- بسيط وموثوق.",
      },
      {
        heading: "البحث الثنائي: نص ونص",
        body: "البحث الثنائي (Binary Search) أسرع بكتير لكن بشرط: **المصفوفة لازم تكون مرتبة**.\n\nالفكرة: قارن بالوسط. لو الهدف أصغر، دور في النصف الشمالي. لو أكبر، دور في النصف اليماني. كل خطوة تنص النطاق.\n\n```cpp\nint binarySearch(const vector<int>& arr, int target, int left, int right) {\n    if (left > right) return -1;\n\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);\n    return binarySearch(arr, target, mid + 1, right);\n}\n```\n\n- التعقيد: **O(log n)** — سريع جدًا.\n- مثال: في مليون عنصر، الخطي ياخد مليون خطوة، والثنائي ياخد 20 خطوة بس!",
      },
      {
        heading: "متى تستخدم أي؟",
        body: "- **استخدم البحث الخطي** لما تكون المصفوفة صغيرة أو مش مرتبة.\n- **استخدم البحث الثنائي** لما تكون المصفوفة مرتبة وكبيرة.\n\n| الحجم | الخطي (أسوأ حالة) | الثنائي (أسوأ حالة) |\n| --- | --- | --- |\n| 1,000 | 1,000 | 10 |\n| 1,000,000 | 1,000,000 | 20 |\n| 1,000,000,000 | 1,000,000,000 | 30 |\n\n**نصيحة:** في الشغل استخدم `binary_search()` من المكتبة القياسية.",
      },
      {
        heading: "النسخة العودية للبحث الثنائي",
        body: "البحث الثنائي طبيعي العودية — كل نداء تنص النطاق:\n\n```cpp\nint binarySearch(const vector<int>& arr, int target, int left, int right) {\n    if (left > right) return -1;\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);\n    return binarySearch(arr, target, mid + 1, right);\n}\n```\n\n- الشرط الأساسي: `left > right` (العنصر مش موجود).\n- كل نداء تنص النطاق، فالتعقيد O(log n).",
      },
      {
        heading: "الخطأ الشائع: mid = (left + right) / 2",
        body: "في الأرقام الكبيرة، `left + right` ممكن يعدّي سعة `int`. الحل الآمن:\n\n```cpp\nint mid = left + (right - left) / 2;\n```\n\nده بيحسب نفس النتيجة من غير تجاوز. تفصيلة صغيرة بتحمي من بگ محرج في الأرقام الكبيرة.",
      },
    ],
    code: [
      {
        title: "البحث الخطي والثنائي",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

int linearSearch(const vector<int>& arr, int target, int index = 0) {
    if (index >= arr.size()) return -1;
    if (arr[index] == target) return index;
    return linearSearch(arr, target, index + 1);
}

int binarySearch(const vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;

    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);
    return binarySearch(arr, target, mid + 1, right);
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};

    cout << "بحث خطي عن 7: " << linearSearch(arr, 7) << endl;
    cout << "بحث ثنائي عن 7: " << binarySearch(arr, 7, 0, arr.size() - 1) << endl;

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الشرط الأساسي لاستخدام البحث الثنائي؟",
        options: [
          "المصفوفة تكون صغيرة",
          "المصفوفة تكون مرتبة",
          "المصفوفة تكون من أرقام زوجية",
          "مفيش شرط",
        ],
        answer: 1,
        explanation: "البحث الثنائي بيعتمد على الترتيب — غير كده مش هيشتغل صح.",
      },
      {
        question: "إيه تعقيد البحث الثنائي؟",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        answer: 1,
        explanation: "كل خطوة تنص النطاق — لوغاريتمي.",
      },
      {
        question: "ليه بنحسب mid بالطريقة `left + (right - left) / 2`؟",
        options: [
          "عشان الكود يبقى أطول",
          "عشان نتجنب تجاوز سعة int في الأرقام الكبيرة",
          "عشان النتيجة تبقى أصح",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "left + right ممكن يضرب سعة int — الطريقة دي آمنة.",
      },
    ],
    exercise:
      "اكتب دالة `int binarySearchIterative(...)` بنفس منطق البحث الثنائي لكن بحلقة while بدل العودية. قارن الأداء مع النسخة العودية على مصفوفة من مليون عنصر.",
    terms: [
      { en: "Linear Search", ar: "بحث خطي: المرور على كل عنصر واحد واحد لحد لقاء الهدف." },
      { en: "Binary Search", ar: "بحث ثنائي: تنص النطاق في كل خطوة، ويشترط مصفوفة مرتبة." },
      { en: "Logarithmic", ar: "لوغاريتمي: تعقيد O(log n) — سريع جدًا مع الحجم الكبير." },
      { en: "Iterative", ar: "تكراري: الحل بحلقات بدل العودية." },
    ],
  },
  {
    id: "files",
    title: "التعامل مع الملفات File I/O",
    titleEn: "File I/O",
    duration: "45 دقيقة",
    description:
      "من غير ما نحفظ البيانات، أي برنامج بيموت لما نقفل. هنا هنتعلم نكتب ونقرا الملفات — خطوة أساسية لأي مشروع حقيقي.",
    sections: [
      {
        heading: "مكتبة fstream",
        body: "C++ بتوفر التعامل مع الملفات من خلال مكتبة `<fstream>`، وفيها 3 أنواع أساسية:\n\n- **`ofstream`:** للكتابة في ملف (Output File Stream).\n- **`ifstream`:** للقراءة من ملف (Input File Stream).\n- **`fstream`:** للاتنين مع بعض.\n\n```cpp\n#include <fstream>\nusing namespace std;\n```\n\nلازم تضمّن المكتبة دي في أول الملف.",
      },
      {
        heading: "الكتابة في ملف",
        body: "ننشئ ملف ونكتب فيه باستخدام `<<` زي `cout`:\n\n```cpp\nofstream outFile(\"students.txt\");\nif (outFile.is_open()) {\n    outFile << \"أحمد 85\" << endl;\n    outFile << \"سارة 92\" << endl;\n    outFile.close();\n}\n```\n\n- `ofstream` بيفتح ملف جديد أو يمسح القديم ويكتب.\n- `is_open()` بترجع true لو الملف اتفتح بنجاح.\n- `close()` بتقفل الملف — مهمة عشان تسيف البيانات على القرص.",
      },
      {
        heading: "القراءة من ملف",
        body: "نقرا باستخدام `>>` أو `getline`:\n\n```cpp\nifstream inFile(\"students.txt\");\nif (inFile.is_open()) {\n    string line;\n    while (getline(inFile, line)) {\n        cout << line << endl;\n    }\n    inFile.close();\n}\n```\n\n- `getline(inFile, line)` بترجع false لما توصل لنهاية الملف.\n- بنفضل `getline` على `>>` عشان بنقرا السطر كامل مع المسافات.",
      },
      {
        heading: "الوضعيات والعلامات",
        body: "بنقدر نتحكم في سلوك الملف باستخدام **الوضعيات (Modes)**:\n\n```cpp\nofstream outFile(\"data.txt\", ios::app);   // إضافة في النهاية\nofstream outFile2(\"data.txt\", ios::trunc); // مسح وإعادة كتابة\n```\n\n- `ios::app` — إضافة في نهاية الملف (Append).\n- `ios::trunc` — مسح المحتوى القديم (Truncate).\n- `ios::binary` — الوضع الثنائي للصور والملفات المعقدة.\n\n**افتراضي:** `ofstream` بيبدأ بـ `trunc` — يعني يمسح أي ملف بنفس الاسم.",
      },
      {
        heading: "مثال عملي: حفظ وقراءة درجات الطلاب",
        body: "هنا هنجمع الكتابة والقراءة في برنامج واحد: نكتب درجات الطلاب في ملف، وبعدين نقراهم ونطبعهم. ده مثال بسيط على حفظ البيانات بشكل دائم.\n\n**فكرة التوسعة:** ممكن نحفظ بيانات الطلاب في ملف CSV (بفواصل)، ونقراها في المرحلة الجاية. كمان ممكن نعمل قايمة خيارات: حفظ، قراءة، مسح.",
      },
    ],
    code: [
      {
        title: "الكتابة والقراءة من ملف",
        language: "cpp",
        code: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    // الكتابة في ملف
    ofstream outFile("students.txt");
    if (outFile.is_open()) {
        outFile << "أحمد 85" << endl;
        outFile << "سارة 92" << endl;
        outFile << "محمد 78" << endl;
        outFile.close();
        cout << "تمت الكتابة في الملف" << endl;
    } else {
        cout << "مفتحتش الملف للكتابة" << endl;
    }

    // القراءة من الملف
    ifstream inFile("students.txt");
    if (inFile.is_open()) {
        string line;
        while (getline(inFile, line)) {
            cout << line << endl;
        }
        inFile.close();
    } else {
        cout << "مفتحتش الملف للقراءة" << endl;
    }

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين ofstream و ifstream؟",
        options: [
          "مفيش فرق",
          "ofstream للكتابة و ifstream للقراءة",
          "ifstream أسرع",
          "ofstream للقراءة و ifstream للكتابة",
        ],
        answer: 1,
        explanation: "ofstream بتكتب في الملفات، وifstream بتقرا منها.",
      },
      {
        question: "إيه وظيفة `getline(inFile, line)`؟",
        options: [
          "قراءة حرف واحد",
          "قراءة سطر كامل من الملف بما فيه المسافات",
          "حذف سطر من الملف",
          "عدّ عدد الأسطر",
        ],
        answer: 1,
        explanation: "getline بتقرا السطر كامل لحد نهاية السطر — على عكس >> اللي بتوقف عند المسافة.",
      },
      {
        question: "ليه لازم نستخدم `close()` بعد الكتابة؟",
        options: [
          "عشان الملف يبقى أجمل",
          "عشان نتأكد إن البيانات اتسيفت على القرص والملف اتقفل صح",
          "عشان البرنامج يشتغل أسرع",
          "مفيش داعي",
        ],
        answer: 1,
        explanation: "close() بتسيف الـ buffer وبتقفل الملف — بدونها ممكن تضيع بيانات.",
      },
    ],
    exercise:
      "اكتب برنامج يسأل المستخدم عن اسمه وعمره، ويحفظهم في ملف `user.txt`. بعدين اقرا الملف واطبع البيانات على الشاشة. استخدم `ios::app` عشان البيانات الجديدة تتضاف مش تمسح القديم.",
    terms: [
      { en: "fstream", ar: "مكتبة الملفات: مكتبة C++ القياسية للتعامل مع الملفات." },
      { en: "ofstream", ar: "مجرى الإخراج: كائن للكتابة في الملفات." },
      { en: "ifstream", ar: "مجرى الإدخال: كائن للقراءة من الملفات." },
      { en: "getline", ar: "قراءة سطر: دالة بتقرا سطر كامل من الملف." },
    ],
  },
  {
    id: "recursion-project",
    title: "مشروع: متاهة بـ Recursion",
    titleEn: "Project: Recursive Maze",
    duration: "70 دقيقة",
    description:
      "هنا هنجمع كل حاجة: العودية، المصفوفات، والتفكير المنطقي. هنبني برنامج يحل متاهة لوحده — يتنقل في كل الاتجاهات لحد ما يلاقي المخرج.",
    sections: [
      {
        heading: "تخطيط المشروع",
        body: "المشروع ببساطة: عندنا متاهة (مصفوفة ثنائية) وشكلها:\n\n- `0` — طريق مفتوح.\n- `1` — جدار.\n- `2` — الطريق الصح (اللي مشينا فيه).\n\nالهدف: نلاقي طريق من البداية (0,0) للنهاية (4,4). خوارزمية الحل هتكون **عودية (Recursive)** — تجرّب كل الاتجاهات وتحفر لحد ما تلاقي حل.\n\n```\n# = جدار   . = طريق   * = الطريق الصح\n. # . . .\n. # . # .\n. . . # .\n. # # # .\n. . . . .\n```",
      },
      {
        heading: "تمثيل المتاهة",
        body: "نستخدم مصفوفة ثنائية من الأرقام:\n\n```cpp\nconst int ROWS = 5;\nconst int COLS = 5;\n\nint maze[ROWS][COLS] = {\n    {0, 1, 0, 0, 0},\n    {0, 1, 0, 1, 0},\n    {0, 0, 0, 1, 0},\n    {0, 1, 1, 1, 0},\n    {0, 0, 0, 0, 0}\n};\n```\n\n- 0 = طريق\n- 1 = جدار\n- 2 = الطريق الصح (بنتعامل عليه كمان كعلامة زيارة)\n\n**ملاحظة:** الأبعاد ثابتة هنا للتبسيط، لكن في المشاريع الحقيقية بتستخدم vector.",
      },
      {
        heading: "خوارزمية الحل",
        body: "الخوارزمية بتحفر في كل اتجاه (تحت، فوق، يمين، شمال):\n\n1. **الشرط الأساسي الأول:** لو وصلنا للنهاية، رجّع true.\n2. **التحقق:** لو خارج الحدود أو جدار أو مرينا عليه، رجّع false.\n3. **العلامة:** نحط علامة زيارة على الخلية الحالية.\n4. **المحاولة:** نجرب الاتجاهات الأربعة.\n5. **التراجع:** لو مفيش حل، نشيل العلامة ونرجّع false.\n\n```cpp\nbool solveMaze(int row, int col) {\n    if (row == ROWS - 1 && col == COLS - 1) return true;\n    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;\n    if (maze[row][col] != 0) return false;\n\n    maze[row][col] = 2;   // علامة زيارة\n\n    if (solveMaze(row + 1, col)) return true;\n    if (solveMaze(row - 1, col)) return true;\n    if (solveMaze(row, col + 1)) return true;\n    if (solveMaze(row, col - 1)) return true;\n\n    maze[row][col] = 0;   // تراجع\n    return false;\n}\n```",
      },
      {
        heading: "طباعة المتاهة",
        body: "بعد الحل، نطبع المتاهة بالأحرف:\n\n```cpp\nvoid printMaze() {\n    for (int i = 0; i < ROWS; i++) {\n        for (int j = 0; j < COLS; j++) {\n            if (maze[i][j] == 0) cout << \". \";\n            else if (maze[i][j] == 1) cout << \"# \";\n            else cout << \"* \";\n        }\n        cout << endl;\n    }\n}\n```\n\nنطبع المتاهة قبل الحل وبعدين بعد الحل، عشان نشوف الطريق اللي اتعلّمه.",
      },
      {
        heading: "تشغيل المشروع",
        body: "في `main`:\n\n```cpp\nprintMaze();\nif (solveMaze(0, 0)) {\n    cout << \"حل المتاهة:\" << endl;\n    printMaze();\n} else {\n    cout << \"مفيش حل!\" << endl;\n}\n```\n\nشغّل الكود بنفسك وشوف الطريق الصح معلّم بـ `*`. جرّب تغير المتاهة — حط جدران في أماكن مختلفة وشوف لو بيلاقي حل.",
      },
      {
        heading: "تحسينات ممكنة (تحدي)",
        body: "- **أقصر طريق:** لحد ما نطبع أي طريق موجود، نعدّل الخوارزمية لتختار أقصر واحد.\n- **متاهة عشوائية:** عمل متاهة عشوائية بحلقة أو خوارزمية.\n- **واجهة رسومية:** استخدام مكتبة رسوم بسيطة لرسم المتاهة.\n- **BFS:** استخدام الطابور (Queue) بدل العودية — دي خوارزمية تانية لحل المتاهات.\n\nالمشروع ده هيفتح لك باب فهم الخوارزميات الرسومية (Graph Algorithms).",
      },
    ],
    code: [
      {
        title: "حل متاهة بالعودية",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

const int ROWS = 5;
const int COLS = 5;

// 0 = طريق، 1 = جدار، 2 = الطريق الصح
int maze[ROWS][COLS] = {
    {0, 1, 0, 0, 0},
    {0, 1, 0, 1, 0},
    {0, 0, 0, 1, 0},
    {0, 1, 1, 1, 0},
    {0, 0, 0, 0, 0}
};

bool solveMaze(int row, int col) {
    // الشرط الأساسي: وصلنا للنهاية
    if (row == ROWS - 1 && col == COLS - 1) {
        maze[row][col] = 2;
        return true;
    }

    // خارج الحدود أو جدار أو مرينا عليه
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
    if (maze[row][col] != 0) return false;

    // علامات على الطريق
    maze[row][col] = 2;

    // جرّب الاتجاهات الأربعة
    if (solveMaze(row + 1, col)) return true;   // تحت
    if (solveMaze(row - 1, col)) return true;   // فوق
    if (solveMaze(row, col + 1)) return true;   // يمين
    if (solveMaze(row, col - 1)) return true;   // شمال

    // لو مفيش طريق، امسح العلامة وارجع
    maze[row][col] = 0;
    return false;
}

void printMaze() {
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            if (maze[i][j] == 0) cout << ". ";
            else if (maze[i][j] == 1) cout << "# ";
            else cout << "* ";
        }
        cout << endl;
    }
}

int main() {
    cout << "المتاهة قبل الحل:" << endl;
    printMaze();

    if (solveMaze(0, 0)) {
        cout << "\nالمتاهة بعد الحل:" << endl;
        printMaze();
    } else {
        cout << "مفيش حل!" << endl;
    }

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المبدأ اللي بيخلي العودية تحل المتاهة؟",
        options: [
          "تجربة كل اتجاه والتراجع لو مفيش طريق",
          "اختيار اتجاه عشوائي",
          "حفر في اتجاه واحد بس",
          "خلط المتاهة",
        ],
        answer: 0,
        explanation: "العودية بتجرّب كل الاتجاهات، ولو مفيش حل بترجع تمسح العلامة.",
      },
      {
        question: "ليه بنحط علامة زيارة (2) على الخلايا؟",
        options: [
          "عشان نعرف الطريق بس",
          "عشان منعاودش نفس الخلية ونوقع في حلقة لا نهائية",
          "عشان المتاهة تبقى أجمل",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "من غير العلامة، العودية ممكن تلف في دايرة لا نهائية.",
      },
      {
        question: "إيه الشرط الأساسي في خوارزمية المتاهة؟",
        options: [
          "الوصول لنهاية المصفوفة",
          "الوصول للخلية الأخيرة (ROWS-1, COLS-1)",
          "الخروج من الحدود",
          "مفيش شرط أساسي",
        ],
        answer: 1,
        explanation: "الشرط الأساسي هو الوصول للخلية الهدف — ووقتها بنوقف العودية.",
      },
    ],
    exercise:
      "عدّل الخوارزمية عشان تحسب عدد الخطوات في الطريق الصح (عدد الخلايا المعلّمة بـ 2). بعدين اكتب نسخة بتجرّب اليمين والشمال الأول — لاحظ الفرق في الطريق المعلّم.",
    terms: [
      { en: "Backtracking", ar: "تراجع: خوارزمية تجربة كل الاحتمالات والتراجع لو مفيش حل." },
      { en: "Maze", ar: "متاهة: شبكة من الخلايا فيها طرق وجدران." },
      { en: "Visited Mark", ar: "علامة زيارة: علامة على الخلايا اللي مرينا عليها منعاً للتكرار." },
      { en: "Recursion Tree", ar: "شجرة العودية: كل نداء عادي بيفرع لنداءات أصغر." },
    ],
  },
];
