<div align="center">

<img src="https://raw.githubusercontent.com/Studio1HQ/Studio1HQ/main/assets/banners/velt-trello-clone.webp" alt="Trello-Style Board with Velt: A Kanban board with live comments, presence and notifications" width="100%" />

<br />
<br />

# Trello-Style Board with Velt

### A Kanban board with live comments, presence and notifications

A Next.js Trello-style board that shows how to add comments, presence, live data sync and notifications to a task board with the Velt SDK.

<br />

[![Built by Studio1](https://img.shields.io/badge/Built_by_Studio1-f97316?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMzVDMCAxNi42ODA3IDE0LjA3NDQgMS42NDg0NCAzMiAwLjEyNjk1M1YxNDFINTEuMDUyM0M1Mi40MzA4IDEzNy4zNDQgNTQuNzQ0NiAxMzMuNjg5IDU3Ljk5MzggMTMwLjAzM0M2MS4xNDQ2IDEyNi41MDggNjQuNjg5MiAxMjMuNDQgNjguNjI3NyAxMjAuODI5QzcyLjU2NjIgMTE4LjM0OSA3Ni4zNTY5IDExNi43ODIgODAgMTE2LjEyOVY4Ni43NTQ0Qzc1LjQ3MDggODcuOTI5MiA3MS4zODQ2IDg5LjY5MTkgNjcuNzQxNSA5Mi4wNDE1QzY0IDk0LjUyMjUgNjAuNzUwOCA5Ny40NiA1Ny45OTM4IDEwMC44NTRDNTYuNTM0NSAxMDIuNzIgNTUuMjU0NSAxMDQuNjU5IDU0LjE1MzkgMTA2LjY3MVYwSDEyNUMxNDQuMzMgMCAxNjAgMTUuNjY5OSAxNjAgMzVWMTI1QzE2MCAxNDQuMzMgMTQ0LjMzIDE2MCAxMjUgMTYwSDEyNFYxOEgxMDQuOTQ4QzEwMy41NjkgMjEuNjgxNiAxMDEuMjU1IDI1LjM2MjggOTguMDA2MiAyOS4wNDQ0Qzk0Ljg1NTQgMzIuNTk0MiA5MS4zMTA4IDM1LjY4NDEgODcuMzcyMyAzOC4zMTRDODMuNDMzOCA0MC44MTIgNzkuNjQzMSA0Mi4zODk2IDc2IDQzLjA0NzRWNzIuNjMwNEM4MC41MjkyIDcxLjQ0NzMgODQuNjE1NCA2OS42NzI0IDg4LjI1ODUgNjcuMzA1N0M5MiA2NC44MDc2IDk1LjI0OTIgNjEuODQ5MSA5OC4wMDYyIDU4LjQzMDdDOTkuNDY1NSA1Ni41NTEzIDEwMC43NDUgNTQuNTk4NiAxMDEuODQ2IDUyLjU3MjNWMTYwSDM1QzE1LjY3IDE2MCAwIDE0NC4zMyAwIDEyNVYzNVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4K)](https://studio1hq.com)
[![Built with Velt](https://img.shields.io/badge/Built_with_Velt-141414?style=for-the-badge)](https://velt.dev)
[![Live demo](https://img.shields.io/badge/Live_demo-1c1917?style=for-the-badge&logo=vercel&logoColor=white)](https://velt-trello-clones.vercel.app/)

[Velt docs](https://docs.velt.dev) &nbsp;·&nbsp; [Velt](https://velt.dev) &nbsp;·&nbsp; [More examples](https://github.com/Studio1HQ) &nbsp;·&nbsp; [studio1hq.com](https://studio1hq.com)

</div>

<br />

## Overview

A Trello-style Kanban board with real-time collaboration added through [Velt](https://velt.dev). Cards can be dragged between lists, and two demo users can comment on cards, react, see each other online and get notified.

The UI was generated with v0.dev and then wired to the Velt SDK. Card positions are kept in sync across browsers with Velt live state, so a move in one window shows up in the other.

<p align="center"><img src="https://github.com/user-attachments/assets/f51ad005-649c-4f84-af74-6737cfd19e4f" alt="Trello-style board design" width="100%" /></p>
<p align="center"><img src="https://github.com/user-attachments/assets/d3d45dc9-fa4a-4e4f-bdf1-1d6401381b51" alt="Card detail view" width="100%" /></p>

<details>
<summary>More screenshots</summary>

<img src="https://github.com/user-attachments/assets/0f6b8234-7940-4361-b90f-bc05b04c522c" alt="Board screenshot" width="100%" />
<img src="https://github.com/user-attachments/assets/43f98c1e-d2df-451b-b4b2-b1443b99f201" alt="Board screenshot" width="100%" />

</details>

## Features

- **Comments**: Popover comments on the board, a comments sidebar and an inline comments section in the card detail modal.
- **Presence**: `VeltPresence` in the navbar shows who is online.
- **Live data sync**: `useLiveBoardSync` stores lists and cards in Velt live state, so adds, deletes and moves propagate between users.
- **Notifications**: `VeltNotificationsTool` in the navbar shows collaboration events.
- **Drag and drop**: Cards move between lists with dnd-kit.
- **User switcher**: Switch between two demo users (Alice Johnson and Bob Smith) to test collaboration in one browser.
- **Light and dark theme**: A theme toggle that also sets the Velt comment colours.

## Tech stack

| Layer | Tool |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 15 (App Router), React 19 |
| Collaboration | [Velt](https://velt.dev) (`@veltdev/react`) |
| Drag and drop | [dnd-kit](https://dndkit.com) |
| UI | [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Lucide](https://lucide.dev) |
| UI scaffold | [v0.dev](https://v0.dev) |
| Deployment | [Vercel](https://vercel.com) |

## Getting started

### Prerequisites

- Node.js 18 or later
- npm, pnpm or yarn
- A Velt account and API key from the [Velt console](https://console.velt.dev)

### Installation

```bash
git clone https://github.com/Studio1HQ/velt-trello-clone.git
cd velt-trello-clone
npm install
```

### Environment variables

Create `.env.local` in the project root.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_VELT_API_KEY` | Your Velt API key. Read in `components/velt-wrapper.tsx`. Without it the app renders but Velt is disabled. |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the user switcher in the navbar, or open a second browser profile, to see two users collaborate.

## How it works

- `components/velt-wrapper.tsx` wraps the app in `VeltProvider` and sets Velt CSS variables from the current theme.
- `components/velt-auth.tsx` calls `client.identify(user)` (with `forceReset` when switching users), sets the document `trello-board` and registers the demo users as contacts for mentions.
- `hooks/use-live-board-sync.ts` uses `useLiveStateData` and `useSetLiveStateData` to share board data.
- `components/board.tsx` tags cards, lists and reactions with `data-velt-target` attributes so comments can attach to them.
- `components/card-detail-modal.tsx` renders the inline comments section for a card.
- Velt components are loaded with `next/dynamic` and `ssr: false`.

The initial layout was produced from a v0.dev prompt asking for a UI-only Trello board with a user switcher, theme toggle, draggable cards, comment and reaction placeholders, and mount points for Velt.

## Resources

- [Live demo](https://velt-trello-clones.vercel.app/): Deployed version of this app.
- [Velt documentation](https://docs.velt.dev): SDK reference for comments, presence, notifications and live state.
- [Velt](https://velt.dev): Product site.

<br />

---

<div align="center">

<a href="https://studio1hq.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-dark.svg" />
    <img src="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-light.svg" alt="Studio1" width="160" />
  </picture>
</a>

Built by **[Studio1](https://studio1hq.com)**, the technical content and DevRel partner for devtool teams. Made with [Velt](https://velt.dev).<br />
Browse more open-source examples at [github.com/Studio1HQ](https://github.com/Studio1HQ).

[![Website](https://img.shields.io/badge/studio1hq.com-0b0807?style=for-the-badge&logo=googlechrome&logoColor=white)](https://studio1hq.com)
[![Book a call](https://img.shields.io/badge/Book_a_strategy_call-f97316?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://cal.com/studio1/collab)
[![X](https://img.shields.io/badge/%40Studio1HQ-141414?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Studio1HQ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/studio1hq/)

<sub><a href="https://studio1hq.com">studio1hq.com</a> · Technical content, docs, video and DevRel for devtools</sub>

</div>
