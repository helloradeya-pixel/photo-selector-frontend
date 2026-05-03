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
  const [viewer, setViewer] = useState(null)

  // swipe
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

  // toggle select
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

  // WA sender
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

  // swipe start
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
  }

  // swipe end
  const handleTouchEnd = () => {
    if (!viewer) return

    const currentIndex = photos.findIndex(p => p.url === viewer.url)
    const touchEndX = event.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    // swipe left → next
    if (diff > 50 && currentIndex < photos.length - 1) {
      setViewer(photos[currentIndex + 1])
    }

    // swipe right → prev
    if (diff < -50 && currentIndex > 0) {
      setViewer(photos[currentIndex - 1])
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

            {/* checkbox */}
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

            {/* image */}
            <img
              src={p.url}
              loading="lazy"
              onClick={() => setViewer(p)}
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
                borderRadius: 8,
                backgroundColor: "#f3f4f6"
              }}
            />

          </div>
        ))}
      </div>

      {/* VIEWER (ZOOM + SWIPE) */}
      {viewer && (
        <div
          onClick={() => setViewer(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <img
            src={viewer.url}
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