'use client';

import React from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  id?: string;
  name?: string;
  value?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  count?: number;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  count,
  className = '',
  disabled = false,
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={`${styles.check} ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.label}>
        <span>{label}</span>
        {typeof count === 'number' && (
          <span className={styles.count}>({count})</span>
        )}
      </span>
    </label>
  );
}
