import { useState } from "react";

const Button = ({ text, handler }) => <button onClick={handler}>{text}</button>;

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistic = ({ good, neutral, bad }) => {
  const sum = () => good + neutral + bad;

  const average = () => (good * 1 + neutral * 0 + bad * -1) / sum();

  return (
    <>
      <h2>statistics</h2>
      {good || neutral || bad ? (
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={sum()} />
            <StatisticLine text='average' value={average() ? average() : 0} />
            <StatisticLine
              text='positive'
              value={sum() ? (good / sum()) * 100 + " %" : "0 %"}
            />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <Button handler={() => setGood(good + 1)} text='good' />
      <Button handler={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handler={() => setBad(bad + 1)} text='bad' />
      <Statistic good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
