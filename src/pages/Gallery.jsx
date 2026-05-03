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
  const [touchStartX, setTouchStartX] = useState(0)

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

  // SELECT TOGGLE
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

  // WHATSAPP SEND
  const sendWA = () => {
    if (selected.length === 0) {
      return alert("Pilih foto dulu")
    }

    const msg =
      `📸 Client: ${clientName}\n\n` +
      `Selected Photos:\n` +
      selected
        .map((p, i) => `${i + 1}. ${p.name || p.url}`)
        .join("\n")

    let number = adminWA.replace(/[^0-9]/g, "")

    if (number.startsWith("0")) {
      number = "62" + number.slice(1)
    }

    if (!number.startsWith("62")) {
      number = "62" + number
    }

    const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  // SWIPE START
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
  }

  // SWIPE END
  const handleTouchEnd = (e) => {
    if (viewerIndex === null) return

    const endX = e.changedTouches[0].clientX
    const diff = touchStartX - endX

    if (diff > 50 && viewerIndex < photos.length - 1) {
      setViewerIndex(viewerIndex + 1)
    }

    if (diff < -50 && viewerIndex > 0) {
      setViewerIndex(viewerIndex - 1)
    }
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>📸 PickMe Gallery</h1>

      <p>
        Selected: {selected.length} / {max}
      </p>

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
                border: viewerIndex === i
                  ? "3px solid #22c55e"
                  : selected.includes(p)
                    ? "3px solid #2563eb"
                    : "1px solid #ddd",
                borderRadius: 8,
                backgroundColor: "#f3f4f6"
              }}
            />

          </div>
        ))}
      </div>

      {/* VIEWER */}
      {viewerIndex !== null && (
        <div
          onClick={() => setViewerIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out"
          }}
        >

          {/* POSITION INDICATOR */}
          <div
            style={{
              position: "absolute",
              top: 20,
              color: "white",
              fontSize: 16,
              background: "rgba(0,0,0,0.5)",
              padding: "6px 12px",
              borderRadius: 8
            }}
          >
            {viewerIndex + 1} / {photos.length}
          </div>

          {/* SWIPE HINT */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              color: "white",
              fontSize: 12,
              opacity: 0.7
            }}
          >
            ← swipe kiri / kanan →
          </div>

          {/* IMAGE */}
          <img
            src={photos[viewerIndex].url}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: 10
            }}
            onClick={(e) => e.stopPropagation()}
          />

        </div>
      )}

    </div>
  )
}