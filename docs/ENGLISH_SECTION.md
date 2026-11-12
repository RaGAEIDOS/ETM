# English section — architecture & content pipeline (Phase 4)

English courses from the @ZAmericanEnglish channel, embedded (never re-hosted) with Arabic-first ETM content. Spec: master prompt Phase 4.

## Layout

| Route | Purpose |
|---|---|
| `/english` | Hub: course cards, suggested study path, continue card, review-due count, channel credit |
| `/english/[video]` | Player page: click-to-load youtube-nocookie facade, summary / key terms / practice / speaking / notes tabs |
| `/english/review` | Spaced-repetition (Leitner) session for key terms |

## Why `englishVideos` is empty

YouTube is unreachable from the build environment and no Data API key was
available. Video entries therefore land ONLY from `out/english-courses.json`
(see below). Hand-written video entries are not allowed: an invented
`youtubeId` would silently embed the wrong video.

## Content pipeline

1. **Fetch metadata** (a machine with YouTube access; videos are never downloaded):

   ```powershell
   $env:YOUTUBE_API_KEY = "AIza…"          # or YT_API_KEY
   node scripts/fetch-playlists.mjs
   ```

   Output: `out/english-courses.json` (`{ items: [{ playlistId, position, id, title, duration, publishedAt }], playlists: [{ id, count }] }`).

   No key? `yt-dlp --flat-playlist -J <playlist-url>` per playlist — see the script's header.

2. **Transcribe** each item into `lib/english-videos.ts → englishVideos[]`:
   - `youtubeId` = `id` from the JSON (exact string, no guessing).
   - `titleEn` = original title verbatim; `title` = Arabic translation of it.
   - `summary` = 2–4 Arabic sentences **in your own words** from title +
     description. If you cannot verify what the video covers (no transcript/
     captions), write the conservative version and set `reviewed: false`.
   - `terms`: 1–5 `{ en, ar, example?: { en, ar } }`.
   - `practice`: 3–5 items matching the course type (grammar → `mcq`/`fill`;
     vocabulary → meaning/usage `mcq`/`fill`; listening/conversation →
     situation `mcq` + `dictation`; phonetics → text-based minimal pairs
     `mcq`). Mixed types allowed everywhere. Exactly one correct answer each,
     plus a one-line Arabic `explanation`.
   - `youtube` = `https://youtu.be/<id>?list=<playlistId>`.
   - Set `duration` from the JSON when present.
   - **Never paste transcript/caption text.** Summaries are conservative by design.

3. **Verify**: `npm run test:content` (ElZero rules do not apply here), then
   `npm run typecheck && npm run build`; check a sample page renders the
   embed and the tabs on a real page.

4. Update `lib/english-videos.ts` … the hub counters and sitemap entries are
   derived from the data automatically.

## Interaction design

- **Playback**: official YouTube IFrame Player API on `youtube-nocookie.com`,
  click-to-load facade (no request to YouTube before the learner clicks),
  no autoplay, responsive 16:9, inline playback on iOS, playback-rate buttons
  (0.75/1/1.25/1.5/2), keyboard shortcuts `[` / `]` / `0` (slower / faster / reset).
- **Resume**: the last position is saved as `video_progress` events (~every
  5 s while playing, track `english`, payload `{ seconds, percent, duration }`)
  and restored on next open via `seekTo`. No separate localStorage key.
- **Completion**: a lesson is complete when **watched ≥ 80 % AND practice ≥ 70 %** (auto-applies once, per mount) OR the learner confirms manually via the completion bar. Manual toggle always available — tapping undo un-completes. Completion rides on the unified store (`toggle("english", videoId, courseId)`).
- **Practice** items feed `quiz_attempt` (score/total/perQuestion/topic =
  courseId) — so English accuracy appears in the dashboard stats for free.
  Passing bar for completion display: ≥ 70 %.
- **Key terms** feed `term_review` events → the Leitner queue (see
  `lib/english/srs.ts`): boxes 0–5, review intervals 1/3/7/16/35/75 days,
  "known" promotes, "missed" resets to box 0, terms are due the next day
  after being missed. `/english/review` sessions and the dashboard
  "review due" counter both read this derivation.
- **Speaking** (optional tab): browser SpeechRecognition (en-US) when
  available; a graceful "not supported here" card otherwise. Nothing is
  recorded or sent anywhere.
- **Notes**: `etm-english-notes-v1` (`{ [videoId]: { text, updatedAt } }`),
  local-only, included in Export/Import/Delete my data.
- **Credit**: every English page shows the affiliation disclaimer
  (spec 4.7) with links to the original video/playlist/channel.

## Privacy

Learning data: `etm-progress-v2` (events) + `etm-english-notes-v1` (notes).
Both are covered by Export my data (notes included as `englishNotes`) and
Delete my data (both removed). No English-track data leaves the device;
the only third-party contact is YouTube's own embed/thumbnails after an
explicit click.

## Checkpoint 1

CHECKPOINT 1 (master prompt) = after the first **20 videos** of "English
from zero". It cannot be reached before the metadata fetch runs and the
first 20 entries are transcribed and reviewed. ETM must not merge/ship the
phase with invented or unreviewed-as-reviewed content.
