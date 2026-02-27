# Vinh CV — Personal Portfolio

Live-editable personal portfolio website for Từ Phương Vinh.

**Live:** [vinhphuong.id.vn](https://vinhphuong.id.vn/)

## Features

- Single-page scroll-snap layout with smooth navigation
- Dark / Light mode with OS preference detection
- Inline editing via admin panel (Google Auth)
- Drag-and-drop reordering of sections in edit mode
- Scroll-triggered fade-in animations
- Interactive canvas mouse trail effect on Hero
- Dot navigation with scroll indicator
- Responsive design (mobile / tablet / desktop)
- SEO optimized (meta tags, JSON-LD, sitemap)

## Tech Stack

- **Frontend:** React 19, TypeScript 5.9, Tailwind CSS v4
- **Build:** Vite 7
- **Backend:** Firebase (Auth, Firestore, Hosting)
- **DnD:** @dnd-kit

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
npx firebase deploy --only hosting
```

## Project Structure

```text
src/
  App.tsx                # App shell, state management
  firebase.ts            # Firebase config
  data/resume.ts         # Data model + defaults
  context/               # React context (ResumeContext)
  hooks/                 # Custom hooks (auth, resume, dark mode, scroll animation)
  components/            # UI components (Hero, Experience, Projects, Skills, Education, Contact, etc.)
public/
  favicon.svg            # Custom SVG favicon
  sitemap.xml            # Sitemap for SEO
  robots.txt             # Robots config
```
