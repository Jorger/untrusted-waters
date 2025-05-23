import { ElocationScreen, ETileType } from "../../../../utils/constants";
import { type TileProps } from "../tile";
import type {
  ICellsComplete,
  ICoordinateTile,
  IPositionShipCells,
  TColorDistribution,
  TUsedTiles,
} from "../../../../interfaces";

interface GetPropsTiles {
  coordinateTile: ICoordinateTile;
  index: number;
  col: number;
  row: number;
  usedTiles: TUsedTiles;
  colorDistribution: TColorDistribution;
  selectedCell: ICellsComplete;
  showBottomCanon: boolean;
  onClickTile: (cell: IPositionShipCells) => void;
}

/**
 * Se generan los props de los tiles,
 * dependiendo de si son de arriba o abajo,
 * sólo los tiles de arriba (TOP) tendrán eventos y por lo tanto
 * se va a renderizar un button, cuando ya no tiene eventos
 * se renderiza un div
 */
export const getPropsTiles = ({
  coordinateTile,
  index,
  col,
  row,
  usedTiles,
  colorDistribution,
  selectedCell,
  showBottomCanon,
  onClickTile,
}: GetPropsTiles) => {
  /**
   * Se extrae la coordenada del tile...
   */
  const { x, y } = coordinateTile;

  /**
   * Se determina la ubicación donde se renderizará el tile
   */
  const locationScreen =
    index === 0 ? ElocationScreen.TOP : ElocationScreen.BOTTOM;

  /**
   * Por defecto el tile es normal...
   */
  let tileType = ETileType.NORMAL;

  // Validar si es una celda seleccionada, ene ste caso si es un target
  if (col === selectedCell.col && row === selectedCell.row) {
    /**
     * Sólo se muestra el target si por ejemplo el cañónd e abajo está visible
     * se mostrará el target en la sección de arriba, en caso contrario se mostrará
     * abajo.
     */
    const showTarget =
      (showBottomCanon && locationScreen === ElocationScreen.TOP) ||
      (!showBottomCanon && locationScreen === ElocationScreen.BOTTOM);

    if (showTarget) {
      tileType = ETileType.TARGET;
    }
  }

  /**
   * Si no es de tipo de target, se valida si es una celda de destrucción
   * o si es una celda inválida.
   */
  if (tileType !== ETileType.TARGET) {
    const isUsedTile = usedTiles[locationScreen].find(
      (v) => v.col === col && v.row === row
    );

    if (isUsedTile) {
      tileType = isUsedTile.tileType as ETileType;
    }
  }

  const tileProps: TileProps = {
    coordinate: { x, y },
    locationScreen: index === 0 ? ElocationScreen.TOP : ElocationScreen.BOTTOM,
    tileType,
    color: colorDistribution[locationScreen],
  };

  /**
   * Por defecto sólo los primero tiles (arriba), tienen eventos
   * y por lo tanto se renderizará un botón (en el tile se valida si
   * además es de tipo NORMAL)
   */
  if (index === 0) {
    tileProps.onClick = onClickTile;
    tileProps.col = col;
    tileProps.row = row;
  }

  return tileProps;
};
