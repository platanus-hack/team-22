import React, { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
  color?: string;
}

const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  color,
}: RippleProps) {
  return (
    <div
      className={cn(
        'pointer-events-auto absolute inset-0 -mt-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-48'
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.33;
        const animationDelay = `${i * 0.06}s`;

        return (
          <div
            key={i}
            className={` absolute ${className} rounded-full ${color} aspect-square w-auto hover:opacity-90 -z-20 border [--i:${i}]`}
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderWidth: '1px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1)',
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = 'Ripple';

export default Ripple;
