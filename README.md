# ETM — منصة تعليم البرمجة بلغة C++

<div dir="rtl">

منصة **ETM** هي منصة تعليمية تفاعلية باللغة العربية لتعلّم البرمجة بلغة **C++** من الصفر المطلق حتى منتهى الصعوبة (بناء محرك ألعاب ونظام تشغيل ومترجم). المنهج مبني على منهج [OSSU](https://github.com/ossu/computer-science) العالمي، مع إعادة صياغة كاملة بالعربية، وأمثلة تفاعلية، ومشاريع حقيقية.

</div>

## ✨ المميزات

- **4 مستويات صعوبة**: سهل جداً → متوسط → صعب → منتهى الصعوبة
- **17 كورس، أكثر من 100 درس تفاعلي** بشرح عربي مبسّط
- **ملعب C++ حقيقي** في المتصفح (ترجمة وتشغيل من غير تثبيت أي برامج)
- **قاموس مصطلحات** إنجليزي/عربي لأكثر من 100 مصطلح
- **مشاريع حقيقية** متدرجة: آلة حاسبة، لعبة Snake بمحرك خاص، نواة نظام تشغيل
- **تتبع التقدم** محفوظ محلياً على جهازك
- **كويزات تفاعلية** بعد كل درس
- **دعم كامل للغة العربية** (RTL) مع شرح المصطلحات الأجنبية
- **مبني على منهج OSSU** العالمي المعتمد

## 🛠 التقنيات

| التقنية | الاستخدام |
| --- | --- |
| [Next.js 14](https://nextjs.org/) | إطار العمل الرئيسي (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | لغة البرمجة |
| [Tailwind CSS](https://tailwindcss.com/) | التصميم |
| [React Markdown](https://github.com/remarkjs/react-markdown) | عرض محتوى الدروس |
| [react-simple-code-editor](https://github.com/satya164/react-simple-code-editor) + [Prism](https://prismjs.com/) | محرر الكود في الملعب |
| [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | تلوين الكود في الدروس |
| [Lucide](https://lucide.dev/) | الأيقونات |
| [Wandbox API](https://wandbox.org/) | ترجمة وتشغيل C++ في المتصفح |

## 🚀 التشغيل محلياً

### المتطلبات

- [Node.js](https://nodejs.org/) الإصدار 18.17 أو أحدث (يفضّل 20+)

### خطوات التشغيل

```bash
# 1. استنسخ المشروع
git clone https://github.com/YOUR_USERNAME/etm.git
cd etm

# 2. ثبّت الحزم
npm install

# 3. شغّل خادم التطوير
npm run dev
```

بعدها افتح المتصفح على [http://localhost:3000](http://localhost:3000) 🚀

### الأوامر المتاحة

| الأمر | الوصف |
| --- | --- |
| `npm run dev` | تشغيل خادم التطوير على localhost:3000 |
| `npm run build` | بناء نسخة الإنتاج |
| `npm run start` | تشغيل نسخة الإنتاج بعد البناء |

## 📁 هيكل المشروع

```
etm/
├── app/                    # صفحات Next.js (App Router)
│   ├── page.tsx            # الصفحة الرئيسية
│   ├── curriculum/         # صفحة المنهج
│   ├── learn/              # صفحات الدروس (ديناميكية)
│   ├── playground/         # ملعب C++
│   ├── glossary/           # قاموس المصطلحات
│   ├── projects/           # المشاريع
│   ├── progress/           # تتبع التقدم
│   └── sources/            # المصادر
├── components/             # مكونات React القابلة لإعادة الاستخدام
├── lib/
│   ├── content/            # محتوى الدروس (ملف لكل كورس)
│   ├── data.ts             # تجميع المنهج
│   ├── stages.ts           # بيانات المراحل والكورسات
│   ├── glossary.ts         # قاموس المصطلحات
│   ├── projects.ts         # المشاريع
│   ├── progress.ts         # إدارة التقدم (localStorage)
│   └── types.ts            # تعريفات TypeScript
├── public/                 # الملفات الثابتة
└── package.json
```

## 🌍 النشر على Vercel

### الطريقة الأولى: من لوحة Vercel (الأسهل)

1. ارفع المشروع على GitHub (انظر القسم التالي).
2. روح [vercel.com](https://vercel.com/) وسجّل دخولك بحساب GitHub.
3. اضغط **Add New Project**.
4. اختار مستودع ETM واضغط **Import**.
5. اضغط **Deploy** — خلاص! Vercel بيكتشف Next.js تلقائياً.

### الطريقة الثانية: من سطر الأوامر

```bash
npm i -g vercel
vercel login
vercel --prod
```

## ☁️ الرفع على GitHub

```bash
# من داخل مجلد المشروع
git init
git add .
git commit -m "ETM — منصة تعليم البرمجة بلغة C++"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/etm.git
git push -u origin main
```

## 📚 هيكل المنهج

| المستوى | الاسم | عدد الكورسات | الهدف |
| --- | --- | --- | --- |
| 1 | سهل جداً | 3 | أساسيات C++، التفكير الحوسبي، الأدوات |
| 2 | متوسط | 4 | OOP، المؤشرات، هياكل البيانات، العودية |
| 3 | صعب | 5 | الخوارزميات، الرياضيات، المعمارية، الأنظمة، الشبكات |
| 4 | منتهى الصعوبة | 5 | المترجمات، محركات الألعاب، بناء نظام تشغيل، الأنظمة الموزعة، الأمن |

## 🤝 المساهمة

المشروع مفتوح المصدر ومرحّب بالمساهمات:

- إضافة دروس أو تحسين المحتوى
- ترجمة مصطلحات جديدة
- إصلاح الأخطاء أو تحسين الأداء

## 📄 الرخصة

هذا المشروع مرخّص برخصة [MIT](LICENSE). محتوى المنهج مستوحى من مصادر مفتوحة (OSSU, CS50, MIT OCW) مع احترام حقوق أصحابها.

---

<div dir="rtl">

صُنع بـ ❤️ للمجتمع العربي — معرفة مجانية للجميع.

</div>
