"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lesson, Stage } from "./types";

const STORAGE_KEY = "etm-progress-v1";

export type ProgressMap = Record<string, boolean>;

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota errors
  }
}

export function countCompleted(map: ProgressMap, lessons: Lesson[]) {
  return lessons.filter((l) => map[l.id]).length;
}

export function stageCompletion(map: ProgressMap, stage: Stage) {
  const all = stage.courses.flatMap((c) => c.lessons);
  const done = all.filter((l) => map[l.id]).length;
  return {
    done,
    total: all.length,
    percent: all.length === 0 ? 0 : Math.round((done / all.length) * 100),
  };
}

export function useProgress() {
  const [map, setMap] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMap(loadProgress());
    setReady(true);
  }, []);

  const toggle = useCallback((lessonId: string) => {
    setMap((prev) => {
      const next = { ...prev, [lessonId]: !prev[lessonId] };
      if (!next[lessonId]) delete next[lessonId];
      saveProgress(next);
      return next;
    });
  }, []);

  const isDone = useCallback(
    (lessonId: string) => Boolean(map[lessonId]),
    [map]
  );

  const reset = useCallback(() => {
    saveProgress({});
    setMap({});
  }, []);

  return { map, ready, toggle, isDone, reset };
}
