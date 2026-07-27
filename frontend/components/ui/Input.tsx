import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label ? <label htmlFor={inputId} className="form-label">{label}</label> : null}
      <div className="input-wrapper">
        {leftIcon ? <span className="input-icon-left">{leftIcon}</span> : null}
        <input id={inputId} className={`input ${error ? 'input-error' : ''} ${className}`} {...props} />
        {rightIcon ? <span className="input-icon-right">{rightIcon}</span> : null}
      </div>
      {error ? <span className="form-error">{error}</span> : helperText ? <span className="form-helper">{helperText}</span> : null}
    </div>
  );
};
