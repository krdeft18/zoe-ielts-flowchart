# Install Brick Lab and publish it with GitHub Pages

This guide is for the complete version 0.14 source package. No AI service, database, paid model, bundler or server-side framework is needed. All browser assets, including Three.js, are included locally.

## 1. Extract and check the folder

Extract `open-ielts-3d-complete-source.zip`. Open a terminal **inside `open-ielts-3d/`**, where `package.json`, `README.md`, `dist/`, `scripts/`, `tests/` and `.github/` are siblings. Hidden folders must be preserved: `.github/workflows/pages.yml` is the deployment workflow.

`dist/` is the application source and the deployable website. Do not move its files into the repository root or create an additional nested `open-ielts-3d/` folder when uploading to GitHub.

## 2. Local installation and run

Install Node.js 22+ with npm from https://nodejs.org/ (Node 24 is the CI version). Then:

```sh
node --version
npm --version
npm run dev
```

Open **http://localhost:8000** in a modern browser with WebGL 2 and hardware acceleration enabled. Keep the terminal open while using the page. Ctrl+C stops the local server. No `npm install` is required: the project has no npm dependencies.

If port 8000 is busy, stop its other server or choose another port:

```sh
# macOS / Linux
PORT=8080 npm run dev
```

```powershell
# Windows PowerShell
$env:PORT=8080
npm run dev
```

Then open `http://localhost:8080`. The Node server binds to your computer's loopback address; it is a development tool, not the public deployment.

**Python alternative:** if you only want to view the site and already have Python 3, run `python3 -m http.server 8000 --directory dist` on macOS/Linux, or `py -m http.server 8000 --directory dist` on Windows. Tests still require Node. Do not open the HTML through `file://`.

## 3. Validate before publishing

```sh
npm run check
```

This checks application/script/test JavaScript syntax and runs all tests. The automated suite checks process facts, conveyor continuity, deterministic seeking, both shaping methods, retained brick identity, thermal transitions, controls and static-site paths.

Manual checks in your browser:

1. Open **Step-by-step breakdown**, select step 4 and enable **Loop current stage**.
2. Select **Mould**. Clay should remain soft while arriving, compact under the press, then leave after the press and dividers retract.
3. Select **Wire cutter**. The slab should stop, wires pass through it, the frame lifts, then brick gaps open before outfeed.
4. Pause and scrub backward/forward. There should be no replaced/disappearing pieces or accumulated motion.
5. Return to **Connected factory**, focus step 4 and toggle **Trace mode**. Trace should follow an ordinary batch and retain neighboring items.
6. Confirm labels, panning, zoom, chamber effects and the original chart. Check a narrow/mobile-sized window too.

These manual visual checks were not completed in the development environment because its browser preview service was unavailable.

## 4. Choose your GitHub Pages URL

| Desired address | Repository name |
| --- | --- |
| `https://USERNAME.github.io/brick-lab/` | `brick-lab` (or another project name) |
| `https://USERNAME.github.io/` | Exactly `USERNAME.github.io` |

Replace `USERNAME` with your GitHub account name. No base URL setting is necessary: the application already uses relative assets, JSON requests and navigation.

The instructions below use a public repository, which supports GitHub Pages on GitHub Free. Public Pages exposes the lesson and shipped assets to anyone with its URL. The existing private ChatGPT-hosted site is separate and keeps its existing access policy.

## 5. Create the repository and upload the full source

1. Sign in at https://github.com and create a **new public repository** with your chosen name.
2. For the Git commands below, create it empty: do not initialize a README, license or `.gitignore` on GitHub, because this package already has them.
3. Install Git if needed. From the extracted project folder run:

