# Implementation checkpoints

## CP-01 — Minimal deterministic brick lesson
Status: IMPLEMENTED; browser validation pending.

- [x] Manually authored blueprint from supplied conversation description.
- [x] Procedural 3D lesson and stage descriptions.
- [x] Playback, seek, restart, speed, camera and alternative shaping controls.
- [x] Read-only JSON resources and blueprint download.
- [x] Automated validation: 3 tests passing (`npm test`).
- [x] JavaScript syntax check: `node --check dist/app.js`.
- [ ] Compare against the actual reference image (not attached here).
- [ ] Browser checks: load, orbit, zoom, pause, seek in both directions, restart, both branch options, narrow viewport.

Evidence: Node test runner passed all 3 tests. Managed preview command failed because `/tmp/sites-previewd/requests` is unavailable. No browser success is claimed.

Next action: complete browser/reference validation, then design the schema/compiler boundary before AI extraction.

## Checkpoint template
- ID / date:
- Status: planned | in progress | blocked | verified
- Scope:
- Changes:
- Validation commands and results:
- Visual evidence:
- Known limitations:
- Next action:
- Commit:

## CP-02 — Detailed operation scenes
Status: IMPLEMENTED; browser validation pending.

- [x] Original chart attached, included in lesson, and manually compared for order, alternatives and numeric values.
- [x] Ten close-up scenes with deterministic 15-second sequences (150 seconds total).
- [x] Excavator joints and clay release; vibrating screen, moving feed and rotating rollers.
- [x] Sand/water streams and mixture movement; separate mould pressing/release and wire-cutting scenes.
- [x] Cutaway oven/kilns, brick trolley, moisture particles, heat/color change and cooling airflow.
- [x] Layer-by-layer packaging, straps, forklift loading and truck departure.
- [x] Action captions, previous/next, per-stage loop, chart dialog, responsive controls.
- [x] 14 automated tests pass: every scene and both branches sampled for finite transforms and deterministic reverse seeking, plus process facts/timeline.
- [ ] Visual browser QA: managed preview daemon remains unavailable.

The chart does not specify internal machine mechanisms or handling machinery; these additions are explicitly labeled illustrative. No fluid, heat-transfer, material-conservation, or collision simulation is claimed.

## CP-03 — Connected animated factory and optional breakdown
Status: IMPLEMENTED; browser validation pending.

- [x] Connected factory is the default view; all ten stations operate in one scene.
- [x] Nine physical belt transfers carry material appropriate to the production stage.
- [x] Existing close-up lessons retained behind the Step-by-step breakdown button.
- [x] Mode switches retain timeline position and shaping method.
- [x] Station selection, camera focus, overview reset, responsive projected labels.
- [x] Beveled machinery, metal finishes, chamber control panels, safety markings and factory grounds.
- [x] 16 tests passing: both factory branch configurations, deterministic transport/scene seeking, per-stage behavior and chart facts.
- [ ] Browser visual/performance verification: preview daemon remains unavailable.

Factory transport layout and simultaneous activity are an educational illustration, not source-chart claims or a physically timed material-conservation simulation. The selected station follows the lesson timeline; the surrounding factory continues operating.

## CP-04 — Industrial materials, continuous transfers and fully open thermal stages
Status: IMPLEMENTED; browser visual/performance validation pending.

- [x] Procedural material maps: brushed steel, granular clay, wood, rubber and concrete, with bump detail and metal roughness.
- [x] More excavator track and body hardware; irregular clay terrain; cooler neutral lighting and factory shadows.
- [x] Removed ALL thermal-stage wall and roof panels in both views; only thin structural frames remain.
- [x] Single distance-based transport route, tangent-continuous rounded bends and continuously moving batches; wet-to-fired color changes.
- [x] Instanced repeated conveyor hardware to reduce rendering overhead.
- [x] Tests cover positional/tangent continuity at every route join and open thermal frames, alongside existing regression checks.

Limits: industrial procedural visualization, not photorealistic scanned assets or physically simulated production. Loading and processing internals remain instructional approximations. Browser visual/performance checks remain unverified.

## CP-05 — Material identity and connected packaging
Status: IMPLEMENTED; browser verification pending.

