import "./styles.css";
import { forwardRef, ForwardedRef } from "react";
import type { ICoordinate } from "../../../../interfaces";

interface BallProps {
  coordinate: ICoordinate;
  isAnimate: boolean;
}

/**
 * Renderiza la bola, además establece un ref el cual
 * sirve para validar si la animación ha terminado...
 */
const Ball = forwardRef(
  (
    { coordinate, isAnimate = false }: BallProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const style: React.CSSProperties = {
      transform: `translate(${coordinate.x}px, ${coordinate.y}px)`,
    };

    const className = `ball ${isAnimate ? "animate" : ""}`;

    return (
      <div style={style} className={className} ref={ref}>
        <div className="ball-element" />
      </div>
    );
  }
);

Ball.displayName = "Ball";

export default Ball;
