export interface NodeType {
    row: number;
    col: number;
    isStart: boolean;
    isFinish: boolean;
    isWall: boolean;
    isVisited: boolean;
    isShortest: boolean;
  }