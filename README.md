# FORMA Furniture

Local React implementation of the FORMA reference UI, with its original catalog and imagery.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The deployable static site is generated in `dist/`.

## Features

- Responsive desktop and mobile layouts.
- 90 catalog items across 11 categories, search, grid and horizontal views.
- Product detail dialogs with photo navigation, keyboard controls and source links.
- Saved selections and language preference stored in the visitor's browser.
- Türkmençe and English interface.
- Room planner and downloadable text brief. Planning uses room, area and style rules locally; no AI service or API key is required.
- Local images and fonts; the interface does not need the reference host to run.

## Source

- `src/App.jsx`: page sections, navigation and planner interface.
- `src/components/Catalog.jsx`: catalog, filtering and product gallery.
- `src/data/catalog.js`: product data and categories.
- `src/planner.js`: validated room-planning rules.
- `src/storage.js`: resilient browser preference storage.
- `src/styles.css`: responsive reference styles.
- `public/images/` and `public/fonts/`: local assets.

Run `npm test` for planner and storage checks. Browser QA also verified catalog search, filtering, grid view, saved-item persistence, photo navigation, language switching, planner generation and mobile navigation.

UI and imagery were recovered from the supplied reference, https://forma-living-studio.kgijow.chatgpt.site/. Product source links are preserved in the catalog. DM Sans and Italiana use the SIL Open Font License; license files are included with the fonts.
