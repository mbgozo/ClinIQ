import React, { useState, useEffect, useCallback } from 'react';

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onValueChange: (value: string) => void;
  debounceMs?: number;
}

export function DebouncedInput({ 
  onValueChange, 
  debounceMs = 300, 
  value: controlledValue,
  ...inputProps 
}: DebouncedInputProps) {
  const [value, setValue] = useState(controlledValue || '');
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setValue(controlledValue || '');
  }, [controlledValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsDebouncing(true);
  }, []);

  useEffect(() => {
    if (isDebouncing) {
      const timer = setTimeout(() => {
        onValueChange(value);
        setIsDebouncing(false);
      }, debounceMs);

      return () => clearTimeout(timer);
    }
  }, [value, onValueChange, debounceMs, isDebouncing]);

  return (
    <div className="relative">
      <input
        {...inputProps}
        value={value}
        onChange={handleChange}
        className={`${inputProps.className || ''} ${isDebouncing ? 'opacity-70' : ''}`}
      />
      {isDebouncing && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-teal-600"></div>
        </div>
      )}
    </div>
  );
}
