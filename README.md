1. **Clone Repository:**
```bash
   git clone <your-repo-url>
   cd devboard
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Launch the development environment:**
   ```bash
   npm run dev
   ```
4. **View the dashboard:** Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🎨 Customization

You can globalize your brand colors by modifying the CSS variables in `styles/globals.css`:

| Variable | Default Hex | Description |
| :--- | :--- | :--- |
| `--bg` | `#0d0d10` | Main application background |
| `--accent` | `#8b5cf6` | Primary action & highlight color |
| `--green` | `#2dd4a0` | Success & completion states |
| `--amber` | `#f59e0b` | Warnings & medium priority |
| `--danger` | `#b30707` | Errors & urgent deadlines |

---

## 📜 Available Scripts

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Compiles the application for production.
*   `npm run start`: Runs the
```markdown
# 🚀 DevBoard
### The Ultimate Modern Developer Dashboard

A high-performance, responsive analytics suite built with **Next.js 15**, **Tailwind CSS**, and **TypeScript**. DevBoard provides at-a-glance insights into your engineering workflow, from sprint velocity to team availability.

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
.
├── app/                  # Next.js App Router (Routes & Layouts)
│   ├── dashboard/
│   │   └── page.tsx      # Main Dashboard View
│   ├── layout.tsx        # Global Layout
│   └── page.tsx          # Landing/Root Page
├── components/           # Reusable UI Components
│   ├── dashboard/        # Feature-specific components
│   │   ├── ActiveProjects.tsx
│   │   ├── Deadlines.tsx
│   │   ├── RecentTasks.tsx
│   │   ├── SprintVelocity.tsx
│   │   ├── StatsCards.tsx
│   │   └── TeamPanel.tsx
│   └── ui/               # Base UI primitives
│       └── CardHeader.tsx
├── styles/               # Global Styles & Tailwind Config
│   └── globals.css
├── public/               # Static Assets
├── next.config.ts        # Next.js Configuration
└── tailwind.config.ts    # Tailwind Configuration
```

---

## ✨ Features

*   **📊 Sprint Analytics:** Visualize velocity with custom-gradient bar charts.
*   **✅ Project Tracking:** Monitor active projects with real-time progress indicators.
*   **👥 Team Insights:** Integrated team panel featuring live status and availability.
*   **⏰ Deadline Management:** Smart tracker with urgency-based color coding.
*   **📱 Universal Design:** Fully responsive layout optimized for all device sizes.
*   **🎨 Advanced Theming:** Native dark-mode architecture using CSS variables.

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js:** 18.17.0 or later
*   **Package Manager:** npm, yarn, or pnpm

### Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd devboard
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Launch the development environment:**
   ```bash
   npm run dev
   ```
4. **View the dashboard:** Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🎨 Customization

You can globalize your brand colors by modifying the CSS variables in `styles/globals.css`:

| Variable | Default Hex | Description |
| :--- | :--- | :--- |
| `--bg` | `#0d0d10` | Main application background |
| `--accent` | `#8b5cf6` | Primary action & highlight color |
| `--green` | `#2dd4a0` | Success & completion states |
| `--amber` | `#f59e0b` | Warnings & medium priority |
| `--danger` | `#b30707` | Errors & urgent deadlines |

---

## 📜 Available Scripts

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Compiles the application for production.
*   `npm run start`: Runs the compiled production build.
*   `npm run lint`: Performs a static analysis check on your code.
```
