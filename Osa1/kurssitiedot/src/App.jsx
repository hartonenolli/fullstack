const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  console.log({props})
  return (
    <div>
      <p>
        {props.this.part} {props.this.exercises}
      </p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
        <Part this={props.parts[0]} />
        <Part this={props.parts[1]} />
        <Part this={props.parts[2]} />
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>
        Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}
      </p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    { part: 'Fundamentals of React' , exercises : 10 },
    { part: 'Using props to pass data' , exercises : 7 },
    { part: 'State of a component' , exercises : 14 },
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App