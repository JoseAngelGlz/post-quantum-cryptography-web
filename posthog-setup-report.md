<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The Quanta post-quantum cryptography learning platform already had a solid PostHog foundation using `posthog-js` with event tracking for quiz flows, route progress, feedback, and simulator usage. This integration extended that foundation with five new events across five components, set up environment variables in `.env`, and created a PostHog dashboard with five insights.

## New event tracking added

| Event name | Description | File |
|---|---|---|
| `Recurso Abierto` | Fired when a user clicks an external resource card (with ID, type, and URL properties) | `src/components/shared/PQCResources.tsx` |
| `Noticia Abierta` | Fired when a user clicks a news card with an external link (with news ID, variant, and URL) | `src/components/shared/PQCNews.tsx` |
| `Idioma Cambiado` | Fired when the UI language is switched (ES/EN), also registers as a global person property | `src/components/shared/TopNav.tsx` |
| `Consentimiento de Cookies` | Fired when the user accepts or rejects analytics cookies from the banner | `src/components/shared/CookieBanner.tsx` |
| `Reacción al Cuestionario` | Fired when a user rates their quiz experience on the emoji scale after completing a quiz | `src/components/shared/QuickQuiz.tsx` |

## Environment variables

Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `.env` (already referenced correctly via `import.meta.env` in `src/main.tsx`).

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/701844)
- [Content Engagement Funnel](/insights/hzWOz6Cp) — tracks the drop-off from page views → route started → route completed
- [Quiz Completion Funnel](/insights/b9LPH49Q) — measures quiz started → quiz completed conversion rate
- [Resource & News Clicks](/insights/7wqTfbgw) — daily trend of external resource and news article opens
- [Cookie Consent Decisions](/insights/kad3Oa6Q) — bar chart of accept vs reject consent decisions over time
- [Simulator & Feedback Activity](/insights/70wncEO5) — daily trend of simulator usage and feedback submissions

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
