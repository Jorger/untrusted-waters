import "./styles.css";
import React, { ReactNode } from "react";
import type { TColorDistribution, TEBoardColor } from "../../../../interfaces";

interface GridProps {
  colorDistribution: TColorDistribution;
  shake: boolean;
  currentColor: TEBoardColor;
  children: JSX.Element | JSX.Element[] | ReactNode;
}

/**
 * Renderiza la base del juego, además establece el color actual del fondo
 * dpendiendo del turno
 * @param param0
 * @returns
 */
const Grid = ({
  colorDistribution,
  shake,
  currentColor,
  children,
}: GridProps) => {
  const className = `game-grid ${colorDistribution.TOP.toLowerCase()} ${shake ? "shake" : ""} game-grid-color-${currentColor.toLowerCase()}`;

  return <div className={className}>{children}</div>;
};

export default React.memo(Grid);
