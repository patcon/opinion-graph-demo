import * as d3 from "d3";

/**
 * Draws convex hulls for each group using d3.polygonHull.
 */
export function GroupHulls({
  ptptois = [],
  groupClusters = [],
  getPosition,
  selectedTab,
  setSelectedTab,
}: {
  ptptois: any[];
  groupClusters: any[];
  getPosition: (x: number, y: number) => { cx: number; cy: number };
  selectedTab: "majority" | number;
  setSelectedTab: (tab: "majority" | number) => void;
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
        // @ts-ignore
        const hullPoints = d3.polygonHull(getPointsForGroup(group.members));
        if (!hullPoints) return null;

        const isSelected = selectedTab === (group.id ?? i);

        return (
          <polygon
            key={group.id || i}
            points={hullPoints.map((p) => p.join(",")).join(" ")}
            fill={isSelected ? "#00f" : "#000"}
            fillOpacity={isSelected ? 0.12 : 0.08}
            stroke={isSelected ? "#00f" : "#ccc"}
            strokeWidth={isSelected ? 2 : 1}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedTab(group.id ?? i)}
          />
        );
      })}
    </g>
  );
}
