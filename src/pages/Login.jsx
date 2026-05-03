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
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6"
      }}
    >
      {/* CARD */}
      <div
        style={{
          width: 320,
          padding: 25,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>
          LOGIN
        </h1>

        {/* EMAIL */}
        <input
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            outline: "none"
          }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="password"
          onChange={e => setPass(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ddd",
            outline: "none"
          }}
        />

        {/* BUTTON */}
        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 10,
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Login
        </button>
      </div>
    </div>
  )
}