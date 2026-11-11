import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "divide-conquer",
    title: "تقسيمة وغزو Divide & Conquer",
    titleEn: "Divide & Conquer",
    duration: "45 دقيقة",
    description:
      "هتتعلم إزاي تقسّم المشكلة الكبيرة لمشاكل صغيرة، تحل كل واحدة لوحدها، وبعدين تدمج الحلول — زي فرز الدمج والبحث الثنائي.",
    sections: [
      {
        heading: "الفكرة في سطرين",
        body: "تقسيمة وغزو (Divide and Conquer) إستراتيجية لحل المشكلات بثلاث خطوات: **قسّم** المشكلة لمشاكل فرعية أصغر، **غزُ** أي حل كل مشكلة فرعية لوحدها، وبعدين **ادمج** الحلول في حل واحد كامل.\n\nتخيل إنك عايز ترتّب 8 أوراق لعب. بدل ما تفكر فيهم كلهم مرة واحدة، قسمهم نصين، رتّب كل نص لوحده، وبعدين ادمج النصين المرتّبين في قائمة واحدة مرتّبة. ده بالظبط اللي بتعمله فكرة فرز الدمج.",
      },
      {
        heading: "ليه التقسيمة شغالة؟",
        body: "القسمة بتقلل حجم المشكلة بشكل كبير. لو المشكلة حجمها `n` والقسمة بتقسمها لـ `n/2` في كل خطوة، فعدد الخطوات بيكون لوغاريتمي `log n`. ده معناه إن البرنامج بيفضل سريع حتى مع بيانات ضخمة.\n\n**شرط أساسي:** لازم يكون فيه حالة أساسية (Base Case) — مشكلة صغيرة جداً نعرف حلها مباشرة من غير قسمة. من غير الحالة الأساسية، الاستدعاء الذاتي هيستمر للأبد والبرنامج هيعلق.",
      },
      {
        heading: "مثال: فرز الدمج Merge Sort",
        body: "فرز الدمج من أشهر أمثلة تقسيمة وغزو:\n\n1. **قسّم:** قسم المصفوفة لنصفين.\n2. **غزُ:** رتّب كل نصف بالاستدعاء الذاتي (Recursive).\n3. **ادمج:** ادمج النصين المرتّبين في مصفوفة مرتّبة واحدة.\n\nتعقيد الوقت `O(n log n)` في كل الحالات، وهو أفضل بفرق ضخم من فرز الفقاعات `O(n²)` عند البيانات الكبيرة.",
      },
      {
        heading: "مثال تاني: البحث الثنائي",
        body: "البحث الثنائي (Binary Search) برضه تقسيمة وغزو: بدل ما تفحص كل عنصر واحد واحد (بحث خطي `O(n)`)، بتقسم المصفوفة المرتّبة نصين وتحدد في أي نصف موجود العنصر المطلوب.\n\nكل خطوة بتقلل حجم البحث للنصف، فالتعقيد `O(log n)`. لو عندك مليون عنصر، البحث الثنائي بيحتاج حوالي 20 مقارنة بس، بينما البحث الخطي ممكن يأخذ مليون مقارنة.",
      },
      {
        heading: "متى تستخدم تقسيمة وغزو؟",
        body: "- المشكلة بتتقسّم بشكل طبيعي لمشاكل فرعية مستقلة.\n- حل المشاكل الفرعية ليه نفس الشكل.\n- الدمج مش مكلف جداً.\n\nمن أشهر التطبيقات: فرز الدمج، فرز سريع QuickSort، البحث الثنائي، ضرب الأعداد الكبيرة، وضرب المصفوفات.",
      },
    ],
    code: [
      {
        title: "فرز الدمج كاملاً",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) {
        return; // الحالة الأساسية
    }
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

int main() {
    vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
    cout << "قبل الفرز: ";
    for (int x : arr) {
        cout << x << " ";
    }
    cout << endl;

    mergeSort(arr, 0, (int)arr.size() - 1);

    cout << "بعد الفرز: ";
    for (int x : arr) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
      },
      {
        title: "البحث الثنائي",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = (int)arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;
    int result = binarySearch(arr, target);
    if (result != -1) {
        cout << "العنصر موجود في الفهرس: " << result << endl;
    } else {
        cout << "العنصر غير موجود" << endl;
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "ما هي الخطوات الثلاث لإستراتيجية تقسيمة وغزو؟",
        options: [
          "قسّم، ادمج، غزُ",
          "قسّم، غزُ، ادمج",
          "غزُ، قسّم، ادمج",
          "ادمج، قسّم، غزُ",
        ],
        answer: 1,
        explanation: "الترتيب الصحيح: نقسم المشكلة، نحل كل جزء، ثم ندمج الحلول.",
      },
      {
        question: "ليه البحث الثنائي بيشتغل بتعقيد O(log n)؟",
        options: [
          "لأنه بيستخدم الذاكرة بشكل أفضل",
          "لأنه في كل خطوة بيقلل حجم البحث للنصف",
          "لأنه بيستخدم المعالج بشكل متوازي",
          "لأنه بيفرز البيانات الأول",
        ],
        answer: 1,
        explanation: "في كل مقارنة نستبعد نصف العناصر المتبقية، فعدد الخطوات لوغاريتمي.",
      },
      {
        question: "إيه الشرط الأساسي لأي خوارزمية تقسيمة وغزو؟",
        options: [
          "تكون المصفوفة مرتّبة",
          "وجود حالة أساسية نعرف حلها مباشرة",
          "يكون فيه ذاكرة كافية",
          "يكون الكود بلغة C++",
        ],
        answer: 1,
        explanation: "الحالة الأساسية هي اللي بوقف الاستدعاء الذاتي وتمنع الحلقة اللانهائية.",
      },
    ],
    exercise:
      "اكتب دالة `int findMax(const vector<int>& arr, int left, int right)` بترجع أكبر عنصر في مصفوفة باستخدام تقسيمة وغزو. قارن نتيجتها مع حل بالحلقة العادية.",
    terms: [
      { en: "Divide & Conquer", ar: "تقسيمة وغزو: إستراتيجية حل المشكلة بتقسيمها لمشاكل أصغر ثم دمج الحلول." },
      { en: "Merge Sort", ar: "فرز الدمج: خوارزمية فرز بتقسيمة وغزو بتعقيد وقت O(n log n)." },
      { en: "Base Case", ar: "الحالة الأساسية: أصغر مشكلة نقدر نحلها مباشرة بدون تقسيم، وهي اللي بتوقف الاستدعاء الذاتي." },
      { en: "Recurrence Relation", ar: "علاقة تكرارية: معادلة بتصف تعقيد الخوارزمية بدلالة تعقيد مشاكلها الفرعية." },
    ],
  },
  {
    id: "graph-bfs-dfs",
    title: "الرسوم البيانية: BFS و DFS",
    titleEn: "Graphs: BFS & DFS",
    duration: "55 دقيقة",
    description:
      "هتبني رسوم بيانية في C++ وتتعلم أهم خوارزميتين لاستكشافها: البحث بالعرض BFS والبحث بالعمق DFS.",
    sections: [
      {
        heading: "إيه الرسم البياني؟",
        body: "الرسم البياني (Graph) مجموعة **عقد** (Nodes) متصلة بـ**حواف** (Edges). الحواف ممكن تكون باتجاه واحد (Directed) أو اتجاهين (Undirected).\n\nفي الكود، أسهل طريقة لتمثيل الرسم البياني هي **قائمة الجوار** (Adjacency List): لكل عقدة نخزّن قائمة بجيرانها. في C++ بنستخدم `vector<vector<int>>`.",
      },
      {
        heading: "تمثيل الرسم البياني في C++",
        body: "كل عنصر في المتجه الخارجي بيمثل عقدة، والمتجه الداخلي بيحتوي أرقام العقد المتصلة بيها.\n\nمثال: لو العقدة 0 متصلة بالعقدتين 1 و2، نكتب `graph[0] = {1, 2}`.\n\nده التمثيل بيوفر الذاكرة مقارنة بمصفوفة الجوار (Adjacency Matrix)، خاصة مع الرسوم الكبيرة المتناثرة.",
      },
      {
        heading: "البحث بالعرض BFS",
        body: "البحث بالعرض (Breadth-First Search) بيستكشف العقد مستوى بمستوى: يبدأ من العقدة، يزور كل جيرانها، وبعدين جيران الجيران.\n\nبنستخدم طابور (Queue) عشان نتابع ترتيب الزيارة. أول ما نخرج عقدة من الطابور، نضيف جيرانها غير المزارين في آخر الطابور.\n\nBFS بيضمن إننا نلاقي أقصر مسار بعدد الحواف في الرسم غير المرجّح.",
      },
      {
        heading: "البحث بالعمق DFS",
        body: "البحث بالعمق (Depth-First Search) بيدخل أقصى ما يقدر في اتجاه واحد، ولما يلاقي طريق مسدود يرجع (Backtrack) ويجرب اتجاه تاني.\n\nبنستخدم المكدس (Stack) أو الاستدعاء الذاتي. DFS مش بيضمن أقصر مسار، لكنه بيستخدم في حل مشاكل كتير: اكتشاف الدورات، الترتيب الطوبولوجي، وملء المناطق (Flood Fill).",
      },
      {
        heading: "مقارنة سريعة",
        body: "- **BFS:** أقصر مسار بعدد الحواف، لكنه بيذاكر مساحة أكبر في الرسوم العريضة.\n- **DFS:** ذاكرة أقل في الرسوم العميقة، ومناسب للاستكشاف الكامل.\n- الاتنين نفس تعقيد الوقت `O(V + E)` حيث V عدد العقد و E عدد الحواف.",
      },
    ],
    code: [
      {
        title: "BFS و DFS في برنامج واحد",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(const vector<vector<int>>& graph, int start) {
    int n = graph.size();
    vector<bool> visited(n, false);
    queue<int> q;
    visited[start] = true;
    q.push(start);

    cout << "BFS: ";
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    cout << endl;
}

void dfsHelper(const vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfsHelper(graph, neighbor, visited);
        }
    }
}

void dfs(const vector<vector<int>>& graph, int start) {
    vector<bool> visited(graph.size(), false);
    cout << "DFS: ";
    dfsHelper(graph, start, visited);
    cout << endl;
}

int main() {
    vector<vector<int>> graph(6);
    graph[0] = {1, 2};
    graph[1] = {0, 3, 4};
    graph[2] = {0, 4};
    graph[3] = {1, 5};
    graph[4] = {1, 2, 5};
    graph[5] = {3, 4};

    bfs(graph, 0);
    dfs(graph, 0);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "في تمثيل قائمة الجوار، إيه اللي بنخزّنه لكل عقدة؟",
        options: ["قائمة بجيران العقدة", "وزن كل حافة", "عدد العقد الكلي", "اسم العقدة"],
        answer: 0,
        explanation: "قائمة الجوار بتخزن لكل عقدة أرقام العقد المتصلة بيها.",
      },
      {
        question: "بحث BFS بيستخدم أنهي بنية بيانات؟",
        options: ["المكدس Stack", "الطابور Queue", "الشجرة Tree", "جدول التجزئة Hash Table"],
        answer: 1,
        explanation: "الطابور بيضمن زيارة العقد بترتيب المستوى: الأقرب أولاً.",
      },
      {
        question: "أي خوارزمية بيضمن أقصر مسار بعدد الحواف في رسم غير مرجّح؟",
        options: ["DFS", "BFS", "البحث الخطي", "فرز الفقاعات"],
        answer: 1,
        explanation: "BFS بيزور العقد بترتيب المسافة عن البداية، فأول ما يوصل للهدف يكون أقصر مسار.",
      },
    ],
    exercise:
      "اكتب برنامج يعدّ عدد المكونات المتصلة في رسم بياني غير موجّه. استخدم BFS أو DFS.",
    terms: [
      { en: "Graph", ar: "رسم بياني: مجموعة عقد متصلة بحواف." },
      { en: "Adjacency List", ar: "قائمة الجوار: طريقة تمثيل الرسم البياني بتخزين قائمة بجيران كل عقدة." },
      { en: "BFS", ar: "البحث بالعرض: استكشاف العقد مستوى بمستوى باستخدام طابور." },
      { en: "DFS", ar: "البحث بالعمق: استكشاف العقد بالدخول لأقصى عمق ممكن ثم التراجع." },
    ],
  },
  {
    id: "shortest-path",
    title: "أقصر مسار: Dijkstra",
    titleEn: "Shortest Path: Dijkstra",
    duration: "55 دقيقة",
    description:
      "هتبني خوارزمية Dijkstra عشان تلاقي أقصر مسار في رسم بياني بأوزان، وتفهم إزاي بتعمل وكمان إمتى مش بتنفع.",
    sections: [
      {
        heading: "المشكلة: أقصر مسار بأوزان",
        body: "في الرسم غير المرجّح، BFS بيلاقي أقصر مسار بعدد الحواف. لكن في الحياة الحقيقية، الطرق ليها أطوال مختلفة: طريق 10 دقايق وآخر 20 دقيقة. هنا بنحتاج خوارزمية بتحسب **مجموع الأوزان** مش عدد الحواف.\n\nخوارزمية Dijkstra بترجع أقصر مسافة من عقدة بداية لكل العقد التانية في رسم بأوزان **غير سالبة**.",
      },
      {
        heading: "فكرة الخوارزمية",
        body: "Dijkstra بتشتغل بشكل جشع (Greedy):\n\n1. ابدأ بمسافة 0 للعقدة الابتدائية ومسافة لا نهائية لكل العقد التانية.\n2. اختار العقدة اللي ليها أصغر مسافة مؤقتة.\n3. حدّث مسافات جيرانها: لو المسار الجديد أقصر، استبدل.\n4. كرر لحد ما تخلص كل العقد.\n\nبنستخدم **طابور أولوية** (Priority Queue) عشان نلاقي العقدة الأصغر بسرعة.",
      },
      {
        heading: "ليه لازم أوزان موجبة؟",
        body: "لو فيه حافة بوزن سالب، Dijkstra ممكن تاخد قرار خاطئ: ممكن تكون عقدة اتحددت بمسافة صغيرة لكن فجأة يظهر مسار أقصر منها عبر الوزن السالب. في الحالة دي بنستخدم خوارزمية Bellman-Ford اللي بتدعم الأوزان السالبة.",
      },
      {
        heading: "استرجاع المسار نفسه",
        body: "قبل ما نحدّث مسافة عقدة، بنحفظ العقدة اللي جت منها (Parent). بعد ما نخلص، نرجع من العقدة الهدف للبداية عبر الـ Parents ونعكس القائمة — كده نلاقي المسار كامل مش بس المسافة.",
      },
      {
        heading: "التعقيد",
        body: "باستخدام طابور أولوية، تعقيد Dijkstra هو `O((V + E) log V)` حيث V عدد العقد و E عدد الحواف. ده سريع جداً ومناسب للرسوم الكبيرة.",
      },
    ],
    code: [
      {
        title: "Dijkstra مع استرجاع المسار",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

typedef pair<int, int> pii; // (المسافة، العقدة)

vector<int> dijkstra(const vector<vector<pii>>& graph, int start, vector<int>& parent) {
    int n = graph.size();
    vector<int> dist(n, numeric_limits<int>::max());
    dist[start] = 0;
    parent.assign(n, -1);

    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();
        if (d > dist[u]) {
            continue;
        }
        for (auto edge : graph[u]) {
            int v = edge.first;
            int w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    int n = 5;
    vector<vector<pii>> graph(n);
    graph[0] = {{1, 4}, {2, 1}};
    graph[1] = {{3, 1}};
    graph[2] = {{1, 2}, {3, 5}};
    graph[3] = {{4, 3}};
    graph[4] = {};

    vector<int> parent;
    vector<int> dist = dijkstra(graph, 0, parent);

    cout << "المسافات من العقدة 0:" << endl;
    for (int i = 0; i < n; i++) {
        cout << "إلى " << i << ": " << dist[i] << endl;
    }

    // استرجاع المسار إلى العقدة 4
    vector<int> path;
    for (int at = 4; at != -1; at = parent[at]) {
        path.push_back(at);
    }
    cout << "المسار إلى 4: ";
    for (int i = (int)path.size() - 1; i >= 0; i--) {
        cout << path[i];
        if (i > 0) {
            cout << " -> ";
        }
    }
    cout << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الشرط الأساسي عشان خوارزمية Dijkstra تشتغل صح؟",
        options: [
          "الرسم يكون موجّه",
          "كل أوزان الحواف تكون غير سالبة",
          "الرسم يكون غير دوري",
          "كل العقد تكون متصلة",
        ],
        answer: 1,
        explanation: "وجود وزن سالب ممكن يخلّي القرار الجشع يتخذ مسار مش أمثل.",
      },
      {
        question: "بنستخدم إيه عشان نلاقي العقدة الأصغر مسافة بسرعة في Dijkstra؟",
        options: ["مصفوفة مرتّبة", "طابور أولوية", "طابور عادي", "مكدس"],
        answer: 1,
        explanation: "طابور الأولوية بيخرج العنصر الأصغر في كل مرة، وده أساس كفاءة الخوارزمية.",
      },
      {
        question: "إيه الغرض من مصفوفة الـ Parent؟",
        options: [
          "حفظ الأوزان",
          "استرجاع المسار الفعلي بعد حساب المسافات",
          "عدّ العقد",
          "تخزين العقد المجاورة",
        ],
        answer: 1,
        explanation: "بنحفظ من كل عقدة جت، وبعدين نرجع بيها من الهدف للبداية.",
      },
    ],
    exercise:
      "أضف خاصية تبديل الخطوط: لو غيّرت الخط في مسارك، زوّد 5 دقايق غرامة. عدّل الرسم والخوارزمية عشان تحسبها.",
    terms: [
      { en: "Dijkstra", ar: "خوارزمية أقصر مسار من مصدر واحد في رسم بأوزان غير سالبة." },
      { en: "Priority Queue", ar: "طابور أولوية: بنية بيانات بتخرج العنصر الأصغر (أو الأكبر) أولاً." },
      { en: "Edge Weight", ar: "وزن الحافة: رقم بيمثل التكلفة أو المسافة بين عقدتين." },
      { en: "Relaxation", ar: "الاسترخاء: تحديث مسافة عقدة لو لقينا مسار أقصر لها." },
    ],
  },
  {
    id: "dynamic-programming",
    title: "البرمجة الديناميكية Dynamic Programming",
    titleEn: "Dynamic Programming",
    duration: "60 دقيقة",
    description:
      "البرمجة الديناميكية: تقنية بتوفر وقت ضخم عن طريق تخزين حلول المشاكل الفرعية وإعادة استخدامها — هنطبقها على فيبوناتشي وحقيبة الظهر.",
    sections: [
      {
        heading: "المشكلة: الحساب المتكرر",
        body: "افترض عايز تحسب `fib(5)`. بالتعريف العادي، `fib(5) = fib(4) + fib(3)`، وكل واحدة فيهم بتتفكك لأصغر. المشكلة إن `fib(3)` اتحسبت مرتين، و`fib(2)` اتحسبت 3 مرات. كل ما كبر العدد، الاتعاب بتتضاعف بشكل أسي `O(2^n)`.\n\nالبرمجة الديناميكية بتقول: **سيب نتيجة كل مشكلة فرعية في جدول، ولو احتجتها تاني خدها على طول.**",
      },
      {
        heading: "التخزين المؤقت من فوق لتحت (Memoization)",
        body: "بنكتب الحل العادي بالاستدعاء الذاتي، لكن قبل ما نحسب أي قيمة نسأل: هل حسبتها قبل كده؟ لو أيوة نرجع القيمة المخزّنة. لو لأ نحسبها ونخزّنها.\n\nدي أبسط طريقة لتطبيق DP، وبتوصل لتعقيد `O(n)` بدل `O(2^n)`.",
      },
      {
        heading: "الجدول من تحت لفوق (Tabulation)",
        body: "بدل الاستدعاء الذاتي، بنملي جدول (مصفوفة) من أول قيمة لحد القيمة المطلوبة، وكل خانة تعتمد على الخانات السابقة.\n\nالجدول ده بيخلينا نتحكم في ترتيب الحساب ونوفر مكدس الاستدعاء، وده غالباً أسرع في التنفيذ.",
      },
      {
        heading: "مثال كلاسيكي: حقيبة الظهر 0/1",
        body: "عندك حقيبة سعة `W` و`n` عنصر، كل عنصر ليه وزن وقيمة. عايز تختار عناصر بأكبر قيمة مجموع أوزانها لا يتجاوز السعة، وكل عنصر ممكن تاخده مرة واحدة بس.\n\nبنبني الجدول `dp[i][w]` = أكبر قيمة ممكنة باستخدام أول `i` عنصر وسعة `w`. لكل عنصر عندنا اختيارين: ناخده أو نسيبه.",
      },
      {
        heading: "قواعد الذهب للبرمجة الديناميكية",
        body: "1. حدد المشكلة الفرعية بوضوح.\n2. اكتب العلاقة التكرارية (Recurrence).\n3. ابدأ من الحالة الأساسية واملأ الجدول.\n4. تأكد إن الترتيب صح — كل خانة تعتمد على خانات اتحسبت قبل كده.",
      },
    ],
    code: [
      {
        title: "فيبوناتشي: ميمزة مقابل جدولة",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

long long fibMemo(int n, vector<long long>& memo) {
    if (n <= 1) {
        return n;
    }
    if (memo[n] != -1) {
        return memo[n];
    }
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

long long fibIterative(int n) {
    if (n <= 1) {
        return n;
    }
    vector<long long> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

int main() {
    int n = 40;
    vector<long long> memo(n + 1, -1);
    cout << "fib(40) بالميمزة = " << fibMemo(n, memo) << endl;
    cout << "fib(40) بالتابوليشن = " << fibIterative(n) << endl;
    return 0;
}`,
      },
      {
        title: "حقيبة الظهر 0/1",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int knapsack(int capacity, const vector<int>& weights, const vector<int>& values) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (weights[i - 1] <= w) {
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            }
        }
    }
    return dp[n][capacity];
}

int main() {
    vector<int> weights = {2, 3, 4, 5};
    vector<int> values = {3, 4, 5, 6};
    int capacity = 8;
    cout << "أقصى قيمة = " << knapsack(capacity, weights, values) << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق الرئيسي بين البرمجة الديناميكية والاستدعاء الذاتي العادي؟",
        options: [
          "DP بتستخدم العمليات الحسابية بس",
          "DP بتخزن حلول المشاكل الفرعية عشان من تحسبهاش مرتين",
          "DP أسرع في كل الحالات بدون استثناء",
          "DP بتشتغل مع المصفوفات فقط",
        ],
        answer: 1,
        explanation: "تخزين النتائج هو جوهر البرمجة الديناميكية وبيقلل التعقيد الأسي لتعقيد كثير الحدود (Polynomial) زي O(n) أو O(n×W).",
      },
      {
        question: "في مسألة حقيبة الظهر، إيه معنى `dp[i][w]`؟",
        options: [
          "وزن العنصر رقم i",
          "أكبر قيمة بأول i عنصر وسعة w",
          "عدد العناصر اللي هتدخل",
          "السعة المتبقية",
        ],
        answer: 1,
        explanation: "الجدول بيخزن الحل الأمثل لكل مشكلة فرعية مكونة من أول i عنصر وسعة w.",
      },
      {
        question: "ليه فيبوناتشي العادي بطيء جداً؟",
        options: [
          "لأنه بيستخدم الذاكرة كتير",
          "لأنه بيحسب نفس المشاكل الفرعية عدة مرات",
          "لأن C++ بطيء",
          "لأنه بيحتاج أرقام عشرية",
        ],
        answer: 1,
        explanation: "الشجرة التكرارية بتعيد حساب نفس القيم بشكل أسي.",
      },
    ],
    exercise:
      "اكتب حل البرمجة الديناميكية لمسألة أطول سلسلة مشتركة (LCS) بين نصين، واطبع طول السلسلة.",
    terms: [
      { en: "Dynamic Programming", ar: "برمجة ديناميكية: تقنية حل المشكلة بحل مشاكلها الفرعية وتخزين حلولها." },
      { en: "Memoization", ar: "تخزين مؤقت: حفظ نتائج المشاكل الفرعية لتفادي إعادة الحساب." },
      { en: "Tabulation", ar: "جدولة: ملء جدول من تحت لفوق بترتيب محدد." },
      { en: "Subproblem", ar: "مشكلة فرعية: نسخة أصغر من المشكلة الأصلية بتتستخدم في حلها." },
    ],
  },
  {
    id: "greedy",
    title: "الخوارزميات الجشعة Greedy",
    titleEn: "Greedy Algorithms",
    duration: "45 دقيقة",
    description:
      "الخوارزميات الجشعة بتقرر في كل خطوة الحل الأمثل المحلي على أمل إن ده يوصّل للحل الأمثل الكلي — هتتعلم متى تثق فيها ومتى تخاف منها.",
    sections: [
      {
        heading: "فكرة الجشع",
        body: "الخوارزمية الجشعة (Greedy) بترجع كل شوية أحسن اختيار متاح قدامها من غير ما تفكر في النتيجة النهائية. يعني بتختار الأمثل **محلياً** وتأمل إن الاختيارات دي توصّل للأمثل **عالمياً**.\n\nالجشع بيستخدم في مواقف كتير: فكّ العملات، اختيار الأنشطة، شجرة الامتداد الأصغر، وضغط البيانات.",
      },
      {
        heading: "متى ينجح الجشع؟",
        body: "الجشع بينجح لما المشكلة يكون فيها خاصية **الاختيار الجشع** (Greedy Choice Property): القرار الأمثل المحلي بيضمن الحل الأمثل الكلي.\n\nمثال: اختيار الأنشطة — لو رتّبنا الأنشطة بوقت الانتهاء واختارنا النشاط اللي بيخلص بدري، بنضمن أكبر عدد أنشطة غير متداخلة.",
      },
      {
        heading: "متى يفشل الجشع؟",
        body: "في مسائل كتير، القرار الأمثل المحلي مش بيوصّل للحل الأمثل. مثلاً مسألة حقيبة الظهر 0/1: اختيار العنصر الأعلى قيمة للكيلوغرام ممكن يضيع مساحة أفضل استخدامها في عناصر تانية.\n\nفي الحالة دي لازم نلجأ للبرمجة الديناميكية. القاعدة: لو كل مشكلة فرعية مستقلة، جرب الجشع؛ لو القرارات مربوطة ببعضها، فكّكها بـ DP.",
      },
      {
        heading: "مثال: اختيار الأنشطة",
        body: "عندك مجموعة أنشطة كل واحد ليه وقت بداية ونهاية. عايز تختار أكبر عدد أنشطة تقدر تعملها من غير تعارض.\n\nالحل الجشع: رتّب الأنشطة تصاعدياً بوقت النهاية، وابدأ بأول نشاط، وبعدين اختار كل نشاط بدايته بعد نهاية النشاط اللي اخترته.",
      },
      {
        heading: "مثال: فكّ العملات",
        body: "عشان تدفع مبلغ معين بأقل عدد عملات، ابدأ بأكبر فئة أقل من المبلغ، واستخدم قد ما تقدر منها، وبعدين انتقل للفئة الأصغر.\n\nالخوارزمية بتشتغل صح مع الفئات الحقيقية (25، 10، 5، 1 مثلاً)، لكنها **مش مضمونة** مع فئات غريبة زي (10، 7، 1) لمبلغ 14: الجشع هياخد 10 + 1 + 1 + 1 + 1 = 5 عملات، بينما الحل الأمثل 7 + 7 = عملتين.",
      },
    ],
    code: [
      {
        title: "اختيار الأنشطة الجشع",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Activity {
    int start;
    int finish;
};

bool compareActivities(const Activity& a, const Activity& b) {
    return a.finish < b.finish;
}

vector<Activity> selectActivities(vector<Activity> activities) {
    sort(activities.begin(), activities.end(), compareActivities);
    vector<Activity> selected;
    selected.push_back(activities[0]);
    int lastFinish = activities[0].finish;

    for (size_t i = 1; i < activities.size(); i++) {
        if (activities[i].start >= lastFinish) {
            selected.push_back(activities[i]);
            lastFinish = activities[i].finish;
        }
    }
    return selected;
}

int main() {
    vector<Activity> activities = {
        {1, 4}, {3, 5}, {0, 6}, {5, 7}, {3, 8},
        {5, 9}, {6, 10}, {8, 11}, {8, 12}, {2, 13}, {12, 14}
    };
    vector<Activity> selected = selectActivities(activities);
    cout << "عدد الأنشطة المختارة: " << selected.size() << endl;
    cout << "الأنشطة:" << endl;
    for (const Activity& a : selected) {
        cout << "(" << a.start << " , " << a.finish << ")" << endl;
    }
    return 0;
}`,
      },
      {
        title: "فكّ العملات الجشع",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

int minCoins(int amount, const vector<int>& coins) {
    int count = 0;
    for (size_t i = 0; i < coins.size() && amount > 0; i++) {
        if (coins[i] <= amount) {
            int used = amount / coins[i];
            count += used;
            amount %= coins[i];
            cout << used << " عملة من فئة " << coins[i] << endl;
        }
    }
    return amount == 0 ? count : -1;
}

int main() {
    vector<int> coins = {25, 10, 5, 1}; // مرتبة تنازلياً
    int amount = 63;
    int result = minCoins(amount, coins);
    cout << "أقل عدد عملات: " << result << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفكرة الأساسية للخوارزمية الجشعة؟",
        options: [
          "تجرّب كل الاحتمالات",
          "تختار الحل الأمثل المحلي في كل خطوة",
          "تقسم المشكلة لمشاكل فرعية",
          "تستخدم جدول تخزين",
        ],
        answer: 1,
        explanation: "الجشع بياخد أحسن قرار حالي من غير تفكير في المستقبل.",
      },
      {
        question: "لمبلغ 14 بعملات (10، 7، 1)، إيه عدد العملات اللي بترجعها الخوارزمية الجشعة؟",
        options: ["2", "4", "5", "14"],
        answer: 2,
        explanation: "الجشع يختار 10 ثم أربع عملات من فئة 1 = 5 عملات، بينما الحل الأمثل 7 + 7 = 2.",
      },
      {
        question: "في مسائل كتير، الخوارزمية الجشعة...",
        options: [
          "بترجع الحل الأمثل دايماً",
          "ممكن ترجع حل مش أمثل لأن القرار المحلي مش كافي",
          "أبطأ من البرمجة الديناميكية",
          "بتحتاج ذاكرة أكبر",
        ],
        answer: 1,
        explanation: "الأمثل المحلي مش دايماً بيوصّل للأمثل الكلي، وده الفرق بينها وبين DP.",
      },
    ],
    exercise:
      "اكتب برنامج يحسب أقل عدد عملات لمبلغ 63 باستخدام فئات (25، 10، 5، 1). بعدين جرّب فئات (10، 7، 1) مع مبلغ 14 وقارن الناتج بالحل الأمثل.",
    terms: [
      { en: "Greedy Algorithm", ar: "خوارزمية جشعة: بتعمل الاختيار الأمثل المحلي في كل خطوة." },
      { en: "Local Optimum", ar: "الأمثل المحلي: أحسن اختيار متاح في الخطوة الحالية." },
      { en: "Activity Selection", ar: "اختيار الأنشطة: مسألة اختيار أكبر عدد أنشطة غير متداخلة." },
      { en: "Optimal Substructure", ar: "البنية الأمثل الجزئية: خاصية إن الحل الأمثل للمشكلة يحتوي حلول أمثل لمشاكلها الفرعية." },
    ],
  },
  {
    id: "backtracking",
    title: "التتبع الخلفي Backtracking",
    titleEn: "Backtracking",
    duration: "50 دقيقة",
    description:
      "التتبع الخلفي: خوارزمية بترجع كل احتمال وتجرّب كل المسارات، وترجع لورا لما تلاقي الطريق مسدود — هتبني حل N-Queens ومجموع المجموعات.",
    sections: [
      {
        heading: "الفكرة: جرّب وتراجع",
        body: "التتبع الخلفي (Backtracking) طريقة لحل المسائل عن طريق بناء الحل خطوة بخطوة، وكل ما نلاقي نفسنا في طريق مسدود (اختيار مش صالح)، نتراجع عن آخر اختيار ونجرّب اختيار تاني.\n\nده في الأساس **بحث بعمق** في شجرة كل الاحتمالات (Search Tree)، لكن بنقصّ الأفرع اللي واضح إنها مش هتوصل لحل.",
      },
      {
        heading: "شجرة الاحتمالات",
        body: "تخيل إن كل قرار هو تفرّع في شجرة. في مسألة المجموعات مثلاً، كل عنصر عنده قرارين: ندخله في المجموعة أو نسيبه. الشجرة عندها `2^n` مسار، واحد لكل مجموعة ممكنة.\n\nالتتبع الخلفي بيلف على الشجرة بترتيب DFS، ولما يوصل لورقة (قرار كامل) يفحص هل الحل صالح.",
      },
      {
        heading: "قصّ الأفرع Pruning",
        body: "أحياناً نعرف من نص الطريق إن كل اللي بعده مش هيفيد. في الحالة دي نوقف فوراً من غير ما نكمل — ده اسمه **قصّ الأفرع** (Pruning).\n\nمثلاً في مسألة مجموع مجاميع: لو المجموع الحالي عدّى الهدف، نكملش في الاتجاه ده. القصّ بيوفّر وقت ضخم.",
      },
      {
        heading: "مثال: N-Queens",
        body: "مسألة الملكات N: حطّ N ملكة في رقعة N×N من غير ما تهدد بعضها. كل ملكة لازم تكون في صف مختلف، وفي عمود مختلف، ومش على نفس القطر.\n\nالخوارزمية: حطّ ملكة في العمود الأول من الصف الحالي، اتحقق من الأمان، لو تمام انتقل للصف اللي بعده، ولو كل الأعمدة فشلت تراجع للصف اللي قبله.",
      },
      {
        heading: "الفرق بينه وبين القوة الغاشمة",
        body: "القوة الغاشمة (Brute Force) بتجرّب كل الاحتمالات من غير أي ذكاء. التتبع الخلفي بيستخدم قيود المشكلة عشان يقصّ أفرع كاملة من شجرة الاحتمالات.\n\nالتعقيد في أسوأ الحالات بيفضل أسي، لكن في المتوسط بيكون أسرع بكثير من القوة الغاشمة.",
      },
    ],
    code: [
      {
        title: "مسألة N-Queens",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <cstdlib>
using namespace std;

bool isSafe(const vector<int>& board, int row, int col) {
    for (int i = 0; i < row; i++) {
        if (board[i] == col) {
            return false;
        }
        if (abs(board[i] - col) == abs(i - row)) {
            return false;
        }
    }
    return true;
}

void solveNQueens(vector<int>& board, int row, int n, int& count) {
    if (row == n) {
        count++;
        cout << "حل " << count << ":" << endl;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                cout << (board[i] == j ? "Q " : ". ");
            }
            cout << endl;
        }
        cout << endl;
        return;
    }

    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            solveNQueens(board, row + 1, n, count);
            board[row] = -1; // تراجع
        }
    }
}

int main() {
    int n = 4;
    vector<int> board(n, -1);
    int count = 0;
    solveNQueens(board, 0, n, count);
    cout << "عدد الحلول: " << count << endl;
    return 0;
}`,
      },
      {
        title: "مجموع المجموعات Subset Sum",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

void findSubsets(const vector<int>& nums, int index, int target,
                 vector<int>& current, vector<vector<int>>& results) {
    if (target == 0) {
        results.push_back(current);
        return;
    }
    if (index == (int)nums.size() || target < 0) {
        return; // قصّ الأفرع
    }

    // شامل العنصر الحالي
    current.push_back(nums[index]);
    findSubsets(nums, index + 1, target - nums[index], current, results);
    current.pop_back(); // تراجع

    // استبعاد العنصر الحالي
    findSubsets(nums, index + 1, target, current, results);
}

int main() {
    vector<int> nums = {2, 3, 6, 7};
    int target = 9;
    vector<int> current;
    vector<vector<int>> results;
    findSubsets(nums, 0, target, current, results);

    cout << "المجموعات اللي مجموعها " << target << ":" << endl;
    for (const auto& subset : results) {
        cout << "{ ";
        for (int x : subset) {
            cout << x << " ";
        }
        cout << "}" << endl;
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المعنى الدقيق للـ Backtracking؟",
        options: [
          "تجربة كل الاحتمالات مرة واحدة",
          "بناء الحل خطوة بخطوة والعودة عند الطريق المسدود",
          "فرز الاحتمالات الأول",
          "حذف الاحتمالات الغلط من الأول",
        ],
        answer: 1,
        explanation: "التراجع بيعني إنك تبني الحل تدريجياً وترجع خطوة لورا لو اختيارك الحالي مش صالح.",
      },
      {
        question: "في مسألة N-Queens، إيه الشرط اللي بيضمن إن ملكتين مش على نفس القطر؟",
        options: [
          "الفرق بين عموديهما يساوي صفر",
          "القيمة المطلقة للفرق بين عموديهما تساوي الفرق بين صفيهما",
          "الفرق بين صفيهما يساوي صفر",
          "العمودين متساويين",
        ],
        answer: 1,
        explanation: "لو فرق الصفوف = فرق الأعمدة، يبقى الملكتان على نفس القطر.",
      },
      {
        question: "قصّ الأفرع (Pruning) بيعمل إيه؟",
        options: [
          "يزيد عدد الاحتمالات",
          "يوقف الاستكشاف في الأفرع اللي مش ممكن توصل لحل",
          "يرتّب الشجرة",
          "يضيف قيود جديدة",
        ],
        answer: 1,
        explanation: "القصّ بيوقف الأفرع المسدودة بدري، فبيوفر وقت حسابي كبير.",
      },
    ],
    exercise:
      "اكتب دالة تحل مسألة مجموع المجموعات (Subset Sum) وتطبع كل المجموعات اللي مجموعها يساوي 9 للمصفوفة {2, 3, 6, 7}.",
    terms: [
      { en: "Backtracking", ar: "تتبع خلفي: استراتيجية بحث تبني الحل خطوة بخطوة وتتراجع عند الطريق المسدود." },
      { en: "Pruning", ar: "قصّ الأفرع: إيقاف استكشاف الأفرع اللي واضح إنها مش هتصل لحل." },
      { en: "Search Tree", ar: "شجرة البحث: تمثيل لكل الاحتمالات الممكنة على شكل شجرة قرارات." },
      { en: "N-Queens", ar: "مسألة الملكات: وضع N ملكة على رقعة N×N بدون تهديد متبادل." },
    ],
  },
  {
    id: "algorithms-project",
    title: "مشروع: مخطط مترو أنفاق بأقصر مسار",
    titleEn: "Project: Metro Shortest Path",
    duration: "80 دقيقة",
    description:
      "مشروع التخرج: تبني نظام مخطط مترو أنفاق بيحسب أقصر مسار ووقت الرحلة بين أي محطتين باستخدام Dijkstra.",
    sections: [
      {
        heading: "تحليل المشكلة",
        body: "الهدف: المستخدم يدخل محطة البداية ومحطة النهاية، والبرنامج يطبع أقصر مسار والوقت الكلي.\n\nالخطوات:\n1. مثّل المحطات كعقد في رسم بياني.\n2. مثّل خطوط المترو كحواف بأوزان (الوقت بالدقائق بين المحطات).\n3. استخدم Dijkstra لحساب أقصر مسافة من البداية لكل المحطات.\n4. استرجع المسار باستخدام مصفوفة الآباء.",
      },
      {
        heading: "تصميم البيانات",
        body: "هنحتاج حاجتين:\n\n- `vector<string> names` لتخزين أسماء المحطات، و`unordered_map<string, int> id` لتحويل الاسم لرقم.\n- `vector<vector<pair<int,int>>> graph` لقائمة الجوار، حيث كل حافة عبارة عن (المحطة التانية، الوقت).\n\nاستخدام خريطة من اسم لمتغير بيسهل ربط المدخلات النصية بالأرقام.",
      },
      {
        heading: "خوارزمية أقصر مسار",
        body: "Dijkstra هتتنفذ زي ما اتعلمنا: طابور أولوية بيختار أصغر مسافة، وتحديث المسافات والآباء.\n\nبعد ما نخلص، نبني المسار بالرجوع من الهدف للبداية عبر مصفوفة `parent`، وبعدين نعكسه.",
      },
      {
        heading: "اختبار المشروع",
        body: "جرّب إدخال محطتين وليكن \"التحرير\" و\"الفتح\". البرنامج لازم يطبع المسار والوقت.\n\nلو مسارك بيغيّر خط أكثر من مرة، تقدر تضيف **غرامة تبديل** (Transfer Penalty) زي 5 دقايق لكل خط جديدة، وتعدّل الأوزان حسب الخط.",
      },
      {
        heading: "توسعات ممكنة",
        body: "- إضافة محطات جديدة وخطوط جديدة بسهولة.\n- دعم أوقات الذروة بأوزان متغيرة.\n- عرض المسار على خريطة رسومية.\n- حساب التكلفة المالية بجانب الوقت.",
      },
    ],
    code: [
      {
        title: "مخطط المترو كامل",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <string>
#include <unordered_map>
using namespace std;

typedef pair<int, int> pii; // (الوقت، المحطة)

int main() {
    vector<string> names = {
        "التحرير", "الجامعه", "الزهراء", "المرج", "النور",
        "الحديقه", "السلام", "القاهره", "النصر", "الفتح"
    };
    int n = names.size();

    unordered_map<string, int> id;
    for (int i = 0; i < n; i++) {
        id[names[i]] = i;
    }

    vector<vector<pii>> graph(n);
    auto addEdge = [&](int a, int b, int w) {
        graph[a].push_back({b, w});
        graph[b].push_back({a, w});
    };

    // الخط الأحمر
    addEdge(id["التحرير"], id["الجامعه"], 3);
    addEdge(id["الجامعه"], id["الزهراء"], 4);
    addEdge(id["الزهراء"], id["المرج"], 5);

    // الخط الأزرق
    addEdge(id["النور"], id["الحديقه"], 2);
    addEdge(id["الحديقه"], id["السلام"], 3);
    addEdge(id["السلام"], id["القاهره"], 4);

    // الخط الأخضر
    addEdge(id["التحرير"], id["النور"], 2);
    addEdge(id["الجامعه"], id["الحديقه"], 3);
    addEdge(id["الزهراء"], id["السلام"], 3);
    addEdge(id["المرج"], id["القاهره"], 6);
    addEdge(id["القاهره"], id["النصر"], 2);
    addEdge(id["النصر"], id["الفتح"], 3);

    string startName, endName;
    cout << "محطة البداية: ";
    cin >> startName;
    cout << "محطة النهاية: ";
    cin >> endName;

    int start = id[startName];
    int goal = id[endName];

    vector<int> dist(n, numeric_limits<int>::max());
    vector<int> parent(n, -1);
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();
        if (d > dist[u]) {
            continue;
        }
        for (auto e : graph[u]) {
            int v = e.first;
            int w = e.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }

    if (dist[goal] == numeric_limits<int>::max()) {
        cout << "مفيش مسار بين المحطتين" << endl;
        return 0;
    }

    vector<int> path;
    for (int at = goal; at != -1; at = parent[at]) {
        path.push_back(at);
    }

    cout << "أقصر وقت: " << dist[goal] << " دقائق" << endl;
    cout << "المسار: ";
    for (int i = (int)path.size() - 1; i >= 0; i--) {
        cout << names[path[i]];
        if (i > 0) {
            cout << " -> ";
        }
    }
    cout << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "ليه بنمثّل محطات المترو كرسم بياني؟",
        options: [
          "عشان الرسم البياني بيشتغل مع النصوص",
          "عشان نقدر نستخدم خوارزميات أقصر مسار الجاهزة مثل Dijkstra",
          "عشان البرنامج يبقى أطول",
          "مفيش سبب",
        ],
        answer: 1,
        explanation: "الرسم البياني هو التمثيل الطبيعي للمحطات والخطوط، وبيسمح لنا بتطبيق Dijkstra مباشرة.",
      },
      {
        question: "إيه دور مصفوفة الـ Parent في المشروع؟",
        options: [
          "تخزين أوقات الرحلات",
          "استرجاع المسار الفعلي بعد حساب المسافات",
          "عدّ المحطات",
          "حفظ أسماء المحطات",
        ],
        answer: 1,
        explanation: "بنحفظ من كل محطة جت، وبعدين نرجع بيها من الهدف للبداية.",
      },
      {
        question: "لو عايز تضيف غرامة تبديل خطوط، فين بتعدّل؟",
        options: [
          "في أسماء المحطات",
          "في أوزان الحواف حسب الخط",
          "في طابور الأولوية",
          "في دالة الطباعة",
        ],
        answer: 1,
        explanation: "الغرامة بتتمثل كوزن إضافي على الحواف اللي بتعبر بين الخطوط.",
      },
    ],
    exercise:
      "وسّع المشروع: أضف حساب عدد تبديلات الخطوط في المسار، واطبع عدد التبديلات مع الوقت الكلي.",
    terms: [
      { en: "Weighted Graph", ar: "رسم بياني مرجّح: رسم تكون فيه الحواف ليها أوزان أو تكاليف." },
      { en: "Transfer Penalty", ar: "غرامة التبديل: وقت إضافي بيتضاف لما بتغيّر خط المترو." },
      { en: "Path Reconstruction", ar: "استرجاع المسار: بناء المسار الفعلي من مصفوفة الآباء بعد حساب المسافات." },
      { en: "Adjacency List", ar: "قائمة الجوار: تمثيل الرسم البياني بقوائم لكل عقدة وجيرانها." },
    ],
  },
];
