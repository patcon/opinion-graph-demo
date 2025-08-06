import React, { useEffect, useState } from "react";
import "./App.css";
import { OpinionGraph } from "./components/OpinionGraph";

const DATASET_ID = "6jrufhr6dp"; // or allow user to select later

function App() {
  const [comments, setComments] = useState<any>(null);
  const [math, setMath] = useState<any>(null);
  const [config, setConfig] = useState<{ flipX: boolean; flipY: boolean }>({ flipX: false, flipY: false });

  useEffect(() => {
    Promise.all([
      fetch(`/data/${DATASET_ID}/comments.json`).then((res) => res.json()),
      fetch(`/data/${DATASET_ID}/math.json`).then((res) => res.json()),
      fetch(`/data/${DATASET_ID}/config.json`).then((res) => res.json()).catch(() => ({ flipX: false, flipY: false }))
    ]).then(([commentsData, mathData, configData]) => {
      setComments(commentsData);
      setMath(mathData);
      setConfig(configData);
    });
  }, []);

  if (!comments || !math) return <p>Loading…</p>;

  return <OpinionGraph comments={comments} math={math} config={config} />;
}

export default App;
