# Stream Atlas — Free Edition

100 Java Streams API interview questions with hints, official solutions, and a built-in editor where you can draft your solution and **copy it to your IDE** to actually run.

Fully static. No backend. No API keys. No costs. Deploys free anywhere.

---

## Local development

You need **Node.js 18.18+**.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

---

## Deploy free — pick any host

This builds as a fully static site (HTML + JS + CSS only). Every option below has a free tier that easily handles this.

### Option 1 — Vercel (easiest, recommended)

1. Push the folder to GitHub:
   ```bash
   git init && git add . && git commit -m "Initial"
   git remote add origin https://github.com/YOUR_USER/stream-atlas.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new, import the repo, click **Deploy**. Done.

No environment variables. No payment info needed.

### Option 2 — Netlify

1. Push to GitHub (same as above).
2. Go to https://app.netlify.com, click **Add new site → Import from Git**, pick the repo.
3. Build command: `npm run build`. Publish directory: `out`. Click **Deploy**.

### Option 3 — Cloudflare Pages

1. Push to GitHub.
2. Go to https://dash.cloudflare.com → **Pages → Create a project → Connect to Git**.
3. Build command: `npm run build`. Output directory: `out`.

### Option 4 — GitHub Pages

```bash
npm run build
# That produces an "out/" folder. Push it to the gh-pages branch:
npx gh-pages -d out
```

Then enable Pages in your repo settings, source = `gh-pages` branch.

### Option 5 — Just open the file

After `npm run build`, the `out/` folder contains a fully static site. You can drag it into any S3 bucket, FTP it to a shared host, or even open `out/index.html` directly in a browser for fully offline use.

---

## How the "Copy" button works

Each question has an editor with a starter `Main.java` template — imports already wired up, sample data pre-filled (for `Employee`/`Transaction`/`Sale` questions), and a placeholder for your stream code.

When you hit **Copy**, the entire file is copied to your clipboard. Paste it into:

- **IntelliJ / VS Code / Eclipse** — paste into a `Main.java` file and run.
- **JShell** (comes with the JDK) — `jshell` in your terminal, then paste. Great for quick experiments.
- **Online runners** — paste into [OneCompiler](https://onecompiler.com/java), [JDoodle](https://www.jdoodle.com/online-java-compiler/), [replit](https://replit.com), etc.

For the **fastest iteration**, install the JDK locally and run from the terminal:
```bash
java Main.java   # Java 11+ runs single-file source directly
```

---

## What you get

- **100 questions** spanning Easy / Medium / Hard, across 7 categories: Filter, Map, Sort, Reduce, Collect, GroupBy, FlatMap.
- **Reveal-on-demand** hints and solutions — try first, peek when stuck.
- **Persistent progress** via `localStorage` — completed, bookmarked, and current spot all saved across sessions.
- **Filtering** — by difficulty, category, search, "bookmarked only", "incomplete only".
- **Built-in editor** that pre-fills realistic starter code (with `Employee`/`Transaction`/`Sale` classes for object-based questions).
- **Each solution comes with a "Why this works" explanation** — the part that helps in interviews when they ask follow-up questions.

## Project structure

```
stream-atlas/
├── app/
│   ├── layout.jsx           ← root HTML layout
│   └── page.jsx             ← the full app (questions + editor + UI)
├── package.json
├── next.config.mjs          ← configures static export
├── jsconfig.json
├── .gitignore
└── README.md
```

## Customizing

- **Add/edit questions:** the `Q` array near the top of `app/page.jsx` is the source of truth. Each entry has `id`, `title`, `category`, `difficulty`, `problem`, `input`, `output`, `hint`, `solution`, `explanation`.
- **Change theme colors:** look for the CSS variables block in `page.jsx` (search for `--accent`).
- **Tweak starter templates:** see the `buildStarter` function and the `EMPLOYEE_DATA` / `TRANSACTION_DATA` / `SALE_DATA` constants for how starter code is generated.

## License

Use freely for personal interview prep.
