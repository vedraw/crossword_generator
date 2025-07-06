# Family Names Crossword Generator

A fun web app to generate all possible crossword-style arrangements from a list of names! Supports interactive preview, regeneration, and image download of the grid.

---

## Features

- Generates all possible crossword layouts with horizontal/vertical placement
- Avoids adjacent non-overlapping words for cleaner puzzles
- Regenerate to cycle through all valid layouts
- Download crossword grid as an image (PNG)
- Fast Node.js + Express backend
- Simple HTML + JavaScript frontend

---

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JS, `html2canvas`
- **Backend**: Node.js, Express
- **Misc**: CORS, Grid-based UI, Flexbox layout

---

## Usage

1. Clone this repo:

```bash
git clone https://github.com/your-username/crossword-name-generator.git
cd crossword-name-generator
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

4. Visit the app in your browser:

```bash
http://localhost:3000
```


Enter names like:
ALLEN, ELEANOR, LENA, LEON

And get crossword-like overlapping grids, with navigation and image export!


