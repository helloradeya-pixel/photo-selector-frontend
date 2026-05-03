import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API } from "../config"

export default function Gallery() {
  const { code } = useParams()

  const [photos, setPhotos] = useState([])
  const [selected, setSelected] = useState([])
  const [adminWA, setAdminWA] = useState("")
  const [clientName, setClientName] = useState("")
  const [max, setMax] = useState(10)

  useEffect(() => {
    fetch(`${API}/project/${code}`)
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data)
        console.log("PHOTOS:", data.photos)

        setPhotos(data.photos || [])
        setAdminWA(data.admin_whatsapp || "")
        setClientName(data.name || "")
        setMax(data.max_photos || 10)
      })
  }, [code])

  const toggle = (p) => {
    if (!selected.includes(p) && selected.length >= max) {
      return alert("Limit foto tercapai")
    }

    setSelected(prev =>
      prev.includes(p)
        ? prev.filter(x => x !== p)
        : [...prev, p]
    )
  }

  const sendWA = () => {
    const msg =
      `📸 Client: ${clientName}\n\n` +
      `Selected Photos:\n` +
      selected.map((p, i) => `${i + 1}. ${p.full || p.url}`).join("\n")

    let number = adminWA.replace(/[^0-9]/g, "")

    if (number.startsWith("0")) number = "62" + number.slice(1)
    if (!number.startsWith("62")) number = "62" + number

    const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>PickMe Gallery</h1>

      <p>
        Selected: {selected.length} / {max}
      </p>

      <button onClick={sendWA} style={{ marginBottom: 20 }}>
        Kirim ke WhatsApp Admin
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10
        }}
      >
        {photos.map((p, i) => (
          <img
            key={i}
            src={p.url}
            loading="lazy"
            onClick={() => toggle(p)}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src =
                "https://placehold.co/400x400?text=No+Image"
            }}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              cursor: "pointer",
              border: selected.includes(p)
                ? "3px solid #2563eb"
                : "1px solid #ddd",
              borderRadius: 8
            }}
          />
        ))}
      </div>
    </div>
  )
}