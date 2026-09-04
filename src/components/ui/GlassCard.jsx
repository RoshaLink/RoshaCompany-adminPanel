import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GlassCard = ({ children, className = '', hover = true, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'glass-card rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl',
          hover && 'transition-all duration-300',
          onClick && 'cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
