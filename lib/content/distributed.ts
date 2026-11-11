import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "distributed-intro",
    title: "ما هي الأنظمة الموزعة؟",
    titleEn: "What are Distributed Systems?",
    duration: "45 دقيقة",
    description:
      "من جهاز واحد لمجموعة أجهزة بتشتغل كفريق: تعريف الأنظمة الموزعة ومزاياها وتحدياتها.",
    sections: [
      {
        heading: "من جهاز واحد لمجموعة أجهزة",
        body: "في بداية الكمبيوتر، كان كل حاجة بتشتغل على جهاز واحد. كان عندك CPU واحد وذاكرة واحدة وقرص واحد. لو الجهاز ده وقف، كل حاجة بتوقف.\n\nمع الوقت، بقى عندنا شبكات بتوصل أجهزة كتير ببعض. ظهرت فكرة بسيطة: بدل ما نشغل خدمة على جهاز واحد، نشغلها على مجموعة أجهزة تتشارك الشغل. ده هو **النظام الموزع (Distributed System)**.",
      },
      {
        heading: "تعريف النظام الموزع",
        body: "**النظام الموزع** هو مجموعة من أجهزة الكمبيوتر المستقلة اللي بتبدو للمستخدم كنظام واحد متسق.\n\nلاحظ الكلمات المفتاحية:\n\n- **مستقلة:** كل جهاز ليه ذاكرته ومعالجه — مفيش ذاكرة مشتركة.\n- **بتبدو كنظام واحد:** المستخدم مش بيحس إن الخدمة موزعة على 50 جهاز.\n- **متسق:** البيانات لازم تبقى متسقة بين الأجهزة.\n\nأمثلة: Google Search، وNetflix، وأي خدمة سحابية.",
      },
      {
        heading: "ليه بنلجأ للأنظمة الموزعة؟",
        body: "- **التوسع (Scalability):** لو الخدمة بقت تحمل مليون مستخدم، مش هتقدر تشتري كمبيوتر واحد يلفهم — لكن تقدر تضيف أجهزة.\n- **تحمل الفشل (Fault Tolerance):** لو جهاز من 100 مات، الخدمة تكمل شغالة. المستخدم مش هيحس بأي حاجة.\n- **التوزيع الجغرافي (Geographic Distribution):** تقدر تنشر الخدمة قريب من المستخدمين في أوروبا وآسيا وأمريكا، فالرد يبقى أسرع.\n- **التكلفة:** أجهزة عادية كتير أرخص من جهاز عملاق واحد.",
      },
      {
        heading: "التحديات الأساسية",
        body: "- **الشبكة غير موثوقة:** الرسائل ممكن تتأخر أو تضيع. مفيش ضمان إن الرسالة وصلت.\n- **التأخير (Latency):** الاتصال بين الأجهزة بياخد وقت، حتى لو ميكروثانية.\n- **الفشل الجزئي (Partial Failure):** جهاز واحد ممكن يفشل والتاني يفضل شغال. لازم النظام يتعامل مع الحالة دي.\n- **التوافق (Consistency):** البيانات لازم تبقى متسقة بين الأجهزة، وده أصعب بكتير من جهاز واحد.\n\nالقاعدة الذهبية في الأنظمة الموزعة: **افترض إن الشبكة هتفشل دايماً.**",
      },
      {
        heading: "مثال: محاكاة نظام موزع بسيط",
        body: "هنكتب محاكاة لمجموعة أجهزة (Nodes) بتتخزن عليها بيانات، واحد بيفشل. الكود بيوضح مفهوم الفشل الجزئي وإزاي النظام بيفضل شغال.",
      },
    ],
    code: [
      {
        title: "محاكاة نظام موزع مع فشل عقدة",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Node {
    string name;
    bool alive;
    vector<string> data;
public:
    Node(const string& n) : name(n), alive(true) {}

    void store(const string& value) { data.push_back(value); }
    vector<string> read() const { return data; }
    void kill() { alive = false; }
    bool isAlive() const { return alive; }
    string getName() const { return name; }
};

int main() {
    vector<Node> nodes = {Node("node-1"), Node("node-2"), Node("node-3")};

    nodes[0].store("key1=value1");
    nodes[1].store("key2=value2");
    nodes[2].store("key3=value3");

    nodes[1].kill(); // محاكاة فشل عقدة

    cout << "حالة العقد:" << endl;
    for (const Node& n : nodes) {
        cout << "  " << n.getName() << ": "
             << (n.isAlive() ? "يعمل" : "فشل") << endl;
    }

    // النظام بيفضل شغال رغم فشل عقدة واحدة
    cout << "النظام ما زال يعمل — بيانات node-1: "
         << nodes[0].read()[0] << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه تعريف النظام الموزع؟",
        options: [
          "مجموعة أجهزة مستقلة بتبدو للمستخدم كنظام واحد متسق",
          "جهاز واحد قوي جداً",
          "شبكة إنترنت",
          "برنامج واحد",
        ],
        answer: 0,
        explanation: "الأنظمة الموزعة بتجمع أجهزة كتير وتخليها تبدو كنظام واحد.",
      },
      {
        question: "إيه التحدي الأكبر في الأنظمة الموزعة؟",
        options: [
          "الشبكة غير موثوقة والفشل الجزئي صعب التعامل معه",
          "عدم وجود لغة برمجة مناسبة",
          "صعوبة كتابة الكود",
          "بطء المعالج",
        ],
        answer: 0,
        explanation: "الشبكة ممكن تفشل في أي وقت، وده بيعقّد كل حاجة.",
      },
      {
        question: "إيه الفرق بين Scalability و Fault Tolerance؟",
        options: [
          "Scalability قدرة على النمو، و Fault Tolerance قدرة على الاستمرار رغم الفشل",
          "الاتنين نفس الحاجة",
          "Scalability للصوت و Fault Tolerance للصور",
          "مفيش فرق",
        ],
        answer: 0,
        explanation: "التوسع بيتيح إضافة أجهزة، وتحمل الفشل بيضمن استمرار الخدمة.",
      },
    ],
    exercise:
      "وسّع المحاكاة: أضف خاصية إن البيانات المنسخة على العقدة اللي فشلت تنتقل لعقدة تانية تلقائياً. استخدم قايمة بـ \"أسماء العقد المكررة\".",
    terms: [
      { en: "Distributed System", ar: "نظام موزع: مجموعة أجهزة مستقلة بتبدو للمستخدم كنظام واحد." },
      { en: "Scalability", ar: "قابلية التوسع: قدرة النظام على النمو بزيادة الأجهزة لمواجهة حمل أكبر." },
      { en: "Fault Tolerance", ar: "تحمل الفشل: قدرة النظام على الاستمرار في العمل رغم فشل بعض أجزائه." },
      { en: "Node", ar: "عقدة: جهاز كمبيوتر واحد داخل النظام الموزع." },
    ],
  },
  {
    id: "rpc",
    title: "نداءات الإجراءات البعيدة RPC",
    titleEn: "Remote Procedure Calls",
    duration: "50 دقيقة",
    description:
      "نداء دالة على جهاز تاني سايبه زي نداء دالة محلية: الـ Stub والـ Marshalling ونماذج RPC الحديثة.",
    sections: [
      {
        heading: "إيه RPC؟",
        body: "**نداء الإجراءات البعيدة (Remote Procedure Call - RPC)** هو آلية بتسمح للبرنامج ينفذ دالة على جهاز تاني وكأنها دالة محلية.\n\nمثال: بدل ما تكتب كود معقد عشان تفتح اتصال الشبكة وتبعت رسالة وتستنى الرد، بتنادي دالة `getUserData(42)` والرد يجي زي نداء دالة عادية.\n\nالفكرة ظهرت في الثمانينات، ومنذ ذلك الحين بقت أساس الأنظمة الموزعة. gRPC من Google وThrift من Facebook أمثلة حديثة.",
      },
      {
        heading: "إزاي بيشتغل RPC؟",
        body: "الرحلة من العميل للخادم وبالعكس:\n\n1. **الـ Client Stub:** نسخة محلية من الدالة البعيدة، بتستقبل البارامترات.\n2. **الـ Marshalling:** تحويل البارامترات لصيغة قابلة للإرسال (زي JSON أو Protobuf).\n3. **الإرسال:** عبر الشبكة للخادم.\n4. **الـ Server Stub:** يستقبل الطلب ويفك تجميع البارامترات.\n5. **التنفيذ:** تنفيذ الدالة الحقيقية على الخادم.\n6. **الرد:** تحويل النتيجة وإرسالها للعميل.\n\nكل ده بيحصل في أجزاء من الثانية وفي الغالب المستخدم مش بيحس بيه.",
      },
      {
        heading: "الـ Marshalling",
        body: "**الـ Marshalling** هو تحويل البيانات من صيغة البرنامج لصيغة قابلة للإرسال والعكس. ليه محتاجين ده؟\n\nلأن الأجهزة ممكن يكون عندها معماريات مختلفة: واحد 32-bit والتاني 64-bit، واحد little-endian والتاني big-endian. التحويل بيوحد الصيغة.\n\nصيغ شهيرة:\n\n- **JSON:** نص سهل القراءة، لكن كبير الحجم.\n- **Protobuf:** ثنائي (Binary) صغير وسريع — من Google.\n- **XML:** قديم وثقيل.\n\ngRPC بيستخدم Protobuf، فالسرعة بتكون ممتازة.",
      },
      {
        heading: "نماذج RPC الحديثة",
        body: "- **gRPC:** من Google، بيستخدم HTTP/2 وProtobuf. سريع ومناسب للميكروسكيفيس.\n- **Apache Thrift:** من Facebook، بيدعم لغات كتيرة.\n- **JSON-RPC:** بسيط ومبني على JSON.\n- **XML-RPC:** النسخة القديمة.\n\nالمقارنة مع REST: REST بيستخدم HTTP مباشرة، وRPC بيستخدم طبقة تجريد أعلى. RPC أسرع عادة لكن REST أسهل في التصحيح.",
      },
      {
        heading: "مثال: RPC مبسط",
        body: "هنكتب محاكاة كاملة لـ RPC: خادم عنده دوال، وعميل بيتصل بيها عن طريق Stub. الكود بيوضح رحلة الطلب من العميل للخادم.",
      },
    ],
    code: [
      {
        title: "محاكاة RPC: عميل وخادم و Stub",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

// الخادم: عنده الدوال الحقيقية
class Server {
public:
    int add(int a, int b) { return a + b; }
    string greet(const string& name) { return "أهلاً يا " + name; }
};

// العميل: الـ Stub بيمثّل الدالة البعيدة
class RpcClient {
    Server& server;
public:
    RpcClient(Server& s) : server(s) {}

    int add(int a, int b) {
        cout << "[Client] إرسال طلب add(" << a << ", " << b << ")" << endl;
        int result = server.add(a, b);
        cout << "[Client] استلام النتيجة: " << result << endl;
        return result;
    }

    string greet(const string& name) {
        cout << "[Client] إرسال طلب greet(" << name << ")" << endl;
        string result = server.greet(name);
        cout << "[Client] استلام الرد: " << result << endl;
        return result;
    }
};

int main() {
    Server server;
    RpcClient client(server);

    int sum = client.add(10, 20);
    string msg = client.greet("أحمد");

    cout << "النتيجة النهائية: " << sum << " | " << msg << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين RPC ونداء الدالة المحلي؟",
        options: [
          "RPC بينفذ الدالة على جهاز تاني عبر الشبكة، والنداء المحلي على نفس الجهاز",
          "الاتنين نفس الحاجة",
          "RPC أبطأ دائماً",
          "RPC للألعاب بس",
        ],
        answer: 0,
        explanation: "RPC بيستخدم الشبكة عشان ينفذ الدالة على خادم بعيد.",
      },
      {
        question: "إيه وظيفة الـ Stub؟",
        options: [
          "تمثيل الدالة البعيدة محلياً وتحويل البارامترات والإرسال واستقبال الرد",
          "تخزين البيانات",
          "رسم الصور",
          "تشغيل الصوت",
        ],
        answer: 0,
        explanation: "الـ Stub هو الوسيط اللي بيخلي النداء البعيد يبدو زي النداء المحلي.",
      },
      {
        question: "إيه المقصود بـ Marshalling؟",
        options: [
          "تحويل البيانات من صيغة البرنامج لصيغة قابلة للإرسال عبر الشبكة",
          "تشفير البيانات",
          "ضغط الملفات",
          "رسم البيانات",
        ],
        answer: 0,
        explanation: "Marshalling بيضمن إن البيانات تتفهم على الجهة التانية رغم اختلاف المعمارية.",
      },
    ],
    exercise:
      "اكتب محاكاة RPC بيدعم إرسال مصفوفة من الأرقام (بدل int واحد)، وطبّق Marshalling بتحويل المصفوفة لسلسلة نصية مفصولة بفواصل.",
    terms: [
      { en: "RPC", ar: "نداء إجراء بعيد: آلية بتنفذ دالة على جهاز تاني وكأنها دالة محلية." },
      { en: "Stub", ar: "شبح: نسخة محلية من الدالة البعيدة بترجع النداء للخادم وتجيب الرد." },
      { en: "Marshalling", ar: "تحويل: تحويل البيانات من صيغة البرنامج لصيغة قابلة للإرسال." },
      { en: "Client/Server", ar: "عميل/خادم: نموذج معماري فيه العميل يطلب والخادم يوفر الخدمة." },
    ],
  },
  {
    id: "consensus",
    title: "الإجماع والتوافق Consensus",
    titleEn: "Consensus",
    duration: "55 دقيقة",
    description:
      "إزاي مجموعة أجهزة تتفاهم على قرار واحد رغم إن بعضهم ممكن يفشل: خوارزمية Raft والـ Leader Election.",
    sections: [
      {
        heading: "مشكلة الإجماع",
        body: "**مشكلة الإجماع (Consensus Problem)** هي إنك توصل مجموعة أجهزة على قيمة واحدة رغم اختلافاتهم واحتمال فشل بعضهم.\n\nمثال: عندك 3 خوادم لقاعدة بيانات. مستخدم كتب `x = 5`. لازم الخوادم الثلاثة يتفقوا إن `x` بقت 5. لو واحد منهم فشل، الإجماع لسه لازم يحصل بين الباقي.\n\nالمشكلة صعبة لأن الشبكة غير موثوقة: ممكن رسالة توصل وممكن تضيع. وممكن جهاز يفشل في أي لحظة.",
      },
      {
        heading: "خوارزمية Raft: الفكرة العامة",
        body: "**Raft** هي خوارزمية إجماع ظهرت سنة 2014، صممت عشان تكون سهلة الفهم مقارنة بـ Paxos (اللي كانت صعبة جداً).\n\nالفكرة: بنختار **قائد (Leader)** واحد. القائد هو اللي يستقبل الطلبات من العملاء ويوزعها على **التابعين (Followers)**. لو القائد فشل، بنعمل انتخابات جديدة.\n\nRaft مضمونة إنها بترجع نتيجة صحيحة طالما الأغلبية (Majority) من الأجهزة شغالة — مثلاً 3 من 5.",
      },
      {
        heading: "القائد والـ Follower",
        body: "- **القائد (Leader):** جهاز واحد عنده السلطة. كل الطلبات بتمر عليه، وبيوزع السجل (Log) على التابعين.\n- **التابع (Follower):** جهاز بيسمع القائد ويتنفيذ أوامره. لو مبعوتله حاجة من مدة، بيتحول لمرشح (Candidate) ويعمل انتخابات.\n- **المرشح (Candidate):** دور مؤقت وقت الانتخابات — بيطلب الأصوات من الباقي.\n\nالقاعدة: مفيش أكتر من قائد واحد في نفس الوقت، وده بيمنع تضارب القرارات.",
      },
      {
        heading: "الـ Terms والـ Log Replication",
        body: "**الـ Term** هو رقم زمني في Raft — كل فترة قيادة ليها رقم. لما القائد يتغير، الـ Term بيزيد.\n\n**Log Replication:** القائد عنده سجل بأسلسل العمليات. كل عملية جديدة بتتسجل عند القائد الأول، وبعدين بتتنسخ للتابعين. لما الأغلبية يأكدوا إنهم سجلوا العملية، القائد بينفذها ويقول للعملاء \"تمت\".\n\nده اللي بيضمن إن البيانات مش بتضيع حتى لو القائد فشل — السجل موجود عند الأغلبية.",
      },
      {
        heading: "مثال: محاكاة Raft مبسطة",
        body: "هنكتب محاكاة لثلاث عقد Raft: واحد بيعمل انتخابات ويبقى القائد، وبعدين بيضيف أوامر للسجل وينسخها للتابعين. الكود بيوضح دورة حياة القائد ببساطة.",
      },
    ],
    code: [
      {
        title: "محاكاة Raft: Leader Election و Log Replication",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

enum class Role { Follower, Candidate, Leader };

struct LogEntry {
    int term;
    string command;
};

class RaftNode {
    string name;
    Role role;
    int currentTerm;
    vector<LogEntry> log;

public:
    RaftNode(const string& n) : name(n), role(Role::Follower), currentTerm(0) {}

    void startElection() {
        role = Role::Candidate;
        currentTerm++;
        cout << name << " بدأ انتخابات في الجولة " << currentTerm << endl;
    }

    void becomeLeader() {
        role = Role::Leader;
        cout << name << " بقى القائد" << endl;
    }

    void appendEntry(const string& cmd) {
        log.push_back({currentTerm, cmd});
        cout << name << " أضاف أمر: " << cmd << endl;
    }

    void replicateTo(RaftNode& other) {
        if (role == Role::Leader) {
            other.log = log;
            cout << name << " نسخ السجل إلى " << other.name << endl;
        }
    }

    Role getRole() const { return role; }
};

int main() {
    RaftNode a("A"), b("B"), c("C");

    a.startElection();
    a.becomeLeader();

    a.appendEntry("x = 1");
    a.appendEntry("x = 2");

    a.replicateTo(b);
    a.replicateTo(c);

    cout << "تم توزيع السجل بنجاح" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه مشكلة الإجماع؟",
        options: [
          "اتفاق مجموعة أجهزة على قيمة واحدة رغم احتمال فشل بعضهم",
          "اختلاف البرامج",
          "بطء الشبكة",
          "عدم وجود قاعدة بيانات",
        ],
        answer: 0,
        explanation: "الإجماع هو تحدي الوصول لقرار مشترك في نظام موزع.",
      },
      {
        question: "إيه دور القائد في Raft؟",
        options: [
          "استقبال الطلبات وتوزيع السجل على التابعين",
          "إدارة الذاكرة",
          "رسم الصور",
          "تشغيل الصوت",
        ],
        answer: 0,
        explanation: "القائد هو نقطة التنسيق — كل الطلبات بتمر عليه.",
      },
      {
        question: "إيه اللي بيحصل لو القائد فشل؟",
        options: [
          "التابعين يعملوا انتخابات جديدة ويختاروا قائد جديد",
          "النظام يقف للأبد",
          "كل الأجهزة تمسح البيانات",
          "مفيش حاجة",
        ],
        answer: 0,
        explanation: "Raft مضمونة الاستمرار — التابعين بيعملوا انتخابات ويختاروا قائد جديد.",
      },
    ],
    exercise:
      "وسّع المحاكاة: أضف مؤقت نبض (Heartbeat) — القائد بيرسل رسالة كل فترة، ولو التابع ما استلمش Message من مدة، يتحول لمرشح ويعمل انتخابات.",
    terms: [
      { en: "Consensus", ar: "إجماع: اتفاق مجموعة أجهزة على قيمة واحدة رغم الفشل المحتمل." },
      { en: "Raft", ar: "خوارزمية إجماع: سهلة الفهم، بتعتمد على قائد ونسخ السجل." },
      { en: "Leader Election", ar: "انتخاب القائد: العملية اللي بتختار قائداً واحداً من بين العقد." },
      { en: "Log Replication", ar: "نسخ السجل: توزيع سجل العمليات من القائد على التابعين." },
    ],
  },
  {
    id: "distributed-project",
    title: "مشروع: نظام موزع بسيط",
    titleEn: "Project: Simple Distributed System",
    duration: "80 دقيقة",
    description:
      "المشروع الختامي: بناء مخزن مفتاح-قيمة موزع بالتجزئة المتسقة والتكرار — قلب أي نظام حديث.",
    sections: [
      {
        heading: "فكرة المشروع",
        body: "هنبني **مخزن مفتاح-قيمة موزع (Distributed Key-Value Store)** — زي نسخة مبسطة من Redis أو etcd.\n\nالمخزن بيسمح بحفظ البيانات على شكل أزواج: `مفتاح -> قيمة`. بنستخدم المفتاح عشان نعرف أنهي عقدة تخزن البيانات، وبنكرر البيانات على عقدة إضافية عشان تحمل الفشل.",
      },
      {
        heading: "التجزئة المتسقة (Consistent Hashing)",
        body: "**التجزئة المتسقة (Consistent Hashing)** هي طريقة لتحديد أنهي عقدة تخزن مفتاح معين. بنعمل Hash للمفتاح، وبعدين نوزع النتائج على دوائر العقد.\n\nالميزة الكبيرة: لو عقدة اتضافت أو اتشالت، بس جزء صغير من البيانات بيت.move — مش كل البيانات. ده مهم جداً في الأنظمة الكبيرة.\n\nفي المشروع هنستخدم Hash بسيط: `hash(key) % عدد العقد`.",
      },
      {
        heading: "التكرار (Replication)",
        body: "**التكرار (Replication)** هو نسخ البيانات على أكتر من عقدة. لو العقدة الأساسية فشلت، البيانات موجودة على العقدة التانية.\n\nفي مشروعنا هنكرر كل مفتاح على العقدة التالية في القايمة. لو عندك 3 عقد، كل مفتاح بيتخزن على عقدتين.\n\nالتكرار بيجي على حساب التعقيد: لازم نتأكد إن النسخ متسقة، وده اللي خوارزميات الإجماع (زي Raft) بتحله.",
      },
      {
        heading: "التعامل مع الفشل",
        body: "لما عقدة تفشل، النظام لازم يتعامل:\n\n1. **اكتشاف الفشل:** عن طريق Heartbeat أو Timeout.\n2. **إعادة التوزيع:** نقل المفاتيح اللي كانت على العقدة الفاشلة لعقدة تانية.\n3. **الاستمرار:** الخدمة تكمل شغالة من غير توقف.\n\nفي المشروع هنعمل نسخة مبسطة: لو العقدة الأساسية فشلت، نقرا من العقدة المكررة.",
      },
      {
        heading: "مثال: مخزن موزع كامل",
        body: "هنكتب مخزن مفتاح-قيمة موزع بالتجزئة والتكرار. الكود بيوضح إزاي بنحدد العقدة، إزاي بنكرر، وإزاي بنقرا من النسخة الاحتياطية عند الفشل.",
      },
    ],
    code: [
      {
        title: "مخزن مفتاح-قيمة موزع بالتكرار",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <functional>
using namespace std;

class Node {
    string name;
    map<string, string> store;
public:
    Node(const string& n) : name(n) {}

    void put(const string& key, const string& value) { store[key] = value; }

    string get(const string& key) const {
        auto it = store.find(key);
        return it == store.end() ? "" : it->second;
    }

    string getName() const { return name; }
};

class DistributedStore {
    vector<Node> nodes;
public:
    DistributedStore() {
        nodes.emplace_back("node-1");
        nodes.emplace_back("node-2");
        nodes.emplace_back("node-3");
    }

    // اختيار العقدة عن طريق hash للمفتاح
    int pickNode(const string& key) const {
        hash<string> hasher;
        return (int)(hasher(key) % nodes.size());
    }

    void put(const string& key, const string& value) {
        int primary = pickNode(key);
        nodes[primary].put(key, value);

        // تكرار للعقدة التالية
        int replica = (primary + 1) % nodes.size();
        nodes[replica].put(key, value);

        cout << "تم تخزين " << key << " في " << nodes[primary].getName()
             << " وتكراره في " << nodes[replica].getName() << endl;
    }

    string get(const string& key) const {
        int primary = pickNode(key);
        string value = nodes[primary].get(key);
        if (value.empty()) {
            int replica = (primary + 1) % nodes.size();
            value = nodes[replica].get(key);
        }
        return value;
    }
};

int main() {
    DistributedStore store;

    store.put("user:1", "أحمد");
    store.put("user:2", "محمد");
    store.put("user:3", "خالد");

    cout << "user:1 = " << store.get("user:1") << endl;
    cout << "user:2 = " << store.get("user:2") << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه فائدة التكرار (Replication)؟",
        options: [
          "لو عقدة فشلت، البيانات موجودة على عقدة تانية",
          "يجعل النظام أبطأ",
          "يقلل المساحة",
          "مفيش فايدة",
        ],
        answer: 0,
        explanation: "التكرار بيوفر نسخة احتياطية للبيانات على عقدة تانية.",
      },
      {
        question: "إزاي بنحدد العقدة المناسبة لمفتاح معين؟",
        options: [
          "بنعمل Hash للمفتاح ونوزع النتيجة على العقد",
          "بنختار أول عقدة دايماً",
          "بنختار عشوائياً",
          "بنسأل المستخدم",
        ],
        answer: 0,
        explanation: "التجزئة (Hashing) بتضمن توزيع عادل للبيانات على العقد.",
      },
      {
        question: "إيه اللي بيحصل لو العقدة الأساسية فشلت؟",
        options: [
          "بنقرا من العقدة المكررة بدلاً منها",
          "البيانات تضيع",
          "النظام يقف",
          "مفيش حاجة",
        ],
        answer: 0,
        explanation: "التكرار بيضمن إن البيانات موجودة في مكان تاني.",
      },
    ],
    exercise:
      "أضف ميزة Heartbeat: كل عقدة بترسل رسالة \"أنا شغال\" كل ثانية، ولو العقدة ما استلمتش 3 رسايل متتالية، نقول إنها فشلت ونعيد توزيع مفاتيحها.",
    terms: [
      { en: "Replication", ar: "تكرار: نسخ البيانات على أكتر من عقدة لتحمل الفشل." },
      { en: "Consistent Hashing", ar: "تجزئة متسقة: طريقة لتوزيع المفاتيح على العقد بحيث قلة البيانات اللي بتتحرك عند إضافة أو إزالة عقدة." },
      { en: "Key-Value Store", ar: "مخزن مفتاح-قيمة: قاعدة بيانات بتعمل lookup عن طريق مفتاح، زي Redis." },
      { en: "Fault Tolerance", ar: "تحمل الفشل: قدرة النظام على الاستمرار رغم فشل بعض أجزائه." },
    ],
  },
];
