import { useState, useEffect } from 'react'
import axios from 'axios'

const FetchInformation = ({ selectedCountry, country }) => {
  const [countryData, setCountryData] = useState([])
  const [weatherData, setWeatherData] = useState([])
  const api_key = import.meta.env.VITE_SOME_KEY
// muuttujassa api_key on nyt käynnistyksessä annettu API-avaimen arvo
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${selectedCountry}`)
      .then(response => {
        // Make an array of the data
        if (countryData.length < 1) {
          setCountryData(countryData.concat(response.data))
        }
      })
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry}&appid=${api_key}`)
      .then(response => {
        // Make an array of the data
        if (weatherData.length < 1) {
          setWeatherData(weatherData.concat(response.data))
        }
      })
  }, [country])
  return (
    <CountryInformation countryData={countryData} weatherData={weatherData} />
  )
}

const CountryInformation = ({ countryData, weatherData }) => {
  console.log('weatherData', weatherData);
  if (countryData.length === 1 && weatherData.length === 1) {
    const temperatureInCelsius = weatherData[0].main.temp - 273.15;

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
        <h3>Weather in {countryData[0].capital[0]}</h3>
        <p>temperature: {temperatureInCelsius.toFixed(2)} Celsius</p>
        <img src={`http://openweathermap.org/img/w/${weatherData[0].weather[0].icon}.png`} alt="weather icon" />
        <p>wind: {weatherData[0].wind.speed} m/s</p>
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