```sh
git init
git add .
git commit -m "Add Brick Lab with enhanced shaping animation"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Replace `USERNAME` and `REPOSITORY` in the remote URL. Authenticate using your normal GitHub login/credential manager or SSH setup. Never add a token to source files. If Git asks for your commit identity, configure your own name and email before committing.

If using an existing repository, copy these files into its checked-out working tree, preserving `.github/`, then commit and push using that repository's existing remote. Do not blindly run `git remote add origin` when it already has an origin.

**Without command-line Git:** use GitHub Desktop to create/publish a repository from the extracted folder. Confirm `.github/workflows/pages.yml`, all of `dist/` (including `vendor/` and `api/`), `tests/`, `scripts/` and `package.json` are present on GitHub.

## 6. Enable Pages and run the workflow

1. In the GitHub repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions → Test and deploy Brick Lab**.
4. If a push already started the workflow before Pages was configured, rerun it. Otherwise use **Run workflow**, choosing `main`.
5. Wait for both `test-and-package` and `deploy` to succeed. Open the URL in the deployment summary or in Settings → Pages.

The included workflow checks the source and tests on Node 24, uploads **only `dist/`** as the Pages artifact, then deploys it. GitHub supplies a short-lived `GITHUB_TOKEN` automatically; no personal access token or repository secret is required by this workflow. The deployment job requests `pages: write` and `id-token: write` and uses the `github-pages` environment.

Do not publish the repository root as the website. It has no root `index.html`; the entry point is `dist/index.html`. There is no build step and no `npm run build` command. Test failures prevent deployment.

For a project site, visit the full URL with a trailing slash, for example `https://USERNAME.github.io/brick-lab/`. Its JSON data will be at `https://USERNAME.github.io/brick-lab/api/v1/processes/brick-making.json`.

## 7. Future updates and rollback

Edit application files directly under `dist/`, run checks, then:

```sh
npm run check
git add .
git commit -m "Describe your change"
git push
```

Every push to `main` triggers deployment. If you use another default branch, update the `branches: [main]` entry in `.github/workflows/pages.yml`. To roll back, revert the problematic commit, run checks and push the revert; the previous implementation will be redeployed as a new commit.

## 8. Troubleshooting

| Symptom | Check or fix |
| --- | --- |
| Site returns 404 | Confirm Settings → Pages uses GitHub Actions; both workflow jobs succeeded; visit the correct repository-prefixed URL. |
| Workflow not listed | Ensure `.github/workflows/pages.yml` was copied, is at repository root and was pushed to `main`. |
| Pages configuration/deployment fails | Enable Pages first, then rerun. Check repository/organization Actions restrictions and the `github-pages` environment's deployment rules. |
| Workflow waits for approval | Review the repository's environment protection settings; a repository owner may need to approve the deployment. |
| Styles, scripts or JSON return 404 | Upload the whole `dist/` tree and retain relative paths. Do not upload only `index.html`. |
| Blank scene / WebGL error | Enable hardware acceleration, use a WebGL 2-capable browser/GPU, and inspect browser console errors. Try a smaller window if GPU memory is constrained. |
| Local modules blocked | Serve through HTTP with `npm run dev`; do not double-click the HTML. |
| Old animation persists | Confirm the latest workflow succeeded; hard-refresh or open a new private window after deployment. |
| `npm run build` fails | There is no build step. Use `npm run check` and deploy `dist/`. |
| `npm run check` fails | Read the failing test and fix it before publishing. Node 24 matches CI. |

## 9. What GitHub Pages does and does not host

Pages serves static HTML, JavaScript, styles, images and JSON. The current factory runs entirely in the browser. Its `/api/` files are static data, not a Python/Node API service. Image interpretation, OpenRouter calls, accounts and data storage would require additional backend infrastructure; they are not part of this package. Do not put API keys in browser JavaScript or public Git history.

The original chart remains included as supplied reference material. The MIT code license does not relicense that artwork; confirm permission or replace it for public redistribution.

## Official references

Checked for this guide on 3 November 2026:

- GitHub custom Pages workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Choosing a publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

The workflow is included and its local checks have been run. No GitHub repository was created and no GitHub Pages deployment was performed on your behalf.
