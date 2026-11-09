import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "game-loop",
    title: "حلقة اللعبة Game Loop",
    titleEn: "Game Loop",
    duration: "45 دقيقة",
    description:
      "قلب أي محرك ألعاب: حلقة لانهائية بتقرأ الإدخال، تحدّث العالم، وترسم من جديد كل إطار.",
    sections: [
      {
        heading: "إيه حلقة اللعبة؟",
        body: "حلقة اللعبة (Game Loop) هي الحلقة الرئيسية اللي بتشتغل طول فترة اللعبة. كل لفة من الحلقة اسمها **إطار (Frame)**، وعدد الإطارات في الثانية اسمه **FPS** (Frames Per Second).\n\nتخيل فيلم كرتون: الفيلم بتاع 24 صورة في الثانية، كل صورة مختلفة شوية عن اللي قبلها. اللعبة بتعمل نفس الحاجة لكن بمعدل 30 أو 60 إطار في الثانية.\n\nالحلقة بتنتهي بس لما اللاعب يقفل اللعبة أو يخسر — ودي حالة من حالات اللعبة مش برنامج عادي بيخلص وينتهي.",
      },
      {
        heading: "المراحل الثلاث: إدخال، تحديث، رسم",
        body: "أي لفة من حلقة اللعبة بتتمر بثلاث مراحل:\n\n1. **قراءة الإدخال (Input):** بنسأل: هل اللاعب داس على زر؟ هل حرك الماوس؟ بنخزن الحالة دي عشان نستخدمها في التحديث.\n2. **تحديث العالم (Update):** بنحرك الشخصيات، بنحسب التصادمات، بنحدّث النقاط — كل حاجة بتتغير حسب الزمن اللي عدى.\n3. **الرسم (Render):** بنرسم العالم المحدّث على الشاشة.\n\nالترتيب ده مهم جداً: لو رسمت قبل ما تحدث، هتشوف إطار قديم. لو حدّثت قبل ما تقرأ الإدخال، هتخسر حركتك.",
      },
      {
        heading: "Delta Time: سر الألعاب السلسة",
        body: "لو حركت الشخصية بمقدار ثابت كل إطار، هتلاقيها بتتحرك بسرعة مختلفة على أجهزة مختلفة — سريعة على الجهاز القوي وبطيئة على الضعيف.\n\nالحل هو **Delta Time (dt):** الزمن اللي عدى بين الإطار الحالي واللي قبله. بدل ما نقول `x = x + 5`، بنقول `x = x + speed * dt`. كده الحركة بتكون متساوية بصرف النظر عن عدد الإطارات.\n\nمثال: لو اللعبة بتشتغل بـ 30 إطار في الثانية، `dt` تقريباً `0.033` ثانية. لو بـ 60 إطار، `dt` بيبقى `0.016` ثانية.",
      },
      {
        heading: "Fixed Time Step مقابل Variable Time Step",
        body: "في طريقتين أساسيتين لتحديث اللعبة:\n\n- **Variable Time Step:** التحديث بيحصل كل إطار، و`dt` بيتغير حسب سرعة الجهاز. بسيط ومرن، لكن الفيزياء ممكن تبقى غير مستقرة لو الإطارات كثيرة.\n- **Fixed Time Step:** التحديث بيحصل بمقدار ثابت (مثلاً كل `1/60` ثانية)، و`dt` ثابت. ده أحسن للفيزياء لأنه مستقر، لكنه محتاج منطق إضافي لجمع الزمن الفعلي وتوزيعه على تحديثات ثابتة.\n\nأغلب المحركات الكبيرة بتستخدم Fixed Time Step للفيزياء وVariable Time Step للرسم.",
      },
      {
        heading: "مثال: حلقة لعبة بمؤقت",
        body: "هنكتب حلقة لعبة بسيطة بتقيس الزمن الحقيقي باستخدام `<chrono>` وتحرك شخصية بمقدار يعتمد على `dt`. لاحظ إن الحركة بتكون ثابتة بغض النظر عن سرعة الجهاز.",
      },
    ],
    code: [
      {
        title: "حلقة لعبة بسيطة مع Delta Time",
        language: "cpp",
        code: `#include <iostream>
#include <chrono>
#include <thread>
using namespace std;
using namespace std::chrono;

int main() {
    double x = 0.0;       // موضع اللاعب
    double speed = 2.0;   // متر في الثانية
    bool running = true;
    int frames = 0;

    auto previous = steady_clock::now();

    while (running) {
        auto now = steady_clock::now();
        double dt = duration<double>(now - previous).count();
        previous = now;

        // 1) Input: هنا ممكن نقرأ الكيبورد
        // 2) Update: نحرك اللاعب حسب الزمن الفعلي
        x += speed * dt;
        frames++;

        // 3) Render: بنرسم الحالة الحالية
        cout << "الإطار " << frames << " | الموضع = " << x << endl;

        if (frames >= 5) running = false;

        // تحديد سرعة الإطارات (محاكاة)
        this_thread::sleep_for(milliseconds(500));
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المراحل الأساسية الثلاث في حلقة اللعبة؟",
        options: [
          "Input → Update → Render",
          "Render → Update → Input",
          "Update → Render → Input",
          "Input → Render → Update",
        ],
        answer: 0,
        explanation: "بنقرا الإدخال الأول، وبعدين نحدّث العالم، وبعدين نرسمه.",
      },
      {
        question: "إيه الفرق بين Fixed Time Step و Variable Time Step؟",
        options: [
          "Fixed بيتحديث بمقدار ثابت، Variable بيتحديث حسب الزمن الفعلي",
          "Fixed أسرع دائماً",
          "Variable للفيزياء وFixed للرسم",
          "مفيش فرق",
        ],
        answer: 0,
        explanation: "Fixed Time Step بيستخدم dt ثابت عشان الفيزياء تبقى مستقرة.",
      },
      {
        question: "ليه بنستخدم Delta Time في تحديث الحركة؟",
        options: [
          "عشان الحركة تبقى ثابتة بغض النظر عن سرعة الجهاز",
          "عشان اللعبة تبقى أبطأ",
          "عشان نوفر الذاكرة",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "لو من غير dt، اللعبة هتمشي أسرع على الأجهزة السريعة وأبطأ على الضعيفة.",
      },
    ],
    exercise:
      "أضف للحلقة قراءة إدخال من المستخدم: لو كتب `L` يتحرك شمال، و`R` يتحرك جنوب. استخدم `cin` عشان تقرال الاتجاه في كل لفة.",
    terms: [
      { en: "Game Loop", ar: "حلقة اللعبة: الحلقة الرئيسية اللي بتشتغل طول فترة اللعبة وتحديث العالم والرسم." },
      { en: "Delta Time", ar: "فرق الزمن: الزمن اللي عدى بين إطارين، بنستخدمه عشان الحركة تبقى ثابتة." },
      { en: "Fixed Time Step", ar: "خطوة زمنية ثابتة: تحديث اللعبة بمقدار ثابت كل مرة عشان استقرار الفيزياء." },
      { en: "FPS", ar: "إطار في الثانية: عدد المرات اللي بتتحديث وترسم فيها اللعبة كل ثانية." },
    ],
  },
  {
    id: "graphics-intro",
    title: "الرسوميات: من البكسل إلى الشاشة",
    titleEn: "Graphics: Pixels to Screen",
    duration: "50 دقيقة",
    description:
      "من مصفوفة ألوان في الذاكرة لصورة قدامك: فهمنا البكسل والـ Framebuffer وإزاي بنبني صورة.",
    sections: [
      {
        heading: "إيه البكسل؟",
        body: "الشاشة عبارة عن شبكة من النقاط الصغيرة جداً اسمها **بكسلات (Pixels)**. كل بكسل ليه لون واحد، ولما بتتجمع ملايين النقاط دي بتكوّن الصورة اللي بتشوفها.\n\nدقة الشاشة (Resolution) بتقول عدد البكسلات في العرض والارتفاع. شاشة `1920 × 1080` فيها حوالي 2 مليون بكسل.\n\nالبكسل هو أصغر وحدة في الصورة الرقمية — مفيش حاجة أصغر منه.",
      },
      {
        heading: "تمثيل الألوان",
        body: "اللون بيتمثل في الكمبيوتر بنظام **RGB:** أحمر (Red)، أخضر (Green)، أزرق (Blue). كل لون ليه قيمة من 0 لـ 255.\n\n- أحمر نقي: `(255, 0, 0)`\n- أخضر نقي: `(0, 255, 0)`\n- أزرق نقي: `(0, 0, 255)`\n- أبيض: `(255, 255, 255)`\n- أسود: `(0, 0, 0)`\n\nفي كتير من الأنظمة بيضيفوا قناة رابعة اسمها **Alpha** للشفافية، فيبقى **RGBA**. القيمة 0 شفاف تماماً، و255 معتم تماماً.",
      },
      {
        heading: "الـ Framebuffer",
        body: "**الـ Framebuffer** هو منطقة في الذاكرة بتمثل الشاشة. كل بكسل ليه مكان في الذاكرة، وبرنامجك بيكتب الألوان في المكان ده.\n\nتخيل مصفوفة ثنائية الأبعاد من الألوان: `pixels[y][x]`. لما تكتب `pixels[100][200] = أحمر`، بتقول للكمبيوتر: اجعل البكسل في الصف 100 والعمود 200 أحمر.\n\nفي نهاية كل إطار، الـ Framebuffer بيتنسخ للشاشة عن طريق كرت الشاشة. كل الألعاب والمتصفحات بتعمل كده.",
      },
      {
        heading: "مثال: رسم دائرة في ذاكرة مؤقتة",
        body: "هنكتب برنامج بيرسم دائرة صفرا في منتصف صورة سوداء، ويحفظها كملف **PPM** — صيغة صور بسيطة جداً تقدر تفتحها بأي محرر صور. الكود بيوضح إزاي بنتعامل مع مصفوفة بكسلات كأنها Framebuffer.",
      },
    ],
    code: [
      {
        title: "رسم دائرة وحفظها كملف PPM",
        language: "cpp",
        code: `#include <iostream>
#include <fstream>
#include <vector>
using namespace std;

struct Color { unsigned char r, g, b; };

int main() {
    const int W = 64, H = 64;

    // Framebuffer: مصفوفة من الألوان
    vector<Color> pixels(W * H, Color{0, 0, 0});

    // نرسم دائرة صفراء في المنتصف
    int cx = W / 2, cy = H / 2;
    int radiusSquared = 200;
    for (int y = 0; y < H; y++) {
        for (int x = 0; x < W; x++) {
            int dx = x - cx, dy = y - cy;
            if (dx * dx + dy * dy < radiusSquared) {
                pixels[y * W + x] = Color{255, 220, 0};
            }
        }
    }

    // نحفظ الصورة بصيغة PPM
    ofstream out("circle.ppm", ios::binary);
    out << "P6" << endl;
    out << W << " " << H << endl;
    out << "255" << endl;
    out.write(reinterpret_cast<const char*>(pixels.data()), W * H * 3);
    out.close();

    cout << "تم إنشاء الملف circle.ppm" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه البكسل؟",
        options: [
          "أصغر نقطة في الصورة الرقمية وليها لون واحد",
          "وحدة قياس السرعة",
          "نوع من أنواع الذاكرة",
          "ملف صورة",
        ],
        answer: 0,
        explanation: "البكسل هو أصغر وحدة في الشاشة، وملايين البكسلات بتكون الصورة.",
      },
      {
        question: "إيه نظام الألوان RGB؟",
        options: [
          "أحمر وأخضر وأزرق — كل لون بقيمة من 0 لـ 255",
          "أحمر وأصفر وأزرق",
          "نظام تشفير",
          "نوع من الخطوط",
        ],
        answer: 0,
        explanation: "أي لون بيتكون من خلط قيم الأحمر والأخضر والأزرق.",
      },
      {
        question: "إيه وظيفة الـ Framebuffer؟",
        options: [
          "ذاكرة بتمثل الشاشة فيها البرنامج بيرسم كل إطار",
          "تخزين ملفات الصور",
          "تسريع المعالج",
          "إدارة النوافذ",
        ],
        answer: 0,
        explanation: "الـ Framebuffer هو نسخة الذاكرة من الشاشة، وبتتنسخ للشاشة في نهاية كل إطار.",
      },
    ],
    exercise:
      "عدّل البرنامج عشان يرسم مربع أزرق بدل الدائرة الصفراء، وجرب يرسم مستطيلين متداخلين بألوان مختلفة.",
    terms: [
      { en: "Pixel", ar: "بكسل: أصغر نقطة في الصورة الرقمية، وليها لون واحد." },
      { en: "Framebuffer", ar: "مخزن الإطار: منطقة في الذاكرة بتمثل الشاشة، بنرسم فيها قبل ما تتنسخ للشاشة." },
      { en: "RGB", ar: "أحمر أخضر أزرق: نظام تمثيل الألوان بثلاث قنوات، كل قناة من 0 لـ 255." },
      { en: "Resolution", ar: "دقة الشاشة: عدد البكسلات في العرض والارتفاع، زي 1920×1080." },
    ],
  },
  {
    id: "opengl",
    title: "الرسم بـ OpenGL",
    titleEn: "Drawing with OpenGL",
    duration: "60 دقيقة",
    description:
      "من الرسم في الذاكرة للرسم على الشاشة بكرت الشاشة: فهمنا الـ Graphics Pipeline والـ Shaders.",
    sections: [
      {
        heading: "إيه OpenGL؟",
        body: "**OpenGL** هي واجهة برمجية (API) للرسم على كرت الشاشة. هي مش مكتبة ألعاب كاملة، لكنها الطبقة اللي بتتكلم مع كرت الشاشة مباشرة.\n\nبتشتغل على كل المنصات تقريباً — ويندوز وماك ولينكس — وده اللي خليها المعيار في الألعاب والتطبيقات ثلاثية الأبعاد لمدة سنين طويلة.\n\nفي نسخة حديثة اسمها **OpenGL 3.3+** أو **OpenGL Core Profile**، بتشتغل بنظام الـ Shaders — برامج صغيرة بتشتغل على كرت الشاشة.",
      },
      {
        heading: "معمارية الـ Graphics Pipeline",
        body: "كرت الشاشة بيمر بمراحل اسمها **Graphics Pipeline**:\n\n1. **Vertex Processing:** كل رأس (Vertex) من الرسم بيتم تحويله من الإحداثيات الثلاثية الأبعاد لموضع على الشاشة.\n2. **Rasterization:** تحويل الأشكال الهندسية (مثلثات) لنقاط بكسل على الشاشة.\n3. **Fragment Processing:** كل نقطة بكسل بيتم حساب لونها.\n4. **Framebuffer:** الكتابة النهائية في الذاكرة اللي بتتشاف على الشاشة.\n\nالمراحل 1 و3 قابلة للبرمجة عن طريق **Shaders**، وباقي المراحل ثابتة.",
      },
      {
        heading: "الـ Vertex Shader والـ Fragment Shader",
        body: "- **Vertex Shader:** برنامج صغير بيشتغل على كل رأس. وظيفته الأساسية تحويل الإحداثيات. مثال بسيط بيمرر الإحداثيات زي ما هي.\n- **Fragment Shader:** برنامج صغير بيشتغل على كل بكسل. وظيفته تحديد اللون النهائي.\n\nالشيدرات بتتكتب بلغة **GLSL** (OpenGL Shading Language)، وهي لغة شبيهة بـ C. الكود بيتحول ويتربط مع البرنامج في وقت التشغيل.",
      },
      {
        heading: "إعداد مشروع OpenGL حقيقي",
        body: "عشان تشتغل بـ OpenGL محتاج مكتبتين:\n\n- **GLFW:** عشان تفتح نافذة وتستقبل الإدخال.\n- **GLEW** أو **GLAD:** عشان تحمّل مؤشرات الدوال الخاصة بـ OpenGL.\n\nأمر الترجمة بيكون زي:\n\n```bash\ng++ main.cpp -o game -lglfw -lGLEW -lGL\n```\n\nده مثال مبسط لبرنامج بيرسم مثلث أزرق. لاحظ إن الشيدرات بيتكتبوا كنصوص (Strings) وبيتحولوا لكود على كرت الشاشة.",
      },
    ],
    code: [
      {
        title: "الـ Shaders بلغة GLSL + محاكاة مبسطة للـ Pipeline",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

// كود الـ Vertex Shader بلغة GLSL (زي ما يتكتب في المشاريع الحقيقية)
const char* vertexShader = R"glsl(
#version 330 core
layout(location = 0) in vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}
)glsl";

// كود الـ Fragment Shader بلغة GLSL
const char* fragmentShader = R"glsl(
#version 330 core
out vec4 FragColor;
void main() {
    FragColor = vec4(0.2, 0.6, 1.0, 1.0);
}
)glsl";

