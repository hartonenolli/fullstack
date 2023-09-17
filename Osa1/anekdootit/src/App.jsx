import { useState } from 'react'

function getRandom() {
  return Math.floor(Math.random() * 8)
}

function getBiggest(points) {
  var biggest = 0
  var result = 0
  for (let i = 0; i < 8; i++) {
    if (points[i] > biggest) {
      console.log("suurin ennen", biggest)
      biggest = points[i]
      result = i
      console.log("suurin jälkeen", biggest)
    }
  }
  return result
}

const AddPoints = (int, points) => {
  const copy = {...points}
  copy[int] += 1
  return (
    copy
  )
}

const Anecdote = ({int, anecdotes}) => (
  <div>
    {anecdotes[int]}
  </div>
)


const Button = (props) => (
  <div>
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  </div>
)

const VoteNumber = ({int, points}) => (
  <div> has {points[int]} votes</div>
)

const Biggest = ({points, anecdotes}) => {
  return(
    <Anecdote int={getBiggest(points)} anecdotes={anecdotes} />
    
    
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   

  const [points, setPoints] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0})
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <h1>Anicdote of the day</h1>
      
      <Anecdote int={selected} anecdotes={anecdotes} />
      <VoteNumber int={selected} points={points} />
      <Button handleClick={() => setPoints(AddPoints(selected, points))} text="vote" />
      <Button handleClick={() => setSelected(getRandom)} text="next anecdote" />
      <h1>Anicdote with most votes</h1>
      <Biggest points={points} anecdotes={anecdotes} />
      <VoteNumber int={getBiggest(points)} points={points} />
    </div>
  )
}

export default App