import { useId } from "react";

import { cn } from "@/lib/utils";

interface LinePatternProps {
  width?: number;
  height?: number;
  y?: number;
  strokeDasharray?: string;
  className?: string;
  lineColor?: string;
  [key: string]: unknown;
}

export function LinePattern({
  width = 40,
  height = 20,
  y = -1,
  strokeDasharray = "0",
  className,
  lineColor = "currentColor",
  ...props
}: LinePatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-transparent",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width="100%"
          height={height}
          patternUnits="userSpaceOnUse"
          y={y}
        >
          <line
            x1="0"
            x2="100%"
            y1={height - 0.5}
            y2={height - 0.5}
            stroke={lineColor}
            strokeWidth="1"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
    </svg>
  );
}

export default LinePattern;
