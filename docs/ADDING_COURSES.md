# Adding a new playlist to ETM

The ETM platform has two track flavours:

- **ElZero C++** (`app/elzero`, `lib/elzero-videos.ts`) – 78 videos from one single playlist.
- **English track** (`app/english/`, `lib/english-videos.ts`) – multiple playlists from @ZAmericanEnglish grouped into courses.

Both are intentionally structured the same way. This document explains how to add a new playlist — it assumes the YouTube Data API v3 is available on your machine.

## 1. What a "course" is

A single playlist from a channel counts as one course. Copy the channel URL or playlist ID; ETM only reads metadata — it never downloads or re-hosts videos.

## 2. Getting the metadata

### 2.1 With a YouTube Data API v3 key

```powershell
$env:YOUTUBE_API_KEY="AIza..."
node scripts/fetch-playlists.mjs
```

Add new playlists to the `PLAYLISTS` array in the script, or pass them explicitly:

```js
const PLAYLISTS = [{ id: "YOUR_PLAYLIST_ID", label: "Course label" }];
```

The script writes `out/english-courses.json`:

```json
{
  "status": "ok",
  "items": [
    {
      "playlistId": "...",
      "position": 1,
      "id": "VIDEO_ID",
      "title": "Original title",
      "durations": "PT5M47S"
    }
  ]
}
```

### 2.2 Without a key

```bash
yt-dlp --flat-playlist -J "https://www.youtube.com/playlist?list=YOUR_ID" > out/SOURCE.json
```

…and concatenate the results manually, or extend `scripts/fetch-playlists.mjs` to shell out to `yt-dlp` and merge the JSON.

## 3. Shape of the data (lib/english-videos.ts)

```ts
interface EnglishVideo {
  id: string;        // "001", "002" …
  number: number;
  courseId: string;  // must match an EnglishCourse.id
  title: string;     // Arabic, clear, in your own words
  titleEn: string;   // original channel title
  section: string;   // Arabic section
  sectionEn: string;
  youtube: string;   // watch URL incl. &list=
  duration?: string; // ISO 8601 when fetched ("PT5M47S")
  summary: string;   // 2–4 sentences, Arabic, your own words
  terms: { en: string; ar: string; example?: { en: string; ar: string } }[];  // ≥1
  quiz: QuizQuestion[]; // ≥2, exactly one correct each
  reviewed: boolean;
}
```

Rules:

- Arabic bodies must escape newlines as `\n` (see the Arabic example in `lib/content/elzero-fundamentals.ts`).
- Answers in Arabic are fine; the question text should ask directly what is expected (e.g. «الـ X ما هو؟» for vocabulary, «أكمل الفراغ» for grammar, situational replies for listening/conversation).
- Never copy transcripts, descriptions, or text from the original channel — write the content yourself.
- If you are unsure what a video covers, write the summary from the title alone and set `reviewed: false`, then have the owner review it.
- Each course has an entry in the `englishCourses` array (`lib/english-videos.ts`).

## 4. Sections

Like ElZero, group the videos of one playlist into sections. Assign `section` / `sectionEn` by reading the original playlist titles — for instance an "Introduction" section for the first 8 videos of the beginner track.

## 5. Progress / dashboard

Completion is stored under `eng-${courseId}-${videoId}` in `localStorage` (mirror of ElZero's `elzero-${videoId}`). Read it with `loadProgress()` / `saveEnglishProgress()` from `lib/progress.ts`, count with `englishVideoCompletion(map, courseId, total)` — the Dashboard can wire the new counters in later.

## 6. Adding pages

`app/english/[course]/page.tsx` walks `englishCourses` and renders sections grouped by `sectionEn`. `app/english/[course]/[video]/page.tsx` mirrors `app/elzero/[video]/page.tsx`: video player link, summary, terms, quiz and prev/next nav.

Every English page must credit the channel; see `components/EnglishCredit.tsx`.

## 7. Sitemap & navigation

`app/sitemap.ts` lists `/english` and each course page. The header/footer/cta button lead to `/english`. Keep the list in sync when you add a new course.

## 8. Phase workflow

After wiring a playlist into `englishCourses` + `englishVideos`:

```powershell
npx tsc --noEmit
node .opencode/skills/etm-debug/scripts/validate-content.cjs
# smoke test in browser (see .opencode/skills/etm-debug/SKILL.md)
```

Never commit invented video IDs. If the metadata hasn't been fetched yet, leave the video list empty and keep `videoCount: 0` until the real JSON is available.
