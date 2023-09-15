import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = ({ text, value }) => {
  if (text === "positive") {
    return (
      <tr>
      <th>{text}</th>
      <td>{value}%</td>
    </tr>
    )
  }
  return (
    <tr>
      <th align='left'>{text}</th>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ clicks }) => {
  if (clicks[0] === 0 && clicks[1] === 0 && clicks[2] === 0) {
    return (
      'No feedback given'
    )
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value ={clicks[0]} />

          <StatisticLine text="neutral" value ={clicks[1]} />

          <StatisticLine text="bad" value ={clicks[2]} />

          <StatisticLine text="all" value ={clicks[0] + clicks[1] + clicks[2]} />

          <StatisticLine text="average" value ={(clicks[0] - clicks[2]) / (clicks[0] + clicks[1] + clicks[2])} />

          <StatisticLine text="positive" value ={clicks[0] / (clicks[0] + clicks[1] + clicks[2]) * 100} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h2>statistics</h2>
      <Statistics clicks={[good, neutral, bad]} />
    </div>
  )
}

export default App
