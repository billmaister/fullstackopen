import { createSlice } from '@reduxjs/toolkit'
import anecdoteServices from '../services/anecdotes'

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
    changeAnecdoteInfo(state, action) {
      const updatedAnecdote = action.payload
      return state.map((a) =>
        a.id === updatedAnecdote.id ? updatedAnecdote : a
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { changeAnecdoteInfo, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteServices.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteServices.createNew({
      content: anecdote,
      votes: 0,
    })
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const updateAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteServices.updateInfo({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    dispatch(changeAnecdoteInfo(updatedAnecdote))
  }
}
