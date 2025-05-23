import "./styles.css";

const Counter = ({ value = 0 }: { value: number }) => (
  <div className="game-counter">
    <span key={value}>{value > 0 ? value : "GO!"}</span>
  </div>
);

export default Counter;