- Ten distinct material states: raw clumps, screened fragments, crushed granules, wet mixture, shaped wet bricks, dried bricks, heated bricks, fired-hot bricks, cooled bricks, secured pallets.
- Feed ramp delivers clay to elevated filter, then unsupported drop delivers screened material to crusher conveyor.
- Continuous batches collect onto pallets, stack progressively, acquire straps and enter the parked truck; independent factory packaging/cargo animations removed.
- Palletizer head tracks a batch currently being packaged.
- Transparent wall/roof shells identify thermal chambers while preserving visibility; drying roughness/color and cooling emissive changes apply in close-up too.
- Shaping selector moved to top view toolbar. Current material output shown in lesson caption.
- Regression checks include ordered material states, dry/cool properties, continuous route joins and monotonic packaging.

This is illustrative material handling, not a mass-conserving physical simulation. Surface colors distinguish states for teaching; cooling primarily removes heat glow, not the fired-brick color. Browser visual QA remains unavailable.

## CP-06 — Trace camera, explanations and effects polish
Status: IMPLEMENTED; browser validation pending.

- Trace mode follows active stage through playback, scrubbing and stage navigation, with eased camera target/zoom and responsive framing.
- Dragging, scrolling, Focus station or Reset view disables trace to respect manual control. Turning trace off returns to overview.
- Explanations toggle controls station labels and the factory action/fact overlay; close-up captions remain available.
- Layered additive flame sprites, soft drifting vapor, thin cooling airflow, cool rim/warm fill lights and locally generated environment reflections.
- Shared effect textures are preserved during stage disposal; annotations are hidden in overview without hiding effect sprites.
- 28 automated tests pass, including trace target selection, explanation visibility and deterministic effect animation. JavaScript syntax checks pass.
- Browser appearance/performance verification remains pending due to unavailable managed preview and published-site sign-in boundary.

## CP-07 — Station-attached explanations and synchronized shaping
Status: IMPLEMENTED; browser visual QA pending.

- Removed the fixed explanation box. Each station now owns a projected callout; the active callout expands with current action and source facts and moves with the camera.
- Callouts switch above/below the station anchor near viewport edges. Explanations toggle and trace mode preserved.
- Shared smooth feed/form/release/tool timing drives wire cutter and mould motion. Factory shaping follows a batch inside the machine, rather than an unrelated machine clock.
- Wet mixture consolidates into a slab, becomes brick geometry, then separates gradually before transfer. Duplicate local factory payloads suppressed.
- Mould guide columns, roller motor/fins/bolts, refined clear-coated metal finish and soft contact shadows added.
- 29 tests pass, including smooth monotonic shaping phases, effect determinism, route continuity, and existing process checks.

Limit: procedural educational geometry and illustrative shaping transformation, not a collision/volume-conserving simulation. Visual browser verification remains pending.

## CP-08 — Thermal atmosphere and label readability
Status: IMPLEMENTED; browser visual/performance QA pending.

- Blue transparent airflow trails and mist for drying/cooling; red-orange atmospheric haze and warm light for heating.
- Effects ease in and out without hard stage-cycle lighting switches; opacity stays low enough to retain interior visibility.
- Larger high-contrast text, thermal color accents, active-label priority, collision-aware label placement and SVG leader lines attached to station anchors.
- Airflow/heat legend distinguishes illustrative blue airflow/moisture from actual process temperature.
- Tests cover atmosphere bounds, transparency, deterministic animation, intensity envelopes, and non-overlapping labels in narrow viewports.

Atmosphere colors are educational cues, not a claim that drying is cold or that air is visibly blue. Visual browser verification remains pending.

## CP-09 — Angle-preserving pan and persistent brick trace
Status: IMPLEMENTED; automated checks pass; browser verification pending.

- [x] Middle mouse and Space + left-drag pan the view by moving eye/target equally in the camera screen plane. Ordinary left-drag still orbits; wheel still zooms.
- [x] Suppress Space page scrolling during navigation and native middle-button autoscroll; preserve form/keyboard controls. Capture the active pointer, lock the gesture type at drag start, and clear modifiers/capture on blur/cancel.
- [x] Replace station-target tracing with the world position of persistent brick `brick-001`. Gold outline identifies it. Follow its source clay before forming, then the same brick through every downstream operation and within its pallet.
- [x] Synchronize the tracked batch to the lesson timeline; preserve boundary continuity and deterministic seeking. Synchronize shaping and truck departure with that journey. End without despawn or automatic recycling.
- [x] Trace opens the connected view; manual camera control and breakdown exit trace. Branch switches retain logical brick identity/progress.
- [x] 44 tests pass. New checks exercise input dispatch/cancellation, Space behavior, camera-plane translation, both branches, same-object identity, continuous stage joins, deterministic backward seeks, and six-unit travel with the departing truck.
- [x] JavaScript syntax and diff whitespace checks pass.
- [ ] Browser input, visual and performance QA: blocked by unavailable `sites-previewd` mailbox; both preview start and status report the same infrastructure error. No workaround server used.

