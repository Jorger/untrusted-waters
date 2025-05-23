import { getCoordinateByPosition } from "../../utils/tilesPositions";
import { PlayerId } from "rune-sdk";
import { randomNumber } from "../../utils/helpers";
import {
  BALL_SIZE,
  BASE_CANON_POSICION,
  ElocationScreen,
  ESounds,
  ETileType,
  INITIAL_SELECTED_CELL,
  INITIAL_SHOOT_BULLET,
  TILES_DISTRIBUTION,
} from "../../utils/constants";
import cloneDeep from "lodash.clonedeep";
import type {
  GameState,
  ICoordinate,
  IPositionShipCells,
  IShootBullet,
  Player,
  TElocationScreen,
  TUsedTiles,
} from "../../interfaces";
import { playSound } from "../../sounds";

/**
 * Determinar el orden en que se renderiza la información, lo
 * cual depende del indice del usuario en la seción...
 * @param players
 * @param yourPlayerId
 * @returns
 */
export const getOrderIndices = (players: Player[], yourPlayerId: PlayerId) => {
  if (players.length === 0) return [];

  return players[0].playerID === yourPlayerId ? [0, 1] : [1, 0];
};

/**
 * Calcular el angulo de rotación del cañón
 * @param cannonPos
 * @param tilePos
 * @returns
 */
export const getRotationAngle = (
  cannonPos: ICoordinate,
  tilePos: ICoordinate
) => {
  const dx = tilePos.x - cannonPos.x;
  const dy = tilePos.y - cannonPos.y;

  // atan2 devuelve el ángulo en radianes entre -PI y PI
  const radians = Math.atan2(dy, dx);

  // Convertimos a grados
  let degrees = radians * (180 / Math.PI);

  // Ajustamos para que 0° esté hacia la derecha y aumente en sentido horario (como en CSS)
  degrees = Math.round(degrees + 90); // 14

  return degrees;
};

interface SetBallCanon {
  location: TElocationScreen;
  setShootBullet: React.Dispatch<React.SetStateAction<IShootBullet>>;
}

/**
 * Establece la posición de la bala en el cañón...
 * @param param0
 */
export const setBallCanon = ({
  location = ElocationScreen.BOTTOM,
  setShootBullet,
}: SetBallCanon) => {
  setShootBullet(() => {
    const copyCurrent = cloneDeep(INITIAL_SHOOT_BULLET);

    const baseY =
      location === ElocationScreen.BOTTOM
        ? BASE_CANON_POSICION.BOTTOM_Y
        : BASE_CANON_POSICION.TOP_Y;

    const position: ICoordinate = {
      x: Math.round(BASE_CANON_POSICION.x + BALL_SIZE / 2),
      y: Math.round(baseY + BALL_SIZE / 2),
    };

    copyCurrent.positionBall = position;
    copyCurrent.isAnimate = false;

    return copyCurrent;
  });
};

interface setCannonsPositions {
  location: TElocationScreen;
  setShootBullet: React.Dispatch<React.SetStateAction<IShootBullet>>;
}

/**
 * Establecer la visibilidad de los cañones al terminar
 * el counter de inicio de juego
 * @param param0
 */
export const setCannonsPositions = ({
  location,
  setShootBullet,
}: setCannonsPositions) => {
  setShootBullet((current) => {
    const copyCurrent = cloneDeep(current);

    copyCurrent.canonTopVisible = location === ElocationScreen.TOP;
    copyCurrent.canonBottomVisible = location === ElocationScreen.BOTTOM;

    return copyCurrent;
  });
};

interface ValidateShootingBullet {
  game: GameState;
  yourPlayerId: PlayerId;
  setShootBullet: React.Dispatch<React.SetStateAction<IShootBullet>>;
}

/**
 * Realiza la validación cuando se selecciona la celda para lanzar la bola,
 * función que se llama cuando llega el evento del servicio (RUNE)
 * @param param0
 */
