import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  const login = () => {
    if (email === "admin" && pass === "123") {
      nav("/dashboard")
    } else {
      alert("salah login")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>LOGIN</h1>

      <input placeholder="email" onChange={e => setEmail(e.target.value)} />
      <br />

      <input type="password" placeholder="password" onChange={e => setPass(e.target.value)} />
      <br />

      <button onClick={login}>Login</button>
    </div>
  )
}