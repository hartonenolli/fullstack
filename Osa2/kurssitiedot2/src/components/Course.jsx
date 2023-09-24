const Part = ({ name, exercises }) => <div> {name} {exercises} </div>

const Header = ({ name }) => <h2>{name}</h2>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
      <b>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</b>
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <ul>
        <Header name={course.name} />
        <Content parts={course.parts} />
      </ul>
    </div>
  )
}

export default Course