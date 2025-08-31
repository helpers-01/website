interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function Tab({ label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-base font-medium transition-colors duration-200 
        ${isActive 
          ? 'border-b-2 border-purple-600 text-purple-600' 
          : 'text-gray-600 hover:text-purple-600'}`
      }
    >
      {label}
    </button>
  );
}
