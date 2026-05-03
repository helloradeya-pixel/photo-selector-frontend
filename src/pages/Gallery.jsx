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
    if (selected.length === 0) {
      return alert("Pilih foto dulu")
    }

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

      <p style={{ marginBottom: 10 }}>
        Selected: {selected.length} / {max}
      </p>

      {/* WHATSAPP BUTTON */}
      <button
        onClick={sendWA}
        style={{
          marginBottom: 15,
          padding: "10px 14px",
          background: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        📤 Kirim ke WhatsApp
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

            {/* GREEN CHECKBOX */}
            <div
              onClick={() => toggle(p)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 22,
                height: 22,
                backgroundColor: selected.includes(p) ? "#22c55e" : "white",
                border: "2px solid #22c55e",
                borderRadius: 5,
                cursor: "pointer",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: selected.includes(p) ? "white" : "#22c55e",
                fontSize: 14,
                fontWeight: "bold"
              }}
            >
              {selected.includes(p) ? "✓" : ""}
            </div>

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
                  ? "3px solid #22c55e"
                  : "1px solid #ddd",
                borderRadius: 8
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
            background: "black",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >

          {/* CLOSE */}
          <button
            onClick={() => setViewerIndex(null)}
            style={{
              position: "absolute",
              top: 15,
              left: 15,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              zIndex: 10
            }}
          >
            ✕
          </button>

          {/* SELECT TOGGLE */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              toggle(photos[viewerIndex])
            }}
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              width: 28,
              height: 28,
              backgroundColor: selected.includes(photos[viewerIndex])
                ? "#22c55e"
                : "white",
              border: "2px solid #22c55e",
              borderRadius: 6,
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: selected.includes(photos[viewerIndex]) ? "white" : "#22c55e",
              fontWeight: "bold"
            }}
          >
            {selected.includes(photos[viewerIndex]) ? "✓" : ""}
          </div>

          {/* PREV */}
          {viewerIndex > 0 && (
            <button
              onClick={() => setViewerIndex(viewerIndex - 1)}
              style={{
                position: "absolute",
                left: 20,
                fontSize: 30,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              ‹
            </button>
          )}

          {/* NEXT */}
          {viewerIndex < photos.length - 1 && (
            <button
              onClick={() => setViewerIndex(viewerIndex + 1)}
              style={{
                position: "absolute",
                right: 20,
                fontSize: 30,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              ›
            </button>
          )}

          {/* IMAGE */}
          <img
            src={photos[viewerIndex].url}
            style={{
              maxWidth: "100vw",
              maxHeight: "100vh",
              objectFit: "contain"
            }}
          />

        </div>
      )}

    </div>
  )
}