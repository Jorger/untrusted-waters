import "./styles.css";
import { ElocationScreen, TYPE_SHIPS } from "../../../../utils/constants";
import React from "react";
import type {
  TColorDistribution,
  TNumberShip,
  TuncoverShips,
} from "../../../../interfaces";

interface PreviewShipsProps {
  colorDistribution: TColorDistribution;
  uncoverShips: TuncoverShips;
}

/**
 * Componente que renderiza la vista previa de los barcos,
 * además de indicar que barcos se han destruido
 * @param param0
 * @returns
 */
const PreviewShips = ({
  colorDistribution,
  uncoverShips,
}: PreviewShipsProps) => (
  <div className="preview-ships">
    {[colorDistribution.TOP, colorDistribution.BOTTOM].map((color, index) => {
      const location =
        index === 0 ? ElocationScreen.TOP : ElocationScreen.BOTTOM;

      const classNameLocation = `preview-ships-${location.toLowerCase()} ${color.toLowerCase()}`;

      return (
        <div key={color} className={classNameLocation}>
          {Object.keys(TYPE_SHIPS).map((value) => {
            const integerValue = +value;
            const numberShip = (index === 0
              ? integerValue
              : 6 - integerValue) as unknown as TNumberShip;

            const isDiscovered = uncoverShips[location].includes(numberShip);
            const classNamePreview = `preview-ships-base preview-ships-${numberShip} ${isDiscovered ? "destroyed" : ""}`;

            return <div className={classNamePreview} key={numberShip} />;
          })}
        </div>
      );
    })}
  </div>
);

export default React.memo(PreviewShips);
