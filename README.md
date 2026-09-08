<div align="center">

# UniSched

A browser-based academic timetable planning demo with role-aware views, deterministic conflict checks, schedule analytics, and CSV export.

</div>

## Overview

UniSched is a React and TypeScript interface for exploring and managing university timetables. It provides separate administrator and student experiences, generated sample schedules for five academic years and three sections, rule-based schedule validation, and browser-based persistence.

The currently committed application is a client-side prototype. Sessions, registered users, login state, and theme preferences are stored in the browser with `localStorage`. An Express and MySQL scaffold is included under `server/`, but it is not connected to the frontend or included in the project's npm scripts.

## Features

### Timetable management

- Browse schedules by academic year and section
- View weekday timetables from Monday through Friday
- Create, edit, inspect, and delete class sessions from the administrator view
- Switch between standard and compact timetable layouts
- Persist schedule changes locally in the browser

### Scheduling rules

The active validation layer checks for:

- Classes outside the configured academic day
- Sessions overlapping the 12:00-13:00 lunch break
- Professors assigned to overlapping sessions
- Rooms assigned to overlapping sessions
- Overlapping classes for the same year and section
- Wednesday-afternoon sessions, which are reported as warnings

The session form also includes a deterministic auto-placement helper that evaluates candidate slots in 30-minute increments. It does not use AI or an external scheduling service.

### Role-aware experience

- Administrator and student entry points
- Administrator schedule-management and analytics views
- Read-only student timetable view
- Local student registration
- Administrator preview of the student experience

### Reporting and presentation

- Schedule-health summaries with errors and warnings
- Teaching-volume, faculty-workload, and room-utilization analytics
- CSV export for a selected timetable or the full schedule
- Light and dark themes with saved preferences
- Responsive navigation and mobile sidebar behavior

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 19 |
| Language | TypeScript |
| Build tooling | Vite 6 |
| Icons | Lucide React |
| Styling | Tailwind CSS browser CDN, custom CSS, and a checked-in Tailwind configuration |
| Client persistence | Browser `localStorage` |
| Optional backend scaffold | Express and MySQL |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/johnsawmin2015-tech/UniShed.git
cd UniShed
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo access

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@unisched.edu` | `admin123` |
| Student | `student@uni.edu` | Any non-empty value |

These credentials are for demonstration only. Authentication is implemented entirely in the browser, and password values are not securely verified or persisted.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Create a production bundle in `dist/` |
| `npm run preview` | Serve the production bundle locally for review |

The repository does not currently define automated test, lint, type-check, or backend-start scripts.

## Configuration

No environment variable is required by the active frontend.

`vite.config.ts` currently reads `GEMINI_API_KEY` and exposes it through browser build definitions, but no committed application code consumes that value or calls Gemini. Do not place a production secret in this client-side configuration.

The main browser storage keys are:

| Key | Purpose |
| --- | --- |
| `unisched_sessions` | Active timetable data |
| `currentUser` | Current demo login |
| `users` | Locally registered users |
| `unisched-theme-preference` | Saved light or dark theme |

Because these values are local to one browser profile, the application does not provide shared or multi-user synchronization.

## Optional Backend Scaffold

The `server/` directory contains an initial MySQL persistence design:

- `schema.sql` creates the `unisched_db` database and `class_sessions` table.
- `server.js` sketches CRUD endpoints at `/api/sessions`.
- The proposed server listens on port 3001.

This backend is not runnable or integrated as committed:

- Express, MySQL, CORS, and body-parser are not declared in `package.json`.
- There is no npm script for starting the server.
- `server.js` uses CommonJS `require` calls while the package is configured as an ES module.
- Database values are hard-coded placeholders.
- The frontend data service continues to read and write `localStorage`.

Treat this directory as a starting point for future backend integration, not as part of the current working application.

## Project Structure

```text
.
├── index.html                 # Browser entry document
├── metadata.json             # Application metadata
├── package.json              # Frontend dependencies and scripts
├── server/
│   ├── schema.sql            # Proposed MySQL schema
│   └── server.js             # Unintegrated REST API scaffold
├── src/
│   ├── App.tsx               # Active application shell and dashboard flow
│   ├── application/          # Authentication and timetable use cases
│   ├── context/              # Authentication and theme providers
│   ├── design/               # Design tokens
│   ├── domain/               # Types, scheduling rules, and validation
│   ├── infrastructure/       # Browser storage adapter
│   ├── services/             # Active local data service and sample data
│   ├── ui/                   # Pages and reusable UI components
│   └── utils/                # CSV, time, and theme helpers
├── tailwind.config.js        # Custom color and animation definitions
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite development and build configuration
```

## Current Status and Limitations

UniSched should currently be treated as a frontend demonstration rather than a production university system.

- Authentication and authorization are client-side only.
- Passwords are not securely stored or verified.
- Schedule data is isolated to one browser profile.
- The dashboard's connection indicator reflects the local simulated data service, not a MySQL connection.
- The server scaffold is not wired into the application.
- The auto-scheduler is deterministic rule evaluation, not an AI service.
- Tailwind is loaded from a browser CDN; the checked-in Tailwind configuration is not part of an installed npm build pipeline.
- Automated tests, linting, continuous integration, and a dedicated type-check command have not been configured.

## Contributing

Contributions are welcome through issues and pull requests. Before submitting a change:

1. Install dependencies with `npm ci`.
2. Run `npm run build`.
3. Exercise both administrator and student flows.
4. Verify schedule creation, editing, deletion, validation, CSV export, theme switching, and responsive layouts.
5. Document any new setup or configuration requirements.

## License

No license has been added to this repository. Reuse and distribution terms have therefore not been specified.
