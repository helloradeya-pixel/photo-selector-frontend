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

  return (
    <div style={{ padding: 20 }}>

      <h1>📸 PickMe Gallery</h1>
      <p>Selected: {selected.length} / {max}</p>

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
                fontSize: 14
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

          {/* DOWNLOAD (CENTER TOP) */}
          <button
            onClick={() => {
              const url = photos[viewerIndex].url
              const link = document.createElement("a")
              link.href = url
              link.download = `photo-${viewerIndex + 1}.jpg`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            style={{
              position: "absolute",
              top: 15,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#22c55e",
              border: "none",
              color: "white",
              padding: "6px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
              zIndex: 10
            }}
          >
            ⬇ Download
          </button>

          {/* LEFT */}
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

          {/* RIGHT */}
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