import type { Metadata } from "next";
import { stages, totalLessons, totalCourses } from "@/lib/data";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "المنهج الكامل",
  description:
    "منهج ETM الكامل لتعلم البرمجة بلغة C++ من الصفر إلى منتهى الصعوبة — 4 مستويات، 17 كورس، أكثر من 100 درس تفاعلي، مبني على OSSU.",
};

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-cyan-400">المنهج الكامل</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white leading-tight">
            طريقك من الصفر إلى{" "}
            <span className="gradient-text">الاحتراف</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 leading-8">
            {totalCourses()} كورس · {totalLessons()} درس تفاعلي · 4 مستويات صعوبة.
            كل درس بشرح عربي، أمثلة قابلة للتشغيل، كويز، وتمرين.
          </p>
        </div>
      </Reveal>

      <CurriculumAccordion stages={stages} />
    </div>
  );
}
