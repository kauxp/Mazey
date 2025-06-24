import { NodeType } from './type';

export const getStartNode = (grid: NodeType[][]): NodeType => {
    return grid.flat().find((node) => node.isStart)!;
  };
  
export const getFinishNode = (grid: NodeType[][]): NodeType => {
    return grid.flat().find((node) => node.isFinish)!;
  };
  
export const createInitialGrid = (
    rows: number,
    cols: number,
    startRow: number,
    startCol: number,
    finishRow: number,
    finishCol: number
  ): NodeType[][] => {
    const grid: NodeType[][] = [];
    for (let row = 0; row < rows; row++) {
      const currentRow: NodeType[] = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === startRow && col === startCol,
          isFinish: row === finishRow && col === finishCol,
          isWall: false,
          isVisited: false,
          isShortest: false,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  };
  
  