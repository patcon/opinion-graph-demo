import { useEffect, useState } from "react";
import { OpinionGraph } from "./OpinionGraph";

export function Viewer() {
  const defaultDataset = "6jrufhr6dp";

  const searchParams = new URLSearchParams(window.location.search);
  const datasetParam = searchParams.get("dataset");
  const dataset = datasetParam || defaultDataset;

  useEffect(() => {
    if (!datasetParam) {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("dataset", defaultDataset);
      window.history.replaceState({}, "", `${window.location.pathname}?${newParams}`);
    }
  }, [datasetParam]);

  const [math, setMath] = useState(null);
  const [comments, setComments] = useState(null);
  const [conversation, setConversation] = useState<{ topic?: string } | null>(null);
  const [selectedTab, setSelectedTab] = useState<"majority" | number>("majority");
  const [selectedTid, setSelectedTid] = useState<number | null>(null);

  useEffect(() => {
    const basePath = `${import.meta.env.BASE_URL}data/${dataset}`;

    fetch(`${basePath}/math.json`)
      .then((res) => res.json())
      .then(setMath);

    fetch(`${basePath}/comments.json`)
      .then((res) => res.json())
      .then(setComments);

    fetch(`${basePath}/conversation.json`)
      .then((res) => res.json())
      .then(setConversation);
  }, [dataset]);

  if (!math || !comments || !conversation) {
    return <p>Loading dataset <code>{dataset}</code>…</p>;
  }

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", padding: "1rem" }}>
      {conversation.topic && (
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          {conversation.topic}
        </h2>
      )}
      <OpinionGraph
        comments={comments}
        math={math}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        selectedTid={selectedTid}
        setSelectedTid={setSelectedTid}
      />
    </div>
  );
}
