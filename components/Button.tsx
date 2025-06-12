const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-max p-3 px-5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
    >
      {children}
    </button>
  );
};

export default Button;
