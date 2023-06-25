export default function Chalkboard({ children, className, ...props }) {
  return (
    <div className={className ? `chalkboard ${className}` : 'chalkboard'} { ...props }>
      <div className="chalkboard__inner">
        { children }
      </div>
    </div>
  );
}