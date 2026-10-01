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

- 29 tests cover layout, translations, name spelling, camera clearance, continuous velocity, trail progress, matching opening/closing views, project highlights, emblems and portal timing/cancellation.
- Browser checks: desktop and narrow viewports, city entry, all five project dialogs, widget navigation, expandable About/Services, contact links, Escape, both languages and themes.
- The shared Three.js chunk triggers Vite's 500 kB size warning; it is loaded separately from the main page (approximately 145 kB gzip).
- Dependency audit reports four existing tooling advisories in `@humanfs/node`, `baseline-browser-mapping`, `browserslist` and `js-yaml`. Three.js is not listed. No unrelated dependency upgrades were made.
- Reduced-motion and WebGL-failure handling are implemented but still need device-level verification before publishing.
- Production-preview checks confirmed city entry, name spelling, property map selection, widget navigation, demo login/logout and independent mobile modal scrolling at 390 × 844. The mobile separator is 3 px. Luma and BirdMap iframe contents appeared blank in the test browser; their external demos remain unverified.

## Portal experiment

Stable baseline: `da/3d-sehir-portfolyo`, commit `cc675ce`.
Experiment: `da/karadelik-gecis-denemesi`. Do not merge or publish without approval.

The desktop launcher captures the visible portfolio locally, twists its texture into a gold-edged portal, holds a rotating ring for 0.9 seconds, then reveals the city once its scene is ready. The animation lasts 3.15 seconds, excluding capture and extra loading. No captured content is uploaded.

Escape, Cancel, resizing or hiding the tab cancels the transition. The original scroll position and input are restored. Reduced motion uses the regular route change. Capture failures use the regular transition; city readiness failures return to the portfolio. The temporary renderer and texture are disposed after each attempt.

Browser checks include entry from the top and bottom of the portfolio, repeated entry, cancellation while closing and opening, and narrow-screen exclusion. Cross-browser screenshot/font rendering and lower-powered devices still need checking before release.

All five projects have procedural rooftop sculptures and smaller entrance badges: parcel/pin, connected layers, Python, architectural model and bird. Selecting a project plays a four-second project-specific animation, then rendering returns to idle. Reduced motion skips the animation. Emblems share geometry/materials, participate in project picking and release their resources on exit. Taller buildings use offset rooftop mounts to keep the sculptures clear of navigation.

## QGIS plugins

`qgisPlugins.js` is the shared plugin registry. Its order determines modal navigation and building floors. Add a stable ID, metadata, screenshots and matching `qgis.tr.json` / `qgis.en.json` content for each new plugin. Do not add placeholder plugins to the published registry.

The QGIS stop follows BirdMap. Each plugin has its own raycastable floor; floor selection opens that plugin directly. The city owns the selected plugin ID, so modal arrows update the same floor. Selected floors move forward and glow, with static reduced-motion handling and demand rendering. Single-plugin navigation shows 1/1 with disabled arrows.

The first entry is Vector Converter 0.9.0. Content and screenshots come from the local `qgis/parsel-donusturucu/publication/vector-converter` README and assets, which include newer coordinate validation than the original PDF guide. The right panel is a gallery of real QGIS Desktop screens, not an in-browser conversion engine. The public GitHub URL returned 404 during development; verify public access before publishing.

Validation: 36 automated tests, lint and build; classic/city project entry, direct 3D floor picking, both languages, light/dark views and independent mobile panel scrolling. Three-plugin fixtures cover floor IDs, wraparound, selection reset, animation settling and resource disposal. Only one real plugin is currently published in the registry.

## Street-scale ending

Branch: `da/sokak-olcegi-finali`. This replaces the former contact pullback with an eye-level ending; the opening and project views stay intact.

After QGIS, scrolling lowers the camera to 1.85 scene units and widens its field of view. The camera follows the gold path and turns into the park. Services stay in a fixed left panel until contact, which remains visible through the final camera stop. There are thirteen camera stops without separate street-level or end-of-route headings.

`createStreetFinale` owns the right-side restart and return symbols, extruded bilingual labels and finite entrance animation. There are no action buildings. Mesh picking and transparent, projected keyboard controls share both actions. The bundled font subset retains its license and includes Turkish glyphs. Language changes dispose old text geometry before replacing it. Restart fades the city briefly and resets scroll, camera and heading focus; return uses the existing portfolio route. Reduced motion skips the entrance animation and reset fade. Settled symbols return to demand rendering.

Both sculptures share a centered right-side layout, sage orbital rings and gold detail beads. Entry animations run for four seconds; hovering triggers a short symbol-specific response, then rendering settles again. Labels use two balanced lines. Placement tests cover 1024, 1280 and 1910-pixel desktop widths.

The return sculpture uses the same upper-left diagonal arrow as the header. The desktop invitation is a small procedural Three.js guide with brown hair, a beard, glasses, a ruler and an articulated waving arm. Only “3D keşfet” / “Explore in 3D” appears below the character. The renderer loads asynchronously, pauses while hidden and releases its resources on exit. Waving lasts 3.2 seconds on entry, focus or hover, with a twelve-second repeat while visible. Reduced motion uses a static pose; a local SVG fallback keeps entry available without WebGL.

Validation: 48 automated tests cover continuous camera velocity, descent, eye-level path clearance, centered right-side placement, action raycasting, translated glyphs, entry/hover settling, guide features, diagonal return orientation and resource disposal. Lint and production build pass. Browser checks cover the launcher, portal entry, both languages and themes, mobile exclusion and returning from the final action before any separate publishing approval.
