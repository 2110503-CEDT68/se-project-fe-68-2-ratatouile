[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/fpUm_Avi)

# Frontend Setup

This project uses React through Next.js with the App Router.

Current frontend structure:

- `src/app` for routes and layouts
- `src/components` for reusable UI components
- `src/libs` for client-side helper functions
- `src/provider` for shared providers

Routing is handled by the Next.js App Router in `src/app`, so there is no separate `react-router-dom` setup in this repository.

Local-only planning notes and local git account profile files are ignored in `.gitignore`.

Formatting is handled with Prettier:

- `npm run format`
- `npm run format:check`

Tailwind CSS is configured globally:

- `tailwindcss` and `@tailwindcss/postcss` are installed
- Tailwind is loaded in `src/app/globals.css`
- shared color and typography tokens are defined in `src/app/globals.css`

The design direction currently uses shared brand tokens for:

- canvas and surface colors
- primary and secondary text colors
- shared contrast/action colors

# Docker Local Run

Build the frontend image for a local backend running on port `5050`:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:5050 \
  --build-arg INTERNAL_API_BASE_URL=http://host.docker.internal:5050 \
  --build-arg NEXTAUTH_URL=http://localhost:3000 \
  -t ratatouille-fe .
```

Run the frontend container:

```bash
docker run --rm \
  -p 3000:3000 \
  -e NEXTAUTH_SECRET=replace_with_a_stable_secret \
  --name ratatouille-fe \
  ratatouille-fe
```

The app should then be available at `http://localhost:3000`.
