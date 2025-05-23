import "./styles.css";
import {
  EBoardColor,
  ElocationScreen,
  ETileType,
} from "../../../../utils/constants";
import React from "react";
import Smoke from "../smoke";
import type {
  ICoordinate,
  IPositionShipCells,
  TEBoardColor,
  TElocationScreen,
  TETileType,
} from "../../../../interfaces";

export interface TileProps {
  coordinate: ICoordinate;
  locationScreen?: TElocationScreen;
  tileType: TETileType;
  color: TEBoardColor;
  col?: number;
  row?: number;
  onClick?: (cell: IPositionShipCells) => void;
}

/**
 * Renderiza una celda
 * @param param0
 * @returns
 */
const Tile = ({
  coordinate,
  locationScreen = ElocationScreen.BOTTOM,
  tileType = ETileType.NORMAL,
  color = EBoardColor.RED,
  col = 0,
  row = 0,
  onClick,
}: TileProps) => {
  // No se renderiza el tile
  if (tileType === ETileType.HIDDEN) {
    return;
  }

  /**
   * Calcula los estilos inline del tile
   */
  const style: React.CSSProperties = { left: coordinate.x, top: coordinate.y };

  /**
   * Calcula el nombre de la clase para el tile,
   * establece el color, la ubicación (para el z-index),
   * y el tipo de tile, el cual establece estilos personalizados
   */
  const className = `game-tile ${locationScreen.toLowerCase()} ${tileType.toLowerCase()} ${color.toLowerCase()}`;

  /**
   * Renderiza un botón si existe el evento onClick y además
   * que la celda sea de tipo NORMAL
   */
  if (onClick && tileType === ETileType.NORMAL) {
    return (
      <button
        className={className}
        style={style}
        onClick={() => onClick({ col, row })}
      />
    );
  }

  /**
   * Renderiza un div (sin eventos), además
   * renderiza el componente Smoke cuando el tile
   * ha sido tiene el tipo DESTROYED
   */
  return (
    <div className={className} style={style}>
      {tileType === ETileType.DESTROYED && (
        <Smoke
          size="300%"
          position={{ left: "-100%", top: "-100%" }}
          withDelay={false}
        />
      )}
    </div>
  );
};

export default React.memo(Tile);
