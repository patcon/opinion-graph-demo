import React from "react";
import "./App.css";
import { OpinionGraph } from "./components/OpinionGraph";

// Dummy data (you can replace this with your own example)
const comments = [
  { tid: 0, txt: "We need better transit.", is_meta: false },
  { tid: 1, txt: "I disagree with that.", is_meta: false },
];

const math = {
  n: 12,
  tids: [0, 1],
  "mod-out": [],
  "group-votes": {
    0: { id: 0, "n-members": 5 },
    1: { id: 1, "n-members": 7 },
  },
  "group-clusters": [
    { id: 0, members: [], center: [-100, -50] },
    { id: 1, members: [], center: [200, 100] },
  ],
  "base-clusters": {
    id: [0, 1],
    x: [-50, 100],
    y: [-30, 80],
    members: [[0], [1]],
    count: [1, 1],
  },
  ptptois: [
    { pid: 0, x: -50, y: -30, isSelf: true, picture_size: 30 },
    { pid: 1, x: 100, y: 80, isSelf: false, picture_size: 30 },
  ],
};

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
  return (
    <div className="App">
      <h2>Opinion Graph Demo</h2>
      <OpinionGraph comments={comments} math={math} Strings={Strings} />
    </div>
  );
}

export default App;
