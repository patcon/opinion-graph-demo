import React, { useMemo, useState, useEffect } from "react";

/** Minimal opinion graph component with:
 *  - Comments
 *  - Math output from analytics
 *  - Optional Strings
 *
 *  Organized into smaller component blocks in this file
 */

// Dummy global-like values (move to config/globals.js if needed)
const globals = {
  groupLabels: ["Group A", "Group B", "Group C"],
  side: 900,
  colors: { agree: "#009688", disagree: "#f44336" },
  tidCuration: { majority: "majority" },
};

export function OpinionGraph({ comments, math, Strings = {} }) {
  const visibleComments = useMemo(
    () => comments.filter((c) => !c.is_meta),
    [comments]
  );

  const badTids = useMemo(() => {
    return Object.fromEntries((math["mod-out"] ?? []).map((tid) => [tid, true]));
  }, [math]);

  const repnessByGroup = useMemo(() => {
    const agree = {};
    const disagree = {};
    Object.entries(math.repness || {}).forEach(([gid, entries]) => {
      entries.forEach((entry) => {
        const target = entry["repful-for"] === "agree" ? agree : disagree;
        if (!target[gid]) target[gid] = [];
        target[gid].push(entry.tid);
      });
    });
    return { agree, disagree };
  }, [math]);

  const maxTid = useMemo(
    () => visibleComments.reduce((max, c) => (c.tid > max ? c.tid : max), 0),
    [visibleComments]
  );
  const tidWidth = ("" + maxTid).length;
  const formatTid = (tid) => `#${("" + tid).padStart(tidWidth, "0")}`;

  if (!math || math.n < 5) return null; // not enough participants

  return (
    <div style={{ padding: 20 }}>
      <SVGContainer>
        <GroupLabels
          groups={Object.values(math["group-votes"] || {})}
          centroids={math["group-clusters"]?.map((c) => ({ x: c.center[0], y: c.center[1] }))}
        />
        <Participants points={math["base-clusters"]} ptptois={math["ptptois"] || []} />
      </SVGContainer>
    </div>
  );
}

function SVGContainer({ children }) {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const scale = width < globals.side ? width / globals.side : 1;
  return (
    <svg
      width={globals.side}
      height={globals.side}
      style={{ transform: `scale(${scale})`, transformOrigin: "0% 0%" }}>
      <g transform="translate(40, 40)">{children}</g>
    </svg>
  );
}

function Participants({ points = [], ptptois = [] }) {
  if (!ptptois.length && !points.length) return null;
  return (
    <g id="participants">
      {ptptois.map((ptpt, i) => (
        <circle
          key={ptpt.pid || i}
          cx={ptpt.x}
          cy={ptpt.y}
          r={ptpt.isSelf ? 13 : 11}
          fill={ptpt.isSelf ? "#03a9f4" : "#ccc"}
          stroke={ptpt.isSelf ? "#03a9f4" : undefined}
          strokeWidth={ptpt.isSelf ? 4 : undefined}
        />
      ))}
      {points?.id?.map((id, i) => (
        <circle
          key={id}
          cx={points.x[i]}
          cy={points.y[i]}
          r={5}
          fill="gray"
        />
      ))}
    </g>
  );
}

function GroupLabels({ groups = [], centroids = [] }) {
  if (!centroids.length || !groups.length) return null;
  return (
    <g id="group-labels">
      {centroids.map((centroid, i) => (
        <g key={groups[i].id} transform={`translate(${centroid.x}, ${centroid.y})`}>
          <rect
            x={-25}
            y={-12}
            width={50}
            height={24}
            fill="#eee"
            stroke="#999"
            rx={4}
          />
          <text
            x={0}
            y={5}
            fontSize={12}
            textAnchor="middle"
            style={{ pointerEvents: "none" }}>
            {globals.groupLabels[groups[i].id] || `Group ${groups[i].id}`}
          </text>
        </g>
      ))}
    </g>
  );
}
