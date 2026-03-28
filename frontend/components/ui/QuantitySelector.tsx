"use client";

import { useState } from 'react';
import { Button } from './Button';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  size = 'md',
  className = ''
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'p-1',
      input: 'w-12 text-sm',
      icon: 'h-3 w-3'
    },
    md: {
      button: 'p-2',
      input: 'w-16 text-base',
      icon: 'h-4 w-4'
    },
    lg: {
      button: 'p-3',
      input: 'w-20 text-lg',
      icon: 'h-5 w-5'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center border border-gray-300 rounded-md ${disabled ? 'opacity-50' : ''} ${className}`}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={`${classes.button} rounded-none border-r`}
      >
        <Minus className={classes.icon} />
      </Button>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
        className={`${classes.input} text-center border-0 focus:ring-0 focus:outline-none`}
        min={min}
        max={max}
      />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={`${classes.button} rounded-none border-l`}
      >
        <Plus className={classes.icon} />
      </Button>
    </div>
  );
}