export const validateShootingBullet = ({
  game,
  yourPlayerId,
  setShootBullet,
}: ValidateShootingBullet) => {
  setShootBullet((current: IShootBullet) => {
    const {
      selectedCell,
      uncoverShip,
      numberShipUncover,
      turnID,
      players,
      playerIds,
    } = game;

    const copyCurrent = cloneDeep(current);

    const { canonBottomVisible } = copyCurrent;

    const tileLocation: TElocationScreen = canonBottomVisible
      ? ElocationScreen.TOP
      : ElocationScreen.BOTTOM;

    const tilePosition = getCoordinateByPosition(
      selectedCell.col,
      selectedCell.row,
      tileLocation
    );

    const canonBaseY = canonBottomVisible
      ? BASE_CANON_POSICION.BOTTOM_Y
      : BASE_CANON_POSICION.TOP_Y;

    const canonAngle = getRotationAngle(
      {
        x: BASE_CANON_POSICION.x,
        y: canonBaseY,
      },
      tilePosition
    );

    if (canonBottomVisible) {
      copyCurrent.canonBottomRotation = canonAngle;
    } else {
      copyCurrent.canonTopRotation = canonAngle;
    }

    copyCurrent.positionBall = {
      x: Math.round(tilePosition.x - BALL_SIZE * 0.28),
      y: Math.round(tilePosition.y - BALL_SIZE * 0.28),
    };

    copyCurrent.isAnimate = true;
    copyCurrent.selectedCell = selectedCell;
    copyCurrent.uncoverShip = uncoverShip;
    copyCurrent.numberShipUncover = numberShipUncover;
    copyCurrent.shipCells = [];
    copyCurrent.isGameOver = game.isGameOver;
    copyCurrent.shake = false;

    /**
     * Si se descubre un barco se debe obtener las celdas que lo contenían
     * para de estar forma eliminarlas en el dom
     */
    if (uncoverShip) {
      const currentPlayerIndex = playerIds.findIndex((v) => v === yourPlayerId);

      const indexShipPlayer =
        turnID === yourPlayerId
          ? currentPlayerIndex
          : currentPlayerIndex === 0
            ? 1
            : 0;

      const ship = players[indexShipPlayer].ships[numberShipUncover - 1];

      if (ship) {
        copyCurrent.shipCells = ship.cells.map(({ col, row }) => ({
          col,
          row,
        }));
      }
    }

    playSound(ESounds.FIRE);

    return copyCurrent;
  });
};

interface ValidaFinishesMoveBall {
  shootBullet: IShootBullet;
  setShootBullet: React.Dispatch<React.SetStateAction<IShootBullet>>;
}

/**
 * Valida cuando se ha termina la animación de la bola
 * @param param0
 */
export const validaFinishesMoveBall = ({
  shootBullet,
  setShootBullet,
}: ValidaFinishesMoveBall) => {
  const copyShootBullet = cloneDeep(shootBullet);

  const { canonBottomVisible, selectedCell } = copyShootBullet;
  const location = canonBottomVisible
    ? ElocationScreen.TOP
    : ElocationScreen.BOTTOM;

  copyShootBullet.usedTiles[location].push(selectedCell);

  if (selectedCell.tileType !== ETileType.DESTROYED) {
    copyShootBullet.canonBottomVisible = !copyShootBullet.canonBottomVisible;
    copyShootBullet.canonTopVisible = !copyShootBullet.canonTopVisible;
  }

  copyShootBullet.shake = selectedCell.tileType === ETileType.DESTROYED;

  playSound(
    selectedCell.tileType === ETileType.DESTROYED
      ? ESounds.EXPLODE
      : ESounds.WATER
  );

  /**
   * Validación cuando se destruye el barco
   */
  if (copyShootBullet.uncoverShip) {
    /**
     * Guarda el barco destruído para ser mostrado
     */
    copyShootBullet.uncoverShips[location].push(
      copyShootBullet.numberShipUncover
    );

    /**
     * Se establece el tipo de celdas ocultas donde estaba el barco,
     */
    for (const { col, row } of copyShootBullet.shipCells) {
      const index = copyShootBullet.usedTiles[location].findIndex(
        (v) => v.col === col && v.row === row
      );

      if (index >= 0) {
        /**
         * Se establece el tipo HIDE la cual hace que el elemento no se renderice
         */
        copyShootBullet.usedTiles[location][index].tileType = ETileType.HIDDEN;
      }
    }
  }

  /**
   * Reestablece la posición de la bola en el cañón que tenga
   * el turno
   */
  const baseY = copyShootBullet.canonBottomVisible
    ? BASE_CANON_POSICION.BOTTOM_Y
    : BASE_CANON_POSICION.TOP_Y;

  const position: ICoordinate = {
    x: Math.round(BASE_CANON_POSICION.x + BALL_SIZE / 2),
    y: Math.round(baseY + BALL_SIZE / 2),
  };

  copyShootBullet.positionBall = position;
  copyShootBullet.isAnimate = false;

  // Se reinicia la celda seleccioanda...
  copyShootBullet.selectedCell = INITIAL_SELECTED_CELL;

  /**
   * Se muestra el mensaje de game over (RUNE) y se ocutan los barcos
   */
  if (copyShootBullet.isGameOver) {
    copyShootBullet.canonBottomVisible = false;
    copyShootBullet.canonTopVisible = false;
    Rune.showGameOverPopUp();
  }

  setShootBullet(copyShootBullet);
};

/**
 * Obtiene una celda aleatoria para ser lanzada cuando el tiempo
 * del turno ha terminado
 * @param usedTiles
 * @returns
 */
export const makeRandomShot = (usedTiles: TUsedTiles): IPositionShipCells => {
  let col = -1;
  let row = -1;

  const discoveredSlides = usedTiles.TOP;

  do {
    col = randomNumber(0, TILES_DISTRIBUTION.HORIZONTAL - 1);
    row = randomNumber(0, TILES_DISTRIBUTION.VERTICAL - 1);

    const isDiscovered = discoveredSlides.findIndex(
      (v) => v.col === col && v.row === row
    );

    if (isDiscovered < 0) {
      break;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return { col, row };
};
