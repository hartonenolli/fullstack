import { useEffect, useState } from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import { Link } from 'react-router-dom'

const Users = ({ getAllUsers }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers()
      setUsers(users)
    }
    fetchUsers()
  }, [])

  const sortedUsers = [...users].sort((a, b) => b.blogs.length - a.blogs.length)

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <h2>Users</h2>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <></>
            </TableCell>
            <TableCell>Blogs created</TableCell>
          </TableRow>
          <TableRow></TableRow>
        </TableHead>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Users
