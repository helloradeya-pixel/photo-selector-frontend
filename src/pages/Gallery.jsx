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

  // TOGGLE SELECT
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

      <button onClick={sendWA} style={{ marginBottom: 20 }}>
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

            {/* CHECKBOX (GRID) */}
            <div
              onClick={() => toggle(p)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 20,
                height: 20,
                backgroundColor: selected.includes(p) ? "#2563eb" : "white",
                border: "2px solid #2563eb",
                borderRadius: 4,
                cursor: "pointer",
                zIndex: 2
              }}
            />

            {/* LAST VIEWED BADGE */}
            {viewerIndex === i && (
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  background: "#22c55e",
                  color: "white",
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4
                }}
              >
                viewed
              </div>
            )}

            <img
              src={p.url}
              onClick={() => setViewerIndex(i)}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                cursor: "pointer",
                border: selected.includes(p)
                  ? "3px solid #2563eb"
                  : viewerIndex === i
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
            alignItems: "center",
            cursor: "zoom-out"
          }}
        >

          {/* CLOSE BUTTON */}
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
              cursor: "pointer"
            }}
          >
            ✕
          </button>

          {/* CHECKBOX FULLSCREEN */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              toggle(photos[viewerIndex])
            }}
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              width: 26,
              height: 26,
              backgroundColor: selected.includes(photos[viewerIndex])
                ? "#2563eb"
                : "white",
              border: "2px solid #2563eb",
              borderRadius: 5,
              cursor: "pointer"
            }}
          />

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
}import { useEffect, useState } from "react"
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

  // TOGGLE SELECT
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

  // DOWNLOAD FOTO FULLSCREEN
  const downloadImage = () => {
    const url = photos[viewerIndex].url
    const link = document.createElement("a")
    link.href = url
    link.download = `photo-${viewerIndex + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

            {/* GREEN CHECKBOX ONLY */}
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
                fontSize: 14,
                color: selected.includes(p) ? "white" : "#22c55e"
              }}
            >
              {selected.includes(p) ? "✓" : ""}
            </div>

            {/* IMAGE */}
            <img
              src={p.url}
              onClick={() => setViewerIndex(i)}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                cursor: "pointer",
                border: selected.includes(p)
                  ? "2px solid #22c55e"
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
              cursor: "pointer"
            }}
          >
            ✕
          </button>

          {/* DOWNLOAD BUTTON (CENTER TOP) */}
          <button
            onClick={downloadImage}
            style={{
              position: "absolute",
              top: 15,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#22c55e",
              border: "none",
              color: "white",
              padding: "6px 14px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold"
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