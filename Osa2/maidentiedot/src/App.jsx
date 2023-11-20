import { useState, useEffect } from 'react'
import axios from 'axios'

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

const CountryList = ({ countryList }) => {
  if (countryList.length > 10) {
    return (
      <p>Too many maching countries, specify another filter</p>
    )
  }
  if (countryList.length > 1 && countryList.length < 10) {
    return (
      <ul>
        {countryList.map((country, i) => (
          <li key={i}>{country.name.common}</li>
        ))}
      </ul>
    )
  }
}


function App() {
  const [name, setName] = useState('')
  const [countryList, setCountryList] = useState([])
  const [countryData, setCountryData] = useState([])
  const [filteredCountryList, setFilteredCountryList] = useState([])
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (country) {
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          const filteredCountries = Object.values(response.data).filter(country =>
            country.name.common.toLowerCase().startsWith(name.toLowerCase())
          );
  
          setFilteredCountryList(prevFilteredCountryList => filteredCountries);
          setCountryList(filteredCountries);
          fetchCountryData(filteredCountries);
        })
        .catch(error => console.error('Error fetching countries:', error));
    }
  }, [country, name]);
  
  const fetchCountryData = (countryList) => {
    // if countryList lenght is 1, we can fetch the data from api/name
    if (countryList.length === 1) {
      console.log('country list has one country', countryList[0].name.common.toLowerCase());
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryList[0].name.common.toLowerCase()}`)
        .then(response => {
          // Make an array of the data
          if (countryData.length < 1) {
            setCountryData(countryData.concat(response.data))
          }
        })    
    } else {
      setCountryData([])
    }
  }

  const handleChange = (event) => {
    setName(event.target.value)
    setCountry(event.target.value)
  }
  console.log('countryData', countryData);
  return (
    <>
      <form>
        Find countries
        <input value={name} onChange={handleChange} />
      </form>
      <CountryList countryList={countryList} />
      <CountryInformation countryData={countryData} />
      </>
      )
}

export default App
