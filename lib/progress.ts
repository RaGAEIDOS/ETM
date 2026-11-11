"use client";

/**
 * Backwards-compatible adapter over the Phase 3 progress store.
 * Existing components keep working; new code should import from
 * "@/lib/progress/store" directly.
 *
 * The exported `map` shape matches the legacy boolean record:
 * cpp lesson ids map to true, ElZero videos map to `elzero-<id>` -> true.
 */

import { useCallback, useEffect, useState } from "react";
import type { Lesson, Stage } from "./types";
import {
  loadProgressFile,
  saveProgressFile,
  PROGRESS_CHANGE_EVENT,
  toggleCompletion,
} from "./progress/store";
import { deriveProgress, emptyProgressFile } from "./progress/core";

const AUTH_CHANGE_EVENT = "etm-auth-change";

export type ProgressMap = Record<string, boolean>;

/** Synchronous read of the merged progress map (guest + per-user legacy, migrated). */
export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  const file = loadProgressFile();
  const derived = deriveProgress(file.events);
  return { ...derived.map };
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
    const reload = () => setMap(loadProgress());
    reload();
    setReady(true);
    window.addEventListener(AUTH_CHANGE_EVENT, reload);
    window.addEventListener(PROGRESS_CHANGE_EVENT, reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, reload);
      window.removeEventListener(PROGRESS_CHANGE_EVENT, reload);
      window.removeEventListener("storage", reload);
    };
  }, []);

  const toggle = useCallback((lessonId: string) => {
    if (lessonId.startsWith("elzero-")) {
      toggleCompletion("elzero", lessonId.slice("elzero-".length));
    } else {
      toggleCompletion("cpp", lessonId);
    }
    // saveProgressFile dispatches PROGRESS_CHANGE_EVENT, which reloads the map.
  }, []);

  const isDone = useCallback((lessonId: string) => Boolean(map[lessonId]), [map]);

  const reset = useCallback(() => {
    const file = loadProgressFile();
    saveProgressFile({ ...emptyProgressFile(), settings: file.settings });
    setMap({});
  }, []);

  return { map, ready, toggle, isDone, reset };
}
