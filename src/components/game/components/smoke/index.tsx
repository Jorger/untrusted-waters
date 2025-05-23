import "./styles.css";

interface SmokeProps {
  withDelay?: boolean;
  size?: number | string;
  position?: {
    left: number | string;
    top: number | string;
  };
}

const Smoke = ({ size = 160, position, withDelay = true }: SmokeProps) => {
  const style: React.CSSProperties = { width: size, height: size };

  if (position) {
    style.left = position.left;
    style.top = position.top;
  }

  return <div className={`smoke ${withDelay ? "delay" : ""}`} style={style} />;
};

export default Smoke;
