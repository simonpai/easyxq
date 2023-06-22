export default function Chalkboard({ children }) {
  // TODO: merge class names & attributes
  return (
    <div className="chalkboard">
      <div className="chalkboard__inner">
        { children }
      </div>
    </div>
  );
}