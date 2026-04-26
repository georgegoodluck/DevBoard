```markdown
# DevBoard - Developer Dashboard

A modern, responsive developer dashboard built with Next.js 15, Tailwind CSS, and TypeScript.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (Icons)

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd devboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   └── CardHeader.tsx
│   └── dashboard/
│       ├── ActiveProjects.tsx
│       ├── RecentTasks.tsx
│       ├── SprintVelocity.tsx
│       ├── TeamPanel.tsx
│       ├── Deadlines.tsx
│       └── StatsCards.tsx
└── styles/
    └── globals.css
```

## Features

- 📊 Sprint velocity chart with gradient bars
- ✅ Active projects table with progress tracking
- 👥 Team member panel with status indicators
- ⏰ Deadline tracker with urgency levels
- 📱 Fully responsive layout
- 🎨 Dark theme with CSS variables

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## CSS Variables

Customize colors in `globals.css`:

```css
--bg: #0d0d10
--accent: #8b5cf6
--green: #2dd4a0
--amber: #f59e0b
--danger: #b30707
