import React from "react";
import * as d3 from "d3";
import { GroupHulls } from "./GroupHulls"; // adjust path if needed
import { StatementSelector } from "./StatementSelector";

const globals = {
  width: 750,
  height: (750 * 2) / 3,
};

function OpinionGraph({ comments, math, config = { flipX: false, flipY: false }, selectedTab, setSelectedTab }: {
  comments: any;
  math: any;
  config?: { flipX: boolean; flipY: boolean };
  selectedTab: "majority" | number;
  setSelectedTab: (tab: "majority" | number) => void;
}) {
  const { groupClusters = math["group-clusters"], baseClusters = math["base-clusters"], ["group-votes"]: groupVotes = math["group-votes"] } = math;

  const ptptois = baseClusters.id.map((pid: number, i: number) => ({
    pid,
    x: baseClusters.x[i],
    y: baseClusters.y[i],
    isSelf: pid === 0, // highlight current user if desired
  }));

  const xExtent = d3.extent(baseClusters.x) as [number, number];
  const yExtent = d3.extent(baseClusters.y) as [number, number];

  const pad = 0.1;
  const xRange = xExtent[1] - xExtent[0];
  const yRange = yExtent[1] - yExtent[0];

  const xDomain = config.flipX
    ? [xExtent[1] + xRange * pad, xExtent[0] - xRange * pad]
    : [xExtent[0] - xRange * pad, xExtent[1] + xRange * pad];

  const yDomain = config.flipY
    ? [yExtent[0] - yRange * pad, yExtent[1] + yRange * pad]
    : [yExtent[1] + yRange * pad, yExtent[0] - yRange * pad];

  const xScale = d3.scaleLinear().domain(xDomain).range([0, globals.width]);
  const yScale = d3.scaleLinear().domain(yDomain).range([0, globals.height]);

  const getPosition = (x: number, y: number) => ({
    cx: xScale(x),
    cy: yScale(y),
  });

  return (
    <div>
      <svg width={globals.width} height={globals.height} viewBox={`0 0 ${globals.width} ${globals.height}`}>
        <Axes />
        <GroupHulls ptptois={ptptois} groupClusters={groupClusters} getPosition={getPosition} />
        <Participants ptptois={ptptois} getPosition={getPosition} />
        <GroupLabels groupClusters={groupClusters} groupVotes={groupVotes} getPosition={getPosition} />
      </svg>
      <StatementSelector
        comments={comments}
        math={math}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </div>
  );
}

function Participants({ ptptois = [], getPosition }: any) {
  return (
    <g id="participants">
      {ptptois.map((ptpt: any, i: number) => {
        const { cx, cy } = getPosition(ptpt.x, ptpt.y);
        return (
          <circle
            key={ptpt.pid || i}
            cx={cx}
            cy={cy}
            r={ptpt.isSelf ? 13 : 11}
            fill={ptpt.isSelf ? "#03a9f4" : "#ccc"}
          />
        );
      })}
    </g>
  );
}

function GroupLabels({ groupClusters = [], groupVotes = {}, getPosition }: any) {
  return (
    <g id="group-labels">
      {groupClusters.map((group: any, i: number) => {
        const { cx, cy } = getPosition(group.center[0], group.center[1]);
        const nMembers = groupVotes?.[group.id]?.["n-members"] ?? group.members.length;
        const groupLabel = `Group ${String.fromCharCode(65 + i)} (${nMembers})`;
        return (
          <text
            key={group.id || i}
            x={cx}
            y={cy}
            textAnchor="middle"
            fontSize="16"
            fontFamily="sans-serif"
            fill="#000"
            stroke="#ccc"
            strokeWidth="0.5"
          >
            {groupLabel}
          </text>
        );
      })}
    </g>
  );
}

function Axes() {
  const midX = globals.width / 2;
  const midY = globals.height / 2;
  return (
    <g id="axes">
      <line x1={0} y1={midY} x2={globals.width} y2={midY} stroke="#ccc" />
      <line x1={midX} y1={0} x2={midX} y2={globals.height} stroke="#ccc" />
    </g>
  );
}

export { OpinionGraph };
