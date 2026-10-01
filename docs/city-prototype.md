# City prototype

Branch: `da/3d-sehir-portfolyo`. Production remains unchanged.

The existing portfolio is the default entry. A persistent desktop-only guide opens the city with a short transition. There is no dismiss button or hidden state. The desktop gate requires a viewport of at least 1024px, hover support and a fine pointer. Mobile visitors keep the existing site, including when opening `?view=city` directly.

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

The former rotating black-hole transition has been replaced by the character entry described below. The stable baseline remains available in Git history.

Escape, Cancel, resizing or hiding the tab cancels the transition. The original scroll position and input are restored. Reduced motion uses the regular route change. Capture failures use the regular transition; city readiness failures return to the portfolio. Temporary capture and canvas resources are released after each attempt.

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

The return sculpture uses the same upper-left diagonal arrow as the header. The desktop invitation uses a detailed 3D-rendered guide with brown hair, a beard, glasses and a ruler. A transparent 2×2 WebP atlas supplies the body, separate forearm, pulling pose and jumping pose without another WebGL context or loading Three.js on the classic page. Only “3D keşfet” / “Explore in 3D” appears below the character. The arm rotates continuously with easing during a sixteen-second wave/rest cycle; hover and focus trigger a slower 4.8-second greeting. Hidden tabs pause the motion. Reduced motion uses a static pose, including hover and focus. A local SVG fallback keeps entry available if the image cannot load.

Validation: 48 automated tests cover continuous camera velocity, descent, eye-level path clearance, centered right-side placement, action raycasting, translated glyphs, entry/hover settling, guide features, diagonal return orientation and resource disposal. Lint and production build pass. Browser checks cover the launcher, portal entry, both languages and themes, mobile exclusion and returning from the final action before any separate publishing approval.

## Character entry

The guide enlarges from its launcher, moves toward the centre, parts the contour field and jumps into the opening. A temporary 2D canvas renders the character and displaced contour lines over a local viewport capture. A curved vertical opening reveals the existing city after its renderer signals readiness. The motion lasts 2.4 seconds, excluding capture and extra loading; city preparation runs during the approach. There is no rotating ring or black-hole shader.

The pulling pose moves its forearms outward. Curtain edges and gathered gold contour strands use the same hand coordinates, with short foreground strands crossing the fingers. The opening stays attached to the hands until takeoff, then expands independently. Sprite slices align to canvas pixels to prevent seams during arm movement. Pulling and jumping use a separate action strip with the ruler secured behind the shoulder, keeping both arms free; the launcher retains its original waving artwork.

The invitation stays visible during capture and is excluded from the snapshot. Canvas elements are also excluded so the background contours are not stretched. Each frame uses a single character pose to avoid doubled faces. The temporary canvas, animation frame, visibility overrides and body scroll lock are released after completion or cancellation. Capture and city readiness have separate deadlines. Escape, Cancel, resize and hidden-tab cancellation remain available; reduced motion bypasses the sequence.

Validation: 53 automated tests cover viewport-safe enlargement, continuous position/scale, monotonic opening, bounded contour displacement, arm timing, reduced motion and cleanup, in addition to the existing city tests.

Lint and production build pass, with the existing lazy city chunk size warning. Browser checks confirmed repeated entry, pulling/jumping poses, cancellation before and after city mounting, scroll restoration, and launcher exclusion without horizontal overflow at 390 × 844. No production deployment was made.

Final production-preview checks on 2026-10-02: 53 tests, lint and build pass. The guide remains available after scrolling, Escape cancellation and the final return action. The QGIS stop aligns with its active navigation item; restart restores the opening camera and scroll position. Turkish/English and both themes were checked. At 1024px the city and guide fit; at 390px and 768px the desktop guide is absent without horizontal overflow. Browser console errors were absent during these checks.

The entry sequence is configured for 2.4 seconds plus capture and any remaining city preparation. A first-entry run with continuous screenshot sampling completed in approximately 4.4 seconds; this includes inspection overhead and is not an FPS benchmark. The lazy city bundle remains about 163 kB gzip and retains the existing Vite size warning.
