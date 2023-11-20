import { useState, useEffect } from 'react'
import axios from 'axios'

const FetchInformation = ({ selectedCountry, country }) => {
  const [countryData, setCountryData] = useState([])
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${selectedCountry}`)
      .then(response => {
        // Make an array of the data
        if (countryData.length < 1) {
          setCountryData(countryData.concat(response.data))
        }
      })
  }, [country])
  return (
    <CountryInformation countryData={countryData} />
  )
}

const CountryInformation = ({ countryData }) => {
  if (countryData.length === 1) {
    return (
      <>
        <h2>{countryData[0].name.common}</h2>
        <p>capital {countryData[0].capital[0]}</p>
        <p>area {countryData[0].area}</p>
        <h3>languages</h3>
        <ul>
          {Object.values(countryData[0].languages).map((language, i) => (
            <li key={i}>{language}</li>
          ))}
        </ul>
        <img src={countryData[0].flags.png} alt="flag" width="200" />
      </>
    )
  }
}

const CountryList = ({ countryList, country }) => {
  const [showCountry, setShowCountry] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')

  const handleSubmit = (event, countryName) => {
    event.preventDefault()
    setSelectedCountry(countryName)
    setShowCountry(true)
  }
  if (showCountry) {
    return (
      <FetchInformation selectedCountry={selectedCountry} country={country} />
    )
  }
  if (countryList.length === 1) {
    return (
      <FetchInformation selectedCountry={countryList[0].name.common} country={country} />
    )
  }
  if (countryList.length > 10) {
    return (
      <p>Too many maching countries, specify another filter</p>
    )
  }
  if (countryList.length > 1 && countryList.length < 10) {
    return (
      <form onSubmit={handleSubmit}>
        <ul>
          {countryList.map((country, i) => (
            <li key={i}>{country.name.common}
              <button onClick={(event) => handleSubmit(event, country.name.common)}>show</button>
            </li>
          ))}
        </ul>
      </form>
    )
  }
}

function App() {
  const [name, setName] = useState('')
  const [filteredCountryList, setFilteredCountryList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${selectedCountry}`)
        .then(response => {
          setFilteredCountryList([response.data])
        })
        .catch(error => console.error('Error fetching country:', error))
    } else {
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().startsWith(name.toLowerCase())
          )

          setFilteredCountryList(filteredCountries)
        })
        .catch(error => console.error('Error fetching countries:', error))
    }
  }, [selectedCountry, name])

  const handleChange = (event) => {
    setName(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowCountry = (countryName) => {
    setSelectedCountry(countryName)
  }

  return (
    <>
      <form>
        Find countries
        <input value={name} onChange={handleChange} />
      </form>
      <CountryList countryList={filteredCountryList} onShowCountry={handleShowCountry} />
    </>
  )
}

export default App

// function App() {
//   const [name, setName] = useState('')
//   const [countryList, setCountryList] = useState([])
//   const [filteredCountryList, setFilteredCountryList] = useState([])
//   const [country, setCountry] = useState(null)

//   useEffect(() => {
//     if (country) {
//       axios
//         .get('https://studies.cs.helsinki.fi/restcountries/api/all')
//         .then(response => {
//           const filteredCountries = Object.values(response.data).filter(country =>
//             country.name.common.toLowerCase().startsWith(name.toLowerCase())
//           );
  
//           setFilteredCountryList(prevFilteredCountryList => filteredCountries);
//           setCountryList(filteredCountries);
//         })
//         .catch(error => console.error('Error fetching countries:', error));
//     }
//   }, [country, name])

//   const handleChange = (event) => {
//     setName(event.target.value)
//     setCountry(event.target.value)
//   }
//   return (
//     <>
//       <form>
//         Find countries
//         <input value={name} onChange={handleChange} />
//       </form>
//       <CountryList countryList={countryList} country={country} />
//       </>
//       )
// }

// export default App
