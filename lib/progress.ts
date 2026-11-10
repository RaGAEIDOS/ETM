"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lesson, Stage } from "./types";
import { recordActivityDay } from "./stats";

const STORAGE_KEY = "etm-progress-v1";
const SESSION_KEY = "etm-auth-session-v1";

export type ProgressMap = Record<string, boolean>;

function currentUserId(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as { id?: string };
    return u.id || null;
  } catch {
    return null;
  }
}

function userProgressKey(userId: string) {
  return `etm-progress-${userId}`;
}

function readUserProgress(userId: string): ProgressMap {
  try {
    const raw = localStorage.getItem(userProgressKey(userId));
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const uid = currentUserId();
    if (uid) {
      const fromUser = readUserProgress(uid);
      // دمج السحابة (المستخدم) مع المحلي - السحابة لها الأولوية لكن مفيش حذف
      const guest = (() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          return raw ? (JSON.parse(raw) as ProgressMap) : {};
        } catch {
          return {};
        }
      })();
      return { ...guest, ...fromUser };
    }
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
    const uid = currentUserId();
    if (uid) {
      localStorage.setItem(userProgressKey(uid), JSON.stringify(map));
      // تحديث وقت المزامنة (sync)
      localStorage.setItem(
        `etm-lastsync-${uid}`,
        new Date().toISOString()
      );
    }
  } catch {
    // ignore quota errors
  }
}

export function saveElzeroProgress(videoId: string, done: boolean) {
  const map = loadProgress();
  if (done) {
    map[`elzero-${videoId}`] = true;
    recordActivityDay();
  } else {
    delete map[`elzero-${videoId}`];
  }
  saveProgress(map);
}

export function isElzeroDone(videoId: string): boolean {
  return Boolean(loadProgress()[`elzero-${videoId}`]);
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
    const reload = () => setMap(loadProgress());
    window.addEventListener("etm-auth-change", reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener("etm-auth-change", reload);
      window.removeEventListener("storage", reload);
    };
  }, []);

  const toggle = useCallback((lessonId: string) => {
    setMap((prev) => {
      const next = { ...prev, [lessonId]: !prev[lessonId] };
      if (!next[lessonId]) delete next[lessonId];
      saveProgress(next);
      if (next[lessonId]) recordActivityDay();
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

/**
 * English-track progress keys: `eng-${courseId}-${videoId}`.
 * Playlists from the @ZAmericanEnglish channel start each at 001, so the
 * course id is required to keep keys unique across tracks. Mirrors the ElZero
 * convention (`elzero-${videoId}`).
 */
export function saveEnglishProgress(courseId: string, videoId: string, done: boolean) {
  const map = loadProgress();
  if (done) {
    map[`eng-${courseId}-${videoId}`] = true;
    recordActivityDay();
  } else {
    delete map[`eng-${courseId}-${videoId}`];
  }
  saveProgress(map);
}

export function isEnglishDone(courseId: string, videoId: string): boolean {
  return Boolean(loadProgress()[`eng-${courseId}-${videoId}`]);
}

export function englishVideoCompletion(
  map: ProgressMap,
  courseId: string,
  total: number
) {
  const done = Object.keys(map).filter((k) => k.startsWith(`eng-${courseId}-`)).length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
