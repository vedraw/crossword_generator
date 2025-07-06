const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getGridSize(words) {
  // Use a fixed grid size for all crosswords
  return 20;
}

function emptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(' '));
}

function canPlace(grid, word, x, y, dir, gridSize = grid.length) {
  const dx = dir === 'H' ? 1 : 0;
  const dy = dir === 'V' ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    const nx = x + i * dx, ny = y + i * dy;
    if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) return false;
    const cell = grid[ny][nx];
    if (cell !== ' ' && cell !== word[i]) return false;

    // Only check adjacency if not intersecting (cell is empty)
    if (cell === ' ') {
      if (dir === 'H') {
        if (
          (ny > 0 && grid[ny - 1][nx] !== ' ') ||
          (ny < gridSize - 1 && grid[ny + 1][nx] !== ' ')
        ) return false;
      } else {
        if (
          (nx > 0 && grid[ny][nx - 1] !== ' ') ||
          (nx < gridSize - 1 && grid[ny][nx + 1] !== ' ')
        ) return false;
      }
    }
  }
  // Check cells before and after the word to avoid touching other words
  const beforeX = x - dx, beforeY = y - dy;
  const afterX = x + dx * word.length, afterY = y + dy * word.length;
  if (
    beforeX >= 0 && beforeY >= 0 && beforeX < gridSize && beforeY < gridSize &&
    grid[beforeY][beforeX] !== ' '
  ) return false;
  if (
    afterX >= 0 && afterY >= 0 && afterX < gridSize && afterY < gridSize &&
    grid[afterY][afterX] !== ' '
  ) return false;
  return true;
}

function placeWord(grid, word, x, y, dir) {
  const dx = dir === 'H' ? 1 : 0;
  const dy = dir === 'V' ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    grid[y + i * dy][x + i * dx] = word[i];
  }
}

function permute(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  arr.forEach((el, i) => {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    permute(rest).forEach(p => result.push([el, ...p]));
  });
  return result;
}

function generateCrosswords(words) {
  const GRID_SIZE = getGridSize(words);
  const allLayouts = [];
  const permutations = permute(words);

  permutations.forEach(perm => {
    const grid = emptyGrid(GRID_SIZE);
    const placedWords = [];

    // place first word in the middle horizontally
    const startX = Math.floor((GRID_SIZE - perm[0].length) / 2);
    const startY = Math.floor(GRID_SIZE / 2);
    placeWord(grid, perm[0], startX, startY, 'H');
    placedWords.push({ word: perm[0], x: startX, y: startY, dir: 'H' });

    let success = true;

    for (let wi = 1; wi < perm.length; wi++) {
      const word = perm[wi];
      let placed = false;

      // try to intersect with already placed words
      for (const placedWord of placedWords) {
        const { word: pWord, x: px, y: py, dir: pDir } = placedWord;
        for (let i = 0; i < word.length && !placed; i++) {
          for (let j = 0; j < pWord.length && !placed; j++) {
            if (word[i] === pWord[j]) {
              const nx = pDir === 'H' ? px + j : px - i;
              const ny = pDir === 'H' ? py - i : py + j;
              const newDir = pDir === 'H' ? 'V' : 'H';
              if (canPlace(grid, word, nx, ny, newDir, GRID_SIZE)) {
                placeWord(grid, word, nx, ny, newDir);
                placedWords.push({ word, x: nx, y: ny, dir: newDir });
                placed = true;
              }
            }
          }
        }
      }

      if (!placed) {
        success = false;
        break;
      }
    }

    if (success) allLayouts.push(grid);
  });

  return allLayouts;
}

app.post('/generate', (req, res) => {
  const { names } = req.body;
  const cleanNames = names.map(n => n.trim().toUpperCase()).filter(n => n);
  console.log("Received names:", cleanNames);

  if (cleanNames.length < 2) {
    return res.status(400).json({ error: "Enter at least 2 names." });
  }

  const result = generateCrosswords(cleanNames);
  console.log("Generated layouts:", result.length);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
