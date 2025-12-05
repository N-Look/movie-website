# Personal Movie Website

A modern movie and TV discovery web app built with React and Vite. Browse movies, TV shows, anime, and get AI-powered recommendations, with authentication and saved data backed by Supabase.

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Icons & UI:** Lucide React
- **State Management:** Zustand
- **Backend / DB / Auth:** Supabase
- **HTTP Client:** Axios
- **Notifications:** react-hot-toast
- **Routing:** React Router
- **Carousel & sliders:** Swiper

## Features

- **Homepage with hero and carousels** for popular, top rated, upcoming, and trending titles
- **Category pages** for movies, TV shows, and anime
- **Detail / watch pages** for individual titles
- **User authentication** (sign up / sign in) with Supabase
- **AI recommendations** powered by an AI model integration
- **Responsive layout** designed for mobile, tablet, and desktop
- **Infinite scrolling** and smooth navigation

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)
- A Supabase project (for auth and database)

### Installation

```bash
git clone https://github.com/N-look/movie-website.git
cd movie-website
npm install
```

### Environment Variables

Create a `.env` or `.env.local` file in the project root and add your keys (see `SUPABASE_SETUP.md` for details):

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: AI model API keys if required
VITE_GENAI_API_KEY=your_genai_key
```

### Development

```bash
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

Deploy the contents of the `dist` folder to your hosting provider (e.g. Netlify, Vercel, Cloudflare Pages, etc.).

## Project Structure

```text
movie-website/
  public/           # Static assets (backgrounds, images, etc.)
  src/
    assets/         # Images and logos
    components/     # Reusable UI components (Navbar, Hero, grids, etc.)
    pages/          # Route pages (Home, Movies, TV, Anime, Auth, Watch, AI recs)
    lib/            # Supabase client and AI model helpers
    store/          # Zustand stores (e.g. authStore)
    main.jsx        # App entry
    App.jsx         # Root component & routing
```

## Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint

## License

This project is for personal / portfolio use. Adapt or extend the license section as needed.
