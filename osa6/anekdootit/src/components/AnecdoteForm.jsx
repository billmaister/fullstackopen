import { useDispatch } from 'react-redux'
import { createAnecdotes } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = (event) => {
    event.preventDefault()
    const anecdote = event.target.inputField.value
    event.target.inputField.value = ''
    dispatch(createAnecdotes(anecdote))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div>
          <input name='inputField' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
