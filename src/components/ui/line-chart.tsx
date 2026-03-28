type LineChartProps = {
  data: Array<{
    x: string;
    y: number;
  }>;
  height?: number;
  width?: string;
};

export function LineChart({
  data,
  height = 200,
  width = "100%",
}: LineChartProps) {
  if (data.length === 0) {
    return null;
  }

  const padding = 40;
  const innerHeight = height - padding * 2;
  const innerWidth = 500 - padding * 2; // Fixed inner width for better control

  // Find min and max Y values
  const yValues = data.map((d) => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;

  // Calculate points
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * innerWidth;
    const yNormalized = (d.y - minY) / yRange;
    const y = padding + innerHeight - yNormalized * innerHeight;
    return { x, y, label: d.x, value: d.y };
  });

  // Create path
  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 500 ${height}`}
        width={width}
        height={height}
        className="min-w-[400px]"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padding + innerHeight - (val / 100) * innerHeight;
          return (
            <g key={`grid-${val}`}>
              <line
                x1={padding}
                y1={y}
                x2={padding + innerWidth}
                y2={y}
                stroke="rgb(229 231 235)"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x={padding - 5}
                y={y}
                fontSize="11"
                fill="rgb(107 114 128)"
                textAnchor="end"
                dominantBaseline="middle"
              >
                %{val}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={padding + innerHeight}
          stroke="rgb(209 213 219)"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding + innerHeight}
          x2={padding + innerWidth}
          y2={padding + innerHeight}
          stroke="rgb(209 213 219)"
          strokeWidth="2"
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="rgb(59 130 246)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p, i) => (
          <g key={`point-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="rgb(59 130 246)"
              stroke="white"
              strokeWidth="2"
            />
            {/* Labels on hover area */}
            <rect
              x={p.x - 20}
              y={p.y - 30}
              width="40"
              height="24"
              fill="rgb(30, 41, 59)"
              rx="4"
              opacity="0"
              className="hover-label"
            />
            <text
              x={p.x}
              y={p.y - 12}
              fontSize="12"
              fill="white"
              textAnchor="middle"
              opacity="0"
              className="hover-text"
            >
              %{p.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
