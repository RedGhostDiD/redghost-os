export const CODE_ALPHABET = ["1C", "55", "BD", "E9", "7A", "FF"];

export interface Cell {
  row: number;
  col: number;
}

export interface Daemon {
  name: string;
  sequence: string[];
}

export interface BreachPuzzle {
  gridSize: number;
  bufferSize: number;
  grid: string[][];
  daemons: Daemon[];
}

function randomCode() {
  return CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUnused(gridSize: number, used: Set<number>): number {
  const available = [...Array(gridSize).keys()].filter((n) => !used.has(n));
  const pick = available[Math.floor(Math.random() * available.length)];
  used.add(pick);
  return pick;
}

/**
 * Builds a guaranteed-solvable puzzle: a hidden path of `bufferSize` cells
 * that obeys the real Breach Protocol selection rule (start on row 0, then
 * alternate same-column / same-row picks) gets the "solution" codes; every
 * other cell is filled randomly. Daemons are contiguous slices of that
 * path's code sequence, so following the path in order clears them all.
 */
export function generatePuzzle(gridSize = 7, bufferSize = 6): BreachPuzzle {
  const usedRows = new Set<number>([0]);
  const usedCols = new Set<number>();

  const path: Cell[] = [];
  let curRow = 0;
  let curCol = pickUnused(gridSize, usedCols);
  path.push({ row: curRow, col: curCol });

  for (let i = 1; i < bufferSize; i++) {
    if (i % 2 === 1) {
      curRow = pickUnused(gridSize, usedRows);
    } else {
      curCol = pickUnused(gridSize, usedCols);
    }
    path.push({ row: curRow, col: curCol });
  }

  const pathCodes = path.map(() => randomCode());

  const grid: string[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, randomCode)
  );
  path.forEach((cell, i) => {
    grid[cell.row][cell.col] = pathCodes[i];
  });

  const daemons: Daemon[] = shuffle([
    { name: "DATAMINE_V1", sequence: pathCodes.slice(0, 2) },
    { name: "DATAMINE_V2", sequence: pathCodes.slice(2, 5) },
    { name: "DATAMINE_V3", sequence: pathCodes.slice(1, 5) },
  ]);

  return { gridSize, bufferSize, grid, daemons };
}

export function containsSubsequence(buffer: string[], sequence: string[]): boolean {
  if (sequence.length === 0 || buffer.length < sequence.length) return false;
  for (let start = 0; start <= buffer.length - sequence.length; start++) {
    let ok = true;
    for (let j = 0; j < sequence.length; j++) {
      if (buffer[start + j] !== sequence[j]) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}
