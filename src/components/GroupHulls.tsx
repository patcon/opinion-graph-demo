import React from "react";
import * as d3 from "d3";

/**
 * Draws convex hulls for each group using d3.polygonHull.
 */
export function GroupHulls({
  ptptois = [],
  groupClusters = [],
  getPosition,
}: {
  ptptois: any[];
  groupClusters: any[];
  getPosition: (x: number, y: number) => { cx: number; cy: number };
}) {
  const getPointsForGroup = (memberIds: number[]) => {
    return memberIds
      .map((pid) => ptptois.find((p) => p.pid === pid))
      .filter(Boolean)
      .map((p) => {
        const { cx, cy } = getPosition(p.x, p.y);
        return [cx, cy];
      });
  };

  return (
    <g id="group-hulls">
      {groupClusters.map((group, i) => {
        const hullPoints = d3.polygonHull(getPointsForGroup(group.members));
        if (!hullPoints) return null;

        return (
          <polygon
            key={group.id || i}
            points={hullPoints.map((p) => p.join(",")).join(" ")}
            fill="#000"
            fillOpacity={0.08}
            stroke="#ccc"
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}
