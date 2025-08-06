import React from "react";

export function StatementSelector({
  comments,
  math,
  selectedTab,
  setSelectedTab,
}: {
  comments: any;
  math: any;
  selectedTab: "majority" | number;
  setSelectedTab: (tab: "majority" | number) => void;
}) {
  const groupClusters = math["group-clusters"] ?? [];

  const statementIds = (() => {
    if (selectedTab === "majority") {
      return (math["consensus"]?.["agree"] ?? []).map((d: any) => d.tid);
    } else {
      return (math["repness"]?.[selectedTab] ?? []).map((d: any) => d.tid);
    }
  })();

  const statementButtons = statementIds.map((tid: number) => {
    const text = comments[tid]?.comment ?? `#${tid}`;
    return (
      <button key={tid} style={{ marginRight: 8, marginBottom: 8 }}>
        {text}
      </button>
    );
  });

  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedTab("majority")}
          style={{
            fontWeight: selectedTab === "majority" ? "bold" : "normal",
          }}
        >
          Majority Opinion
        </button>
        {groupClusters.map((group: any, i: number) => (
          <button
            key={group.id ?? i}
            onClick={() => setSelectedTab(group.id ?? i)}
            style={{
              fontWeight: selectedTab === (group.id ?? i) ? "bold" : "normal",
            }}
          >
            {String.fromCharCode(65 + i)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{statementButtons}</div>
    </div>
  );
}
