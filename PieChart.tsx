import { useMemo } from "react";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  title?: string;
}

const COLORS = [
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#ec4899", // pink
  "#84cc16", // lime
  "#f97316", // orange
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#a855f7", // purple
];

export default function PieChart({ 
  data, 
  size = 200, 
  showLegend = true,
  showLabels = false,
  title
}: PieChartProps) {
  const total = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);
  
  const segments = useMemo(() => {
    let currentAngle = 0;
    return data.map((item, index) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        color: item.color || COLORS[index % COLORS.length],
      };
    });
  }, [data, total]);
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };
  
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };
  
  const center = size / 2;
  const radius = size / 2 - 10;
  
  if (data.length === 0 || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-muted-foreground text-sm">Sem dados</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center gap-4">
      {title && <h3 className="font-semibold text-sm">{title}</h3>}
      
      <div className="flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={describeArc(center, center, radius, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="transition-all duration-300 hover:opacity-80"
              />
              {showLabels && segment.percentage > 5 && (
                <text
                  x={polarToCartesian(center, center, radius * 0.65, (segment.startAngle + segment.endAngle) / 2).x}
                  y={polarToCartesian(center, center, radius * 0.65, (segment.startAngle + segment.endAngle) / 2).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-xs font-medium"
                >
                  {segment.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
          {/* Center hole for donut effect */}
          <circle cx={center} cy={center} r={radius * 0.5} fill="hsl(var(--background))" />
          <text
            x={center}
            y={center - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-lg font-bold"
          >
            {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
          </text>
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-xs"
          >
            Total
          </text>
        </svg>
        
        {showLegend && (
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-muted-foreground truncate max-w-[120px]" title={segment.label}>
                  {segment.label}
                </span>
                <span className="font-medium ml-auto">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get color by index
export function getChartColor(index: number): string {
  return COLORS[index % COLORS.length];
}
