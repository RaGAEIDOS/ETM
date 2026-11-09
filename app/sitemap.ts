import type { MetadataRoute } from "next";
import { stages } from "@/lib/data";

const BASE_URL = "https://etm.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/curriculum`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/playground`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/glossary`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/projects`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/sources`, changeFrequency: "monthly", priority: 0.5 },
  ];

  stages.forEach((stage) => {
    entries.push({
      url: `${BASE_URL}/learn/${stage.id}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    stage.courses.forEach((course) => {
      entries.push({
        url: `${BASE_URL}/learn/${stage.id}/${course.id}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      course.lessons.forEach((lesson) => {
        entries.push({
          url: `${BASE_URL}/learn/${stage.id}/${course.id}/${lesson.id}`,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      });
    });
  });

  return entries;
}
