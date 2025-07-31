import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
    }

const addPerson = (personObject) => {
    const request = axios.post(baseUrl, personObject)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const updatePerson = (id, personObject) => {
    const request = axios.put(`${baseUrl}/${id}`, personObject)
    return request.then(response => response.data)
}

export default { getAll, addPerson, deletePerson, updatePerson }