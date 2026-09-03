import React, { useState } from 'react';

const SLICE_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#eab308'  // Yellow
];

export default function PieChart({ stats = {}, options = [], total = 0, isCompact = false }) {
  const [hoveredOpt, setHoveredOpt] = useState(null);

  // Normalize options entries
  const optionKeys = options.length > 0 
    ? options.map((_, i) => String.fromCharCode(65 + i))
    : Object.keys(stats).sort();

  const totalVotes = total > 0 ? total : Object.values(stats).reduce((a, b) => a + b, 0);

  // Calculate slice geometry
  let currentAngle = 0;
  const slices = optionKeys.map((key, idx) => {
    const count = stats[key] || 0;
    const pct = totalVotes > 0 ? count / totalVotes : 0;
    const angleSpan = pct * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    if (count > 0) {
      currentAngle = endAngle;
    }
    const color = SLICE_COLORS[idx % SLICE_COLORS.length];

    // Clean option label: remove redundant "Option A:", "A. ", "A - ", etc.
    const rawLabel = options[idx] !== undefined && options[idx] !== '' ? options[idx] : `選項 ${key}`;
    const cleanedLabel = String(rawLabel).replace(/^(Option\s+[A-Z][:.\-\s]*|[A-Z][:.\-]\s*)/i, '').trim() || String(rawLabel);

    return {
      key,
      count,
      pct,
      startAngle,
      endAngle,
      angleSpan,
      color,
      label: cleanedLabel
    };
  });

  const activeSlices = slices.filter(s => s.count > 0);

  // Coordinate helper: 0 deg is top (12 o'clock)
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const cx = 120;
  const cy = 120;
  const outerR = isCompact ? 80 : 95;
  const innerR = isCompact ? 46 : 54;

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: isCompact ? '1.25rem' : '1.75rem',
        width: '100%',
        padding: isCompact ? '0.5rem 0' : '0.75rem 0'
      }}
    >
      {/* 1. Donut Pie Chart */}
      <div style={{ position: 'relative', width: isCompact ? '180px' : '220px', height: isCompact ? '180px' : '220px', flexShrink: 0 }}>
        <svg 
          viewBox="0 0 240 240" 
          style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }}
        >
          {totalVotes === 0 ? (
            /* Empty state placeholder ring */
            <circle 
              cx={cx} 
              cy={cy} 
              r={outerR} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.08)" 
              strokeWidth="20" 
              strokeDasharray="6 6"
            />
          ) : activeSlices.length === 1 ? (
            /* 100% single slice */
            <circle 
              cx={cx} 
              cy={cy} 
              r={outerR} 
              fill={activeSlices[0].color} 
              style={{ transition: 'all 0.3s ease' }}
            />
          ) : (
            /* Multi-slice pie wedges */
            activeSlices.map((slice) => {
              const p1 = polarToCartesian(cx, cy, outerR, slice.startAngle);
              const p2 = polarToCartesian(cx, cy, outerR, slice.endAngle);
              const largeArcFlag = slice.angleSpan > 180 ? 1 : 0;
              const isHovered = hoveredOpt === slice.key;

              return (
                <path
                  key={slice.key}
                  d={`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} Z`}
                  fill={slice.color}
                  opacity={hoveredOpt && !isHovered ? 0.45 : 1}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)'
                  }}
                  onMouseEnter={() => setHoveredOpt(slice.key)}
                  onMouseLeave={() => setHoveredOpt(null)}
                />
              );
            })
          )}

          {/* Donut Hole (Cutout) */}
          <circle 
            cx={cx} 
            cy={cy} 
            r={innerR} 
            fill="#0b0f19" 
            stroke="rgba(255, 255, 255, 0.12)" 
            strokeWidth="2"
          />

          {/* Center Text Stats */}
          <text 
            x={cx} 
            y={cy - 4} 
            textAnchor="middle" 
            fill="#f8fafc" 
            fontSize={isCompact ? '20' : '26'} 
            fontWeight="800"
            fontFamily="monospace"
          >
            {totalVotes}
          </text>
          <text 
            x={cx} 
            y={cy + 18} 
            textAnchor="middle" 
            fill="var(--text-muted)" 
            fontSize={isCompact ? '10' : '12'} 
            fontWeight="500"
          >
            總投票數
          </text>
        </svg>
      </div>

      {/* 2. Full Option List Underneath (No "Option A", Complete Text Displayed) */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {slices.map((slice) => {
          const isHovered = hoveredOpt === slice.key;
          const pctText = Math.round(slice.pct * 100);

          return (
            <div
              key={slice.key}
              onMouseEnter={() => setHoveredOpt(slice.key)}
              onMouseLeave={() => setHoveredOpt(null)}
              className="glass-card"
              style={{
                padding: isCompact ? '0.6rem 0.85rem' : '0.8rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '10px',
                border: isHovered ? `1.5px solid ${slice.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                gap: '1rem'
              }}
            >
              {/* Option Color Indicator & Full Text */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                <span 
                  style={{ 
                    width: '14px', 
                    height: '14px', 
                    borderRadius: '4px', 
                    backgroundColor: slice.color,
                    flexShrink: 0,
                    marginTop: '4px',
                    boxShadow: `0 0 8px ${slice.color}66`
                  }} 
                />
                <span 
                  style={{ 
                    fontSize: isCompact ? '0.9rem' : '0.98rem', 
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal'
                  }}
                >
                  {slice.label}
                </span>
              </div>

              {/* Vote Count and Percentage */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                <span style={{ fontSize: isCompact ? '0.82rem' : '0.9rem', color: 'var(--text-muted)' }}>
                  {slice.count} 票
                </span>
                <span 
                  style={{ 
                    fontSize: isCompact ? '0.95rem' : '1.05rem', 
                    fontWeight: 800, 
                    color: slice.count > 0 ? slice.color : 'var(--text-muted)',
                    minWidth: '45px',
                    textAlign: 'right',
                    fontFamily: 'monospace'
                  }}
                >
                  {pctText}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
