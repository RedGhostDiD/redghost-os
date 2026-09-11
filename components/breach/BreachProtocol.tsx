"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from "@/lib/audio";
import { generatePuzzle, containsSubsequence, type Cell, type BreachPuzzle } from "@/lib/breach";

const TOTAL_TIME = 45;

type Axis = "row" | "col";
interface Constraint {
  axis: Axis;
  index: number;
}
type Phase = "playing" | "ended";

function cellKey(c: Cell) {
  return `${c.row}:${c.col}`;
}

export default function BreachProtocol() {
  const [version, setVersion] = useState(0);
  const [puzzle, setPuzzle] = useState<BreachPuzzle | null>(null);

  // Puzzle uses Math.random() — generate it only after mount so the
  // server-rendered markup and the first client render always match.
  useEffect(() => {
    setPuzzle(generatePuzzle());
  }, [version]);

  if (!puzzle) {
    return (
      <div
        className="text-xs tracking-[0.2em] text-center py-10"
        style={{ color: "var(--rg-text-faint)" }}
      >
        INITIALIZING MATRIX...
      </div>
    );
  }

  return <BreachGame key={version} puzzle={puzzle} onRetry={() => setVersion((v) => v + 1)} />;
}

function BreachGame({ puzzle, onRetry }: { puzzle: BreachPuzzle; onRetry: () => void }) {
  const { play } = useAudio();
  const [selected, setSelected] = useState<Cell[]>([]);
  const [constraint, setConstraint] = useState<Constraint>({ axis: "row", index: 0 });
  const [doneDaemons, setDoneDaemons] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState<Phase>("playing");
  const endedRef = useRef(false);

  const buffer = useMemo(
    () => selected.map((c) => puzzle.grid[c.row][c.col]),
    [selected, puzzle]
  );

  const selectedKeys = useMemo(() => new Set(selected.map(cellKey)), [selected]);

  const finishGame = useCallback(
    (won: boolean) => {
      if (endedRef.current) return;
      endedRef.current = true;
      setPhase("ended");
      play(won ? "game-success" : "game-fail");
    },
    [play]
  );

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      finishGame(doneDaemons.size === puzzle.daemons.length);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, doneDaemons.size, puzzle.daemons.length, finishGame]);

  const isSelectable = useCallback(
    (cell: Cell) => {
      if (phase !== "playing") return false;
      if (selectedKeys.has(cellKey(cell))) return false;
      return constraint.axis === "row" ? cell.row === constraint.index : cell.col === constraint.index;
    },
    [phase, selectedKeys, constraint]
  );

  const pickCell = (cell: Cell) => {
    if (!isSelectable(cell)) return;

    const nextSelected = [...selected, cell];
    setSelected(nextSelected);
    play("game-select");
    setConstraint(
      constraint.axis === "row" ? { axis: "col", index: cell.col } : { axis: "row", index: cell.row }
    );

    const nextBuffer = nextSelected.map((c) => puzzle.grid[c.row][c.col]);
    const nextDone = new Set(doneDaemons);
    let changed = false;
    for (const daemon of puzzle.daemons) {
      if (!nextDone.has(daemon.name) && containsSubsequence(nextBuffer, daemon.sequence)) {
        nextDone.add(daemon.name);
        changed = true;
      }
    }
    if (changed) {
      setDoneDaemons(nextDone);
      if (nextDone.size === puzzle.daemons.length) {
        setTimeout(() => finishGame(true), 150);
        return;
      }
    }

    if (nextSelected.length === puzzle.bufferSize) {
      setTimeout(() => finishGame(nextDone.size === puzzle.daemons.length), 150);
    }
  };

  const upload = () => {
    if (phase !== "playing" || selected.length === 0) return;
    finishGame(doneDaemons.size === puzzle.daemons.length);
  };

  const allDone = doneDaemons.size === puzzle.daemons.length;
  const timeCritical = timeLeft <= 10 && phase === "playing";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between text-[10px] tracking-[0.15em] mb-1.5">
          <span style={{ color: "var(--rg-text-faint)" }}>BREACH TIME REMAINING</span>
          <span
            style={{
              color: timeCritical ? "var(--rg-red)" : "var(--rg-red)",
              textShadow: timeCritical
                ? "0 0 8px rgba(255, 22, 61,0.7)"
                : "0 0 8px rgba(255, 22, 61,0.5)",
            }}
          >
            {String(timeLeft).padStart(2, "0")}s
          </span>
        </div>
        <div className="h-1 w-full" style={{ background: "rgba(255, 22, 61,0.12)" }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${(timeLeft / TOTAL_TIME) * 100}%`,
              background: timeCritical ? "var(--rg-red)" : "var(--rg-red)",
              boxShadow: `0 0 8px ${timeCritical ? "var(--rg-red)" : "var(--rg-red)"}`,
            }}
          />
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.15em] mb-1.5" style={{ color: "var(--rg-text-faint)" }}>
          BUFFER
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: puzzle.bufferSize }).map((_, i) => {
            const code = buffer[i];
            return (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center text-xs border font-semibold"
                style={{
                  borderColor: code ? "var(--rg-red)" : "rgba(255, 22, 61,0.2)",
                  color: code ? "var(--rg-red)" : "var(--rg-text-faint)",
                  boxShadow: code ? "0 0 10px rgba(255, 22, 61,0.35)" : "none",
                  background: code ? "rgba(255, 22, 61,0.06)" : "transparent",
                }}
              >
                {code ?? ""}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-[auto_1fr] gap-5">
        <div>
          <p className="text-[10px] tracking-[0.15em] mb-1.5" style={{ color: "var(--rg-text-faint)" }}>
            CODE MATRIX
          </p>
          <div
            className="inline-grid gap-1"
            style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
          >
            {puzzle.grid.map((row, r) =>
              row.map((code, c) => {
                const cell = { row: r, col: c };
                const key = cellKey(cell);
                const used = selectedKeys.has(key);
                const orderIndex = used ? selected.findIndex((s) => cellKey(s) === key) + 1 : 0;
                const selectable = isSelectable(cell);
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!selectable}
                    onClick={() => pickCell(cell)}
                    data-cell={key}
                    data-code={code}
                    className="w-10 h-10 text-xs font-semibold border flex items-center justify-center relative transition-colors"
                    style={{
                      borderColor: used
                        ? "var(--rg-red)"
                        : selectable
                        ? "rgba(255, 22, 61,0.5)"
                        : "rgba(255, 22, 61,0.18)",
                      color: used ? "var(--rg-red)" : selectable ? "var(--rg-text)" : "var(--rg-text-faint)",
                      background: used ? "rgba(255, 22, 61,0.12)" : "transparent",
                      boxShadow: used ? "0 0 10px rgba(255, 22, 61,0.35)" : "none",
                      cursor: selectable ? "pointer" : "default",
                      opacity: selectable || used ? 1 : 0.45,
                    }}
                  >
                    {code}
                    {used && (
                      <span
                        className="absolute -top-1.5 -right-1.5 text-[8px] w-3.5 h-3.5 flex items-center justify-center border"
                        style={{
                          borderColor: "var(--rg-red)",
                          color: "var(--rg-red)",
                          background: "var(--rg-void)",
                        }}
                      >
                        {orderIndex}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {phase === "playing" ? (
              <button
                type="button"
                onClick={upload}
                disabled={selected.length === 0}
                className="rg-action-link text-[10px] tracking-[0.15em] border px-3 py-1.5 disabled:opacity-30"
              >
                [ UPLOAD ]
              </button>
            ) : (
              <button
                type="button"
                onClick={onRetry}
                className="rg-action-link text-[10px] tracking-[0.15em] border px-3 py-1.5"
              >
                [ RETRY ]
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.15em] mb-1.5" style={{ color: "var(--rg-text-faint)" }}>
            SEQUENCE REQUIRED TO UPLOAD
          </p>
          <div className="flex flex-col gap-2">
            {puzzle.daemons.map((daemon) => {
              const done = doneDaemons.has(daemon.name);
              const failed = phase === "ended" && !done;
              const tone = done ? "var(--rg-green)" : failed ? "var(--rg-red)" : "var(--rg-text-dim)";
              return (
                <div
                  key={daemon.name}
                  data-daemon={daemon.name}
                  data-daemon-status={done ? "done" : failed ? "failed" : "pending"}
                  className="border px-3 py-2"
                  style={{
                    borderColor: done
                      ? "rgba(51,224,138,0.4)"
                      : failed
                      ? "rgba(255, 22, 61,0.45)"
                      : "rgba(255, 22, 61,0.25)",
                    background: failed ? "rgba(255, 22, 61,0.08)" : "transparent",
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] tracking-[0.12em] mb-1.5">
                    <span style={{ color: tone }}>{daemon.name}</span>
                    <span style={{ color: tone }}>
                      {done ? "COMPLETE" : failed ? "FAILED" : "PENDING"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {daemon.sequence.map((code, i) => (
                      <span
                        key={i}
                        data-seq-code={code}
                        className="w-7 h-7 flex items-center justify-center text-[10px] border"
                        style={{
                          borderColor: done ? "rgba(51,224,138,0.5)" : "rgba(255, 22, 61,0.3)",
                          color: done ? "var(--rg-green)" : "var(--rg-red)",
                        }}
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {phase === "ended" && (
            <div
              data-result={allDone ? "success" : "failure"}
              className="mt-4 px-3 py-2 border text-[11px] tracking-[0.15em]"
              style={{
                borderColor: allDone ? "rgba(51,224,138,0.5)" : "rgba(255, 22, 61,0.5)",
                color: allDone ? "var(--rg-green)" : "var(--rg-red)",
                textShadow: allDone
                  ? "0 0 8px rgba(51,224,138,0.5)"
                  : "0 0 8px rgba(255, 22, 61,0.5)",
              }}
            >
              {allDone ? "BREACH SUCCESSFUL" : "BREACH FAILED"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
