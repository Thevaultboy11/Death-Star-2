# Live Question Deck (Mobile First + Real-Time)

A public, no-auth app for:
- Editing 20 ordered questions on mobile.
- Presenting live rotating slides:
  - MCQ slides: 3 questions per slide, 2 minutes.
  - Programming slides: 1 question per slide, 5 minutes.
- Participant screen that updates instantly and supports submit-per-question + submit-all-on-slide.

## Stack
- React + Vite
- Firebase Firestore realtime listeners
- Dark mode mobile-first UI

## Run
1. `npm install`
2. Copy `.env.example` to `.env` and fill Firebase values.
3. `npm run dev`

## Routes
- `/admin` question editor (20 boxes)
- `/presentation` slideshow controller
- `/play` live participant view

## Firestore suggestion
Enable collections:
- `questions`
- `session`
- `responses`

For public/no-auth prototype, allow open reads/writes in rules (only for trusted testing environments).
