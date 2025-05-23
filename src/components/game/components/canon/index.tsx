import "./styles.css";
import { useEffect, useState } from "react";
import { useInterval } from "../../../../hooks";
import {
  BASE_CANON_POSICION,
  ElocationScreen,
  TIME_INTERVAL_CHRONOMETER,
} from "../../../../utils/constants";
import Smoke from "../smoke";
import type { TEBoardColor, TElocationScreen } from "../../../../interfaces";

interface CanonProps {
  color: TEBoardColor;
  locationScreen: TElocationScreen;
  showCanon: boolean;
  rotation: number;
  isAnimate: boolean;
  handleInterval: () => void;
}

/**
 * Renderiza el componente cañón el cual además tiene el temporizador del turno
 * @param param0
 * @returns
 */
const Canon = ({
  locationScreen = ElocationScreen.TOP,
  color,
  showCanon,
  rotation = 0,
  isAnimate = false,
  handleInterval,
}: CanonProps) => {
  /**
   * Valida si se está animando el cañón...
   */
  const animateCanon = showCanon && isAnimate;

  /**
   * Para el cronometro del turno
   */
  const [countdown, setCountdown] = useState({
    progress: 1,
    isRunning: false,
  });

  /**
   * Efecto que escucha si se indica que se ejecute el timer desde un elemento padre...
   */
  useEffect(
    () => setCountdown({ isRunning: showCanon, progress: 1 }),
    [showCanon, animateCanon]
  );

  /**
   * Ejecuta el cronomentro...
   */
  useInterval(
    () => {
      const newProgress = countdown.progress + 1;
      setCountdown({ ...countdown, progress: newProgress });

      /**
       * Si el progreso es de 100, quiere decir que ha terminado el couter...
       */
      if (newProgress === 100 || animateCanon) {
        /**
         * Se detiene el counter...
         */
        setCountdown({ ...countdown, isRunning: false });

        /**
         * Se Indica al componente padre que el tiempo ha terminado...
         */
        if (newProgress === 100) {
          handleInterval();
        }
      }
    },
    countdown.isRunning ? TIME_INTERVAL_CHRONOMETER : null
  );

  const className = `canon ${color.toLowerCase()} ${locationScreen.toLowerCase()} ${showCanon ? "show" : ""} ${animateCanon ? "animate" : ""}`;

  const style: React.CSSProperties = {
    left: BASE_CANON_POSICION.x,
    top:
      locationScreen === ElocationScreen.TOP
        ? BASE_CANON_POSICION.TOP_Y
        : BASE_CANON_POSICION.BOTTOM_Y,
  };

  const turretStyle: React.CSSProperties = {
    transform: `rotate(${rotation}deg)`,
  };

  /**
   * Estilo que se muestra para el cronometro
   */
  const styleCountdown = {
    "--progress": `${Math.round(360 * (countdown.progress / 100))}deg`,
  } as React.CSSProperties;

  return (
    <div className={className} style={style}>
      {animateCanon && (
        <Smoke size="180%" position={{ left: "-40%", top: "-40%" }} />
      )}
      <div className="canon-base" style={styleCountdown} />
      <div className="canon-turret" style={turretStyle}>
        <div className="canon-turret-container" />
      </div>
    </div>
  );
};

export default Canon;
