import "./styles.css";
import { getSizeShip } from "./helpers";
import {
  EBoardColor,
  EConditionShip,
  EShipDirection,
} from "../../../../utils/constants";
import React from "react";
import type {
  ICoordinate,
  TEBoardColor,
  TEConditionShip,
  TEShipDirection,
  TNumberShip,
} from "../../../../interfaces";

interface ShipProps {
  color: TEBoardColor;
  coordinate: ICoordinate;
  direction: TEShipDirection;
  numberShip: TNumberShip;
  condition?: TEConditionShip;
}

/**
 * Renderiza los barcos
 * @param param0
 * @returns
 */
const Ship = ({
  coordinate,
  direction = EShipDirection.HORIZONTAL,
  color = EBoardColor.BLUE,
  numberShip = 1,
  condition = EConditionShip.NORMAL,
}: ShipProps) => {
  const { width, height } = getSizeShip(numberShip);
  const style: React.CSSProperties = {
    left: coordinate.x,
    top: coordinate.y,
    width,
    height,
  };

  const className = `ship ship-${numberShip} ${direction.toLowerCase()} ${color.toLowerCase()} ${condition.toLowerCase()}`;

  return <div className={className} style={style} />;
};

export default React.memo(Ship);
