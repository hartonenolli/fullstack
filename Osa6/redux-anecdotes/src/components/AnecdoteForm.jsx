import { useDispatch } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer.js";
import { setNotification, clearNotification } from "../reducers/notificationReducer.js";
import anecdoteService from '../services/anecdotes.js'

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addNewAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    dispatch(setNotification(`you created '${content}'`, 5));
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addAnecdote(newAnecdote))
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;