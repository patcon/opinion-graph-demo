import { useEffect, useState } from "react";
import { OpinionGraph } from "./OpinionGraph";

interface DatasetEntry {
  path: string;
  topic: string;
  participant_count: number;
  created: string;
}

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
  const [conversation, setConversation] = useState(null);
  const [availableDatasets, setAvailableDatasets] = useState<DatasetEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState<"majority" | number>("majority");
  const [selectedTid, setSelectedTid] = useState<number | null>(null);

  useEffect(() => {
    const basePath = `${import.meta.env.BASE_URL}data/${dataset}`;

    fetch(`${basePath}/math.json`).then((res) => res.json()).then(setMath);
    fetch(`${basePath}/comments.json`).then((res) => res.json()).then(setComments);
    fetch(`${basePath}/conversation.json`).then((res) => res.json()).then(setConversation);
  }, [dataset]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/index.json`)
      .then((res) => res.json())
      .then(setAvailableDatasets);
  }, []);

  const handleChangeDataset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("dataset", selected);
    window.location.search = newParams.toString();
  };

  if (!math || !comments || !conversation) {
    return <p>Loading dataset <code>{dataset}</code>…</p>;
  }

  return (
    <div>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <select value={dataset} onChange={handleChangeDataset}>
          {availableDatasets.map((d) => (
            <option key={d.path} value={d.path}>
              {`${d.topic.length > 40 ? d.topic.slice(0, 40) + "…" : d.topic} (${d.participant_count} ptpts, ${new Date(Number(d.created)).getFullYear()})`}
            </option>
          ))}
        </select>
      </div>
      <h2 style={{ textAlign: "center" }}>{conversation.topic}</h2>
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
