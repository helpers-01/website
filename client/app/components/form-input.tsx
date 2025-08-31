interface FormInputProps {
  id: string;
  label: string;
  type: 'email' | 'password' | 'tel' | 'text';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormInput({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  error, 
  required = true,
  placeholder 
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={`w-full min-h-[44px] px-4 py-2 rounded-lg border 
          ${error ? 'border-red-300' : 'border-gray-300'}
          focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none
          placeholder:text-gray-400 text-gray-900`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