struct Vec2 { float x, y; };

int main() {
    cout << "=== Vertex Shader ===" << endl;
    cout << vertexShader << endl;
    cout << "=== Fragment Shader ===" << endl;
    cout << fragmentShader << endl;

    // محاكاة مبسطة: الرؤوس بتتحول وتترسم
    vector<Vec2> vertices = {
        {-0.5f, -0.5f},
        { 0.5f, -0.5f},
        { 0.0f,  0.5f}
    };

    cout << "المثلث بيترسم من 3 رؤوس:" << endl;
    for (Vec2 v : vertices) {
        cout << "  (" << v.x << ", " << v.y << ")" << endl;
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين الـ Vertex Shader والـ Fragment Shader؟",
        options: [
          "Vertex بيشتغل على الرؤوس وبيحول الإحداثيات، Fragment بيشتغل على كل بكسل وبيحدد لونه",
          "الاتنين بيعملوا نفس الحاجة",
          "Fragment للصوت وVertex للرسوم",
          "مفيش فرق",
        ],
        answer: 0,
        explanation: "Vertex Shader بيعالج الرؤوس، وFragment Shader بيعالج البكسلات.",
      },
      {
        question: "إيه وظيفة الـ Graphics Pipeline؟",
        options: [
          "تحويل الأشكال ثلاثية الأبعاد لبكسلات ملونة على الشاشة",
          "إدارة ملفات اللعبة",
          "تخزين الصور",
          "توليد الصوت",
        ],
        answer: 0,
        explanation: "Pipeline كرت الشاشة بيحول الإحداثيات لألوان بكسلات عبر مراحل ثابتة.",
      },
      {
        question: "ليه بنحتاج GLFW في مشاريع OpenGL؟",
        options: [
          "عشان تفتح نافذة وتستقبل الإدخال من الكيبورد والماوس",
          "عشان ترسم المثلثات",
          "عشان تحسب الألوان",
          "عشان تشغل الصوت",
        ],
        answer: 0,
        explanation: "GLFW بتدير النافذة والإدخال، وOpenGL بيتكفل بالرسم بس.",
      },
    ],
    exercise:
      "جرّب تكتب الـ Fragment Shader عشان يطلع لون أحمر بدل الأزرق، واكتب Vertex Shader بيعمل تكبير (Scaling) للرؤوس بمعامل 2.",
    terms: [
      { en: "OpenGL", ar: "واجهة برمجة رسوميات: API للرسم على كرت الشاشة بتشتغل على كل المنصات." },
      { en: "Shader", ar: "شيدر: برنامج صغير بيشتغل على كرت الشاشة، زي Vertex وFragment Shader." },
      { en: "Vertex", ar: "رأس: نقطة في الفضاء ثلاثي الأبعاد، بتكوّن معا الأشكال الهندسية." },
      { en: "Rasterization", ar: "تحويل الشكل الهندسي لنقاط بكسل على الشاشة عشان تتلون." },
    ],
  },
  {
    id: "game-physics",
    title: "الفيزياء: الحركة والتصادم",
    titleEn: "Game Physics",
    duration: "55 دقيقة",
    description:
      "إزاي الشخصيات بتتحرك وتصطدم وترتد: قوانين نيوتن في الألعاب، والـ AABB Collision.",
    sections: [
      {
        heading: "قوانين نيوتن في الألعاب",
        body: "الحركة في الألعاب بتعتمد على قانون نيوتن الأول: الجسم الساكن يفضل ساكن، والجسم المتحرك يفضل متحرك بسرعة ثابتة لحد ما قوة تغيره.\n\nفي اللعبة، بنحسب الموضع الجديد كل إطار:\n\n```text\nposition = position + velocity * dt\n```\n\nوالله (أو الجاذبية) بيغير السرعة:\n\n```text\nvelocity = velocity + acceleration * dt\n```\n\nفي لعبة منصات، الجاذبية بتسحب الشخصية لتحت طول الوقت. في لعبة سباق، الاحتكاك بيبطّأ العربية.",
      },
      {
        heading: "التكامل العددي",
        body: "الحسابات اللي فاتت بنسميها **التكامل العددي (Numerical Integration)** — بنقرب الحركة المستمرة بخطوات صغيرة.\n\n- **Euler:** بنحدّث الموضع باستخدام السرعة الحالية. سريع لكن مش دقيق جداً.\n- **Semi-Implicit Euler:** بنحدّث السرعة الأول، وبعدين نستخدم السرعة الجديدة لتحديث الموضع. أكثر استقراراً وأدق.\n\nأغلب الألعاب بتستخدم Semi-Implicit Euler لأنها تمنع المشاكل زي الطاقة اللي بتزيد مع الوقت.",
      },
      {
        heading: "اكتشاف التصادم: AABB",
        body: "**AABB (Axis-Aligned Bounding Box)** هو أسهل شكل للتصادم: مستطيل بيتلف حوالين الشخصية، وجوانبه موازية للمحاور.\n\nمستطيلين بيتصادموا لو تداخلوا في المحورين X وY مع بعض:\n\n```text\na.x < b.x + b.width  و\na.x + a.width > b.x  و\na.y < b.y + b.height و\na.y + a.height > b.y\n```\n\nلو أي شرط من دول مش متحقق، مفيش تصادم. دي أسرع طريقة للكشف عن التصادم وتستخدم في كل الألعاب تقريباً.",
      },
      {
        heading: "الاستجابة للتصادم",
        body: "لما نكتشف تصادم، لازم نقرر إيه اللي يحصل:\n\n- **الارتداد (Bounce):** نقلب اتجاه السرعة — الكورة ترتد عن الحيطة.\n- **الإيقاف (Stop):** نوقف الحركة في الاتجاه ده — الشخصية توقف قدام الحيطة.\n- **الانزلاق (Slide):** نلغي المركبة العمودية على الحيطة ونسيب الموازية.\n\nكمان لازم نصحح الموضع (Resolution): نشيل الشخصية من داخل الحيطة عشان متعلحقش جواها في الإطار الجاي.",
      },
      {
        heading: "مثال: كرة ترتد عن الحيطة",
        body: "هنكتب برنامج بيحاكي كرة بتتحرك وتصطدم بحيطة ويرتد عنهم. هنستخدم AABB للكشف، وقلب السرعة للارتداد، وتصحيح الموضع.",
      },
    ],
    code: [
      {
        title: "محاكاة فيزياء مع AABB Collision",
        language: "cpp",
        code: `#include <iostream>
using namespace std;

struct Vec2 { double x, y; };
struct Box { Vec2 pos, vel, size; };

bool intersects(const Box& a, const Box& b) {
    return a.pos.x < b.pos.x + b.size.x &&
           a.pos.x + a.size.x > b.pos.x &&
           a.pos.y < b.pos.y + b.size.y &&
           a.pos.y + a.size.y > b.pos.y;
}

int main() {
    const double dt = 0.016; // 60 إطار في الثانية

    Box ball = {{5, 5}, {3, 2}, {1, 1}};
    Box wall = {{8, 0}, {0, 0}, {1, 20}};

    for (int i = 0; i < 60; i++) {
        // تحديث الموضع حسب السرعة
        ball.pos.x += ball.vel.x * dt;
        ball.pos.y += ball.vel.y * dt;

        // فحص التصادم
        if (intersects(ball, wall)) {
            ball.vel.x = -ball.vel.x;              // ارتداد
            ball.pos.x = wall.pos.x - ball.size.x; // تصحيح الموضع
        }

        cout << "إطار " << i << ": الموضع ("
             << ball.pos.x << ", " << ball.pos.y << ")" << endl;
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين Euler و Semi-Implicit Euler؟",
        options: [
          "Semi-Implicit بيحدّث السرعة الأول وبعدين يستعملها، فأكثر استقراراً",
          "Euler أسرع دائماً",
          "Semi-Implicit للرسوم وEuler للصوت",
          "مفيش فرق",
        ],
        answer: 0,
        explanation: "تحديث السرعة الأول بيمنع تراكم الطاقة الغريب ويخلي الفيزياء مستقرة.",
      },
      {
        question: "إيه الـ AABB وإزاي بنتعرف عليه؟",
        options: [
          "مستطيل موازي للمحاور بنلف حوالين الجسم، والكشف بيحصل بمقارنة الإحداثيات",
          "نوع من الصوت",
          "طريقة رسم",
          "خوارزمية ضغط",
        ],
        answer: 0,
        explanation: "AABB أسرع طريقة للكشف عن التصادم لأن المقارنة بسيطة.",
      },
      {
        question: "ليه بنضرب السرعة في dt مش بنضيفها مباشرة؟",
        options: [
          "عشان الحركة تبقى متناسبة مع الزمن الفعلي مش مع عدد الإطارات",
          "عشان الحركة تبقى أبطأ",
          "عشان نوفر الذاكرة",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "لو من غير dt، الحركة هتبقى أسرع على الأجهزة اللي بترسم إطارات أكتر.",
      },
    ],
    exercise:
      "أضف جاذبية للبرنامج: اجعل الكرة تسقط لتحت بسرعة بتزايد، وترتد عن الأرضية (خط y=19) بمعامل ارتداد 0.7.",
    terms: [
      { en: "Velocity", ar: "سرعة: مقدار واتجاه الحركة، بتتحسب بوحدة مسافة/زمن." },
      { en: "AABB", ar: "مستطيل محاذٍ للمحاور: صندوق موازي للمحاور بنلف حوالين الجسم للكشف عن التصادم." },
      { en: "Integration", ar: "تكامل عددي: تقريب الحركة المستمرة بخطوات صغيرة في كل إطار." },
      { en: "Collision Response", ar: "استجابة التصادم: رد الفعل لما جسمين يتصادموا، زي الارتداد أو الإيقاف." },
    ],
  },
  {
    id: "ecs",
    title: "معمارية الأنظمة والكيانات ECS",
    titleEn: "Entity Component System",
    duration: "55 دقيقة",
    description:
      "المعمارية اللي بتشتغل بيها أكبر محركات الألعاب: الكيان بس، والمكونات، والأنظمة اللي بتعالجهم.",
    sections: [
      {
        heading: "مشكلة الوراثة في الألعاب",
        body: "تخيل إنك بتصمم لعبة وفيها لاعب وعدو وصندوق وسلاح. كل واحد ليه خصائص مختلفة: اللاعب بيتحرك وبيرى، العدو بيتحرك وبجذب، الصندوق بيتصادم...\n\nلو استخدمنا الوراثة التقليدية (Inheritance)، هنلاقي شجرة وراثة معقدة: `Entity` → `Actor` → `Player` و`Enemy` → `FlyingEnemy`. وكل ما نضيف خاصية جديدة، الشجرة بتتعقد أكتر.\n\nالمشكلة الأكبر: لما العينة (Enemy) يحتاج خاصية من المسد (Player) زي الصحة، مش بنعرف نعمل كده بسهولة من غير تكرار الكود.",
      },
      {
        heading: "الفلسفة: التركيب بدل الوراثة",
        body: "الحل هو **التركيب بدل الوراثة (Composition over Inheritance):** بدل ما نقول \"العدو نوع من الكيان\"، بنقول \"العدو كيان فيه مكون حركة ومكون صحة ومكون ذكاء\".\n\n- **الكيان (Entity):** مجرد رقم (ID) — مفيش فيه بيانات ولا سلوك.\n- **المكون (Component):** بيانات خالص — زي الموضع أو الصحة أو السرعة.\n- **النظام (System):** سلوك — دالة بتمشي على كل الكيانات اللي عندها مكون معين.\n\nالكيان بيتكون من تركيبة مكونات. تقدر تضيف أو تشيل مكونات في أي وقت — ومرونة عالية جداً.",
      },
      {
        heading: "إيه الفايدة الحقيقية؟",
        body: "- **المرونة:** تقدر تغيّر تركيب الكيان من غير ما تغيّر الكود.\n- **الأداء:** الأنظمة بتمشي على بيانات متجاورة في الذاكرة (Data-Oriented Design)، وده أسرع بكتير من استدعاء دوال على كائنات متبعثرة.\n- **إعادة الاستخدام:** مكون الصحة بيستخدمه اللاعب والعدو والزعيم بسهولة.\n- **الاختبار:** كل نظام مستقل وسهل اختباره لوحده.\n\nمحركات زي **Unity** و**Unreal** (بأشكال مختلفة) و**Flecs** بتبني على نفس الفكرة.",
      },
      {
        heading: "مثال: ECS بسيط بلغة C++",
        body: "هنبني ECS مصغّر: كيانات بتتكون من مكونات موضع وسرعة وصحة، ونظام حركة بيحدّث المواقع. الكود بيوضح إن الكيان مجرد رقم، والمكونات مستقلة، والنظام بيعالج المكونات.",
      },
    ],
    code: [
      {
        title: "ECS مبسط: كيانات ومكونات وأنظمة",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <memory>
#include <string>
using namespace std;

struct Component { virtual ~Component() = default; };

struct Position : Component { double x, y; Position(double x_, double y_) : x(x_), y(y_) {} };
struct Velocity : Component { double dx, dy; Velocity(double dx_, double dy_) : dx(dx_), dy(dy_) {} };
struct Health : Component { int hp; Health(int h) : hp(h) {} };

struct Entity {
    string name;
    vector<shared_ptr<Component>> components;
};

class World {
    vector<Entity> entities;
public:
    int createEntity(const string& name) {
        entities.push_back({name, {}});
        return (int)entities.size() - 1;
    }
    Entity& get(int id) { return entities[id]; }

    template <typename T>
    void addComponent(int id, shared_ptr<T> c) {
        entities[id].components.push_back(c);
    }

    template <typename T>
    shared_ptr<T> getComponent(int id) {
        for (auto& c : entities[id].components) {
            auto casted = dynamic_pointer_cast<T>(c);
            if (casted) return casted;
        }
        return nullptr;
    }
};

class MovementSystem {
public:
    void update(World& world, int count, double dt) {
        for (int i = 0; i < count; i++) {
            auto pos = world.getComponent<Position>(i);
            auto vel = world.getComponent<Velocity>(i);
            if (pos && vel) {
                pos->x += vel->dx * dt;
                pos->y += vel->dy * dt;
            }
        }
    }
};

int main() {
    World world;

    int player = world.createEntity("لاعب");
    world.addComponent<Position>(player, make_shared<Position>(0, 0));
    world.addComponent<Velocity>(player, make_shared<Velocity>(2, 1));
    world.addComponent<Health>(player, make_shared<Health>(100));

    int enemy = world.createEntity("عدو");
    world.addComponent<Position>(enemy, make_shared<Position>(10, 5));
    world.addComponent<Health>(enemy, make_shared<Health>(50));

    MovementSystem movement;
    movement.update(world, 2, 0.5);

    cout << "اللاعب: الموضع (" << world.getComponent<Position>(player)->x << ", "
         << world.getComponent<Position>(player)->y << ")" << endl;
    cout << "العدو: الموضع (" << world.getComponent<Position>(enemy)->x << ", "
         << world.getComponent<Position>(enemy)->y << ")" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه المشكلة اللي بتحلها معمارية ECS؟",
        options: [
          "شجرة الوراثة المعقدة في الألعاب وصعوبة إعادة استخدام الخصائص",
          "بطء الرسوميات",
          "مشاكل الصوت",
          "إدارة النوافذ",
        ],
        answer: 0,
        explanation: "ECS بتستبدل الوراثة العميقة بتركيب مرن من المكونات.",
      },
      {
        question: "إيه الفرق بين الـ Entity والـ Component؟",
        options: [
          "Entity مجرد رقم بلا بيانات، Component بيانات خالصة",
          "الاتنين نفس الحاجة",
          "Component نوع من الكيانات",
          "Entity بيحتوي على السلوك",
        ],
        answer: 0,
        explanation: "الكيان هو الهوية بس، والمكونات هي اللي بتحمل البيانات.",
      },
      {
        question: "ليه بنقول Composition over Inheritance؟",
        options: [
          "عشان نركب السلوك من مكونات صغيرة بدل ما نورث من شجرة معقدة",
          "عشان الكود يبقى أطول",
          "عشان نتفادى الكتابة",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "التركيب بيتيح مرونة عالية وإعادة استخدام للكود.",
      },
    ],
    exercise:
      "أضف نظام صحة (HealthSystem) بيقلل الصحة لكل الكيانات اللي عندها مكون Health، ويطبع تنبيه لما الصحة توصل صفر.",
    terms: [
      { en: "Entity", ar: "كيان: هوية مجرد رقم (ID) مفيش فيها بيانات ولا سلوك." },
      { en: "Component", ar: "مكوّن: بيانات خالصة زي الموضع أو الصحة، بتلتزق بالكيان." },
      { en: "System", ar: "نظام: سلوك أو دالة بتمشي على الكيانات اللي عندها مكون معين." },
      { en: "Composition over Inheritance", ar: "التركيب بدل الوراثة: بناء الكائنات من مكونات صغيرة بدل شجرة وراثة عميقة." },
    ],
  },
  {
    id: "audio-input",
    title: "الصوت والإدخال Audio & Input",
    titleEn: "Audio & Input",
    duration: "50 دقيقة",
    description:
      "من زر الكيبورد للصوت المسموع: نظام إدخال Action-Based، وتوليد ملفات WAV من الصفر.",
    sections: [
      {
        heading: "قراءة الإدخال",
        body: "الألعاب بتستقبل الإدخال من عدة مصادر: الكيبورد، الماوس، الجويستيك، والشاشات اللمسية. كل زر ليه حالة: مضغوط (Pressed) أو مرفوع (Released).\n\nالمشكلة: كل لعبة بتستخدم الزرار بشكل مختلف. في لعبة، السهم الشمال بيjump؛ في لعبة تانية، بيصوّب. ليه نربط الكود بزرار معين؟",
      },
      {
        heading: "الإدخال القائم على الأفعال",
        body: "الحل هو **Action-Based Input:** بدل ما نقول \"لو زرار W مضغوط\"، بنقول \"لو فعل الحركة للأمام مفعّل\".\n\n- **Action:** فعل مجرد زي `Jump` أو `MoveRight` أو `Shoot`.\n- **Mapping:** جدول بيربط كل Action بزرار أو أكتر.\n\nاللاعب يقدر يغيّر الربط (Remap) من غير ما نلمس كود اللعبة. وكل الأزرار بتتعامل بنفس الطريقة.",
      },
      {
        heading: "الصوت الرقمي",
        body: "الصوت في الكمبيوتر بيتمثل كسلسلة أرقام: **عيّنات (Samples)**. كل عينة بتمثل سعة الموجة الصوتية في لحظة معينة.\n\n**معدل العيّنات (Sample Rate):** عدد العيّنات في الثانية. -most شيوع 44100 هرتز (44.1kHz) — يعني 44100 عينة لكل ثانية. الرقم ده بيحدد جودة الصوت.\n\n**العمق البيتي (Bit Depth):** دقة كل عينة. 16-bit معناها كل عينة من 65536 قيمة ممكنة.\n\nالصوت بيتكتب في ملفات زي **WAV** (بدون ضغط) أو **MP3** (مضغوط).",
      },
      {
        heading: "الـ Audio Pipeline",
        body: "الصوت في اللعبة بيمر بسلسلة مراحل:\n\n1. **Load:** تحميل الملف الصوتي للذاكرة.\n2. **Decode:** لو مضغوط، فك ضغطه لعيّنات خام.\n3. **Mixing:** دمج كل الأصوات اللي بتشتغل مع بعض في موجة واحدة.\n4. **Spatialization:** تعديل الصوت حسب بعد المصدر عن اللاعب.\n5. **Playback:** إرسال الخليط النهائي للسماعات.\n\nمكتبات زي **FMOD** و**OpenAL** و**Wwise** بتعمل كل ده تلقائياً.",
      },
      {
        heading: "مثال: نظام إدخال + توليد نغمة WAV",
        body: "هنكتب نظام إدخال مبسط بالأفعال، ونولّد ملف WAV فيه نغمة 440 هرتز (الموسيقية). الكود بيوضح إزاي بيتم توليد العيّنات وكتابة الـ WAV Header.",
      },
    ],
    code: [
      {
        title: "نظام إدخال Action-Based + توليد WAV",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <cmath>
#include <fstream>
using namespace std;

// ---------- نظام الإدخال ----------
enum class Action { Jump, MoveLeft, MoveRight, Shoot };

class InputSystem {
    map<Action, bool> state;
public:
    void set(Action a, bool pressed) { state[a] = pressed; }
    bool isPressed(Action a) {
        return state.count(a) && state[a];
    }
};

// ---------- توليد صوت WAV ----------
void writeWav(const string& filename, const vector<short>& samples, int sampleRate) {
    ofstream out(filename, ios::binary);
    int dataSize = (int)samples.size() * 2;

    out.write("RIFF", 4);
    int chunkSize = 36 + dataSize;
    out.write(reinterpret_cast<const char*>(&chunkSize), 4);
    out.write("WAVE", 4);
    out.write("fmt ", 4);

    int subChunk1 = 16;
    short audioFormat = 1;
    short numChannels = 1;
    out.write(reinterpret_cast<const char*>(&subChunk1), 4);
    out.write(reinterpret_cast<const char*>(&audioFormat), 2);
    out.write(reinterpret_cast<const char*>(&numChannels), 2);
    out.write(reinterpret_cast<const char*>(&sampleRate), 4);

    int byteRate = sampleRate * 2;
    out.write(reinterpret_cast<const char*>(&byteRate), 4);
    short blockAlign = 2;
    short bitsPerSample = 16;
    out.write(reinterpret_cast<const char*>(&blockAlign), 2);
    out.write(reinterpret_cast<const char*>(&bitsPerSample), 2);

    out.write("data", 4);
    out.write(reinterpret_cast<const char*>(&dataSize), 4);
    out.write(reinterpret_cast<const char*>(samples.data()), dataSize);
    out.close();
}

int main() {
    // نجرب نظام الإدخال
    InputSystem input;
    input.set(Action::Jump, true);
    input.set(Action::MoveRight, true);

    cout << " Jump pressed: " << input.isPressed(Action::Jump) << endl;
    cout << " MoveLeft pressed: " << input.isPressed(Action::MoveLeft) << endl;

    // نولد نغمة 440 هرتز لمدة نصف ثانية
    const int sampleRate = 44100;
    const int duration = sampleRate / 2;
    vector<short> samples(duration);

    for (int i = 0; i < duration; i++) {
        double t = (double)i / sampleRate;
        samples[i] = (short)(sin(2 * 3.14159265 * 440 * t) * 30000);
    }

    writeWav("tone.wav", samples, sampleRate);
    cout << "تم توليد tone.wav" << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه فائدة الـ Action-Based Input؟",
        options: [
          "اللاعب يقدر يغيّر الربط من غير ما نلمس كود اللعبة",
          "يجعل اللعبة أبطأ",
          "يمنع استخدام الكيبورد",
          "مفيش فائدة",
        ],
        answer: 0,
        explanation: "بفصل الفعل عن الزرار، نقدر نعيد ربط الأزرار بسهولة.",
      },
      {
        question: "إيه معنى الـ Sampling Rate؟",
        options: [
          "عدد عيّنات الصوت في الثانية، زي 44100 هرتز",
          "عدد قنوات الصوت",
          "حجم ملف الصوت",
          "سرعة اللعبة",
        ],
        answer: 0,
        explanation: "معدل العيّنات بيحدد جودة الصوت، و44100 هرتز هو الشائع.",
      },
      {
        question: "إيه الفرق بين الصوت التناظري والرقمي؟",
        options: [
          "التناظري موجة مستمرة، والرقمي عيّنات متقطعة",
          "الاتنين نفس الحاجة",
          "الرقمي أسوأ دايماً",
          "التناظري أسرع",
        ],
        answer: 0,
        explanation: "الصوت الرقمي بيتحول لمجموعة أرقام (عيّنات) عشان الكمبيوتر يقدر يعالجه.",
      },
    ],
    exercise:
      "وسّع نظام الإدخال عشان يدعم الماوس: أضف Action باسم `MouseClick`، وطبّق إزاي اللعبة بتقرأ موضع الماوس.",
    terms: [
      { en: "Sampling Rate", ar: "معدل العيّنات: عدد عيّنات الصوت المسجلة في الثانية، زي 44100 هرتز." },
      { en: "Input Mapping", ar: "ربط الإدخال: ربط كل فعل في اللعبة بزرار أو أكثر على جهاز الإدخال." },
      { en: "Audio Mixing", ar: "مزج الصوت: دمج كل الأصوات اللي بتشتغل مع بعض في موجة واحدة." },
      { en: "WAV", ar: "صيغة ملف صوت بدون ضغط، بتحمل عيّنات خام مع هيدر بسيط." },
    ],
  },
  {
    id: "game-ai",
    title: "ذكاء اصطناعي للألعاب: Pathfinding",
    titleEn: "Game AI: Pathfinding",
    duration: "60 دقيقة",
    description:
      "إزاي العدو بيلاقي طريقه ناحية اللاعب: خوارزمية A* والـ Heuristics على الشبكات.",
    sections: [
      {
        heading: "إيه الـ Pathfinding؟",
        body: "**إيجاد المسار (Pathfinding)** هو قدرة الشخصية على تعرف طريقها من نقطة لنقطة تانية من غير ما تصطدم بالعوائق.\n\nفي الألعاب، الخريطة بتتقسّم لشبكة من الخلايا (Grid). كل خلية إما قابلة للمشي أو جدار. الشخصية عايزة تلاقي أقصر طريق من خليتها لأقرب خلية للاعب.",
      },
      {
        heading: "خوارزمية A*: الفكرة",
        body: "**A\\*** هي أشهر خوارزمية لإيجاد المسار. الفكرة بسيطة: نحسب لكل خلية تكلفة إجمالية `f` من جزئين:\n\n```text\nf = g + h\n```\n\n- `g`: التكلفة الحقيقية من البداية للخلية دي.\n- `h`: التقدير (Heuristic) للتكلفة من الخلية دي للهدف.\n\nالخوارزمية بتختار دايماً الخلية اللي عندها أقل `f`، وده خليها ذكية جداً: مش بتدور في كل الاتجاهات، لكن بتركز على الاتجاه اللي فيه الهدف.",
      },
      {
        heading: "إيه الـ Heuristic؟",
        body: "الـ **Heuristic** هي دالة بتقدّر المسافة من خلية للهدف من غير ما تحسب فعلياً.\n\n- **Manhattan Distance:** المسافة في خطين مستقيمين (يمين/شمال + فوق/تحت). مناسبة للشبكات اللي بتتحرك فيها 4 اتجاهات.\n- **Euclidean Distance:** المسافة المستقيمة (جذر مجموع المربعات). مناسبة للحركة الحرة.\n\nالقاعدة الذهبية: الـ Heuristic لازم تكون **مقبولة (Admissible)** — يعني متبالغش في المسافة، متقولهاش أصغر من الحقيقة أبداً. لو بالغت، A* ممكن تلاقي مسار مش أقصر.",
      },
      {
        heading: "مثال: A* على شبكة",
        body: "هنكتب خوارزمية A* كاملة على شبكة 5×5 فيها جدران. الكود بيستخدم **First-In-First-Out** مع أولوية حسب `f`، وبيطبع المسار النهائي.",
      },
    ],
    code: [
      {
        title: "خوارزمية A* لإيجاد المسار",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <queue>
#include <cmath>
#include <algorithm>
using namespace std;

struct Point { int x, y; };

int heuristic(Point a, Point b) {
    return abs(a.x - b.x) + abs(a.y - b.y); // Manhattan
}

vector<Point> astar(const vector<vector<int>>& grid, Point start, Point goal) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> gScore(rows, vector<int>(cols, 1000000000));
    vector<vector<Point>> cameFrom(rows, vector<Point>(cols, {-1, -1}));

    auto cmp = [](const pair<int, Point>& a, const pair<int, Point>& b) {
        return a.first > b.first;
    };
    priority_queue<pair<int, Point>, vector<pair<int, Point>>, decltype(cmp)> open(cmp);

    gScore[start.y][start.x] = 0;
    open.push({heuristic(start, goal), start});

    int dx[4] = {1, -1, 0, 0};
    int dy[4] = {0, 0, 1, -1};

    while (!open.empty()) {
        Point current = open.top().second;
        open.pop();

        if (current.x == goal.x && current.y == goal.y) break;

        for (int i = 0; i < 4; i++) {
            int nx = current.x + dx[i];
            int ny = current.y + dy[i];
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            if (grid[ny][nx] == 1) continue; // جدار

            int tentative = gScore[current.y][current.x] + 1;
            if (tentative < gScore[ny][nx]) {
                cameFrom[ny][nx] = current;
                gScore[ny][nx] = tentative;
                open.push({tentative + heuristic({nx, ny}, goal), {nx, ny}});
            }
        }
    }

    // إعادة بناء المسار
    vector<Point> path;
    Point p = goal;
    while (!(p.x == -1 && p.y == -1)) {
        path.push_back(p);
        if (p.x == start.x && p.y == start.y) break;
        p = cameFrom[p.y][p.x];
    }
    reverse(path.begin(), path.end());
    return path;
}

int main() {
    // 0 = أرض، 1 = جدار
    vector<vector<int>> grid = {
        {0, 0, 0, 0, 1},
        {1, 1, 0, 0, 1},
        {0, 0, 0, 1, 0},
        {0, 1, 0, 0, 0},
        {0, 0, 0, 0, 0}
    };

    Point start = {0, 0};
    Point goal = {4, 4};

    vector<Point> path = astar(grid, start, goal);
    cout << "المسار:" << endl;
    for (Point p : path) {
        cout << "(" << p.x << ", " << p.y << ") ";
    }
    cout << endl;
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه الفرق بين A* و Dijkstra؟",
        options: [
          "A* بتستخدم Heuristic عشان تحد البحث، فأسرع في أغلب الحالات",
          "A* أبطأ دائماً",
          "Dijkstra مش بتدور على المسار",
          "مفيش فرق",
        ],
        answer: 0,
        explanation: "الـ Heuristic بتوجه A* نحو الهدف، فبتقل عدد الخلايا اللي بتفحصها.",
      },
      {
        question: "إيه معنى الـ Heuristic؟",
        options: [
          "دالة بتقدّر المسافة للهدف من غير ما تحسبها فعلياً",
          "عدد الخلايا في الشبكة",
          "سرعة الشخصية",
          "حجم الشاشة",
        ],
        answer: 0,
        explanation: "Heuristic بتوفر تقدير سريع للمسافة، وبترشد الخوارزمية نحو الهدف.",
      },
      {
        question: "ليه بنستخدم Manhattan Distance في الشبكات؟",
        options: [
          "لأن الحركة في الشبكة بتكون 4 اتجاهات، فالمسافة بتحسب كجمع الفروق",
          "لأنها أسرع من أي حاجة",
          "لأنها بتستخدم الجذر التربيعي",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "Manhattan Distance بتعكس طبيعة الحركة في الشبكة (يمين/شمال/فوق/تحت).",
      },
    ],
    exercise:
      "عدّل الكود عشان يدعم الحركة القطرية (8 اتجاهات)، واستخدم Euclidean Distance كـ Heuristic. قارن عدد الخلايا المكتشفة في الحالتين.",
    terms: [
      { en: "A*", ar: "خوارزمية بحث عن المسار: بتستخدم تكلفة حقيقية مع تقدير للوصول بأسرع طريقة." },
      { en: "Heuristic", ar: "تقدير: دالة بتقدّر المسافة للهدف من غير حساب فعلي، وبترشد الخوارزمية." },
      { en: "Pathfinding", ar: "إيجاد المسار: قدرة الشخصية على الوصول من نقطة لنقطة تانية مع تجنب العوائق." },
      { en: "Node", ar: "عقدة: خلية في الشبكة اللي الخوارزمية بتفحصها وبتسجل تكاليفها." },
    ],
  },
  {
    id: "game-project",
    title: "مشروع: لعبة Snake كاملة بمحرك خاص",
    titleEn: "Project: Full Snake Game Engine",
    duration: "100 دقيقة",
    description:
      "المشروع الختامي: لعبة Snake كاملة بمحركك الخاص — حلقة لعبة، نظام كيانات، فيزياء تصادم، ورسم كونسول.",
    sections: [
      {
        heading: "نظرة على المشروع",
        body: "في المشروع ده هنبني لعبة **Snake** كاملة بمحرك ألعاب من الصفر. اللعبة هتشتغل في الكونسول، وهنستخدم كل المفاهيم اللي تعلمناها: حلقة اللعبة، نظام الكيانات والمكونات، التصادم، والـ Game State.\n\nالهدف من المشروع مش بس اللعبة — الهدف إنك تبني **محرك** يقدر يشغّل أي لعبة مش بس Snake.",
      },
      {
        heading: "معمارية المحرك",
        body: "هننظم الكود في طبقات:\n\n1. **Game Loop:** الحلقة الرئيسية اللي بتنادي `update` و`render`.\n2. **Entities:** الثعبان والطعام كوحدات مستقلة.\n3. **Components:** الموضع، الاتجاه، الحجم.\n4. **Systems:** نظام الحركة، نظام الأكل، نظام التصادم.\n5. **Renderer:** رسم الشبكة في الكونسول.\n\nالفصل بين الطبقات دي بيخلي المحرك قابل للتوسع — تقدر تضيف لعبة تانية من غير ما تعيد كتابة الحلقة أو الرسم.",
      },
      {
        heading: "منطق اللعبة",
        body: "- **الحركة:** الثعبان بيتحرك خلية واحدة في كل لفة بالاتجاه الحالي.\n- **الأكل:** لما رأس الثعبان يوصل للطعام، بيكبر (ينمو) والنقاط بتزيد، وبيظهر طعام جديد.\n- **التصادم:** لو الرأس لمس الحيطة أو جسم الثعبان، اللعبة تنتهي.\n- **الإدخال:** اللاعب بيحدد الاتجاه بـ W/A/S/D، والثعبان مش بيقدر يعكس اتجاهه فوراً (عشان كده بنمنع العكس).",
      },
      {
        heading: "الخطوات التنفيذية",
        body: "1. ابدأ بـ `GameLoop` بيطور الحالة ويرسمها.\n2. أضف الـ Snake كـ deque من الخلايا، والطعام كخلية واحدة.\n3. اكتب نظام التصادم وشروط نهاية اللعبة.\n4. أضف النقاط والواجهة البسيطة.\n5. اختبر اللعبة وجرب توسّعها: سرعة متزايدة، جدران، أو مستويات.",
      },
    ],
    code: [
      {
        title: "لعبة Snake كاملة بمحرك مبسط",
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <deque>
#include <string>
#include <cstdlib>
#include <ctime>
using namespace std;

struct Point { int x, y; };

class SnakeGame {
    int width = 20, height = 15;
    deque<Point> snake;
    Point food;
    char direction = 'R';
    int score = 0;
    bool gameOver = false;

    void placeFood() {
        food = {rand() % width, rand() % height};
    }

    bool collides(Point p) {
        if (p.x < 0 || p.y < 0 || p.x >= width || p.y >= height) return true;
        for (Point s : snake) {
            if (s.x == p.x && s.y == p.y) return true;
        }
        return false;
    }

public:
    SnakeGame() {
        srand((unsigned)time(nullptr));
        snake.push_back({5, 7});
        snake.push_back({4, 7});
        snake.push_back({3, 7});
        placeFood();
    }

    void render() const {
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                bool isSnake = false;
                for (Point s : snake) {
                    if (s.x == x && s.y == y) isSnake = true;
                }
                if (isSnake) cout << "O";
                else if (food.x == x && food.y == y) cout << "*";
                else cout << ".";
            }
            cout << endl;
        }
        cout << "النقاط: " << score << " | الاتجاه: " << direction << endl;
    }

    void setDirection(char d) {
        if (d == 'W' && direction != 'D') direction = 'U';
        else if (d == 'S' && direction != 'U') direction = 'D';
        else if (d == 'A' && direction != 'R') direction = 'L';
        else if (d == 'D' && direction != 'L') direction = 'R';
    }

    void update() {
        Point head = snake.front();
        if (direction == 'U') head.y--;
        else if (direction == 'D') head.y++;
        else if (direction == 'L') head.x--;
        else if (direction == 'R') head.x++;

        if (collides(head)) { gameOver = true; return; }

        snake.push_front(head);
        if (head.x == food.x && head.y == food.y) {
            score += 10;
            placeFood();
        } else {
            snake.pop_back();
        }
    }

    bool isGameOver() const { return gameOver; }
    int getScore() const { return score; }
};

int main() {
    SnakeGame game;
    while (true) {
        game.render();
        cout << "اكتب الاتجاه (W/A/S/D) أو Q للخروج: ";

        string input;
        getline(cin, input);
        if (input.empty()) continue;

        char c = (char)toupper((unsigned char)input[0]);
        if (c == 'Q') break;

        game.setDirection(c);
        game.update();

        if (game.isGameOver()) {
            cout << "انتهت اللعبة! نقاطك: " << game.getScore() << endl;
            break;
        }
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        question: "إيه اللي بيحصل في كل لفة من حلقة اللعبة؟",
        options: [
          "بنحدّث حركة الثعبان، بنفحص التصادم، وبعدين بنرسم",
          "بنرسم بس",
          "بننام شوية",
          "بنمسح الذاكرة",
        ],
        answer: 0,
        explanation: "ترتيب التحديث ثم الرسم هو اللي بيضمن إن الإطار بيعرض الحالة الصحيحة.",
      },
      {
        question: "ليه بنستخدم deque للثعبان؟",
        options: [
          "عشان نضيف في الأول ونشيل من الآخر بكفاءة",
          "عشان نرتب الخلايا",
          "عشان نخزن الأرقام بس",
          "مفيش سبب",
        ],
        answer: 0,
        explanation: "deque بتسمح بإضافة الرأس في الأول وشيل الذيل من الآخر بسرعة ثابتة.",
      },
      {
        question: "إيه اللي بيحصل لما الثعبان يلمس نفسه؟",
        options: [
          "اللعبة تنتهي",
          "يكبر شوية",
          "يختفي",
          "يتوقف لمدة ثانية",
        ],
        answer: 0,
        explanation: "لمس النفس من شروط نهاية اللعبة — الثعبان بيعترض في جسمه.",
      },
    ],
    exercise:
      "أضف ميزة \"السرعة المتزايدة\": كل ما الثعبان ياكل 5 أكلات، زمن اللفة يقل شوية. استخدم `this_thread::sleep_for` مع زمن متغيّر.",
    terms: [
      { en: "Game State", ar: "حالة اللعبة: وضع اللعبة الحالي، زي جارية أو منتهية أو قائمة." },
      { en: "Tick", ar: "لفة تحديث: وحدة واحدة من حركة اللعبة، اللي بتحصل كل إطار." },
      { en: "Spawn", ar: "توليد: ظهور عنصر جديد في اللعبة، زي الطعام أو العدو." },
      { en: "Collision", ar: "تصادم: احتكاك جسمين مع بعض، بيتم فحصه في كل لفة." },
    ],
  },
];
