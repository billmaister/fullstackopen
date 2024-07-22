import { useDispatch } from 'react-redux'
import { asObject, createAnecdotes } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'
import anecdoteServices from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.inputField.value
    event.target.inputField.value = ''
    const newAnecdote = await anecdoteServices.createNew(asObject(anecdote))
    dispatch(createAnecdotes(newAnecdote))
    dispatch(showNotification(`You added new anecdote: ${anecdote}`))
    setTimeout(() => {
      dispatch(showNotification(''))
    }, 5000)
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
