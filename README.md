# EventSync — Nuxt 4 + Vuetify 4 + FullCalendar Web Application

## Live Deployed URL
https://your-deployed-url.vercel.app

## Chosen Third-Party Library
- **Library:** FullCalendar (`@fullcalendar/core`, `@fullcalendar/vue3`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`)
- **Route:** `/calendar`
- **Functionality:** Interactive event scheduler allowing authenticated users to create events with custom dates/categories, select dates directly on the calendar grid, view event details, and delete events.

## Pages Included
- `/login` — Google Identity Services OAuth 2.0 Sign-In page with error/cancellation feedback.
- `/` — Route-protected Dashboard displaying the authenticated user's Google profile photo, full name, email, and account ID.
- `/calendar` — Route-protected FullCalendar event management page.

## Local Setup
1. Install dependencies: `npm install`
2. Create `.env` and set `NUXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id`
3. Start development server: `npm run dev`