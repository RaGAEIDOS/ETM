export type BookFormat = "PDF" | "Online" | "Ebook" | "Tutorial" | "List";

export interface FreeBook {
  title: string;
  author: string;
  url: string;
  format: BookFormat;
  level: number; // 1 = Foundations, 2 = Intermediate, 3 = Advanced, 4 = Expert
  desc: string;
}

export interface FreeBookCategory {
  category: string;
  books: FreeBook[];
}

export const freeBooksByCategory: FreeBookCategory[] = [
  {
    category: "C++ foundations",
    books: [
      {
        title: "Think C++ Volume 1",
        author: "Bruce Eckel",
        url: "https://mindviewinc.github.io/ThinkCpp-Volume1/",
        format: "Online",
        level: 1,
        desc:
          "Classic guide to C++ thinking and good practice, freely licensed (CC-BY-NC-SA). Perfect companion to Stage 1 lessons.",
      },
      {
        title: "Learn C++",
        author: "LearnCpp.com",
        url: "https://www.learncpp.com/",
        format: "Tutorial",
        level: 1,
        desc:
          "A practical, pragmatic C++ tutorial and reference: basics, functions, templates, STL, and more. Free.",
      },
    ],
  },
  {
    category: "Version control",
    books: [
      {
        title: "Pro Git",
        author: "Scott Chacon",
        url: "https://git-scm.com/book/en/v2",
        format: "Ebook",
        level: 1,
        desc:
          "The definitive free guide to Git and GitHub — daily workflows, branches, PRs, tags, stash and revert. Essential reading for the git-github course.",
      },
    ],
  },
  {
    category: "Algorithms & Data structures",
    books: [
      {
        title: "Open Data Structures: An Introduction",
        author: "Pat Morin",
        url: "https://opendatastructures.org/",
        format: "PDF",
        level: 2,
        desc:
          "Completely free (CC-BY-SA) introduction to data structures: stacks, queues, lists, trees, graphs. Has a complete C++ edition.",
      },
      {
        title: "Hello, Algo",
        author: "Alan Ts & others",
        url: "https://www.hello-algo.com/",
        format: "Online",
        level: 2,
        desc:
          "Free, open-source tutorial teaching algorithms and data structures from zero. Pairs perfectly with the data-structures course.",
      },
    ],
  },
  {
    category: "Mathematics",
    books: [
      {
        title: "Mathematics for Computer Science",
        author: "Lehman, Leighton & Meyer",
        url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/resources/mit6_042jf10_textbook/",
        format: "PDF",
        level: 3,
        desc:
          "MIT's freely available textbook: logic, sets, number theory, probability, and linear algebra. Core reading for Stage 3.",
      },
      {
        title: "Discrete Mathematics: An Open Introduction",
        author: "Oscar Levin",
        url: "https://discrete.openmath.us/",
        format: "PDF",
        level: 3,
        desc:
          "A no-nonsense open textbook for self-study covering sets, graphs, counting, and proofs.",
      },
      {
        title: "Book of Proof",
        author: "Richard Hammack",
        url: "https://people.vcu.edu/~rhammack/BookOfProof/",
        format: "PDF",
        level: 2,
        desc:
          "Open text on crafting rigorous proofs and thinking formally — the foundation every algorithm rests on.",
      },
    ],
  },
  {
    category: "Systems & Operating systems",
    books: [
      {
        title: "Operating Systems: Three Easy Pieces (OSTEP)",
        author: "Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau",
        url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
        format: "PDF",
        level: 3,
        desc:
          "The most popular OS book ever published — free official PDF. Processes, threads, memory, virtualization, and file systems.",
      },
      {
        title: "Crafting Interpreters",
        author: "Rob Pike & Dave Beyer",
        url: "https://craftinginterpreters.com/",
        format: "Online",
        level: 4,
        desc:
          "The authoritative free guide to compilers and interpreters from scratch. Builds the intuition behind Stage 4.",
      },
    ],
  },
  {
    category: "Networking & databases",
    books: [
      {
        title: "Computer Networking: A Top-Down Approach (lecture series)",
        author: "James F. Kurose & Keith Ross",
        url: "https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm",
        format: "Online",
        level: 3,
        desc:
          "Free slides and notes for the top-down networking course — exactly the Stage 3 networking material.",
      },
      {
        title: "High Performance Browser Networking",
        author: "Ilya Grigorik",
        url: "https://hpbn.co/",
        format: "Online",
        level: 3,
        desc:
          "Free (CC-BY-SA) treatise on TCP, HTTP, DNS, TLS, and Web APIs.",
      },
      {
        title: "Use the Index, Luke!",
        author: "Markus Winand",
        url: "https://use-the-index-luke.com/",
        format: "Online",
        level: 3,
        desc:
          "Free SQL optimization book — learn query plans, table scans, and indexing done right.",
      },
    ],
  },
  {
    category: "Security",
    books: [
      {
        title: "OWASP Testing Guide v4.2",
        author: "OWASP Foundation",
        url: "https://owasp.org/www-project-web-security-testing-guide/",
        format: "Online",
        level: 4,
        desc:
          "The leading free guide for testing web applications for vulnerabilities — aligned with the Stage 4 security stage.",
      },
    ],
  },
  {
    category: "Games",
    books: [
      {
        title: "Game Programming Patterns",
        author: "Robert Nystrom",
        url: "https://gameprogrammingpatterns.com/",
        format: "Online",
        level: 4,
        desc:
          "Free (CC) patterns for writing games like professional engine teams: game loops, data-oriented design, entity composition.",
      },
    ],
  },
  {
    category: "General programming",
    books: [
      {
        title: "Structure and Interpretation of Computer Programs (SICP)",
        author: "Abelson & Sussman",
        url: "https://mitpress.mit.edu/sicp/",
        format: "Online",
        level: 1,
        desc:
          "The canonical first text on thinking like a programmer. Free online edition from MIT Press.",
      },
      {
        title: "How to Design Programs (HtDP)",
        author: "MIT Press",
        url: "https://htdp.org/",
        format: "Online",
        level: 1,
        desc:
          "Free text on disciplined program design — derive specifications, implementations, and tests from scratch.",
      },
      {
        title: "free-programming-books — curated directory",
        author: "EbookFoundation",
        url: "https://github.com/EbookFoundation/free-programming-books",
        format: "List",
        level: 2,
        desc:
          "A decade-old, award-winning curated list of free programming books across all topics.",
      },
    ],
  },
];

export function flatFreeBooks(): FreeBook[] {
  const out: FreeBook[] = [];
  for (const { books } of freeBooksByCategory) {
    out.push(...books);
  }
  return out;
}
