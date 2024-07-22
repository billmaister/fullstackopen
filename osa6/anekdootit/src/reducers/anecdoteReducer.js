import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find((a) => a.id === id)
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      }
      return state.map((a) => (a.id === id ? updatedAnecdote : a))
    },
    createAnecdotes(state, action) {
      const newAnecdote = action.payload
      state.push(newAnecdote)
    },
    appendAnecdotes(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { voteAnecdote, createAnecdotes, appendAnecdotes, setAnecdotes } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer
