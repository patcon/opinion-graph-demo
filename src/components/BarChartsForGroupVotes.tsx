import * as d3 from "d3";

const globals = {
  side: 750,
  colors: {
    agree: "#2ecc71",
    disagree: "#e74c3c",
    pass: "#e6e6e6",
  },
};

const corners = [
  [0, -globals.side],
  [globals.side, 0],
  [0, globals.side],
  [globals.side, globals.side],
];

function closestPointOnHull(hull: number[][], target: number[]) {
  let closest = hull[0];
  let minDist = Infinity;
  for (let i = 0; i < hull.length; i++) {
    const dx = target[0] - hull[i][0];
    const dy = target[1] - hull[i][1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      closest = hull[i];
      minDist = dist;
    }
  }
  return closest;
}

function getLabelAnchor(hull: number[][]) {
  const candidates = corners.map((c) => {
    const pt = closestPointOnHull(hull, c);
    const dx = c[0] - pt[0];
    const dy = c[1] - pt[1];
    return {
      pt,
      dist: Math.sqrt(dx * dx + dy * dy),
    };
  });

  let pt = candidates.reduce((max, curr) => (curr.dist > max.dist ? curr : max)).pt;

  if (pt[0] < globals.side / 2) {
    pt[0] -= 90;
  } else {
    pt[0] -= 10;
  }
  if (pt[1] < globals.side / 4) {
    pt[1] += 10;
  } else {
    pt[1] -= 10;
  }
  return pt;
}

function BarChartCompact({ selectedTid, groupVotes, translate }: {
  selectedTid: number;
  groupVotes: any;
  translate: [number, number];
}) {
  if (!selectedTid) return null;

  let w = 100;
  if (translate[0] < 10) {
    translate[0] = 10;
  } else if (translate[0] > globals.side - (w + 10)) {
    translate[0] = globals.side - (w + 10);
  }

  const groupVotesForThisComment = groupVotes.votes?.[selectedTid] || { A: 0, D: 0, S: 1 };
  const agrees = groupVotesForThisComment.A;
  const disagrees = groupVotesForThisComment.D;
  const sawTheComment = groupVotesForThisComment.S;
  const passes = sawTheComment - (agrees + disagrees);
  const nMembers = groupVotes["n-members"] || 1;

  const agree = (agrees / nMembers) * w;
  const disagree = (disagrees / nMembers) * w;
  const pass = (passes / nMembers) * w;

  return (
    <g transform={`translate(${translate[0]}, ${translate[1]})`} style={{ pointerEvents: "none" }}>
      <rect x={0.5} width={w + 0.5} height={10} fill={"white"} stroke={"rgb(180,180,180)"} />
      <rect x={0.5} width={agree} y={0.5} height={9} fill={globals.colors.agree} />
      <rect x={0.5 + agree} width={disagree} y={0.5} height={9} fill={globals.colors.disagree} />
      <rect x={0.5 + agree + disagree} width={pass} y={0.5} height={9} fill={globals.colors.pass} />
    </g>
  );
}

export function BarChartsForGroupVotes({
  groupClusters = [],
  groupVotes = {},
  ptptois = [],
  selectedTid,
  getPosition,
}: {
  groupClusters: any[];
  groupVotes: Record<string, any>;
  ptptois: any[];
  selectedTid: number | null;
  getPosition: (x: number, y: number) => { cx: number; cy: number };
}) {
  if (selectedTid == null) return null;

  return (
    <g id="group-bar-charts">
      {groupClusters.map((group: any, i: number) => {
        const memberPts = group.members
          .map((pid: number) => ptptois.find((p) => p.pid === pid))
          .filter(Boolean)
          .map((pt: any) => {
            const { cx, cy } = getPosition(pt.x, pt.y);
            return [cx, cy];
          });

        const hull = d3.polygonHull(memberPts);
        if (!hull) return null;

        const anchor = getLabelAnchor(hull);

        return (
          <BarChartCompact
            key={group.id ?? i}
            selectedTid={selectedTid}
            groupVotes={groupVotes[group.id] ?? {}}
            translate={anchor as [number, number]}
          />
        );
      })}
    </g>
  );
}
