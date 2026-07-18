# Plan: UI/UX Overhaul & API Integration

**Objective:**
Transform the IronPulse web app into a polished, mobile-first experience with a fluid, modern UI inspired by Apple Fitness. Simultaneously, build a dedicated API to manage the exercise database, making the application more scalable and maintainable.

---

### **Phase 1: UI Foundation & Component Library**

*Goal: Establish a strong design system and component library to build a premium user interface.*

1.  **Design System & Inspiration:**
    *   **Inspiration Deep Dive:** Analyze the UI/UX of Apple Fitness, focusing on animations, layout, typography, and the use of dark mode. Key elements to note are card-based layouts, smooth transitions, and clear visual hierarchy.
    *   **Color Palette & Typography:** Define a new, modern color palette (with light and dark mode variants) and select a clean, readable font (like Inter, which is similar to Apple's San Francisco font).
2.  **Shadcn/UI Integration (Manual):**
    *   Instead of using the interactive initializer, manually install the required components from `shadcn/ui` one by one. This is a more reliable approach.
    *   Install core components like `Button`, `Card`, `Dialog`, `Input`, and `Avatar`. These will provide the building blocks for the new UI.
    *   Configure `tailwind.config.js` to match the new design system (colors, fonts).
3.  **Layout Overhaul:**
    *   Redesign the main `layout.tsx` to be a mobile-first container.
    *   Create a dedicated `components/layout` directory for components like a new `Header` and a `BottomNavBar` for mobile navigation (e.g., Home, Workout, History).

---

### **Phase 2: API Development for Exercises**

*Goal: Create a robust backend service to manage the exercise data, separating it from the frontend.*

1.  **API Framework Choice:**
    *   Since the project is already using Next.js, the most integrated solution is to use **Next.js API Routes**. This keeps the frontend and backend in a single monorepo.
2.  **API Route Creation:**
    *   Create a new API route at `src/app/api/exercises/route.ts`.
    *   This route will handle `GET` requests to fetch exercises.
3.  **Data Source:**
    *   The API will read from a JSON file in the project (`/data/exercises.json`). This decouples the data from the frontend code and mimics a database. In the future, this can be swapped out for a real database without changing the frontend.
    *   The seed data from `scripts/seed-exercises.ts` will be moved into this new JSON file.
4.  **API Endpoint Implementation:**
    *   `/api/exercises`: Returns a list of all exercises.
    *   `/api/exercises/[id]`: Returns a single exercise by ID.
    *   Implement filtering by muscle group: `/api/exercises?muscleGroup=Chest`.

---

### **Phase 3: UI Redesign & Integration**

*Goal: Apply the new design system and API data to the existing pages for a complete visual and functional transformation.*

1.  **Home Page Redesign (`/`):**
    *   Transform the simple welcome page into a dashboard.
    *   Use `Card` components to display key info: "Today's Workout," "Recent Activity," "Progress Stats."
2.  **Workout Pages Redesign (`/workout` and `/workout/[id]`):**
    *   **Workout List (`/workout`):** Redesign to use a clean, scrollable list of exercises using the new `Card` components.
    *   **Live Workout (`/workout/[id]`):**
        *   **Fluid UI:** Implement a full-screen, focused UI for the active exercise.
        *   **Video Background:** The exercise video could play in the background (muted, looped) with text overlays.
        *   **Animations:** Use a library like `Framer Motion` to create smooth transitions between exercises.
        *   **Logging UI:** Redesign the rep/weight inputs to be large, touch-friendly buttons or steppers.
3.  **History Page Redesign (`/history`):**
    *   Redesign the history list to be more visual.
    *   Each entry could be a `Card` showing the date, number of exercises, and total volume.
    *   Clicking an entry could open a `Dialog` with a detailed breakdown.
4.  **Data Integration:**
    *   Update all pages that currently use dummy data (`workout-generator.ts`, mock history) to fetch data from the newly created Next.js API endpoints using `fetch`.