Next check: in a WebGL browser, exercise both pan gestures from overview and zoomed trace; watch a full journey in each shaping mode; pause, scrub, switch modes/branches and replay. Before shaping, identity denotes the source material batch rather than an already-formed brick. The scene remains an illustrative process model.

## CP-10 — Ordinary-item tracing and continuous shaping
Status: IMPLEMENTED; browser visual/performance verification pending.

Supersedes CP-09's special tracked-batch timing and proximity suppression.

- Every production batch now uses the same journey clock, station behavior and movement calculation, with staggered offsets. The first batch is an ordinary chain item that the view highlights; tracing has no effect on any batch's position, speed, scale, visibility or tool timing.
- Removed neighbor hiding and tracked-only movement/fade exceptions. Fourteen evenly scheduled batches allow a visible forming dwell without crowding the press. Delivery truck follows the departing batch.
- Same nine morphable meshes persist from clay through finished bricks. Step 4 smoothly consolidates them into a continuous tiled clay block, holds under the tool, forms seams, retracts and releases. No slab disappearing, zero-height brick growth or replacement mesh handoff. Factory and breakdown use shared poses and timing for both mould and wire branches.
- Replaced triangulated fixed wire box with short gold corner brackets fitted from actual morphed vertices every frame. The marker shares the batch transform, including packaging/turns/departure, and a small projected identity badge improves readability. Hidden portions have a faint guide; visible portions retain stronger depth-tested edges.
- Validation: 51 automated checks, including equal movement for offset ordinary batches, trace-on/off invariance, visibility retention, mesh identity, marker containment, smooth shaping boundaries, dwell/full thickness, both breakdown branches, and truck/cargo alignment.
- Managed browser preview still unavailable: `sites-preview status` reports missing daemon mailbox. Visual browser acceptance remains pending; no visual QA success is claimed.

Next manual checkpoint: watch the traced item alongside its neighbors, toggle trace mid-motion, and inspect forming in both shaping modes. Confirm marker readability at several zoom/rotation angles and ordinary delivery cycling. Existing process facts and pan/orbit controls retained.

## CP-11 — Conveyor repair, thermal transitions and clarity
Status: IMPLEMENTED; browser visual/performance verification pending.

- Replaced disconnected yaw-only bed segments with an indexed, continuous conveyor surface following the complete 3D route, including ramps and bends. Filled the missing filter descent with a supported transfer surface. Suppressed duplicate station belts in the connected factory.
- Main and breakdown conveyors now share moving tread textures and visibly rotating striped rollers, updated from playback time for deterministic pause/seek. No static islands or cycle-dependent frozen station belts remain in the connected view.
- Shared thermal appearance interpolates brick color, roughness and emissive heat: wet → dry → moderate heat → glowing fired brick → cooled terracotta. In the factory, interpolation occurs within each chamber footprint and persists after exit. Close-ups use the same appearance endpoints and gradual transitions.
- Removed the excavation debris particle emitter; preserved the excavator and carried material, screening and mixing effects.
- Wheel events are captured across the whole 3D scene (including label overlays), prevent page scrolling there and normalize mouse/trackpad deltas. Outside the scene, normal page scroll remains untouched.
- Surface maps increased from 128 to 512 pixels, with mipmaps, hardware-capped anisotropic filtering, finer grain and less excessive bump. Corrected wet-clay material classification. Rendering supports up to 2.5× device scale within an 8-million-pixel budget.
- Validation: 59 automated tests cover conveyor route coverage, all roller transforms, tread seeking, duplicate suppression, gradual thermal changes and chamber placement, removed debris, zone-scoped wheel events, texture filtering and prior regression cases. JavaScript syntax and whitespace checks pass.
- Browser preview remains unavailable (`sites-previewd` mailbox missing); no browser appearance/performance verification is claimed.

## CP-12 — Filter clearance and real bucket-to-belt handoff
Status: IMPLEMENTED; browser visual verification pending.

