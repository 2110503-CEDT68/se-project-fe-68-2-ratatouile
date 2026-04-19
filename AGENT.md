# AGENT.md — Ratata Frontend
# ═══════════════════════════════════════════════════════

## ⛔ STOP — READ THIS FIRST

This is a **Next.js 15 + React 19 + TypeScript + MUI + Tailwind CSS** frontend.
Connects to backend at: `NEXT_PUBLIC_API_BASE_URL`

**Stack (DO NOT DEVIATE):**
| Layer        | Technology                           |
|--------------|--------------------------------------|
| Framework    | Next.js 15 (App Router)              |
| Logic        | React 19 + hooks                     |
| Styling      | MUI + Tailwind CSS                   |
| Language     | TypeScript                           |
| Auth         | NextAuth.js                          |

---

## 📁 PROJECT STRUCTURE

```
├── src/
│   ├── app/                  # App Router pages and layouts
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and API clients
│   ├── providers/            # Context providers (Auth, MUI)
│   └── types/                # TypeScript interfaces
```

---

## 🔄 WORKFLOW COMMANDS

| Command        | What it does |
|----------------|-------------|
| `/polish`      | Refine UI visuals and responsiveness |
| `/test-all`    | Run tests |
| `/ship`        | Review → Test → Push |

---

# END OF AGENT.md
