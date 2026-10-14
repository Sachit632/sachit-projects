# Sachit Projects — Robotics Website

A responsive, futuristic robotics project website made with plain HTML, CSS, and JavaScript. It runs locally without installing anything and can be hosted free with GitHub Pages.

## Run on Windows
1. Extract `sachit_projects_website.zip`.
2. Open the extracted `sachit_projects_website` folder.
3. Double-click `index.html` to open it in Chrome, Edge, or Firefox.
4. Search/filter projects, open a project card, copy code, or download a sketch.

## Files
- `index.html` — page structure and homepage
- `styles.css` — responsive neon/dark styling
- `projects.js` — project information, parts, steps, and source code
- `app.js` — search, categories, modal, copy, and downloads

## Add a project
Open `projects.js` in Notepad or VS Code. Copy one project object and add it inside `window.PROJECTS = [ ... ]`, separating objects with commas. Give the project a unique `id`, and fill in `title`, `category`, `description`, `parts`, `steps`, `filename`, and `code`. Save and refresh the page.

Categories used by the filter buttons are `RC Cars`, `Arduino`, `ESP32`, and `Sensors`. For best filtering, use one of these for `category`; put additional terms in `tags`.

## Publish free with GitHub Pages
1. Create/sign in to a GitHub account at https://github.com/.
2. Click **New repository** and name it `sachit-projects` (public is simplest for GitHub Pages).
3. Upload the contents of this folder (upload the files themselves, not just the ZIP). `index.html` should be at the repository root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose branch `main` and folder `/ (root)`, then click **Save**.
7. Wait a few minutes and refresh the Pages settings. GitHub will show your website URL, usually `https://YOUR-USERNAME.github.io/sachit-projects/`.
8. Whenever you update and upload files to the repository, the site will update after GitHub Pages rebuilds it.

GitHub's labels may change slightly. Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Important notes
- This is a static website: no login, database, or secure admin dashboard yet. To add projects, edit `projects.js` and upload the updated file.
- Google Fonts are loaded from the internet; if offline, the page uses fallback fonts.
- Starter sketches are examples, not guaranteed drop-in code for every wiring setup. Verify board pins, motor driver, power ratings, and libraries before building. Do not connect motors directly to microcontroller GPIO pins.
