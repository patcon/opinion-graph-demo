import React from "react";

export function DataSentence({
  selectedTab,
  selectedTid,
  comments,
  math,
}: {
  selectedTab: "majority" | number;
  selectedTid: number | null;
  comments: any;
  math: any;
}) {
  if (selectedTid === null) return null;

  const comment = comments.find(c => c.tid === selectedTid);
  if (!comment) return null;

  const isMajority = selectedTab === "majority";

  let agree = 0;
  let disagree = 0;
  let saw = 0;
  let n = 0;

  if (isMajority) {
    const consensusAgree = math.consensus?.agree?.find((d: any) => d.tid === selectedTid);
    const consensusDisagree = math.consensus?.disagree?.find((d: any) => d.tid === selectedTid);
    const entry = consensusAgree || consensusDisagree;

    if (entry) {
      n = entry["n-trials"];
      saw = entry["n-trials"];
      agree = consensusAgree ? entry["n-success"] : 0;
      disagree = consensusDisagree ? entry["n-success"] : 0;
    }
  } else {
    const groupVotes = math["group-votes"]?.[selectedTab];
    const votes = groupVotes?.votes?.[selectedTid];
    agree = votes?.A ?? 0;
    disagree = votes?.D ?? 0;
    saw = votes?.S ?? 0;
    n = groupVotes?.["n-members"] ?? saw;
  }

  const pass = saw - (agree + disagree);

  const percent = ((agree || disagree) && saw)
    ? Math.round(((agree > disagree ? agree : disagree) / saw) * 100)
    : null;

  const dominant = agree > disagree ? "agreed" : "disagreed";
  const icon = dominant === "agreed" ? "✅" : "⛔"; // check or prohibited
  const groupLabel = isMajority ? "everyone" : `group ${String.fromCharCode(65 + Number(selectedTab))}`;

  return (
    <div style={{ marginTop: 20, fontSize: 18 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>#{selectedTid}</strong> {comment.txt}
      </div>
      {percent !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 32 }}>{icon}</span>
          <span style={{ color: "#777" }}>
            {percent}% of {groupLabel} who voted on statement {selectedTid} {dominant}.
          </span>
        </div>
      )}
    </div>
  );
}