- Compared the supplied screenshot with geometry: the elevated main belt intersected the filter plane. Separated the raised approach feeder from the receiving conveyor, which now runs below the full mesh. The upper feeder ends before the grid; the lower belt begins underneath it.
- Material height now follows the upper feeder, crosses the shallow downward-sloping screen and drops onto the lower belt. Suppressed duplicate factory screen particles; close-up screening retains its explanatory flow.
- Replaced approximate excavator keyframes with a two-link arm solution targeting the actual feed position. Bucket carries the material, swings completely over the belt, lowers and tips, then retracts.
- Replaced the diagonal airborne interpolation with a short 0.18-unit vertical discharge. Clay is compacted within the bucket, then settles/spreads on the feed belt. The close-up load handoff preserves the bucket-relative position. Extended the feeder behind the landing point so the load lands within its footprint, not on an unsupported endpoint.
- Added tests for actual articulated anchor alignment, release over belt, no upward/lateral discharge jump, exact close-up handoff, filter-to-belt clearance and monotonic screen discharge. Prior production/tracing controls retained.
- Browser infrastructure remains unavailable (managed preview daemon mailbox missing). Numerical scene checks do not substitute for browser visual acceptance.

Validation result: all 64 automated tests pass after the final feeder-footprint adjustment; JavaScript syntax and diff whitespace checks pass.

## CP-13 — Bring step-by-step breakdown up to date
Status: IMPLEMENTED; 70 automated checks pass; browser visual verification pending.

- Added a dedicated breakdown payload layer using the same nine-piece clay/brick geometry, shared loading trajectory, screen height, shaping poses and thermal appearance as the connected factory.
- Excavation follows the actual bucket, drops directly onto the feed belt and continues along it. Screening follows the raised feeder, crosses the mesh, drops to the lower belt and shrinks through the crusher; removed the old independently looping visible screen particles from breakdown.
- Mixing receives granules, blends them while sand/water feed, then dispatches wet clay. Retained the shared smooth mould/wire shaping sequence.
- Thermal close-ups show a flat brick batch entering, dwelling inside the transparent chamber, gradually changing color/glow, then exiting with the correct resulting appearance.
- Packaging receives nine cooled bricks, stacks them on a waiting pallet, closes straps and dispatches it. Delivery uses the same nine-brick stack with cargo aligned to the forklift forks and a smooth departure.
- Suppressed legacy standalone close-up payloads so duplicate blocks, stacks and circulating particles do not compete with the demonstration. Factory machine creation explicitly excludes the breakdown payload layer, preserving the connected view.
- Increased default narrow-screen breakdown camera distance to keep feed equipment in frame; retained manual camera controls, stage looping, both shaping methods and source facts.
- Tests cover nine-piece identity through seeking, hidden legacy payloads, continuous excavation handoff/onward motion, screen trajectory, thermal dwell/endpoints, matching packaging/delivery stacks, forklift support and separation from factory mode.
- Managed preview still reports a missing daemon mailbox; browser visual/performance QA is unverified.

## CP-14 — Shaping choreography and portable source release
Date: 3 November 2026.
Status: IMPLEMENTED; 76 automated checks pass; browser visual/performance verification pending.

- Shared five-part shaping sequence: feed/settle, tool approach, form/cut, retract/release, separate/discharge. The same nine meshes persist through both views; no geometry swaps or near-zero scaling.
- Mould clay retains soft contours until press contact. Individual press pads, connected support beams, hydraulic rods and a travelling cavity sleeve show the operation. Dividers retract below the brick bottoms before outfeed, including in the connected factory where the older tray was hidden.
- Wire cutting consolidates the incoming clay into a slab, cuts through its full depth while clearing the belt, retracts completely, then separates the bricks. Incoming/outgoing positions and ordinary-batch trace behavior are preserved.
- Shared captions now describe five actual shaping phases rather than three equal time slices. Shaping material roughness changes consistently in both views.
- Replaced obsolete README with current source map, feature description, limitations and installation entry point. Added detailed INSTALLATION_AND_DEPLOYMENT.md with GitHub project/user-site instructions, updates, rollback and troubleshooting.
- Added dependency-free Node development server (`npm run dev`), source checks (`npm run check`), GitHub Pages workflow and `.nojekyll`. Changed the header link to a relative path for project-hosted Pages URLs. No application build or npm package installation is needed.
- Validation: `npm run check` on Node 24.22.1 passes all 76 tests plus syntax checks. New cases cover contact timing, wire/belt clearance, delayed outfeed, visible/retracting factory moulds, five captions, HTTP response types and resolving assets/modules/data under root and repository-prefixed URLs. `git diff --check` passes.
- Managed preview start/status both report missing `sites-previewd` mailbox; browser appearance, interaction and GPU performance remain unverified. No replacement browser server was started.
- GitHub Actions workflow supplied but not executed on GitHub. No GitHub repository creation or GitHub Pages publication is claimed. The source export excludes Git history and private hosting metadata; includes the complete runtime, tests, assets, licenses, scripts, workflow and documentation.
