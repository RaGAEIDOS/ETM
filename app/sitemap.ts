import type { MetadataRoute } from "next";
import { stages } from "@/lib/data";
import { elzeroVideos } from "@/lib/elzero-videos";
import { englishCourses, englishVideos } from "@/lib/english-videos";
import { linuxVideos } from "@/lib/linux-videos";

const BASE_URL = "https://etm-learning.vercel.app";

/** Unprefixed = Arabic (default). English lives under /en. */
function entry(
  path: string,
  changeFrequency: "weekly" | "monthly",
  priority: number
): MetadataRoute.Sitemap[number] {
  const arPath = path === "" ? "/" : path;
  return {
    url: `${BASE_URL}${arPath}`,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ar: `${BASE_URL}${arPath}`,
        en: `${BASE_URL}/en${arPath === "/" ? "/" : arPath}`,
        "x-default": `${BASE_URL}${arPath}`,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    entry("/", "weekly", 1),
    entry("/landing", "weekly", 0.9),
    entry("/curriculum", "weekly", 0.9),
    entry("/dashboard", "weekly", 0.8),
    entry("/playground", "monthly", 0.7),
    entry("/glossary", "monthly", 0.6),
    entry("/projects", "monthly", 0.6),
    entry("/sources", "monthly", 0.5),
    entry("/books", "monthly", 0.6),
    entry("/guide", "monthly", 0.6),
  ];

  entries.push(entry("/elzero", "weekly", 0.9));
  elzeroVideos.forEach((video) => {
    entries.push(entry(`/elzero/${video.id}`, "monthly", 0.5));
  });
  entries.push(entry("/english", "weekly", 0.9));
  englishCourses.forEach((course) => {
    entries.push(entry(`/english/course/${course.id}`, "monthly", 0.6));
  });
  englishVideos.forEach((video) => {
    entries.push(entry(`/english/${video.id}`, "monthly", 0.5));
  });
  entries.push(entry("/english/review", "monthly", 0.4));
  entries.push(entry("/linux", "weekly", 0.9));
  entries.push(entry("/linux/course/linux-2021", "monthly", 0.6));
  entries.push(entry("/linux/review", "monthly", 0.4));
  linuxVideos.forEach((video) => {
    entries.push(entry(`/linux/${video.id}`, "monthly", 0.5));
  });
  stages.forEach((stage) => {
    entries.push(entry(`/learn/${stage.id}`, "weekly", 0.8));
    stage.courses.forEach((course) => {
      entries.push(entry(`/learn/${stage.id}/${course.id}`, "weekly", 0.7));
      course.lessons.forEach((lesson) => {
        entries.push(
          entry(`/learn/${stage.id}/${course.id}/${lesson.id}`, "monthly", 0.5)
        );
      });
    });
  });

  return entries;
}
