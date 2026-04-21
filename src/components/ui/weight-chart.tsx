'use client';

import { useMemo } from 'react';
import type { SamplingItem, WeightPredictionPoint } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface WeightChartProps {
  samplings: SamplingItem[];
  predictions?: WeightPredictionPoint[];
}

export function WeightChart({ samplings, predictions = [] }: WeightChartProps) {
  const data = useMemo(() => [...samplings].reverse(), [samplings]);

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border bg-surface-card/50 text-sm text-text-muted">
        Se necesitan al menos 2 mediciones para ver el gráfico
      </div>
    );
  }

  const chartH = 220;
  const chartW = 600;
  const padX = 50;
  const padY = 30;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;

  // Unified Y scale across real + predicted data
  const allMax = [
    ...data.map((d) => d.weight_max_g),
    ...predictions.map((p) => p.predicted_weight_max_g),
  ];
  const allMin = [
    ...data.map((d) => d.weight_min_g),
    ...predictions.map((p) => p.predicted_weight_min_g),
  ];
  const maxWeight = Math.max(...allMax);
  const minWeight = Math.min(...allMin);
  const range = maxWeight - minWeight || 1;

  // Total timeline: real samplings + predicted dates
  const realDates = data.map((d) => new Date(d.timestamps).getTime());
  const predDates = predictions.map((p) => new Date(p.predicted_date).getTime());
  const allDates = [...realDates, ...predDates];
  const timeMin = Math.min(...allDates);
  const timeMax = Math.max(...allDates);
  const timeRange = timeMax - timeMin || 1;

  const toX = (ts: number) => padX + ((ts - timeMin) / timeRange) * innerW;
  const toY = (w: number) => padY + innerH - ((w - minWeight) / range) * innerH;

  const realPoints = data.map((d) => ({
    x: toX(new Date(d.timestamps).getTime()),
    yAvg: toY(d.weight_average_g),
    yMin: toY(d.weight_min_g),
    yMax: toY(d.weight_max_g),
    ...d,
  }));

  const predPoints = predictions.map((p) => ({
    x: toX(new Date(p.predicted_date).getTime()),
    yAvg: toY(p.predicted_weight_avg_g),
    yMin: toY(p.predicted_weight_min_g),
    yMax: toY(p.predicted_weight_max_g),
    ...p,
  }));

  const areaPath =
    `M ${realPoints.map((p) => `${p.x},${p.yMax}`).join(' L ')}` +
    ` L ${[...realPoints].reverse().map((p) => `${p.x},${p.yMin}`).join(' L ')} Z`;

  const avgLine = `M ${realPoints.map((p) => `${p.x},${p.yAvg}`).join(' L ')}`;

  const predAreaPath =
    predPoints.length > 1
      ? `M ${predPoints.map((p) => `${p.x},${p.yMax}`).join(' L ')}` +
        ` L ${[...predPoints].reverse().map((p) => `${p.x},${p.yMin}`).join(' L ')} Z`
      : null;

  // Connect last real point to first prediction point
  const bridgeLine =
    realPoints.length > 0 && predPoints.length > 0
      ? `M ${realPoints[realPoints.length - 1].x},${realPoints[realPoints.length - 1].yAvg} L ${predPoints[0].x},${predPoints[0].yAvg}`
      : null;

  const predAvgLine =
    predPoints.length > 1
      ? `M ${predPoints.map((p) => `${p.x},${p.yAvg}`).join(' L ')}`
      : null;

  // Y-axis labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => ({
    y: padY + innerH - (innerH * i) / ySteps,
    label: (minWeight + (range * i) / ySteps).toFixed(0) + 'g',
  }));

  return (
    <div className="rounded-xl border border-border bg-surface-card p-5 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-display text-text-secondary">
          Evolución de Peso
        </h3>
        <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-[var(--color-lake-400)] rounded" />
            Histórico
          </span>
          {predictions.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 bg-[var(--color-trout-400)] rounded border-dashed border-t border-[var(--color-trout-400)]" />
              Predicción
            </span>
          )}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${chartW} ${chartH}`}
        className="w-full min-w-[400px]"
        role="img"
        aria-label="Gráfico de evolución de peso con predicciones"
      >
        {/* Grid lines */}
        {yLabels.map((yl, i) => (
          <g key={i}>
            <line
              x1={padX} y1={yl.y} x2={chartW - padX} y2={yl.y}
              stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4"
            />
            <text
              x={padX - 8} y={yl.y + 3}
              textAnchor="end" fill="var(--color-text-muted)"
              fontSize="9" fontFamily="var(--font-mono)"
            >
              {yl.label}
            </text>
          </g>
        ))}

        {/* X-axis labels — real samplings */}
        {realPoints.map((p, i) => (
          <text
            key={i} x={p.x} y={chartH - 5}
            textAnchor="middle" fill="var(--color-text-muted)"
            fontSize="8" fontFamily="var(--font-mono)"
          >
            {formatDate(p.timestamps).slice(0, 6)}
          </text>
        ))}

        {/* X-axis labels — predictions (every 2nd to avoid crowding) */}
        {predPoints.map((p, i) =>
          i % 2 === 0 ? (
            <text
              key={i} x={p.x} y={chartH - 5}
              textAnchor="middle" fill="var(--color-trout-500)"
              fontSize="8" fontFamily="var(--font-mono)"
            >
              {p.predicted_date.slice(5)}
            </text>
          ) : null,
        )}

        {/* Divider between real and predicted zone */}
        {realPoints.length > 0 && predPoints.length > 0 && (
          <line
            x1={realPoints[realPoints.length - 1].x}
            y1={padY}
            x2={realPoints[realPoints.length - 1].x}
            y2={padY + innerH}
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Real range area */}
        <path d={areaPath} fill="var(--color-lake-600)" opacity="0.12" />

        {/* Real average line */}
        <path
          d={avgLine} fill="none"
          stroke="var(--color-lake-400)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Real data points */}
        {realPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.yAvg} r="4"
              fill="var(--color-lake-400)" stroke="var(--color-surface-card)" strokeWidth="2"
            />
            <text
              x={p.x} y={p.yAvg - 10}
              textAnchor="middle" fill="var(--color-lake-300)"
              fontSize="9" fontWeight="600" fontFamily="var(--font-mono)"
            >
              {p.weight_average_g.toFixed(1)}g
            </text>
          </g>
        ))}

        {/* Prediction range area */}
        {predAreaPath && (
          <path d={predAreaPath} fill="var(--color-trout-500)" opacity="0.10" />
        )}

        {/* Bridge line connecting real → prediction */}
        {bridgeLine && (
          <path
            d={bridgeLine} fill="none"
            stroke="var(--color-trout-400)" strokeWidth="1.5"
            strokeDasharray="5 3" strokeLinecap="round"
          />
        )}

        {/* Prediction average line */}
        {predAvgLine && (
          <path
            d={predAvgLine} fill="none"
            stroke="var(--color-trout-400)" strokeWidth="2"
            strokeDasharray="6 3" strokeLinecap="round" strokeLinejoin="round"
          />
        )}

        {/* Prediction data points */}
        {predPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.yAvg} r="3.5"
              fill="var(--color-trout-400)" stroke="var(--color-surface-card)" strokeWidth="2"
            />
            <text
              x={p.x} y={p.yAvg - 10}
              textAnchor="middle" fill="var(--color-trout-300)"
              fontSize="9" fontWeight="600" fontFamily="var(--font-mono)"
            >
              {p.predicted_weight_avg_g.toFixed(1)}g
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
