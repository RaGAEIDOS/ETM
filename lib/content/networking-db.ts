import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "network-intro",
    title: "مقدمة في شبكات الحاسب",
    titleEn: "Introduction to Computer Networks",
    duration: "40 دقيقة",
    description:
      "تفهم كيف تتصل الأجهزة ببعضها عبر الشبكة، من الكابلات لجهاز الراوتر، والبروتوكولات الأساسية التي تجعل الإنترنت يعمل.",
    sections: [
      {
        heading: "إيه الشبكة؟",
        body: "**الشبكة (Network)** هي مجموعة من الأجهزة (كمبيوترات، هواتف، خوادم) متصلة ببعضها لت partage البيانات والموارد.\n\nبدون شبكة، كل جهاز معزول. مع الشبكة، يقدر جهازك يفتح موقع على خserver في دولة تانية في مللي ثانية.",
      },
      {
        heading: "أنواع الشبكات",
        body: "- **LAN (شبكة محلية):** внутри بيت أو مكتب، أجهزة قريبة من بعضها.\n- **WAN (شبكة واسعة):** الإنترنت نفسه — يربط مدن ودول ببعض.\n- **MAN (شبكة حضرية):** تربط مدينة كاملة.\n- **WLAN:** شبكة لاسلكية (Wi-Fi).",
      },
      {
        heading: "العنوان الآيبي والبورت",
        body: "كل جهاز على الشبكة ليه **عنوان آيبي (IP Address)** يميزه، زي رقم التليفون.\n\nأما **البورت (Port)** فهو باب دخول لبرنامج معين على الجهاز.比如说:\n- البورت 80 لمواقع الويب (HTTP)\n- البورت 443 للمواقع الآمنة (HTTPS)\n- البورت 22 للاتصال الآمن (SSH)",
      },
      {
        heading: "مثال: إرسال رسالة عبر الشبكة",
        body: "هنكتب برنامج بسيط محاكاة لإرسال رسالة من جهاز لآخر عبر الشبكة، لنتفهم فكرة العميل والخادم (Client-Server).",
      },
    ],
    code: [
      {
        title: "محاكاة إرسال رسالة عبر الشبكة",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

class NetworkMessage {
    string sender;
    string receiver;
    string content;
public:
    NetworkMessage(const string& s, const string& r, const string& c)
        : sender(s), receiver(r), content(c) {}

    void send() const {
        cout << "إرسال رسالة من " << sender << " إلى " << receiver << endl;
        cout << "المحتوى: " << content << endl;
        cout << "تم التوصيل بنجاح." << endl;
    }
};

int main() {
    NetworkMessage msg("الجهاز-أ", "الجهاز-ب", "مرحباً، هذه أول رسالة عبر الشبكة!");
    msg.send();
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المقصود بـ LAN؟",
        options: [
          "شبكة محلية في نطاق صغير زي بيت أو مكتب",
          "شبكة واسعة تربط دول",
          "شبكة لاسلكية فقط",
          "شبكة إنترنت عامة",
        ],
        answer: 0,
        explanation: "LAN تعني Local Area Network وهي الشبكة المحلية التي تغطي نطاقاً محدوداً.",
      },
      {
        question: "البورت 80 مخصص لأي بروتوكول؟",
        options: ["HTTP", "HTTPS", "SSH", "FTP"],
        answer: 0,
        explanation: "البورت 80 هو البورت الافتراضي لبروتوكول HTTP الخاص بمواقع الويب العادية.",
      },
      {
        question: "إيه الفرق بين العميل والخادم؟",
        options: [
          "العميل يطلب الخدمة والخادم يوفرها",
          "الخادم يطلب والعميل يوفر",
          "لا يوجد فرق",
          "العميل أسرع من الخادم",
        ],
        answer: 0,
        explanation: "العميل (Client) هو الجهاز أو البرنامج اللي يطلب الخدمة، والخادم (Server) هو اللي يوفرها ويستجيب للطلب.",
      },
    ],
    exercise: "ابحث عن عنوان الآيبي الخاص بجهازك باستخدام أمر `ipconfig` في ويندوز أو `ifconfig` في لينكس، وكتب البورت الذي يستخدمه متصفحك لفتح موقع آمن (HTTPS).",
    terms: [
      { en: "IP Address", ar: "العنوان الآيبي: رقم مميز لكل جهاز على الشبكة." },
      { en: "Client-Server", ar: "نموذج العميل والخادم: جهاز يطلب خدمة وآخر يوفرها." },
      { en: "LAN", ar: "الشبكة المحلية: شبكة في نطاق محدود مثل البيت أو المكتب." },
    ],
  },
  {
    id: "http",
    title: "بروتوكول HTTP ومواقع الويب",
    titleEn: "HTTP and the Web",
    duration: "45 دقيقة",
    description:
      "كيف يعمل الويب؟ من طلب HTTP لرد الخادم، وفهم الرؤوس (Headers) وأكواد الحالة مثل 200 و404 و500.",
    sections: [
      {
        heading: "إيه HTTP؟",
        body: "**HTTP (HyperText Transfer Protocol)** هو البروتوكول اللي بيشغل الويب. المتصفح (العميل) يرسل طلب (Request) للخادم، والچماب يرد برد (Response) فيه الصفحة أو البيانات.\n\nكل ما تفتح موقع، متصفحك بمجرد ما يكتب العنوان، بيبعت طلب HTTP ويطّلع استجابة.",
      },
      {
        heading: "خطوات طلب HTTP",
        body: "1. المتصفح يفتح اتصال مع الخادم.\n2. يبعث طلب يحتوي على الطريقة (Method) والرابط (URL).\n3. الخادم يعالج الطلب ويبعث استجابة.\n4. المتصفح يعرض الاستجابة للمستخدم.\n\nمن أشهر الطرق:\n- `GET`: لجلب صفحة أو بيانات.\n- `POST`: لإرسال بيانات للخادم ( زي تسجيل入력 ).\n- `PUT`: لتحديث بيانات موجودة.\n- `DELETE`: لحذف مورد.",
      },
      {
        heading: "أكواد حالة HTTP",
        body: "الخادم بيفهمك إن الطلب نجح أو فشل عن طريق كود حالة:\n\n- **200 OK:** الطلب نجح والصفحة جاية.\n- **301 Moved Permanently:** الصفحة انتقلت لرابط تاني.\n- **404 Not Found:** الصفحة مش موجودة.\n- **500 Internal Server Error:** خطأ في الخادم نفسه.",
      },
      {
        heading: "مثال: طلب HTTP بسيط بلغة C++",
        body: "هنكتب برنامج يزور موقع ويب ويطبع الاستجابة — ده يوضح كيف البرنامج بيضعل مع الخادم عبر HTTP.",
      },
    ],
    code: [
      {
        title: "محاكاة طلب HTTP GET",
        language: "cpp",
        code: `#include <iostream>
#include <string>
using namespace std;

struct HttpRequest {
    string method;
    string url;
    string host;
};

struct HttpResponse {
    int statusCode;
    string body;
};

HttpResponse sendRequest(const HttpRequest& req) {
    // محاكاة بسيطة: في الحقيقة ici بنستخدم مكتبة زي cURL أو Boost.Asio
    cout << "إرسال طلب " << req.method << " إلى " << req.url << endl;
    cout << "المضيف: " << req.host << endl;

    HttpResponse resp;
    resp.statusCode = 200;
    resp.body = "<html><body>مرحباً من الخادم!</body></html>";
    return resp;
}

int main() {
    HttpRequest req{"GET", "https://example.com", "example.com"};
    HttpResponse resp = sendRequest(req);

    cout << "كود الاستجابة: " << resp.statusCode << endl;
    cout << "محتوى الصفحة: " << resp.body << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه 의미 كود الحالة 404؟",
        options: [
          "الصفحة مش موجودة",
          "خطأ في الخادم",
          "الطلب نجح",
          "الحاجة переехаła",
        ],
        answer: 0,
        explanation: "كود 404 معناه Not Found — أي الصفحة أو المورد المطلوب مش موجود على الخادم.",
      },
      {
        question: "أي طريقة HTTP تستخدم لإرسال بيانات جديدة للخادم؟",
        options: ["POST", "GET", "DELETE", "HEAD"],
        answer: 0,
        explanation: "طريقة POST بتستخدم لإرسال بيانات جديدة، زي تسجيل مستخدم جديد أو إرسال نموذج.",
      },
      {
        question: "إيه دور المتصفح في HTTP؟",
        options: [
          "يكون العميل اللي يطلب الصفحات من الخادم",
          "يخزن كل مواقع الإنترنت",
          "يكتب كود HTML للخادم",
          "بيشغل الخادم فقط",
        ],
        answer: 0,
        explanation: "المتصفح هو العميل (Client) اللي يبتدي بطلب HTTP والخادم يرد عليه بالصفحة.",
      },
    ],
    exercise: "افتح أدوات المطور في متصفحك (F12)، اذهب لتبويب Network، حمّل أي صفحة، وشوف أكواد الحالة (Status) للطلبات اللي بتبعت.",
    terms: [
      { en: "HTTP", ar: "بروتوكول نقل النصوص التشعبية، أساس عمل الويب." },
      { en: "Request/Response", ar: "طلب واستجابة: أساس الاتصال بين المتصفح والخادم." },
      { en: "Status Code", ar: "كود حالة HTTP يوضح نتيجة الطلب (نجاح، خطأ، غير موجود)." },
    ],
  },
  {
    id: "db-intro",
    title: "مقدمة في قواعد البيانات",
    titleEn: "Introduction to Databases",
    duration: "40 دقيقة",
    description:
      "فهم قواعد البيانات العلاقية، الجداول، الصفوف، الأعمدة، والعلاقات — مع مثال عملي بلغة C++.",
    sections: [
      {
        heading: "إيه قاعدة البيانات؟",
        body: "**قاعدة البيانات (Database)** هي مجموعة منظمة من البيانات تُخزن وتُسترجع بسهولة. بتفكر فيها زي ملف إكسل كبير لكن أقوى وأسرع.\n\nفي programming، программы بتحتاج تخزن بيانات المستخدمين، المنتجات، الطلبات — وكلها تروح لقاعدة بيانات.",
      },
      {
        heading: "قواعد البيانات العلاقية (Relational)",
        body: "في قواعد البيانات العلاقية، البيانات संगّمة في **جداول (Tables)**.\n\nكل جدول فيه:\n- **أعمدة (Columns):** أسماء الحقول (اسم، عمر، بريد إلكتروني).\n- **صفوف (Rows):** كل سجل فيه بيانات كيان واحد.\n\nالعلاقة بين الجداول بتتم عن طريق **مفاتيح أساسية (Primary Key)** و**مفاتيح خارجية (Foreign Key)**.",
      },
      {
        heading: "SQL basics",
        body: "**SQL (Structured Query Language)** هي اللغة اللي بنتعامل بيها مع قواعد البيانات العلاقية.\n\nأوامر أساسية:\n- `SELECT`: لجلب بيانات.\n- `INSERT`: لإضافة سجل جديد.\n- `UPDATE`: لتعديل سجل.\n- `DELETE`: لحذف سجل.\n\nمثال:\n```sql\nSELECT name, age FROM users WHERE age > 18;\n```",
      },
      {
        heading: "ربط C++ بقاعدة بيانات",
        body: "لغة C++ ليها مكتبات conect بقواعد البيانات زي **SQLite** (خفيفة وتُخزن في ملف واحد) أو **MySQL** و **PostgreSQL** للخوادم الكبيرة.\n\nهنستخدم SQLite في المثال القادم لأنها أسهل للمبتدئين ومugin مدمجة مع C++ بسهولة.",
      },
    ],
    code: [
      {
        title: "نموذج مستخدم بسيط في C++",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct User {
    int id;
    string name;
    int age;
};

int main() {
    vector<User> users = {
        {1, "أحمد", 25},
        {2, "سارة", 30},
        {3, "محمد", 22},
    };

    cout << "المستخدمين الأكبر من 24 سنة:" << endl;
    for (const User& u : users) {
        if (u.age > 24) {
            cout << "  ID: " << u.id << ", الاسم: " << u.name << ", العمر: " << u.age << endl;
        }
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الغرض من أمر SELECT في SQL؟",
        options: [
          "لجلب بيانات من قاعدة البيانات",
          "لحذف جدول كامل",
          "لإنشاء قاعدة بيانات جديدة",
          "لتسجيل دخول المستخدم",
        ],
        answer: 0,
        explanation: "أمر SELECT بيشdlbi لجلب واستعلام البيانات من الجداول.",
      },
      {
        question: "إيه الفرق بين الصف والعمود في الجدول؟",
        options: [
          "العمود يمثل الحقل والصف يمثل السجل",
          "الصف يمثل الحقل والعمود يمثل السجل",
          "لا يوجد فرق",
          "العمود أسرع من الصف",
        ],
        answer: 0,
        explanation: "العمود (Column) هو الحقل (اسم، عمر)، والصف (Row) هو السجل اللي فيه قيم لحالة واحدة.",
      },
      {
        question: "ليه SQLite مناسبة للمبتدئين في C++؟",
        options: [
          "خفيفة وتخزن البيانات في ملف واحد",
          "تحتاج خادم قوي",
          "مش سهلة التركيب",
          "تشتغل على الويب فقط",
        ],
        answer: 0,
        explanation: "SQLite embedded Database تخزن كل شيء في ملف واحد على القرص، ومugin مدمجة وسهلة الاستخدام مع C++.",
      },
    ],
    exercise: "صمم جدولاً لمتجر إلكتروني يحتوي على الأعمدة: id، اسم المنتج، السعر، الكمية. ثم اكتب استعلام SQL يجلب المنتجات اللي سعرها أكبر من 100 جنيه.",
    terms: [
      { en: "Database", ar: "قاعدة بيانات: مجموعة منظمة من البيانات تُخزن وتُسترجع." },
      { en: "SQL", ar: "لغة الاستفسار البنائية، اللي بنتعامل بيها مع قواعد البيانات العلاقية." },
      { en: "Table", ar: "الجدول: وحدة التخزين الأساسية في قاعدة البيانات العلاقية." },
    ],
  },
  {
    id: "sql",
    title: "لغة SQL والاستعلامات المتقدمة",
    titleEn: "SQL and Advanced Queries",
    duration: "45 دقيقة",
    description:
      "التعامل العميق مع SQL: فلترة، ترتيب، تجميع، وجOIN بين الجداول — مع أمثلة تُنفذ في C++.",
    sections: [
      {
        heading: "تصفية البيانات (WHERE)",
        body: "باستخدام `WHERE` تقدر تختار الصفوف اللي satisfy شرط معين:\n\n```sql\nSELECT * FROM students WHERE grade >= 90;\n```\n\nيمكنك الجمع بين شروط باستخدام `AND` و `OR` و `NOT`.",
      },
      {
        heading: "الترتيب والتحديد (ORDER BY, LIMIT)",
        body: "`ORDER BY` بيساعدك ترتّب النتائج صاعداً أو نازلاً، و`LIMIT` يحدد عدد الصفوف اللي هتshow.\n\n```sql\nSELECT name, score FROM players ORDER BY score DESC LIMIT 5;\n```\nده يجلب أفضل 5 لاعبين حسب النقاط.",
      },
      {
        heading: "الربط بين الجداول (JOIN)",
        body: "जब الجداول مرتبطة ببعض، تستخدم `JOIN` لجلب بيانات من جدولين في مرة واحدة:\n\n```sql\nSELECT orders.id, users.name, orders.total\nFROM orders\nJOIN users ON orders.user_id = users.id;\n```\nده يربط جدول الطلبات بجدول المستخدمين عبر المفتاح الخارجي.",
      },
      {
        heading: "المجموعات والدوال الإحصائية (GROUP BY)",
        body: "`GROUP BY` بيزيّف الصفوف حسب قيمة معينة، وبتستخدم مع دوال زي `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`.\n\nمثال: حساب عدد الطلبات لكل مستخدم.\n\n```sql\nSELECT user_id, COUNT(*) as order_count\nFROM orders\nGROUP BY user_id;\n```",
      },
    ],
    code: [
      {
        title: "محاكاة استعلام SQL في C++",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

struct Order {
    int id;
    int userId;
    double total;
};

int main() {
    vector<Order> orders = {
        {1, 101, 250.0},
        {2, 102, 120.0},
        {3, 101, 400.0},
        {4, 103, 80.0},
    };

    // محاكاة: GROUP BY userId و SUM(total)
    cout << "إجمالي طلبات كل مستخدم:" << endl;

    // لسه نموذج بسيط، في الحقيقة SQL بتعمل ده بكفاءة أكبر
    for (const Order& o : orders) {
        cout << "  المستخدم " << o.userId << ": طلب رقم " << o.id
             << " بمبلغ " << o.total << " جنيه" << endl;
    }

    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه دور جملة ORDER BY في SQL؟",
        options: [
          "ترتيب النتائج حسب عمود معين",
          "حذف الصفوف المكررة",
          "إنشاء جدول جديد",
          "تشفير البيانات",
        ],
        answer: 0,
        explanation: "ORDER BY بترتب الصفوف الصاعدة أو النزلة حسب العمود المحدد.",
      },
      {
        question: "أي جملة تستخدم لربط جدولين في استعلام واحد؟",
        options: ["JOIN", "GROUP BY", "WHERE", "SELECT"],
        answer: 0,
        explanation: "JOIN بتلف بين جدولين أو أكثر بناءً على علاقة مشتركة (مثل المفتاح الخارجي).",
      },
      {
        question: "إيه نتيجة دالة COUNT(*)؟",
        options: [
          "عدد الصفوف",
          "مجموع القيم",
          "أصغر قيمة",
          "متوسط القيم",
        ],
        answer: 0,
        explanation: "COUNT(*) بتعيد عدد الصفوف اللي تتوافق مع الشرط.",
      },
    ],
    exercise: "اكتب استعلام SQL يجلب أسماء العملاء اللي قاموا بأكثر من طلبين، باستخدام GROUP BY و HAVING.",
    terms: [
      { en: "JOIN", ar: "الربط: جملة SQL لدمج بيانات من جدولين أو أكثر." },
      { en: "GROUP BY", ar: "التجميع: جملة لتجميع الصفوف حسب قيم مشتركة." },
      { en: "Primary Key", ar: "المفتاح الأساسي: عمود مميز لكل سجل في الجدول." },
    ],
  },
  {
    id: "db-cpp",
    title: "ربط C++ بقاعدة بيانات SQLite",
    titleEn: "C++ and SQLite",
    duration: "50 دقيقة",
    description:
      "كيف تتصل لغة C++ بقاعدة بيانات SQLite، تنشئ جداول، وتدخل وتقرأ بيانات باستخدام استعلامات SQL.",
    sections: [
      {
        heading: "إيه SQLite؟",
        body: "**SQLite** هي قاعدة بيانات خفيفة تُخزن كل بياناتها في ملف واحد على القرص. مugin مدمجة مع كثير من اللغات بما فيها C++، ومش محتاجة خادم منفصل.\n\nمثالية للتطبيقات الصغيرة والمتوسطة، والمشاريع الشخصية، والألعاب اللي بتحتاج حفظ بيانات محلياً.",
      },
      {
        heading: "خطوات التعامل مع SQLite من C++",
        body: "1. أضف مكتبة SQLite لمشروعك (رأسية `sqlite3.h` ومكتبة الربط).\n2. افتح اتصال مع ملف قاعدة البيانات باستخدام `sqlite3_open`.\n3. نفّذ استعلامات SQL باستخدام `sqlite3_exec`.\n4. أغلق الاتصال باستخدام `sqlite3_close`.\n\nكل خطوة ممكن ترجع رمز خطأ، لازم تتحقق منه عشان program متقفش فجأة.",
      },
      {
        heading: "مثال عملي: جدول مستخدمين",
        body: "هننشئ جدولاً باسم `users` فيه أعمدة `id`, `name`, `email`، ثم نضيف مستخدمين ونقرأ بياناتهم — كل ذلك من داخل كود C++.",
      },
    ],
    code: [
      {
        title: "إنشاء جدول وإدراج بيانات في SQLite",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <sqlite3.h>
using namespace std;

static int callback(void* data, int argc, char** argv, char** azColName) {
    for (int i = 0; i < argc; i++) {
        cout << azColName[i] << " = " << (argv[i] ? argv[i] : "NULL") << " | ";
    }
    cout << endl;
    return 0;
}

int main() {
    sqlite3* db;
    char* errMsg = nullptr;
    int rc;

    rc = sqlite3_open("students.db", &db);
    if (rc) {
        cerr << "لا يمكن فتح قاعدة البيانات: " << sqlite3_errmsg(db) << endl;
        return 1;
    }
    cout << "تم فتح قاعدة البيانات بنجاح." << endl;

    const char* sql =
        "CREATE TABLE IF NOT EXISTS students ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "name TEXT NOT NULL, "
        "grade REAL);";

    rc = sqlite3_exec(db, sql, callback, nullptr, &errMsg);
    if (rc != SQLITE_OK) {
        cerr << "خطأ في إنشاء الجدول: " << errMsg << endl;
        sqlite3_free(errMsg);
    } else {
        cout << "الجدول تم إنشاؤه أو موجود مسبقاً." << endl;
    }

    sqlite3_close(db);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الميزة الأساسية لـ SQLite؟",
        options: [
          "خفيفة وتخزن البيانات في ملف واحد",
          "تحتاج خادم قوي للعمل",
          "تشتغل فقط على الموبايل",
          "لا تدعم SQL",
        ],
        answer: 0,
        explanation: "SQLite embedded database تخزن كل شيء في ملف واحد، ومugin خفيفة ولا تحتاج خادم منفصل.",
      },
      {
        question: "أي دالة تفتح الاتصال بقاعدة بيانات SQLite؟",
        options: ["sqlite3_open", "sqlite3_connect", "sqlite3_start", "sqlite3_init"],
        answer: 0,
        explanation: "sqlite3_open هي الدالة المسؤولة عن فتح ملف قاعدة البيانات والبدء في التعامل معه.",
      },
      {
        question: "إيه الغرض من sqlite3_exec؟",
        options: [
          "تنفيذ استعلام SQL على قاعدة البيانات",
          "إغلاق الاتصال",
          "طباعة الأخطاء على الشاشة",
          "إنشاء ملف قاعدة بيانات جديد",
        ],
        answer: 0,
        explanation: "sqlite3_exec بتنفيذ أوامر SQL مثل CREATE, INSERT, SELECT على قاعدة البيانات المفتوحة.",
      },
    ],
    exercise: "عدّل الكود כך تضيف سجل طالب جديد باستخدام أمر `INSERT INTO students (name, grade) VALUES (...)` ثم اقرأ جميع السجلات واطبعها.",
    terms: [
      { en: "SQLite", ar: "قاعدة بيانات خفيفة مدمجة تخزن البيانات في ملف واحد." },
      { en: "sqlite3_open", ar: "دالة لفتح الاتصال بملف قاعدة بيانات SQLite." },
      { en: "sqlite3_exec", ar: "دالة لتنفيذ استعلامات SQL على قاعدة البيانات." },
    ],
  },
  {
    id: "net-project",
    title: "المشروع: إدارة مكتبة بسيطة",
    titleEn: "Project: Simple Library Management",
    duration: "60 دقيقة",
    description:
      "تطبيق عملي يدمج الشبكات وقواعد البيانات: برنامج لإدارة كتب biblioteca مع إمكانية إضافة وحذف والبحث وحفظ البيانات في ملف SQLite.",
    sections: [
      {
        heading: "فكرة المشروع",
        body: "ها تبني برنامج إدارة مكتبة بسيط:\n\n- إضافة كتاب جديد (اسم، كاتب، سنة النشر).\n- عرض جميع الكتب.\n- البحث عن كتاب باسمه.\n- حذف كتاب.\n- حفظ كل البيانات في ملف SQLite عشان تفضل محفوظة حتى لو أغلقت البرنامج.\n\nالمشروع بيجمع بين ما تعلمته عن قواعد البيانات والتعامل مع الملفات في C++.",
      },
      {
        heading: "هيكل البرنامج",
        body: "البرنامج هيحتوي على:\n\n1. هيكل `Book` يمثل كتاب.\n2. دالة لفتح قاعدة البيانات وإنشاء جدول الكتب.\n3. دوال لكل عملية: إضافة، عرض، بحث، حذف.\n4. قائمة رئيسية (Menu) يت choix المستخدم منها العملية.\n\nكل عملية بتنفّذ استعلام SQL عبر `sqlite3_exec`.",
      },
      {
        heading: "مثال على جزء من الكود",
        body: "إليك نموذج لإضافة كتاب وقراءة الكتب من قاعدة البيانات:\n\n```cpp\n// إضافة كتاب\nsqlite3_exec(db, \"INSERT INTO books (title, author, year) VALUES ('البرمجة بلغة C++', 'أحمد', 2026)\", nullptr, nullptr, &errMsg);\n\n// قراءة جميع الكتب\nsqlite3_exec(db, \"SELECT * FROM books\", callback, nullptr, &errMsg);\n```",
      },
    ],
    code: [
      {
        title: "نظام إدارة المكتبة",
        language: "cpp",
        code: `#include <iostream>
#include <string>
#include <sqlite3.h>
using namespace std;

static int callback(void* data, int argc, char** argv, char** azColName) {
    for (int i = 0; i < argc; i++) {
        cout << azColName[i] << " = " << (argv[i] ? argv[i] : "NULL") << " | ";
    }
    cout << endl;
    return 0;
}

void addBook(sqlite3* db) {
    string title, author;
    int year;
    cout << "اسم الكتاب: ";
    getline(cin, title);
    cout << "اسم المؤلف: ";
    getline(cin, author);
    cout << "سنة النشر: ";
    cin >> year;
    cin.ignore();

    string sql = "INSERT INTO books (title, author, year) VALUES ('"
        + title + "', '" + author + "', " + to_string(year) + ");";

    char* errMsg = nullptr;
    if (sqlite3_exec(db, sql.c_str(), nullptr, nullptr, &errMsg) != SQLITE_OK) {
        cerr << "فشل الإضافة: " << errMsg << endl;
        sqlite3_free(errMsg);
    } else {
        cout << "تمت إضافة الكتاب بنجاح." << endl;
    }
}

void listBooks(sqlite3* db) {
    cout << "\nقائمة الكتب:" << endl;
    char* errMsg = nullptr;
    sqlite3_exec(db, "SELECT id, title, author, year FROM books", callback, nullptr, &errMsg);
    if (errMsg) {
        cerr << errMsg << endl;
        sqlite3_free(errMsg);
    }
}

int main() {
    sqlite3* db;
    if (sqlite3_open("library.db", &db)) {
        cerr << "فشل فتح قاعدة البيانات." << endl;
        return 1;
    }

    sqlite3_exec(db,
        "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, year INTEGER);",
        nullptr, nullptr, nullptr);

    int choice = 0;
    while (choice != 3) {
        cout << "\n1. إضافة كتاب\n2. عرض الكتب\n3. خروج\nاختيارك: ";
        cin >> choice;
        cin.ignore();

        if (choice == 1) addBook(db);
        else if (choice == 2) listBooks(db);
    }

    sqlite3_close(db);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الغرض من جدول books في المشروع؟",
        options: [
          "تخزين بيانات الكتب (اسم، مؤلف، سنة)",
          "تخزين بيانات المستخدمين فقط",
          "تشغيل الألعاب",
          "تصميم الواجهة",
        ],
        answer: 0,
        explanation: "جدول books هو اللي يخزن معلومات كل كتاب في مكتبة البرنامج.",
      },
      {
        question: "لماذا نستخدم `cin.ignore()` بعد قراءة السنة؟",
        options: [
          "لتفادي تخطي getline للسطر التالي بسبب残ف newline",
          "لحذف الكتاب",
          "لإغلاق قاعدة البيانات",
          "لمسح الشاشة",
        ],
        answer: 0,
        explanation: "cin >> تترك رمز السطر الجديد في المخزن المؤقت، وgetline بعده هيقرأه سطراً فارغاً، quindi نستخدم ignore لتفادي ذلك.",
      },
      {
        question: "إيه الفائدة من حفظ البيانات في SQLite؟",
        options: [
          "البيانات تبقى محفوظة حتى بعد إغلاق البرنامج",
          "البرنامج يصبح أبطأ",
          "مugin محتاج إنترنت",
          "البيانات تضيع عند الإغلاق",
        ],
        answer: 0,
        explanation: "SQLite تخزن البيانات في ملف على القرص، فتبقى محفوظة بين تشغيلات البرنامج المختلفة.",
      },
    ],
    exercise: "أضف خاصية البحث عن كتاب باسمه إلى المشروع باستخدام استعلام SQL مع WHERE على عمود title، واطبع نتيجة البحث.",
    terms: [
      { en: "CRUD", ar: "إنشاء، قراءة، تحديث، حذف — العمليات الأساسية على البيانات." },
      { en: "SQL Injection", ar: "ثغرة أمنية تحدث عندما يتم إدخال خبيث في استعلامات SQL." },
      { en: "Database File", ar: "ملف قاعدة البيانات الذي يخزن كل البيانات على القرص." },
    ],
  },
];
