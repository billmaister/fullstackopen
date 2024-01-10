import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [highestIdx, setHighestIdx] = useState(0);

  const handleClick = () => {
    let random;
    // so that click would not produce same anecdote
    do {
      random = Math.floor(Math.random() * anecdotes.length);
    } while (random === selected);
    setSelected(random);
  };

  const handleVote = () => {
    const points = [...votes];
    points[selected] += 1;
    setVotes(points);
    if (Math.max(...points) > points[highestIdx]) {
      setHighestIdx(points.indexOf(Math.max(...points)));
    }
  };

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleClick}>next anecdote</button>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[highestIdx]}</p>
      <p>has {votes[highestIdx]} votes</p>
    </div>
  );
};

export default App;
