# BioART

BioART is a Romanian biology education platform built with React and Vite. It brings together biology articles, announcements, learning materials, competitions, and a photo gallery in one responsive web app.

The application uses Supabase for content and authentication, React Router for navigation, and Markdown files as the editable source for several content collections.

## Features

- Home page with recent articles and announcements
- Article listing and individual Markdown-rendered article pages
- Announcements, competitions, learning materials, and gallery sections
- Supabase-backed data fetching with TanStack Query
- Optional account and login flows
- Light and dark themes
- Vercel-ready single-page application routing

## Tech stack

- React 19 and TypeScript
- Vite
- React Router
- Tailwind CSS and Radix UI components
- Supabase (`@supabase/supabase-js`)
- TanStack Query
- React Markdown with GitHub Flavored Markdown support

## Getting started

### Requirements

- Node.js 20 or newer
- A Supabase project for live data and authentication

### Install and run

```bash
npm install
npm run dev
```

The development server runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` file in the project root with the public Supabase values for your project:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

These variables are exposed to the browser by Vite, so use only Supabase’s publishable key. Never put a service-role key in `.env` or frontend code.

## Project structure

```text
src/
	pages/       Route-level page components
	components/  Shared application components
	context/     Authentication context
	types.ts     Shared TypeScript types
components/    Reusable UI and feature components
lib/           Shared utilities and types
supabase/      Supabase migrations and configuration
```

Main routes are `/`, `/articles`, `/articles/:slug`, `/announcements`, `/learning`, `/competitions`, `/gallery`, and `/login-page`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Production deployment

The project is configured for Vercel:

```bash
npm run build
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Vercel project environment variables. The included `vercel.json` publishes `dist` and rewrites application routes to `index.html` so React Router works on direct navigation.
