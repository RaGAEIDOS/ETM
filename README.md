# ETM — Education Technology Miku

A free Arabic platform for learning **C++** from absolute zero to building an
operating system and a game engine. The curriculum is based on the
[OSSU](https://github.com/ossu/computer-science) degree, rewritten in Arabic
with interactive examples, real projects, and **Miku** — your study buddy.

## ✨ Features

- **4 difficulty levels**: Very Easy → Medium → Hard → Extreme
- **17 courses, 100+ interactive lessons** with clear explanations
- **Real C++ playground** in the browser (compile & run, no installs)
- **Glossary** of 100+ English/Arabic terms
- **Real projects**: calculator, Snake game with a custom engine, OS kernel in QEMU
- **Progress tracking** saved on your device
- **Miku**, an interactive guide that explains every part of the platform
- **Dashboard** with lessons, ElZero videos, focus time, streaks and what's left
- **Pomodoro focus timer** with lofi study music and Miku reminders
- **ElZero videos**: 78 videos, each with a summary, quiz and key terminology
- **GitHub sign-in** — your real profile picture and identity

## 🛠 Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js 14](https://nextjs.org/) | Main framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Language |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Lesson content |
| [react-simple-code-editor](https://github.com/satya164/react-simple-code-editor) + [Prism](https://prismjs.com/) | Playground editor |
| [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | Code highlighting in lessons |
| [Lucide](https://lucide.dev/) | Icons |
| [Wandbox API](https://wandbox.org/) | C++ compilation in the browser |

## 🚀 Getting Started

### Requirements

- [Node.js](https://nodejs.org/) 18.17 or newer (20+ recommended)

### Run locally

```bash
git clone https://github.com/RaGAEIDOS/ETM.git
cd ETM
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on localhost:3000 |
| `npm run build` | Build the production bundle |
| `npm run start` | Run the production build |

## 🔑 GitHub Sign In

The platform signs you in with your GitHub account. For this to work in
production, the deployment needs to reach `https://api.github.com`.

- In development and on Vercel, the server verifies the token directly.
- If the server cannot reach GitHub, the site automatically falls back to
  verifying the token from your browser.

Optionally set a session secret:

```
AUTH_SECRET=your-random-secret
```

See [.env.example](.env.example).

## 📁 Project Structure

```
ETM/
├── app/                    # Next.js pages (App Router)
│   ├── page.tsx            # Landing page
│   ├── curriculum/         # Full curriculum
│   ├── learn/              # Dynamic lesson pages
│   ├── playground/         # C++ playground
│   ├── dashboard/          # Progress dashboard
│   ├── guide/              # Miku's tutorials
│   ├── elzero/             # ElZero video pages
│   ├── glossary/           # Glossary
│   ├── projects/           # Projects
│   ├── progress/           # Detailed progress
│   ├── login/              # GitHub sign in
│   └── api/auth/           # Auth routes (GitHub, session, logout)
├── components/             # Reusable React components
│   ├── Miku.tsx            # Miku assistant + onboarding
│   ├── MikuAvatar.tsx      # Miku SVG mascot
│   ├── Pomodoro.tsx        # Focus timer + lofi music
│   └── DashboardClient.tsx # Dashboard
├── lib/
│   ├── content/            # Lesson content (one file per course)
│   ├── data.ts             # Curriculum aggregation
│   ├── stages.ts           # Stage and course metadata
│   ├── elzero-videos.ts    # 78 ElZero videos: summary, quiz, terms
│   ├── auth.tsx            # Client auth context
│   ├── session.ts          # Server session signing
│   ├── progress.ts         # Progress storage (localStorage)
│   ├── stats.ts            # Streaks, focus time, next lessons
│   ├── miku.ts             # Miku persona and messages
│   └── types.ts            # TypeScript types
├── public/                 # Static files
└── vercel.json             # Vercel deployment config
```

## 🌍 Deploy on Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
3. Click **Add New Project**, select the ETM repository and press **Import**.
4. Press **Deploy** — Vercel detects Next.js and `vercel.json` automatically.

## 📚 Curriculum Structure

| Level | Name | Courses | Goal |
| --- | --- | --- | --- |
| 1 | Very Easy | 4 | C++ basics, computational thinking, tools, ElZero track |
| 2 | Medium | 4 | OOP, pointers, data structures, recursion |
| 3 | Hard | 5 | Algorithms, math, architecture, OS, networking |
| 4 | Extreme | 5 | Compilers, game engines, OS development, distributed systems, security |

## 🤝 Contributing

The project is open source and contributions are welcome: content
improvements, new terminology, bug fixes, and performance enhancements.

## 📄 License

Licensed under the [MIT](LICENSE) license. The curriculum content is
originally written in Arabic, inspired by open sources (OSSU, CS50, MIT OCW)
with respect for their authors' rights.

---

Made with ❤️ for the Arabic community — free knowledge for everyone.
