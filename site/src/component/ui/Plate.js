export default function Plate({ children, onClose }) {
  // TODO: merge class names & attributes
  return (
    <div className="plate">
      {
        onClose && <div className="plate__close-btn" onClick={onClose} />
      }
      <div className="plate__ring">
        <div className="plate__inner">
          { children }
        </div>
      </div>
    </div>
  );
}
