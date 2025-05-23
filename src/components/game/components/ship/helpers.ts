import { CSSProperties } from "react";
import {
  TILE_MARGIN,
  TILE_SIZE,
  TYPE_SHIPS,
} from "../../../../utils/constants";
import type { TNumberShip } from "../../../../interfaces";

/**
 * Calcula el tamaño que tendrá el barco, dependiendo del níumero del mismo
 * y su size relacioando
 * @param numberShip
 * @returns
 */
export const getSizeShip = (numberShip: TNumberShip): CSSProperties => {
  const shipsize = TYPE_SHIPS[numberShip];

  const width = TILE_SIZE * shipsize + (shipsize - 1) * TILE_MARGIN;
  const height = TILE_SIZE;

  return { width, height };
};
