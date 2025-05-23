import { PlayerId, RuneClient } from "rune-sdk";
import {
  EBoardColor,
  EConditionShip,
  ElocationScreen,
  EShipDirection,
  ESounds,
  ETileType,
} from "../utils/constants";

export type TElocationScreen = keyof typeof ElocationScreen;
export type TETileType = keyof typeof ETileType;
export type TEBoardColor = keyof typeof EBoardColor;
export type TEShipDirection = keyof typeof EShipDirection;
export type TEConditionShip = keyof typeof EConditionShip;
export type TColorDistribution = Record<TElocationScreen, TEBoardColor>;
export type TNumberShip = 1 | 2 | 3 | 4 | 5;
export type TTypeShips = Record<TNumberShip, number>;
export type TESounds = keyof typeof ESounds;

export interface Player {
  playerID: PlayerId;
  score: number;
  color: TEBoardColor;
  ships: IPositionShip[];
  isDiscovered: boolean;
}

export interface GameState {
  playerIds: PlayerId[];
  players: Player[];
  turnID: PlayerId;
  selectedCell: ICellsComplete;
  uncoverShip: boolean;
  numberShipUncover: TNumberShip;
  isGameOver: boolean;
}

// claimCell: (cellIndex: number) => void;
type GameActions = {
  onSelectCell: (cell: IPositionShipCells) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

export interface ICoordinate {
  x: number;
  y: number;
}

export interface ICoordinateTile extends ICoordinate {
  key: string;
}

export type TtilesPositions = Record<TElocationScreen, ICoordinateTile[][]>;

export interface IPositionShipCells {
  col: number;
  row: number;
}

export interface ICellsComplete extends IPositionShipCells {
  isDiscovered: boolean;
  tileType: TETileType;
}

export interface IPositionShip {
  numberShip: TNumberShip;
  origin: IPositionShipCells;
  cells: ICellsComplete[];
  direction: TEShipDirection;
  isDiscovered: boolean;
}

export type TuncoverShips = Record<TElocationScreen, TNumberShip[]>;

export type TUsedTiles = Record<TElocationScreen, ICellsComplete[]>;

// locationCanon: TElocationScreen;
//   locationTile: TElocationScreen;
export interface IShootBullet {
  isAnimate: boolean;
  positionBall: ICoordinate;
  canonTopRotation: number;
  canonBottomRotation: number;
  canonTopVisible: boolean;
  canonBottomVisible: boolean;
  selectedCell: ICellsComplete;
  uncoverShip: boolean;
  numberShipUncover: TNumberShip;
  usedTiles: TUsedTiles;
  uncoverShips: TuncoverShips;
  shipCells: IPositionShipCells[];
  isGameOver: boolean;
  shake: boolean;
}

export type Sounds = Record<TESounds, Howl>;
