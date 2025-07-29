'use client';
import { Label, TextInput } from 'flowbite-react';
interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: any;
  error?: string;
  min?: number;
  step?: number;
}

const TextField = ({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  onChange,
  error,
  min,
  step,
}: TextFieldProps) => {
  return (
    <div>
      <Label htmlFor={name} value={label} />
      <TextInput
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextField;
