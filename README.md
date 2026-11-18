# GitHub Explorer

A responsive GitHub profile explorer built with React, TypeScript, Vite, React Router, Recharts, and Lucide icons.

## Run locally

1. Install Node.js (version 18 or newer).
2. Open a terminal in this project folder.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.
5. Open the local address Vite prints in the terminal.

Create a production build with `npm run build`, or preview it locally with `npm run preview`.

## Features

- Search public GitHub profiles by username or profile URL.
- View public profile details, repository, follower, and following counts.
- Explore real trending repositories from GitHub Search.
- Compare two public profiles.
- Save favorite profiles and keep a recent search list in this browser.
- Review repository language counts and creation dates based on the latest 100 public repositories returned by GitHub.
- Responsive desktop, tablet, and mobile layouts.

## Data notes

The app calls GitHub's public REST API directly from the browser. It has no backend and does not use sample profile totals. Unauthenticated GitHub API requests are rate limited. Repository totals such as stars, forks, languages, and the timeline are calculated from up to 100 recently updated repositories, while the public repository count, followers, and following are read from the profile response.

Favorites, recent searches, and the short-lived trending cache are stored in local browser storage.
