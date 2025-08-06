import React, { useEffect, useState } from "react";
import "./App.css";
import { OpinionGraph } from "./components/OpinionGraph";

const Strings = {
  majorityOpinion: "Majority",
  group_123: "Group",
  comment_123: "Comment",
  pctAgreedLong: "{{pct}}% agreed with comment #{{comment_id}}",
  pctDisagreedLong: "{{pct}}% disagreed with comment #{{comment_id}}",
  pctAgreedOfGroupLong: "{{pct}}% of {{group}} agreed with comment #{{comment_id}}",
  pctDisagreedOfGroupLong: "{{pct}}% of {{group}} disagreed with comment #{{comment_id}}",
};

function App() {
  const [comments, setComments] = useState<any[] | null>(null);
  const [math, setMath] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/comments.json").then((res) => res.json()),
      fetch("/data/math.json").then((res) => res.json()),
    ])
      .then(([commentsData, mathData]) => {
        setComments(commentsData);
        setMath(mathData);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data files.");
      });
  }, []);

  return (
    <div className="App">
      <h2>Opinion Graph Demo</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!comments || !math ? (
        <p>Loading data...</p>
      ) : (
        <OpinionGraph comments={comments} math={math} Strings={Strings} />
      )}
    </div>
  );
}

export default App;
