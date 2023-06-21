export default function Frame({ children }) {
  // TODO: merge class names & attributes
  return (
    <div className="frame">
      <div className="frame__inner">
        { children }
      </div>
    </div>
  );
}
