# Open IELTS 3D — Brick Lab

A complete static, browser-rendered brick-manufacturing lesson. The connected factory and ten step-by-step scenes share material, shaping and thermal animation logic. JavaScript + vendored Three.js 0.170.0, with no runtime package installation, bundler, API key or external CDN.

## Start locally

Install Node.js 22 or newer (Node 24 is used by CI), extract this project and open a terminal in the folder containing `package.json`:

```sh
npm run dev
```

Open **http://localhost:8000**. Stop with Ctrl+C. There are no npm dependencies to install. Alternatively, with Python 3: `python3 -m http.server 8000 --directory dist` (on Windows, `py -m http.server 8000 --directory dist`). Do not double-click `index.html`: browser module loading and JSON fetches require HTTP.

```sh
npm run check  # JavaScript syntax checks + the full automated test suite
npm test      # Tests only
```

**[Complete installation and GitHub Pages instructions](INSTALLATION_AND_DEPLOYMENT.md)** include publishing at `https://USERNAME.github.io/REPOSITORY/` or `https://USERNAME.github.io/`, troubleshooting, updating and rollback. A working workflow is included at `.github/workflows/pages.yml`; enable GitHub Actions in repository Settings → Pages.

## What is included

- Connected conveyor factory, ten close-up lessons, both mould and wire-cutter alternatives.
- Nine persistent material pieces per batch; trace mode follows an ordinary chain item without changing its speed or hiding neighbors.
- Corrected bucket-to-belt transfer and screen with the receiving belt below the mesh.
- Distinct raw clay, mixture, wet brick, dry brick, fired brick and cooled brick appearances.
- Transparent thermal chambers, blue airflow, red-orange heat, flames and vapor.
- Station-attached explanations, chart reference, playback, scrub, speed and stage loop.
- Orbit with left-drag; pan with middle-drag or Space + left-drag; wheel zoom inside the scene and normal page scroll outside.
- Static JSON process resources, test suite, MIT license, third-party license and checkpoint history.

## Version 0.14: shaping choreography

The two shaping methods now have different material behavior. Moulding keeps the clay soft until compaction; wire cutting first consolidates a slab, then passes the wires through its full depth. Both preserve the same nine meshes. The press has individual pads, hydraulic rods and an open frame. Mould dividers follow the batch and retract before departure, in both views. Wires clear the conveyor surface. Tool withdrawal, separation and outfeed have separate timing windows; five action captions follow the actual sequence.

## Source map

`dist/` contains the **editable application source**, not generated/minified application code. Only the vendored Three.js distribution is minified. There is no missing build project. All paths are relative so the same files work at a domain root or a GitHub Pages project path.

| File | Responsibility |
| --- | --- |
| `dist/index.html`, `dist/style.css` | Interface and responsive layout |
| `dist/app.js` | Playback, view modes, labels, camera and rendering |
| `dist/machines.js` | Procedural machines and close-up scenes |
| `dist/factory.js` | Connected layout and ordinary material batches |
| `dist/shaping.js` | Pure shaping poses, tool timing and five action captions |
| `dist/clay-geometry.js` | Persistent clay-to-brick mesh morph targets |
| `dist/detail-payload.js` | Breakdown enter/process/exit payloads |
| `dist/brick-journey.js`, `dist/loading.js` | Chain timing and excavator/filter handoff |
| `dist/conveyor.js` | Continuous belt geometry, tread and rollers |
| `dist/material-flow.js` | Material states, temperature appearance and packaging |
| `dist/effects.js`, `dist/surfaces.js`, `dist/lighting.js` | Atmosphere, procedural textures and lighting |
| `dist/trace-marker.js`, `dist/view-state.js`, `dist/camera-controls.js` | Fitted tracking marker and navigation |
| `dist/label-layout.js`, `dist/contact-shadows.js` | Annotations and contact shading |
| `dist/process.js`, `dist/api/v1/` | Timeline and process facts |
| `dist/vendor/` | Three.js runtime and its MIT license |
| `dist/reference.png` | Supplied reference chart |
| `tests/` | Automated regression and geometry checks |
| `scripts/` | Dependency-free local server and source checks |
| `.github/workflows/pages.yml` | Test, upload `dist/`, deploy to GitHub Pages |
| `CHECKPOINTS.md` | Append-only implementation history and verification limits |

## Static JSON interface

- `./api/v1/processes.json`
- `./api/v1/processes/brick-making.json`

These are downloadable GET resources, not an upload/conversion service. On GitHub Pages include the repository prefix in their URLs. The browser does all rendering; no application server is required for the lesson.

## Scope and validation limits

This is the complete source of the current single-process prototype, not an implementation of the earlier proposed general AI platform. Image uploads, OCR, OpenRouter, general blueprint compilation and a POST conversion API are not implemented. Any later AI integration needs a separate backend; never place provider secrets in a public static site.

Machinery, factory layout, handling and processing speeds are educational illustrations, not a physics simulation. The diagram's durations and temperatures are separate from animation time. Fans, machine internals and packaging mechanisms are illustrative additions.

Automated tests verify deterministic animation, geometry relationships, continuity, controls and process facts. They do not establish visual quality or GPU performance. Browser visual/performance verification for this revision remains pending because the managed preview service was unavailable. The GitHub workflow is supplied and locally checked, but was not run on the user's GitHub account.

## Licensing

Application source: MIT (`LICENSE`). Three.js: MIT (`dist/vendor/THREE-LICENSE.txt`). The supplied original chart is reference material; the source-code MIT license does not grant rights to third-party artwork. Confirm permission or replace the chart before public redistribution.
