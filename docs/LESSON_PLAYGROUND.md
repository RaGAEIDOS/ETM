# Lesson playground — adding an exercise

Optional; tasks A2-A7 in the brief live here.

## How the pieces fit

```
CodeBlock (components/CodeBlock.tsx)          → renders <LessonPlayground playground={ctx}/>
Markdown (components/Markdown.tsx)            → auto-passes ctx to fenced cpp code blocks
LessonView (components/LessonView.tsx)        → passes scope="learn", id=lesson.id, practiceLessonId=lesson.id
playground/LessonPlayground.tsx                → renders trigger; editor loads on click only
playground/LessonPlaygroundEditor.tsx          → editor + Wandbox runner + localStorage persistence
Wandbox lib (lib/wandbox.ts)                  → shared with /playground
```

Rollout is gated by `LESSON_PLAYGROUND_SCOPE` in `lib/feature-flags.ts`.

## To add an exercise to a /learn lesson

1. Open the lesson's content file, e.g. `lib/content/cpp-basics.ts`.
2. Add the code block(s) as fenced `cpp` inside a section body:

   ````markdown
   ```cpp
   #include <iostream>
   using namespace std;
   int main() {
       cout << "sum = " << 3 + 5 << endl;
       return 0;
   }
   ```
   ````

3. To turn a block into an exercise with hints + expected output, pass those props when wiring fenced code — currently the only exported façade is
   `exercise?: string` from the `Lesson` interface; extend `CodeBlock`'s `PlaygroundContext` with the extra fields (`stdinDefault`, `expectedOutput`, `hints[]`,
   `solution`) and feed them through `Markdown` or directly through `<CodeBlock playground={{...}}>`.

   ```tsx
   <CodeBlock
     code={starterCode}
     language="cpp"
     playground={{
       scope: "learn", id: "cpp-basics-section-1-block-0",
       exercise: "مجموع ٣ و ٥",
       stdinDefault: "3 5\n",
       expectedOutput: "sum = 8",
       hints: ["sum: two ints, plus operator", "cout prints then endl newline"],
       solution: "...",
     }}
   />
   ```

4. Progress marking is automatic for `scope: "learn"` / `practiceLessonId: lesson.id`:
   running code that compiles OK marks the lesson done via `etm-progress-v1` key `lesson.id`.

## ElZero videos

`app/elzero/[video]/page.tsx` passes `number: v.number` so the first two sections (#001-015) auto-show the runnable block. No content edits needed.

## Glossary examples

Set `scope: "glossary"` on any `<CodeBlock>` you want runnable — gating
respects `LESSON_PLAYGROUND_SCOPE` just the same.

## Reset / persistence

Storage key: `etm-lesson-code-{scope}-{id}-{blockHash}`.
`clearSavedCode()` in the reset button wipes only this block's code, not the
rest of the lesson's code blocks.
