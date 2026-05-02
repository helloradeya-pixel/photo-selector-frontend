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
        setPhotos(data.photos || [])
        setAdminWA(data.admin_whatsapp || "")
        setClientName(data.name || "")
        setMax(data.max_selection || 10)
      })
  }, [code])

  const toggle = (url) => {
    if (!selected.includes(url) && selected.length >= max) {
      return alert("Limit foto tercapai")
    }

    setSelected(prev =>
      prev.includes(url)
        ? prev.filter(x => x !== url)
        : [...prev, url]
    )
  }

  const sendWA = () => {
  const msg =
    `Client: ${clientName}\n` +
    `Selected Photos:\n` +
    selected.map(p => `- ${p}`).join("\n")

  // 🔥 NORMALISASI NOMOR
  let cleanNumber = adminWA.replace(/[^0-9]/g, "")

  // kalau dia pakai 0 di depan (Indonesia)
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.slice(1)
  }

  // kalau belum pakai 62
  if (!cleanNumber.startsWith("62")) {
    cleanNumber = "62" + cleanNumber
  }

  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`

  window.open(url, "_blank")
}

  return (
    <div style={{ padding: 20 }}>
      <h1>PickMe Gallery</h1>

      <p>
        Selected: {selected.length} / {max}
      </p>

      <button onClick={sendWA}>
        Kirim ke Admin WhatsApp
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginTop: 20
        }}
      >
        {photos.map((p, i) => (
          <img
            key={i}
            src={p.url}
            onClick={() => toggle(p.url)}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              cursor: "pointer",
              border: selected.includes(p.url)
                ? "3px solid blue"
                : "1px solid #ddd"
            }}
          />
        ))}
      </div>
    </div>
  )
}