# OVERCOMING — tiny courage game

Run locally:

```bash
npm install
npm run dev
```

This is a small React + Vite + TypeScript project with a Phaser scene. The game is symbolic: enter a fear, select strengths, then watch your avatar jump over a visual obstacle that displays your fear. The scene always succeeds and fades to a reflection message.

Project layout:

- `src/components` — React screens and a wrapper that boots the Phaser scene
- `src/game/OvercomingScene.ts` — Phaser scene drawing simple pixel-esque shapes

Notes:

- The game uses simple shapes for pixel aesthetics to avoid copyrighted assets.
- To tweak colors or behavior, edit `src/game/OvercomingScene.ts` and the React components.
