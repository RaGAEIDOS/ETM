import courseRoutes from "../routes.json";

export const STATIC_ROUTES = [
  "/",
  "/landing",
  "/curriculum",
  "/elzero",
  "/playground",
  "/projects",
  "/glossary",
  "/guide",
  "/sources",
  "/books",
  "/dashboard",
  "/login",
  "/profile",
  "/progress",
] as const;

export const STAGE_ROUTES = Array.from(new Set(courseRoutes.map((r) => `/learn/${r.stage}`)));

export const COURSE_ROUTES = courseRoutes.map((r) => `/learn/${r.stage}/${r.course}`);

export const ELZERO_ROUTES = Array.from({ length: 78 }, (_, i) =>
  `/elzero/${String(i + 1).padStart(3, "0")}`
);

export const ALL_ROUTES = Array.from(new Set([...STATIC_ROUTES, ...STAGE_ROUTES, ...COURSE_ROUTES, ...ELZERO_ROUTES]));

// A small but representative set of lesson pages (curriculum spans 4 stages),
// enough to prove lesson rendering works without hitting every SSG page.
export const LESSON_ROUTES = [
  "/learn/stage-1/cpp-basics/hello-world",
  "/learn/stage-1/cpp-basics/variables-types",
  "/learn/stage-1/git-github/git-why",
  "/learn/stage-3/networking-db/db-intro",
  "/learn/stage-4/os-dev/kernel",
];
