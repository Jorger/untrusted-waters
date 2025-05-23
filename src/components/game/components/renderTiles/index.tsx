import { getPropsTiles } from "./helpers";
import { PlayerId } from "rune-sdk";
import { Tile } from "..";
import { tilesPositions } from "../../../../utils/tilesPositions";
import React from "react";
import type {
  ICellsComplete,
  IPositionShipCells,
  TColorDistribution,
  TUsedTiles,
} from "../../../../interfaces";

/**
 * Obtiene las posiciones de cada tile..
 */
const POSITIONS = tilesPositions();

interface RenderTilesProps {
  onClickTile: (cell: IPositionShipCells) => void;
  colorDistribution: TColorDistribution;
  usedTiles: TUsedTiles;
  selectedCell: ICellsComplete;
  showBottomCanon: boolean;
  yourPlayerId?: PlayerId;
}

/**
 * Renderiza el listado de celdas de cada juegador
 * @param param0
 * @returns
 */
const RenderTiles = ({
  usedTiles,
  colorDistribution,
  selectedCell,
  showBottomCanon,
  onClickTile,
}: RenderTilesProps) => (
  <React.Fragment>
    {[POSITIONS.TOP, POSITIONS.BOTTOM].map((position, index) =>
      position.map((col, indexCol) =>
        col.map((coordinateTile, indexRow) => {
          /**
           * Se calculan los props para los tiles,
           * en este caso se valida el tipo de tile
           * y si se agrega o no el evento click (onClickTile)
           */
          const tileProps = getPropsTiles({
            coordinateTile,
            index,
            col: indexCol,
            row: indexRow,
            usedTiles,
            colorDistribution,
            selectedCell,
            showBottomCanon,
            onClickTile,
          });

          return <Tile {...tileProps} key={coordinateTile.key} />;
        })
      )
    )}
  </React.Fragment>
);

export default React.memo(RenderTiles);
