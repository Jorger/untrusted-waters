import type { ICellsComplete, IShootBullet, TTypeShips } from "../interfaces";

export const BASE_HEIGHT = 732;
export const BASE_WIDTH = 412;
export const TILE_GAP = 7;
export const TILE_MARGIN = 4;
export const BALL_SIZE = 80;
export const BALL_SPEED = 600;
export const TIME_INTERVAL_CHRONOMETER = 50;
export const TIME_COUNTDOWN = 500;
export const INITIAL_COUNTER_TIMER = { value: 3, start: false };

export const TILES_DISTRIBUTION = {
  HORIZONTAL: 9,
  VERTICAL: 7,
};

export const TILE_SIZE = Math.round(
  BASE_WIDTH / TILES_DISTRIBUTION.HORIZONTAL - TILE_GAP
);

export enum EBoardColor {
  BLUE = "BLUE",
  RED = "RED",
}

export enum ElocationScreen {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

export enum ETileType {
  NORMAL = "NORMAL",
  INVALID = "INVALID",
  DESTROYED = "DESTROYED",
  HIDDEN = "HIDDEN",
  TARGET = "TARGET",
}

export enum EConditionShip {
  NORMAL = "NORMAL",
  FURTIVE = "FURTIVE",
  DESTROYED = "DESTROYED",
}

export enum EShipDirection {
  HORIZONTAL = "HORIZONTAL",
  VERTICAL = "VERTICAL",
}

export enum ESounds {
  EXPLODE = "EXPLODE",
  WATER = "WATER",
  FIRE = "FIRE",
}

export const BASE_TILES_POSICION = {
  X: 15,
  Y: 25,
  BOTTOM_Y: 410,
};

export const BASE_CANON_POSICION = {
  x: Math.round(BASE_WIDTH * 0.3),
  TOP_Y: 40,
  BOTTOM_Y: 530,
};

export const TYPE_SHIPS: TTypeShips = {
  "1": 5,
  "2": 4,
  "3": 3,
  "4": 3,
  "5": 2,
};

export const INITIAL_SELECTED_CELL: ICellsComplete = {
  col: -1,
  row: -1,
  isDiscovered: false,
  tileType: ETileType.NORMAL,
};

export const INITIAL_SHOOT_BULLET: IShootBullet = {
  isAnimate: false,
  positionBall: { x: 0, y: 0 },
  canonTopRotation: 180,
  canonBottomRotation: 0,
  canonTopVisible: false,
  canonBottomVisible: false,
  selectedCell: INITIAL_SELECTED_CELL,
  uncoverShip: false,
  numberShipUncover: 1,
  isGameOver: false,
  shake: false,
  usedTiles: {
    TOP: [],
    BOTTOM: [],
  },
  uncoverShips: {
    TOP: [],
    BOTTOM: [],
  },
  shipCells: [],
};

document.documentElement.style.setProperty("--base-height", `${BASE_HEIGHT}px`);
document.documentElement.style.setProperty("--base-width", `${BASE_WIDTH}px`);
document.documentElement.style.setProperty("--tile-size", `${TILE_SIZE}px`);
document.documentElement.style.setProperty("--ball-size", `${BALL_SIZE}px`);
document.documentElement.style.setProperty("--ball-speed", `${BALL_SPEED}ms`);
