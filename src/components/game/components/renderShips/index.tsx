import { EConditionShip, ElocationScreen } from "../../../../utils/constants";
import { getCoordinateByPosition } from "../../../../utils/tilesPositions";
import { PlayerId } from "rune-sdk";
import { Ship } from "..";
import React from "react";
import type { Player, TuncoverShips } from "../../../../interfaces";

interface RenderShipsProps {
  orderIndices: number[];
  uncoverShips: TuncoverShips;
  players: Player[];
  yourPlayerId?: PlayerId;
}

/**
 * Renderiza los barcos en el board de cada jugador.
 * para el jugador actual muestra el board, además muestra
 * el barco cuando ha sido destruido
 * @param param0
 * @returns
 */
const RenderShips = ({
  orderIndices,
  players,
  uncoverShips,
}: RenderShipsProps) => {
  return orderIndices.map((index, key) => (
    <React.Fragment key={index}>
      {players[index].ships.map(({ numberShip, direction, origin }) => {
        const location =
          key === 0 ? ElocationScreen.TOP : ElocationScreen.BOTTOM;

        const isDiscovered = uncoverShips[location].includes(numberShip);
        // Mostrar por defecto los barcos de abajo
        const showShip = location === ElocationScreen.BOTTOM;
        // Validar el tipo de condición en que se encuentra el barco
        const condition = isDiscovered
          ? EConditionShip.DESTROYED
          : EConditionShip.FURTIVE;

        /**
         * Sólo renderiza el barco si son los barcos de abajo ó si el barco
         * ha sido descrubierto
         */
        return (
          (showShip || isDiscovered) && (
            <Ship
              key={numberShip}
              color={players[index].color}
              condition={condition}
              coordinate={getCoordinateByPosition(
                origin.col,
                origin.row,
                location
              )}
              {...{ numberShip, direction }}
            />
          )
        );
      })}
    </React.Fragment>
  ));
};

export default React.memo(RenderShips);
