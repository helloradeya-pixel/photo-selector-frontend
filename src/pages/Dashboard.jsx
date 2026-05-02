import { useState } from "react"
import { API } from "../config"

export default function Dashboard() {
  const [name, setName] = useState("")
  const [wa, setWa] = useState("")
  const [link, setLink] = useState("")

  const create = async () => {
    if (!name || !wa) {
      return alert("Isi semua field dulu")
    }

    try {
      const res = await fetch(`${API}/create-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          admin_whatsapp: wa,
          max_selection: 10
        })
      })

      const data = await res.json()

      if (!res.ok) {
        return alert(data.error || "Gagal create project")
      }

      setLink(data.link)

    } catch (err) {
      console.log(err)
      alert("Backend tidak konek / CORS error")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>DASHBOARD</h1>

      <input
        placeholder="Nama client"
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        placeholder="WhatsApp admin"
        onChange={(e) => setWa(e.target.value)}
      />
      <br />

      <button onClick={create}>Generate project link</button>

      {link && (
        <div style={{ marginTop: 15 }}>
          <p>Link Gallery:</p>
          <a href={link} target="_blank">
            {link}
          </a>
        </div>
      )}
    </div>
  )
}


const create = async () => {
  const res = await fetch(`${API}/create-project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      admin_whatsapp: wa
    })
  })

  const data = await res.json()

  if (!res.ok) {
    return alert(data.error || "Gagal")
  }

  alert("Project dibuat!")
  console.log(data.link)
}