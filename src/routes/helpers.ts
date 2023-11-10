export function calcRowColumnBlock(idx: number): {
  row: number;
  column: number;
  block: number;
} {
  const row = Math.floor(idx / 9) + 1;
  const column = (idx % 9) + 1;
  const block = (Math.floor(idx / 3) % 3) + Math.floor((row - 1) / 3) * 3 + 1;
  return { row, column, block };
}
