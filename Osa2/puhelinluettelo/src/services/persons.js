import axios from "axios"
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addNew = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const updatePerson = (id, newObject) => {
    return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .then(returnedPerson => {
        console.log('success', returnedPerson);
        return returnedPerson
    })
    .catch(error => {
        console.log('fail')
        throw error
    })
}

export default { getAll, addNew, deletePerson, updatePerson }