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

  const [viewerIndex, setViewerIndex] = useState(null)

  useEffect(() => {
    fetch(`${API}/project/${code}`)
      .then(res => res.json())
      .then(data => {
        setPhotos(data.photos || [])
        setAdminWA(data.admin_whatsapp || "")
        setClientName(data.name || "")
        setMax(data.max_photos || 10)
      })
  }, [code])

  // SELECT FOTO
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

  // SEND WA
  const sendWA = () => {
    if (selected.length === 0) return alert("Pilih foto dulu")

    const msg =
      `📸 Client: ${clientName}\n\n` +
      `Selected Photos:\n` +
      selected.map((p, i) => `${i + 1}. ${p.name || p.url}`).join("\n")

    let number = adminWA.replace(/[^0-9]/g, "")

    if (number.startsWith("0")) number = "62" + number.slice(1)
    if (!number.startsWith("62")) number = "62" + number

    const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>📸 PickMe Gallery</h1>

      <p>Selected: {selected.length} / {max}</p>

      <button
        onClick={sendWA}
        style={{
          padding: "10px 15px",
          marginBottom: 20,
          cursor: "pointer"
        }}
      >
        Kirim ke WhatsApp Admin
      </button>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10
        }}
      >
        {photos.map((p, i) => (
          <div key={i} style={{ position: "relative" }}>

            {/* CHECKBOX */}
            <div
              onClick={() => toggle(p)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
                width: 20,
                height: 20,
                backgroundColor: selected.includes(p) ? "#2563eb" : "white",
                border: "2px solid #2563eb",
                borderRadius: 4,
                cursor: "pointer"
              }}
            />

            {/* IMAGE */}
            <img
              src={p.url}
              loading="lazy"
              onClick={() => setViewerIndex(i)}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                cursor: "pointer",
                border: selected.includes(p)
                  ? "3px solid #2563eb"
                  : "1px solid #ddd",
                borderRadius: 8,
                backgroundColor: "#f3f4f6"
              }}
            />

          </div>
        ))}
      </div>

      {/* FULLSCREEN VIEWER */}
      {viewerIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "black",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >

          {/* CLOSE BUTTON (TOP LEFT) */}
          <button
            onClick={() => setViewerIndex(null)}
            style={{
              position: "absolute",
              top: 15,
              left: 15,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              fontSize: 16,
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              zIndex: 10
            }}
          >
            ✕
          </button>

          {/* LEFT NAV */}
          {viewerIndex > 0 && (
            <button
              onClick={() => setViewerIndex(viewerIndex - 1)}
              style={{
                position: "absolute",
                left: 20,
                color: "white",
                fontSize: 30,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              ‹
            </button>
          )}

          {/* RIGHT NAV */}
          {viewerIndex < photos.length - 1 && (
            <button
              onClick={() => setViewerIndex(viewerIndex + 1)}
              style={{
                position: "absolute",
                right: 20,
                color: "white",
                fontSize: 30,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              ›
            </button>
          )}

          {/* FULL IMAGE (BACKGROUND FEEL) */}
          <img
            src={photos[viewerIndex].url}
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "contain"
            }}
          />

        </div>
      )}

    </div>
  )
}