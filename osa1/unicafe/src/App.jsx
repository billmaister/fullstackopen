import { useState } from "react";

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const sum = () => good + neutral + bad;

  const average = () => (good * 1 + neutral * 0 + bad * -1) / sum();

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <h2>statistic</h2>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {sum()}</p>
      <p>average {average()}</p>
      <p>positive {sum() ? (good / sum()) * 100 : 0} %</p>
    </div>
  );
}

export default App;
