import { PlayerId } from "rune-sdk";
import {
  GameState,
  ICellsComplete,
  IPositionShip,
  IPositionShipCells,
  Player,
  TEShipDirection,
  TNumberShip,
} from "../src/interfaces";
import { TTypeShips } from "./interfaces";

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

enum EBoardColor {
  BLUE = "BLUE",
  RED = "RED",
}

enum EShipDirection {
  HORIZONTAL = "HORIZONTAL",
  VERTICAL = "VERTICAL",
}

enum ETileType {
  NORMAL = "NORMAL",
  INVALID = "INVALID",
  DESTROYED = "DESTROYED",
  HIDDEN = "HIDDEN",
  TARGET = "TARGET",
}

const TILES_DISTRIBUTION = {
  HORIZONTAL: 9,
  VERTICAL: 7,
};

export const TYPE_SHIPS: TTypeShips = {
  "1": 5,
  "2": 4,
  "3": 3,
  "4": 3,
  "5": 2,
};

/**
 * Calcula el valor de la siguiente celda, dependiendo del las coordenas d eorigen
 * y su dirección
 * @param direction
 * @param origin
 * @param increase
 * @returns
 */
const calculateNewCell = (
  direction: TEShipDirection,
  origin: IPositionShipCells,
  increase: number
): IPositionShipCells => ({
  col: origin.col + (direction === EShipDirection.HORIZONTAL ? increase : 0),
  row: origin.row + (direction === EShipDirection.VERTICAL ? increase : 0),
});

/**
 * Calcula las celdas que están ocupadas por un barco
 * @param size
 * @param direction
 * @param origin
 * @returns
 */
const calculateCells = (
  size: number,
  direction: TEShipDirection,
  origin: IPositionShipCells
) => {
  const cells: ICellsComplete[] = [];

  for (let i = 0; i < size; i++) {
    const newCell = calculateNewCell(direction, origin, i);
    cells.push({ ...newCell, isDiscovered: false, tileType: ETileType.NORMAL });
  }

  return cells;
};

/**
 * Valida si una celda esta dentro del board...
 * @param cells
 * @returns
 */
const isInRange = (cells: IPositionShipCells) => {
  return (
    cells.col >= 0 &&
    cells.col < TILES_DISTRIBUTION.HORIZONTAL &&
    cells.row >= 0 &&
    cells.row < TILES_DISTRIBUTION.VERTICAL
  );
};

/**
 * Valida si la posición que se ha calculado para el barco es válida
 * bien por que no se sale del board y que no este un barco ya en esa posición.
 * @param size
 * @param positionShips
 * @param origin
 * @param direction
 * @returns
 */
