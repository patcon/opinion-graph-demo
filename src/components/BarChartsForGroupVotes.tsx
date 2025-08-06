import React from "react";

export function BarChartsForGroupVotes({
  groupClusters = [],
  groupVotes = {},
  selectedTid,
  getPosition,
}: {
  groupClusters: any[];
  groupVotes: Record<string, any>;
  selectedTid: number | null;
  getPosition: (x: number, y: number) => { cx: number; cy: number };
}) {
  if (selectedTid == null) return null;

  return (
    <g id="group-bar-charts">
      {groupClusters.map((group: any, i: number) => {
        const { cx, cy } = getPosition(group.center[0], group.center[1]);
        const votes = groupVotes?.[group.id]?.votes?.[selectedTid] ?? { A: 0, D: 0, P: 0, S: 0 };

        const barHeight = 30;
        const barWidth = 10;
        const spacing = 2;

        const total = votes.S || 1;
        const bars = [
          { key: "A", color: "#4caf50" },
          { key: "P", color: "#9e9e9e" },
          { key: "D", color: "#f44336" },
        ];

        return (
          <g key={group.id ?? i} transform={`translate(${cx - (bars.length * (barWidth + spacing)) / 2}, ${cy - 50})`}>
            {bars.map((b, j) => {
              const height = (votes[b.key] / total) * barHeight;
              return (
                <rect
                  key={b.key}
                  x={j * (barWidth + spacing)}
                  y={barHeight - height}
                  width={barWidth}
                  height={height}
                  fill={b.color}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
