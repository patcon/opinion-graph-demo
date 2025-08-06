import React, { useEffect, useState } from "react";
import { OpinionGraph } from "./OpinionGraph";

export function Viewer() {
  const [math, setMath] = useState(null);
  const [comments, setComments] = useState(null);
  const [selectedTab, setSelectedTab] = useState<"majority" | number>("majority");
  const [selectedTid, setSelectedTid] = useState<number | null>(null);

  const dataset = new URLSearchParams(window.location.search).get("dataset") || "6jrufhr6dp";

  useEffect(() => {
    if (!dataset) return;

    const basePath = `/data/${dataset}`;

    fetch(`${basePath}/math.json`)
      .then((res) => res.json())
      .then(setMath);

    fetch(`${basePath}/comments.json`)
      .then((res) => res.json())
      .then(setComments);
  }, [dataset]);

  if (!dataset) return <p>Missing `?dataset=…` in the URL.</p>;
  if (!math || !comments) return <p>Loading dataset <code>{dataset}</code>…</p>;

  return (
    <OpinionGraph
      comments={comments}
      math={math}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      selectedTid={selectedTid}
      setSelectedTid={setSelectedTid}
    />
  );
}
