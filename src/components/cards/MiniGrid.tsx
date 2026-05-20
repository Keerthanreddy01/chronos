import { useMemo } from 'react';
import { useLifeStore } from '../../store/useLifeStore';
import { getWeekIndex } from '../../utils/weekUtils';

interface MiniGridProps {
  width?: number;
  className?: string;
}

const COLS = 52;
const ROWS = 90;
const DOT_RADIUS = 2; // 4px circles
const GAP = 2;
const CELL = DOT_RADIUS * 2 + GAP;

export function MiniGrid({ width = 260, className = '' }: MiniGridProps) {
  const { birthdate, settings } = useLifeStore();
  const lifespan = settings.lifespan;

  const currentWeekIndex = useMemo(() => {
    if (!birthdate) return -1;
    return getWeekIndex(new Date(birthdate), new Date());
  }, [birthdate]);

  const svgWidth = COLS * CELL - GAP;
  const svgHeight = ROWS * CELL - GAP;
  const maxWeeks = lifespan * COLS;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width={width}
      height={Math.round((width / svgWidth) * svgHeight)}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: ROWS }).map((_, row) =>
        Array.from({ length: COLS }).map((_, col) => {
          const weekIndex = row * COLS + col;
          const cx = col * CELL + DOT_RADIUS;
          const cy = row * CELL + DOT_RADIUS;
          const isCurrentWeek = weekIndex === currentWeekIndex;

          let fill = 'rgba(255, 255, 255, 0.08)';
          if (weekIndex < currentWeekIndex) {
            fill = '#c9a96e';
          } else if (isCurrentWeek) {
            fill = '#f5c542';
          }

          if (weekIndex > maxWeeks) {
            fill = 'rgba(0, 0, 0, 0.04)';
          }

          return (
            <circle
              key={`${row}-${col}`}
              cx={cx}
              cy={cy}
              r={DOT_RADIUS}
              fill={fill}
              className={isCurrentWeek ? 'mini-grid-current' : undefined}
            />
          );
        })
      )}
    </svg>
  );
}
