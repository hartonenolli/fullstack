import { useState } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client/react'


const LoginForm = ({ show, setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setLocalToken] = useState(localStorage.getItem('library-user-token'))

    const [login] = useMutation(LOGIN)
    if (!show) {
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const userData = await login({ variables: { username, password } })
            const tokenValue = userData.data.login.value
            setToken(tokenValue)
            localStorage.setItem('library-user-token', tokenValue)
            setLocalToken(tokenValue)
            setUsername('')
            setPassword('')
        } catch (err) {
            console.error('Login failed:', err)
        }
    }

    const handleLogout = () => {
        setToken(null)
        localStorage.removeItem('library-user-token')
        setLocalToken(null)
    }

    if (token) {
        return (
            <div className="login-form">
                <p>You are logged in</p>
                <button onClick={handleLogout}>Log out</button>
            </div>
        )
    }

    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            Not registered? <a href="/register">Create an account</a>
        </div>
    )
}

export default LoginForm
