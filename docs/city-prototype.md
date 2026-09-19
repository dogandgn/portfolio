# City prototype

Branch: `da/3d-sehir-portfolyo`. Production remains unchanged.

The existing portfolio is the default entry. A desktop-only building mascot opens the city with a short transition. The desktop gate requires a viewport of at least 1024px, hover support and a fine pointer. Mobile visitors keep the existing site, including when opening `?view=city` directly.

## Scope

- Four main districts with soft green parks, a nested five-project district and ten camera stops.
- Fixed camera azimuth, a gradual descent to the project street and a pullback to the exact opening view at contact.
- Monotone camera interpolation preserves velocity between project stops without overshooting.
- The gold trail and its leading marker follow the same scroll progress as the camera, including backwards travel.
- Introduction → About → Projects overview → Property → ArcGIS → Data engineering → Luma → BirdMap → Services → Contact.
- Five selectable project buildings navigate to their matching scroll sections. The project button opens existing descriptions and demos.
- Instanced facade windows, entrances, balconies, lamps, benches and scale figures; a clear forecourt and reflecting pool preserve the low camera view.
- The active project has a persistent gold outline and a short upward reveal. Reduced motion uses a static outline; settled highlights do not keep rendering.
- Expandable experience, education and skills under About; all existing work areas under Services.
- Turkish/English, light/dark appearance and reduced-motion support.
- Back-to-portfolio and all-projects actions.
- Text and project actions remain available if WebGL fails.

## Structure

- `PortfolioExperience`: entry switch, history and transitions.
- `CityInvitation`: desktop launcher.
- `CityExperience`: content, scene lifecycle and project selection.
- `createCityScene`: rendering, picking and resource disposal.
- `cityLayout`: deterministic buildings, project identities, parks, route and camera poses.
- `createLandscape`: sea, promenade, parks and shared tree instances.
- `createCityRoute`: scroll-driven path reveal and leading marker.
- `createCityDetails`: shared architectural and street-detail instances.
- `createProjectHighlight`: active-building outline, finite reveal and reduced-motion handling.
- `CityStopContent`: section content backed by existing portfolio data.
- `city.tr.json` / `city.en.json`: translated city content.

Three.js is lazy-loaded and prefetched when the desktop launcher is hovered or focused. The city renderer updates on demand, pauses while a project is open or the tab is hidden, and releases resources on exit.

## Checks

Run `npm test`, `npm run lint` and `npm run build`.

Manually check the launcher at desktop and mobile widths, city entry/return, all stops, building selection, each demo, Escape, theme and language switches. Expand About and Services to verify scroll alignment with variable section heights. Test WebGL failure and reduced motion on the target devices before release.

The existing portfolio remains intact. The city is an optional desktop experience; production publishing requires separate approval.

## Validation notes

- 23 tests cover layout, translations, camera clearance, continuous velocity, trail progress, matching opening/closing views, project highlights and portal timing/cancellation.
- Browser checks: desktop and narrow viewports, city entry, all five project dialogs, widget navigation, expandable About/Services, contact links, Escape, both languages and themes.
- The shared Three.js chunk triggers Vite's 500 kB size warning; it is loaded separately from the main page (approximately 136 kB gzip).
- Dependency audit reports four existing tooling advisories in `@humanfs/node`, `baseline-browser-mapping`, `browserslist` and `js-yaml`. Three.js is not listed. No unrelated dependency upgrades were made.
- Reduced-motion and WebGL-failure handling are implemented but still need device-level verification before publishing.

## Portal experiment

Stable baseline: `da/3d-sehir-portfolyo`, commit `cc675ce`.
Experiment: `da/karadelik-gecis-denemesi`. Do not merge or publish without approval.

The desktop launcher captures the visible portfolio locally, pulls its texture into a gold-edged portal, then reveals the city once its scene is ready. The closing/opening animation lasts 1.9 seconds, excluding capture and loading. No captured content is uploaded.

Escape, Cancel, resizing or hiding the tab cancels the transition. The original scroll position and input are restored. Reduced motion uses the regular route change. Capture failures use the regular transition; city readiness failures return to the portfolio. The temporary renderer and texture are disposed after each attempt.

Browser checks include entry from the top and bottom of the portfolio, repeated entry, cancellation while closing and opening, and narrow-screen exclusion. Cross-browser screenshot/font rendering and lower-powered devices still need checking before release.
