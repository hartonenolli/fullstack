import { useEffect, useState } from 'react'

const Users = ({ getAllUsers }) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers()
            setUsers(users)
        }
        fetchUsers()
    }, [])
    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Users