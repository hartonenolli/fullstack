import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer.js";
import { setNotification, clearNotification } from "../reducers/notificationReducer.js";

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote.id)}>vote</button>
      </div>
    </div>
  );
}
const AnecdoteList = () => {
  const filter = useSelector((state) => state.filter);
  //console.log('filter:', filter);
  const anecdotes = useSelector((state) => {
    if (filter === '') {
      return state.anecdotes;
    }
    return state.anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    );
  });
  const dispatch = useDispatch();
  
  const handleVote = (id) => {
    console.log("vote", id);
    const votedAnecdote = anecdotes.find((a) => a.id === id);
    dispatch(setNotification(`you voted '${votedAnecdote.content}'`, 5));
    dispatch(addVote(id));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={handleVote} />
      ))}
    </div>
  );
}

export default AnecdoteList;