import { useDispatch, useSelector } from 'react-redux'
import { addFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const filter = useSelector(({ filter }) => filter)

  const handleChange = (event) => {
    dispatch(addFilter(event.target.value))
  }

  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