const isPositionAvailable = (
  size: number,
  positionShips: IPositionShip[],
  origin: IPositionShipCells,
  direction: TEShipDirection
) => {
  for (let c = 0; c < size; c++) {
    const newCell = calculateNewCell(direction, origin, c);

    if (!isInRange(newCell)) {
      return false;
    }

    for (let i = 0; i < positionShips.length; i++) {
      const { cells } = positionShips[i];

      // Validar si la celda ya está ocuapada...
      const usedCell = cells.filter(
        (v) => v.col === newCell.col && v.row === newCell.row
      );

      if (usedCell.length > 0) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Genera las posiciones aleatorio de los barcos que para cada jugador
 * valida que no se salga del board y además que no quede una encima de otra
 * @param numberShip
 * @param positionShips
 * @returns
 */
const getPositionShip = (
  numberShip: TNumberShip,
  positionShips: IPositionShip[]
): IPositionShip => {
  const size = TYPE_SHIPS[numberShip];

  let direction: TEShipDirection;
  let origin: IPositionShipCells;

  /**
   * Obtiene la posición del barco y su dirección
   */
  do {
    direction =
      randomNumber(0, 1) === 1
        ? EShipDirection.HORIZONTAL
        : EShipDirection.VERTICAL;

    origin = {
      col: randomNumber(0, TILES_DISTRIBUTION.HORIZONTAL - 1),
      row: randomNumber(0, TILES_DISTRIBUTION.VERTICAL - 1),
    };

    if (isPositionAvailable(size, positionShips, origin, direction)) {
      break;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return {
    numberShip,
    origin,
    cells: calculateCells(size, direction, origin),
    direction,
    isDiscovered: false,
  };
};

/**
 * Función qie genera las posiciones aleatorias de los barcos...
 */
export const generateBoard = () => {
  const ships = Object.keys(TYPE_SHIPS).map((v) => +v);
  const positionShips: IPositionShip[] = [];

  for (let i = 0; i < ships.length; i++) {
    const numberShip = (i + 1) as TNumberShip;

    positionShips.push(getPositionShip(numberShip, positionShips));
  }

  return positionShips;
};

/**
 * Genera la data inicial del juego
 * @param allPlayerIds
 * @returns
 */
export const getPlayerData = (allPlayerIds: string[]): GameState => {
  const players: Player[] = [];
  const initialColor = randomNumber(0, 1);
  const colorPlayer1 = initialColor === 0 ? EBoardColor.BLUE : EBoardColor.RED;
  const colorPlayer2 = initialColor === 0 ? EBoardColor.RED : EBoardColor.BLUE;

  players.push(
    {
      playerID: allPlayerIds[0],
      score: 0,
      color: colorPlayer1,
      ships: generateBoard(),
      isDiscovered: false,
    },
    {
      playerID: allPlayerIds[1],
      score: 0,
      color: colorPlayer2,
      ships: generateBoard(),
      isDiscovered: false,
    }
  );

  const turnNumber = randomNumber(0, 1);
  const turnID = allPlayerIds[turnNumber];

  return {
    playerIds: allPlayerIds,
    players,
    turnID,
    uncoverShip: false,
    numberShipUncover: 1,
    isGameOver: false,
    selectedCell: {
      col: -1,
      row: -1,
      isDiscovered: false,
      tileType: ETileType.NORMAL,
    },
  };
};

interface ChangeGameState {
  cell: IPositionShipCells;
  game: GameState;
  playerId: PlayerId;
  allPlayerIds: PlayerId[];
}

/**
 * Función que se ejecuta cuando ha llegado un evento de lanzamiento de la bola
 * @param param0
 */
export const changeGameState = ({
  cell,
  game,
  playerId,
  allPlayerIds,
}: ChangeGameState) => {
  // Validar que la coordenada sa válida...
  if (!isInRange(cell)) {
    throw Rune.invalidAction();
  }

  // Traer las celdas del jugador contrario...
  const currentIndex = allPlayerIds.findIndex((v) => v === playerId);

  const selectedCell: ICellsComplete = {
    ...cell,
    isDiscovered: true,
    tileType: ETileType.INVALID,
  };

  const ships = game.players[currentIndex].ships;

  game.uncoverShip = false;

  let isValidShot = false;

  /**
   * Iterar los barcos para saber si se la celda seleccionada
   * está el barco
   */
  for (let i = 0; i < ships.length; i++) {
    const { cells, numberShip } = ships[i];

    for (let c = 0; c < cells.length; c++) {
      if (cells[c].col === cell.col && cells[c].row === cell.row) {
        game.players[currentIndex].ships[i].cells[c].isDiscovered = true;
        game.players[currentIndex].ships[i].cells[c].tileType =
          ETileType.DESTROYED;

        // Para el tile seleccionado, usado para la animación...
        selectedCell.tileType = ETileType.DESTROYED;

        isValidShot = true;
        break;
      }
    }

    if (isValidShot) {
      // Valida si ya se ha descubierto todo el barco...
      game.players[currentIndex].ships[i].isDiscovered = game.players[
        currentIndex
      ].ships[i].cells.every((v) => v.isDiscovered);

      // Se valida si ya se ha descubierto todo el barco
      // se debe establecer que los tiles deben ser no viisibles para que no
      // se rendericen...
      game.uncoverShip = game.players[currentIndex].ships[i].isDiscovered;

      if (game.uncoverShip) {
        game.numberShipUncover = numberShip;
      }

      break;
    }
  }

  if (!isValidShot) {
    const nextTurnID = allPlayerIds[currentIndex === 0 ? 1 : 0];
    game.turnID = nextTurnID;
  }

  game.selectedCell = selectedCell;

  // Saber si todos los barcos han sido descubiertos...
  const isGameOver = game.players[currentIndex].ships.every(
    (v) => v.isDiscovered
  );

  game.isGameOver = isGameOver;

  if (isGameOver) {
    /**
     * Determina el ganador y el perdedor
     */
    const winner = game.playerIds[currentIndex];
    const loser = game.playerIds[currentIndex === 0 ? 1 : 0];

    /**
     * Se establece delayPopUp para así poder controlar la visualización
     * del modal de game over
     */
    Rune.gameOver({
      players: {
        [winner]: "WON",
        [loser]: "LOST",
      },
      delayPopUp: true,
    });
  }
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => getPlayerData(allPlayerIds),
  actions: {
    onSelectCell: (cell, { game, playerId, allPlayerIds }) =>
      changeGameState({ cell, game, playerId, allPlayerIds }),
  },
});
