export const Column: React.FC<{ className?: string }> = ({
  children,
  className,
}) => <div className={`column ${className || ""}`}>{children}</div>;
