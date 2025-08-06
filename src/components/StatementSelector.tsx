import { useEffect } from "react";

export function StatementSelector({
  comments,
  math,
  selectedTab,
  setSelectedTab,
  selectedTid,
  setSelectedTid,
}: {
  comments: any;
  math: any;
  selectedTab: "majority" | number;
  setSelectedTab: (tab: "majority" | number) => void;
  selectedTid: number | null;
  setSelectedTid: (tid: number) => void;
}) {
  const groupClusters = math["group-clusters"] ?? [];

  const statementIds = (() => {
    if (selectedTab === "majority") {
      return (math["consensus"]?.["agree"] ?? []).map((d: any) => d.tid);
    } else {
      return (math["repness"]?.[selectedTab] ?? []).map((d: any) => d.tid);
    }
  })();

  useEffect(() => {
    if (statementIds.length > 0) {
      setSelectedTid(statementIds[0]);
    }
  }, [selectedTab]);

  const statementButtons = statementIds.map((tid: number) => {
    const text = comments[tid]?.comment ?? `#${tid}`;
    const isSelected = selectedTid === tid;
    return (
      <button
        key={tid}
        onClick={() => setSelectedTid(tid)}
        style={{
          marginRight: 8,
          marginBottom: 8,
          backgroundColor: isSelected ? "#0000FF1F" : "#fff",
          borderColor: isSelected ? "#00f" : "#ccc",
          fontWeight: isSelected ? "bold" : "normal",
        }}
      >
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
            backgroundColor: selectedTab === "majority" ? "#0000FF1F" : "#fff",
            borderColor: selectedTab === "majority" ? "#00f" : "#ccc",
          }}
        >
          Majority Opinion
        </button>
        {groupClusters.map((group: any, i: number) => {
          const id = group.id ?? i;
          return (
            <button
              key={id}
              onClick={() => setSelectedTab(id)}
              style={{
                fontWeight: selectedTab === id ? "bold" : "normal",
                backgroundColor: selectedTab === id ? "#0000FF1F" : "#fff",
                borderColor: selectedTab === id ? "#00f" : "#ccc",
              }}
            >
              {String.fromCharCode(65 + i)}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{statementButtons}</div>
    </div>
  );
}
