import {
  BASE_TILES_POSICION,
  ElocationScreen,
  TILE_MARGIN,
  TILE_SIZE,
  TILES_DISTRIBUTION,
} from "./constants";
import type {
  ICoordinateTile,
  TElocationScreen,
  TtilesPositions,
} from "../interfaces";

/**
 * Función que devuelve la posición x,y de una celda dada
 * la fila y la columna y la ubicación en el board
 * @param col
 * @param row
 * @param location
 * @returns
 */
export const getCoordinateByPosition = (
  col = 0,
  row = 0,
  location: TElocationScreen
) => {
  const BASE_Y =
    location === ElocationScreen.TOP
      ? BASE_TILES_POSICION.Y
      : BASE_TILES_POSICION.BOTTOM_Y;

  const x = BASE_TILES_POSICION.X + TILE_SIZE * col + TILE_MARGIN * col;
  const y = BASE_Y + TILE_SIZE * row + TILE_MARGIN * row;

  return { x, y };
};

/**
 * Calcula las posiciones de las celdas, dependiendo de la ubicación
 * @param location
 * @returns
 */
const generatePositions = (location: TElocationScreen) => {
  const coordinates: ICoordinateTile[][] = [];

  for (let col = 0; col < TILES_DISTRIBUTION.HORIZONTAL; col++) {
    coordinates[col] = [];

    for (let row = 0; row < TILES_DISTRIBUTION.VERTICAL; row++) {
      const { x, y } = getCoordinateByPosition(col, row, location);

      /**
       * Se añade un key para cuando se renderizan los tiles
       */
      coordinates[col][row] = { x, y, key: `${col}-${row}` };
    }
  }

  return coordinates;
};

/**
 * Calcula las posiciones de cada uno de los tiles
 * @returns
 */
export const tilesPositions = () => {
  const POSITIONS: TtilesPositions = {
    [ElocationScreen.TOP]: generatePositions(ElocationScreen.TOP),
    [ElocationScreen.BOTTOM]: generatePositions(ElocationScreen.BOTTOM),
  };

  return POSITIONS;
};
