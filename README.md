# GameCraft 2026 - Color36

## Participant / Team Name

Nirmal Swaminathan (UST ID: 253202)

## Team Type

INDIVIDUAL

## Game Name

Color36

## Brief Description

Color36 is an original, 60-second fast-paced visual reaction game built with React, TypeScript, and Vite. Players identify number or color targets, earn points for correct clicks, lose points for mistakes, and compete for a local Top 10 high score.

## Objective and Rules

- The objective is to score as many points as possible in exactly 60 seconds.
- A 6x6 grid of 36 tiles is shown, each tile with a random digit (0-9) and a random color (red, blue, green, or yellow).
- A target appears above the grid. It is either:
  - **NUMBER target**: click every tile showing the requested digit.
  - **COLOR target**: ignore the word itself and click every tile whose color matches the target's font color.
- Every clicked tile changes its digit and color.
- Completing every currently matching tile for the target generates the next target.
- The game automatically ends when the timer reaches 0 seconds.

## How to Play

1. Enter your player name (up to 10 characters) on the welcome screen.
2. Read the instructions modal and press **START GAME**.
3. Watch the target panel above the grid and click all matching tiles as fast as you can.
4. Keep completing targets until the 60-second timer runs out.
5. View your final score, stats, and the Top 10 leaderboard, then press replay to try again.

## Controls

- **Mouse / Trackpad**: click tiles on the grid to select them.
- **Touch**: tap tiles on touch-enabled devices.
- On-screen buttons are used for starting the game, viewing instructions, and replaying.

## Scoring Rules

- Correct tile click: **+1 point**
- Wrong tile click: **-1 point**
- Final score, correct clicks, incorrect clicks, and completed targets are shown at game over.
- Top 10 scores are saved locally in the browser (localStorage) leaderboard.

## Technologies Used

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/) for unit tests
- [ESLint](https://eslint.org/) for linting
- CSS (no UI framework)

## AI Tool Used and Its Contribution

- ChatGPT 
  1. to generate well-defined, optimized prompts.

- GitHub Copilot (agent mode in VS Code)
  1. to code and develop the entire project end-to-end.
  2. to write, run and validate tests.
  3. for secure coding practices and cybersecurity optimizations.


## Launch Instructions

Requires Node.js 20+ and npm.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
# Open the printed local URL (default: http://localhost:5173)

# Run tests
npm test

# Production build and preview
npm run build
npm run preview
```

## Browsers Tested

- Google Chrome (latest)
- Microsoft Edge (latest)
- Safari (latest)

## Known Limitations

- The leaderboard is stored in browser localStorage only, so scores are per-browser/per-device and are not shared online.
- Clearing browser data resets the leaderboard.
- No keyboard-only play for the tile grid; clicking/tapping is required.
- Designed for desktop and tablet screens; very small phone screens may feel cramped.

## Libraries and Asset Credits

- [React](https://react.dev/) and [React DOM](https://react.dev/) — MIT License
- [Vite](https://vite.dev/) — MIT License
- [Vitest](https://vitest.dev/) — MIT License
- [TypeScript](https://www.typescriptlang.org/) — Apache-2.0 License
- All visuals are rendered with plain CSS; no external images, fonts, or audio assets are used.