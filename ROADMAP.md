# Office AI Assistant – Development Roadmap

Below is a comprehensive checklist of work items required to evolve the current prototype into a production-ready Word add-in. Tasks are grouped by theme but intentionally numbered 1-60 to help plan sprints.

## Manifest & Office integration
1. Replace placeholder GUID in `manifest.xml` with permanent UUID registered in Azure portal.  
2. Add `Excel` and `PowerPoint` hosts for cross-app compatibility.  
3. Define `OfficeRuntime` element for performance & dark mode icon variants.  
4. Insert `WebApplicationInfo` section for SSO with Azure AD app.  
5. Localise `<DisplayName>` and `<Description>` using `<DefaultLocale>` resources.  
6. Register ribbon command buttons and icons (32/80/128px) in manifest.  
7. Implement command handlers (`Office.actions.associate`) for ribbon buttons.

## Build & Dev tooling
8. Configure `vite.config.ts` to output production build to `/dist` with SRI hashes.  
9. Add HTTPS dev-cert via `office-addin-dev-certs` and integrate with Vite.  
10. Convert plain JS scripts to TypeScript; enable `strict` compiler options.  
11. Add ESLint + Prettier + Stylelint with Husky pre-commit hook.  
12. Migrate legacy Vite polyfill scripts to modern build; drop legacy chunk inlines.  
13. Introduce path aliases (`@/components`) and absolute imports.  
14. Implement environment variable support (`import.meta.env`) for staging vs prod endpoints.

## UI / React
15. Wrap React app in Fluent UI Provider for native Office look.  
16. Convert Settings and Benchmark pages into React routes/components.  
17. Add left-rail navigation inside taskpane (Assistant, Benchmark, Settings).  
18. Implement global theme toggle (light/dark/system).  
19. Add in-app notifications/toasts using Fluent UI `Toast` provider.  
20. Ensure keyboard navigation & focus states for all controls (WCAG 2.1 AA).

## Word-specific features
21. Implement “Analyze Selection” command that reads current range, sends to API.  
22. Implement “Insert Suggestion” that writes generated text back to Word at cursor.  
23. Provide progress spinner overlay during long-running API calls.  
24. Cache document metadata (word count, jurisdiction) for Settings page.  
25. Add error banner if Office API version < required.

## AI Document Analysis Assistant
26. Build chat-like UI inside taskpane for conversational interactions with the document.  
27. Implement “Ask Questions” flow that extracts relevant excerpts and summarises answers.  
28. Implement “Suggest Improvements” flow parameterised by negotiation stance (e.g., service-provider vs customer).  
29. Show inline diff highlighting for each AI suggestion with **Apply** / **Dismiss** actions.  
30. Implement “Draft New Clause” command that inserts AI-generated clause at cursor.  
31. Implement “Revise & Refine” on selected text (e.g., “Make concise”, “Change tone”).  
32. Build “General Review” feature that analyses entire document and produces issue list.  
33. Persist AI interactions in sidebar history per-document.  
34. Add telemetry events for each assistant action (ask, suggest, apply, draft, review).  
35. Add unit and E2E tests covering every assistant workflow.

## Backend connectivity
36. Finish `api-client.js` with token refresh & error handling.
37. Add batching + retry with exponential backoff for `gql` calls.  
38. Integrate Frigade onboarding flows; display first-run tours.  
39. Hook Insights endpoint for page-view & feature-usage telemetry.  
40. Store user auth/session in `localStorage` with expiry.

## Offline & assets
41. Self-host Google Fonts (`woff2` in `assets/fonts/`); update `font.css`.  
42. Add service-worker (Workbox) to cache static assets & enable offline load.  
43. Bundle Office.js locally and reference via relative path for offline dev.  
44. Optimise images with `squoosh` CLI; convert icons to SVG where possible.  
45. Implement lazy-loading for heavy components (React.lazy + Suspense).

## Security & compliance
46. Tighten Content-Security-Policy (`script-src 'self' 'wasm-unsafe-eval'`).  
47. Add Subresource Integrity hashes to any remaining CDN links.  
48. Run `npm audit` in CI and fail build on critical vulnerabilities.  
49. Integrate Dependabot for automated dependency PRs.  
50. Enable OAuth consent-screen verification for production SSO.

## Testing
51. Setup Vitest for unit tests of util functions and React components.  
52. Configure Playwright to automate Word on the web for E2E flows.  
53. Write regression test for “Insert Suggestion” end-to-end.  
54. Add Axe accessibility tests in Playwright.  
55. Add visual regression snapshots with Storybook + Chromatic.

## Continuous Integration / Delivery
56. GitHub Actions: lint, test, build artefact matrix (mac/windows).  
57. Action step to sign the add-in package with self-signed cert.  
58. Publish build artefacts to GitHub Releases on version tag.  
59. Optional workflow to deploy web assets to Netlify staging.  
60. Create release-drafter.yml for automatic changelog.

## Documentation & support
61. Expand `README.md` with setup, build, sideload, and test instructions.  
62. Add `CONTRIBUTING.md` with coding guidelines & branch strategy.  
63. Generate API reference docs from TypeScript using TypeDoc.  
64. Produce user-facing help page accessible from Settings → Help.  
65. Record GIF demo and embed in repo.

## Internationalisation
66. Setup `i18next` with JSON translation files; extract UI strings.  
67. Provide sample French (`fr-FR`) translation and locale switcher.  
68. Ensure date/number formatting uses `Intl` based on Office locale.

## Deployment & AppSource
69. Prepare AppSource submission: screenshots, marketing description, privacy policy URLs.  
70. Run `OfficeValidator` and resolve all validation issues before submission.
