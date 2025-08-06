import React, { useEffect, useState } from "react";
import { OpinionGraph } from "./OpinionGraph";

export function Viewer() {
  const defaultDataset = "6jrufhr6dp";

  // Read dataset param or fallback to default
  const searchParams = new URLSearchParams(window.location.search);
  const datasetParam = searchParams.get("dataset");
  const dataset = datasetParam || defaultDataset;

  // If missing, update the URL without reloading
  useEffect(() => {
    if (!datasetParam) {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("dataset", defaultDataset);
      window.history.replaceState({}, "", `${window.location.pathname}?${newParams}`);
    }
  }, [datasetParam]);

  const [math, setMath] = useState(null);
  const [comments, setComments] = useState(null);
  const [selectedTab, setSelectedTab] = useState<"majority" | number>("majority");
  const [selectedTid, setSelectedTid] = useState<number | null>(null);

  useEffect(() => {
    const basePath = `/data/${dataset}`;

    fetch(`${basePath}/math.json`)
      .then((res) => res.json())
      .then(setMath);

    fetch(`${basePath}/comments.json`)
      .then((res) => res.json())
      .then(setComments);
  }, [dataset]);

  if (!math || !comments) {
    return <p>Loading dataset <code>{dataset}</code>…</p>;
  }

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
