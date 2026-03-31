'use client';

import { useMemo } from 'react';
import type { SamplingItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface WeightChartProps {
  samplings: SamplingItem[];
}

export function WeightChart({ samplings }: WeightChartProps) {
  const data = useMemo(() => {
    return [...samplings].reverse(); // oldest first
  }, [samplings]);

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border bg-surface-card/50 text-sm text-text-muted">
        Se necesitan al menos 2 mediciones para ver el gráfico
      </div>
    );
  }

  const maxWeight = Math.max(...data.map((d) => d.weight_max_g));
  const minWeight = Math.min(...data.map((d) => d.weight_min_g));
  const range = maxWeight - minWeight || 1;

  const chartH = 200;
  const chartW = 600;
  const padX = 50;
  const padY = 30;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * innerW,
    yAvg: padY + innerH - ((d.weight_average_g - minWeight) / range) * innerH,
    yMin: padY + innerH - ((d.weight_min_g - minWeight) / range) * innerH,
    yMax: padY + innerH - ((d.weight_max_g - minWeight) / range) * innerH,
    ...d,
  }));

  // Area path (min to max)
  const areaPath =
    `M ${points.map((p) => `${p.x},${p.yMax}`).join(' L ')}` +
    ` L ${[...points].reverse().map((p) => `${p.x},${p.yMin}`).join(' L ')} Z`;

  // Average line
  const avgLine = `M ${points.map((p) => `${p.x},${p.yAvg}`).join(' L ')}`;

  // Y-axis labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const val = minWeight + (range * i) / ySteps;
    return {
      y: padY + innerH - (innerH * i) / ySteps,
      label: val.toFixed(0) + 'g',
    };
  });

  return (
    <div className="rounded-xl border border-border bg-surface-card p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold font-display text-text-secondary mb-4">
        Evolución de Peso
      </h3>
      <svg
        viewBox={`0 0 ${chartW} ${chartH}`}
        className="w-full min-w-[400px]"
        role="img"
        aria-label="Gráfico de evolución de peso"
      >
        {/* Grid lines */}
        {yLabels.map((yl, i) => (
          <g key={i}>
            <line
              x1={padX}
              y1={yl.y}
              x2={chartW - padX}
              y2={yl.y}
              stroke="var(--color-border)"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            <text
              x={padX - 8}
              y={yl.y + 3}
              textAnchor="end"
              fill="var(--color-text-muted)"
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              {yl.label}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={chartH - 5}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize="8"
            fontFamily="var(--font-mono)"
          >
            {formatDate(p.timestamps).slice(0, 6)}
          </text>
        ))}

        {/* Range area */}
        <path d={areaPath} fill="var(--color-lake-600)" opacity="0.12" />

        {/* Average line */}
        <path
          d={avgLine}
          fill="none"
          stroke="var(--color-lake-400)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.yAvg}
              r="4"
              fill="var(--color-lake-400)"
              stroke="var(--color-surface-card)"
              strokeWidth="2"
            />
            {/* Tooltip-like label */}
            <text
              x={p.x}
              y={p.yAvg - 10}
              textAnchor="middle"
              fill="var(--color-lake-300)"
              fontSize="9"
              fontWeight="600"
              fontFamily="var(--font-mono)"
            >
              {p.weight_average_g.toFixed(1)}g
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
